
## Explicit selected-time calculation button

- [x] “गणना का समय” के सामने अब स्पष्ट “गणना करें” button है; click handler सीधे selected `at` value को `loadAstro(at)` में भेजता है।
- [x] Button calculation के दौरान disabled/spinner दिखाता है और auto-current mode में disabled रहता है, इसलिए गलत या पुराने समय से ranking नहीं बनती।
- [x] My Stock banner अब calculated snapshot का date/time और LIVE SNAPSHOT दिखाता है; calculation न होने पर स्पष्ट instruction दिखती है।
- [x] Typecheck, unit tests, D9 tests, Panchang tests, production build और source-level selected-time handler checks पास हुए।
