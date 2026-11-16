import type { AstroSnapshot, Planet } from './astro';

export type MasterRuleStatus = 'active' | 'watch' | 'inactive';
export type MasterRule = {
  id: string;
  title: string;
  source: string;
  condition: string;
  interpretation: string;
  status: MasterRuleStatus;
  evidence: string;
  signal: 'bullish' | 'bearish' | 'mixed' | 'watch';
};

const DEG = 1;
const DAY_LORDS = ['रवि','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि'];
const DAY_LORD_PLANETS: Record<string, string> = {रवि:'सूर्य',चंद्रमा:'चंद्रमा',मंगल:'मंगल',बुध:'बुध',गुरु:'गुरु',शुक्र:'शुक्र',शनि:'शनि'};
const DEBILITATED: Record<string, number> = {सूर्य:6,चंद्रमा:7,मंगल:3,बुध:11,गुरु:9,शुक्र:5,शनि:0};

function byName(snapshot: AstroSnapshot, name: string) { return snapshot.planets.find(p => p.name === name); }
function distance(a: number, b: number) { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); }
function degreeInSign(p: Planet) { return ((p.longitude % 30) + 30) % 30; }
function twoDecimal(value: number) { return value.toFixed(2); }
function near(value: number, target: number, tolerance: number) { return Math.abs(value - target) <= tolerance; }
function rahuKaal(snapshot: AstroSnapshot): {active:boolean; text:string} {
  if (!snapshot.sunrise || !snapshot.sunset) return {active:false,text:'सूर्योदय/सूर्यास्त उपलब्ध नहीं'};
  const sunrise = new Date(snapshot.sunrise).getTime(), sunset = new Date(snapshot.sunset).getTime();
  if (!Number.isFinite(sunrise) || !Number.isFinite(sunset) || sunset <= sunrise) return {active:false,text:'दिन की अवधि उपलब्ध नहीं'};
  const indexByWeekday = [7,1,6,4,5,3,2];
  const index = indexByWeekday[snapshot.weekday] ?? 0;
  const part = (sunset - sunrise) / 8;
  const start = sunrise + (index - 1) * part, end = start + part;
  const at = new Date(snapshot.iso).getTime();
  return {active:at >= start && at < end,text:`${new Date(start).toISOString()} से ${new Date(end).toISOString()} · ${Math.round(part/60000)} मिनट`};
}

export function evaluateMasterRules(snapshot: AstroSnapshot | null): MasterRule[] {
  if (!snapshot) return [];
  const moon = byName(snapshot,'चंद्रमा'), sun = byName(snapshot,'सूर्य');
  const planets = snapshot.planets;
  const moonDegree = moon ? degreeInSign(moon) : null;
  const dayLordName = DAY_LORDS[((snapshot.weekday % 7) + 7) % 7];
  const dayLord = byName(snapshot, DAY_LORD_PLANETS[dayLordName]);
  const sandhi = Boolean(moon && moonDegree !== null && moonDegree >= 28);
  const gandanta = Boolean(planets.some(p => [0,120,240].some(cusp => near(p.longitude % 360,cusp,0.3333))));
  const rahu = rahuKaal(snapshot);
  const hora = snapshot.hora?.planet ?? '';
  const horaCruel = ['मंगल','शनि','सूर्य'].includes(hora);
  const conjunctions = planets.flatMap((a,i)=>planets.slice(i+1).map(b=>({a,b,d:distance(a.longitude,b.longitude)}))).filter(x=>x.d < 1/6);
  const amavasya = Boolean(sun && moon && distance(sun.longitude,moon.longitude) < 12);
  const dayLordWeak = Boolean(dayLord && (dayLord.retrograde || dayLord.sign === DEBILITATED[dayLord.name]));
  const net = (sandhi?-1.5:0) + (gandanta?-3:0) + (rahu.active?-3.5:0) + (horaCruel?-2:0) + (dayLordWeak?-2:0) + (amavasya?-1:0);
  const netSignal = net > 2.5 ? 'bullish' : net < -2 ? 'bearish' : 'mixed';
  return [
    {id:'rashi-sandhi',title:'राशि-संधि liquidity freeze',source:'Master checklist · Vyapar Ratna pages 270–272',condition:'चंद्रमा 28°00′–29°59′ में',interpretation:'अंतिम 2° में liquidity contraction, false move और opening shakeout का research signal।',status:sandhi?'active':'inactive',evidence:moon?`चंद्रमा ${twoDecimal(moonDegree!)}° राशि-अंश पर`:'चंद्रमा data नहीं',signal:sandhi?'bearish':'watch'},
    {id:'gandanta',title:'गंडान्त transition shock',source:'Master checklist · pages 150–155',condition:'जल-अग्नि cusp के ±0.333° में कोई ग्रह',interpretation:'प्रवेश पर liquidity drain; cusp पार करने के बाद reversal watch।',status:gandanta?'active':'inactive',evidence:gandanta?'किसी ग्रह की longitude cusp के निकट है':'कोई ग्रह gandanta सीमा के निकट नहीं',signal:gandanta?'bearish':'watch'},
    {id:'rahu-kaal',title:'Dynamic राहुकाल',source:'Master checklist · pages 64–65',condition:'सूर्योदय–सूर्यास्त को 8 बराबर भागों में बाँटकर current window',interpretation:'Rahu-kaal active होने पर dip/freeze watch; Mars/Saturn hora overlap को अलग चेतावनी रखें।',status:rahu.active?'active':'inactive',evidence:rahu.text+(rahu.active&&horaCruel?' · cruel hora overlap':'') ,signal:rahu.active?'bearish':'watch'},
    {id:'day-lord-health',title:'Day Lord health rule',source:'Master checklist · corrected 13-Nov rule',condition:`${dayLordName} और उसकी hora/स्थितिबल`,interpretation:dayLordWeak?'नीच/वक्री Day Lord को bullish recovery नहीं मानें; delayed-bottom / liquidity-drain watch।':'स्वस्थ Day Lord की hora को institutional-liquidity watch माना जा सकता है; इसे guarantee न समझें।',status:dayLordWeak?'active':'watch',evidence:dayLord?`${dayLord.name} · राशि ${dayLord.sign+1} · ${dayLord.retrograde?'वक्री':'मार्गी'}`:'Day Lord data नहीं',signal:dayLordWeak?'bearish':'watch'},
    {id:'graha-yuddha',title:'Exact conjunction / ग्रह-युद्ध',source:'Master checklist · conjunction threshold',condition:'किसी ग्रह-युगल का अंतर < 0.1667°',interpretation:'अत्यधिक volatility / whipsaw watch; direction अपने-आप निश्चित नहीं होती।',status:conjunctions.length?'active':'inactive',evidence:conjunctions.length?conjunctions.slice(0,3).map(x=>`${x.a.name}–${x.b.name} ${twoDecimal(x.d)}°`).join(' · '):'ऐसा कोई tight conjunction नहीं',signal:conjunctions.length?'mixed':'watch'},
    {id:'kshina-chandra',title:'अमावस्या / क्षीण चंद्र',source:'Master checklist · page 100',condition:'सूर्य–चंद्र दूरी < 12°',interpretation:'Sentiment fickle और swing-speed बढ़ने का research watch; direction अलग नियमों से तय होगी।',status:amavasya?'active':'inactive',evidence:sun&&moon?`सूर्य–चंद्र दूरी ${twoDecimal(distance(sun.longitude,moon.longitude))}°`:'सूर्य/चंद्र data नहीं',signal:amavasya?'mixed':'watch'},
    {id:'net-strength',title:'Net market strength matrix',source:'Master checklist · क्षेत्रबल बनाम काल-दोष',condition:'सरल current score = active दोषों का भार',interpretation:net > 2.5?'ऊपरी expansion watch':net < -2?'मंदी expansion watch':'range/choppy watch; exact points का दावा नहीं।',status:Math.abs(net)>0?'active':'watch',evidence:`current research score ${net.toFixed(1)} · hora ${hora||'उपलब्ध नहीं'}`,signal:netSignal},
  ];
}

export function masterRuleSummary(snapshot: AstroSnapshot | null) {
  const rules = evaluateMasterRules(snapshot);
  return {rules,active:rules.filter(r=>r.status==='active'),bearish:rules.filter(r=>r.signal==='bearish'),mixed:rules.filter(r=>r.signal==='mixed')};
}
