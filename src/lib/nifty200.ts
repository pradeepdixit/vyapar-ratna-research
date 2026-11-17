export type Nifty200Stock = {symbol:string;name:string;industry:string;series:string;isin:string;group:string;element:string;tags:string[];business:string};

/** Official NIFTY 200 constituent snapshot: NSE/Nifty Indices, updated 28 Oct 2026. */
export const NIFTY200_SOURCE='https://www.niftyindices.com/IndexConstituent/ind_nifty200list.csv';
export const NIFTY200_SOURCE_DATE='28 Oct 2026';
export const NIFTY200_RESEARCH: Nifty200Stock[] = [
  {
    "name": "ABB India Ltd.",
    "industry": "Capital Goods",
    "symbol": "ABB",
    "series": "EQ",
    "isin": "INE117A01022",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "विद्युत यंत्र",
      "औद्योगिक मशीनरी",
      "स्वचालन",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "विद्युत यंत्र, औद्योगिक मशीनरी, स्वचालन"
  },
  {
    "name": "ACC Ltd.",
    "industry": "Construction Materials",
    "symbol": "ACC",
    "series": "EQ",
    "isin": "INE012A01025",
    "group": "निर्माण सामग्री",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "सीमेंट",
      "निर्माण सामग्री",
      "मिट्टी",
      "भूमि",
      "शेयर"
    ],
    "business": "सीमेंट, निर्माण सामग्री"
  },
  {
    "name": "APL Apollo Tubes Ltd.",
    "industry": "Capital Goods",
    "symbol": "APLAPOLLO",
    "series": "EQ",
    "isin": "INE702C01027",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "लोहे की पाइप",
      "स्टील ट्यूब",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "लोहे की पाइप, स्टील ट्यूब"
  },
  {
    "name": "AU Small Finance Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "AUBANK",
    "series": "EQ",
    "isin": "INE949L01017",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Adani Energy Solutions Ltd.",
    "industry": "Power",
    "symbol": "ADANIENSOL",
    "series": "EQ",
    "isin": "INE931S01010",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "Power क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Adani Enterprises Ltd.",
    "industry": "Metals & Mining",
    "symbol": "ADANIENT",
    "series": "EQ",
    "isin": "INE423A01024",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "कोयला",
      "खनिज",
      "बंदरगाह व्यापार",
      "धातु",
      "लोहा",
      "शेयर"
    ],
    "business": "कोयला, खनिज, बंदरगाह व्यापार"
  },
  {
    "name": "Adani Green Energy Ltd.",
    "industry": "Power",
    "symbol": "ADANIGREEN",
    "series": "EQ",
    "isin": "INE364U01010",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "सौर ऊर्जा",
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "सौर ऊर्जा, बिजली"
  },
  {
    "name": "Adani Ports and Special Economic Zone Ltd.",
    "industry": "Services",
    "symbol": "ADANIPORTS",
    "series": "EQ",
    "isin": "INE742F01042",
    "group": "परिवहन और सेवाएँ",
    "element": "वायु · व्यापार",
    "tags": [
      "व्यापार",
      "विदेशी व्यापार",
      "शेयर"
    ],
    "business": "Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Adani Power Ltd.",
    "industry": "Power",
    "symbol": "ADANIPOWER",
    "series": "EQ",
    "isin": "INE814H01011",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "कोयला",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "बिजली, कोयला"
  },
  {
    "name": "Adani Total Gas Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "ATGL",
    "series": "EQ",
    "isin": "INE399L01023",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "प्राकृतिक गैस",
      "पाइपलाइन",
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "प्राकृतिक गैस, पाइपलाइन"
  },
  {
    "name": "Aditya Birla Capital Ltd.",
    "industry": "Financial Services",
    "symbol": "ABCAPITAL",
    "series": "EQ",
    "isin": "INE674K01013",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Aditya Birla Fashion and Retail Ltd.",
    "industry": "Consumer Services",
    "symbol": "ABFRL",
    "series": "EQ",
    "isin": "INE647O01011",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Alkem Laboratories Ltd.",
    "industry": "Healthcare",
    "symbol": "ALKEM",
    "series": "EQ",
    "isin": "INE540L01014",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Ambuja Cements Ltd.",
    "industry": "Construction Materials",
    "symbol": "AMBUJACEM",
    "series": "EQ",
    "isin": "INE079A01024",
    "group": "निर्माण सामग्री",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "सीमेंट",
      "निर्माण सामग्री",
      "मिट्टी",
      "भूमि",
      "शेयर"
    ],
    "business": "सीमेंट, निर्माण सामग्री"
  },
  {
    "name": "Apollo Hospitals Enterprise Ltd.",
    "industry": "Healthcare",
    "symbol": "APOLLOHOSP",
    "series": "EQ",
    "isin": "INE437A01024",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Apollo Tyres Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "APOLLOTYRE",
    "series": "EQ",
    "isin": "INE438A01022",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "टायर",
      "रबर",
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "टायर, रबर"
  },
  {
    "name": "Ashok Leyland Ltd.",
    "industry": "Capital Goods",
    "symbol": "ASHOKLEY",
    "series": "EQ",
    "isin": "INE208A01029",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Asian Paints Ltd.",
    "industry": "Consumer Durables",
    "symbol": "ASIANPAINT",
    "series": "EQ",
    "isin": "INE021A01026",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "पेंट",
      "रंग",
      "रसायन",
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "पेंट, रंग, रसायन"
  },
  {
    "name": "Astral Ltd.",
    "industry": "Capital Goods",
    "symbol": "ASTRAL",
    "series": "EQ",
    "isin": "INE006I01046",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "पाइप",
      "प्लास्टिक निर्माण सामग्री",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "पाइप, प्लास्टिक निर्माण सामग्री"
  },
  {
    "name": "Aurobindo Pharma Ltd.",
    "industry": "Healthcare",
    "symbol": "AUROPHARMA",
    "series": "EQ",
    "isin": "INE406A01037",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Avenue Supermarts Ltd.",
    "industry": "Consumer Services",
    "symbol": "DMART",
    "series": "EQ",
    "isin": "INE192R01011",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "खाद्य",
      "किराना",
      "उपभोक्ता वस्तुएँ",
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "खाद्य, किराना, उपभोक्ता वस्तुएँ"
  },
  {
    "name": "Axis Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "AXISBANK",
    "series": "EQ",
    "isin": "INE238A01034",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "BSE Ltd.",
    "industry": "Financial Services",
    "symbol": "BSE",
    "series": "EQ",
    "isin": "INE118H01025",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bajaj Auto Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "BAJAJ-AUTO",
    "series": "EQ",
    "isin": "INE917I01010",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bajaj Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "BAJFINANCE",
    "series": "EQ",
    "isin": "INE296A01032",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bajaj Finserv Ltd.",
    "industry": "Financial Services",
    "symbol": "BAJAJFINSV",
    "series": "EQ",
    "isin": "INE918I01026",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bajaj Holdings & Investment Ltd.",
    "industry": "Financial Services",
    "symbol": "BAJAJHLDNG",
    "series": "EQ",
    "isin": "INE118A01012",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bajaj Housing Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "BAJAJHFL",
    "series": "EQ",
    "isin": "INE377Y01014",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bandhan Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "BANDHANBNK",
    "series": "EQ",
    "isin": "INE545U01014",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bank of Baroda",
    "industry": "Financial Services",
    "symbol": "BANKBARODA",
    "series": "EQ",
    "isin": "INE028A01039",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bank of India",
    "industry": "Financial Services",
    "symbol": "BANKINDIA",
    "series": "EQ",
    "isin": "INE084A01016",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bank of Maharashtra",
    "industry": "Financial Services",
    "symbol": "MAHABANK",
    "series": "EQ",
    "isin": "INE457A01014",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bharat Dynamics Ltd.",
    "industry": "Capital Goods",
    "symbol": "BDL",
    "series": "EQ",
    "isin": "INE171Z01026",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bharat Electronics Ltd.",
    "industry": "Capital Goods",
    "symbol": "BEL",
    "series": "EQ",
    "isin": "INE263A01024",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bharat Forge Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "BHARATFORG",
    "series": "EQ",
    "isin": "INE465A01025",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bharat Heavy Electricals Ltd.",
    "industry": "Capital Goods",
    "symbol": "BHEL",
    "series": "EQ",
    "isin": "INE257A01026",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "भारी विद्युत मशीनरी",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "भारी विद्युत मशीनरी"
  },
  {
    "name": "Bharat Petroleum Corporation Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "BPCL",
    "series": "EQ",
    "isin": "INE029A01011",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "पेट्रोलियम",
      "डीजल",
      "गैस",
      "तेल",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "पेट्रोलियम, डीजल, गैस"
  },
  {
    "name": "Bharti Airtel Ltd.",
    "industry": "Telecommunication",
    "symbol": "BHARTIARTL",
    "series": "EQ",
    "isin": "INE397D01024",
    "group": "दूरसंचार और सूचना",
    "element": "वायु · बुध",
    "tags": [
      "वायरलेस",
      "रेडियो",
      "समाचार-संबंधी वस्तुएँ",
      "शेयर"
    ],
    "business": "Telecommunication क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bharti Hexacom Ltd.",
    "industry": "Telecommunication",
    "symbol": "BHARTIHEXA",
    "series": "EQ",
    "isin": "INE343G01021",
    "group": "दूरसंचार और सूचना",
    "element": "वायु · बुध",
    "tags": [
      "वायरलेस",
      "रेडियो",
      "समाचार-संबंधी वस्तुएँ",
      "शेयर"
    ],
    "business": "Telecommunication क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Biocon Ltd.",
    "industry": "Healthcare",
    "symbol": "BIOCON",
    "series": "EQ",
    "isin": "INE376G01013",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Bosch Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "BOSCHLTD",
    "series": "EQ",
    "isin": "INE323A01026",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Britannia Industries Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "BRITANNIA",
    "series": "EQ",
    "isin": "INE216A01030",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "CG Power and Industrial Solutions Ltd.",
    "industry": "Capital Goods",
    "symbol": "CGPOWER",
    "series": "EQ",
    "isin": "INE067A01029",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Canara Bank",
    "industry": "Financial Services",
    "symbol": "CANBK",
    "series": "EQ",
    "isin": "INE476A01022",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Cholamandalam Investment and Finance Company Ltd.",
    "industry": "Financial Services",
    "symbol": "CHOLAFIN",
    "series": "EQ",
    "isin": "INE121A01024",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Cipla Ltd.",
    "industry": "Healthcare",
    "symbol": "CIPLA",
    "series": "EQ",
    "isin": "INE059A01026",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Coal India Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "COALINDIA",
    "series": "EQ",
    "isin": "INE522F01014",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "कोयला",
      "खनिज",
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "कोयला, खनिज"
  },
  {
    "name": "Cochin Shipyard Ltd.",
    "industry": "Capital Goods",
    "symbol": "COCHINSHIP",
    "series": "EQ",
    "isin": "INE704P01025",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "जहाज",
      "भारी इंजीनियरिंग",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "जहाज, भारी इंजीनियरिंग"
  },
  {
    "name": "Coforge Ltd.",
    "industry": "Information Technology",
    "symbol": "COFORGE",
    "series": "EQ",
    "isin": "INE591G01025",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Colgate Palmolive (India) Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "COLPAL",
    "series": "EQ",
    "isin": "INE259A01022",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Container Corporation of India Ltd.",
    "industry": "Services",
    "symbol": "CONCOR",
    "series": "EQ",
    "isin": "INE111A01025",
    "group": "परिवहन और सेवाएँ",
    "element": "वायु · व्यापार",
    "tags": [
      "रेल कंटेनर",
      "माल परिवहन",
      "व्यापार",
      "विदेशी व्यापार",
      "शेयर"
    ],
    "business": "रेल कंटेनर, माल परिवहन"
  },
  {
    "name": "Cummins India Ltd.",
    "industry": "Capital Goods",
    "symbol": "CUMMINSIND",
    "series": "EQ",
    "isin": "INE298A01020",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "DLF Ltd.",
    "industry": "Realty",
    "symbol": "DLF",
    "series": "EQ",
    "isin": "INE271C01023",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "रियल्टी",
      "संगमरमर",
      "शेयर"
    ],
    "business": "भूमि, भवन, रियल्टी"
  },
  {
    "name": "Dabur India Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "DABUR",
    "series": "EQ",
    "isin": "INE016A01026",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Divi's Laboratories Ltd.",
    "industry": "Healthcare",
    "symbol": "DIVISLAB",
    "series": "EQ",
    "isin": "INE361B01024",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Dixon Technologies (India) Ltd.",
    "industry": "Consumer Durables",
    "symbol": "DIXON",
    "series": "EQ",
    "isin": "INE935N01020",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "Consumer Durables क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Dr. Reddy's Laboratories Ltd.",
    "industry": "Healthcare",
    "symbol": "DRREDDY",
    "series": "EQ",
    "isin": "INE089A01031",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Eicher Motors Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "EICHERMOT",
    "series": "EQ",
    "isin": "INE066A01021",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Escorts Kubota Ltd.",
    "industry": "Capital Goods",
    "symbol": "ESCORTS",
    "series": "EQ",
    "isin": "INE042A01014",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Eternal Ltd.",
    "industry": "Consumer Services",
    "symbol": "ETERNAL",
    "series": "EQ",
    "isin": "INE758T01015",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Exide Industries Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "EXIDEIND",
    "series": "EQ",
    "isin": "INE302A01020",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "बैटरी",
      "विद्युत संचय",
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "बैटरी, विद्युत संचय"
  },
  {
    "name": "FSN E-Commerce Ventures Ltd.",
    "industry": "Consumer Services",
    "symbol": "NYKAA",
    "series": "EQ",
    "isin": "INE388Y01029",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Federal Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "FEDERALBNK",
    "series": "EQ",
    "isin": "INE171A01029",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "GAIL (India) Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "GAIL",
    "series": "EQ",
    "isin": "INE129A01019",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "प्राकृतिक गैस",
      "पेट्रोकेमिकल",
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "प्राकृतिक गैस, पेट्रोकेमिकल"
  },
  {
    "name": "GMR Airports Ltd.",
    "industry": "Services",
    "symbol": "GMRAIRPORT",
    "series": "EQ",
    "isin": "INE776C01039",
    "group": "परिवहन और सेवाएँ",
    "element": "वायु · व्यापार",
    "tags": [
      "व्यापार",
      "विदेशी व्यापार",
      "शेयर"
    ],
    "business": "Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Glenmark Pharmaceuticals Ltd.",
    "industry": "Healthcare",
    "symbol": "GLENMARK",
    "series": "EQ",
    "isin": "INE935A01035",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Godrej Consumer Products Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "GODREJCP",
    "series": "EQ",
    "isin": "INE102D01028",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Godrej Properties Ltd.",
    "industry": "Realty",
    "symbol": "GODREJPROP",
    "series": "EQ",
    "isin": "INE484J01027",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "संगमरमर",
      "शेयर"
    ],
    "business": "Realty क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Grasim Industries Ltd.",
    "industry": "Construction Materials",
    "symbol": "GRASIM",
    "series": "EQ",
    "isin": "INE047A01021",
    "group": "निर्माण सामग्री",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "सीमेंट",
      "मिट्टी",
      "भूमि",
      "शेयर"
    ],
    "business": "Construction Materials क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "HCL Technologies Ltd.",
    "industry": "Information Technology",
    "symbol": "HCLTECH",
    "series": "EQ",
    "isin": "INE860A01027",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "HDFC Asset Management Company Ltd.",
    "industry": "Financial Services",
    "symbol": "HDFCAMC",
    "series": "EQ",
    "isin": "INE127D01025",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "HDFC Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "HDFCBANK",
    "series": "EQ",
    "isin": "INE040A01034",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "HDFC Life Insurance Company Ltd.",
    "industry": "Financial Services",
    "symbol": "HDFCLIFE",
    "series": "EQ",
    "isin": "INE795G01014",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Havells India Ltd.",
    "industry": "Consumer Durables",
    "symbol": "HAVELLS",
    "series": "EQ",
    "isin": "INE176B01034",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "Consumer Durables क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Hero MotoCorp Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "HEROMOTOCO",
    "series": "EQ",
    "isin": "INE158A01026",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Hindalco Industries Ltd.",
    "industry": "Metals & Mining",
    "symbol": "HINDALCO",
    "series": "EQ",
    "isin": "INE038A01020",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "Metals & Mining क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Hindustan Aeronautics Ltd.",
    "industry": "Capital Goods",
    "symbol": "HAL",
    "series": "EQ",
    "isin": "INE066F01020",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "विमान",
      "रक्षा मशीनरी",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "विमान, रक्षा मशीनरी"
  },
  {
    "name": "Hindustan Petroleum Corporation Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "HINDPETRO",
    "series": "EQ",
    "isin": "INE094A01015",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "पेट्रोलियम",
      "ईंधन",
      "तेल",
      "गैस",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "पेट्रोलियम, ईंधन"
  },
  {
    "name": "Hindustan Unilever Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "HINDUNILVR",
    "series": "EQ",
    "isin": "INE030A01027",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Hindustan Zinc Ltd.",
    "industry": "Metals & Mining",
    "symbol": "HINDZINC",
    "series": "EQ",
    "isin": "INE267A01025",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "जस्ता",
      "चाँदी",
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "जस्ता, चाँदी, धातु"
  },
  {
    "name": "Housing & Urban Development Corporation Ltd.",
    "industry": "Financial Services",
    "symbol": "HUDCO",
    "series": "EQ",
    "isin": "INE031A01017",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Hyundai Motor India Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "HYUNDAI",
    "series": "EQ",
    "isin": "INE0V6F01027",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "ICICI Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "ICICIBANK",
    "series": "EQ",
    "isin": "INE090A01021",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "ICICI Lombard General Insurance Company Ltd.",
    "industry": "Financial Services",
    "symbol": "ICICIGI",
    "series": "EQ",
    "isin": "INE765G01017",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "ICICI Prudential Life Insurance Company Ltd.",
    "industry": "Financial Services",
    "symbol": "ICICIPRULI",
    "series": "EQ",
    "isin": "INE726G01019",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "IDFC First Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "IDFCFIRSTB",
    "series": "EQ",
    "isin": "INE092T01019",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "IRB Infrastructure Developers Ltd.",
    "industry": "Construction",
    "symbol": "IRB",
    "series": "EQ",
    "isin": "INE821I01022",
    "group": "निर्माण और भारी उद्योग",
    "element": "पृथ्वी · मशीनरी",
    "tags": [
      "भारी उद्योग",
      "मशीनरी",
      "सीमेंट",
      "शेयर"
    ],
    "business": "Construction क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "ITC Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "ITC",
    "series": "EQ",
    "isin": "INE154A01025",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Indian Bank",
    "industry": "Financial Services",
    "symbol": "INDIANB",
    "series": "EQ",
    "isin": "INE562A01011",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Indian Hotels Co. Ltd.",
    "industry": "Consumer Services",
    "symbol": "INDHOTEL",
    "series": "EQ",
    "isin": "INE053A01029",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "होटल",
      "आतिथ्य",
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "होटल, आतिथ्य"
  },
  {
    "name": "Indian Oil Corporation Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "IOC",
    "series": "EQ",
    "isin": "INE242A01010",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "पेट्रोलियम",
      "ईंधन",
      "रसायन",
      "तेल",
      "गैस",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "पेट्रोलियम, ईंधन, रसायन"
  },
  {
    "name": "Indian Railway Catering And Tourism Corporation Ltd.",
    "industry": "Consumer Services",
    "symbol": "IRCTC",
    "series": "EQ",
    "isin": "INE335Y01020",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "रेल",
      "पर्यटन",
      "खानपान",
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "रेल, पर्यटन, खानपान"
  },
  {
    "name": "Indian Railway Finance Corporation Ltd.",
    "industry": "Financial Services",
    "symbol": "IRFC",
    "series": "EQ",
    "isin": "INE053F01010",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Indian Renewable Energy Development Agency Ltd.",
    "industry": "Financial Services",
    "symbol": "IREDA",
    "series": "EQ",
    "isin": "INE202E01016",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Indraprastha Gas Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "IGL",
    "series": "EQ",
    "isin": "INE203G01027",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "प्राकृतिक गैस",
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "प्राकृतिक गैस"
  },
  {
    "name": "Indus Towers Ltd.",
    "industry": "Telecommunication",
    "symbol": "INDUSTOWER",
    "series": "EQ",
    "isin": "INE121J01017",
    "group": "दूरसंचार और सूचना",
    "element": "वायु · बुध",
    "tags": [
      "वायरलेस",
      "रेडियो",
      "समाचार-संबंधी वस्तुएँ",
      "शेयर"
    ],
    "business": "Telecommunication क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "IndusInd Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "INDUSINDBK",
    "series": "EQ",
    "isin": "INE095A01012",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Info Edge (India) Ltd.",
    "industry": "Consumer Services",
    "symbol": "NAUKRI",
    "series": "EQ",
    "isin": "INE663F01032",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Infosys Ltd.",
    "industry": "Information Technology",
    "symbol": "INFY",
    "series": "EQ",
    "isin": "INE009A01021",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "InterGlobe Aviation Ltd.",
    "industry": "Services",
    "symbol": "INDIGO",
    "series": "EQ",
    "isin": "INE646L01027",
    "group": "परिवहन और सेवाएँ",
    "element": "वायु · व्यापार",
    "tags": [
      "व्यापार",
      "विदेशी व्यापार",
      "शेयर"
    ],
    "business": "Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "JSW Energy Ltd.",
    "industry": "Power",
    "symbol": "JSWENERGY",
    "series": "EQ",
    "isin": "INE121E01018",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "ऊर्जा",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "बिजली, ऊर्जा"
  },
  {
    "name": "JSW Steel Ltd.",
    "industry": "Metals & Mining",
    "symbol": "JSWSTEEL",
    "series": "EQ",
    "isin": "INE019A01038",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "Metals & Mining क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Jindal Steel Ltd.",
    "industry": "Metals & Mining",
    "symbol": "JINDALSTEL",
    "series": "EQ",
    "isin": "INE749A01030",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "लोहा",
      "स्टील",
      "धातु",
      "खनिज",
      "शेयर"
    ],
    "business": "लोहा, स्टील"
  },
  {
    "name": "Jio Financial Services Ltd.",
    "industry": "Financial Services",
    "symbol": "JIOFIN",
    "series": "EQ",
    "isin": "INE758E01017",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Jubilant Foodworks Ltd.",
    "industry": "Consumer Services",
    "symbol": "JUBLFOOD",
    "series": "EQ",
    "isin": "INE797F01020",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "खाद्य",
      "रेस्तरां",
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "खाद्य, रेस्तरां"
  },
  {
    "name": "KPIT Technologies Ltd.",
    "industry": "Information Technology",
    "symbol": "KPITTECH",
    "series": "EQ",
    "isin": "INE04I401011",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Kalyan Jewellers India Ltd.",
    "industry": "Consumer Durables",
    "symbol": "KALYANKJIL",
    "series": "EQ",
    "isin": "INE303R01014",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "सोना",
      "आभूषण",
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "सोना, आभूषण"
  },
  {
    "name": "Kotak Mahindra Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "KOTAKBANK",
    "series": "EQ",
    "isin": "INE237A01028",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "L&T Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "LTF",
    "series": "EQ",
    "isin": "INE498L01015",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "LIC Housing Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "LICHSGFIN",
    "series": "EQ",
    "isin": "INE115A01026",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "LTIMindtree Ltd.",
    "industry": "Information Technology",
    "symbol": "LTIM",
    "series": "EQ",
    "isin": "INE214T01019",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Larsen & Toubro Ltd.",
    "industry": "Construction",
    "symbol": "LT",
    "series": "EQ",
    "isin": "INE018A01030",
    "group": "निर्माण और भारी उद्योग",
    "element": "पृथ्वी · मशीनरी",
    "tags": [
      "भारी उद्योग",
      "मशीनरी",
      "सीमेंट",
      "शेयर"
    ],
    "business": "Construction क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Life Insurance Corporation of India",
    "industry": "Financial Services",
    "symbol": "LICI",
    "series": "EQ",
    "isin": "INE0J1Y01017",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Lodha Developers Ltd.",
    "industry": "Realty",
    "symbol": "LODHA",
    "series": "EQ",
    "isin": "INE670K01029",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "संगमरमर",
      "शेयर"
    ],
    "business": "Realty क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Lupin Ltd.",
    "industry": "Healthcare",
    "symbol": "LUPIN",
    "series": "EQ",
    "isin": "INE326A01037",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "चिकित्सा",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "औषधि, चिकित्सा"
  },
  {
    "name": "MRF Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "MRF",
    "series": "EQ",
    "isin": "INE883A01011",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "टायर",
      "रबर",
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "टायर, रबर"
  },
  {
    "name": "Mahindra & Mahindra Financial Services Ltd.",
    "industry": "Financial Services",
    "symbol": "M&MFIN",
    "series": "EQ",
    "isin": "INE774D01024",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Mahindra & Mahindra Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "M&M",
    "series": "EQ",
    "isin": "INE101A01026",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Mankind Pharma Ltd.",
    "industry": "Healthcare",
    "symbol": "MANKIND",
    "series": "EQ",
    "isin": "INE634S01028",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Marico Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "MARICO",
    "series": "EQ",
    "isin": "INE196A01026",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Maruti Suzuki India Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "MARUTI",
    "series": "EQ",
    "isin": "INE585B01010",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Max Financial Services Ltd.",
    "industry": "Financial Services",
    "symbol": "MFSL",
    "series": "EQ",
    "isin": "INE180A01020",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Max Healthcare Institute Ltd.",
    "industry": "Healthcare",
    "symbol": "MAXHEALTH",
    "series": "EQ",
    "isin": "INE027H01010",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Mazagoan Dock Shipbuilders Ltd.",
    "industry": "Capital Goods",
    "symbol": "MAZDOCK",
    "series": "EQ",
    "isin": "INE249Z01020",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "जहाज",
      "रक्षा मशीनरी",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "जहाज, रक्षा मशीनरी"
  },
  {
    "name": "Motilal Oswal Financial Services Ltd.",
    "industry": "Financial Services",
    "symbol": "MOTILALOFS",
    "series": "EQ",
    "isin": "INE338I01027",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "MphasiS Ltd.",
    "industry": "Information Technology",
    "symbol": "MPHASIS",
    "series": "EQ",
    "isin": "INE356A01018",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Muthoot Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "MUTHOOTFIN",
    "series": "EQ",
    "isin": "INE414G01012",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "NHPC Ltd.",
    "industry": "Power",
    "symbol": "NHPC",
    "series": "EQ",
    "isin": "INE848E01016",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "Power क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "NMDC Ltd.",
    "industry": "Metals & Mining",
    "symbol": "NMDC",
    "series": "EQ",
    "isin": "INE584A01023",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "लोहा",
      "खनिज",
      "धातु",
      "शेयर"
    ],
    "business": "लोहा, खनिज"
  },
  {
    "name": "NTPC Green Energy Ltd.",
    "industry": "Power",
    "symbol": "NTPCGREEN",
    "series": "EQ",
    "isin": "INE0ONG01011",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "सौर ऊर्जा",
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "सौर ऊर्जा, बिजली"
  },
  {
    "name": "NTPC Ltd.",
    "industry": "Power",
    "symbol": "NTPC",
    "series": "EQ",
    "isin": "INE733E01010",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "Power क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "National Aluminium Co. Ltd.",
    "industry": "Metals & Mining",
    "symbol": "NATIONALUM",
    "series": "EQ",
    "isin": "INE139A01034",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "एल्यूमिनियम",
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "एल्यूमिनियम, धातु"
  },
  {
    "name": "Nestle India Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "NESTLEIND",
    "series": "EQ",
    "isin": "INE239A01024",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Oberoi Realty Ltd.",
    "industry": "Realty",
    "symbol": "OBEROIRLTY",
    "series": "EQ",
    "isin": "INE093I01010",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "संगमरमर",
      "शेयर"
    ],
    "business": "Realty क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Oil & Natural Gas Corporation Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "ONGC",
    "series": "EQ",
    "isin": "INE213A01029",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "Oil Gas & Consumable Fuels क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Oil India Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "OIL",
    "series": "EQ",
    "isin": "INE274J01014",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "कच्चा तेल",
      "गैस",
      "तेल",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "कच्चा तेल, गैस"
  },
  {
    "name": "Ola Electric Mobility Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "OLAELEC",
    "series": "BE",
    "isin": "INE0LXG01040",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "इलेक्ट्रिक वाहन",
      "बैटरी",
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "इलेक्ट्रिक वाहन, बैटरी"
  },
  {
    "name": "One 97 Communications Ltd.",
    "industry": "Financial Services",
    "symbol": "PAYTM",
    "series": "EQ",
    "isin": "INE982J01020",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Oracle Financial Services Software Ltd.",
    "industry": "Information Technology",
    "symbol": "OFSS",
    "series": "EQ",
    "isin": "INE881D01027",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "PB Fintech Ltd.",
    "industry": "Financial Services",
    "symbol": "POLICYBZR",
    "series": "EQ",
    "isin": "INE417T01026",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "PI Industries Ltd.",
    "industry": "Chemicals",
    "symbol": "PIIND",
    "series": "EQ",
    "isin": "INE603J01030",
    "group": "रसायन और कृषि रसायन",
    "element": "अग्नि · रसायन",
    "tags": [
      "रसायन",
      "कृषि",
      "तेल",
      "शेयर"
    ],
    "business": "Chemicals क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Page Industries Ltd.",
    "industry": "Textiles",
    "symbol": "PAGEIND",
    "series": "EQ",
    "isin": "INE761H01022",
    "group": "वस्त्र और कपड़ा",
    "element": "जल · वस्त्र",
    "tags": [
      "सूती वस्त्र",
      "अंतर्वस्त्र",
      "वस्त्र",
      "रेशमी वस्त्र",
      "शेयर"
    ],
    "business": "सूती वस्त्र, अंतर्वस्त्र"
  },
  {
    "name": "Patanjali Foods Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "PATANJALI",
    "series": "EQ",
    "isin": "INE619A01035",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "खाद्य",
      "आयुर्वेद",
      "औषधि",
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "खाद्य, आयुर्वेद, औषधि"
  },
  {
    "name": "Persistent Systems Ltd.",
    "industry": "Information Technology",
    "symbol": "PERSISTENT",
    "series": "EQ",
    "isin": "INE262H01021",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Petronet LNG Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "PETRONET",
    "series": "EQ",
    "isin": "INE347G01014",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "एलएनजी",
      "गैस",
      "तेल",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "एलएनजी, गैस"
  },
  {
    "name": "Phoenix Mills Ltd.",
    "industry": "Realty",
    "symbol": "PHOENIXLTD",
    "series": "EQ",
    "isin": "INE211B01039",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "संगमरमर",
      "शेयर"
    ],
    "business": "Realty क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Pidilite Industries Ltd.",
    "industry": "Chemicals",
    "symbol": "PIDILITIND",
    "series": "EQ",
    "isin": "INE318A01026",
    "group": "रसायन और कृषि रसायन",
    "element": "अग्नि · रसायन",
    "tags": [
      "चिपकने वाले रसायन",
      "निर्माण सामग्री",
      "रसायन",
      "कृषि",
      "तेल",
      "शेयर"
    ],
    "business": "चिपकने वाले रसायन, निर्माण सामग्री"
  },
  {
    "name": "Polycab India Ltd.",
    "industry": "Capital Goods",
    "symbol": "POLYCAB",
    "series": "EQ",
    "isin": "INE455K01017",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "केबल",
      "तांबा",
      "विद्युत यंत्र",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "केबल, तांबा, विद्युत यंत्र"
  },
  {
    "name": "Power Finance Corporation Ltd.",
    "industry": "Financial Services",
    "symbol": "PFC",
    "series": "EQ",
    "isin": "INE134E01011",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Power Grid Corporation of India Ltd.",
    "industry": "Power",
    "symbol": "POWERGRID",
    "series": "EQ",
    "isin": "INE752E01010",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "विद्युत ग्रिड",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "बिजली, विद्युत ग्रिड"
  },
  {
    "name": "Premier Energies Ltd.",
    "industry": "Capital Goods",
    "symbol": "PREMIERENE",
    "series": "EQ",
    "isin": "INE0BS701011",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "सौर उपकरण",
      "ऊर्जा",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "सौर उपकरण, ऊर्जा"
  },
  {
    "name": "Prestige Estates Projects Ltd.",
    "industry": "Realty",
    "symbol": "PRESTIGE",
    "series": "EQ",
    "isin": "INE811K01011",
    "group": "रियल्टी और भूमि",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "भूमि",
      "भवन",
      "संगमरमर",
      "शेयर"
    ],
    "business": "Realty क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Punjab National Bank",
    "industry": "Financial Services",
    "symbol": "PNB",
    "series": "EQ",
    "isin": "INE160A01022",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "REC Ltd.",
    "industry": "Financial Services",
    "symbol": "RECLTD",
    "series": "EQ",
    "isin": "INE020B01018",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Rail Vikas Nigam Ltd.",
    "industry": "Construction",
    "symbol": "RVNL",
    "series": "EQ",
    "isin": "INE415G01027",
    "group": "निर्माण और भारी उद्योग",
    "element": "पृथ्वी · मशीनरी",
    "tags": [
      "रेल",
      "निर्माण",
      "भारी उद्योग",
      "मशीनरी",
      "सीमेंट",
      "शेयर"
    ],
    "business": "रेल, निर्माण"
  },
  {
    "name": "Reliance Industries Ltd.",
    "industry": "Oil Gas & Consumable Fuels",
    "symbol": "RELIANCE",
    "series": "EQ",
    "isin": "INE002A01018",
    "group": "तेल, गैस और ईंधन",
    "element": "अग्नि · तेल",
    "tags": [
      "तेल",
      "गैस",
      "ईंधन",
      "भूगर्भीय वस्तुएँ",
      "शेयर"
    ],
    "business": "Oil Gas & Consumable Fuels क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "SBI Cards and Payment Services Ltd.",
    "industry": "Financial Services",
    "symbol": "SBICARD",
    "series": "EQ",
    "isin": "INE018E01016",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "SBI Life Insurance Company Ltd.",
    "industry": "Financial Services",
    "symbol": "SBILIFE",
    "series": "EQ",
    "isin": "INE123W01016",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "SJVN Ltd.",
    "industry": "Power",
    "symbol": "SJVN",
    "series": "EQ",
    "isin": "INE002L01015",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "Power क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "SRF Ltd.",
    "industry": "Chemicals",
    "symbol": "SRF",
    "series": "EQ",
    "isin": "INE647A01010",
    "group": "रसायन और कृषि रसायन",
    "element": "अग्नि · रसायन",
    "tags": [
      "रसायन",
      "पैकेजिंग",
      "वस्त्र",
      "कृषि",
      "तेल",
      "शेयर"
    ],
    "business": "रसायन, पैकेजिंग, वस्त्र"
  },
  {
    "name": "Samvardhana Motherson International Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "MOTHERSON",
    "series": "EQ",
    "isin": "INE775A01035",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Shree Cement Ltd.",
    "industry": "Construction Materials",
    "symbol": "SHREECEM",
    "series": "EQ",
    "isin": "INE070A01015",
    "group": "निर्माण सामग्री",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "सीमेंट",
      "मिट्टी",
      "भूमि",
      "शेयर"
    ],
    "business": "Construction Materials क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Shriram Finance Ltd.",
    "industry": "Financial Services",
    "symbol": "SHRIRAMFIN",
    "series": "EQ",
    "isin": "INE721A01047",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Siemens Ltd.",
    "industry": "Capital Goods",
    "symbol": "SIEMENS",
    "series": "EQ",
    "isin": "INE003A01024",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Solar Industries India Ltd.",
    "industry": "Chemicals",
    "symbol": "SOLARINDS",
    "series": "EQ",
    "isin": "INE343H01029",
    "group": "रसायन और कृषि रसायन",
    "element": "अग्नि · रसायन",
    "tags": [
      "विस्फोटक",
      "रसायन",
      "कृषि",
      "तेल",
      "शेयर"
    ],
    "business": "विस्फोटक, रसायन"
  },
  {
    "name": "Sona BLW Precision Forgings Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "SONACOMS",
    "series": "EQ",
    "isin": "INE073K01018",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "State Bank of India",
    "industry": "Financial Services",
    "symbol": "SBIN",
    "series": "EQ",
    "isin": "INE062A01020",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Steel Authority of India Ltd.",
    "industry": "Metals & Mining",
    "symbol": "SAIL",
    "series": "EQ",
    "isin": "INE114A01011",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "लोहा",
      "स्टील",
      "धातु",
      "खनिज",
      "शेयर"
    ],
    "business": "लोहा, स्टील"
  },
  {
    "name": "Sun Pharmaceutical Industries Ltd.",
    "industry": "Healthcare",
    "symbol": "SUNPHARMA",
    "series": "EQ",
    "isin": "INE044A01036",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "Healthcare क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Supreme Industries Ltd.",
    "industry": "Capital Goods",
    "symbol": "SUPREMEIND",
    "series": "EQ",
    "isin": "INE195A01028",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "Capital Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Suzlon Energy Ltd.",
    "industry": "Capital Goods",
    "symbol": "SUZLON",
    "series": "EQ",
    "isin": "INE040H01021",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "पवन ऊर्जा",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "पवन ऊर्जा, मशीनरी"
  },
  {
    "name": "Swiggy Ltd.",
    "industry": "Consumer Services",
    "symbol": "SWIGGY",
    "series": "EQ",
    "isin": "INE00H001014",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "TVS Motor Company Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "TVSMOTOR",
    "series": "EQ",
    "isin": "INE494B01023",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "Automobile and Auto Components क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Tata Communications Ltd.",
    "industry": "Telecommunication",
    "symbol": "TATACOMM",
    "series": "EQ",
    "isin": "INE151A01013",
    "group": "दूरसंचार और सूचना",
    "element": "वायु · बुध",
    "tags": [
      "दूरसंचार",
      "नेटवर्क",
      "वायरलेस",
      "रेडियो",
      "समाचार-संबंधी वस्तुएँ",
      "शेयर"
    ],
    "business": "दूरसंचार, नेटवर्क"
  },
  {
    "name": "Tata Consultancy Services Ltd.",
    "industry": "Information Technology",
    "symbol": "TCS",
    "series": "EQ",
    "isin": "INE467B01029",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Tata Consumer Products Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "TATACONSUM",
    "series": "EQ",
    "isin": "INE192A01025",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "Fast Moving Consumer Goods क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Tata Elxsi Ltd.",
    "industry": "Information Technology",
    "symbol": "TATAELXSI",
    "series": "EQ",
    "isin": "INE670A01012",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "सॉफ्टवेयर",
      "डिजाइन",
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "सॉफ्टवेयर, डिजाइन"
  },
  {
    "name": "Tata Motors Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "TATAMOTORS",
    "series": "EQ",
    "isin": "INE155A01022",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "वाहन",
      "मोटर",
      "लोहा",
      "मशीनरी",
      "शेयर"
    ],
    "business": "वाहन, मोटर, लोहा"
  },
  {
    "name": "Tata Power Co. Ltd.",
    "industry": "Power",
    "symbol": "TATAPOWER",
    "series": "EQ",
    "isin": "INE245A01021",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "ऊर्जा",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "बिजली, ऊर्जा"
  },
  {
    "name": "Tata Steel Ltd.",
    "industry": "Metals & Mining",
    "symbol": "TATASTEEL",
    "series": "EQ",
    "isin": "INE081A01020",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "Metals & Mining क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Tata Technologies Ltd.",
    "industry": "Information Technology",
    "symbol": "TATATECH",
    "series": "EQ",
    "isin": "INE142M01025",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "ऑटो इंजीनियरिंग",
      "सॉफ्टवेयर",
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "ऑटो इंजीनियरिंग, सॉफ्टवेयर"
  },
  {
    "name": "Tech Mahindra Ltd.",
    "industry": "Information Technology",
    "symbol": "TECHM",
    "series": "EQ",
    "isin": "INE669C01036",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Titan Company Ltd.",
    "industry": "Consumer Durables",
    "symbol": "TITAN",
    "series": "EQ",
    "isin": "INE280A01028",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "Consumer Durables क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Torrent Pharmaceuticals Ltd.",
    "industry": "Healthcare",
    "symbol": "TORNTPHARM",
    "series": "EQ",
    "isin": "INE685A01028",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "औषधि"
  },
  {
    "name": "Torrent Power Ltd.",
    "industry": "Power",
    "symbol": "TORNTPOWER",
    "series": "EQ",
    "isin": "INE813H01021",
    "group": "ऊर्जा और बिजली",
    "element": "अग्नि · बिजली",
    "tags": [
      "बिजली",
      "बिजली के यंत्र",
      "ऊर्जा",
      "शेयर"
    ],
    "business": "बिजली"
  },
  {
    "name": "Trent Ltd.",
    "industry": "Consumer Services",
    "symbol": "TRENT",
    "series": "EQ",
    "isin": "INE849A01020",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Tube Investments of India Ltd.",
    "industry": "Automobile and Auto Components",
    "symbol": "TIINDIA",
    "series": "EQ",
    "isin": "INE974X01010",
    "group": "ऑटोमोबाइल और वाहन",
    "element": "अग्नि · धातु",
    "tags": [
      "ऑटो पार्ट्स",
      "इंजीनियरिंग",
      "मोटर",
      "वाहन",
      "मशीनरी",
      "लोहा",
      "शेयर"
    ],
    "business": "ऑटो पार्ट्स, इंजीनियरिंग"
  },
  {
    "name": "UPL Ltd.",
    "industry": "Chemicals",
    "symbol": "UPL",
    "series": "EQ",
    "isin": "INE628A01036",
    "group": "रसायन और कृषि रसायन",
    "element": "अग्नि · रसायन",
    "tags": [
      "कृषि रसायन",
      "कीटनाशक",
      "रसायन",
      "कृषि",
      "तेल",
      "शेयर"
    ],
    "business": "कृषि रसायन, कीटनाशक"
  },
  {
    "name": "UltraTech Cement Ltd.",
    "industry": "Construction Materials",
    "symbol": "ULTRACEMCO",
    "series": "EQ",
    "isin": "INE481G01011",
    "group": "निर्माण सामग्री",
    "element": "पृथ्वी · भूमि",
    "tags": [
      "सीमेंट",
      "मिट्टी",
      "भूमि",
      "शेयर"
    ],
    "business": "Construction Materials क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Union Bank of India",
    "industry": "Financial Services",
    "symbol": "UNIONBANK",
    "series": "EQ",
    "isin": "INE692A01016",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "United Spirits Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "UNITDSPR",
    "series": "EQ",
    "isin": "INE854D01024",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "शराब",
      "रस",
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "शराब, रस"
  },
  {
    "name": "Varun Beverages Ltd.",
    "industry": "Fast Moving Consumer Goods",
    "symbol": "VBL",
    "series": "EQ",
    "isin": "INE200M01039",
    "group": "खाद्य और उपभोक्ता वस्तुएँ",
    "element": "जल · रस",
    "tags": [
      "शीतल पेय",
      "खाद्य",
      "रसादि",
      "मिठाई",
      "व्यापारिक वस्तुएँ",
      "शेयर"
    ],
    "business": "शीतल पेय, खाद्य"
  },
  {
    "name": "Vedanta Ltd.",
    "industry": "Metals & Mining",
    "symbol": "VEDL",
    "series": "EQ",
    "isin": "INE205A01025",
    "group": "धातु और खनन",
    "element": "पृथ्वी · धातु",
    "tags": [
      "एल्यूमिनियम",
      "तांबा",
      "जस्ता",
      "धातु",
      "खनिज",
      "लोहा",
      "शेयर"
    ],
    "business": "एल्यूमिनियम, तांबा, जस्ता, धातु"
  },
  {
    "name": "Vishal Mega Mart Ltd.",
    "industry": "Consumer Services",
    "symbol": "VMM",
    "series": "EQ",
    "isin": "INE01EA01019",
    "group": "उपभोक्ता और सेवा",
    "element": "जल · व्यापार",
    "tags": [
      "व्यापार",
      "सामान्य व्यापार",
      "शेयर"
    ],
    "business": "Consumer Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Vodafone Idea Ltd.",
    "industry": "Telecommunication",
    "symbol": "IDEA",
    "series": "EQ",
    "isin": "INE669E01016",
    "group": "दूरसंचार और सूचना",
    "element": "वायु · बुध",
    "tags": [
      "दूरसंचार",
      "वायरलेस",
      "रेडियो",
      "समाचार-संबंधी वस्तुएँ",
      "शेयर"
    ],
    "business": "दूरसंचार"
  },
  {
    "name": "Voltas Ltd.",
    "industry": "Consumer Durables",
    "symbol": "VOLTAS",
    "series": "EQ",
    "isin": "INE226A01021",
    "group": "उपभोक्ता टिकाऊ वस्तुएँ",
    "element": "पृथ्वी · विलासिता",
    "tags": [
      "एयर कंडीशनर",
      "विद्युत उपकरण",
      "विलासिता सामग्री",
      "मशीनरी",
      "शेयर"
    ],
    "business": "एयर कंडीशनर, विद्युत उपकरण"
  },
  {
    "name": "Waaree Energies Ltd.",
    "industry": "Capital Goods",
    "symbol": "WAAREEENER",
    "series": "EQ",
    "isin": "INE377N01017",
    "group": "पूंजीगत वस्तुएँ और मशीनरी",
    "element": "अग्नि · यंत्र",
    "tags": [
      "सौर पैनल",
      "ऊर्जा",
      "मशीनरी",
      "लोहे की मशीन",
      "बिजली के यंत्र",
      "शेयर"
    ],
    "business": "सौर पैनल, ऊर्जा"
  },
  {
    "name": "Wipro Ltd.",
    "industry": "Information Technology",
    "symbol": "WIPRO",
    "series": "EQ",
    "isin": "INE075A01022",
    "group": "सूचना प्रौद्योगिकी",
    "element": "वायु · बुध",
    "tags": [
      "बुध-सम्बन्धित वस्तुएँ",
      "लेखन-पठन सामग्री",
      "रेडियो",
      "शेयर"
    ],
    "business": "Information Technology क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Yes Bank Ltd.",
    "industry": "Financial Services",
    "symbol": "YESBANK",
    "series": "EQ",
    "isin": "INE528G01035",
    "group": "बैंकिंग, बीमा और वित्त",
    "element": "वायु · विनिमय",
    "tags": [
      "बैंक",
      "बैंक शेयर",
      "बॉन्ड",
      "शेयर"
    ],
    "business": "Financial Services क्षेत्र की कंपनी; विस्तृत company filing mapping के लिए official business description देखें।"
  },
  {
    "name": "Zydus Lifesciences Ltd.",
    "industry": "Healthcare",
    "symbol": "ZYDUSLIFE",
    "series": "EQ",
    "isin": "INE010B01027",
    "group": "स्वास्थ्य और औषधि",
    "element": "जल · औषधि",
    "tags": [
      "औषधि",
      "औषधियाँ",
      "मूल",
      "शेयर"
    ],
    "business": "औषधि"
  }
];
