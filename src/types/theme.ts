export enum StationThemeId {
  CockpitHorn = 'cockpit-horn',
  DumpCab = 'dump-cab',
  LinelessBlocks = 'lineless-blocks',
  CreamDecal = 'cream-decal',
  ScreenprintToy = 'screenprint-toy',
}

export interface StationThemeConfig {
  id: StationThemeId;
  number: string;
  name: string;
  styleTag: string;
  tagline: string;
  inspoNote: string;
  stickerNote: string;
  layoutNote: string;
  // Shared bright primary + cream-paper toy palette inspired by the two photos
  canvasBg: string;
  sidebarBg: string;
  sidebarHeaderBg: string;
  topBarBg: string;
  bezelBg: string;
  nameplateBg: string;
  plateBg: string;
  plateAltBg: string;
  cardBg: string;
  cardHeaderBg: string;
  crtBg: string;
  borderColor: string;
  shadowColor: string;
  inkText: string;
  mutedText: string;
  accentBg: string;
  accentText: string;
  kpiYellowBg: string;
  kpiBlueBg: string;
  pipeLight: string;
  pipeLavender: string;
  pipeRed: string;
  isDarkSurface: boolean;
  svgStrokeWidth: number;
  swatches: [string, string, string, string];
}

const TOY_BASE_TOKENS = {
  canvasBg: '#F1F5F9',
  sidebarBg: '#1D4ED8',
  sidebarHeaderBg: '#1E3A8A',
  topBarBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardHeaderBg: '#FEF9C3',
  crtBg: '#0F172A',
  borderColor: '#1E293B',
  shadowColor: '#1E293B',
  inkText: '#0F172A',
  mutedText: '#475569',
  accentText: '#0F172A',
  kpiYellowBg: '#FEF08A',
  kpiBlueBg: '#BAE6FD',
  pipeLight: '#FFFFFF',
  pipeLavender: '#FACC15',
  pipeRed: '#EF4444',
  isDarkSurface: false,
} as const;

export const STATION_THEMES: StationThemeConfig[] = [
  {
    ...TOY_BASE_TOKENS,
    id: StationThemeId.CockpitHorn,
    number: '01',
    name: 'Toybox Cockpit & Red Siren',
    styleTag: 'Toy Blue Shell · Red Wheel & Beacon',
    tagline:
      'Cerulean toy-dashboard casing topped by a ribbed red siren dome, cream HORN/PRNDL paper decals, and a big red wheel framing the core gauges.',
    inspoNote: 'Blue Toy Dashboard (red siren, big red steering ring, cream paper stickers)',
    stickerNote: 'Warm cream die-cut decals · 3px dark ink · red wheel centerpiece',
    layoutNote: 'Recessed cockpit dash (Wheel gauges + PRNDL matrix + spectrum)',
    bezelBg: '#2B99E8',
    nameplateBg: '#FEF3C7',
    plateBg: '#FFFBEB',
    plateAltBg: '#FEF9C3',
    accentBg: '#FACC15',
    svgStrokeWidth: 3.2,
    swatches: ['#2B99E8', '#EF4444', '#FEF3C7', '#FACC15'],
  },
  {
    ...TOY_BASE_TOKENS,
    id: StationThemeId.DumpCab,
    number: '02',
    name: 'Primary Dump-Cab Stack',
    styleTag: '3 Roof Domes · Yellow Cab · Green Grille',
    tagline:
      'Sunny yellow cab topped with three rounded roof domes and red side bumpers, sky-blue windshield decals, and a kelly green headlight grille.',
    inspoNote: 'Primary Dump Truck (3 yellow domes, sky windshield decal, green grille)',
    stickerNote: 'Bold comic-ink outlines · red/yellow pinstripe bands · grille vents',
    layoutNote: 'Cab-over vertical stack (Blue windshield top, Yellow cab, Green grille)',
    bezelBg: '#FACC15',
    nameplateBg: '#EF4444',
    plateBg: '#38BDF8',
    plateAltBg: '#16A34A',
    accentBg: '#FACC15',
    svgStrokeWidth: 3.5,
    swatches: ['#FACC15', '#EF4444', '#16A34A', '#2B99E8'],
  },
  {
    ...TOY_BASE_TOKENS,
    id: StationThemeId.LinelessBlocks,
    number: '03',
    name: 'Lineless Primary Toy Blocks',
    styleTag: '0px Outlines · Extra-Chubby Shapes',
    tagline:
      'Same joyful toy primary colors distilled into zero-outline flat foam stickers with extra-chubby rounded corners and round cobalt wheel feet.',
    inspoNote: 'Pure flat vector toy blocks (0px outlines, chubby pill silhouettes)',
    stickerNote: '0px borders & 0px SVG strokes · pure flat color-block stickers',
    layoutNote: 'Airy color-block bento (Battery & Scanner hero top)',
    bezelBg: '#2B99E8',
    nameplateBg: '#FACC15',
    plateBg: '#FFFFFF',
    plateAltBg: '#DCFCE7',
    accentBg: '#EF4444',
    accentText: '#FFFFFF',
    svgStrokeWidth: 0,
    swatches: ['#2B99E8', '#FACC15', '#16A34A', '#EF4444'],
  },
  {
    ...TOY_BASE_TOKENS,
    id: StationThemeId.CreamDecal,
    number: '04',
    name: 'Cream-Halo Sticker Sheet',
    styleTag: 'Double Peel Rim · Playful Decal Tilt',
    tagline:
      'Two-tone red and blue toy trim covered in warm cream-paper stickers with chunky cream+ink die-cut halos and playful tilts.',
    inspoNote: 'Vintage printed PRNDL / HORN / radio dial sticker sheet on toy plastic',
    stickerNote: 'Double-ring cream halo + ink trim · slight playful sticker tilt',
    layoutNote: '3-tower vertical toy kiosk (Energy | Gauges & Scope | Matrix & Scan)',
    bezelBg: '#EF4444',
    nameplateBg: '#FEF3C7',
    plateBg: '#FFFBEB',
    plateAltBg: '#DBEAFE',
    accentBg: '#2B99E8',
    accentText: '#FFFFFF',
    svgStrokeWidth: 2.8,
    swatches: ['#EF4444', '#FEF3C7', '#2B99E8', '#1E293B'],
  },
  {
    ...TOY_BASE_TOKENS,
    id: StationThemeId.ScreenprintToy,
    number: '05',
    name: 'Retro Toybox Screenprint',
    styleTag: 'Solid Flat Offset · Candy Trim',
    tagline:
      'Kelly green & sunny yellow toybox frame with crisp unblurred print-offset sticker backing and widescreen cockpit pacing.',
    inspoNote: 'Both vintage toys combined in crisp flat screenprint toy packaging style',
    stickerNote: 'Solid 5px/3px unblurred print offset · flat candy-stripe trim',
    layoutNote: 'Widescreen hero cockpit (Battery Core + Energy Flow across top)',
    bezelBg: '#16A34A',
    nameplateBg: '#FACC15',
    plateBg: '#FFFFFF',
    plateAltBg: '#FEF3C7',
    accentBg: '#EF4444',
    accentText: '#FFFFFF',
    svgStrokeWidth: 3.2,
    swatches: ['#16A34A', '#FACC15', '#EF4444', '#2B99E8'],
  },
];
