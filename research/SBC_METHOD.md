# Sarvatobhadra Chakra method used by `src/lib/sbc.ts`

## Implemented convention

`SBC_NAKSHATRAS` uses the 28-star zodiac in sidereal longitude order, with Abhijit between Uttarashadha and Shravana. `SBC_CELLS` contains the 28 occupied nakshatra cells on a zero-based 9×9 board. Row 0 is the top row and column 0 is the left column; the four corners and the 7×7 interior are not nakshatra cells.

The outer-ring coordinates are:

```text
row 0: · धनिष्ठा शतभिषा पूर्वाभाद्रपद उत्तराभाद्रपद रेवती अश्विनी भरणी ·
row 1: श्रवण · · · · · · · कृत्तिका
row 2: अभिजित् · · · · · · · रोहिणी
row 3: उत्तराषाढ़ा · · · · · · · मृगशीर्ष
row 4: पूर्वाषाढ़ा · · · · · · · आर्द्रा
row 5: मूल · · · · · · · पुनर्वसु
row 6: ज्येष्ठा · · · · · · · पुष्य
row 7: अनुराधा · · · · · · · आश्लेषा
row 8: · विशाखा स्वाती चित्रा हस्त उत्तराफाल्गुनी पूर्वाफाल्गुनी मघा ·
```

This is the clockwise outer-ring arrangement shown by the Saravali reference: Aswini is the sixth nakshatra on the upper row, and the remaining stars, including Abhijit, continue in regular order [1]. The independent Wikipedia transcription shows the same 9×9 board and outer-ring sequence, while noting that some traditions start at the opposite top corner [4]. This implementation chooses the right-upper/clockwise convention used by the Saravali diagram and by the supplied book's corner descriptions.

### Longitude lookup and Abhijit

The lookup uses these interval starts (degrees):

```text
0, 13°20′, 26°40′, 40°, 53°20′, 66°40′, 80°, 93°20′,
106°40′, 120°, 133°20′, 146°40′, 160°, 173°20′, 186°40′,
200°, 213°20′, 226°40′, 240°, 253°20′, 266°40′,
276°40′ (Abhijit), 280°53′20″ (Shravana), 293°20′,
306°40′, 320°, 333°20′, 346°40′.
```

The exact Abhijit interval is 276°40′ ≤ longitude < 280°53′20″ [3]. The source describes it as the last pada of Uttarashadha through the first 1/15th of Shravana [3]. The Saravali basics page states the same placement but also records a competing practice that omits Abhijit or assigns the last quarter of Uttarashadha and first 1/15th of Shravana to it [1]. Therefore the implementation makes the requested exact interval explicit and treats its upper endpoint as belonging to Shravana.

This choice makes Uttarashadha 10° wide and Shravana 12°26′40″ wide in the 28-star lookup. That is intentional: the source gives an exact Abhijit interval, but it does not provide a different complete set of contiguous 28-star boundaries. The code does not silently revert to the ordinary 27-star 13°20′ lookup for this interval.

## Vedha geometry

Each occupied outer-ring cell has three geometric targets:

- **Forward / positive clockwise diagonal:** walk diagonally around the ring until the next occupied nakshatra cell is reached.
- **Opposite / straight:** walk vertically for a top/bottom source or horizontally for a left/right source until the opposite occupied edge is reached.
- **Backward / negative counter-clockwise diagonal:** use the opposite diagonal walk.

Saravali explicitly defines these three relationships and gives the motion interpretation: forward is direct/positive motion, backward is retrograde/negative motion, and opposite corresponds to stationary motion [2]. The implementation's representative checks match the published examples [2]:

- Ashwini → forward Rohini, opposite Purvaphalguni, backward Jyestha.
- Swati → forward Jyestha, opposite Shatabhisha, backward Rohini.
- Purvashadha → forward Uttarabhadra, opposite Ardra, backward Hasta.
- Krittika → forward Visakha, opposite Sravana, backward Bharani.

The output `direction` uses the supplied book's Hindi chart labels: `वाम` for the forward/left relationship, `सम्मुख` for the opposite/front relationship, and `दक्षिण` for the backward/right relationship. This is a geometric label, not a claim that a market or financial event must occur. The supplied book itself says that nakshatra vedha is part of a broader panchaka, dignity, aspect, strength, and timing procedure (blocks B00011–B00018 and B00088–B00103); a geometric hit alone is not an exact financial trigger.

## Planet motion selection

The supplied book's relevant statements are in the first 148 blocks of `research/blocks.json`:

- B00013 (book p. 31): among Mars, Mercury, Jupiter, Venus, and Saturn, retrograde uses the right-side vedha, fast/Atichari uses the left-side vedha, and mean/middle motion uses the front vedha.
- B00014 (book p. 31): Rahu and Ketu are always retrograde, while Sun and Moon are always direct; those four are assigned all three sides.
- B00022 (book p. 32): retrograde, Ativakri, and Kutilla are grouped as retrograde; fast and Atishighri as fast; and equal/middle/slow as middle motion.
- B00024 (book p. 33): a speed table exists in the supplied book, but the extracted block does not contain its numeric rows. No numeric speed cutoff is invented here.
- B00058 (book p. 39): Sun, Mars, Saturn, Rahu, and Ketu are malefic; Jupiter and Venus are benefic; Moon and Mercury have contextual qualifications.

The function therefore exposes `vedhas(snapshot, mode)` with two honest modes:

- `all-three` (the default) returns forward, opposite, and backward geometry for every supported classical planet. This is the safest display mode when the caller only has longitude and ordinary ephemeris speed.
- `directional` always returns all three for Sun, Moon, Rahu, and Ketu. For Mars, Mercury, Jupiter, Venus, and Saturn it uses `retrograde` or negative speed as backward/`दक्षिण`; an explicit `motion`, `motionType`, `speedClass`, or `gati` value of `fast`/`शीघ्री`/`अतिचारी` as forward/`वाम`; and `slow`/`mean`/`मध्यचारी`/`stationary` as opposite/`सम्मुख`. Explicit `direct`/`मार्गी` is treated as forward, following Saravali's forward/direct wording. A positive speed without an explicit fast/slow class is not given an invented threshold and returns all three possibilities until a class is explicitly selected.

The function returns only the nine classical planets: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, and Ketu. Outer planets in the application's general snapshot are ignored because the supplied SBC method is explicitly a nine-planet classical scheme. `kind` is `benefic`, `malefic`, or `mixed`; Moon and Mercury are `mixed` because the supplied text makes their status depend on lunar phase or affliction, which this pure function cannot infer from longitude alone.

## Provenance and unresolved conventions

The geometry and examples are well supported by [1] and [2]. Abhijit's exact endpoints are supported by [3], while [1] records that traditional usage is not uniform. The supplied book confirms the three-sided motion rule, but its numeric speed table is only referenced, not present in the relevant extracted block; that is why this implementation accepts explicit motion metadata instead of guessing a cutoff. The board has a documented top-left/top-right starting-point variation [4]; this implementation follows the right-upper/clockwise layout whose corners agree with the supplied book's Bharani–Krittika, Ashlesha–Magha, Vishakha–Anuradha, and Shravana–Dhanishtha notes (B00016, book p. 32).

This module intentionally does not implement corner vowel vedha, consonant substitutions, planetary/rashi aspects, strength weighting, tithi paksha weighting, time horizons, or the book's commodity-specific market interpretations. Those require additional inputs and tables beyond a pure geometric `vedhas` call. In particular, a returned vedha should be presented as a conventional geometric relationship, not as a guaranteed financial trigger.

## References

[1]: https://saravali.github.io/astrology/sbc_basics.html "Saravali Basics: Sarvatobhadra Chakra layout and Abhijit usage"
[2]: https://saravali.github.io/astrology/sbc_vedhas.html "Saravali Vedhas: forward, opposite, backward geometry and examples"
[3]: https://vedictime.com/en/library/nakshatra/abhijit "VedicTime Abhijit: longitude boundaries"
[4]: https://en.wikipedia.org/wiki/Sarvatobhadra_Chakra "Wikipedia Sarvatobhadra Chakra: 9x9 board transcription and convention note"


Integration update: unidentified positive motion now returns all three possible vedhas in directional mode, not an assumed middle class. UI permits explicit middle/fast/retrograde classification. The 81-cell display includes an interior transcription from Wikipedia and Saravali Completing the Chakra: https://saravali.github.io/astrology/sbc_chakra.html . Interior shown for context; special vowel/corner/substitution effects are not claimed as computed.
