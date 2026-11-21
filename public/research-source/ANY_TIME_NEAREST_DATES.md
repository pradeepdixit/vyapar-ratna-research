# किसी भी समय का नौ-ग्रह मिलान — Nearest 10 Historical Dates

## दायरा

केवल `#prediction` page बदला गया है। पुराने 361-candle औसत chart, probability cards और BR-99 panel इस page से हटे हैं। बाकी वेबसाइट के पुस्तक नियम और pages सुरक्षित हैं।

चुनी तारीख के 09:15 AM से 03:15 PM IST तक दोनों समय सहित 361 स्वतंत्र मिनटों के सूर्य, चंद्रमा, मंगल, बुध, गुरु, शुक्र, शनि, राहु और केतु के निरयन अंश मौजूदा Swiss Ephemeris/Lahiri calculator से निकलते हैं। राहु/केतु mean-node convention का उपयोग करते हैं।

## Historical समय स्वतंत्र है

Target का 09:15 केवल historical 09:15 तक सीमित नहीं है। वह file के उस दिन के 09:16, 11:40, 15:29 या किसी अन्य उपलब्ध valid minute से मिल सकता है। सभी नौ ग्रह हमेशा उसी एक वास्तविक historical row से लिए जाते हैं। ग्रहों को अलग-अलग तारीखों या समयों से लेकर कोई मिश्रित नकली स्थिति नहीं बनाई जाती।

प्रत्येक target मिनट और historical row के लिए, प्रत्येक ग्रह की दूरी `min(|a−b| mod 360, 360−(|a−b| mod 360))` है। नौ ग्रहों की दूरियों का औसत उस pair का error है।

हर historical तारीख पर सभी target मिनटों और सभी historical rows का मिलान किया जाता है। हर target मिनट का nearest historical row रखा जाता है। तारीख का rank पूरे दिन के सबसे छोटे pair error से बनता है—nearest of nearest। यह पूरे दिन की औसत similarity नहीं है। बराबर scores होने पर तारीख और समय chronological क्रम में रहते हैं। सबसे कम error वाली 10 अलग dates दिखाई जाती हैं।

## दिखने वाले परिणाम

हर rank में historical तारीख, target का शोध समय, historical मिला हुआ समय, औसत नौ-ग्रह अंतर और geometric similarity दिखते हैं। तारीख चुनने के बाद सभी 361 target मिनटों में से कोई मिनट देख सकते हैं; उस मिनट के nearest historical समय तथा हर ग्रह के दोनों अंश और अंतर दिखेंगे। Copy और CSV में तारीख के साथ दोनों समय आते हैं।

केवल चुनी तारीख से पहले के historical दिन eligible हैं। खाली/non-numeric ग्रह-अंश, invalid time और missing planet rows से कोई value नहीं बनाई जाती। Historical तारीख पर कम-से-कम एक valid नौ-ग्रह row जरूरी है; exact 361 historical slots जरूरी नहीं। File में उपलब्ध rows से बाहर कोई समय नहीं बनाया जाता।

## सीमाएँ

`Similarity = 100 × (1 − error/180)` केवल geometric score है। यह बाजार की तेजी/मंदी की probability, guaranteed prediction या validated trading edge नहीं है। हर ग्रह का वजन बराबर है; राहु और केतु दोनों रखे हैं क्योंकि उपयोगकर्ता ने सभी नौ ग्रह माँगे हैं। किसी दिन पर निकट ग्रह-मिलान अपने आप समान बाजार चाल साबित नहीं करता।

Quarter files Web Worker में क्रम से scan होती हैं। User progress देख सकता है और गणना रोक सकता है। Date बदलने पर पुराने परिणाम हटते हैं। मुख्य UI में लाखों rows एक साथ render नहीं होतीं।
