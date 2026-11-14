import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ScanLine } from 'lucide-react';
import { statusLabel, sourcePages, type BookRule, type SourceBlock } from '../lib/rules';
export default function RuleCard({rule,blocks,active=false}:{rule:BookRule;blocks:Map<string,SourceBlock>;active?:boolean}) {
 const [open,setOpen]=useState(false);
 return <article className={`rule-card ${active?'active-rule':''}`}>
  <div className="rule-meta"><span className="mono">{rule.id}</span><span>{rule.timeframe}</span><span className={`signal signal-${rule.signal==='तेजी'?'up':rule.signal==='मंदी'?'down':'neutral'}`}>{rule.signal}</span></div>
  <h3>{rule.title}</h3><p>{rule.summary}</p>
  <div className="tag-row">{rule.planets.map(x=><span className="tag" key={x}>{x}</span>)}{rule.commodities.slice(0,6).map(x=><span className="tag commodity" key={x}>{x}</span>)}{rule.commodities.length>6&&<span className="tag">+{rule.commodities.length-6}</span>}</div>
  <div className="rule-bottom"><span className={`status ${rule.status}`}><ScanLine size={13}/>{active?'इस समय शर्त पूरी':statusLabel[rule.status]}</span><button className="text-button" aria-expanded={open} onClick={()=>setOpen(!open)}><BookOpen size={14}/> मूल कथन {open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</button></div>
  {open&&<div className="source-expand"><div className="eyebrow">मूल पाठ · पृष्ठ {sourcePages(rule,blocks)}</div>{rule.source_ids.map(id=><div key={id}><span className="source-id">{id}</span><blockquote>{blocks.get(id)?.text||'स्रोत उपलब्ध नहीं है'}</blockquote></div>)}<p className="reason"><strong>गणना / सीमा:</strong> {rule.reason}</p>{rule.conditions.length>0&&<details><summary>गणना की शर्तें</summary><pre>{JSON.stringify(rule.conditions,null,2)}</pre></details>}<small>मूल कथन में निश्चितता का दावा पुस्तक का है; यह वेबसाइट उसकी पुष्टि नहीं करती।</small></div>}
 </article>;
}
