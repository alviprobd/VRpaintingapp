import { PresetImage } from '../types';

// Helper to convert SVG markup into a clean data URI
function svgToUri(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'botanical-monstera',
    title: 'Monstera & Floral Botanicals',
    category: 'Botanical',
    description: 'Clean organic line art with tropical leaves and wild peonies, ideal for cafe or living room murals.',
    aspectRatio: 4 / 3,
    recommendedWidthM: 2.4,
    defaultMode: 'edges',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" fill="none">
        <rect width="1200" height="900" fill="#ffffff" />
        <g stroke="#1a1a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
          <!-- Main Monstera Leaf -->
          <path d="M 600,800 C 600,450 550,200 700,100 C 850,220 950,420 850,750 Z" fill="#f0fdf4" stroke-width="7" />
          <path d="M 600,800 Q 640,480 700,100" stroke-width="8" stroke="#166534" />
          <!-- Monstera Cutouts / Fenestrations -->
          <path d="M 660,350 C 720,340 760,320 800,280 C 790,360 740,390 670,390 Z" fill="#ffffff" stroke-width="5" />
          <path d="M 650,470 C 740,460 790,440 850,400 C 820,490 770,520 660,510 Z" fill="#ffffff" stroke-width="5" />
          <path d="M 640,590 C 730,590 800,580 840,540 C 800,620 740,640 645,630 Z" fill="#ffffff" stroke-width="5" />
          <path d="M 620,700 C 690,700 750,690 780,660 C 750,720 700,740 625,730 Z" fill="#ffffff" stroke-width="5" />
          <!-- Left Fenestrations -->
          <path d="M 630,300 C 580,280 540,260 510,220 C 530,290 570,320 625,330 Z" fill="#ffffff" stroke-width="5" />
          <path d="M 620,420 C 540,400 480,380 430,330 C 470,430 520,460 610,460 Z" fill="#ffffff" stroke-width="5" />
          <path d="M 610,540 C 530,530 460,510 400,470 C 440,570 500,600 600,580 Z" fill="#ffffff" stroke-width="5" />

          <!-- Left Fan Palm -->
          <path d="M 200,850 Q 320,600 250,250" stroke-width="6" />
          <path d="M 250,250 C 220,380 180,450 100,520" stroke-width="4" />
          <path d="M 250,250 C 240,400 220,500 150,600" stroke-width="4" />
          <path d="M 250,250 C 280,400 320,520 280,660" stroke-width="4" />
          <path d="M 250,250 C 340,360 400,460 380,590" stroke-width="4" />
          <path d="M 250,250 C 380,310 460,390 470,500" stroke-width="4" />

          <!-- Center Peony Flower Outline -->
          <circle cx="480" cy="650" r="140" fill="#fef2f2" stroke-width="6" />
          <path d="M 430,640 C 420,580 480,550 510,580 C 540,610 500,660 450,660 Z" fill="#fee2e2" stroke-width="4" />
          <path d="M 460,670 C 420,680 400,640 380,600 C 360,650 400,720 460,710 Z" stroke-width="4" />
          <path d="M 490,660 C 540,670 580,630 570,580 C 590,630 560,710 490,700 Z" stroke-width="4" />
          <path d="M 440,560 C 460,510 530,510 550,560" stroke-width="4" />
          <path d="M 400,580 C 370,530 420,480 460,490" stroke-width="4" />
          <path d="M 540,580 C 580,540 620,580 600,630" stroke-width="4" />

          <!-- Right Fern Frond -->
          <path d="M 950,850 Q 880,550 1050,300" stroke-width="6" />
          <path d="M 920,650 Q 820,620 800,560" stroke-width="4" />
          <path d="M 940,600 Q 1040,570 1060,520" stroke-width="4" />
          <path d="M 940,530 Q 850,500 840,440" stroke-width="4" />
          <path d="M 970,470 Q 1060,440 1090,390" stroke-width="4" />
          <path d="M 990,400 Q 920,380 910,320" stroke-width="4" />
          <path d="M 1020,350 Q 1090,320 1110,270" stroke-width="4" />
        </g>
      </svg>
    `)
  },
  {
    id: 'geometric-lion',
    title: 'Polygonal Geometric Lion',
    category: 'Geometric',
    description: 'Striking low-poly animal portrait. High contrast sharp facets perfect for tape-and-paint mural stenciling.',
    aspectRatio: 1,
    recommendedWidthM: 2.0,
    defaultMode: 'stencil',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" fill="none">
        <rect width="1000" height="1000" fill="#ffffff" />
        <g stroke="#000000" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
          <!-- Forehead & Mane Top -->
          <polygon points="500,120 420,220 500,260" fill="#fafafa" />
          <polygon points="500,120 500,260 580,220" fill="#f4f4f5" />
          <polygon points="500,120 370,160 420,220" fill="#e4e4e7" />
          <polygon points="500,120 580,220 630,160" fill="#d4d4d8" />

          <!-- Ears -->
          <polygon points="370,160 300,180 340,270" fill="#e4e4e7" />
          <polygon points="340,270 420,220 370,160" fill="#d4d4d8" />
          <polygon points="630,160 660,270 700,180" fill="#e4e4e7" />
          <polygon points="630,160 580,220 660,270" fill="#d4d4d8" />

          <!-- Mane Outer Spikes -->
          <polygon points="300,180 220,280 310,310" fill="#d4d4d8" />
          <polygon points="220,280 200,400 290,400" fill="#a1a1aa" />
          <polygon points="200,400 180,540 280,510" fill="#71717a" />
          <polygon points="180,540 220,680 310,610" fill="#52525b" />
          <polygon points="220,680 320,790 380,690" fill="#3f3f46" />

          <polygon points="700,180 690,310 780,280" fill="#d4d4d8" />
          <polygon points="780,280 710,400 800,400" fill="#a1a1aa" />
          <polygon points="800,400 720,510 820,540" fill="#71717a" />
          <polygon points="820,540 690,610 780,680" fill="#52525b" />
          <polygon points="780,680 620,690 680,790" fill="#3f3f46" />

          <!-- Brow & Eyes -->
          <polygon points="500,260 420,220 420,340" fill="#e4e4e7" />
          <polygon points="500,260 420,340 500,380" fill="#f4f4f5" />
          <polygon points="500,260 500,380 580,340" fill="#fafafa" />
          <polygon points="500,260 580,340 580,220" fill="#e4e4e7" />

          <!-- Left Eye Region -->
          <polygon points="420,340 340,360 410,430" fill="#d4d4d8" />
          <polygon points="420,340 410,430 450,420" fill="#18181b" />
          <polygon points="500,380 420,340 450,420" fill="#f4f4f5" />

          <!-- Right Eye Region -->
          <polygon points="580,340 550,420 590,430" fill="#18181b" />
          <polygon points="580,340 590,430 660,360" fill="#d4d4d8" />
          <polygon points="500,380 550,420 580,340" fill="#f4f4f5" />

          <!-- Nose Bridge & Cheeks -->
          <polygon points="500,380 450,420 470,540" fill="#e4e4e7" />
          <polygon points="500,380 470,540 500,560" fill="#f4f4f5" />
          <polygon points="500,380 500,560 530,540" fill="#fafafa" />
          <polygon points="500,380 530,540 550,420" fill="#e4e4e7" />

          <polygon points="450,420 370,470 470,540" fill="#d4d4d8" />
          <polygon points="550,420 530,540 630,470" fill="#d4d4d8" />

          <!-- Muzzle & Whiskers Area -->
          <polygon points="500,560 470,540 450,620" fill="#e4e4e7" />
          <polygon points="500,560 450,620 500,660" fill="#27272a" />
          <polygon points="500,560 500,660 550,620" fill="#18181b" />
          <polygon points="500,560 550,620 530,540" fill="#e4e4e7" />

          <polygon points="450,620 380,690 500,720" fill="#f4f4f5" />
          <polygon points="450,620 500,720 500,660" fill="#e4e4e7" />
          <polygon points="550,620 500,660 500,720" fill="#e4e4e7" />
          <polygon points="550,620 500,720 620,690" fill="#f4f4f5" />

          <!-- Chin & Beard -->
          <polygon points="500,720 460,820 500,880" fill="#d4d4d8" />
          <polygon points="500,720 500,880 540,820" fill="#a1a1aa" />
          <polygon points="380,690 460,820 500,720" fill="#71717a" />
          <polygon points="620,690 500,720 540,820" fill="#52525b" />
        </g>
      </svg>
    `)
  },
  {
    id: 'street-graffiti',
    title: 'Neo-Tokyo Street Graffiti Character',
    category: 'Street Art',
    description: 'Dynamic comic-style street art character with bold outlines, drip accents, and expressive graffiti energy.',
    aspectRatio: 3 / 4,
    recommendedWidthM: 1.8,
    defaultMode: 'inverted_edges',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" fill="none">
        <rect width="900" height="1200" fill="#111827" />
        <g stroke="#38bdf8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
          <!-- Background Graffiti Halos & Starburst -->
          <circle cx="450" cy="500" r="320" stroke="#f43f5e" stroke-width="4" stroke-dasharray="16 12" />
          <polygon points="450,120 490,260 630,220 530,320 650,420 510,440 500,580 410,460 270,520 350,400 230,320 370,280" stroke="#fbbf24" stroke-width="5" fill="#fbbf24" fill-opacity="0.1" />

          <!-- Headwear / Spray Can Helmet -->
          <path d="M 280,360 C 290,220 610,220 620,360 L 600,430 L 300,430 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="8" />
          <rect x="410" y="160" width="80" height="70" rx="15" fill="#f59e0b" stroke="#38bdf8" stroke-width="7" />
          <path d="M 450,160 L 450,110 L 470,110" stroke-width="8" />

          <!-- Oversized Goggles / Visor -->
          <path d="M 270,440 C 270,400 370,390 440,410 C 510,390 630,400 630,440 C 630,530 520,550 450,530 C 380,550 270,530 270,440 Z" fill="#09090b" stroke="#a855f7" stroke-width="10" />
          <!-- Visor Glare Lines -->
          <path d="M 320,440 L 390,440" stroke="#ec4899" stroke-width="8" />
          <path d="M 330,470 L 410,470" stroke="#ec4899" stroke-width="6" />
          <path d="M 490,440 L 580,440" stroke="#06b6d4" stroke-width="8" />
          <path d="M 510,470 L 570,470" stroke="#06b6d4" stroke-width="6" />

          <!-- Face & Respirator Mask -->
          <path d="M 330,520 L 300,640 C 300,750 600,750 600,640 L 570,520" stroke="#f43f5e" stroke-width="8" />
          <!-- Dual Filter Pods -->
          <circle cx="340" cy="650" r="60" fill="#1e293b" stroke="#f43f5e" stroke-width="8" />
          <circle cx="340" cy="650" r="30" stroke="#38bdf8" stroke-width="5" />
          <circle cx="560" cy="650" r="60" fill="#1e293b" stroke="#f43f5e" stroke-width="8" />
          <circle cx="560" cy="650" r="30" stroke="#38bdf8" stroke-width="5" />
          <path d="M 410,650 Q 450,680 490,650" stroke="#fbbf24" stroke-width="7" />

          <!-- Hoodie & Shoulders -->
          <path d="M 300,720 C 220,780 150,860 120,1050 L 780,1050 C 750,860 680,780 600,720" stroke="#38bdf8" stroke-width="9" />
          <path d="M 450,750 L 450,1050" stroke="#a855f7" stroke-width="6" stroke-dasharray="20 15" />
          
          <!-- Spray Cans Held in Hands -->
          <rect x="110" y="860" width="100" height="180" rx="20" fill="#1e1b4b" stroke="#22c55e" stroke-width="7" />
          <circle cx="160" cy="830" r="18" fill="#eab308" stroke="#22c55e" stroke-width="6" />
          <!-- Spray Mist Jet -->
          <path d="M 160,810 Q 100,740 70,660" stroke="#22c55e" stroke-width="8" stroke-dasharray="10 10" />
          <path d="M 160,810 Q 140,710 120,620" stroke="#22c55e" stroke-width="6" stroke-dasharray="12 8" />

          <!-- Drips -->
          <path d="M 450,1050 C 450,1110 440,1150 440,1160 C 440,1175 460,1175 460,1160 L 455,1050" fill="#f43f5e" stroke="none" />
          <path d="M 680,1000 C 680,1070 670,1100 670,1115 C 670,1125 690,1125 690,1115 L 685,1000" fill="#38bdf8" stroke="none" />
          <circle cx="440" cy="1185" r="7" fill="#f43f5e" stroke="none" />
          <circle cx="670" cy="1135" r="5" fill="#38bdf8" stroke="none" />
        </g>
      </svg>
    `)
  },
  {
    id: 'typography-mural',
    title: 'Sign Painter Typography & Ribbon',
    category: 'Typography',
    description: 'Precision typographic lettering with ornamental flourishes, drop shadows, and banner ribbons.',
    aspectRatio: 16 / 9,
    recommendedWidthM: 3.2,
    defaultMode: 'transparent_art',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" fill="none">
        <rect width="1600" height="900" fill="#ffffff" />
        <g stroke="#0f172a" stroke-linecap="round" stroke-linejoin="round">
          <!-- Flowing Ribbon Banner -->
          <path d="M 220,290 C 480,210 1120,210 1380,290 L 1320,430 C 1080,360 520,360 280,430 Z" fill="#f8fafc" stroke-width="7" />
          <!-- Ribbon Ends -->
          <path d="M 220,290 L 150,380 L 250,450 L 280,430 L 200,360 Z" fill="#e2e8f0" stroke-width="6" />
          <path d="M 1380,290 L 1450,380 L 1350,450 L 1320,430 L 1400,360 Z" fill="#e2e8f0" stroke-width="6" />
          
          <!-- Banner Text Outline "NEVER STOP" -->
          <text x="800" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="82" font-weight="900" text-anchor="middle" letter-spacing="18" fill="none" stroke="#0f172a" stroke-width="6">
            NEVER STOP
          </text>

          <!-- Main Serif Outline "CREATING" -->
          <text x="800" y="600" font-family="'Times New Roman', serif" font-size="160" font-weight="bold" font-style="italic" text-anchor="middle" letter-spacing="8" fill="none" stroke="#0f172a" stroke-width="9">
            CREATING
          </text>
          <!-- 3D Extrusion Shadow for Lettering -->
          <text x="814" y="614" font-family="'Times New Roman', serif" font-size="160" font-weight="bold" font-style="italic" text-anchor="middle" letter-spacing="8" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="8 6">
            CREATING
          </text>

          <!-- Decorative Floral Flourishes & Stars -->
          <path d="M 350,600 C 220,600 200,720 340,730 C 460,740 470,650 380,640" stroke-width="6" />
          <path d="M 1250,600 C 1380,600 1400,720 1260,730 C 1140,740 1130,650 1220,640" stroke-width="6" />

          <!-- Center Diamond Motif -->
          <polygon points="800,680 830,730 800,780 770,730" stroke-width="6" fill="#f1f5f9" />
          <line x1="450" y1="730" x2="740" y2="730" stroke-width="5" />
          <line x1="860" y1="730" x2="1150" y2="730" stroke-width="5" />
        </g>
      </svg>
    `)
  },
  {
    id: 'sacred-mandala',
    title: 'Sacred Geometry Wall Mandala',
    category: 'Geometric',
    description: 'Intricate radial symmetry mandala, ideal for precision tape measurements, compass drafting, and circular murals.',
    aspectRatio: 1,
    recommendedWidthM: 2.2,
    defaultMode: 'edges',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" fill="none">
        <rect width="1000" height="1000" fill="#ffffff" />
        <g stroke="#1e293b" stroke-width="4" stroke-linecap="round">
          <!-- Concentric Reference Rings -->
          <circle cx="500" cy="500" r="440" stroke-width="6" />
          <circle cx="500" cy="500" r="400" stroke-width="3" stroke-dasharray="10 10" />
          <circle cx="500" cy="500" r="330" stroke-width="5" />
          <circle cx="500" cy="500" r="240" stroke-width="4" />
          <circle cx="500" cy="500" r="140" stroke-width="5" />
          <circle cx="500" cy="500" r="50" stroke-width="4" fill="#f8fafc" />

          <!-- Center 8-petal Lotus -->
          <path d="M 500,360 C 530,420 530,470 500,500 C 470,470 470,420 500,360 Z" stroke-width="4" />
          <path d="M 500,640 C 530,580 530,530 500,500 C 470,530 470,580 500,640 Z" stroke-width="4" />
          <path d="M 360,500 C 420,530 470,530 500,500 C 470,470 420,470 360,500 Z" stroke-width="4" />
          <path d="M 640,500 C 580,530 530,530 500,500 C 530,470 580,470 640,500 Z" stroke-width="4" />

          <!-- Diagonal 4 Petals -->
          <path d="M 401,401 C 460,420 480,460 500,500 C 460,480 420,460 401,401 Z" stroke-width="4" />
          <path d="M 599,401 C 540,420 520,460 500,500 C 540,480 580,460 599,401 Z" stroke-width="4" />
          <path d="M 401,599 C 460,580 480,540 500,500 C 460,520 420,540 401,599 Z" stroke-width="4" />
          <path d="M 599,599 C 540,580 520,540 500,500 C 540,520 580,540 599,599 Z" stroke-width="4" />

          <!-- Outer 16-point Star Ray Pattern -->
          <polygon points="500,100 530,220 620,130 590,260 710,210 630,320 770,310 660,390 800,430 660,480 790,560 640,570 730,680 590,640 640,770 530,690 500,820 470,690 360,770 410,640 270,680 360,570 210,560 340,480 200,430 340,390 230,310 370,320 290,210 410,260 380,130 470,220" stroke-width="4" />
        </g>
      </svg>
    `)
  },
  {
    id: 'classical-portrait',
    title: 'Da Vinci Classical Line Sketch',
    category: 'Classical',
    description: 'Fine art contour study with delicate facial proportions, cross-hatching, and golden ratio alignment lines.',
    aspectRatio: 3 / 4,
    recommendedWidthM: 1.5,
    defaultMode: 'edges',
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" fill="none">
        <rect width="900" height="1200" fill="#fefae0" />
        <g stroke="#451a03" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <!-- Construction & Proportion Lines (Da Vinci Codex style) -->
          <line x1="100" y1="520" x2="800" y2="520" stroke="#b45309" stroke-width="2" stroke-dasharray="6 8" />
          <line x1="100" y1="670" x2="800" y2="670" stroke="#b45309" stroke-width="2" stroke-dasharray="6 8" />
          <line x1="450" y1="150" x2="450" y2="1050" stroke="#b45309" stroke-width="2" stroke-dasharray="6 8" />
          <circle cx="450" cy="500" r="300" stroke="#b45309" stroke-width="2" stroke-dasharray="10 10" />

          <!-- Face Silhouette -->
          <path d="M 450,220 C 320,220 280,340 280,520 C 280,720 370,880 450,940 C 530,880 620,720 620,520 C 620,340 580,220 450,220 Z" stroke-width="5" />
          
          <!-- Eyes & Brow -->
          <path d="M 330,480 Q 380,460 420,480" stroke-width="6" />
          <path d="M 480,480 Q 520,460 570,480" stroke-width="6" />
          <path d="M 340,520 Q 380,500 410,520 Q 380,545 340,520 Z" stroke-width="5" fill="#fef08a" />
          <circle cx="375" cy="520" r="14" fill="#451a03" />
          <path d="M 490,520 Q 520,500 560,520 Q 520,545 490,520 Z" stroke-width="5" fill="#fef08a" />
          <circle cx="525" cy="520" r="14" fill="#451a03" />

          <!-- Nose Bridge & Tip -->
          <path d="M 440,490 L 435,630 Q 430,665 450,670 Q 470,665 465,630" stroke-width="5" />
          <path d="M 415,655 Q 430,675 450,675 Q 470,675 485,655" stroke-width="4" />

          <!-- Lips -->
          <path d="M 390,750 Q 430,735 450,745 Q 470,735 510,750" stroke-width="6" />
          <path d="M 395,752 Q 450,790 505,752" stroke-width="5" />

          <!-- Curls & Hair Flow -->
          <path d="M 300,260 C 200,320 180,450 220,580 C 180,640 190,750 250,820" stroke-width="5" />
          <path d="M 600,260 C 700,320 720,450 680,580 C 720,640 710,750 650,820" stroke-width="5" />
          <path d="M 360,200 C 450,150 540,150 600,220" stroke-width="6" />
        </g>
      </svg>
    `)
  }
];
