import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import SwissEPH from "sweph-wasm";
import wasmFactory from "sweph-wasm/wasm/swisseph";
import { calculateAstro } from "../src/lib/astro";
import { calculatePanchang } from "../src/lib/panchang";

type SwissModule = Awaited<ReturnType<typeof wasmFactory>>;
type AstroRuntime = typeof globalThis & { __ASTRO_SWISS_ENGINE__?: () => Promise<SwissEPH> };

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
const instant = new Date("2024-04-14T12:00:00Z");
const snapshot = await calculateAstro(instant, delhi.lat, delhi.lon, delhi.zone);
const panchang = await calculatePanchang(snapshot, delhi.lat, delhi.lon, delhi.zone);
const instantMs = instant.getTime();

assert(panchang.localDate === "2024-04-14", `local date is preserved (got ${panchang.localDate})`);
assert(panchang.sunrise !== null && panchang.sunset !== null, "Delhi solar clocks exist");
assert(panchang.solar.sunrise?.at.startsWith("2024-04-14T"), "sunrise ISO uses the local civil date");
assert(panchang.solar.sunset?.at.startsWith("2024-04-14T"), "sunset ISO uses the local civil date");
assert(panchang.tithi.name.length > 0 && panchang.tithi.paksha.length > 0, "Hindi tithi and paksha are present");
assert(panchang.nakshatra.name.length > 0 && panchang.nakshatra.pada >= 1 && panchang.nakshatra.pada <= 4, "nakshatra and pada are present");
assert(panchang.yoga.name.length > 0 && panchang.karana.name.length > 0, "yoga and karana are present");
for (const [label, end] of [
  ["tithi", panchang.tithi.endsAt],
  ["nakshatra", panchang.nakshatra.endsAt],
  ["yoga", panchang.yoga.endsAt],
  ["karana", panchang.karana.endsAt],
] as const) {
  assert(end !== null, `${label} has a transition within the bounded search horizon`);
  const endMs = Date.parse(end);
  assert(endMs > instantMs && endMs <= instantMs + 48 * 60 * 60 * 1000, `${label} transition is forward and <=48h`);
}
assert(panchang.vara.index === 0 && panchang.vara.sunriseBased, "Sunday vara is sunrise-based after sunrise");
assert(panchang.solar.rahuKalam !== null, "Rahu Kalam is computed from daylight segments");
assert(panchang.solar.gulikaKalam !== null && panchang.solar.yamaganda !== null, "Gulika and Yamaganda are computed");
assert(panchang.solar.abhijitMuhurta !== null && panchang.solar.brahmaMuhurta !== null, "Abhijit and Brahma muhurta are computed");
assert(panchang.solar.daytimeDurationMinutes !== null && panchang.solar.daytimeDurationMinutes > 0, "daytime duration is positive");

const beforeSunrise = await calculateAstro(new Date("2024-04-13T23:30:00Z"), delhi.lat, delhi.lon, delhi.zone);
const beforeSunrisePanchang = await calculatePanchang(beforeSunrise, delhi.lat, delhi.lon, delhi.zone);
assert(beforeSunrisePanchang.localDate === "2024-04-14", "pre-sunrise instant retains its civil date");
assert(beforeSunrisePanchang.vara.index === 6 && beforeSunrisePanchang.vara.name === "शनिवार", "pre-sunrise vara belongs to the previous sunrise day");
assert(beforeSunrisePanchang.vara.startsAt?.startsWith("2024-04-13T") === true, "pre-sunrise vara starts at the previous local sunrise");

const polarSnapshot = await calculateAstro(new Date("2024-06-21T12:00:00Z"), 90, 0, "UTC");
const polar = await calculatePanchang(polarSnapshot, 90, 0, "UTC");
assert(polar.solar.sunrise === null && polar.solar.sunset === null, "polar solar events remain null");
assert(polar.solar.rahuKalam === null && polar.solar.abhijitMuhurta === null, "polar daylight periods remain null");
assert(polar.vara.sunriseBased === false, "polar vara honestly reports civil fallback");
assert(polar.moonrise === null && polar.moonset === null, "polar lunar events remain null when no rise/set exists");
for (const event of [panchang.moonrise, panchang.moonset]) {
  assert(event !== null && event.startsWith("2024-04-14T"), "lunar event is computed for the selected local civil date");
}

console.log(JSON.stringify({
  checks: [
    "five Hindi limbs and nakshatra pada",
    "forward tithi/nakshatra/yoga/karana ISO transitions",
    "local-date sunrise/sunset ISO conversion",
    "Rahu, Gulika, Yamaganda and muhurta windows",
    "sunrise-based vara before and after sunrise",
    "polar null solar events and explicit limitations",
  ],
  sample: {
    localDate: panchang.localDate,
    tithi: panchang.tithi,
    vara: panchang.vara,
    nakshatra: panchang.nakshatra,
    yoga: panchang.yoga,
    karana: panchang.karana,
    sunrise: panchang.solar.sunrise,
    sunset: panchang.solar.sunset,
    rahuKalam: panchang.solar.rahuKalam,
  },
}, null, 2));
