import type { AstroSnapshot } from '../lib/astro';
import SunRules from './SunRules';
import MoonRules from './MoonRules';

type Props = { snapshot: AstroSnapshot | null };

export default function SunMoonRules({ snapshot }: Props) {
  return <div className="sun-moon-rules-page">
    <section className="panel sun-moon-intro"><div className="eyebrow">JOINT SOURCE WORKSPACE · P6 + P7 + P8</div><h1>सूर्य और चन्द्र नियम केंद्र</h1><p>ऊपर चुने गये date-time और location का एक ही AstroSnapshot दोनों panels में उपयोग होता है। पहले सूर्य के source-linked नियम और राशिफल, फिर चन्द्र नियम तथा उन्हीं चन्द्र-द्रव्यों से जुड़ी NSE F&O stock mapping देखें।</p><div className="sun-moon-contract"><strong>Calculation contract</strong><span>एक समय · एक ग्रह snapshot · अलग source conditions · कोई fabricated OHLC नहीं</span></div></section>
    <SunRules snapshot={snapshot}/>
    <MoonRules snapshot={snapshot}/>
  </div>;
}
