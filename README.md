# व्यापार रत्न शोध केंद्र

पूरी user-supplied `BOOKofvyaparratna` Word compilation का searchable पुस्तक-संग्रह और स्रोत-संबद्ध ज्योतिषीय research calculator। सोना ही नहीं: चाँदी, रुई, अनाज, तेल, मसाले, धातु, वस्त्र, औषधि, पशु, वर्षा तथा पुस्तक में आए अन्य विषय। कोई live market API, price feed, account login या paid runtime service नहीं।

## उपयोग

नियम संग्रह में ग्रह/पदार्थ खोजें, मूल कथन खोलें और reference IDs देखें। English aliases `gold`, `silver`, `cotton`, `sun`, `moon` भी चलते हैं। समय-सीमा विश्लेषण में लगातार पूरी range या रोज चुने घंटों की range लें; interval 1, 5, 15, 30 मिनट। हर calculation में 20,000 samples की सीमा। CSV/Excel में सभी records डाउनलोड होते हैं, स्क्रीन पर page-wise summary है। Dashboard का वर्तमान समय विकल्प browser खुला होने पर प्रत्येक minute refresh करता है; background alerts नहीं हैं।

## ईमानदार coverage

मूल पुस्तक/PDF की completeness सत्यापित नहीं है। supplied Word text में missing figures, summarized tables, ellipses और अपूर्ण passages हैं। सभी ordered source paragraphs और 53 actual tables उपलब्ध हैं। 14 sections की समीक्षा हुई है। नियम indexing और automatic execution अलग हैं: केवल exact supported AND predicates वाले नियम जाँचे जाते हैं, बाकी reference/missing बने रहते हैं। Live/future का परिणाम `इस sample पर शर्त पूरी` है; guarantee या validated financial prediction नहीं। साप्ताहिक/monthly views sampled conditions का period view हैं, नए book rules नहीं।

## गणना

Swiss Ephemeris 2.6.9 WASM, local `sepl_18.se1`/`semo_18.se1`; समर्थित वर्ष 1800–2399। Lahiri निरयन ग्रह/rashi/nakshatra/pada, Mean राहु और antipodal केतु, whole-sign लग्न chart। Western angles के लिए tropical positions अलग। सूर्योदय/sunset में disc-center/refraction convention; होरा daytime/nighttime को 12 unequal segments में बाँटती है। 27 नक्षत्र ग्रह table को अभिजित सहित 28-nakshatra सर्वतोभद्र वेध का implementation नहीं माना गया है।

## स्थानीय development

Node 22+, pnpm 11.25.0:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm build
corepack pnpm test
```

Production output `dist/`; `base: './'` और hash navigation GitHub project subdirectory के लिए compatible हैं। गणना browser में होती है; runtime backend नहीं चाहिए।

## GitHub Pages

GitHub Free पर Pages के लिए public repository जरूरी हो सकती है। Managed GitHub transfer पहले owner-confirmed private repository बनाता है; उसे public करने के लिए अलग informed authorization चाहिए। Repository transfer/connection website publication के बराबर नहीं है।

जहाँ GitHub Actions उपयोग की अनुमति हो, static `dist` को Pages deployment में upload करें। अन्यथा build output अलग Pages branch से serve किया जा सकता है। इस repository में internal secrets नहीं होने चाहिए; user-supplied source पाठ का public वितरण केवल owner के अधिकार/अनुमति के अनुसार।

## Source & licensing

Application code: AGPL-3.0-only. Swiss Ephemeris: copyright Astrodienst AG; authors Dieter Koch and Alois Treindl; AGPL/professional dual license. WASM wrapper copyright its maintainers. Free AGPL-compatible distribution selected; full application source is supplied. `LICENSE` and `THIRD_PARTY_NOTICES.md` apply. User-supplied book content has separate original rights and is not relicensed by application code license.

यह वित्तीय सलाह नहीं है। अनुष्ठानिक/रत्न/औषधि-संबंधी पुस्तक दावे भी source reference हैं, स्वास्थ्य या व्यक्तिगत उपाय की सलाह नहीं।

## Published website

Verified public URL: https://pradeepdixit.github.io/vyapar-ratna-research/

Complete source: https://github.com/pradeepdixit/vyapar-ratna-research

Owner explicitly approved public publication of both code and supplied book text. GitHub Pages serves the verified static `gh-pages` branch. Final index: 1,822 source-linked rules/references, 213 automatic condition checks, 74 missing entries; 3,632 supplied source blocks and 53 actual tables. 499 tags include synonyms and general topics, not 499 distinct traded commodities. Location preferences persist in the browser; automatic live refresh works while the page is open. No background notifications or price feed are included.
