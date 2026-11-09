import React from 'react';
import { X, Glasses, Folder, Move, Eye, ShieldCheck, ExternalLink } from 'lucide-react';

interface QuestGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterXR: () => void;
}

export const QuestGuideModal: React.FC<QuestGuideModalProps> = ({
  isOpen,
  onClose,
  onEnterXR,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Meta Quest Tracing & Setup Guide</h2>
              <p className="text-xs text-slate-400">How to trace murals on real walls with Quest 1, 2, or 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white">Open in Meta Quest (Oculus) Browser</h3>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Put on your Quest headset, launch the native <strong>Meta Quest Browser</strong>, and navigate to this app's URL. You can bookmark or send the link to your headset from the Meta Quest mobile app.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-cyan-400" />
                <span>Load Images from Quest's Pictures Folder</span>
              </h3>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Just like WhiteboardXR, click <strong>"Choose Image"</strong> in the Presets & Upload tab. The Quest file manager will open, allowing you to select any sketch, stencil, or reference image saved in your Quest's internal storage (<code className="text-cyan-300">/Pictures</code> or Downloads).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white">Outline & Real-Time Edge Extraction</h3>
              <p className="text-slate-400 mt-1 leading-relaxed">
                In the <strong>Outline & Filters</strong> tab, switch to <strong>Sobel Outline</strong> or <strong>Neon Outline</strong>. This transforms your photo or sketch into crisp outlines and removes the background so you see your physical wall clearly underneath. Pick a stroke color (e.g. Neon Cyan or Acid Green for dark walls, or Charcoal Black for white drywall).
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
              4
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-1.5">
                <Move className="w-4 h-4 text-cyan-400" />
                <span>Align to Wall with Touch Controllers</span>
              </h3>
              <ul className="text-slate-400 mt-1 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">Point & Trigger:</strong> Aim the laser at the mural to position it on your wall.</li>
                <li><strong className="text-slate-200">Thumbstick:</strong> Push forward/backward to adjust scale in real-time.</li>
                <li><strong className="text-slate-200">4-Corner Pins:</strong> Enable corner pins to align corners to painter's tape on your physical wall.</li>
                <li><strong className="text-slate-200">Lock:</strong> Click <strong>Locked</strong> to freeze the mural in world space so you can walk around without it shifting!</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
              5
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Painter's "Check Paint" Blink Feature</span>
              </h3>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Hold the <strong>"Check Paint"</strong> button anytime to temporarily hide the projection. This lets you inspect your real pencil or paint marks on the wall to verify line accuracy, then release to bring back the guide.
              </p>
            </div>
          </div>

          {/* Quest 1 Specific Note */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300">
            <strong>Note for Meta Quest 1:</strong> Quest 1 uses greyscale passthrough in VR/AR. For the sharpest tracing visibility, use high-contrast outline colors like Neon Cyan (<code className="text-white">#00E5FF</code>) or Acid Green (<code className="text-white">#39FF14</code>).
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Close Guide
          </button>

          <button
            onClick={() => {
              onClose();
              onEnterXR();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Launch Quest WebXR AR Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
