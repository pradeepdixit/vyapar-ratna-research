import { useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { Download, Play, Square } from 'lucide-react';
import { calculateAstro, NAKSHATRAS, RASHIS, type AstroSnapshot, type Planet } from '../lib/astro';
import { angleDistance, matchingRules, type BookData } from '../lib/rules';
import { vedhas, nakshatra28, SBC_NAKSHATRAS } from '../lib/sbc';
import { exportRows } from '../lib/export';
import type { Location } from './LocationFields';
import { evaluateMasterRules } from '../lib/masterRules';
import { USER_PROVIDED_RULES } from '../lib/userProvidedRules';

type Props = { snapshot: AstroSnapshot | null; location: Location; data: BookData };
type Sample = { iso: string; snapshot: AstroSnapshot };
type PlanetState = Planet & { combust: boolean; dignity: string; state: string };
const PLANETS = ['सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
const COMBUST_LIMITS: Record<string, number> = { बुध: 14, शुक्र: 10, मंगल: 17, गुरु: 11, शनि: 15 };
const localInput = (iso: string, zone: string) => DateTime.fromISO(iso).setZone(zone).toFormat("yyyy-MM-dd'T'HH:mm");
const displayTime = (iso: string, zone: string) => DateTime.fromISO(iso).setZone(zone).toFormat('dd MMM yyyy · HH:mm');
const dignity = (p: Planet) => {
  const own: Record<string, number[]> = { सूर्य:[4], चंद्रमा:[3], मंगल:[0,7], बुध:[2,5], गुरु:[8,11], शुक्र:[1,6], शनि:[9,10] };
  const exalt: Record<string, number> = { सूर्य:0, चंद्रमा:1, मंगल:9, बुध:5, गुरु:3, शुक्र:11, शनि:6 };
  const debil: Record<string, number> = { सूर्य:6, चंद्रमा:7, मंगल:3, बुध:11, गुरु:9, शुक्र:5, शनि:0 };
  if (exalt[p.name] === p.sign) return 'उच्च';
  if (debil[p.name] === p.sign) return 'नीच';
  if (own[p.name]?.includes(p.sign)) return 'स्वक्षेत्र';
  return 'सामान्य';
};
function planetState(p: Planet, sun: Planet | undefined): PlanetState {
  const separation = sun && p.name !== 'सूर्य' ? angleDistance(p.longitude, sun.longitude) : 180;
  const combust = Boolean(COMBUST_LIMITS[p.name] && separation <= COMBUST_LIMITS[p.name]);
  const movement = p.name === 'सूर्य' || p.name === 'चंद्रमा' ? 'मार्गी' : p.retrograde ? 'वक्री' : 'मार्गी';
  return { ...p, combust, dignity: dignity(p), state: `${movement}${combust ? ' · अस्त' : ''}` };
}
function sampleRows(sample: Sample) {
  const sun = sample.snapshot.planets.find(p => p.name === 'सूर्य');
  return sample.snapshot.planets.slice(0, 9).map(p => planetState(p, sun));
}
function pairs(sample: Sample) {
  const ps = sampleRows(sample); const out: { a:string; b:string; angle:number }[] = [];
  for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) out.push({ a:ps[i].name,b:ps[j].name,angle:angleDistance(ps[i].longitude,ps[j].longitude) });
  return out.sort((a,b)=>a.angle-b.angle);
}
function horaSegments(samples: Sample[], zone: string) {
  const out: { planet:string; start:string; end:string }[] = [];
  for (const sample of samples) {
    const hora = sample.snapshot.hora?.planet || 'उपलब्ध नहीं'; const last = out[out.length-1];
    if (last && last.planet === hora) last.end = sample.iso; else out.push({planet:hora,start:sample.iso,end:sample.iso});
  }
  return out.map(x => ({...x,start:displayTime(x.start,zone),end:displayTime(x.end,zone)}));
}
function moonChanges(samples: Sample[], zone: string) {
  const out: { from:string; to:string; time:string; pada:number }[] = [];
  let previous = '';
  for (const sample of samples) {
    const moon = sample.snapshot.planets.find(p=>p.name==='चंद्रमा'); if (!moon) continue;
    const key = `${moon.nakshatra}-${moon.pada}`;
    if (previous && previous !== key) out.push({from:previous,to:key,time:displayTime(sample.iso,zone),pada:moon.pada});
    previous = key;
  }
  return out;
}
export default function IntradayResearch({ snapshot, location, data }: Props) {
  const initial = snapshot ? localInput(snapshot.iso, location.zone) : '';
  const initialEnd = snapshot ? localInput(DateTime.fromISO(snapshot.iso).setZone(location.zone).plus({hours:1}).toISO()!, location.zone) : '';
  const [from,setFrom]=useState(initial),[to,setTo]=useState(initialEnd),[samples,setSamples]=useState<Sample[]>([]),[selected,setSelected]=useState(0),[busy,setBusy]=useState(false),[progress,setProgress]=useState(''),[error,setError]=useState('');
  const stop=useRef(false); const run=useRef(0);
  useEffect(()=>{if(snapshot&& !samples.length){setFrom(localInput(snapshot.iso,location.zone));setTo(localInput(DateTime.fromISO(snapshot.iso).setZone(location.zone).plus({hours:1}).toISO()!,location.zone));}},[snapshot?.iso,location.zone]);
  const calculate=async()=>{
    const start=DateTime.fromISO(from,{zone:location.zone}), end=DateTime.fromISO(to,{zone:location.zone});
    if(!start.isValid||!end.isValid||end.toMillis()<start.toMillis()){setError('From और To date-time सही भरें।');return;}
    const count=Math.floor((end.toMillis()-start.toMillis())/60000)+1;
    if(count>10081){setError('अधिकतम 7 दिन तक का minute range चुनें (10,081 samples)।');return;}
    const id=++run.current;stop.current=false;setBusy(true);setError('');setSamples([]);setSelected(0);setProgress(`0 / ${count} minute`);const out:Sample[]=[];
    try{for(let i=0;i<count;i++){if(stop.current||id!==run.current)return;const t=start.plus({minutes:i});out.push({iso:t.toUTC().toISO()!,snapshot:await calculateAstro(t.toJSDate(),location.lat,location.lon,location.zone)});if(i%10===0){setProgress(`${i+1} / ${count} minute · ${t.toFormat('dd MMM yyyy HH:mm')}`);await new Promise(r=>setTimeout(r,0));}}setSamples(out);setProgress(`गणना पूरी · ${count} minute samples`);}catch(e){if(id===run.current)setError(e instanceof Error?e.message:String(e));}finally{if(id===run.current)setBusy(false);}
  };
  const active=samples[selected]; const rows=active?sampleRows(active):[]; const angleRows=active?pairs(active):[]; const moon=active?.snapshot.planets.find(p=>p.name==='चंद्रमा'); const vedhaRows=active?vedhas(active.snapshot,'all-three'):[]; const bookRules=active?matchingRules(data.rules,active.snapshot):[]; const masterRules=active?evaluateMasterRules(active.snapshot):[]; const segments=useMemo(()=>horaSegments(samples,location.zone),[samples,location.zone]); const changes=useMemo(()=>moonChanges(samples,location.zone),[samples,location.zone]);
  const download=()=>{if(!samples.length)return;exportRows(samples.flatMap(s=>sampleRows(s).map(p=>({समय:displayTime(s.iso,location.zone),ग्रह:p.name,निरयन_डिग्री:p.longitude.toFixed(8),राशि:RASHIS[p.sign],नक्षत्र:NAKSHATRAS[p.nakshatra],चरण:p.pada,गति:p.state,बल_अवस्था:`${p.dignity}${p.combust?' · अस्त':''}`,होरा:s.snapshot.hora?.planet||''}))),'intraday-planet-research','xlsx');};
  return <><div className="page-heading"><div><div className="eyebrow">INTRADAY · MINUTE-WISE PLANET RESEARCH</div><h1>Intraday ग्रह-अध्ययन</h1><p>From date-time से To date-time तक हर minute पर निरयन ग्रह, नक्षत्र-पाद, कोण, होरा, SBC वेध और अवस्था देखें।</p></div><button className="button secondary" onClick={download} disabled={!samples.length}><Download size={16}/> Excel डाउनलोड</button></div>
    <section className="panel intraday-controls"><div className="section-title"><div><h2>अपना पूरा समय-क्षेत्र डालें</h2><p className="note">दोनों समय शामिल होंगे। गणना आपके चुने हुए स्थान और timezone पर होगी।</p></div><span className="tag">अधिकतम 7 दिन · हर 1 minute</span></div><div className="intraday-inputs"><label>From date-time<input type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To date-time<input type="datetime-local" value={to} onChange={e=>setTo(e.target.value)}/></label><button className="button primary" onClick={()=>void calculate()} disabled={busy}><Play size={16}/>{busy?'गणना चल रही है…':'गणना शुरू करें'}</button>{busy&&<button className="button" onClick={()=>{stop.current=true;run.current++;setBusy(false);setProgress('गणना रोक दी गई।')}}><Square size={16}/>रोकें</button>}</div>{progress&&<div className="progress-wrap"><div className="progress-label"><span>{progress}</span><span>{location.name} · {location.zone}</span></div><progress value={samples.length} max={Math.max(samples.length,1)}/></div>}{error&&<div className="notice error">{error}</div>}</section>
    {!samples.length&&!busy&&<div className="empty"><h3>From और To समय डालकर गणना शुरू करें</h3><p>हर minute का वास्तविक Swiss Ephemeris · Lahiri snapshot बनाया जाएगा।</p></div>}
    {samples.length>0&&<><section className="panel"><div className="section-title"><h2>Minute timeline</h2><span className="tag">{samples.length} samples · चुना: {displayTime(active!.iso,location.zone)}</span></div><div className="intraday-timeline"><input type="range" min="0" max={samples.length-1} value={selected} onChange={e=>setSelected(Number(e.target.value))}/><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{samples.map((s,i)=><option key={s.iso} value={i}>{displayTime(s.iso,location.zone)}</option>)}</select></div></section>
      <section className="panel"><div className="section-title"><div><h2>Vyapar Ratna intraday नियम — इसी minute पर लागू</h2><p className="note">ग्रह-गणना के बाद encoded book conditions और intraday research rules अलग दिखाई जा रही हैं।</p></div><span className="tag">{bookRules.length} book · {masterRules.filter(r=>r.status==='active').length} derived active</span></div><div className="intraday-rule-summary"><div><strong>Book rules</strong><span>{bookRules.length?`${bookRules.filter(r=>r.signal==='तेजी').length} तेजी · ${bookRules.filter(r=>r.signal==='मंदी').length} मंदी · ${bookRules.filter(r=>r.signal!=='तेजी'&&r.signal!=='मंदी').length} mixed`:'इस snapshot पर कोई computable book condition नहीं मिली'}</span></div><div><strong>Intraday direction</strong><span>{masterRules.filter(r=>r.status==='active').map(r=>r.title).join(' · ')||'watch only'}</span></div></div>{bookRules.length>0&&<div className="table-scroll"><table><thead><tr><th>Rule ID</th><th>नियम</th><th>समय-अवधि</th><th>संकेत</th><th>Source</th></tr></thead><tbody>{bookRules.slice(0,30).map(r=><tr key={r.id}><td className="mono">{r.id}</td><td><strong>{r.title}</strong><br/><small>{r.summary}</small></td><td>{r.timeframe}</td><td>{r.signal}</td><td>{r.source_ids.join(', ')||r.section}</td></tr>)}</tbody></table></div>}<div className="master-rule-grid">{masterRules.map(r=><article className={`master-rule-chip ${r.status}`} key={r.id}><strong>{r.title}</strong><span>{r.status==='active'?'ACTIVE':'WATCH'} · {r.signal}</span><small>{r.interpretation}</small><em>{r.evidence}</em></article>)}</div><p className="note">“Active” का अर्थ mathematical condition match है, निश्चित बाजार-फल नहीं। जिन numeric tables/बल-सारणी का पूरा data उपलब्ध नहीं है, उन्हें fabricated नहीं किया गया। {USER_PROVIDED_RULES.length} user-provided hypotheses reference context में सुरक्षित हैं।</p></section>
      <section className="panel"><div className="section-title"><h2>ग्रह की निरयन डिग्री · राशि · नक्षत्र और चरण</h2><span className="tag">{displayTime(active!.iso,location.zone)}</span></div><div className="table-scroll"><table><thead><tr><th>ग्रह</th><th>निरयन longitude</th><th>राशि</th><th>नक्षत्र</th><th>चरण</th><th>गति / स्थिति</th><th>बल / अवस्था</th></tr></thead><tbody>{rows.map(p=><tr key={p.name}><td><strong>{p.name}</strong></td><td className="mono">{p.longitude.toFixed(8)}°</td><td>{RASHIS[p.sign]}</td><td>{NAKSHATRAS[p.nakshatra]}</td><td>{p.pada}</td><td>{p.state}</td><td>{p.dignity}{p.combust?' · अस्त':''}</td></tr>)}</tbody></table></div><p className="note">अस्त की स्थिति सूर्य से angular separation के पारंपरिक सीमा-संकेत से निकाली गई है; ग्रहबल/अवस्था यहाँ research indicator है, पूर्ण शड्बल गणना नहीं।</p></section>
      <section className="panel"><div className="section-title"><h2>ग्रहों के आपसी कोण</h2><span className="tag">36 pairs</span></div><div className="angle-grid">{angleRows.map(p=><div key={p.a+p.b}><strong>{p.a} — {p.b}</strong><span>{p.angle.toFixed(6)}°</span></div>)}</div></section>
      <section className="panel"><div className="section-title"><h2>चंद्रमा का नक्षत्र परिवर्तन</h2><span className="tag">{changes.length} changes</span></div>{changes.length?<div className="table-scroll"><table><thead><tr><th>समय</th><th>पहले</th><th>बाद में</th><th>चरण</th></tr></thead><tbody>{changes.map((x,i)=><tr key={i}><td>{x.time}</td><td>{x.from}</td><td>{x.to}</td><td>{x.pada}</td></tr>)}</tbody></table></div>:<p className="note">इस range में चंद्रमा का नक्षत्र/चरण परिवर्तन नहीं हुआ। वर्तमान: {moon?`${NAKSHATRAS[moon.nakshatra]} · चरण ${moon.pada}`:'उपलब्ध नहीं'}.</p>}</section>
      <section className="panel"><div className="section-title"><h2>वार के अनुसार होरा और होरा स्वामी</h2><span className="tag">{segments.length} segments</span></div><div className="table-scroll"><table><thead><tr><th>होरा स्वामी</th><th>आरंभ</th><th>अंतिम minute sample</th></tr></thead><tbody>{segments.map((x,i)=><tr key={i}><td><strong>{x.planet}</strong></td><td>{x.start}</td><td>{x.end}</td></tr>)}</tbody></table></div><p className="note">प्रत्येक minute snapshot में Swiss sunrise/sunset आधारित weekday hora स्वामी लिया गया है।</p></section>
      <section className="panel"><div className="section-title"><h2>सर्वतोभद्र चक्र के अनुसार वेध</h2><span className="tag">{vedhaRows.length} current vedhas</span></div><div className="table-scroll"><table><thead><tr><th>ग्रह</th><th>स्रोत नक्षत्र</th><th>वेधित नक्षत्र</th><th>दिशा</th><th>वर्ग</th></tr></thead><tbody>{vedhaRows.map((v,i)=><tr key={i}><td>{v.planet}</td><td>{v.source} · पाद {v.sourcePada??'—'}</td><td>{v.target} · पाद {v.targetPada??'—'}</td><td>{v.direction}</td><td>{v.kind==='benefic'?'शुभ':v.kind==='malefic'?'क्रूर':'मिश्र'}</td></tr>)}</tbody></table></div><p className="note">SBC वेध selected minute के सभी 9 ग्रहों से calculate हुआ है।</p></section></>}
  </>;
}
