import React from 'react';
import { 
  Glasses, 
  Lock, 
  Unlock, 
  HelpCircle, 
  Maximize, 
  Minimize, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MuralSettings } from '../types';

interface TopHeaderProps {
  settings: MuralSettings;
  onUpdateSettings: (updater: (prev: MuralSettings) => MuralSettings) => void;
  onOpenGuide: () => void;
  onResetPose: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenGuide,
  onResetPose,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const heightM = (settings.scaleMeters / settings.aspectRatio).toFixed(2);
  const widthFt = (settings.scaleMeters * 3.28084).toFixed(1);
  const heightFt = (Number(heightM) * 3.28084).toFixed(1);

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-4xl select-none pointer-events-none">
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-xl pointer-events-auto gap-2">
        {/* Brand & Mode */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Glasses className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                MuralTrace XR
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Quest 1 / 2 / 3
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>Wall Tracing Overlay</span>
              <span>•</span>
              <span className="text-cyan-400 capitalize">{settings.lineArtMode.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Live Physical Dimension Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">Size:</span>
          <span className="font-mono text-cyan-300 font-semibold">
            {settings.scaleMeters.toFixed(2)}m × {heightM}m
          </span>
          <span className="text-slate-500 text-[10px]">({widthFt}' × {heightFt}')</span>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Lock Button */}
          <button
            onClick={() => onUpdateSettings((p) => ({ ...p, locked: !p.locked }))}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              settings.locked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title={settings.locked ? 'Mural is Locked in World Space' : 'Lock Mural on Wall'}
          >
            {settings.locked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Reset Pose */}
          <button
            onClick={onResetPose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Reset Position & Angle on Wall"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Help / Guide */}
          <button
            onClick={onOpenGuide}
            className="p-2 text-slate-300 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Meta Quest Setup Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
