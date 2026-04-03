/**
 * Shared types for reports and photos.
 */

export type Severity = 1 | 2 | 3;

/** Multi-category civic reporting (stored in Postgres as TEXT in `reports.category`). */
export type ReportCategory =
  | 'pothole'
  | 'fallen_tree'
  | 'road_marking'
  | 'street_light'
  | 'traffic_sign'
  | 'hazard';

/** Report status (stored in Postgres as TEXT in `reports.status`). */
export type ReportStatus = 'new' | 'in_progress' | 'resolved';

export interface Report {
  id: string;
  city: string;
  lat: number;
  lng: number;
  severity: Severity;
  comment: string | null;
  first_name?: string;
  last_name?: string;
  email_hash?: string;
  verify_token_hash?: string | null;
  verified?: boolean;
  created_at: string;
  // Multi-category (backwards compat: city still present)
  municipality?: string;
  settlement?: string;
  category?: ReportCategory;
  status?: ReportStatus;
  updated_at?: string;
  resolved_at?: string | null;
  metadata?: Record<string, unknown>;
}

export interface ReportPhoto {
  id: string;
  report_id: string;
  storage_path: string;
  created_at: string;
}

/** Report with photos joined (for map popups). */
export interface ReportWithPhotos extends Report {
  photos: { storage_path: string }[];
}

/** Severity labels in Bulgarian. */
export const SEVERITY_LABELS: Record<Severity, string> = {
  1: 'До 3 см',
  2: '3–7 см',
  3: 'Над 7 см',
};

/** Category-specific severity labels in Bulgarian. */
export const CATEGORY_SEVERITY_LABELS: Record<ReportCategory, Record<Severity, string>> = {
  pothole: {
    1: 'До 3 см',
    2: '3–7 см',
    3: 'Над 7 см',
  },
  fallen_tree: {
    1: 'Малки клони (частично на пътя)',
    2: 'Големи клони (пречи на преминаване)',
    3: 'Паднало дърво / блокира пътя',
  },
  road_marking: {
    1: 'Частично изтрита (все още се вижда)',
    2: 'Почти невидима',
    3: 'Липсва напълно / опасно',
  },
  street_light: {
    1: 'Примигва / слаба светлина',
    2: 'Не свети (1 лампа)',
    3: 'Не свети (цял участък / много лампи)',
  },
  traffic_sign: {
    1: 'Повреден, но видим',
    2: 'Паднал / обърнат',
    3: 'Липсва критичен знак (STOP/ОПАСНОСТ)',
  },
  hazard: {
    1: 'Локален риск (може да се мине)',
    2: 'Опасно при преминаване (особено нощем/дъжд)',
    3: 'Висок риск / участъкът е компрометиран',
  },
};

/** Category labels in Bulgarian. */
export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  pothole: 'Пътни неравности / дупки',
  fallen_tree: 'Паднали клони / дървета',
  road_marking: 'Изтрита маркировка / пешеходна пътека',
  street_light: 'Несветеща / повредена лампа',
  traffic_sign: 'Паднал / липсващ знак',
  hazard: 'Опасен участък / срутване',
};

/** Status labels in Bulgarian. */
export const STATUS_LABELS: Record<ReportStatus, string> = {
  new: 'Нов',
  in_progress: 'В процес',
  resolved: 'Решен',
};

/** Marker emoji per category (for map). */
export const CATEGORY_ICONS: Record<ReportCategory, string> = {
  pothole: '🕳️',
  fallen_tree: '🌳',
  road_marking: '🦓',
  street_light: '💡',
  traffic_sign: '🚫',
  hazard: '⚠️',
};

/** Settlements in Община Бургас (for dropdown). */
export const SETTLEMENTS_BURGAS: string[] = [
  'Burgas',
  'Balgarovo',
  'Banevo',
  'Bratovo',
  'Bryastovets',
  'Cherno More',
  'Dimchevo',
  'Draganovo',
  'Izvor',
  'Izvorishte',
  'Marinka',
  'Mirolyubovo',
  'Ravnets',
  'Rudnik',
  'Tvarditsa',
  'Vetren',
  'ДРУГО (Other)',
];

/** Center + zoom per settlement (for map flyTo). Keys must match SETTLEMENTS_BURGAS (excluding Друго). Lat/lng can be refreshed by running scripts/fetch-burgas-settlement-centers.mjs and merging scripts/burgas-settlements-centers.json. */
export const SETTLEMENT_CENTERS_BURGAS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Burgas':       { lat: 42.5048, lng: 27.4726, zoom: 14 },
  'Balgarovo':    { lat: 42.61889207083687, lng: 27.30580646701816, zoom: 15 },
  'Banevo':       { lat: 42.62506452992193, lng: 27.39573784484076, zoom: 15 },
  'Bratovo':      { lat: 42.50546611169597, lng: 27.304455343128524, zoom: 15 },
  'Bryastovets':  { lat: 42.67177810062171, lng: 27.465201371218907, zoom: 15 },
  'Cherno More':  { lat: 42.61414707373521, lng: 27.490753426065567, zoom: 15 },
  'Dimchevo':     { lat: 42.40386589237316, lng: 27.409266359353794, zoom: 15 },
  'Draganovo':    { lat: 42.69655661166156, lng: 27.440069564212354, zoom: 15 },
  'Izvor':        { lat: 42.35337227707259, lng: 27.459844384917982, zoom: 15 },
  'Izvorishte':   { lat: 42.65706540856509, lng: 27.443159640639447, zoom: 15 },
  'Marinka':      { lat: 42.39993186462875, lng: 27.484966513873648, zoom: 15 },
  'Mirolyubovo':  { lat: 42.64456250538161, lng: 27.36387000338625, zoom: 15 },
  'Ravnets':      { lat: 42.51447481429266, lng: 27.240983487249522, zoom: 15 },
  'Rudnik':       { lat: 42.62633064007862, lng: 27.48799739201424, zoom: 15 },
  'Tvarditsa':    { lat: 42.4096587688578, lng: 27.457958625801723, zoom: 15 },
  'Vetren':       { lat: 42.60456907175186, lng: 27.38512588732114, zoom: 15 },
  'ДРУГО (Other)': { lat: 42.5048, lng: 27.4726, zoom: 12 }, // Defaults to wide view of Burgas
};

/** Bulgarian labels for settlements (UI display). */
export const SETTLEMENT_LABELS_BG: Record<string, string> = {
  'Burgas': 'Бургас',
  'Balgarovo': 'Българово',
  'Banevo': 'Банево',
  'Bratovo': 'Братово',
  'Bryastovets': 'Брястовец',
  'Cherno More': 'Черно море',
  'Dimchevo': 'Димчево',
  'Draganovo': 'Драганово',
  'Izvor': 'Извор',
  'Izvorishte': 'Изворище',
  'Marinka': 'Маринка',
  'Mirolyubovo': 'Миролюбово',
  'Ravnets': 'Равнец',
  'Rudnik': 'Рудник',
  'Tvarditsa': 'Твърдица',
  'Vetren': 'Ветрен',
  'ДРУГО (Other)': 'Друго',
};

/** Municipality overview (all settlements). */
export const MUNICIPALITY_CENTER_BURGAS = { lat: 42.5048, lng: 27.4726, zoom: 12 };
/** Padding (degrees) for max bounds around all settlement centers. */
const BOUNDS_PADDING = 0.03;

/** Map max bounds: min/max of all SETTLEMENT_CENTERS_BURGAS + BOUNDS_PADDING. Leaflet: [[south, west], [north, east]]. */
function computeMunicipalityBounds(): [[number, number], [number, number]] {
  const centers = Object.values(SETTLEMENT_CENTERS_BURGAS);
  const lats = centers.map((c) => c.lat);
  const lngs = centers.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return [
    [minLat - BOUNDS_PADDING, minLng - BOUNDS_PADDING],
    [maxLat + BOUNDS_PADDING, maxLng + BOUNDS_PADDING],
  ];
}

export const MUNICIPALITY_BOUNDS_BURGAS = computeMunicipalityBounds();
