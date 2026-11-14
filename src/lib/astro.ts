import { DateTime } from "luxon";
import SwissEPH from "sweph-wasm";

export const RASHIS: string[] = [
  "मेष",
  "वृषभ",
  "मिथुन",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्चिक",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

export const NAKSHATRAS: string[] = [
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

export type Planet = {
  name: string;
  id: number;
  longitude: number;
  tropical: number;
  speed: number;
  sign: number;
  nakshatra: number;
  pada: number;
  retrograde: boolean;
  latitude: number;
};

export type AstroSnapshot = {
  iso: string;
  jd: number;
  ayanamsa: number;
  planets: Planet[];
  ascendant: number;
  ascSign: number;
  tithi: number;
  paksha: string;
  yoga: string;
  karana: string;
  weekday: number;
  sunrise: string | null;
  sunset: string | null;
  hora: { planet: string; start: string; end: string } | null;
  engine: string;
};

type EngineFactory = () => Promise<SwissEPH>;
type AstroRuntime = typeof globalThis & {
  /** Node-only test injection; never used by the browser build. */
  __ASTRO_SWISS_ENGINE__?: EngineFactory;
};

type SolarEvents = {
  sunrise: DateTime | null;
  sunset: DateTime | null;
};

const DAY_MS = 86_400_000;
const UNIX_JD = 2_440_587.5;
const SUPPORTED_FROM = 1800;
const SUPPORTED_TO = 2399;
const EPHEMERIS_FILES = ["sepl_18.se1", "semo_18.se1"];
const SOLAR_CACHE = new Map<string, SolarEvents>();

const PLANET_NAMES: Record<number, string> = {
  0: "सूर्य",
  1: "चंद्रमा",
  2: "बुध",
  3: "शुक्र",
  4: "मंगल",
  5: "गुरु",
  6: "शनि",
  7: "यूरेनस",
  8: "नेपच्यून",
  9: "प्लूटो",
  10: "राहु",
};

const HORA_SEQUENCE = ["सूर्य", "शुक्र", "बुध", "चंद्रमा", "शनि", "गुरु", "मंगल"];
const DAY_RULER_BY_WEEKDAY = ["सूर्य", "चंद्रमा", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
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

let enginePromise: Promise<SwissEPH> | null = null;

function normalize(degrees: number): number {
  const value = degrees % 360;
  return value < 0 ? value + 360 : value;
}

function localDateFor(date: Date, zone: string): DateTime {
  const local = DateTime.fromJSDate(date).setZone(zone);
  if (!local.isValid) {
    throw new RangeError(`Invalid IANA timezone or date: ${zone}`);
  }
  if (local.year < SUPPORTED_FROM || local.year > SUPPORTED_TO) {
    throw new RangeError(
      `Swiss Ephemeris browser assets support local dates from ${SUPPORTED_FROM} through ${SUPPORTED_TO}; received ${local.toISODate()}`,
    );
  }
  return local;
}

function utcJulianDay(swe: SwissEPH, date: Date): number {
  const hour =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() / 3_600_000;
  return swe.swe_julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    hour,
    swe.SE_GREG_CAL,
  );
}

function localMidnightJulianDay(swe: SwissEPH, localDate: DateTime): number {
  const midnight = DateTime.fromObject(
    { year: localDate.year, month: localDate.month, day: localDate.day, hour: 0 },
    { zone: localDate.zoneName ?? "UTC" },
  ).toUTC();
  return utcJulianDay(swe, midnight.toJSDate());
}

function dateTimeFromJulian(jd: number | null, zone: string): DateTime | null {
  if (jd === null || !Number.isFinite(jd) || jd < 2_300_000 || jd > 2_600_000) return null;
  const result = DateTime.fromMillis((jd - UNIX_JD) * DAY_MS, { zone: "utc" }).setZone(zone);
  return result.isValid ? result : null;
}

function clock(value: DateTime | null): string | null {
  return value?.toFormat("HH:mm") ?? null;
}

function riseOrSetOrNull(
  swe: SwissEPH,
  startJd: number,
  rsmi: number,
  geopos: [number, number, number],
): number | null {
  try {
    return swe.swe_rise_trans(startJd, swe.SE_SUN, null, swe.SEFLG_SWIEPH, rsmi, geopos, 0, 0);
  } catch (error: unknown) {
    // Swiss Ephemeris uses -2 for a circumpolar object with no event on the
    // requested day. Other errors must remain visible to callers.
    const flag = error && typeof error === "object" && "flag" in error ? (error as { flag?: unknown }).flag : undefined;
    if (flag === -2) return null;
    throw error;
  }
}

async function createBrowserEngine(): Promise<SwissEPH> {
  const runtime = import.meta.env;
  const base = runtime?.BASE_URL ?? "/";
  const wasmPath = `${base}swisseph.wasm`;
  const ephePath = `${base}ephe/`;
  const swe = await SwissEPH.init(wasmPath);
  await swe.swe_set_ephe_path(ephePath, EPHEMERIS_FILES);

  // swe_set_ephe_path rejects an empty download, but verify both required local
  // files as well so a partial/static-host failure is never silently accepted.
  for (const file of EPHEMERIS_FILES) {
    if (!swe.wasm.FS.analyzePath(`/ephe/${file}`).exists) {
      throw new Error(`Swiss Ephemeris asset was not loaded: ${file}`);
    }
  }
  return swe;
}

async function getEngine(): Promise<SwissEPH> {
  if (!enginePromise) {
    const injected = (globalThis as AstroRuntime).__ASTRO_SWISS_ENGINE__;
    enginePromise = (injected ? injected() : createBrowserEngine()).catch(error => {
      enginePromise = null;
      throw error;
    });
  }
  return enginePromise;
}

function makePlanet(
  name: string,
  id: number,
  tropical: number,
  latitude: number,
  speed: number,
  ayanamsa: number,
  siderealLongitude?: number,
): Planet {
  const longitude = normalize(siderealLongitude ?? tropical - ayanamsa);
  const sign = Math.min(11, Math.floor(longitude / 30));
  const nakshatra = Math.min(26, Math.floor(longitude / (360 / 27)));
  const pada = Math.min(4, Math.floor((longitude % (360 / 27)) / (360 / 108)) + 1);
  return {
    name,
    id,
    longitude,
    tropical,
    speed,
    sign,
    nakshatra,
    pada,
    retrograde: speed < 0,
    latitude,
  };
}

function getSolarEvents(swe: SwissEPH, date: DateTime, lat: number, lon: number): SolarEvents {
  const zone = date.zoneName ?? "UTC";
  const key = `${date.toISODate()}|${lat.toFixed(6)}|${lon.toFixed(6)}|${zone}`;
  const cached = SOLAR_CACHE.get(key);
  if (cached) return cached;

  const startJd = localMidnightJulianDay(swe, date);
  const geopos: [number, number, number] = [lon, lat, 0];
  const rise = riseOrSetOrNull(swe, startJd, swe.SE_CALC_RISE | swe.SE_BIT_DISC_CENTER, geopos);
  const set = riseOrSetOrNull(swe, startJd, swe.SE_CALC_SET | swe.SE_BIT_DISC_CENTER, geopos);
  const events = {
    sunrise: dateTimeFromJulian(rise, zone),
    sunset: dateTimeFromJulian(set, zone),
  };
  SOLAR_CACHE.set(key, events);
  return events;
}

function horaFor(
  swe: SwissEPH,
  date: Date,
  local: DateTime,
  lat: number,
  lon: number,
): { planet: string; start: string; end: string } | null {
  const today = DateTime.fromObject(
    { year: local.year, month: local.month, day: local.day },
    { zone: local.zoneName ?? "UTC" },
  );
  const zone = local.zoneName ?? "UTC";
  const todayEvents = getSolarEvents(swe, today, lat, lon);
  if (!todayEvents.sunrise || !todayEvents.sunset) return null;

  let start: DateTime;
  let end: DateTime;
  let index: number;
  const weekday = local.weekday % 7;
  const rulerIndex = HORA_SEQUENCE.indexOf(DAY_RULER_BY_WEEKDAY[weekday]);

  if (local.toMillis() >= todayEvents.sunrise.toMillis() && local.toMillis() < todayEvents.sunset.toMillis()) {
    const daylight = todayEvents.sunset.toMillis() - todayEvents.sunrise.toMillis();
    const part = daylight / 12;
    const hour = Math.min(11, Math.floor((local.toMillis() - todayEvents.sunrise.toMillis()) / part));
    start = DateTime.fromMillis(todayEvents.sunrise.toMillis() + hour * part).setZone(zone);
    end = DateTime.fromMillis(todayEvents.sunrise.toMillis() + (hour + 1) * part).setZone(zone);
    index = (rulerIndex + hour) % 7;
  } else if (local.toMillis() >= todayEvents.sunset.toMillis()) {
    const tomorrow = today.plus({ days: 1 });
    const next = getSolarEvents(swe, tomorrow, lat, lon);
    if (!next.sunrise) return null;
    const night = next.sunrise.toMillis() - todayEvents.sunset.toMillis();
    const part = night / 12;
    const hour = Math.min(11, Math.floor((local.toMillis() - todayEvents.sunset.toMillis()) / part));
    start = DateTime.fromMillis(todayEvents.sunset.toMillis() + hour * part).setZone(zone);
    end = DateTime.fromMillis(todayEvents.sunset.toMillis() + (hour + 1) * part).setZone(zone);
    index = (rulerIndex + 12 + hour) % 7;
  } else {
    const yesterday = today.minus({ days: 1 });
    const previous = getSolarEvents(swe, yesterday, lat, lon);
    if (!previous.sunset) return null;
    const night = todayEvents.sunrise.toMillis() - previous.sunset.toMillis();
    const part = night / 12;
    const hour = Math.min(11, Math.floor((local.toMillis() - previous.sunset.toMillis()) / part));
    start = DateTime.fromMillis(previous.sunset.toMillis() + hour * part).setZone(zone);
    end = DateTime.fromMillis(previous.sunset.toMillis() + (hour + 1) * part).setZone(zone);
    const previousWeekday = (weekday + 6) % 7;
    const previousRuler = HORA_SEQUENCE.indexOf(DAY_RULER_BY_WEEKDAY[previousWeekday]);
    index = (previousRuler + 12 + hour) % 7;
  }

  return { planet: HORA_SEQUENCE[index], start: start.toFormat("HH:mm"), end: end.toFormat("HH:mm") };
}

function karanaFor(elongation: number): string {
  const halfTithi = Math.floor(normalize(elongation) / 6);
  if (halfTithi === 0) return "किंस्तुघ्न";
  if (halfTithi >= 57) return FIXED_KARANAS[halfTithi - 57];
  return MOVING_KARANAS[(halfTithi - 1) % MOVING_KARANAS.length];
}

export async function calculateAstro(date: Date, lat: number, lon: number, zone: string): Promise<AstroSnapshot> {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new RangeError("date must be a valid Date");
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new RangeError("latitude must be between -90 and 90");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError("longitude must be between -180 and 180");

  const local = localDateFor(date, zone);
  const swe = await getEngine();
  swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
  const jd = utcJulianDay(swe, date);
  const ayanamsa = swe.swe_get_ayanamsa_ut(jd);
  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

  const definitions: Array<[string, number]> = [
    [PLANET_NAMES[0], swe.SE_SUN],
    [PLANET_NAMES[1], swe.SE_MOON],
    [PLANET_NAMES[2], swe.SE_MERCURY],
    [PLANET_NAMES[3], swe.SE_VENUS],
    [PLANET_NAMES[4], swe.SE_MARS],
    [PLANET_NAMES[5], swe.SE_JUPITER],
    [PLANET_NAMES[6], swe.SE_SATURN],
  ];
  const planetary = definitions.map(([name, id]) => {
    const data = swe.swe_calc_ut(jd, id, flags);
    const sidereal = swe.swe_calc_ut(jd, id, flags | swe.SEFLG_SIDEREAL);
    return makePlanet(name, id, normalize(data[0]), sidereal[1], sidereal[3], ayanamsa, sidereal[0]);
  });
  const nodeData = swe.swe_calc_ut(jd, swe.SE_MEAN_NODE, flags);
  const nodeSidereal = swe.swe_calc_ut(jd, swe.SE_MEAN_NODE, flags | swe.SEFLG_SIDEREAL);
  const rahu = makePlanet(PLANET_NAMES[10], swe.SE_MEAN_NODE, normalize(nodeData[0]), nodeSidereal[1], nodeSidereal[3], ayanamsa, nodeSidereal[0]);
  const ketu = makePlanet(
    "केतु",
    swe.SE_MEAN_NODE,
    normalize(nodeData[0] + 180),
    -nodeData[1],
    nodeData[3],
    ayanamsa,
    nodeSidereal[0] + 180,
  );
  const outerDefinitions: Array<[string, number]> = [
    [PLANET_NAMES[7], swe.SE_URANUS],
    [PLANET_NAMES[8], swe.SE_NEPTUNE],
    [PLANET_NAMES[9], swe.SE_PLUTO],
  ];
  const outer = outerDefinitions.map(([name, id]) => {
    const data = swe.swe_calc_ut(jd, id, flags);
    const sidereal = swe.swe_calc_ut(jd, id, flags | swe.SEFLG_SIDEREAL);
    return makePlanet(name, id, normalize(data[0]), sidereal[1], sidereal[3], ayanamsa, sidereal[0]);
  });
  const planets = [...planetary, rahu, ketu, ...outer];
  const sun = planetary[0];
  const moon = planetary[1];
  const elongation = normalize(moon.longitude - sun.longitude);
  const yogaIndex = Math.floor(normalize(moon.longitude + sun.longitude) / (360 / 27));

  // W is Swiss Ephemeris' whole-sign house system. In sidereal mode the
  // returned ascmc[0] is the sidereal ascendant, not a hand approximation.
  const houses = swe.swe_houses_ex2(jd, swe.SEFLG_SIDEREAL, lat, lon, "W");
  const ascendant = normalize(houses.ascmc[0]);
  const events = getSolarEvents(swe, local, lat, lon);

  return {
    iso: date.toISOString(),
    jd,
    ayanamsa,
    planets,
    ascendant,
    ascSign: Math.min(11, Math.floor(ascendant / 30)),
    tithi: Math.floor(elongation / 12) + 1,
    paksha: elongation < 180 ? "शुक्ल पक्ष" : "कृष्ण पक्ष",
    yoga: YOGA_NAMES[Math.min(26, yogaIndex)],
    karana: karanaFor(elongation),
    weekday: local.weekday % 7,
    sunrise: clock(events.sunrise),
    sunset: clock(events.sunset),
    hora: horaFor(swe, date, local, lat, lon),
    engine: `Swiss Ephemeris ${swe.swe_version()} WASM`,
  };
}
