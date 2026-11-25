
## Clock-time movement chart

- [x] +1/+180/+361 labels को वास्तविक historical clock time में बदला गया, जैसे 09:15 AM, 12:30 PM, 03:15 PM।
- [x] Green background/line तेजी zone, red background/line मंदी zone और yellow sideways band जोड़े गये।
- [x] Key checkpoints में भी actual candle clock time दिखता है, केवल minute number नहीं।

## Minute-wise nearest 10 historical dates

- [ ] केवल Prediction page के पुराने chart/override/prediction नियम हटें; बाकी वेबसाइट सुरक्षित रहे।
- [ ] User date पर 09:15 AM–03:15 PM IST के 361 मिनटों में सभी 9 ग्रहों के अंश स्वतन्त्र calculate हों।
- [ ] Uploaded file के पहले के historical days के समान clock मिनटों पर circular distance मिलान हो; missing rows/planet values वाले दिन स्पष्ट रूप से बाहर हों।
- [ ] सभी 3,249 comparisons का mean difference लेकर 10 अलग nearest dates ascending क्रम में दिखें; weak similarity को guarantee न कहा जाए।
- [ ] हर minute तथा हर ग्रह के target/historical degree और अंतर पढ़ सकें; chart चयनित historical date का actual OHLC हो, averaged forecast नहीं।
- [ ] Progress, cancel, copy/CSV तथा मोबाइल-readable layout हो।

## Any-time clarification — supersedes same-clock/full-day-slot criteria above

- [x] 361 target मिनटों में हर नौ-ग्रह row को प्रत्येक historical तारीख के किसी भी valid minute से तुलना करें; एक row में सभी नौ ग्रह साथ हों।
- [x] हर target मिनट का nearest historical समय मिले; date rank उसका सबसे छोटा mean difference हो, averaged-day या OHLC prediction नहीं।
- [x] Top 10 अलग dates पर target समय और matched historical समय IST में दिखें; copy/CSV में भी दोनों समय हों।
- [x] पुराने chart/probability/BR99 rules इस page से हटें; missing rows से नकली data न बने और पहले की तारीखें ही candidate हों।

Evidence: `scripts/session-matching-test.ts` unit cases PASS; 21-Nov-2026 full-file 1,020,592-row any-time scan and 31-Mar-2015 historical cutoff scan PASS. Top ten distinct dates and both time labels verified; TypeScript/build/regression suite PASS.

- [x] Actual Preview button test: 2015-03-31 rendered ten dates from 20,574 rows / 54 earlier dates. First match: 2015-03-30 03:29 PM against target 09:15 AM, error 1.3833°. Nine-planet detail rendered; old chart absent; changing date cleared all old cards.
- [x] Gzip response handling supports browser-auto-decoded Content-Encoding responses and raw gzip bytes on static hosting. Final typecheck, regression tests, matching unit tests, production build and whitespace checks passed.

## Main विषय-सूची style repair

- [x] बाकी pages पहले जैसे रहें; Main विषय-सूची से मौजूदा pages के links हों।
- [x] पूरी पुरानी `styles.css` restore रहे; index styles अलग `MainSubjectIndex.css` में scoped रहें।
- [x] Desktop sidebar content के ऊपर न आए (`--side` width token ठीक किया); mobile/tablet drawer behavior सुरक्षित रहे।
- [x] Final desktop/mobile screenshot और build verification (subject-index, sbc, book-rules, library)।
