import { useMemo, useState } from 'react';
import { Search, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import RuleCard from './RuleCard';
import { type BookData, type SourceBlock, searchRules, statusLabel } from '../lib/rules';
import { exportRows, ruleRows } from '../lib/export';
export default function Library({data,blocks,initialQuery}:{data:BookData;blocks:Map<string,SourceBlock>;initialQuery:string}) {
 const [query,setQuery]=useState(initialQuery),[planet,setPlanet]=useState(''),[commodity,setCommodity]=useState(''),[time,setTime]=useState(''),[status,setStatus]=useState(''),[section,setSection]=useState(''),[page,setPage]=useState(0);
 const result=useMemo(()=>searchRules(data.rules,query,blocks).filter(r=>(!planet||r.planets.includes(planet))&&(!commodity||r.commodities.includes(commodity))&&(!time||r.timeframe===time)&&(!status||r.status===status)&&(!section||r.section===section)),[data,blocks,query,planet,commodity,time,status,section]);
 function change(fn:(v:string)=>void,v:string){fn(v);setPage(0);}
 const pages=Math.max(1,Math.ceil(result.length/20)),current=Math.min(page,pages-1);
 return <><div className="page-heading"><div><div className="eyebrow">THE RULE ARCHIVE</div><h1>नियम संग्रह</h1><p>पुस्तक में जो लिखा है, उसी आधार पर खोजें। सभी पदार्थ, सभी ग्रह।</p></div><button className="button secondary" disabled={!result.length} onClick={()=>exportRows(ruleRows(result),'vyapar-ratna-rules','xlsx')}><Download size={16}/> Excel</button></div>
 <section className="panel filters"><div className="search-field"><Search size={20}/><input aria-label="नियम खोजें" placeholder="सूर्य, चंद्रमा, सोना, चाँदी, रुई…" value={query} onChange={e=>change(setQuery,e.target.value)}/>{query&&<button aria-label="खोज हटाएँ" onClick={()=>change(setQuery,'')}><X size={16}/></button>}</div><div className="filter-row">
 <select aria-label="ग्रह filter" value={planet} onChange={e=>change(setPlanet,e.target.value)}><option value="">सभी ग्रह</option>{data.planets.map(p=><option key={p}>{p}</option>)}</select>
 <select aria-label="पदार्थ filter" value={commodity} onChange={e=>change(setCommodity,e.target.value)}><option value="">सभी पदार्थ</option>{data.commodities.map(p=><option key={p}>{p}</option>)}</select>
 <select aria-label="अवधि filter" value={time} onChange={e=>change(setTime,e.target.value)}><option value="">सभी अवधियाँ</option>{['क्षणिक','दैनिक','साप्ताहिक','पाक्षिक','मासिक','वार्षिक','अनिर्दिष्ट'].map(p=><option key={p}>{p}</option>)}</select>
 <select aria-label="गणना स्थिति filter" value={status} onChange={e=>change(setStatus,e.target.value)}><option value="">सभी स्थितियाँ</option>{Object.entries(statusLabel).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select>
 <select aria-label="प्रकरण filter" value={section} onChange={e=>change(setSection,e.target.value)}><option value="">सभी प्रकरण</option>{data.sections.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select>
 </div></section><div className="results-line"><span><strong>{result.length.toLocaleString('en-IN')}</strong> नियम मिले</span><span className="muted">मूल कथन खोलकर स्रोत देखें</span></div>
 <div className="rules-grid">{result.slice(current*20,current*20+20).map(r=><RuleCard key={r.id} rule={r} blocks={blocks}/>)}</div>{!result.length&&<div className="empty"><Search size={30}/><h3>इस खोज में कोई नियम नहीं मिला</h3><p>नाम का दूसरा रूप या कम filters चुनें। मूल पुस्तक में भी खोज सकते हैं।</p></div>}
 <div className="pagination"><button className="button secondary" disabled={current===0} onClick={()=>setPage(current-1)}><ChevronLeft size={16}/> पिछला</button><span>{current+1} / {pages}</span><button className="button secondary" disabled={current===pages-1} onClick={()=>setPage(current+1)}>अगला <ChevronRight size={16}/></button></div></>;
}
