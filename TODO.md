
## Final white paper / black text mode

- [x] पूरी website के backgrounds सफेद और मुख्य text solid black किया गया; dark/faded theme overrides को अंतिम CSS layer ने हटाया।
- [x] मूल कथन, source blocks, शर्तों की lines, tables, labels, active/inactive timing और calculation badges black, bold और opaque हैं।
- [x] Active cards हल्के green/cream background से अलग हैं, लेकिन उनका text black ही रहता है; tags और signals भी black high-contrast हैं।

## My Stock Selection List — NIFTY 200

- [x] Official NSE/Nifty Indices snapshot से 200 constituents, company name, symbol, industry, series और ISIN जोड़कर अलग `My Stock Selection List` page बनाया गया।
- [x] Company/industry के आधार पर material tags जोड़े गये: धातु, लोहा, सीमेंट, तेल, गैस, बिजली, केबल/ताँबा, औषधि, वस्त्र, खाद्य, वाहन, सोना/रत्न और अन्य पुस्तक-संबंधित पदार्थ। Explicit product overrides और industry-level fallback अलग रखे गये हैं।
- [x] प्रत्येक card में minute/क्षणिक, daily, weekly, fortnightly, monthly और yearly rule counts, matched rules, तेजी/मंदी/मिश्र signal और active rule timing दिखते हैं। Selected date/time बदलने पर active stock ranking फिर calculate होती है।
- [x] Active shares ऊपर sort होते हैं; Copy list, Download, search, research-group filter, period filter और केवल active filter उपलब्ध हैं।
