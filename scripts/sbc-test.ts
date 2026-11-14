import assert from "node:assert/strict";
import { SBC_ABHIJIT_END, SBC_ABHIJIT_START, SBC_NAKSHATRAS, nakshatra28, vedhas } from "../src/lib/sbc";
import type { AstroSnapshot, Planet } from "../src/lib/astro";

const approx = (value: number, expected: number, epsilon = 1e-9) => {
  assert.ok(Math.abs(value - expected) < epsilon, `${value} is not close to ${expected}`);
};

assert.equal(SBC_NAKSHATRAS.length, 28);
assert.equal(nakshatra28(SBC_ABHIJIT_START), 21);
assert.equal(nakshatra28(SBC_ABHIJIT_END - 1e-8), 21);
assert.equal(nakshatra28(SBC_ABHIJIT_END), 22);
approx(SBC_ABHIJIT_START, 276 + 40 / 60);
approx(SBC_ABHIJIT_END, 280 + 53 / 60 + 20 / 3600);

const snapshot = (planet: Partial<Planet> & Pick<Planet, "name" | "longitude">): AstroSnapshot => ({
  iso: "2026-01-01T00:00:00.000Z",
  jd: 0,
  ayanamsa: 0,
  planets: [{
    id: 0, tropical: planet.longitude, speed: 1, sign: 0, nakshatra: 0, pada: 1,
    retrograde: false, latitude: 0, ...planet,
  }],
  ascendant: 0, ascSign: 0, tithi: 1, paksha: "शुक्ल पक्ष", yoga: "", karana: "",
  weekday: 0, sunrise: null, sunset: null, hora: null, engine: "test",
});

const all = vedhas(snapshot({ name: "सूर्य", longitude: 0 }));
assert.deepEqual(all.map(item => [item.direction, item.target]), [
  ["वाम", "रोहिणी"],
  ["सम्मुख", "पूर्वाफाल्गुनी"],
  ["दक्षिण", "ज्येष्ठा"],
]);

const examples = [
  [26 + 40 / 60, ["विशाखा", "श्रवण", "भरणी"]],
  [186 + 40 / 60, ["ज्येष्ठा", "शतभिषा", "रोहिणी"]],
  [253 + 20 / 60, ["उत्तराभाद्रपद", "आर्द्रा", "हस्त"]],
] as const;
for (const [longitude, targets] of examples) {
  const rows = vedhas(snapshot({ name: "सूर्य", longitude }));
  assert.deepEqual(rows.map(item => item.target), targets);
}

const directionalRetrograde = vedhas(snapshot({ name: "मंगल", longitude: 0, speed: -0.2, retrograde: true }), "directional");
assert.deepEqual(directionalRetrograde.map(item => [item.direction, item.target]), [["दक्षिण", "ज्येष्ठा"]]);

const directionalFast = vedhas(snapshot({ name: "मंगल", longitude: 0, speed: 0.2, motion: "fast" } as Partial<Planet> & Pick<Planet, "name" | "longitude">), "directional");
assert.deepEqual(directionalFast.map(item => [item.direction, item.target]), [["वाम", "रोहिणी"]]);

console.log("sbc-test: ok");
