export type UserProvidedRule = {
  id: string;
  title: string;
  trigger: string;
  claimedEffect: string;
  evidence: string;
  engineTreatment: string;
  status: 'reference-only' | 'historical-check';
};

/**
 * These are transcribed from the user's pasted research note. They are not
 * silently promoted to deterministic book rules: the file-only prediction
 * engine may display them as context, but only historical OHLC outcomes can
 * produce the next-10-candle result.
 */
export const USER_PROVIDED_RULES: UserProvidedRule[] = [
  {
    id: 'BR-99',
    title: 'Mercury Velocity & Dual-Saturn Override Rule',
    trigger: 'बुध की गति +0.80°/दिन से अधिक; सूर्य और चंद्रमा एक ही शनि-शासित/मित्र नक्षत्र-समूह में; साथ में राहुकाल या मंगल होरा active हो।',
    claimedEffect: 'User note में स्थानीय राहुकाल/मंगल होरा को महा-क्रैश नहीं, बल्कि shallow dip / higher-high continuation के रूप में पढ़ने का दावा है।',
    evidence: 'सूर्य अनुराधा, चंद्रमा उत्तराभाद्रपद, शनि स्व-नक्षत्र और बुध अतिचारी गति वाला उदाहरण; pasted_content.txt में दिया गया।',
    engineTreatment: 'Context/override hypothesis मात्र। prediction को historical file के अगले 10 वास्तविक OHLC candles से validate किये बिना दिशा नहीं बदलेगा।',
    status: 'historical-check',
  },
  {
    id: 'BR-99-A',
    title: 'Dual Saturn Nakshatra Alignment',
    trigger: 'सूर्य और चंद्रमा दोनों शनि-शासित नक्षत्रों में हों तथा शनि जल राशि में बली बताया गया हो।',
    claimedEffect: 'स्थिर दीर्घकालीन प्रवाह / institutional inflow का user-proposed research interpretation।',
    evidence: 'पasted user rule note; exact source page और machine-readable strength table उपलब्ध नहीं।',
    engineTreatment: 'Reference-only; file में nakshatra fields मिलते हैं, लेकिन शनि के क्षेत्रबल का विश्वसनीय numeric column नहीं है।',
    status: 'reference-only',
  },
  {
    id: 'BR-99-B',
    title: 'Mercury Super-Fast Motion',
    trigger: 'बुध स्वाती में हो और गति +0.80°/दिन से अधिक बताई जाए।',
    claimedEffect: 'छोटे मंदी योग और राहुकाल टूटने, एकतरफा तेजी बनने की user-proposed hypothesis।',
    evidence: 'User note में +0.95°/दिन का उदाहरण दिया गया; उपलब्ध historical file में अलग बुध speed column नहीं है।',
    engineTreatment: 'Reference-only; longitude match और अगले 10 actual candles से अलग validation किये बिना override नहीं।',
    status: 'reference-only',
  },
  {
    id: 'BR-99-C',
    title: 'Jupiter Institutional Buffer',
    trigger: 'सिंह में मघा-1 पर गुरु का +4.5 क्षेत्रबल बताया जाए और मंगल होरा आने वाली हो।',
    claimedEffect: 'राहुकाल/मंगल होरा को short-squeeze या shallow dip में बदलने की user-proposed hypothesis।',
    evidence: 'User note में +4.5 क्षेत्रबल का दावा; uploaded minute file में क्षेत्रबल का स्वतंत्र numeric field नहीं।',
    engineTreatment: 'Reference-only; fabricated क्षेत्रबल या fabricated OHLC नहीं बनाया जाएगा।',
    status: 'reference-only',
  },
  {
    id: 'BR-99-D',
    title: 'Local Defect Does Not Automatically Override Trend',
    trigger: 'राहुकाल, मंगल होरा या समान local timing दोष अकेला active हो।',
    claimedEffect: 'बड़े planetary alignment के सामने local defect को standalone महा-क्रैश signal न मानने का नियम।',
    evidence: 'User-provided correction note; independent book-source verification नहीं।',
    engineTreatment: 'Prediction engine local दोष को hard override नहीं बनाता; historical match outcomes में तेजी/मंदी ratio ही अंतिम evidence है।',
    status: 'historical-check',
  },
];
