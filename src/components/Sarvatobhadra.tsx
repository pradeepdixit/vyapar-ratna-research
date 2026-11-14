import { useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { calculateAstro, type AstroSnapshot } from '../lib/astro';
import { SBC_CELLS, SBC_NAKSHATRAS, nakshatra28, vedhas, type SbcMode, type SbcVedha } from '../lib/sbc';
import { exportRows } from '../lib/export';
import MultiSelect from './MultiSelect';
import type { Location } from './LocationFields';
import type { BookData, SourceBlock } from '../lib/rules';
import { filterSelection } from '../lib/selection';
import RuleCard from './RuleCard';
const INNER=[
 ['ई','','','','','','','','अ'],
 ['','ऋ','ग','स','द','च','ल','उ',''],
 ['','ख','ऐ','कुंभ','मीन','मेष','ऌ','अ',''],
 ['','ज','मकर','अः','शुक्रवार','ओ','वृषभ','व',''],
 ['','भ','धनु','गुरुवार','शनिवार','रवि / मंगल','मिथुन','क',''],
 ['','य','वृश्चिक','अं','सोम / बुध','औ','कर्क','ह',''],
 ['','न','ए','तुला','कन्या','सिंह','ॡ','ड',''],
 ['','ॠ','त','र','प','ट','म','ऊ',''],
 ['इ','','','','','','','','आ'],
];
type Window={planet:string;source:string;targets:string;start:string;end:string;samples:number;};
const motionPlanets=['मंगल','बुध','गुरु','शुक्र','शनि'];
export default function Sarvatobhadra({snapshot,location,data,blocks}:{snapshot:AstroSnapshot|null;location:Location;data:BookData;blocks:Map<string,SourceBlock>}) {
 const [selected,setSelected]=useState<string[]>([]),[targets,setTargets]=useState<string[]>([]),[mode,setMode]=useState<SbcMode>('all-three'),[motion,setMotion]=useState<Record<string,string>>({}),[focus,setFocus]=useState('चंद्रमा'),[commodities,setCommodities]=useState<string[]>([]);
 const [hours,setHours]=useState(24),[busy,setBusy]=useState(false),[progress,setProgress]=useState(0),[error,setError]=useState(''),[windows,setWindows]=useState<Window[]>([]),[futureInfo,setFutureInfo]=useState<{start:string;end:string;hours:number;label:string}|null>(null),[showRules,setShowRules]=useState(false);
 const stop=useRef(false),revision=useRef(0);
 const withMotion=(s:AstroSnapshot):AstroSnapshot=>({...s,planets:s.planets.map(p=>({...p,motion:motion[p.name]||undefined}))});
 const all=useMemo(()=>snapshot?vedhas(withMotion(snapshot),mode):[],[snapshot,mode,motion]);
 const current=useMemo(()=>all.filter(v=>(!selected.length||selected.includes(v.planet))&&(!targets.length||targets.includes(v.target))),[all,selected,targets]);
 const focused=all.filter(v=>v.planet===focus),sourceName=snapshot?.planets.find(p=>p.name===focus),occupied=sourceName?SBC_NAKSHATRAS[nakshatra28(sourceName.longitude)]:'';
 const related=useMemo(()=>filterSelection(data.rules,selected,commodities).filter(r=>r.source_ids.some(id=>{const b=blocks.get(id);return b&&b.section==='01';})),[data,selected,commodities,blocks]);
 useEffect(()=>{revision.current++;stop.current=true;setWindows([]);setFutureInfo(null);setError('');},[snapshot?.iso,location.lat,location.lon,location.zone,mode,motion,selected,targets]);
 useEffect(()=>()=>{stop.current=true;revision.current++;},[]);
 const local=(iso:string)=>DateTime.fromISO(iso).setZone(location.zone).toFormat('dd MMM · HH:mm');
 async function future(h:number) {
  if(!snapshot)return;
  const run=++revision.current;stop.current=false;setHours(h);setBusy(true);setProgress(0);setWindows([]);setFutureInfo(null);setError('');
  const out:Window[]=[],open=new Map<string,Window>(),start=new Date(snapshot.iso).getTime(),finish=start+h*3600000;
  try {
   for(let i=0;i<=h*60;i++){
    if(stop.current||run!==revision.current)return;
    const date=new Date(start+i*60000),s=i===0?snapshot:await calculateAstro(date,location.lat,location.lon,location.zone),vs=vedhas(withMotion(s),mode).filter(v=>(!selected.length||selected.includes(v.planet))&&(!targets.length||targets.includes(v.target)));
    const grouped=new Map<string,SbcVedha[]>();for(const v of vs){const a=grouped.get(v.planet)||[];a.push(v);grouped.set(v.planet,a);}
    const active=new Set<string>();
    for(const [planet,list] of grouped){const targetText=list.map(v=>`${v.target} (${v.direction})`).join(' · '),key=planet+'|'+list[0].source+'|'+targetText;active.add(key);let w=open.get(key);if(!w){w={planet,source:list[0].source,targets:targetText,start:date.toISOString(),end:date.toISOString(),samples:0};open.set(key,w);out.push(w);}w.end=date.toISOString();w.samples++;}
    for(const key of [...open.keys()])if(!active.has(key))open.delete(key);
    if(i%30===0){setProgress(i+1);await new Promise(r=>setTimeout(r,0));}
   }
   if(run===revision.current){setWindows(out);setProgress(h*60+1);setFutureInfo({start:snapshot.iso,end:new Date(finish).toISOString(),hours:h,label:mode==='all-three'?'तीनों ज्यामितीय वेध':'गति-चयन वेध'});}
  }catch(e){if(run===revision.current)setError(e instanceof Error?e.message:String(e));}
  finally{setBusy(false);}
 }
 return <><div className="page-heading"><div><div className="eyebrow">SARVATOBHADRA • LIVE & FORWARD</div><h1>सर्वतोभद्र वेध चक्र</h1><p>वर्तमान या चुने समय में किस ग्रह से किस नक्षत्र को वेध; आगे 2 या 24 घंटे की स्थिति।</p></div><span className="tag">28 नक्षत्र · अभिजित सहित</span></div>
 <section className="panel"><div className="multi-filter-row"><MultiSelect label="ग्रह" options={data.planets.slice(0,9)} value={selected} onChange={setSelected} disabled={busy}/><MultiSelect label="वेधित नक्षत्र" options={SBC_NAKSHATRAS} value={targets} onChange={setTargets} disabled={busy}/></div><div className="sbc-controls"><label>वेध पद्धति<select value={mode} disabled={busy} onChange={e=>setMode(e.target.value as SbcMode)}><option value="all-three">तीनों ज्यामितीय वेध — वाम/सम्मुख/दक्षिण</option><option value="directional">गति अनुसार — नीचे गति वर्ग चुनें</option></select></label><label>चक्र में रेखाएँ<select value={focus} onChange={e=>setFocus(e.target.value)}>{data.planets.slice(0,9).map(p=><option key={p}>{p}</option>)}</select></label></div>
 {mode==='directional'&&<><div className="multi-filter-row">{motionPlanets.map(p=><label key={p}>{p}<select value={motion[p]||''} disabled={busy} onChange={e=>setMotion({...motion,[p]:e.target.value})}><option value="">अज्ञात वर्ग — तीन संभावित वेध</option><option value="slow">मध्य/मंद गति — सम्मुख</option><option value="fast">शीघ्र/अतिचारी — वाम</option><option value="retrograde">वक्री — दक्षिण</option></select></label>)}</div><p className="notice warning">Swiss से वक्री स्थिति ज्ञात है। “शीघ्र/मध्य” की आपकी पुस्तक की संख्यात्मक गति-सारणी उपलब्ध नहीं है; इसलिए मार्गी ग्रह का वर्ग अनुमान से नहीं चुना जाता। वर्ग स्वयं चुनें; अज्ञात में तीन संभावित दिशाएँ दिखती हैं। सूर्य/चंद्र/राहु/केतु तीनों वेध देते हैं।</p></>}
 {!snapshot?<div className="empty">पहले ऊपर से तारीख, समय और स्थान लागू करें।</div>:<div className="sbc-layout"><div><div className="sbc-board"><div className="sbc-grid">{Array.from({length:81},(_,i)=>{const row=Math.floor(i/9),col=i%9,cell=SBC_CELLS.find(c=>c.row===row&&c.col===col),isSource=cell?.name===occupied,isTarget=cell&&focused.some(v=>v.target===cell.name),ps=cell?snapshot.planets.slice(0,9).filter(p=>SBC_NAKSHATRAS[nakshatra28(p.longitude)]===cell.name):[];return <div key={i} className={`sbc-cell ${cell?'':'inner'} ${isSource?'occupied':''} ${isTarget?'target':''}`}><span>{cell?.name||INNER[row][col]}</span>{ps.map(p=><strong className="sbc-planet" key={p.name}>{p.name}{p.retrograde?' ℞':''}</strong>)}</div>;})}</div><svg className="sbc-rays" viewBox="0 0 900 900" preserveAspectRatio="none" aria-hidden="true">{focused.map(v=>{const a=SBC_CELLS.find(c=>c.name===v.source)!,b=SBC_CELLS.find(c=>c.name===v.target)!;return <line key={v.target+v.direction} x1={a.col*100+50} y1={a.row*100+50} x2={b.col*100+50} y2={b.row*100+50} stroke="#a26d23" strokeWidth="4" strokeDasharray="9 7" opacity=".38"/>;})}</svg></div><p className="note">हरा: {focus} का नक्षत्र। सुनहरा: उससे वेधित नक्षत्र। बीच में वर्ण/राशि/वार का पारंपरिक विन्यास है; विशेष कोना/वर्ण-परिवर्तन और ग्रहबल के फलादेश अभी अलग reference हैं।</p></div><div><h2>{snapshot?local(snapshot.iso):''} · {location.name}</h2><div className="table-scroll"><table><thead><tr><th>ग्रह</th><th>स्थित नक्षत्र</th><th>वेधित नक्षत्र</th><th>दिशा</th></tr></thead><tbody>{current.map(v=><tr key={v.planet+v.target+v.direction}><td>{v.planet}</td><td>{v.source}</td><td className="bold">{v.target}</td><td>{v.direction}</td></tr>)}</tbody></table></div>{!current.length&&<p className="note">चुने filters में कोई वेध नहीं मिला। चयन हटाकर सभी देखें।</p>}</div></div>}
 <div className="notice warning">“तीनों” view संभावित ज्यामितीय संबंध दिखाता है, सभी को निश्चित सक्रिय बाजार-वेध नहीं मानें। वेध + ग्रहबल + वस्तु-स्वामी + पुस्तक की बाकी शर्तों से ही पूरा नियम बनेगा। अलग परंपराओं में विन्यास/अभिजित प्रयोग बदल सकता है।</div>
 <div className="sbc-controls"><button className="button primary" disabled={busy||!snapshot} onClick={()=>void future(2)}>अगले 2 घंटे</button><button className="button primary" disabled={busy||!snapshot} onClick={()=>void future(24)}>अगले 24 घंटे</button>{busy&&<button className="button secondary" onClick={()=>{stop.current=true;revision.current++;}}>रोकें</button>}</div>{busy&&<div className="progress-wrap"><span>{progress} / {hours*60+1} minute samples</span><progress value={progress} max={hours*60+1}/></div>}{error&&<div className="notice error">{error}</div>}
 {futureInfo&&<><div className="section-title"><h2>{local(futureInfo.start)} से {local(futureInfo.end)} · {futureInfo.label}</h2><button className="button secondary small" disabled={!windows.length} onClick={()=>exportRows(windows.map(w=>({'ग्रह':w.planet,'नक्षत्र':w.source,'वेध':w.targets,'पहला_sample':local(w.start),'अंतिम_sample':local(w.end),'UTCStart':w.start,'UTCEnd':w.end,'मिलते_samples':w.samples,'पद्धति':futureInfo.label})),'sarvatobhadra-vedha','csv')}>CSV डाउनलोड</button></div><div className="table-scroll"><table><thead><tr><th>ग्रह</th><th>नक्षत्र</th><th>वेध</th><th>पहला sample</th><th>आखिरी sample</th></tr></thead><tbody>{windows.map((w,i)=><tr key={i}><td>{w.planet}</td><td>{w.source}</td><td>{w.targets}</td><td>{local(w.start)}</td><td>{local(w.end)}</td></tr>)}</tbody></table></div>{!windows.length&&<p>इस range और चयन में वेध नहीं मिला।</p>}<p className="note">हर 1 minute पर वास्तविक ग्रह-गणना। ये matching sample windows हैं; exact घटना-आरंभ/अंत नहीं। वर्तमान समय auto-refresh होने पर पुराना भविष्य-result हटता है ताकि stale data न दिखे; स्थिर समय के लिए वर्तमान समय switch बंद रखें।</p></>}
 </section><section className="panel"><div className="section-title"><h2>इस पद्धति के पुस्तक-संदर्भ</h2><button className="text-button" onClick={()=>setShowRules(!showRules)}>{showRules?'छिपाएँ':'नियम पढ़ें'}</button></div><MultiSelect label="पदार्थ" options={data.commodities} value={commodities} onChange={setCommodities}/><p className="note">नीचे मूल सर्वतोभद्र प्रकरण के संबंधित नियम हैं—सिर्फ ग्रह/पदार्थ tags से खोजे गए reference, ऊपर वेध से automatically सत्य घोषित नहीं।</p>{showRules&&<div className="rules-grid">{related.slice(0,40).map(r=><RuleCard key={r.id} rule={r} blocks={blocks}/>)}</div>}<p className="note"><a href="https://saravali.github.io/astrology/sbc_vedhas.html" target="_blank" rel="noreferrer">वेध geometry और उदाहरण</a> · <a href="https://en.wikipedia.org/wiki/Sarvatobhadra_Chakra" target="_blank" rel="noreferrer">81-cell विन्यास</a> · <a href="https://vedictime.com/en/library/nakshatra/abhijit" target="_blank" rel="noreferrer">अभिजित की सीमा</a></p></section></>;
}
