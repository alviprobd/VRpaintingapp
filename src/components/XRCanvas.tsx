import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MuralSettings } from '../types';
import { MuralVertexShader, MuralFragmentShader, getShaderModeNumber } from '../utils/muralShader';
import { createWarpedPlaneGeometry, updateGeometryCornerPins } from '../utils/cornerPinGeometry';

// Reusable math scratchpads to prevent garbage collection inside render loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _quatA = new THREE.Quaternion();
const _raycaster = new THREE.Raycaster();
const _tempMatrix = new THREE.Matrix4();

interface XRCanvasProps {
  settings: MuralSettings;
  imageUrl: string;
  onUpdateSettings: (updater: (prev: MuralSettings) => MuralSettings) => void;
  onXRStatusChange?: (status: { isSupported: boolean; isPresenting: boolean }) => void;
  triggerXRRequest?: number; // incremented when user clicks "Enter Quest WebXR"
}

export const XRCanvas: React.FC<XRCanvasProps> = ({
  settings,
  imageUrl,
  onUpdateSettings,
  onXRStatusChange,
  triggerXRRequest,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [xrSupported, setXrSupported] = useState<boolean>(false);
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [draggedPin, setDraggedPin] = useState<string | null>(null);

  // References to keep inside WebGL lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const muralMeshRef = useRef<THREE.Mesh | null>(null);
  const muralMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const muralGeometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const studioGroupRef = useRef<THREE.Group | null>(null);
  const pinHandlesGroupRef = useRef<THREE.Group | null>(null);
  const dimensionBadgeRef = useRef<THREE.Sprite | null>(null);
  const cameraTextureRef = useRef<THREE.VideoTexture | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  // Keep settings ref so XR tick loop can access latest state without re-creating loop
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Controller interaction state
  const controllersRef = useRef<THREE.Group[]>([]);
  const isDraggingMuralRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Check WebXR availability on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setXrSupported(supported);
        onXRStatusChange?.({ isSupported: supported, isPresenting: false });
      }).catch(() => {
        setXrSupported(false);
      });
    }
  }, [onXRStatusChange]);

  // Handle Passthrough Camera Video stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (settings.previewBackground === 'passthrough_cam') {
      navigator.mediaDevices?.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      }).then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
          setIsCameraActive(true);
        }
      }).catch(() => {
        setIsCameraActive(false);
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [settings.previewBackground]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 50);
    camera.position.set(0, 1.5, 2.2); // Typical eye-level view (1.5m tall, 2.2m from wall)
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcfd8dc, 0.6);
    rimLight.position.set(-2, 2, -1);
    scene.add(rimLight);

    // Simulated Wall & Floor Environment (for desktop / non-AR testing)
    const studioGroup = new THREE.Group();
    studioGroupRef.current = studioGroup;
    scene.add(studioGroup);

    // Wall Texture (Procedural Clean White Stucco / Drywall)
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 512;
    wallCanvas.height = 512;
    const wCtx = wallCanvas.getContext('2d')!;
    wCtx.fillStyle = '#e2e8f0';
    wCtx.fillRect(0, 0, 512, 512);
    // Subtle stucco stipple
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = 220 + Math.random() * 30;
      wCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
      wCtx.fillRect(x, y, 1.5, 1.5);
    }
    const wallTexture = new THREE.CanvasTexture(wallCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 3);

    const wallGeom = new THREE.PlaneGeometry(12, 6);
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.9,
      metalness: 0.05,
    });
    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallMesh.position.set(0, 2, 0); // Wall is at Z = 0
    studioGroup.add(wallMesh);

    // Studio Floor & Baseboard
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 256;
    floorCanvas.height = 256;
    const fCtx = floorCanvas.getContext('2d')!;
    fCtx.fillStyle = '#475569';
    fCtx.fillRect(0, 0, 256, 256);
    // Concrete planks
    fCtx.strokeStyle = '#334155';
    fCtx.lineWidth = 2;
    fCtx.strokeRect(0, 0, 256, 256);
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);

    const floorGeom = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 5);
    studioGroup.add(floorMesh);

    // Wood Baseboard Trim
    const baseboardGeom = new THREE.BoxGeometry(12, 0.12, 0.02);
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const baseboard = new THREE.Mesh(baseboardGeom, baseboardMat);
    baseboard.position.set(0, 0.06, 0.01);
    studioGroup.add(baseboard);

    // Physical Wall Painter's Tape Marker guides (Simulates artist taping corners on wall)
    const tapeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
    const tape1 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.04), tapeMat);
    tape1.position.set(-1.1, 2.3, 0.005);
    studioGroup.add(tape1);
    const tape2 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.04), tapeMat);
    tape2.position.set(1.1, 2.3, 0.005);
    studioGroup.add(tape2);

    // Initial Default Mural Image Texture
    const loader = new THREE.TextureLoader();
    const initTexture = loader.load(imageUrl, () => {
      renderer.render(scene, camera);
    });
    initTexture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = initTexture;

    // Mural Shader Material
    const muralMat = new THREE.ShaderMaterial({
      vertexShader: MuralVertexShader,
      fragmentShader: MuralFragmentShader,
      uniforms: {
        uTexture: { value: initTexture },
        uResolution: { value: new THREE.Vector2(1200, 900) },
        uMode: { value: getShaderModeNumber(settings.lineArtMode) },
        uOpacity: { value: settings.opacity },
        uEdgeThreshold: { value: settings.edgeThreshold },
        uEdgeThickness: { value: settings.edgeThickness },
        uLineColor: { value: new THREE.Color(settings.lineColor) },
        uInvertColor: { value: settings.invertColor },
        uContrast: { value: settings.contrast },
        uBrightness: { value: settings.brightness },
        uRemoveWhiteBg: { value: settings.removeWhiteBg },
        uFlipH: { value: settings.flipH },
        uFlipV: { value: settings.flipV },
        uGridMode: { value: settings.gridMode === 'none' ? 0 : settings.gridMode === 'metric' ? 1 : settings.gridMode === 'thirds' ? 2 : 3 },
        uGridOpacity: { value: settings.gridOpacity },
        uGridColor: { value: new THREE.Color(settings.gridColor) },
        uGridDivisions: { value: settings.gridDivisions },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    muralMaterialRef.current = muralMat;

    // Warped Plane Geometry for Keystone Pinning
    const muralGeom = createWarpedPlaneGeometry(
      settings.scaleMeters,
      settings.scaleMeters / settings.aspectRatio,
      32,
      32
    );
    muralGeometryRef.current = muralGeom;

    const muralMesh = new THREE.Mesh(muralGeom, muralMat);
    muralMesh.position.set(0, settings.heightMeters, 0.02); // Slightly offset from wall surface to prevent z-fighting
    muralMeshRef.current = muralMesh;
    scene.add(muralMesh);

    // Interactive 4-Corner Pinning Handles Group
    const pinGroup = new THREE.Group();
    pinHandlesGroupRef.current = pinGroup;
    scene.add(pinGroup);

    // Corner pin sphere handles
    const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, depthTest: false });

    ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].forEach((name) => {
      const pinMesh = new THREE.Mesh(pinGeo, pinMat.clone());
      pinMesh.name = name;
      pinMesh.renderOrder = 999;
      pinGroup.add(pinMesh);
    });

    // Real-world Dimensions Badge (3D Sprite)
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 128;
    const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
    const badgeMat = new THREE.SpriteMaterial({ map: badgeTexture, transparent: true, depthTest: false });
    const badgeSprite = new THREE.Sprite(badgeMat);
    badgeSprite.scale.set(0.6, 0.15, 1);
    dimensionBadgeRef.current = badgeSprite;
    scene.add(badgeSprite);

    // Setup WebXR Controllers (Oculus Quest 1 / Quest 2 / Quest 3 Touch)
    const controllers: THREE.Group[] = [];
    for (let i = 0; i < 2; i++) {
      const controller = renderer.xr.getController(i);
      
      // Ray pointer line
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -3),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: i === 0 ? 0x00e5ff : 0xec4899,
        transparent: true,
        opacity: 0.6,
      });
      const laser = new THREE.Line(lineGeom, lineMat);
      controller.add(laser);

      // Controller Target Ring
      const ringGeom = new THREE.RingGeometry(0.02, 0.025, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(0, 0, -3);
      controller.add(ring);

      // Event handlers for Quest Touch controllers
      controller.addEventListener('selectstart', () => {
        if (settingsRef.current.locked) return;
        // Cast ray from controller
        _tempMatrix.identity().extractRotation(controller.matrixWorld);
        _raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        _raycaster.ray.direction.set(0, 0, -1).applyMatrix4(_tempMatrix);

        if (muralMeshRef.current) {
          const intersects = _raycaster.intersectObject(muralMeshRef.current);
          if (intersects.length > 0) {
            isDraggingMuralRef.current = true;
            dragOffsetRef.current.copy(muralMeshRef.current.position).sub(intersects[0].point);
          }
        }
      });

      controller.addEventListener('selectend', () => {
        isDraggingMuralRef.current = false;
      });

      scene.add(controller);
      controllers.push(controller);
    }
    controllersRef.current = controllers;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Orbit/Look interaction for desktop / 2D screen
    let isPointerDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Ignore if clicking on UI overlay
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isPointerDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // Check corner pin click
      if (settingsRef.current.cornerPinningEnabled && pinHandlesGroupRef.current && cameraRef.current) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        _raycaster.setFromCamera(mouse, cameraRef.current);
        const pinHits = _raycaster.intersectObjects(pinHandlesGroupRef.current.children);
        if (pinHits.length > 0) {
          setDraggedPin(pinHits[0].object.name);
          return;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // If dragging a corner pin
      if (draggedPin && settingsRef.current.cornerPinningEnabled) {
        const sensitivity = 0.002;
        onUpdateSettings((prev) => {
          const pins = { ...prev.cornerPins };
          const key = draggedPin as keyof typeof pins;
          pins[key] = [
            pins[key][0] + dx * sensitivity,
            pins[key][1] - dy * sensitivity,
          ];
          return { ...prev, cornerPins: pins };
        });
        return;
      }

      // If mural unlocked and holding right-click or alt-click: move mural on wall
      if (e.buttons === 2 || e.altKey) {
        if (!settingsRef.current.locked) {
          const moveSens = 0.003;
          onUpdateSettings((prev) => ({
            ...prev,
            heightMeters: Math.max(0.2, prev.heightMeters - dy * moveSens),
          }));
        }
        return;
      }

      // Standard view orbit (look around room)
      if (cameraRef.current && !renderer.xr.isPresenting) {
        const rotSens = 0.004;
        cameraRef.current.rotation.y -= dx * rotSens;
        cameraRef.current.rotation.x = THREE.MathUtils.clamp(
          cameraRef.current.rotation.x - dy * rotSens,
          -Math.PI / 4,
          Math.PI / 4
        );
      }
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setDraggedPin(null);
    };

    const onWheel = (e: WheelEvent) => {
      // Zoom camera or scale image if ctrl key
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        onUpdateSettings((prev) => ({
          ...prev,
          scaleMeters: Math.max(0.4, Math.min(8.0, prev.scaleMeters + delta)),
        }));
      } else if (cameraRef.current && !renderer.xr.isPresenting) {
        cameraRef.current.position.z = THREE.MathUtils.clamp(
          cameraRef.current.position.z + e.deltaY * 0.002,
          0.8,
          5.0
        );
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    // Main WebXR + Standard Animation Loop
    let clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      // Read Quest Controller input if in WebXR session
      if (renderer.xr.isPresenting) {
        const session = renderer.xr.getSession();
        if (session && session.inputSources) {
          for (const source of session.inputSources) {
            if (source.gamepad && source.gamepad.axes) {
              const [thumbX, thumbY] = source.gamepad.axes;
              // Push / Pull or Scale via Quest Thumbstick
              if (Math.abs(thumbY) > 0.15 && !settingsRef.current.locked) {
                const scaleDelta = -thumbY * delta * 0.6;
                onUpdateSettings((prev) => ({
                  ...prev,
                  scaleMeters: Math.max(0.3, Math.min(10.0, prev.scaleMeters + scaleDelta)),
                }));
              }
            }
          }
        }
      }

      // Hide or show room simulator based on XR state or previewBackground setting
      if (studioGroupRef.current) {
        const inAR = renderer.xr.isPresenting;
        const showStudio = !inAR && settingsRef.current.previewBackground === 'room_simulator';
        studioGroupRef.current.visible = showStudio;
      }

      // Blink effect: if blinkActive is true, temporarily hide the mural to check painted lines
      if (muralMeshRef.current) {
        muralMeshRef.current.visible = !settingsRef.current.blinkActive;
      }

      // Update dimension badge position
      if (dimensionBadgeRef.current && muralMeshRef.current) {
        const widthM = settingsRef.current.scaleMeters;
        const heightM = widthM / settingsRef.current.aspectRatio;
        dimensionBadgeRef.current.position.set(
          muralMeshRef.current.position.x,
          muralMeshRef.current.position.y + heightM / 2 + 0.15,
          muralMeshRef.current.position.z + 0.02
        );
        dimensionBadgeRef.current.visible = settingsRef.current.showDimensionBadge && !settingsRef.current.blinkActive;
      }

      renderer.render(scene, camera);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Mural Settings & Image URL to Three.js Materials, Geometries, and Uniforms
  useEffect(() => {
    if (!muralMaterialRef.current || !muralMeshRef.current) return;

    const widthM = settings.scaleMeters;
    const heightM = widthM / settings.aspectRatio;

    // Update geometry dimensions if changed
    if (muralGeometryRef.current) {
      muralGeometryRef.current.dispose();
      const newGeom = createWarpedPlaneGeometry(widthM, heightM, 32, 32);
      updateGeometryCornerPins(
        newGeom,
        widthM,
        heightM,
        settings.cornerPins,
        settings.cornerPinningEnabled
      );
      muralGeometryRef.current = newGeom;
      muralMeshRef.current.geometry = newGeom;
    }

    // Update position and rotation
    muralMeshRef.current.position.set(
      0,
      settings.heightMeters,
      settings.distanceMeters !== undefined ? -settings.distanceMeters : 0.02
    );
    muralMeshRef.current.rotation.set(
      THREE.MathUtils.degToRad(settings.pitchDeg),
      THREE.MathUtils.degToRad(settings.yawDeg),
      THREE.MathUtils.degToRad(settings.rollDeg)
    );

    // Update Uniforms
    const uniforms = muralMaterialRef.current.uniforms;
    uniforms.uMode.value = getShaderModeNumber(settings.lineArtMode);
    uniforms.uOpacity.value = settings.opacity;
    uniforms.uEdgeThreshold.value = settings.edgeThreshold;
    uniforms.uEdgeThickness.value = settings.edgeThickness;
    uniforms.uLineColor.value.set(settings.lineColor);
    uniforms.uInvertColor.value = settings.invertColor;
    uniforms.uContrast.value = settings.contrast;
    uniforms.uBrightness.value = settings.brightness;
    uniforms.uRemoveWhiteBg.value = settings.removeWhiteBg;
    uniforms.uFlipH.value = settings.flipH;
    uniforms.uFlipV.value = settings.flipV;
    uniforms.uGridMode.value = settings.gridMode === 'none' ? 0 : settings.gridMode === 'metric' ? 1 : settings.gridMode === 'thirds' ? 2 : 3;
    uniforms.uGridOpacity.value = settings.gridOpacity;
    uniforms.uGridColor.value.set(settings.gridColor);
    uniforms.uGridDivisions.value = settings.gridDivisions;

    // Update Corner Pin handles positions
    if (pinHandlesGroupRef.current) {
      pinHandlesGroupRef.current.visible = settings.cornerPinningEnabled;
      if (settings.cornerPinningEnabled) {
        const halfW = widthM / 2;
        const halfH = heightM / 2;
        const pos = muralMeshRef.current.position;

        const tlObj = pinHandlesGroupRef.current.getObjectByName('topLeft');
        if (tlObj) tlObj.position.set(pos.x - halfW + settings.cornerPins.topLeft[0] * halfW, pos.y + halfH + settings.cornerPins.topLeft[1] * halfH, pos.z + 0.03);

        const trObj = pinHandlesGroupRef.current.getObjectByName('topRight');
        if (trObj) trObj.position.set(pos.x + halfW + settings.cornerPins.topRight[0] * halfW, pos.y + halfH + settings.cornerPins.topRight[1] * halfH, pos.z + 0.03);

        const brObj = pinHandlesGroupRef.current.getObjectByName('bottomRight');
        if (brObj) brObj.position.set(pos.x + halfW + settings.cornerPins.bottomRight[0] * halfW, pos.y - halfH + settings.cornerPins.bottomRight[1] * halfH, pos.z + 0.03);

        const blObj = pinHandlesGroupRef.current.getObjectByName('bottomLeft');
        if (blObj) blObj.position.set(pos.x - halfW + settings.cornerPins.bottomLeft[0] * halfW, pos.y - halfH + settings.cornerPins.bottomLeft[1] * halfH, pos.z + 0.03);
      }
    }

    // Update Dimension Badge texture
    if (dimensionBadgeRef.current) {
      const sprite = dimensionBadgeRef.current;
      const texture = sprite.material.map as THREE.CanvasTexture;
      if (texture && texture.image) {
        const canvas = texture.image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Pill background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 24);
        ctx.fill();
        ctx.stroke();

        // Convert to feet & inches
        const wFt = (widthM * 3.28084).toFixed(1);
        const hFt = (heightM * 3.28084).toFixed(1);

        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${widthM.toFixed(2)}m × ${heightM.toFixed(2)}m  (${wFt}' × ${hFt}')`, canvas.width / 2, canvas.height / 2);

        texture.needsUpdate = true;
      }
    }
  }, [settings]);

  // Load new image whenever imageUrl changes
  useEffect(() => {
    if (!muralMaterialRef.current || !imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      textureRef.current = tex;

      if (muralMaterialRef.current) {
        muralMaterialRef.current.uniforms.uTexture.value = tex;
        muralMaterialRef.current.uniforms.uResolution.value.set(img.width || 1200, img.height || 900);
      }

      // Automatically update aspect ratio
      const naturalAspect = img.width && img.height ? img.width / img.height : 1.33;
      onUpdateSettings((prev) => ({
        ...prev,
        aspectRatio: naturalAspect,
      }));
    };
    img.src = imageUrl;
  }, [imageUrl, onUpdateSettings]);

  // Handle Trigger XR Request from outside
  useEffect(() => {
    if (!triggerXRRequest || !rendererRef.current) return;

    const startXRSession = async () => {
      if (typeof navigator === 'undefined' || !navigator.xr) return;
      try {
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['local-floor'],
          optionalFeatures: ['hit-test', 'hand-tracking'],
        });

        await rendererRef.current?.xr.setSession(session);
        setIsPresenting(true);
        onXRStatusChange?.({ isSupported: true, isPresenting: true });

        session.addEventListener('end', () => {
          setIsPresenting(false);
          onXRStatusChange?.({ isSupported: true, isPresenting: false });
        });
      } catch (err) {
        console.warn('Could not launch immersive-ar session, trying immersive-vr fallback:', err);
        try {
          const vrSession = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor'],
          });
          await rendererRef.current?.xr.setSession(vrSession);
          setIsPresenting(true);
          onXRStatusChange?.({ isSupported: true, isPresenting: true });
          vrSession.addEventListener('end', () => {
            setIsPresenting(false);
            onXRStatusChange?.({ isSupported: true, isPresenting: false });
          });
        } catch (vrErr) {
          console.error('WebXR session failed:', vrErr);
        }
      }
    };

    startXRSession();
  }, [triggerXRRequest, onXRStatusChange]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      {/* Real-world Camera Passthrough video background (used when previewBackground === 'passthrough_cam') */}
      {settings.previewBackground === 'passthrough_cam' && (
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full" />

      {/* Meta Quest Controller / Interaction Hints */}
      {isPresenting && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-slate-900/90 border border-cyan-500/40 rounded-full text-xs text-cyan-300 font-mono shadow-xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Meta Quest Passthrough Active</span>
          <span className="text-slate-400">•</span>
          <span>Point & Grab with Trigger to Move</span>
          <span className="text-slate-400">•</span>
          <span>Thumbstick to Scale</span>
        </div>
      )}
    </div>
  );
};
