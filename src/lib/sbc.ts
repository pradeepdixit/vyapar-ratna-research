import type { AstroSnapshot, Planet } from "./astro";

/** The 28-star zodiac used by the Sarvatobhadra Chakra, in longitude order. */
export const SBC_NAKSHATRAS: string[] = [
  "अश्विनी",
  "भरणी",
  "कृत्तिका",
  "रोहिणी",
  "मृगशीर्ष",
  "आर्द्रा",
  "पुनर्वसु",
  "पुष्य",
  "आश्लेषा",
  "मघा",
  "पूर्वाफाल्गुनी",
  "उत्तराफाल्गुनी",
  "हस्त",
  "चित्रा",
  "स्वाती",
  "विशाखा",
  "अनुराधा",
  "ज्येष्ठा",
  "मूल",
  "पूर्वाषाढ़ा",
  "उत्तराषाढ़ा",
  "अभिजित्",
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वाभाद्रपद",
  "उत्तराभाद्रपद",
  "रेवती",
];

type SbcCell = { name: string; row: number; col: number };

/**
 * Nakshatra cells on the 9x9 board. Rows and columns are zero based, with
 * row 0 at the top and col 0 at the left. Only the 28 outer-ring nakshatra
 * cells are exported; the 7x7 interior is reserved for the other SBC vargas.
 */
const CELL_POSITIONS: Record<string, { row: number; col: number }> = {
  "अश्विनी": { row: 0, col: 6 },
  "भरणी": { row: 0, col: 7 },
  "कृत्तिका": { row: 1, col: 8 },
  "रोहिणी": { row: 2, col: 8 },
  "मृगशीर्ष": { row: 3, col: 8 },
  "आर्द्रा": { row: 4, col: 8 },
  "पुनर्वसु": { row: 5, col: 8 },
  "पुष्य": { row: 6, col: 8 },
  "आश्लेषा": { row: 7, col: 8 },
  "मघा": { row: 8, col: 7 },
  "पूर्वाफाल्गुनी": { row: 8, col: 6 },
  "उत्तराफाल्गुनी": { row: 8, col: 5 },
  "हस्त": { row: 8, col: 4 },
  "चित्रा": { row: 8, col: 3 },
  "स्वाती": { row: 8, col: 2 },
  "विशाखा": { row: 8, col: 1 },
  "अनुराधा": { row: 7, col: 0 },
  "ज्येष्ठा": { row: 6, col: 0 },
  "मूल": { row: 5, col: 0 },
  "पूर्वाषाढ़ा": { row: 4, col: 0 },
  "उत्तराषाढ़ा": { row: 3, col: 0 },
  "अभिजित्": { row: 2, col: 0 },
  "श्रवण": { row: 1, col: 0 },
  "धनिष्ठा": { row: 0, col: 1 },
  "शतभिषा": { row: 0, col: 2 },
  "पूर्वाभाद्रपद": { row: 0, col: 3 },
  "उत्तराभाद्रपद": { row: 0, col: 4 },
  "रेवती": { row: 0, col: 5 },
};

export const SBC_CELLS: SbcCell[] = SBC_NAKSHATRAS.map(name => ({
  name,
  ...CELL_POSITIONS[name],
}));

const DEG = 1;
const MIN = 1 / 60;
const SEC = 1 / 3600;
const ABHIJIT_START = 276 * DEG + 40 * MIN;
const ABHIJIT_END = 280 * DEG + 53 * MIN + 20 * SEC;

/**
 * Start longitudes of the SBC's unequal 28-star intervals. Abhijit is
 * explicitly 276°40′ through 280°53′20″; the adjacent Uttarashadha and
 * Shravana intervals consequently end/start at those same boundaries.
 */
const SBC_BOUNDARIES: number[] = [
  0,
  13 * DEG + 20 * MIN,
  26 * DEG + 40 * MIN,
  40 * DEG,
  53 * DEG + 20 * MIN,
  66 * DEG + 40 * MIN,
  80 * DEG,
  93 * DEG + 20 * MIN,
  106 * DEG + 40 * MIN,
  120 * DEG,
  133 * DEG + 20 * MIN,
  146 * DEG + 40 * MIN,
  160 * DEG,
  173 * DEG + 20 * MIN,
  186 * DEG + 40 * MIN,
  200 * DEG,
  213 * DEG + 20 * MIN,
  226 * DEG + 40 * MIN,
  240 * DEG,
  253 * DEG + 20 * MIN,
  266 * DEG + 40 * MIN,
  ABHIJIT_START,
  ABHIJIT_END,
  293 * DEG + 20 * MIN,
  306 * DEG + 40 * MIN,
  320 * DEG,
  333 * DEG + 20 * MIN,
  346 * DEG + 40 * MIN,
];

function normalizeLongitude(longitude: number): number {
  const value = longitude % 360;
  return value < 0 ? value + 360 : value;
}

/** Return the zero-based SBC nakshatra index for a sidereal longitude. */
export function nakshatra28(longitude: number): number {
  if (!Number.isFinite(longitude)) throw new RangeError("longitude must be finite");
  const value = normalizeLongitude(longitude);
  for (let index = SBC_BOUNDARIES.length - 1; index >= 0; index -= 1) {
    if (value >= SBC_BOUNDARIES[index]) return index;
  }
  return 0;
}

type Geometry = "forward" | "opposite" | "backward";
export type SbcDirection = "वाम" | "सम्मुख" | "दक्षिण";
export type SbcKind = "benefic" | "malefic" | "mixed";
export type SbcMode = "all-three" | "directional";

export type SbcVedha = {
  planet: string;
  source: string;
  target: string;
  direction: SbcDirection;
  kind: SbcKind;
  sourcePada?: number;
  targetPada?: number;
  navamsaVedha?: boolean;
};

const GEOMETRIES: Array<{ geometry: Geometry; direction: SbcDirection }> = [
  { geometry: "forward", direction: "वाम" },
  { geometry: "opposite", direction: "सम्मुख" },
  { geometry: "backward", direction: "दक्षिण" },
];

const PLANET_KEYS: Record<string, string> = {
  सूर्य: "sun",
  sun: "sun",
  surya: "sun",
  रवि: "sun",
  चंद्रमा: "moon",
  चन्द्रमा: "moon",
  moon: "moon",
  chandra: "moon",
  बुध: "mercury",
  mercury: "mercury",
  budha: "mercury",
  शुक्र: "venus",
  venus: "venus",
  shukra: "venus",
  मंगल: "mars",
  mars: "mars",
  mangal: "mars",
  गुरु: "jupiter",
  बृहस्पति: "jupiter",
  jupiter: "jupiter",
  guru: "jupiter",
  शनि: "saturn",
  saturn: "saturn",
  shani: "saturn",
  राहु: "rahu",
  rahu: "rahu",
  केतु: "ketu",
  ketu: "ketu",
};

const MOTION_ALIASES: Record<string, "retrograde" | "fast" | "slow" | "direct"> = {
  retrograde: "retrograde",
  vakri: "retrograde",
  वक्री: "retrograde",
  fast: "fast",
  शीघ्र: "fast",
  शीघ्री: "fast",
  अतिचारी: "fast",
  atichari: "fast",
  slow: "slow",
  मन्द: "slow",
  मंद: "slow",
  मध्यचारी: "slow",
  mandachari: "slow",
  mean: "slow",
  stationary: "slow",
  direct: "direct",
  मार्गी: "direct",
  margi: "direct",
};

function canonicalPlanet(name: string): string | undefined {
  return PLANET_KEYS[name.trim().toLowerCase()];
}

function kindFor(key: string): SbcKind {
  // Trade-Ratna, p. 39 (block B00058): Moon and Mercury have contextual
  // qualifications; the remaining classifications are fixed there.
  if (key === "moon" || key === "mercury") return "mixed";
  return key === "venus" || key === "jupiter" ? "benefic" : "malefic";
}

function cellAt(row: number, col: number): SbcCell | undefined {
  return SBC_CELLS.find(cell => cell.row === row && cell.col === col);
}

function diagonalTarget(source: SbcCell, geometry: Geometry): SbcCell {
  let row: number;
  let col: number;
  if (source.row === 0) {
    [row, col] = geometry === "forward" ? [1, 1] : geometry === "backward" ? [1, -1] : [1, 0];
  } else if (source.col === 8) {
    [row, col] = geometry === "forward" ? [1, -1] : geometry === "backward" ? [-1, -1] : [0, -1];
  } else if (source.row === 8) {
    [row, col] = geometry === "forward" ? [-1, -1] : geometry === "backward" ? [-1, 1] : [-1, 0];
  } else if (source.col === 0) {
    [row, col] = geometry === "forward" ? [-1, 1] : geometry === "backward" ? [1, 1] : [0, 1];
  } else {
    throw new RangeError(`Not an outer-ring SBC cell: ${source.name}`);
  }

  let nextRow = source.row + row;
  let nextCol = source.col + col;
  for (let steps = 0; steps < 9; steps += 1) {
    const target = cellAt(nextRow, nextCol);
    if (target) return target;
    nextRow += row;
    nextCol += col;
  }
  throw new Error(`No ${geometry} vedha target for ${source.name}`);
}

function geometryForPlanet(planet: Planet): Geometry {
  const candidate = planet as Planet & {
    motion?: unknown;
    motionType?: unknown;
    speedClass?: unknown;
    gati?: unknown;
  };
  const hint = [candidate.motion, candidate.motionType, candidate.speedClass, candidate.gati]
    .find(value => typeof value === "string") as string | undefined;
  const normalizedHint = hint?.trim().toLowerCase();
  const explicit = normalizedHint ? MOTION_ALIASES[normalizedHint] : undefined;

  if (planet.retrograde || planet.speed < 0 || explicit === "retrograde") return "backward";
  // No speed cutoff is asserted here. A caller that has the source's
  // fast/slow classification can pass it as motion/speedClass/gati.
  if (explicit === "fast" || explicit === "direct") return "forward";
  return "opposite";
}

/**
 * Calculate the geometric nakshatra vedhas for the nine classical planets.
 *
 * `all-three` returns the three conventional geometric relationships for
 * every planet. `directional` applies the supplied book's rule: Sun, Moon,
 * Rahu and Ketu always emit all three; the other five use retrograde/right,
 * fast/left, or slow/mean/front when an explicit motion class is available.
 * A bare positive ephemeris speed is not treated as "fast" because no
 * defensible numeric cutoff is supplied by the source.
 */
export function vedhas(snapshot: AstroSnapshot, mode: SbcMode = "all-three"): SbcVedha[] {
  const result: SbcVedha[] = [];
  for (const planet of snapshot.planets) {
    const key = canonicalPlanet(planet.name);
    if (!key) continue;
    if (!Number.isFinite(planet.longitude)) continue;

    const source = SBC_NAKSHATRAS[nakshatra28(planet.longitude)];
    const sourceCell = CELL_POSITIONS[source];
    if (!sourceCell) continue;
    const sourceValue: SbcCell = { name: source, ...sourceCell };
    const alwaysThree = key === "sun" || key === "moon" || key === "rahu" || key === "ketu";
    const motionPlanet = planet as Planet & { motion?: string; motionType?: string; speedClass?: string; gati?: string };
    const hint = [motionPlanet.motion, motionPlanet.motionType, motionPlanet.speedClass, motionPlanet.gati].find(value => typeof value === "string" && value.trim());
    const knownClass = hint ? Boolean(MOTION_ALIASES[hint.trim().toLowerCase()]) : false;
    const unknownDirect = !planet.retrograde && planet.speed >= 0 && !knownClass;
    const selected = mode === "all-three" || alwaysThree || unknownDirect
      ? GEOMETRIES
      : [{ geometry: geometryForPlanet(planet), direction: "सम्मुख" as SbcDirection }];

    for (const item of selected) {
      const direction = mode === "directional" && !alwaysThree && !unknownDirect
        ? item.geometry === "forward"
          ? "वाम"
          : item.geometry === "backward"
            ? "दक्षिण"
            : "सम्मुख"
        : item.direction;
      result.push({
        planet: planet.name,
        source,
        target: diagonalTarget(sourceValue, item.geometry).name,
        direction,
        kind: kindFor(key),
        sourcePada: Number.isInteger(planet.pada) ? planet.pada : undefined,
        targetPada: direction === "सम्मुख" && Number.isInteger(planet.pada) ? 5 - planet.pada : undefined,
        navamsaVedha: direction === "सम्मुख" && Number.isInteger(planet.pada),
      });
    }
  }
  return result;
}

export const SBC_ABHIJIT_START = ABHIJIT_START;
export const SBC_ABHIJIT_END = ABHIJIT_END;
