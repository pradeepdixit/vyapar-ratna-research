# Practical Panchanga method

This note documents the scope and conventions of `src/lib/panchang.ts`. The helper expands an existing `AstroSnapshot`; it does not change the Swiss Ephemeris wrapper or the UI.

## What is calculated

The five limbs are the current **tithi**, sunrise-based **vara**, **nakshatra**, **yoga**, and **karana**. A panchanga is conventionally the combination of these five elements.[1] The implementation uses the snapshot's Lahiri-sidereal Sun and Moon longitudes, which matches the standard nirayana approach described by the Government of India's Rashtriya Panchanga.[2]

- **Tithi:** normalized Moon-minus-Sun elongation divided into thirty 12° sectors. Tithis 1–15 are labelled `शुक्ल पक्ष`; 16–30 are labelled `कृष्ण पक्ष`. The Hindi name is returned separately from `paksha`, so a UI can render, for example, `एकादशी · शुक्ल पक्ष`.
- **Nakshatra:** sidereal Moon longitude divided into 27 sectors of 13°20′. `pada` divides the current nakshatra into four 3°20′ quarters. The 27-sector definition and the use of Moon's sidereal longitude are documented by the Rashtriya Panchanga and the VedicDateTime technical reference.[2] [3]
- **Yoga:** normalized sidereal Sun-plus-Moon longitude divided into 27 sectors of 13°20′. This is the sum-based yoga rule, not a tropical or ascendant-derived label.[2] [3]
- **Karana:** normalized Moon-minus-Sun elongation divided into 60 half-tithi sectors of 6°. The seven moving karanas repeat; the four fixed names occupy the final four sectors, following the standard sequence.[2]
- **Vara:** the local civil weekday after local sunrise. Before sunrise, the previous local sunrise's weekday is used. This follows the sunrise-day convention described in the Rashtriya Panchanga and specialist explanations of vara.[1] [2]

## Transition instants

`tithi.endsAt`, `nakshatra.endsAt`, `yoga.endsAt`, and `karana.endsAt` are local-zone ISO instants for the **next boundary after the supplied snapshot instant**. They are not midnight cutoffs and they are not merely display clocks. The implementation samples forward over a maximum 48-hour horizon at 30 bounded points, then bisects the first detected angular crossing. The search reuses `calculateAstro`, so it uses the same Swiss Ephemeris, sidereal mode, planet names, and injected native test engine as the existing astronomy module. A missing crossing returns `null` rather than inventing a time.

The method is intentionally bounded. It avoids the thousands of full snapshots that a minute-by-minute scan would require. The 26-step bisection gives sub-second-scale numerical resolution in the instant domain; display clocks remain `HH:mm` because the existing snapshot solar fields have minute precision.

## Solar clocks and practical periods

The top-level `sunrise` and `sunset` fields preserve the existing `HH:mm | null` contract. `solar.sunrise.at` and `solar.sunset.at` add local-date ISO instants, preventing a clock such as `00:12` from being detached from the correct civil date. The source astronomy module reports no-rise/no-set as `null`; the panchanga helper preserves that honesty.

When both solar events exist and sunset follows sunrise, the helper calculates:

- **Rahu Kalam, Gulika Kalam, and Yamaganda:** divide the interval from sunrise to sunset into eight equal segments. Rahu uses weekday segments Sunday 8, Monday 2, Tuesday 7, Wednesday 5, Thursday 6, Friday 4, Saturday 3 (one-based). These assignments and the eight-part rule are explicitly documented by Drik Panchang.[4] The Gulika and Yamaganda segment tables use the corresponding standard weekday sequences: Gulika Sunday–Saturday = 7, 6, 5, 4, 3, 2, 1; Yamaganda Sunday–Saturday = 5, 4, 3, 2, 1, 7, 6. Each result contains exact local ISO `start` and `end` values plus display clocks.
- **Abhijit Muhurta:** the eighth of 15 equal daytime muhurtas, i.e. the middle daytime segment. This is the conventional approximately 48-minute interval on a 12-hour day.[5]
- **Brahma Muhurta:** the practical sunrise-relative window from 96 minutes before sunrise through 48 minutes before sunrise. It is returned as a local ISO window and is `null` where sunrise is unavailable.
- **Daytime duration:** the sunrise-to-sunset duration in minutes, or `null` when either event is missing.

These are practical astronomical intervals, not a full regional electional-calendar engine. Wednesday exclusions for Abhijit and other tradition-specific muhurta prohibitions are not applied; the raw interval is returned for the source UI to explain or filter according to its chosen tradition.

## API shape

`calculatePanchang(snapshot, lat, lon, zone): Promise<PanchangResult>` returns:

```ts
{
  iso: string;
  localDate: string;
  zone: string;
  sunrise: string | null;
  sunset: string | null;
  tithi: { index; number; name; paksha; endsAt };
  vara: { index; name; civilWeekday; sunriseBased; startsAt };
  nakshatra: { index; name; pada; endsAt };
  yoga: { index; name; endsAt };
  karana: { index; name; endsAt };
  solar: {
    sunrise; sunset; daytimeDurationMinutes;
    rahuKalam; gulikaKalam; yamaganda;
    abhijitMuhurta; brahmaMuhurta;
  };
  limitations: string[];
}
```

All limb indexes are zero-based implementation indexes; `tithi.number` is the user-facing 1–30 number. All names are Hindi strings already suitable for the existing UI's canonical planet-language style. The canonical Moon name remains `चंद्रमा` because it comes from `AstroSnapshot`.

## Explicit limits

Moonrise and moonset are not included. Exposing those correctly would require adding a lunar rise/set primitive to `astro.ts`, which is outside this task's allowed files. The result explicitly reports that omission in `limitations`.

The helper does not fabricate lunar-month labels, ayana, ritu, adhika month, regional amanta/purnimanta rules, festivals, vrata, samkranti, or religious observance dates. The Government of India's explanation shows that month reckoning and regional calendar conventions require additional rules beyond the five angular limbs.[2] A complete religious calendar therefore needs a separate, explicitly selected regional convention and more calendar algorithms.

At polar no-rise/no-set locations, solar windows are `null`. Vara falls back to the civil weekday and sets `sunriseBased: false`, making the exception visible instead of silently presenting a sunrise-based claim.

## References

[1]: https://puresankalpa.app/blog/panchanga-five-limbs-guide/ "Panchanga Explained: A Complete Guide to the Five Limbs of the Hindu Almanac"
[2]: https://packolkata.imd.gov.in/panchang/en/explanation "Rashtriya Panchanga: Explanation, Positional Astronomy Centre, Government of India"
[3]: https://cran.r-project.org/web/packages/VedicDateTime/vignettes/VedicDateTime.pdf "VedicDateTime: Vedic calendar calculations and technical formulas"
[4]: https://www.drikpanchang.com/panchang/rahu-kaal.html "Rahu Kaal Timing: eight daylight segments and weekday assignment"
[5]: https://www.drikpanchang.com/muhurat/daily/abhijit-muhurat.html "Abhijit Muhurat: the eighth of fifteen daytime muhurtas"


Integration update: lunar rise and set are now computed through a new actual Swiss rise/set primitive in astro.ts. They use this local civil date and the existing disc-center/refraction convention; an event returned on another local date is omitted, not mislabeled as today.
