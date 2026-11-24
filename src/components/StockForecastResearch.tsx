import { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, Download, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { DateTime } from 'luxon';
import type { AstroSnapshot } from '../lib/astro';
import { NAKSHATRAS, type Planet } from '../lib/astro';
import type { BookData, BookRule } from '../lib/rules';
import { matchingRules } from '../lib/rules';
import { evaluateMasterRules } from '../lib/masterRules';
import { NIFTY200_RESEARCH, type Nifty200Stock } from '../lib/nifty200';
import { USER_PROVIDED_RULES } from '../lib/userProvidedRules';
import { downloadBlob } from '../lib/export';

type HistoricalRow = { date:string; rank:number; stock:string; change:number; type:'TOP_GAINER'|'TOP_LOSER' };
type HistoricalPayload = { source:string; rowCount:number; rows:HistoricalRow[] };
type DateSignal = { date:string; features:string[]; source?:string };
type DateSignalPayload = { source:string; method:string; rows:DateSignal[] };
type FeatureEvidence = { dates:number; gain:Map<string,number>; loss:Map<string,number> };
type Calibration = { cutoff:string; priorDates:number; featureDates:Map<string,FeatureEvidence>; baseGain:Map<string,number>; baseLoss:Map<string,number> };
type StockScore = Nifty200Stock & { rules:BookRule[]; active:BookRule[]; linkedReasons:string[]; up:number; down:number; mixed:number; total:number; bullishScore:number; bearishScore:number; fit:string; evidence:number; gainSupport:number; lossSupport:number };
type SearchRule = {id:string; title:string; text:string; source:string};

const TEXT_RULES: SearchRule[] = [
  {id:'BOOK-INTRADAY-VEDHA',title:'तात्कालिक चंद्रमा पर क्रूर/सौम्य ग्रह का वेध',text:'तात्कालिक चंद्रमा के जिस समय क्रूर ग्रह का वेध हो वहाँ तेजी और सौम्य ग्रह के वेध से मंदी का research signal देखें; वस्तु के वर्णादि-पंचक पर वेध हो तो context मजबूत माना जाता है।',source:'User supplied book extract · pages 100–101'},
  {id:'BOOK-LAGNA-2H',title:'दैनिक लग्नों से दो-दो घंटे की दिशा',text:'तात्कालिक लग्न में पंचम या सप्तम भाव पर शुभ ग्रह की पूर्ण दृष्टि ऊँचे भाव का संकेत और पाप ग्रह की दृष्टि/स्थिति नीचे भाव का संकेत मानी गई है।',source:'User supplied book extract · pages 263–266'},
  {id:'BOOK-RAHUKAAL',title:'राहुकाल dip / retracement watch',text:'राहुकाल को daily मंदी या retracement watch की तरह दर्ज करें; यह अकेला hard override नहीं है।',source:'User supplied book extract · pages 64–65'},
  {id:'BOOK-WEEKDAY',title:'वारों की चाल और अगले वार का असर',text:'वार-आधारित नियमों को historical validation के बिना निश्चित prediction न मानें।',source:'User supplied book extract · pages 65–67'},
  {id:'BOOK-CLOSE-12',title:'बंद भाव और अगले दिन का गणित',text:'बंद भाव और वस्तु-स्वामी संबंध पुस्तक में वर्णित है, लेकिन बिना source price/owner table के numeric result fabricate नहीं किया गया है।',source:'User supplied book extract · page 58'},
  {id:'BOOK-VIMSHOPAK',title:'दैनिक 20 विश्वे और पाँच बल',text:'विंशोपक numeric strength तभी दिखेगी जब पूर्ण source table उपलब्ध हो; fabricated शड्बल नहीं बनाया गया है।',source:'User supplied book extract · pages 48, 421–424'},
  {id:'BOOK-GHABAD',title:'घबाड़-मुहूर्त',text:'सूर्य नक्षत्र से चंद्र नक्षत्र तक की संख्या, तिथि और 7 के शेष से घबाड़-मुहूर्त निकाला जाता है; इसे research flag की तरह देखें।',source:'User supplied book extract · page 62'},
  {id:'BOOK-SHAR',title:'भ-चक्र संधिकाल / शर परिवर्तन',text:'ग्रह का अक्षांशीय शर उत्तर-दक्षिण बदलते हुए 0 पर आए तो direction-change watch; exact ephemeris latitude transition चाहिए।',source:'User supplied book extract · page 325'},
  {id:'BOOK-MERCURY-VENUS',title:'सूर्य-बुध-शुक्र गति नियम',text:'बुध-शुक्र गति/युति और सूर्य से संबंध को futures research context के रूप में दर्ज किया गया है; BR-99 केवल user hypothesis/reference है।',source:'User supplied book extract · pages 270–272'},
  ...USER_PROVIDED_RULES.map(rule=>({id:rule.id,title:rule.title,text:`Trigger: ${rule.trigger} Effect: ${rule.claimedEffect} Treatment: ${rule.engineTreatment}`,source:rule.evidence})),
];

const VARA = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
const R05_BULLISH = ['सोना','चाँदी','ताँबा','तांबा','वस्त्र','ऊनी वस्त्र','रुई','कपास','सरसों'];
const R05_BEARISH = ['लाल मिर्च','मिर्च','रक्त चन्दन','चन्दन'];
function commodityHits(stock:Nifty200Stock, names:string[]) { return names.filter(name=>stock.tags.some(tag=>tag===name||tag.includes(name)||name.includes(tag))); }
function stockRuleDirection(rule:BookRule,stock:Nifty200Stock):{signal:string; reasons:string[]} {
  if(rule.id==='R05-009') {
    const bull=commodityHits(stock,R05_BULLISH), bear=commodityHits(stock,R05_BEARISH);
    if(bull.length&&!bear.length)return {signal:'तेजी',reasons:bull.map(x=>`${rule.id}: ${x} · तेजी`)};
    if(bear.length&&!bull.length)return {signal:'मंदी',reasons:bear.map(x=>`${rule.id}: ${x} · मंदी`)};
    if(bull.length||bear.length)return {signal:'मिश्रित',reasons:[...bull.map(x=>`${rule.id}: ${x} · तेजी`),...bear.map(x=>`${rule.id}: ${x} · मंदी`)]};
  }
  return {signal:rule.signal,reasons:[]};
}
function localDate(snapshot: AstroSnapshot|null, zone: string) { return snapshot ? DateTime.fromISO(snapshot.iso).setZone(zone).toISODate() ?? '' : ''; }
function stockLabel(symbol:string) { return symbol.replace(/\.NS$/,''); }
function actualFor(rows:HistoricalRow[],date:string,type:HistoricalRow['type']) { return rows.filter(r=>r.date===date&&r.type===type).sort((a,b)=>a.rank-b.rank); }
function planet(snapshot:AstroSnapshot|null,name:string):Planet|undefined { return snapshot?.planets.find(p=>p.name===name); }
function angle(a:number,b:number) { const d=Math.abs(a-b)%360; return d>180?360-d:d; }
function angleBucket(snapshot:AstroSnapshot|null) { const sun=planet(snapshot,'सूर्य'),moon=planet(snapshot,'चंद्रमा'); if(!sun||!moon)return ''; const d=angle(sun.longitude,moon.longitude); return d<12?'0-12':d<30?'12-30':d<90?'30-90':'90+'; }
function snapshotFeatures(snapshot:AstroSnapshot|null):string[] {
  if(!snapshot)return [];
  const moon=planet(snapshot,'चंद्रमा'), sun=planet(snapshot,'सूर्य');
  const features=[`वार:${VARA[snapshot.weekday]}`,moon&&`चंद्र नक्षत्र:${NAKSHATRAS[moon.nakshatra]}`,moon&&`चंद्र चरण:${moon.pada}`,sun&&`सूर्य नक्षत्र:${NAKSHATRAS[sun.nakshatra]}`,sun&&`सूर्य चरण:${sun.pada}`,snapshot.hora&&`होरा स्वामी:${snapshot.hora.planet}`,`तिथि:${snapshot.tithi}`,angleBucket(snapshot)&&`सूर्य-चंद्र कोण:${angleBucket(snapshot)}`];
  return features.filter((x):x is string=>Boolean(x));
}
function buildCalibration(history:HistoricalPayload|null,signals:DateSignalPayload|null,cutoff:string):Calibration {
  const featureDates=new Map<string,FeatureEvidence>(), baseGain=new Map<string,number>(), baseLoss=new Map<string,number>();
  if(!history||!signals)return {cutoff,priorDates:0,featureDates,baseGain,baseLoss};
  const outcomes=new Map<string,HistoricalRow[]>();
  for(const row of history.rows) { if(row.date<cutoff) { const list=outcomes.get(row.date)||[]; list.push(row); outcomes.set(row.date,list); } }
  const prior=signals.rows.filter(r=>r.date<cutoff&&outcomes.has(r.date));
  for(const day of prior) {
    const unique=[...new Set(day.features)];
    for(const f of unique) {
      const e=featureDates.get(f)||{dates:0,gain:new Map<string,number>(),loss:new Map<string,number>()}; e.dates++;
      for(const row of outcomes.get(day.date)||[]) { const s=stockLabel(row.stock); const map=row.type==='TOP_GAINER'?e.gain:e.loss; map.set(s,(map.get(s)||0)+1); const base=row.type==='TOP_GAINER'?baseGain:baseLoss; base.set(s,(base.get(s)||0)+1); }
      featureDates.set(f,e);
    }
  }
  return {cutoff,priorDates:prior.length,featureDates,baseGain,baseLoss};
}
function scoreStocks(data:BookData,snapshot:AstroSnapshot|null,calibration:Calibration):StockScore[] {
  const master=evaluateMasterRules(snapshot), masterUp=master.filter(r=>r.signal==='bullish').length, masterDown=master.filter(r=>r.signal==='bearish').length;
  return NIFTY200_RESEARCH.map(stock=>{
    const rules=data.rules.filter(rule=>stock.tags.some(tag=>rule.commodities.includes(tag))||rule.commodities.some(c=>stock.tags.includes(c)));
    const active=snapshot?matchingRules(rules,snapshot):[];
    const directional=active.map(rule=>stockRuleDirection(rule,stock)), linkedReasons=directional.flatMap(x=>x.reasons);
    const up=directional.filter(r=>r.signal==='तेजी').length, down=directional.filter(r=>r.signal==='मंदी').length, mixed=directional.length-up-down;
    // Forecast ranking is deliberately astrology-only. Historical data is never read here.
    const bullishScore=up*10+mixed*0.5+masterUp*0.15;
    const bearishScore=down*10+mixed*0.5+masterDown*0.15;
    return {...stock,rules,active,linkedReasons,up,down,mixed,total:rules.length,bullishScore,bearishScore,fit:'selected-time astrology + encoded book rules only',evidence:0,gainSupport:0,lossSupport:0};
  });
}

export default function StockForecastResearch({data,snapshot,zone}:{data:BookData;snapshot:AstroSnapshot|null;zone:string}) {
  const [history,setHistory]=useState<HistoricalPayload|null>(null),[signals,setSignals]=useState<DateSignalPayload|null>(null),[loadError,setLoadError]=useState(''),[query,setQuery]=useState(''),[copied,setCopied]=useState(false),[showAllRules,setShowAllRules]=useState(false);
  useEffect(()=>{Promise.all([fetch(`${import.meta.env.BASE_URL}research-source/nse-futures-top5-2011-2026.json`).then(r=>{if(!r.ok)throw new Error('Historical Top-5 file load नहीं हुई।');return r.json() as Promise<HistoricalPayload>}),fetch(`${import.meta.env.BASE_URL}research-source/astrology-date-signals-2015-2026.json`).then(r=>{if(!r.ok)throw new Error('Historical astrology feature file load नहीं हुई।');return r.json() as Promise<DateSignalPayload>})]).then(([h,s])=>{setHistory(h);setSignals(s);}).catch(e=>setLoadError(e instanceof Error?e.message:String(e)));},[]);
  const date=localDate(snapshot,zone), calibration=useMemo(()=>buildCalibration(history,signals,date),[history,signals,date]);
  const ranked=useMemo(()=>scoreStocks(data,snapshot,calibration),[data,snapshot,calibration]);
  const gainers=useMemo(()=>[...ranked].sort((a,b)=>(b.bullishScore-b.bearishScore)-(a.bullishScore-a.bearishScore)||b.evidence-a.evidence),[ranked]);
  const losers=useMemo(()=>[...ranked].sort((a,b)=>(b.bearishScore-b.bullishScore)-(a.bullishScore-a.bearishScore)||b.evidence-a.evidence),[ranked]);
  const forecastGainers=useMemo(()=>gainers.filter(r=>r.active.length>0&&r.bullishScore>r.bearishScore),[gainers]);
  const forecastLosers=useMemo(()=>losers.filter(r=>r.active.length>0&&r.bearishScore>r.bullishScore),[losers]);
  const actualGainers=history?actualFor(history.rows,date,'TOP_GAINER'):[], actualLosers=history?actualFor(history.rows,date,'TOP_LOSER'):[];
  const allRules=useMemo<SearchRule[]>(()=>[...data.rules.map(rule=>({id:rule.id,title:rule.title,text:`${rule.summary} फल/संकेत: ${rule.signal}. Conditions: ${rule.conditions.map(c=>c.type).join(', ')||'स्रोत-पाठ में वर्णित'}`,source:`Book rule · ${rule.section} · ${rule.source_ids.join(', ')||'source not linked'}`})),...TEXT_RULES],[data.rules]);
  const rules=allRules.filter(r=>!query||`${r.id} ${r.title} ${r.text} ${r.source}`.toLowerCase().includes(query.toLowerCase()));
  const gainRank=useMemo(()=>new Map(forecastGainers.map((r,i)=>[r.symbol,i+1])),[forecastGainers]), loseRank=useMemo(()=>new Map(forecastLosers.map((r,i)=>[r.symbol,i+1])),[forecastLosers]), stockMap=useMemo(()=>new Map(ranked.map(r=>[r.symbol,r])),[ranked]);
  const copy=async()=>{const lines=[`ज्योतिष stock research · ${date||'समय लागू नहीं'}`,`Method: selected-time astrology + book commodity mapping only; historical data excluded from ranking`,`Matched gainer watch: ${forecastGainers.slice(0,5).map(x=>`${x.symbol} ${x.bullishScore.toFixed(2)} · ${x.linkedReasons.join(', ')||`${x.active.length} active rules`}`).join(' | ')||'INSUFFICIENT ASTROLOGY MATCH'}`,`Matched loser watch: ${forecastLosers.slice(0,5).map(x=>`${x.symbol} ${x.bearishScore.toFixed(2)} · ${x.linkedReasons.join(', ')||`${x.active.length} active rules`}`).join(' | ')||'INSUFFICIENT ASTROLOGY MATCH'}`];try{await navigator.clipboard.writeText(lines.join('\n'));setCopied(true);setTimeout(()=>setCopied(false),2200);}catch{setCopied(false);}};
  const download=()=>downloadBlob(JSON.stringify({date,method:'astrology-only selected-time ranking; historical workbook excluded from ranking and retained only for optional validation',currentFeatures:snapshotFeatures(snapshot),topGainers:forecastGainers.slice(0,20),topLosers:forecastLosers.slice(0,20)},null,2),'stock-astrology-research.json','application/json');
  const insufficient=!calibration.priorDates||(!forecastGainers.length&&!forecastLosers.length);
  return <>
    <div className="page-heading"><div><div className="eyebrow">STOCK ASTROLOGY · ASTROLOGY-ONLY RANKING</div><h1>ज्योतिष से stock ranking</h1><p>Ranking केवल selected समय की ग्रह-स्थिति, पुस्तक के active rules और verified commodity/business mapping से बनेगी। Historical workbook ranking में उपयोग नहीं होगा; वह केवल बाद की validation के लिए है।</p></div><div className="button-row"><button className="button secondary" onClick={()=>void copy()}>{copied?<Check size={16}/>:<Clipboard size={16}/>} {copied?'Copied':'Copy result'}</button><button className="button secondary" onClick={download}><Download size={16}/> Download</button></div></div>
    <section className="notice warning"><TrendingUp size={19}/><div><strong>महत्वपूर्ण सीमा:</strong> यह research/backtest watchlist है, guaranteed prediction या investment advice नहीं। Calibration strictly selected date से पहले उपलब्ध dates पर है। पर्याप्त evidence न होने पर list जानबूझकर खाली रखी जाती है।</div></section>
    {loadError&&<div className="notice error">{loadError}</div>}
    <section className="panel stock-forecast-controls"><div className="section-title"><div><h2>Astrology-only stock ranking</h2><p className="note">Global गणना समय बदलकर “गणना करें” दबाएँ। Historical data ranking score में उपयोग नहीं होगा।</p></div><span className="tag">{date||'समय लागू करें'}</span></div><div className="forecast-source-grid"><div><strong>Ranking input</strong><span>Selected snapshot + book rules</span><small>planetary sign, nakshatra, hora, vedha and active conditions</small></div><div><strong>Stock mapping</strong><span>NIFTY 200 business/material tags</span><small>commodity exposure must match; generic sector alone is not enough</small></div><div><strong>Historical workbook</strong><span>Validation only · not ranking input</span><small>{history?`${history.rowCount.toLocaleString('en-IN')} rows available after forecast`:''}</small></div></div></section>
    {insufficient&&<section className="notice error"><strong>INSUFFICIENT ASTROLOGY MATCH</strong><div>इस selected date/time पर पर्याप्त active directional book-rule और stock commodity match नहीं मिला। कोई arbitrary stock forecast नहीं दिखाया गया।</div></section>}
    <div className="forecast-columns"><section className="panel"><div className="section-title"><div><h2><TrendingUp size={18}/> Astrology-generated gainer watch</h2><p className="note">केवल selected-time astrology और active encoded तेजी rules; historical data score में नहीं।</p></div><span className="tag">{forecastGainers.length?`Top ${Math.min(5,forecastGainers.length)}`:'INSUFFICIENT MATCH'}</span></div><div className="forecast-list">{forecastGainers.length?forecastGainers.slice(0,5).map((r,i)=><article className="forecast-card bullish" key={r.symbol}><span className="forecast-rank">#{i+1}</span><div className="forecast-main"><strong>{r.symbol}</strong><span>{r.name}</span><small>{r.group} · {r.element}</small>{r.linkedReasons.length>0&&<small className="forecast-reason">{r.linkedReasons.slice(0,2).join(' · ')}</small>}</div><div className="forecast-score"><b>{(r.bullishScore-r.bearishScore).toFixed(2)}</b><small>astrology score</small></div><div className="forecast-rule-count"><b>{r.active.length}</b><small>active rules</small></div></article>):<div className="empty compact"><h3>INSUFFICIENT ASTROLOGY MATCH</h3><p>बिना active directional book-rule और commodity match के कोई stock नहीं दिखाया गया।</p></div>}</div></section><section className="panel"><div className="section-title"><div><h2><TrendingDown size={18}/> Astrology-generated loser watch</h2><p className="note">केवल selected-time astrology और active encoded मंदी rules; historical data score में नहीं।</p></div><span className="tag">{forecastLosers.length?`Top ${Math.min(5,forecastLosers.length)}`:'INSUFFICIENT MATCH'}</span></div><div className="forecast-list">{forecastLosers.length?forecastLosers.slice(0,5).map((r,i)=><article className="forecast-card bearish" key={r.symbol}><span className="forecast-rank">#{i+1}</span><div className="forecast-main"><strong>{r.symbol}</strong><span>{r.name}</span><small>{r.group} · {r.element}</small>{r.linkedReasons.length>0&&<small className="forecast-reason">{r.linkedReasons.slice(0,2).join(' · ')}</small>}</div><div className="forecast-score"><b>{(r.bearishScore-r.bullishScore).toFixed(2)}</b><small>astrology score</small></div><div className="forecast-rule-count"><b>{r.active.length}</b><small>active rules</small></div></article>):<div className="empty compact"><h3>INSUFFICIENT ASTROLOGY MATCH</h3><p>बिना active directional book-rule और commodity match के कोई stock नहीं दिखाया गया।</p></div>}</div></section></div>
    <section className="panel"><div className="section-title"><div><h2>Historical outcome — validation only</h2><p className="note">Selected date: {date||'—'} · actual rows forecast score में शामिल नहीं हैं; केवल out-of-sample comparison के लिए हैं।</p></div><span className="tag">not a prediction source</span></div><div className="notice info"><strong>Table कैसे पढ़ें:</strong> <em>Astro rank</em> पूरा astrology watchlist rank है, <em>Active book rules</em> उस snapshot पर matched computable rules हैं, और <em>Prior evidence dates</em> selected date से पहले के matching research dates हैं। ये तीनों मिलकर भी guaranteed Top-5 result नहीं हैं।</div><div className="actual-columns"><div><h3>Actual Top Gainers</h3>{actualGainers.length?<div className="actual-table-scroll"><div className="table-scroll-hint">← दायाँ-बायाँ खींचें / scroll करें →</div><table><thead><tr><th>Actual</th><th>Stock</th><th>Change</th><th>Astro rank</th><th>Active book rules</th><th>Prior evidence dates</th></tr></thead><tbody>{actualGainers.map(r=>{const symbol=stockLabel(r.stock),s=stockMap.get(symbol);return <tr key={`${r.type}${r.rank}`}><td>{r.rank}</td><td><strong>{symbol}</strong></td><td className="up-text">{r.change.toFixed(4)}%</td><td>{gainRank.get(symbol)?`#${gainRank.get(symbol)}`:'—'}</td><td>{s?.active.length??0}</td><td>{s?.evidence??0}</td></tr>})}</tbody></table></div>:<p className="note">इस date की actual validation row उपलब्ध नहीं है। Future date पर यह स्वाभाविक है।</p>}</div><div><h3>Actual Top Losers</h3>{actualLosers.length?<div className="actual-table-scroll"><div className="table-scroll-hint">← दायाँ-बायाँ खींचें / scroll करें →</div><table><thead><tr><th>Actual</th><th>Stock</th><th>Change</th><th>Astro rank</th><th>Active book rules</th><th>Prior evidence dates</th></tr></thead><tbody>{actualLosers.map(r=>{const symbol=stockLabel(r.stock),s=stockMap.get(symbol);return <tr key={`${r.type}${r.rank}`}><td>{r.rank}</td><td><strong>{symbol}</strong></td><td className="down-text">{r.change.toFixed(4)}%</td><td>{loseRank.get(symbol)?`#${loseRank.get(symbol)}`:'—'}</td><td>{s?.active.length??0}</td><td>{s?.evidence??0}</td></tr>})}</tbody></table></div>:<p className="note">इस date की actual validation row उपलब्ध नहीं है। Future date पर यह स्वाभाविक है।</p>}</div></div></section>
    <section className="panel"><div className="section-title"><div><h2>सभी book / research rules searchable</h2><p className="note">Encoded book rules, supplied extracts और user hypotheses को source label के साथ पढ़ें। Missing numeric tables silently fabricate नहीं की गईं।</p></div><span className="tag">{rules.length} matched</span></div><label className="search-field"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="राहुकाल, बुध, वेध, विश्वे, बुध-शुक्र…"/></label><div className="forecast-rules">{rules.slice(0,showAllRules?rules.length:8).map(r=><article key={r.id}><div className="rule-meta"><span className="mono">{r.id}</span><span className="tag">{r.source}</span></div><h3>{r.title}</h3><p>{r.text}</p></article>)}</div>{rules.length>8&&<button className="button secondary" onClick={()=>setShowAllRules(x=>!x)}>{showAllRules?'कम दिखाएँ':`सभी ${rules.length} rules देखें`}</button>}</section>
    <section className="panel forecast-method"><h2>Reproducible research method</h2><p><strong>1.</strong> Supplied historical minute Panchang file से हर trading date का first available market-minute astrology feature vector बनाया गया। <strong>2.</strong> Selected date से strictly पहले वाले dates के Top-5 outcomes से feature–stock hit/lift evidence गिना गया। <strong>3.</strong> Current selected snapshot के Moon nakshatra/pada, Sun nakshatra/pada, weekday, hora, tithi और Sun–Moon angle bucket को उसी feature vocabulary में match किया गया। <strong>4.</strong> इस calibrated evidence को active Vyapar Ratna book rules के साथ directionally combine किया गया। <strong>5.</strong> Selected date का actual outcome score बनने के बाद ही validation में पढ़ा जाता है; forecast input नहीं।</p><p>इसलिए यह अभी भी statistical research model है, भविष्यवाणी की गारंटी नहीं। Historical astrology feature coverage 2015 onward है; उससे पहले dates पर “INSUFFICIENT HISTORICAL EVIDENCE” संभव है। BR-99 और अन्य user hypotheses reference/checklist हैं, स्वतः सिद्ध शास्त्रीय नियम नहीं।</p></section>
  </>;
}
