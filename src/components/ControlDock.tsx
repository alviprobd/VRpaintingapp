import React, { useState } from 'react';
import { 
  Sliders, 
  Move, 
  Grid, 
  Image as ImageIcon, 
  HelpCircle, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  FlipHorizontal, 
  Upload, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MuralSettings, LineArtMode, GridMode, PresetImage } from '../types';
import { PRESET_IMAGES } from '../utils/sampleImages';

interface ControlDockProps {
  settings: MuralSettings;
  onUpdateSettings: (updater: (prev: MuralSettings) => MuralSettings) => void;
  onSelectPreset: (preset: PresetImage) => void;
  onUploadImage: (file: File) => void;
  onEnterXR: () => void;
  isXRSupported: boolean;
  onOpenQuestGuide: () => void;
}

type TabKey = 'outline' | 'transform' | 'grid' | 'presets' | 'environment';

const LINE_COLOR_SWATCHES = [
  { name: 'Cyan Neon', hex: '#00e5ff' },
  { name: 'Acid Green', hex: '#39ff14' },
  { name: 'Hot Pink', hex: '#ff007f' },
  { name: 'Chalk White', hex: '#ffffff' },
  { name: 'Charcoal Black', hex: '#0f172a' },
  { name: 'Signal Amber', hex: '#fbbf24' },
  { name: 'Electric Violet', hex: '#a855f7' },
];

export const ControlDock: React.FC<ControlDockProps> = ({
  settings,
  onUpdateSettings,
  onSelectPreset,
  onUploadImage,
  onEnterXR,
  isXRSupported,
  onOpenQuestGuide,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('outline');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const currentHeightM = (settings.scaleMeters / settings.aspectRatio).toFixed(2);
  const widthFt = (settings.scaleMeters * 3.28084).toFixed(1);
  const heightFt = (Number(currentHeightM) * 3.28084).toFixed(1);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-4xl select-none transition-all duration-300">
      {/* Collapse / Expand Toggle Tab */}
      <div className="flex justify-center -mb-[1px]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-t-xl border-t border-x border-slate-700/80 shadow-lg cursor-pointer transition-colors"
          title="Toggle Zen Mode / Hide HUD"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hide Controls (Zen Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      {!isCollapsed && (
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
          {/* Top Quick Status Bar & Tab Switcher */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-950/80 border-b border-slate-800 gap-2 overflow-x-auto">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('outline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'outline'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Outline & Filters</span>
              </button>

              <button
                onClick={() => setActiveTab('transform')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'transform'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>Scale & Keystone Pins</span>
              </button>

              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Mural Grid & Tools</span>
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'presets'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Presets & Upload</span>
              </button>

              <button
                onClick={() => setActiveTab('environment')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'environment'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>View & Quest AR</span>
              </button>
            </div>

            {/* Quick Action Badges (Lock, Blink Check, Enter XR) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Lock to Wall Plane Button */}
              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, locked: !p.locked }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  settings.locked
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                title={settings.locked ? 'Unlock mural movement' : 'Lock mural in 3D world space'}
              >
                {settings.locked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unlocked</span>
                  </>
                )}
              </button>

              {/* Painter's Quick Check / Blink Button */}
              <button
                onMouseDown={() => onUpdateSettings((p) => ({ ...p, blinkActive: true }))}
                onMouseUp={() => onUpdateSettings((p) => ({ ...p, blinkActive: false }))}
                onTouchStart={() => onUpdateSettings((p) => ({ ...p, blinkActive: true }))}
                onTouchEnd={() => onUpdateSettings((p) => ({ ...p, blinkActive: false }))}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:bg-cyan-500/20 active:text-cyan-300 transition-colors"
                title="Hold to temporarily hide template projection to inspect your painted brushstrokes on the wall"
              >
                {settings.blinkActive ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="hidden sm:inline">Check Paint</span>
              </button>

              {/* Enter Meta Quest WebXR AR Button */}
              <button
                onClick={onEnterXR}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                title="Launch WebXR immersive passthrough session for Meta Quest"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Enter Quest AR</span>
              </button>

              {/* Help & Quest instructions */}
              <button
                onClick={onOpenQuestGuide}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Meta Quest 1 / 2 / 3 Setup Instructions"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Content Panes */}
          <div className="p-3 sm:p-4 max-h-56 sm:max-h-64 overflow-y-auto">
            {/* TAB 1: OUTLINE & FILTERS */}
            {activeTab === 'outline' && (
              <div className="space-y-3">
                {/* Mode Selector Buttons */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mural Outline Mode (Real-Time Edge Detection)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'edges', label: 'Sobel Outline', desc: 'Clean vector-like contours' },
                      { id: 'inverted_edges', label: 'Neon Outline', desc: 'Glowing lines for dark walls' },
                      { id: 'transparent_art', label: 'Ink Only', desc: 'Paper becomes transparent' },
                      { id: 'stencil', label: 'Wall Stencil', desc: 'Binarized high-contrast' },
                      { id: 'original', label: 'Full Color', desc: 'Original artwork color' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => onUpdateSettings((p) => ({ ...p, lineArtMode: mode.id as LineArtMode }))}
                        className={`px-2.5 py-2 rounded-xl text-left border transition-all ${
                          settings.lineArtMode === mode.id
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-semibold">{mode.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatches & Quick Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Line Tint Swatches */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Outline Stroke Color
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {LINE_COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.hex}
                          onClick={() => onUpdateSettings((p) => ({ ...p, lineColor: swatch.hex }))}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            settings.lineColor.toLowerCase() === swatch.hex.toLowerCase()
                              ? 'scale-110 border-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400'
                              : 'border-slate-700 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                        />
                      ))}
                      {/* Custom Color Input */}
                      <input
                        type="color"
                        value={settings.lineColor}
                        onChange={(e) => onUpdateSettings((p) => ({ ...p, lineColor: e.target.value }))}
                        className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 cursor-pointer bg-transparent"
                        title="Pick custom color"
                      />
                    </div>
                  </div>

                  {/* Sliders: Opacity & Edge Sensitivity */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Transparency / Opacity</span>
                        <span className="font-mono text-cyan-400">{Math.round(settings.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={settings.opacity}
                        onChange={(e) => onUpdateSettings((p) => ({ ...p, opacity: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Outline Sensitivity / Threshold</span>
                        <span className="font-mono text-cyan-400">{(settings.edgeThreshold * 10).toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.02"
                        max="0.4"
                        step="0.02"
                        value={settings.edgeThreshold}
                        onChange={(e) => onUpdateSettings((p) => ({ ...p, edgeThreshold: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Extra Outline Tuning Toggles */}
                <div className="flex items-center gap-3 pt-1 border-t border-slate-800 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={settings.removeWhiteBg}
                      onChange={(e) => onUpdateSettings((p) => ({ ...p, removeWhiteBg: e.target.checked }))}
                      className="rounded accent-cyan-400"
                    />
                    <span>Cutout Paper Background</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={settings.invertColor}
                      onChange={(e) => onUpdateSettings((p) => ({ ...p, invertColor: e.target.checked }))}
                      className="rounded accent-cyan-400"
                    />
                    <span>Invert Light / Dark</span>
                  </label>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-slate-400">Stroke Width:</span>
                    {[1, 2, 3, 4].map((width) => (
                      <button
                        key={width}
                        onClick={() => onUpdateSettings((p) => ({ ...p, edgeThickness: width }))}
                        className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                          settings.edgeThickness === width
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {width}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCALE, WALL & KEYSTONE PINS */}
            {activeTab === 'transform' && (
              <div className="space-y-3">
                {/* Physical Mural Sizing in Meters & Feet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>Real-World Physical Width</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {settings.scaleMeters.toFixed(2)} m ({widthFt} ft)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={settings.scaleMeters}
                      onChange={(e) => onUpdateSettings((p) => ({ ...p, scaleMeters: parseFloat(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />

                    {/* Quick Scale Presets for Murals */}
                    <div className="flex gap-1.5">
                      {[1.2, 1.8, 2.4, 3.2, 4.5].map((m) => (
                        <button
                          key={m}
                          onClick={() => onUpdateSettings((p) => ({ ...p, scaleMeters: m }))}
                          className={`flex-1 py-1 rounded text-[11px] font-medium border ${
                            Math.abs(settings.scaleMeters - m) < 0.1
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>Wall Height from Floor</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {settings.heightMeters.toFixed(2)} m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.5"
                      step="0.05"
                      value={settings.heightMeters}
                      onChange={(e) => onUpdateSettings((p) => ({ ...p, heightMeters: parseFloat(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />

                    {/* Level Rotation Slider */}
                    <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
                      <span>Horizon Tilt / Roll</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400">{settings.rollDeg.toFixed(1)}°</span>
                        <button
                          onClick={() => onUpdateSettings((p) => ({ ...p, rollDeg: 0 }))}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                          title="Reset angle"
                        >
                          <RotateCcw className="w-2.5 h-2.5" /> Reset
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      step="0.5"
                      value={settings.rollDeg}
                      onChange={(e) => onUpdateSettings((p) => ({ ...p, rollDeg: parseFloat(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4-Corner Keystone Pinning Section (Essential for Murals!) */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>4-Corner Keystone & Tape Pinning</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Enables interactive 3D corner handles. Drag each corner to map directly to physical painter's tape on your wall.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateSettings((p) => ({ ...p, cornerPinningEnabled: !p.cornerPinningEnabled }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        settings.cornerPinningEnabled
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {settings.cornerPinningEnabled ? 'Corner Pins Visible' : 'Enable 4-Corner Pins'}
                    </button>

                    {settings.cornerPinningEnabled && (
                      <button
                        onClick={() => onUpdateSettings((p) => ({
                          ...p,
                          cornerPins: {
                            topLeft: [0, 0],
                            topRight: [0, 0],
                            bottomRight: [0, 0],
                            bottomLeft: [0, 0],
                          }
                        }))}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                        title="Reset 4 corners to standard rectangle"
                      >
                        Reset Pins
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MURAL GRID & TOOLS */}
            {activeTab === 'grid' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Grid Divisions */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Mural Grid Method Overlay
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {[
                        { id: 'none', label: 'Off' },
                        { id: 'metric', label: 'Metric' },
                        { id: 'thirds', label: '3×3 Thirds' },
                        { id: 'quadrant', label: '2×2 Center' },
                      ].map((grid) => (
                        <button
                          key={grid.id}
                          onClick={() => onUpdateSettings((p) => ({ ...p, gridMode: grid.id as GridMode }))}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            settings.gridMode === grid.id
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {grid.label}
                        </button>
                      ))}
                    </div>

                    {settings.gridMode === 'metric' && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Grid Divisions</span>
                          <span className="font-mono text-cyan-400">{settings.gridDivisions} squares</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="20"
                          step="2"
                          value={settings.gridDivisions}
                          onChange={(e) => onUpdateSettings((p) => ({ ...p, gridDivisions: parseInt(e.target.value) }))}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mural Artist Utilities */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Artist Transfer Utilities
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onUpdateSettings((p) => ({ ...p, flipH: !p.flipH }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          settings.flipH
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Mirror horizontally (for reverse painting / glass murals / stencil transfers)"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span>Flip Horizontal (Mirror)</span>
                      </button>

                      <button
                        onClick={() => onUpdateSettings((p) => ({ ...p, showDimensionBadge: !p.showDimensionBadge }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          settings.showDimensionBadge
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span>3D Dimension Badge</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRESETS & QUEST PICTURES UPLOAD */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                {/* Upload from Quest Pictures / PC */}
                <div className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Load From Quest's Pictures Folder</div>
                    <div className="text-[11px] text-slate-400">
                      Upload your PNG, JPG, or transparent line art sketch stored on your Quest headset or device.
                    </div>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image</span>
                    </button>
                  </div>
                </div>

                {/* Preset Library */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Curated Mural Reference Presets
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => onSelectPreset(preset)}
                        className="group p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col"
                      >
                        <div className="h-20 w-full rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center p-1 border border-slate-800">
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="mt-1.5">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                            {preset.title}
                          </div>
                          <div className="text-[10px] text-slate-400 flex justify-between items-center mt-0.5">
                            <span>{preset.category}</span>
                            <span className="text-cyan-400">{preset.recommendedWidthM}m wide</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VIEW & QUEST AR */}
            {activeTab === 'environment' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'room_simulator', label: '3D Wall Studio', desc: 'Simulated textured room with floor & painter tape' },
                    { id: 'passthrough_cam', label: 'Camera Passthrough', desc: 'Uses device/webcam feed as real background' },
                    { id: 'dark_studio', label: 'Transparent Void', desc: 'Pure black backdrop for XR headset testing' },
                  ].map((env) => (
                    <button
                      key={env.id}
                      onClick={() => onUpdateSettings((p) => ({ ...p, previewBackground: env.id as any }))}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        settings.previewBackground === env.id
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-semibold">{env.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{env.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Quest Instructions quick banner */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400">Meta Quest 1 / 2 / 3 Standalone:</span> Open this link in the Oculus Browser and click <span className="font-semibold text-white">"Enter Quest AR"</span> to launch passthrough.
                  </div>
                  <button
                    onClick={onOpenQuestGuide}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 shrink-0"
                  >
                    View Setup Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
