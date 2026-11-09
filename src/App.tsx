/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { XRCanvas } from './components/XRCanvas';
import { ControlDock } from './components/ControlDock';
import { TopHeader } from './components/TopHeader';
import { QuestGuideModal } from './components/QuestGuideModal';
import { MuralSettings, PresetImage } from './types';
import { PRESET_IMAGES } from './utils/sampleImages';

const DEFAULT_SETTINGS: MuralSettings = {
  lineArtMode: 'edges',
  opacity: 0.85,
  edgeThreshold: 0.12,
  edgeThickness: 2.0,
  lineColor: '#00e5ff', // Neon Cyan: optimal for Quest 1 & 2/3 passthrough contrast
  invertColor: false,
  contrast: 1.4,
  brightness: 0.0,
  removeWhiteBg: true,

  scaleMeters: 2.2, // 2.2 meters wide mural (approx 7.2 ft)
  aspectRatio: 4 / 3,
  distanceMeters: 0,
  heightMeters: 1.8,
  pitchDeg: 0,
  yawDeg: 0,
  rollDeg: 0,
  flipH: false,
  flipV: false,
  locked: false,

  cornerPinningEnabled: false,
  cornerPins: {
    topLeft: [0, 0],
    topRight: [0, 0],
    bottomRight: [0, 0],
    bottomLeft: [0, 0],
  },

  gridMode: 'none',
  gridOpacity: 0.45,
  gridColor: '#38bdf8',
  gridDivisions: 10,

  blinkActive: false,
  previewBackground: 'room_simulator',
  showTapeMarkers: true,
  showDimensionBadge: true,
};

export default function App() {
  const [settings, setSettings] = useState<MuralSettings>(DEFAULT_SETTINGS);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [triggerXR, setTriggerXR] = useState<number>(0);
  const [xrStatus, setXrStatus] = useState<{ isSupported: boolean; isPresenting: boolean }>({
    isSupported: false,
    isPresenting: false,
  });

  // Handle Preset selection
  const handleSelectPreset = useCallback((preset: PresetImage) => {
    setCurrentImageUrl(preset.url);
    setSettings((prev) => ({
      ...prev,
      lineArtMode: preset.defaultMode,
      aspectRatio: preset.aspectRatio,
      scaleMeters: preset.recommendedWidthM,
    }));
  }, []);

  // Handle Image Upload (from Quest Pictures folder or local drive)
  const handleUploadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setCurrentImageUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Reset mural pose and level on wall
  const handleResetPose = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      heightMeters: 1.8,
      pitchDeg: 0,
      yawDeg: 0,
      rollDeg: 0,
      cornerPins: {
        topLeft: [0, 0],
        topRight: [0, 0],
        bottomRight: [0, 0],
        bottomLeft: [0, 0],
      },
    }));
  }, []);

  // Launch WebXR session
  const handleEnterXR = useCallback(() => {
    setTriggerXR((prev) => prev + 1);
  }, []);

  // Keyboard shortcuts (convenient when working on Quest with paired Bluetooth keyboard or desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in text inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'l' || e.key === 'L') {
        setSettings((prev) => ({ ...prev, locked: !prev.locked }));
      } else if (e.key === 'b' || e.key === ' ' || e.key === 'B') {
        setSettings((prev) => ({ ...prev, blinkActive: true }));
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetPose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === ' ' || e.key === 'B') {
        setSettings((prev) => ({ ...prev, blinkActive: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleResetPose]);

  // Drag and drop image file directly into window
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleUploadImage(file);
      }
    };
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleUploadImage]);

  // Clipboard paste support (paste image from web or drawing app)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleUploadImage(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleUploadImage]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* 3D WebXR & Mixed Reality Scene Canvas */}
      <XRCanvas
        settings={settings}
        imageUrl={currentImageUrl}
        onUpdateSettings={setSettings}
        onXRStatusChange={setXrStatus}
        triggerXRRequest={triggerXR}
      />

      {/* Top Header & Status Bar */}
      <TopHeader
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetPose={handleResetPose}
      />

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <ControlDock
        settings={settings}
        onUpdateSettings={setSettings}
        onSelectPreset={handleSelectPreset}
        onUploadImage={handleUploadImage}
        onEnterXR={handleEnterXR}
        isXRSupported={xrStatus.isSupported}
        onOpenQuestGuide={() => setIsGuideOpen(true)}
      />

      {/* Meta Quest Setup & Controller Guide Modal */}
      <QuestGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onEnterXR={handleEnterXR}
      />
    </div>
  );
}
