import React, { useState } from 'react';
import { 
  X, 
  Glasses, 
  Folder, 
  Move, 
  Eye, 
  Sparkles, 
  Layers, 
  Sliders, 
  Maximize2, 
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Usb
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'quickstart' | 'quest1' | 'controllers' | 'tips'>('quickstart');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyUrlToClipboard = () => {
    navigator.clipboard?.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Glasses className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Oculus Quest 1 Tracing Guide</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  WhiteboardXR Style
                </span>
              </h2>
              <p className="text-xs text-slate-400">Complete setup, file loading, and wall alignment manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'quickstart', label: '1. Quick Start' },
            { id: 'quest1', label: '2. Quest 1 & Storage' },
            { id: 'controllers', label: '3. Controls & Alignment' },
            { id: 'tips', label: '4. Muralist Tracing Tips' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: QUICK START */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              {/* App URL Share Banner */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-cyan-300">Open in Quest Browser:</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
                    {currentAppUrl || 'https://...'}
                  </div>
                </div>
                <button
                  onClick={copyUrlToClipboard}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied URL!' : 'Copy Link to Headset'}</span>
                </button>
              </div>

              {/* 5 Steps */}
              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Put on Oculus Quest 1 & Launch Browser</h3>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                      Put on your Quest 1, click the Apps icon in the Oculus dock, and launch the native <strong>Oculus Browser</strong> (or Meta Horizon Browser). Type this URL into the address bar or open it from your saved bookmarks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Load Image from Quest Pictures</h3>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                      Click the <strong>Presets & Upload</strong> tab at the bottom dock, then click <strong>"Choose Image"</strong>. The Quest internal file dialog will open, allowing you to select any sketch, stencil, or reference image saved in your Quest's Pictures or Downloads folder.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Enable Outline / Sobel Edge Filter</h3>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                      Under <strong>Outline & Filters</strong>, select <strong>Sobel Outline</strong> or <strong>Neon Outline</strong>. This removes the solid paper background and converts your image into glowing linework so your physical wall is clearly visible behind the strokes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Click "Enter Quest AR"</h3>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                      Click the glowing blue <strong>"Enter Quest AR"</strong> button. The browser will transition into an immersive WebXR passthrough session where the image hovers in real 3D space directly on your wall.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Position, Size & Lock</h3>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
                      Aim your controller laser at the mural, hold the <strong>Index Trigger</strong> to drag it into position against your wall, and push the <strong>Thumbstick</strong> to scale it. Finally click <strong>Locked</strong> to freeze it in 3D world space.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUEST 1 & STORAGE */}
          {activeTab === 'quest1' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Usb className="w-4 h-4 text-cyan-400" />
                  <span>How to transfer images to your Quest 1</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Oculus Quest 1 runs Android OS internally. Here are the 3 easiest ways to put your line art and mural references onto the headset:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Method A: USB Cable</strong>
                    Plug Quest 1 into your PC/Mac with a USB-C cable. Accept "Allow USB Debugging / File Access" inside the headset. Copy your images to <code className="text-slate-200">Quest/Internal Storage/Pictures</code>.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Method B: Browser Download</strong>
                    Open Google Drive, Dropbox, or Imgur inside the Oculus Browser. Right-click or long-press your image and choose <em>"Save Image to Headset"</em>.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Method C: Send Link / Meta App</strong>
                    Use the Meta Quest smartphone app on iOS/Android: share any image or cloud link directly to your headset's browser via the "Send to Headset" option.
                  </div>
                </div>
              </div>

              {/* Quest 1 Specific WebXR Note */}
              <div className="p-3.5 bg-cyan-950/40 rounded-xl border border-cyan-800/40 space-y-2">
                <h3 className="font-semibold text-cyan-300 flex items-center gap-2">
                  <Glasses className="w-4 h-4" />
                  <span>Oculus Quest 1 Hardware Considerations</span>
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong>Infrared Greyscale Passthrough:</strong> Unlike Quest 3's full-color RGB passthrough, Quest 1 uses monochrome IR tracking cameras. 
                    <em> Recommendation:</em> Choose <strong>Neon Cyan (<code className="text-white">#00E5FF</code>)</strong> or <strong>Acid Green (<code className="text-white">#39FF14</code>)</strong> outlines; these appear as ultra-crisp, high-contrast glowing lines over the real world.
                  </li>
                  <li>
                    <strong>WebXR Support:</strong> Oculus Browser on Quest 1 supports WebXR with local-floor tracking. If "Enter Quest AR" does not immediately activate passthrough, type <code className="text-cyan-300">chrome://flags</code> in Oculus Browser and ensure <em>"WebXR Experience"</em> and <em>"WebXR Incubations"</em> are set to <strong>Default</strong> or <strong>Enabled</strong>.
                  </li>
                  <li>
                    <strong>Guardian Setup:</strong> Make sure you have drawn a stationary or roomscale Guardian perimeter before tracing so the tracking cameras remain locked in 6DOF.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTROLS & ALIGNMENT */}
          {activeTab === 'controllers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Controller Action 1 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Index Trigger (Hold)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">Laser Ray</span>
                  </div>
                  <p className="text-slate-400">
                    Aim your controller laser at the mural image plane. Press and hold the index trigger to grab and move the mural up, down, left, or right along your physical wall.
                  </p>
                </div>

                {/* Controller Action 2 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Thumbstick (Up / Down)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">Real-time Scale</span>
                  </div>
                  <p className="text-slate-400">
                    Push the analog thumbstick forward to enlarge the mural (up to 6+ meters for large walls) or pull backward to shrink down for small canvases or stencils.
                  </p>
                </div>

                {/* Controller Action 3 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">4-Corner Keystone Pinning</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">Perspective Warp</span>
                  </div>
                  <p className="text-slate-400">
                    Enable corner pins to reveal 4 cyan handles. Use your laser to drag individual corners so the template aligns with physical painter's tape on non-perpendicular walls.
                  </p>
                </div>

                {/* Controller Action 4 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Lock to Wall Button</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">World Freeze</span>
                  </div>
                  <p className="text-slate-400">
                    Once positioned, click <strong>Locked</strong>. This completely anchors the mural in 3D world space. You can walk right up to the wall with your paint markers without the image moving.
                  </p>
                </div>
              </div>

              {/* Painter's Quick Check / Blink Feature */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="text-white text-xs block">The "Check Paint" Blink Feature (Crucial for Muralists)</strong>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    While painting, your real brushstrokes are overlaid by the virtual projection. Press and hold the <strong>"Check Paint"</strong> button (or press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px]">Space</kbd> or <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px]">B</kbd>). This temporarily hides the template so you can inspect your physical paint lines on the real wall, then release to instantly restore the alignment guide!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MURALIST TRACING TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">1. Optimal Room Lighting for Quest 1</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    The Quest 1 tracking cameras use infrared optical tracking. Use diffuse room lighting (not direct glaring sunlight which can blind the tracking sensors). Even room lighting ensures rock-solid tracking with zero jitter as you paint.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">2. Use 4 Pieces of Blue Painter's Tape on Your Wall</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Before starting, stick four pieces of blue painter's tape on your wall where you want the corners of the mural to be. Enable <strong>4-Corner Pins</strong> and drag the four virtual handles directly onto your tape marks. This guarantees 100% geometric accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">3. Turn on the Mural Grid for Complex Compositions</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    In the <strong>Mural Grid & Tools</strong> tab, choose <em>Metric</em> or <em>3×3 Thirds</em>. This superimposes proportional grid lines over your artwork, allowing you to cross-reference proportions against your physical sketchpad or reference printouts.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">4. Adjust Stroke Thickness (1x to 4x) & Opacity</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    If tracing fine details (like hair or lettering), set stroke width to <strong>1x</strong> or <strong>2x</strong> and lower opacity to <strong>70%</strong> so your marker tip is easy to see through the glowing lines.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Supports Meta Quest 1, Meta Quest 2, and Meta Quest 3/Pro
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onEnterXR();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Launch Quest AR Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
