export type PastedSbcRule={id:string;title:string;text:string;status:'used'|'not-present';source:string};
export const PASTED_SBC_RULES:PastedSbcRule[]=[
 {id:'P1-31',title:'तीन वेध',text:'ग्रह जिस नक्षत्र पर स्थित होता है, वहाँ से वाम, सम्मुख और दक्षिण तीन वेध लिये जाते हैं।',status:'used',source:'pasted_content.txt'},
 {id:'P1-33',title:'पाँच तारा-ग्रहों की दिशा',text:'मंगल, बुध, गुरु, शुक्र और शनि में वक्री = दक्षिण, शीघ्र = वाम, मध्यचारी = सम्मुख वेध।',status:'used',source:'pasted_content.txt'},
 {id:'P1-36',title:'सूर्य-चंद्र-राहु-केतु',text:'राहु-केतु वक्री तथा सूर्य-चंद्र शीघ्र माने गये हैं; पाठ के अनुसार इन चारों के तीनों वेध दिखाये जाते हैं।',status:'used',source:'pasted_content.txt'},
 {id:'P1-25',title:'28 नक्षत्र विन्यास',text:'कृत्तिका से क्रम, अभिजित् सहित 28 नक्षत्र; अभिजित् उत्तराषाढ़ा और श्रवण के बीच।',status:'used',source:'pasted_content.txt'},
 {id:'P2-NV',title:'नवांश-वेध और पाद',text:'सामने वाले नक्षत्र के उलटे चरण को केवल सम्मुख नवांश-वेध में दिखाया गया है; जैसे स्रोत पाद 1 से लक्ष्य पाद 4।',status:'used',source:'pasted_content_2.txt'},
 {id:'P2-TI',title:'तिथि-वेध का पक्ष-भेद',text:'पाठ के अनुसार शुक्ल पक्ष में तिथि-वेध का पूरा फल और कृष्ण पक्ष में आधा फल माना जाता है।',status:'used',source:'pasted_content_2.txt'},
 {id:'P2-FD',title:'पूर्ण दृष्टि की शर्त',text:'वेध होने पर ही दृष्टि फल देती है; दृष्टिहीन वेध का शुभ-अशुभ फल नहीं माना जाता।',status:'used',source:'pasted_content_2.txt'},
 {id:'P2-V20',title:'विंशोपक आधार',text:'पूर्ण दृष्टि और पूर्ण वेध पर सौम्य ग्रह को 5 तथा क्रूर ग्रह को 4 फल-विंशोपक; कम पाद/दृष्टि में अनुपात से घटता है।',status:'used',source:'pasted_content_2.txt'},
 {id:'P3-KSH',title:'क्षेत्रबल सारिणी',text:'pasted तालिका का सूत्र: 15 अंश तक बल बढ़ता है, 15 के बाद 30 तक घटता है; स्व 4×, मित्र 3×, सम 2×, शत्रु 1×।',status:'used',source:'pasted_content_3.txt'},
 {id:'P3-NB',title:'नवांश-बल सारिणी',text:'pasted तालिका का सूत्र: नवांश कला पर स्व 0.60×, मित्र 0.45×, सम 0.30×, शत्रु 0.15×; 100 के बाद 200 से घटाकर।',status:'used',source:'pasted_content_3.txt'},
 {id:'P3-GATI',title:'गति-वर्ग और वेध',text:'pasted समीक्षा में वक्री/अतिवक्री/कुटिल को दक्षिण, अति-शीघ्र को वाम और मध्य/सम/मन्द को सम्मुख दिशा से जोड़ा गया है; app में अज्ञात गति को अनुमान से नहीं चुना जाता।',status:'used',source:'pasted_content_3.txt'},
 {id:'P3-MARKET',title:'NIFTY और सोना-specific सूत्र',text:'इन pasted SBC texts में NIFTY या सोने के नाम से अलग वेध-सूत्र नहीं दिया गया। इसलिए market tag chart की ग्रह-वेध geometry नहीं बदलता; संबंधित पुस्तक rules को filter/highlight करता है।',status:'not-present',source:'pasted_content_2.txt'},
 {id:'P4-VISH',title:'शुभ/क्रूर विंशोपक सारिणी',text:'कुल 20 विंशोपक: 4 शुभ ग्रहों में पूरा मान 5-5 और 5 क्रूर ग्रहों में 4-4; पूर्ण, त्रिपाद, द्विपाद और एकपाद वेध/दृष्टि के अनुपात से फल निकाला जाता है।',status:'used',source:'pasted_content_4.txt'},
 {id:'P4-EXAMPLE',title:'विंशोपक उदाहरण',text:'पाठ के उदाहरण में बुध का 3 वेध्य पर पूर्ण वेध/दृष्टि = 3/0/0 और शनि का 3 वेध्य पर पूर्ण वेध/दृष्टि = 2/24/0 दिखाया गया है।',status:'used',source:'pasted_content_4.txt'},
 {id:'P5-INTERVAL',title:'दो अवधि का निर्णय',text:'पहली अवधि आरम्भ-बाजार समय और दूसरी अवधि समाप्ति/भावी समय रखकर दोनों समयों की ग्रह-सारिणी, वेध और फल-विंशोपक की तुलना करनी है।',status:'used',source:'pasted_content_5.txt'},
 {id:'P5-PLANETS',title:'ग्रह-सारिणी में दर्ज होने वाले fields',text:'पाठ में राशि, अंश-कला-विकला, गति, वक्र/शीघ्र/सम, नक्षत्र-पाद, क्षेत्र, नवांश, उदय-अस्त और पाँच बलों का योग दर्ज करने को कहा गया है।',status:'used',source:'pasted_content_5.txt'},
 {id:'P5-PANCHAK',title:'देश-काल-पण्य वेध',text:'देश, काल और पण्य के अलग वर्णादि-पञ्चक बनाकर उनके वेध-पाद और राशि-दृष्टि-पाद से शुभ/क्रूर विंशोपक निकालने की प्रक्रिया दी गयी है।',status:'used',source:'pasted_content_5.txt'},
 {id:'P5-DELTA',title:'भावी मूल्य-अंतर',text:'दो अवधियों के फल-विंशोपक के अंतर को current value के साथ त्रैराशिक से जोड़कर/घटाकर भावी मूल्य-अंतर निकालने का source workflow दिया गया है।',status:'used',source:'pasted_content_5.txt'},
 {id:'P5-OCR',title:'उदाहरण और OCR सावधानी',text:'पाँचवें source में ऐतिहासिक मुंबई-चाँदी उदाहरण और OCR-सुधारे हुए अंक हैं; इन्हें research reference के रूप में रखा गया है, live NIFTY/सोना price forecast के रूप में नहीं।',status:'not-present',source:'pasted_content_5.txt'},
];
export function pastedMarketNote(market:string){
 const q=market.trim().toLowerCase();
 if(q.includes('nifty')||q.includes('निफ्टी')) return 'इस pasted SBC अंश में NIFTY-specific सूत्र नहीं है। इसलिए NIFTY चुनने पर live ग्रह-वेध वही रहेगा; नीचे पुस्तक के शेयर/सामान्य-बाजार rules highlight होंगे।';
 if(q.includes('gold')||q.includes('सोना')||q.includes('स्वर्ण')||q.includes('सुवर्ण')) return 'इस pasted SBC अंश में सोना-specific सूत्र नहीं है। इसलिए सोना चुनने पर live ग्रह-वेध वही रहेगा; नीचे पुस्तक के सोना rules highlight होंगे।';
 return 'बाजार का नाम वेध की खगोलीय दिशा नहीं बदलता; वह केवल commodity-related पुस्तक rules का filter है।';
}
