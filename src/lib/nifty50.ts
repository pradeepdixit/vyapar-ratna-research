export type NiftyResearchGroup = {
  symbol: string;
  name: string;
  industry: string;
  group: string;
  element: string;
  tags: string[];
};

/** Official constituent snapshot from NSE/Nifty Indices, updated 28 Oct 2026. */
export const NIFTY50_RESEARCH: NiftyResearchGroup[] = [
 {symbol:'ADANIENT',name:'Adani Enterprises Ltd.',industry:'Metals & Mining',group:'धातु और खनन',element:'पृथ्वी · धातु',tags:['धातु','खनिज','लोहा','शेयर']},
 {symbol:'ADANIPORTS',name:'Adani Ports and Special Economic Zone Ltd.',industry:'Services',group:'परिवहन और सेवा',element:'वायु · व्यापार',tags:['व्यापार','विदेशी व्यापार','रेल','शेयर']},
 {symbol:'APOLLOHOSP',name:'Apollo Hospitals Enterprise Ltd.',industry:'Healthcare',group:'स्वास्थ्य और औषधि',element:'जल · औषधि',tags:['औषधि','औषधियाँ','मूल','शेयर']},
 {symbol:'ASIANPAINT',name:'Asian Paints Ltd.',industry:'Consumer Durables',group:'उपभोक्ता और विलासिता',element:'अग्नि · रंग',tags:['रंग','विलासिता सामग्री','मिट्टी की वस्तुएँ','शेयर']},
 {symbol:'AXISBANK',name:'Axis Bank Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','शेयर','साधारण शेयर']},
 {symbol:'BSE',name:'BSE Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['शेयर','साधारण शेयर','सट्टा','वायदा व्यापार']},
 {symbol:'BAJAJ-AUTO',name:'Bajaj Auto Ltd.',industry:'Automobile and Auto Components',group:'ऑटोमोबाइल और वाहन',element:'अग्नि · धातु',tags:['मोटर','वाहन','मशीनरी','लोहा','शेयर']},
 {symbol:'BAJFINANCE',name:'Bajaj Finance Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','बॉन्ड','शेयर']},
 {symbol:'BAJAJFINSV',name:'Bajaj Finserv Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','बॉन्ड','शेयर']},
 {symbol:'BEL',name:'Bharat Electronics Ltd.',industry:'Capital Goods',group:'पूंजीगत वस्तुएँ और मशीनरी',element:'अग्नि · यंत्र',tags:['बिजली के यंत्र','बिजली','यन्त्र','मशीनरी','शेयर']},
 {symbol:'BHARTIARTL',name:'Bharti Airtel Ltd.',industry:'Telecommunication',group:'दूरसंचार और सूचना',element:'वायु · बुध',tags:['वायरलेस','रेडियो','समाचार-संबंधी वस्तुएँ','शेयर']},
 {symbol:'CIPLA',name:'Cipla Ltd.',industry:'Healthcare',group:'स्वास्थ्य और औषधि',element:'जल · औषधि',tags:['औषधि','औषधियाँ','मूल','शेयर']},
 {symbol:'COALINDIA',name:'Coal India Ltd.',industry:'Oil Gas & Consumable Fuels',group:'ऊर्जा और ईंधन',element:'अग्नि · भूमिगत धन',tags:['कोयला','भूमिगत धन','भूगर्भीय वस्तुएँ','शेयर']},
 {symbol:'DRREDDY',name:"Dr. Reddy's Laboratories Ltd.",industry:'Healthcare',group:'स्वास्थ्य और औषधि',element:'जल · औषधि',tags:['औषधि','औषधियाँ','मूल','शेयर']},
 {symbol:'EICHERMOT',name:'Eicher Motors Ltd.',industry:'Automobile and Auto Components',group:'ऑटोमोबाइल और वाहन',element:'अग्नि · धातु',tags:['मोटर','वाहन','मशीनरी','लोहा','शेयर']},
 {symbol:'ETERNAL',name:'Eternal Ltd.',industry:'Consumer Services',group:'उपभोक्ता और सेवा',element:'वायु · व्यापार',tags:['व्यापार','सामान्य व्यापार','सामान्य बाजार','शेयर']},
 {symbol:'GRASIM',name:'Grasim Industries Ltd.',industry:'Construction Materials',group:'निर्माण सामग्री',element:'पृथ्वी · भूमि',tags:['सीमेंट','संगमरमर','भूमि','वस्त्र','शेयर']},
 {symbol:'HCLTECH',name:'HCL Technologies Ltd.',industry:'Information Technology',group:'सूचना प्रौद्योगिकी',element:'वायु · बुध',tags:['बुध-सम्बन्धित वस्तुएँ','लेखन-पठन सामग्री','रेडियो','शेयर']},
 {symbol:'HDFCBANK',name:'HDFC Bank Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','शेयर','साधारण शेयर']},
 {symbol:'HDFCLIFE',name:'HDFC Life Insurance Company Ltd.',industry:'Financial Services',group:'बीमा और वित्त',element:'जल · सुरक्षा',tags:['शेयर','बॉन्ड','संयुक्त पूंजी कंपनियाँ','सामान्य बाजार']},
 {symbol:'HINDALCO',name:'Hindalco Industries Ltd.',industry:'Metals & Mining',group:'धातु और खनन',element:'पृथ्वी · धातु',tags:['एल्यूमिनियम','धातु','खनिज','शेयर']},
 {symbol:'HINDUNILVR',name:'Hindustan Unilever Ltd.',industry:'Fast Moving Consumer Goods',group:'उपभोक्ता वस्तुएँ',element:'जल · रस',tags:['रसादि','सुगन्धित पदार्थ','मिठाई','व्यापारिक वस्तुएँ','शेयर']},
 {symbol:'ICICIBANK',name:'ICICI Bank Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','शेयर','साधारण शेयर']},
 {symbol:'ITC',name:'ITC Ltd.',industry:'Fast Moving Consumer Goods',group:'उपभोक्ता वस्तुएँ',element:'जल · रस',tags:['रसादि','सुगन्धित पदार्थ','व्यापारिक वस्तुएँ','शराब','शेयर']},
 {symbol:'INFY',name:'Infosys Ltd.',industry:'Information Technology',group:'सूचना प्रौद्योगिकी',element:'वायु · बुध',tags:['बुध-सम्बन्धित वस्तुएँ','लेखन-पठन सामग्री','रेडियो','शेयर']},
 {symbol:'INDIGO',name:'InterGlobe Aviation Ltd.',industry:'Services',group:'विमानन और सेवा',element:'वायु · आकाश',tags:['वायुयान','हवाई जहाज','वायु','विदेशी व्यापार','शेयर']},
 {symbol:'JSWSTEEL',name:'JSW Steel Ltd.',industry:'Metals & Mining',group:'धातु और खनन',element:'पृथ्वी · धातु',tags:['लोहा','धातु','खनिज','आयरन शेयर','शेयर']},
 {symbol:'JIOFIN',name:'Jio Financial Services Ltd.',industry:'Financial Services',group:'बीमा और वित्त',element:'वायु · विनिमय',tags:['शेयर','बॉन्ड','संयुक्त पूंजी कंपनियाँ','सामान्य बाजार']},
 {symbol:'KOTAKBANK',name:'Kotak Mahindra Bank Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','शेयर','साधारण शेयर']},
 {symbol:'LT',name:'Larsen & Toubro Ltd.',industry:'Construction',group:'निर्माण और भारी उद्योग',element:'पृथ्वी · मशीनरी',tags:['भारी उद्योग','मशीनरी','लोहे की मशीन','सीमेंट','शेयर']},
 {symbol:'M&M',name:'Mahindra & Mahindra Ltd.',industry:'Automobile and Auto Components',group:'ऑटोमोबाइल और वाहन',element:'अग्नि · धातु',tags:['मोटर','वाहन','मशीनरी','लोहा','शेयर']},
 {symbol:'MARUTI',name:'Maruti Suzuki India Ltd.',industry:'Automobile and Auto Components',group:'ऑटोमोबाइल और वाहन',element:'अग्नि · धातु',tags:['मोटर','वाहन','मशीनरी','लोहा','शेयर']},
 {symbol:'MAXHEALTH',name:'Max Healthcare Institute Ltd.',industry:'Healthcare',group:'स्वास्थ्य और औषधि',element:'जल · औषधि',tags:['औषधि','औषधियाँ','मूल','शेयर']},
 {symbol:'NTPC',name:'NTPC Ltd.',industry:'Power',group:'ऊर्जा और बिजली',element:'अग्नि · बिजली',tags:['बिजली','बिजली के यंत्र','अग्नि-साधन','शेयर']},
 {symbol:'NESTLEIND',name:'Nestle India Ltd.',industry:'Fast Moving Consumer Goods',group:'खाद्य और उपभोक्ता',element:'जल · रस',tags:['रस','मिठाई','मिष्टान्न','दूध','शेयर']},
 {symbol:'ONGC',name:'Oil & Natural Gas Corporation Ltd.',industry:'Oil Gas & Consumable Fuels',group:'ऊर्जा और ईंधन',element:'अग्नि · तेल',tags:['तेल','मिट्टी का तेल','भूगर्भीय वस्तुएँ','शेयर']},
 {symbol:'POWERGRID',name:'Power Grid Corporation of India Ltd.',industry:'Power',group:'ऊर्जा और बिजली',element:'अग्नि · बिजली',tags:['बिजली','बिजली के यंत्र','बिजली-संबंधी वस्तुएँ','शेयर']},
 {symbol:'RELIANCE',name:'Reliance Industries Ltd.',industry:'Oil Gas & Consumable Fuels',group:'ऊर्जा, रसायन और उपभोक्ता',element:'अग्नि · तेल',tags:['तेल','मिट्टी का तेल','रसादि','व्यापारिक वस्तुएँ','शेयर']},
 {symbol:'SBILIFE',name:'SBI Life Insurance Company Ltd.',industry:'Financial Services',group:'बीमा और वित्त',element:'जल · सुरक्षा',tags:['शेयर','बॉन्ड','संयुक्त पूंजी कंपनियाँ','सामान्य बाजार']},
 {symbol:'SHRIRAMFIN',name:'Shriram Finance Ltd.',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','बॉन्ड','शेयर']},
 {symbol:'SBIN',name:'State Bank of India',industry:'Financial Services',group:'बैंकिंग और वित्त',element:'वायु · विनिमय',tags:['बैंक शेयर','बैंक','शेयर','साधारण शेयर']},
 {symbol:'SUNPHARMA',name:'Sun Pharmaceutical Industries Ltd.',industry:'Healthcare',group:'स्वास्थ्य और औषधि',element:'अग्नि · औषधि',tags:['औषधि','औषधियाँ','सूर्य-सम्बन्धित वस्तुएँ','मूल','शेयर']},
 {symbol:'TCS',name:'Tata Consultancy Services Ltd.',industry:'Information Technology',group:'सूचना प्रौद्योगिकी',element:'वायु · बुध',tags:['बुध-सम्बन्धित वस्तुएँ','लेखन-पठन सामग्री','रेडियो','शेयर']},
 {symbol:'TATACONSUM',name:'Tata Consumer Products Ltd.',industry:'Fast Moving Consumer Goods',group:'खाद्य और उपभोक्ता',element:'जल · रस',tags:['रस','मसाले','चाय','व्यापारिक वस्तुएँ','शेयर']},
 {symbol:'TMPV',name:'Tata Motors Passenger Vehicles Ltd.',industry:'Automobile and Auto Components',group:'ऑटोमोबाइल और वाहन',element:'अग्नि · धातु',tags:['मोटर','वाहन','मशीनरी','लोहा','शेयर']},
 {symbol:'TATASTEEL',name:'Tata Steel Ltd.',industry:'Metals & Mining',group:'धातु और खनन',element:'पृथ्वी · धातु',tags:['लोहा','धातु','खनिज','आयरन शेयर','शेयर']},
 {symbol:'TECHM',name:'Tech Mahindra Ltd.',industry:'Information Technology',group:'सूचना प्रौद्योगिकी',element:'वायु · बुध',tags:['बुध-सम्बन्धित वस्तुएँ','लेखन-पठन सामग्री','रेडियो','शेयर']},
 {symbol:'TITAN',name:'Titan Company Ltd.',industry:'Consumer Durables',group:'रत्न और विलासिता',element:'पृथ्वी · रत्न',tags:['सोना','रत्न','मणि','आभूषण','शेयर']},
 {symbol:'TRENT',name:'Trent Ltd.',industry:'Consumer Services',group:'उपभोक्ता और वस्त्र',element:'जल · वस्त्र',tags:['वस्त्र','सूती वस्त्र','रेशमी वस्त्र','विलासिता सामग्री','शेयर']},
 {symbol:'ULTRACEMCO',name:'UltraTech Cement Ltd.',industry:'Construction Materials',group:'निर्माण सामग्री',element:'पृथ्वी · भूमि',tags:['सीमेंट','संगमरमर','मिट्टी','भूमि','शेयर']},
];

export const NIFTY50_SOURCE = 'https://www.niftyindices.com/IndexConstituent/ind_nifty50list.csv';
export const NIFTY50_SOURCE_DATE = '28 Oct 2026';

const GENERIC = new Set(['शेयर','साधारण शेयर','कंपनियों के शेयर','सामान्य बाजार','सभी व्यापारिक पदार्थ','सभी व्यापारिक वस्तुएँ']);
export function rankNifty50(data:{rules:{commodities:string[]}[]}) {
 return NIFTY50_RESEARCH.map(stock=>{
  const matched=data.rules.filter(rule=>stock.tags.some(tag=>rule.commodities.includes(tag)));
  const specific=data.rules.filter(rule=>stock.tags.some(tag=>!GENERIC.has(tag)&&rule.commodities.includes(tag)));
  return {...stock,ruleCount:matched.length,specificRuleCount:specific.length,matchedTags:[...new Set(matched.flatMap(r=>r.commodities).filter(x=>stock.tags.includes(x)))].sort((a,b)=>a.localeCompare(b,'hi'))};
 }).sort((a,b)=>b.specificRuleCount-a.specificRuleCount||b.ruleCount-a.ruleCount||a.name.localeCompare(b.name));
}
