import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Clipboard, Check, Download, ExternalLink, Search } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import type { BookData, BookRule } from '../lib/rules';
import { matchingRules } from '../lib/rules';
import { NIFTY200_RESEARCH, NIFTY200_SOURCE, NIFTY200_SOURCE_DATE, type Nifty200Stock } from '../lib/nifty200';
import { downloadBlob } from '../lib/export';

const periods = [
  { key:'क्षणिक', label:'मिनट / क्षणिक' },
  { key:'दैनिक', label:'दैनिक' },
  { key:'साप्ताहिक', label:'साप्ताहिक' },
  { key:'पाक्षिक', label:'पाक्षिक' },
  { key:'मासिक', label:'मासिक' },
  { key:'वार्षिक', label:'वार्षिक' },
  { key:'ऋतु-आधारित', label:'ऋतु-आधारित' },
  { key:'अनिर्दिष्ट', label:'अनिर्दिष्ट' },
];

type StockRow = Nifty200Stock & {
  rules: BookRule[];
  activeRules: BookRule[];
  activeUp: number;
  activeDown: number;
  activeMixed: number;
  periodActiveCounts: Record<string,number>;
  periodCounts: Record<string,number>;
};

function stockRows(data: BookData, snapshot: AstroSnapshot|null, selectedPeriod: string): StockRow[] {
  return NIFTY200_RESEARCH.map(stock => {
    const rules = data.rules.filter(rule => stock.tags.some(tag => rule.commodities.includes(tag)));
    const activeRules = snapshot ? matchingRules(rules, snapshot) : [];
    const periodCounts = Object.fromEntries(periods.map(period => [period.key, rules.filter(rule => rule.timeframe===period.key).length]));
    const periodActiveCounts = Object.fromEntries(periods.map(period => [period.key, activeRules.filter(rule => rule.timeframe===period.key).length]));
    return {
      ...stock,
      rules,
      activeRules,
      activeUp: activeRules.filter(rule=>rule.signal==='तेजी').length,
      activeDown: activeRules.filter(rule=>rule.signal==='मंदी').length,
      activeMixed: activeRules.filter(rule=>rule.signal!=='तेजी'&&rule.signal!=='मंदी').length,
      periodActiveCounts,
      periodCounts,
    };
  }).sort((a,b)=>{
    const activeA=selectedPeriod ? a.periodActiveCounts[selectedPeriod] : a.activeRules.length;
    const activeB=selectedPeriod ? b.periodActiveCounts[selectedPeriod] : b.activeRules.length;
    const totalA=selectedPeriod ? a.periodCounts[selectedPeriod] : a.rules.length;
    const totalB=selectedPeriod ? b.periodCounts[selectedPeriod] : b.rules.length;
    return activeB-activeA||totalB-totalA||b.activeRules.length-a.activeRules.length||a.name.localeCompare(b.name);
  });
}

function signal(row:StockRow, snapshot:AstroSnapshot|null, selectedPeriod:string) {
  if (!snapshot) return {label:'समय लागू करें', className:'watch'};
  const active = selectedPeriod ? row.activeRules.filter(rule=>rule.timeframe===selectedPeriod) : row.activeRules;
  const up=active.filter(rule=>rule.signal==='तेजी').length;
  const down=active.filter(rule=>rule.signal==='मंदी').length;
  const mixed=active.filter(rule=>rule.signal!=='तेजी'&&rule.signal!=='मंदी').length;
  if (!active.length) return {label:'इस अवधि में active rule नहीं', className:'none'};
  if (up>down && up>=mixed) return {label:'तेजी संकेत', className:'up'};
  if (down>up && down>=mixed) return {label:'मंदी संकेत', className:'down'};
  return {label:'मिश्र संकेत', className:'mixed'};
}

export default function MyStockSelection({data,snapshot,zone}:{data:BookData;snapshot:AstroSnapshot|null;zone:string}) {
 const [query,setQuery]=useState('');
 const [group,setGroup]=useState('सभी समूह');
 const [period,setPeriod]=useState('');
 const [onlyActive,setOnlyActive]=useState(false);
 const [copied,setCopied]=useState(false);
 const ranked=useMemo(()=>stockRows(data,snapshot,period),[data,snapshot,period]);
 const groups=useMemo(()=>['सभी समूह',...new Set(ranked.map(x=>x.group))],[ranked]);
 const rows=ranked.filter(row=>{
   const q=!query||`${row.symbol} ${row.name} ${row.industry} ${row.group} ${row.element} ${row.tags.join(' ')} ${row.business}`.toLowerCase().includes(query.toLowerCase());
   return q&&(group==='सभी समूह'||row.group===group)&&(!period||row.periodCounts[period]>0)&&(!onlyActive||(period?row.periodActiveCounts[period]>0:row.activeRules.length>0));
 });
 const copy=async()=>{const header=['Rank','Symbol','Company','Industry','Research group','Material tags','Minute rules','Daily rules','Weekly rules','Monthly rules','Active rules','Active signal','Rule duration'];const body=rows.map((row,index)=>{const s=signal(row,snapshot,period);return [index+1,row.symbol,row.name,row.industry,row.group,row.tags.join(' | '),row.periodCounts['क्षणिक'],row.periodCounts['दैनिक'],row.periodCounts['साप्ताहिक'],row.periodCounts['मासिक'],row.activeRules.length,s.label,row.activeRules[0]?.timeframe||'—'].join('\t');}).join('\n');try{await navigator.clipboard.writeText(`${header.join('\t')}\n${body}`);setCopied(true);window.setTimeout(()=>setCopied(false),2200);}catch{setCopied(false);}};
 const selectedPeriodLabel=periods.find(item=>item.key===period)?.label||'सभी अवधि';
 const download=()=>downloadBlob(JSON.stringify(rows.map((row,index)=>({...row,rank:index+1,rules:row.rules.map(r=>({id:r.id,title:r.title,timeframe:r.timeframe,signal:r.signal}),),activeRules:row.activeRules.map(r=>({id:r.id,title:r.title,timeframe:r.timeframe,signal:r.signal}))})),null,2),'my-stock-selection-list.json','application/json');
 return <>
  <div className="page-heading"><div><div className="eyebrow">MY STOCK SELECTION LIST · NIFTY 200</div><h1>My Stock Selection List</h1><p>NIFTY 200 के सभी 200 shares को official industry, company-business lens और पुस्तक के पदार्थ-tags से जोड़कर अलग-अलग research किया गया है।</p></div><div className="button-row"><button className="button secondary" onClick={()=>void copy()}>{copied?<Check size={16}/>:<Clipboard size={16}/>} {copied?'Copied':'Copy list'}</button><a className="button quiet" href="#analysis">समय-सीमा Analysis</a><button className="button secondary" onClick={download}><Download size={16}/> Download</button></div></div>
  <section className="panel stock-list-intro"><div><h2>कंपनी से पदार्थ तक mapping</h2><p>उदाहरण: steel company में लोहा/धातु/खनिज, cable company में ताँबा/विद्युत, pharma company में औषधि और automobile company में मोटर/वाहन/मशीनरी tags आते हैं। Official industry source रखा गया है; जहाँ company-specific product focus स्पष्ट है वहाँ product override दिया गया है, और बाकी rows को industry-level broad mapping के रूप में label किया गया है।</p></div><a className="button quiet small" href={NIFTY200_SOURCE} target="_blank" rel="noreferrer">Official NIFTY 200 CSV <ExternalLink size={14}/></a></section>
  <section className={`panel stock-calc-banner ${snapshot?'calculated':'pending'}`}><div><strong>{snapshot?'इस समय की गणना पूरी':'पहले date/time लागू करें'}</strong><p>{snapshot?`Calculation time: ${DateTime.fromISO(snapshot.iso).setZone(zone).toFormat('dd MMM yyyy · HH:mm')} · ${zone} local time; इस समय के ग्रहों से rules फिर चलाये गये हैं।`:'ऊपर “गणना का समय” में तारीख और समय डालकर “गणना करें” दबाएँ। उसके बाद active rules और stock ranking बदलेंगे।'}</p></div><span>{snapshot?'LIVE SNAPSHOT':'WAITING FOR CALCULATION'}</span></section>
  <div className="stats-grid stock-list-stats"><div className="stat"><span>कुल shares</span><strong>{ranked.length}</strong><small>NIFTY 200 · {NIFTY200_SOURCE_DATE}</small></div><div className="stat"><span>दिख रहे हैं</span><strong>{rows.length}</strong><small>filters के बाद</small></div><div className="stat"><span>इस समय active</span><strong>{ranked.filter(r=>period?r.periodActiveCounts[period]>0:r.activeRules.length>0).length}</strong><small>{snapshot?'selected calculation time':'समय लागू करें'}</small></div><div className="stat"><span>कुल book rules</span><strong>{ranked.reduce((n,r)=>n+r.rules.length,0).toLocaleString('en-IN')}</strong><small>material tags से matched</small></div></div>
  <section className="panel stock-filters"><label className="search-field"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="company, symbol, पदार्थ या business खोजें…"/></label><label>Research group<select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(x=><option key={x}>{x}</option>)}</select></label><label>Rule अवधि<select value={period} onChange={e=>setPeriod(e.target.value)}><option value="">सभी अवधि</option>{periods.map(x=><option key={x.key} value={x.key}>{x.label}</option>)}</select></label><label className="check-filter"><input type="checkbox" checked={onlyActive} onChange={e=>setOnlyActive(e.target.checked)}/> केवल अभी active</label></section>
  <div className="results-line"><span><strong>{rows.length}</strong> shares listed · <strong>{selectedPeriodLabel}</strong></span><span className="muted">{period?`${selectedPeriodLabel} में सबसे अधिक active rules पहले`:'सभी अवधि में active rules पहले'} · selected date/time से re-calculate</span></div>
  <section className="stock-selection-grid">{rows.map((row,index)=>{const s=signal(row,snapshot,period);const activeForDisplay=period?row.activeRules.filter(rule=>rule.timeframe===period):row.activeRules;const shownRules=activeForDisplay.length?activeForDisplay.slice(0,3):row.rules.filter(rule=>!period||rule.timeframe===period).slice(0,2);return <article className={`stock-selection-card ${activeForDisplay.length?'stock-active':''}`} key={row.symbol}><div className="stock-card-head"><span className="stock-rank">#{index+1}</span><div><h2>{row.name}</h2><span className="mono stock-symbol">{row.symbol} · {row.industry}</span></div><strong className={`stock-signal ${s.className}`}>{s.label}</strong></div><p className="stock-business"><strong>Company focus:</strong> {row.business}</p><div className="stock-meta"><span><b>Group</b>{row.group}</span><span><b>तत्व lens</b>{row.element}</span></div><div className="tag-row stock-tags">{row.tags.map(tag=><span className="tag commodity" key={tag}>{tag}</span>)}</div><div className="stock-period-grid">{periods.slice(0,7).map(p=><div key={p.key}><b>{p.label}</b><strong>{row.periodCounts[p.key]||0}</strong></div>)}</div><div className="stock-rules"><h3>{activeForDisplay.length?'अभी लागू rules':'Matched book rules'}</h3>{shownRules.length?shownRules.map(rule=><div className="stock-rule" key={rule.id}><div><strong>{rule.signal} · {rule.title}</strong><small>{rule.id} · {rule.timeframe} · {activeForDisplay.includes(rule)?'इस समय शर्त पूरी':'पुस्तक mapping'}</small></div><span>{activeForDisplay.includes(rule)?'अगली गणना में बदलने तक':`अवधि: ${rule.timeframe}`}</span></div>):<p>{period?`${selectedPeriodLabel} अवधि में इस समय encoded active rule नहीं मिला।`: 'इस समय इस stock के लिए encoded active rule नहीं मिला।'} अवधि filters और मूल नियम library में देखें।</p>}</div></article>;})}</section>
  {!rows.length&&<div className="empty"><h3>कोई share नहीं मिला</h3><p>Company, symbol, पदार्थ या group बदलकर खोजें।</p></div>}
  <section className="panel stock-list-method"><h2>इस page पर prediction कैसे पढ़ें?</h2><p>हर card में मिनट/क्षणिक, दैनिक, साप्ताहिक, पाक्षिक, मासिक और वार्षिक book-rule counts अलग हैं। कोई अवधि चुनने पर उसी अवधि के active rules की संख्या से descending ranking होती है—सबसे अधिक लागू rules वाला share सबसे ऊपर आता है। Selected date-time पर computable rules active होने पर card ऊपर आता है और तेजी/मंदी/मिश्र signal दिखाता है। “अगली गणना में बदलने तक” का अर्थ है कि exact end timestamp अगले sample/range analysis से निकलेगा; इसे fixed market-price prediction न समझें।</p></section>
 </>;
}
