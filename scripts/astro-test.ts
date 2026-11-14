import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import SwissEPH from "sweph-wasm";
import wasmFactory from "sweph-wasm/wasm/swisseph";
import { calculateAstro } from "../src/lib/astro";

type SwissModule = Awaited<ReturnType<typeof wasmFactory>>;

type AstroRuntime = typeof globalThis & {
  __ASTRO_SWISS_ENGINE__?: () => Promise<SwissEPH>;
};

const root = fileURLToPath(new URL("..", import.meta.url));
const assets = join(root, "public");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

async function localEngine(): Promise<SwissEPH> {
  const wasmBinary = new Uint8Array(await readFile(join(assets, "swisseph.wasm")));
  const module: SwissModule = await wasmFactory({ wasmBinary });
  const swe = new SwissEPH(module);
  module.FS.mkdir("/ephe");
  for (const file of ["sepl_18.se1", "semo_18.se1"]) {
    module.FS.createDataFile("/ephe", file, await readFile(join(assets, "ephe", file)), true, true, true);
  }
  const path = "/ephe\0";
  const pointer = module._malloc(path.length);
  module.stringToUTF8(path, pointer, path.length);
  module._swe_set_ephe_path(pointer);
  module._free(pointer);
  assert(module.FS.analyzePath("/ephe/sepl_18.se1").exists, "planetary ephemeris is loaded");
  assert(module.FS.analyzePath("/ephe/semo_18.se1").exists, "lunar ephemeris is loaded");
  return swe;
}

(globalThis as AstroRuntime).__ASTRO_SWISS_ENGINE__ = localEngine;

const delhi = { lat: 28.6139, lon: 77.209, zone: "Asia/Kolkata" };
const greenwich = { lat: 51.4779, lon: 0, zone: "Europe/London" };
const sunAries = await calculateAstro(new Date("2024-04-14T12:00:00Z"), delhi.lat, delhi.lon, delhi.zone);
const sunTaurus = await calculateAstro(new Date("2024-05-15T12:00:00Z"), delhi.lat, delhi.lon, delhi.zone);
const oneMinuteEarlier = await calculateAstro(new Date("2024-04-14T11:59:00Z"), greenwich.lat, greenwich.lon, greenwich.zone);
const oneMinuteLater = await calculateAstro(new Date("2024-04-14T12:00:00Z"), greenwich.lat, greenwich.lon, greenwich.zone);
const istMidnight = await calculateAstro(new Date("2024-01-15T00:30:00Z"), delhi.lat, delhi.lon, delhi.zone);
const polar = await calculateAstro(new Date("2024-06-21T12:00:00Z"), 90, 0, "UTC");

const sun = sunAries.planets.find((planet) => planet.name === "सूर्य");
const moon = sunAries.planets.find((planet) => planet.name === "चंद्रमा");
const rahu = sunAries.planets.find((planet) => planet.name === "राहु");
const ketu = sunAries.planets.find((planet) => planet.name === "केतु");
assert(sun && moon && rahu && ketu, "all luminaries and nodes are present");
assert(sun.sign === 0, `sidereal Sun is Aries on 2024-04-14 (got sign ${sun.sign})`);
const laterSun = sunTaurus.planets.find((planet) => planet.name === "सूर्य");
assert(laterSun?.sign === 1, `sidereal Sun is Taurus on 2024-05-15 (got sign ${laterSun?.sign})`);
assert(Math.abs(((rahu.longitude - ketu.longitude + 360) % 360) - 180) < 1e-9, "Rahu and Ketu are antipodal");
assert(Math.abs(rahu.latitude + ketu.latitude) < 1e-9, "Rahu and Ketu latitudes are antipodal");
const elongation = (moon.longitude - sun.longitude + 360) % 360;
assert(sunAries.tithi === Math.floor(elongation / 12) + 1, "tithi follows lunar elongation");
assert(oneMinuteLater.jd > oneMinuteEarlier.jd, "Julian day is monotonic");
assert(Math.abs((oneMinuteLater.jd - oneMinuteEarlier.jd) * 1440 - 1) < 1e-7, "one UTC minute equals one Julian minute");
assert(sunAries.ascendant >= 0 && sunAries.ascendant < 360, "ascendant is a normalized sidereal longitude");
assert(istMidnight.sunrise !== null && /^0[5-8]:\d\d$/.test(istMidnight.sunrise), `IST sunrise is a plausible Jan 15 local time (got ${istMidnight.sunrise})`);
assert(sunAries.hora !== null, "daytime/nighttime hora is available when rise and set exist");
assert(polar.sunrise === null && polar.sunset === null && polar.hora === null, "polar no-rise/no-set is reported honestly with nulls");
assert(sunAries.engine.includes("Swiss Ephemeris"), "snapshot identifies the Swiss Ephemeris engine");

console.log(JSON.stringify({
  checks: [
    "sidereal Sun sign transitions",
    "lunar elongation tithi",
    "antipodal mean nodes",
    "normalized plausible ascendant",
    "monotonic Julian minute",
    "IST sunrise local date/time",
    "hora and Swiss engine",
    "polar no-rise null handling",
  ],
  sample: {
    engine: sunAries.engine,
    ayanamsa: sunAries.ayanamsa,
    sunLongitude: sun.longitude,
    moonLongitude: moon.longitude,
    tithi: sunAries.tithi,
    ascendant: sunAries.ascendant,
    sunriseIST: istMidnight.sunrise,
    sunsetIST: istMidnight.sunset,
    hora: sunAries.hora,
  },
}, null, 2));
