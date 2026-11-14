# BOOKofvyaparratna implementation validation

**Acceptance pass:** read-only review of all 237 compiled `computable` rules, their referenced exact source blocks, and the App / Analysis / rules / astro / range / export / chart / source paths. No application or reviewed dataset files were edited. Browser testing and screenshots were unavailable. `pnpm check` passed; the build was not run because build metadata was pending.

## Result

The dataset is structurally sound: all 237 computable rules have existing source IDs; no duplicate rule/block IDs were found; condition types and sign, nakshatra, weekday, tithi, and pada values are in range; canonical computable planet names are consistent with the runtime map; and the two explicit “एक राशि” rules (`R06-109`, `R06-147`) correctly use `same_sign` rather than a fabricated angular conjunction. Exact source quotations are joined by source IDs, with no invented text detected. No wrong zodiac or nakshatra index was found.

## Confirmed rule defects

Twenty-one Section 05 rules are marked computable even though their exact source requires a planetary phase/event that the DSL does not encode: मंगलोदय (`R05-129`, `R05-130`, `R05-132`, `R05-133`, `R05-134`, `R05-136`), मंगलास्त (`R05-141`, `R05-143`, `R05-149`), गुरु उदय/अस्त (`R05-276`, `R05-277`, `R05-278`, `R05-280`), or शुक्रोदय (`R05-332`, `R05-333`, `R05-334`, `R05-341`, `R05-342`, `R05-343`, `R05-345`, `R05-346`). They can match outside the source condition and should be downgraded unless a faithful phase/visibility predicate is added.

`R05-343` further omits अनुराधा even though its source says अनुराधा तथा ज्येष्ठा. `R05-345` tests only उत्तरा-भाद्रपद even though its source lists श्रवण, धनिष्ठा, शतभिषा, पूर्वा-भाद्रपद तथा उत्तरा-भाद्रपद. These should remain reference until all source-stated alternatives and phase semantics are represented without inference.

`R06-106` omits the source-required तुला sign for retrograde मंगल, and `R06-121` omits the source-required कर्क sign for retrograde गुरु. Both should be downgraded unless the exact sign AND retrograde conditions are encoded. `R05-167` also presents a source branch requiring बुध to be “युक्त” with malefics while only बुध-in-वृषभ is evaluated; it should be reference unless that undefined conjunction is faithfully modeled.

## Confirmed implementation defects

- **Stale location state — `src/App.tsx`, `src/components/LocationFields.tsx`:** editing the live location changes the location label before recalculation, while the existing snapshot and current-rule results remain from the previous location. Analysis date fields also retain their initial wall-clock values when the timezone changes. Use a draft/commit flow or mark the snapshot stale and reset/convert range inputs.
- **Error status mislabeled — `src/components/Analysis.tsx`:** a calculation exception after partial progress sets `runInfo.cancelled=true`, so failed partial results are labeled as user-cancelled. Track completed, cancelled, and failed states separately.
- **Stale coverage sentence — `research/review-summary.json`, compiled into `public/book-data.json`:** the Review overview says 1,778 rules, but compiled stats and the sum of section counts are 1,822. Regenerate the overview from the compiled count.
- **Canonical-name test drift — `scripts/astro-test.ts`:** the runtime name is `चंद्रमा`, but the test still searches for `चंद्र` at line 51. Update the test fixture/lookup. The current Chart sunrise rendering already uses the `HH:mm` snapshot value.

## Downgrades

`R05-129`, `R05-130`, `R05-132`, `R05-133`, `R05-134`, `R05-136`, `R05-141`, `R05-143`, `R05-149`, `R05-167`, `R05-276`, `R05-277`, `R05-278`, `R05-280`, `R05-332`, `R05-333`, `R05-334`, `R05-341`, `R05-342`, `R05-343`, `R05-345`, `R05-346`, `R06-106`, and `R06-121`.

The existing financial disclaimer is appropriate: book statements remain quoted, while the interface does not guarantee predictions, provide live market data, or present investment advice. Full machine-readable ingress, lag, aspect, visibility, strength, weather, and market-price semantics remain outside the reviewed DSL and were not fabricated.
