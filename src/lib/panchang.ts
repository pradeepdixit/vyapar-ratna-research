import { DateTime } from "luxon";
import { calculateAstro, calculateLunarEvents, type AstroSnapshot } from "./astro";

/** A local-time interval represented by precise ISO instants and display clocks. */
export type PanchangWindow = {
  start: string;
  end: string;
  startClock: string;
  endClock: string;
};

/** A panchanga limb that has an optional next-transition instant. */
export type PanchangLimb = {
  index: number;
  name: string;
  endsAt: string | null;
};

export type PanchangTithi = PanchangLimb & {
  number: number;
  paksha: "शुक्ल पक्ष" | "कृष्ण पक्ष";
};

export type PanchangNakshatra = PanchangLimb & {
  pada: number;
};

export type PanchangVara = {
  index: number;
  name: string;
  civilWeekday: number;
  sunriseBased: boolean;
  startsAt: string | null;
};

export type PanchangSolarEvents = {
  sunrise: { at: string; clock: string } | null;
  sunset: { at: string; clock: string } | null;
  daytimeDurationMinutes: number | null;
  rahuKalam: PanchangWindow | null;
  gulikaKalam: PanchangWindow | null;
  yamaganda: PanchangWindow | null;
  abhijitMuhurta: PanchangWindow | null;
  brahmaMuhurta: PanchangWindow | null;
};

/**
 * Practical, location-aware panchanga result for the instant represented by
 * the supplied AstroSnapshot. ISO values are local-zone ISO strings, while
 * the convenience sunrise/sunset fields retain the existing HH:mm contract.
 *
 * The four `endsAt` values are the next transition after the supplied instant,
 * found from the same Swiss Ephemeris calculation used by calculateAstro.
 */
export type PanchangResult = {
  iso: string;
  localDate: string;
  zone: string;
  sunrise: string | null;
  sunset: string | null;
  tithi: PanchangTithi;
  vara: PanchangVara;
  nakshatra: PanchangNakshatra;
  yoga: PanchangLimb;
  karana: PanchangLimb;
  solar: PanchangSolarEvents;
  moonrise: string | null;
  moonset: string | null;
  /** Regional religious-calendar decisions are scoped separately. */
  limitations: string[];
};

type Phase = "tithi" | "nakshatra" | "yoga" | "karana";
type PhaseSnapshot = { at: Date; value: number };

type PlanetLike = { name: string; longitude: number };

const MAX_SEARCH_MS = 48 * 60 * 60 * 1000;
const SAMPLE_COUNT = 30;
const BISECTION_STEPS = 26;
const PHASE_SIZE: Record<Phase, number> = {
  tithi: 12,
  nakshatra: 360 / 27,
  yoga: 360 / 27,
  karana: 6,
};

const TITHI_NAMES = [
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पंचमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पूर्णिमा",
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पंचमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "अमावस्या",
];

const NAKSHATRAS = [
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
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वाभाद्रपद",
  "उत्तराभाद्रपद",
  "रेवती",
];

const YOGA_NAMES = [
  "विष्कम्भ",
  "प्रीति",
  "आयुष्मान",
  "सौभाग्य",
  "शोभन",
  "अतिगण्ड",
  "सुकर्मा",
  "धृति",
  "शूल",
  "गण्ड",
  "वृद्धि",
  "ध्रुव",
  "व्याघात",
  "हर्षण",
  "वज्र",
  "सिद्धि",
  "व्यतीपात",
  "वरीयान",
  "परिघ",
  "शिव",
  "सिद्ध",
  "साध्य",
  "शुभ",
  "शुक्ल",
  "ब्रह्म",
  "इन्द्र",
  "वैधृति",
];

const MOVING_KARANAS = ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि"];
const FIXED_KARANAS = ["शकुनि", "चतुष्पद", "नाग"];
const VARA_NAMES = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

// Segment numbers are zero-based; the traditional tables are 1..8.
const RAHU_SEGMENT = [7, 1, 6, 4, 5, 3, 2];
const GULIKA_SEGMENT = [6, 5, 4, 3, 2, 1, 0];
const YAMAGANDA_SEGMENT = [4, 3, 2, 1, 0, 6, 5];

function normalize(degrees: number): number {
  const value = degrees % 360;
  return value < 0 ? value + 360 : value;
}

function planet(snapshot: AstroSnapshot, name: string): PlanetLike {
  const found = snapshot.planets.find(candidate => candidate.name === name);
  if (!found || !Number.isFinite(found.longitude)) {
    throw new RangeError(`AstroSnapshot is missing a finite ${name} longitude`);
  }
  return found;
}

function phaseValue(snapshot: AstroSnapshot, phase: Phase): number {
  const sun = planet(snapshot, "सूर्य");
  const moon = planet(snapshot, "चंद्रमा");
  if (phase === "tithi" || phase === "karana") return normalize(moon.longitude - sun.longitude);
  if (phase === "nakshatra") return normalize(moon.longitude);
  return normalize(moon.longitude + sun.longitude);
}

function phaseIndex(value: number, phase: Phase): number {
  return Math.min(Math.floor(value / PHASE_SIZE[phase]), phase === "tithi" ? 29 : phase === "karana" ? 59 : 26);
}

function karanaName(index: number): string {
  if (index === 0) return "किंस्तुघ्न";
  if (index >= 57) return FIXED_KARANAS[index - 57] ?? "नाग";
  return MOVING_KARANAS[(index - 1) % MOVING_KARANAS.length] ?? "विष्टि";
}

function localInstant(iso: string, zone: string): DateTime {
  const instant = DateTime.fromISO(iso, { setZone: true });
  if (!instant.isValid) throw new RangeError(`AstroSnapshot.iso is not a valid ISO instant: ${iso}`);
  const local = instant.setZone(zone);
  if (!local.isValid) throw new RangeError(`Invalid IANA timezone: ${zone}`);
  return local;
}

function isoAt(date: Date, zone: string): string {
  const value = DateTime.fromJSDate(date, { zone: "utc" }).setZone(zone).toISO();
  if (!value) throw new Error("Unable to format local ISO instant");
  return value;
}

function clockAt(date: Date, zone: string): string {
  return DateTime.fromJSDate(date, { zone: "utc" }).setZone(zone).toFormat("HH:mm");
}

function clockOnDate(date: DateTime, clock: string): DateTime | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(clock)) return null;
  const [hour, minute] = clock.split(":").map(Number);
  const result = DateTime.fromObject(
    { year: date.year, month: date.month, day: date.day, hour, minute, second: 0, millisecond: 0 },
    { zone: date.zoneName ?? "UTC" },
  );
  return result.isValid ? result : null;
}

function solarClock(localDate: DateTime, clock: string | null): DateTime | null {
  return clock ? clockOnDate(localDate, clock) : null;
}

function windowFor(start: DateTime, end: DateTime, zone: string): PanchangWindow {
  return {
    start: start.setZone(zone).toISO() ?? start.toISO() ?? "",
    end: end.setZone(zone).toISO() ?? end.toISO() ?? "",
    startClock: start.setZone(zone).toFormat("HH:mm"),
    endClock: end.setZone(zone).toFormat("HH:mm"),
  };
}

function daylightWindow(sunrise: DateTime | null, sunset: DateTime | null, segment: number, zone: string): PanchangWindow | null {
  if (!sunrise || !sunset || sunset.toMillis() <= sunrise.toMillis()) return null;
  const part = (sunset.toMillis() - sunrise.toMillis()) / 8;
  return windowFor(
    DateTime.fromMillis(sunrise.toMillis() + segment * part).setZone(zone),
    DateTime.fromMillis(sunrise.toMillis() + (segment + 1) * part).setZone(zone),
    zone,
  );
}

function solarEvents(snapshot: AstroSnapshot, local: DateTime, zone: string): PanchangSolarEvents {
  const sunrise = solarClock(local, snapshot.sunrise);
  const sunset = solarClock(local, snapshot.sunset);
  const daytimeDurationMinutes = sunrise && sunset ? (sunset.toMillis() - sunrise.toMillis()) / 60_000 : null;
  const abhijitPart = sunrise && sunset && daytimeDurationMinutes !== null && daytimeDurationMinutes > 0
    ? (sunset.toMillis() - sunrise.toMillis()) / 15
    : null;
  const abhijitMuhurta = abhijitPart === null || !sunrise || !sunset
    ? null
    : windowFor(
        DateTime.fromMillis(sunrise.toMillis() + abhijitPart * 7).setZone(zone),
        DateTime.fromMillis(sunrise.toMillis() + abhijitPart * 8).setZone(zone),
        zone,
      );
  const brahmaMuhurta = sunrise
    ? windowFor(sunrise.minus({ minutes: 96 }), sunrise.minus({ minutes: 48 }), zone)
    : null;
  const civilWeekday = local.weekday % 7;
  return {
    sunrise: sunrise ? { at: sunrise.toISO() ?? "", clock: sunrise.toFormat("HH:mm") } : null,
    sunset: sunset ? { at: sunset.toISO() ?? "", clock: sunset.toFormat("HH:mm") } : null,
    daytimeDurationMinutes,
    rahuKalam: daylightWindow(sunrise, sunset, RAHU_SEGMENT[civilWeekday] ?? 0, zone),
    gulikaKalam: daylightWindow(sunrise, sunset, GULIKA_SEGMENT[civilWeekday] ?? 0, zone),
    yamaganda: daylightWindow(sunrise, sunset, YAMAGANDA_SEGMENT[civilWeekday] ?? 0, zone),
    abhijitMuhurta,
    brahmaMuhurta,
  };
}

function forwardDelta(start: number, current: number): number {
  return normalize(current - start);
}

/**
 * Search a single monotone angular boundary. The shared grid caps expensive
 * full AstroSnapshot calls at 30 before each boundary gets a short bisection.
 */
async function nextBoundary(
  phase: Phase,
  samples: PhaseSnapshot[],
  snapshotAt: (at: Date) => Promise<AstroSnapshot>,
): Promise<Date | null> {
  const start = samples[0];
  if (!start) return null;
  const size = PHASE_SIZE[phase];
  const offset = start.value % size;
  const targetDelta = size - offset > 1e-9 ? size - offset : size;
  let previous = start;
  let previousProgress = 0;
  let upper: PhaseSnapshot | null = null;
  for (const sample of samples.slice(1)) {
    const progress = forwardDelta(start.value, sample.value);
    if (progress + 1e-8 >= targetDelta) {
      upper = sample;
      break;
    }
    previous = sample;
    previousProgress = progress;
  }
  if (!upper) return null;

  let low = previous.at.getTime();
  let high = upper.at.getTime();
  const target = targetDelta;
  for (let iteration = 0; iteration < BISECTION_STEPS; iteration += 1) {
    const middle = Math.floor((low + high) / 2);
    const middleSnapshot = await snapshotAt(new Date(middle));
    const middleProgress = forwardDelta(start.value, phaseValue(middleSnapshot, phase));
    if (middleProgress + 1e-10 >= target) high = middle;
    else low = middle;
  }
  // Keep the local variable useful as an assertion aid in debugging and make
  // the bracket invariant explicit without adding another ephemeris call.
  void previousProgress;
  return new Date(high);
}

async function sunriseBasedVara(
  local: DateTime,
  sunrise: DateTime | null,
  snapshot: AstroSnapshot,
  lat: number,
  lon: number,
  zone: string,
): Promise<PanchangVara> {
  const civilWeekday = local.weekday % 7;
  if (!sunrise) {
    return {
      index: civilWeekday,
      name: VARA_NAMES[civilWeekday] ?? "",
      civilWeekday,
      sunriseBased: false,
      startsAt: null,
    };
  }
  if (local.toMillis() >= sunrise.toMillis()) {
    return {
      index: civilWeekday,
      name: VARA_NAMES[civilWeekday] ?? "",
      civilWeekday,
      sunriseBased: true,
      startsAt: sunrise.toISO(),
    };
  }

  const previousDate = local.minus({ days: 1 });
  const previousNoon = DateTime.fromObject(
    { year: previousDate.year, month: previousDate.month, day: previousDate.day, hour: 12 },
    { zone },
  );
  const previous = await calculateAstro(previousNoon.toJSDate(), lat, lon, zone);
  const previousSunrise = solarClock(previousDate, previous.sunrise);
  const previousWeekday = previousDate.weekday % 7;
  return {
    index: previousWeekday,
    name: VARA_NAMES[previousWeekday] ?? "",
    civilWeekday,
    sunriseBased: previousSunrise !== null,
    startsAt: previousSunrise?.toISO() ?? null,
  };
}

/**
 * Expand an existing AstroSnapshot into a practical five-limb panchanga.
 * No second Swiss engine is exposed here: boundary refinement reuses the
 * public calculateAstro function and therefore remains compatible with the
 * native test-engine injection already used by scripts/astro-test.ts.
 */
export async function calculatePanchang(
  snapshot: AstroSnapshot,
  lat: number,
  lon: number,
  zone: string,
): Promise<PanchangResult> {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new RangeError("latitude must be between -90 and 90");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError("longitude must be between -180 and 180");
  if (!snapshot || typeof snapshot !== "object") throw new RangeError("snapshot must be an AstroSnapshot");
  const local = localInstant(snapshot.iso, zone);
  const sun = planet(snapshot, "सूर्य");
  const moon = planet(snapshot, "चंद्रमा");
  const elongation = normalize(moon.longitude - sun.longitude);
  const sunMoonSum = normalize(moon.longitude + sun.longitude);
  const tithiIndex = phaseIndex(elongation, "tithi");
  const nakshatraIndex = phaseIndex(moon.longitude, "nakshatra");
  const yogaIndex = phaseIndex(sunMoonSum, "yoga");
  const karanaIndex = phaseIndex(elongation, "karana");
  const tithiNumber = tithiIndex + 1;
  const paksha = tithiNumber <= 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";
  const pada = Math.min(4, Math.floor((normalize(moon.longitude) % (360 / 27)) / (360 / 108)) + 1);
  const sunrise = solarClock(local, snapshot.sunrise);

  const sourceDate = new Date(snapshot.iso);
  if (Number.isNaN(sourceDate.getTime())) throw new RangeError("snapshot.iso must represent a valid Date");
  const phaseSamples: Record<Phase, PhaseSnapshot[]> = {
    tithi: [{ at: sourceDate, value: elongation }],
    nakshatra: [{ at: sourceDate, value: normalize(moon.longitude) }],
    yoga: [{ at: sourceDate, value: sunMoonSum }],
    karana: [{ at: sourceDate, value: elongation }],
  };
  const cache = new Map<number, AstroSnapshot>([[sourceDate.getTime(), snapshot]]);
  const snapshotAt = async (at: Date): Promise<AstroSnapshot> => {
    const key = at.getTime();
    const cached = cache.get(key);
    if (cached) return cached;
    const result = await calculateAstro(at, lat, lon, zone);
    cache.set(key, result);
    return result;
  };

  // A single 30-point grid is shared by all four limbs. The first crossing
  // is then refined independently, so no unbounded minute-by-minute scan is used.
  for (let sampleNumber = 1; sampleNumber <= SAMPLE_COUNT; sampleNumber += 1) {
    const at = new Date(sourceDate.getTime() + (MAX_SEARCH_MS * sampleNumber) / SAMPLE_COUNT);
    const sampled = await snapshotAt(at);
    phaseSamples.tithi.push({ at, value: phaseValue(sampled, "tithi") });
    phaseSamples.nakshatra.push({ at, value: phaseValue(sampled, "nakshatra") });
    phaseSamples.yoga.push({ at, value: phaseValue(sampled, "yoga") });
    phaseSamples.karana.push({ at, value: phaseValue(sampled, "karana") });
  }

  const [tithiEnd, nakshatraEnd, yogaEnd, karanaEnd] = [
    await nextBoundary("tithi", phaseSamples.tithi, snapshotAt),
    await nextBoundary("nakshatra", phaseSamples.nakshatra, snapshotAt),
    await nextBoundary("yoga", phaseSamples.yoga, snapshotAt),
    await nextBoundary("karana", phaseSamples.karana, snapshotAt),
  ];
  const vara = await sunriseBasedVara(local, sunrise, snapshot, lat, lon, zone);
  const solar = solarEvents(snapshot, local, zone);
  const lunar = await calculateLunarEvents(sourceDate, lat, lon, zone);
  const end = (at: Date | null): string | null => (at ? isoAt(at, zone) : null);

  return {
    iso: snapshot.iso,
    localDate: local.toISODate() ?? "",
    zone,
    sunrise: snapshot.sunrise,
    sunset: snapshot.sunset,
    tithi: { index: tithiIndex, number: tithiNumber, name: TITHI_NAMES[tithiIndex] ?? "", paksha, endsAt: end(tithiEnd) },
    vara,
    nakshatra: { index: nakshatraIndex, name: NAKSHATRAS[nakshatraIndex] ?? "", pada, endsAt: end(nakshatraEnd) },
    yoga: { index: yogaIndex, name: YOGA_NAMES[yogaIndex] ?? "", endsAt: end(yogaEnd) },
    karana: { index: karanaIndex, name: karanaName(karanaIndex), endsAt: end(karanaEnd) },
    solar,
    moonrise: lunar.moonrise,
    moonset: lunar.moonset,
    limitations: [
      "Lunar rise/set uses local civil date and disc-center/refraction convention; some days have no event.",
      "Lunar month, ayana, ritu, festival observance, adhika month, and regional religious rules are intentionally not inferred from five limbs alone.",
      "At polar no-rise/no-set locations, solar periods are null and vara falls back to the civil weekday with sunriseBased=false.",
    ],
  };
}
