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
type StockScore = Nifty200Stock & { rules:BookRule[]; active:BookRule[]; up:number; down:number; mixed:number; total:number; bullishScore:number; bearishScore:number; fit:string; evidence:number; gainSupport:number; lossSupport:number };
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
const PLANET_NAMES = ['सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि'];
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
  const currentFeatures=snapshotFeatures(snapshot), priorDates=calibration.priorDates;
  return NIFTY200_RESEARCH.map(stock=>{
    const rules=data.rules.filter(rule=>stock.tags.some(tag=>rule.commodities.includes(tag))||rule.commodities.some(c=>stock.tags.includes(c)));
    const active=snapshot?matchingRules(rules,snapshot):[];
    const up=active.filter(r=>r.signal==='तेजी').length, down=active.filter(r=>r.signal==='मंदी').length, mixed=active.length-up-down;
    let bullishEvidence=0,bearishEvidence=0,evidence=0;
    for(const feature of currentFeatures) {
      const e=calibration.featureDates.get(feature); if(!e||e.dates<3)continue;
      const g=e.gain.get(stock.symbol)||0, l=e.loss.get(stock.symbol)||0;
      const baseG=(calibration.baseGain.get(stock.symbol)||0), baseL=(calibration.baseLoss.get(stock.symbol)||0);
      const conditionalG=(g+0.5)/(e.dates+1), conditionalL=(l+0.5)/(e.dates+1);
      const priorG=(baseG+0.5)/(priorDates+1), priorL=(baseL+0.5)/(priorDates+1);
      bullishEvidence+=Math.log2(conditionalG/priorG); bearishEvidence+=Math.log2(conditionalL/priorL); evidence+=e.dates;
    }
    const calibratedUp=bullishEvidence*4, calibratedDown=bearishEvidence*4;
    const bullishScore=calibratedUp+up*1.5+mixed*.1+masterUp*.1;
    const bearishScore=calibratedDown+down*1.5+mixed*.1+masterDown*.1;
    return {...stock,rules,active,up,down,mixed,total:rules.length,bullishScore,bearishScore,fit:evidence>=3?'prior-date calibrated + encoded book rules':'insufficient prior-date evidence',evidence,gainSupport:bullishEvidence,lossSupport:bearishEvidence};
  });
}

export default function StockForecastResearch({data,snapshot,zone}:{data:BookData;snapshot:AstroSnapshot|null;zone:string}) {
  const [history,setHistory]=useState<HistoricalPayload|null>(null),[signals,setSignals]=useState<DateSignalPayload|null>(null),[loadError,setLoadError]=useState(''),[query,setQuery]=useState(''),[copied,setCopied]=useState(false),[showAllRules,setShowAllRules]=useState(false);
  useEffect(()=>{Promise.all([fetch(`${import.meta.env.BASE_URL}research-source/nse-futures-top5-2011-2026.json`).then(r=>{if(!r.ok)throw new Error('Historical Top-5 file load नहीं हुई।');return r.json() as Promise<HistoricalPayload>}),fetch(`${import.meta.env.BASE_URL}research-source/astrology-date-signals-2015-2026.json`).then(r=>{if(!r.ok)throw new Error('Historical astrology feature file load नहीं हुई।');return r.json() as Promise<DateSignalPayload>})]).then(([h,s])=>{setHistory(h);setSignals(s);}).catch(e=>setLoadError(e instanceof Error?e.message:String(e)));},[]);
  const date=localDate(snapshot,zone), calibration=useMemo(()=>buildCalibration(history,signals,date),[history,signals,date]);
  const ranked=useMemo(()=>scoreStocks(data,snapshot,calibration),[data,snapshot,calibration]);
  const gainers=useMemo(()=>[...ranked].sort((a,b)=>(b.bullishScore-b.bearishScore)-(a.bullishScore-a.bearishScore)||b.evidence-a.evidence),[ranked]);
  const losers=useMemo(()=>[...ranked].sort((a,b)=>(b.bearishScore-b.bullishScore)-(a.bullishScore-a.bearishScore)||b.evidence-a.evidence),[ranked]);
  const forecastGainers=useMemo(()=>gainers.filter(r=>r.active.length>0&&r.bullishScore>r.bearishScore&&r.evidence>=30&&r.gainSupport>0),[gainers]);
  const forecastLosers=useMemo(()=>losers.filter(r=>r.active.length>0&&r.bearishScore>r.bullishScore&&r.evidence>=30&&r.lossSupport>0),[losers]);
  const actualGainers=history?actualFor(history.rows,date,'TOP_GAINER'):[], actualLosers=history?actualFor(history.rows,date,'TOP_LOSER'):[];
  const allRules=useMemo<SearchRule[]>(()=>[...data.rules.map(rule=>({id:rule.id,title:rule.title,text:`${rule.summary} फल/संकेत: ${rule.signal}. Conditions: ${rule.conditions.map(c=>c.type).join(', ')||'स्रोत-पाठ में वर्णित'}`,source:`Book rule · ${rule.section} · ${rule.source_ids.join(', ')||'source not linked'}`})),...TEXT_RULES],[data.rules]);
  const rules=allRules.filter(r=>!query||`${r.id} ${r.title} ${r.text} ${r.source}`.toLowerCase().includes(query.toLowerCase()));
  const gainRank=useMemo(()=>new Map(forecastGainers.map((r,i)=>[r.symbol,i+1])),[forecastGainers]), loseRank=useMemo(()=>new Map(forecastLosers.map((r,i)=>[r.symbol,i+1])),[forecastLosers]), stockMap=useMemo(()=>new Map(ranked.map(r=>[r.symbol,r])),[ranked]);
  const copy=async()=>{const lines=[`ज्योतिष stock research · ${date||'समय लागू नहीं'}`,`Calibration cutoff: strictly before ${date||'selected date'} · prior dates: ${calibration.priorDates}`,`Matched gainer watch: ${forecastGainers.slice(0,5).map(x=>`${x.symbol} ${x.bullishScore.toFixed(2)} · evidence ${x.evidence}`).join(' | ')||'INSUFFICIENT HISTORICAL EVIDENCE'}`,`Matched loser watch: ${forecastLosers.slice(0,5).map(x=>`${x.symbol} ${x.bearishScore.toFixed(2)} · evidence ${x.evidence}`).join(' | ')||'INSUFFICIENT HISTORICAL EVIDENCE'}`];try{await navigator.clipboard.writeText(lines.join('\n'));setCopied(true);setTimeout(()=>setCopied(false),2200);}catch{setCopied(false);}};
  const download=()=>downloadBlob(JSON.stringify({date,method:'walk-forward prior-date-only calibration; selected date actual rows excluded from forecast features',priorDates:calibration.priorDates,currentFeatures:snapshotFeatures(snapshot),topGainers:forecastGainers.slice(0,20),topLosers:forecastLosers.slice(0,20)},null,2),'stock-astrology-research.json','application/json');
  const insufficient=!calibration.priorDates||(!forecastGainers.length&&!forecastLosers.length);
  return <>
    <div className="page-heading"><div><div className="eyebrow">STOCK ASTROLOGY · WALK-FORWARD RESEARCH</div><h1>ज्योतिष-आधारित Top Gainer / Top Loser शोध</h1><p>चुने समय की ग्रह-स्थिति और पुस्तक के encoded rules को prior historical astrology–outcome relationships से calibrate किया जाता है। Actual sheet forecast input नहीं है; वह केवल बाद की validation है।</p></div><div className="button-row"><button className="button secondary" onClick={()=>void copy()}>{copied?<Check size={16}/>:<Clipboard size={16}/>} {copied?'Copied':'Copy result'}</button><button className="button secondary" onClick={download}><Download size={16}/> Download</button></div></div>
    <section className="notice warning"><TrendingUp size={19}/><div><strong>महत्वपूर्ण सीमा:</strong> यह research/backtest watchlist है, guaranteed prediction या investment advice नहीं। Calibration strictly selected date से पहले उपलब्ध dates पर है। पर्याप्त evidence न होने पर list जानबूझकर खाली रखी जाती है।</div></section>
    {loadError&&<div className="notice error">{loadError}</div>}
    <section className="panel stock-forecast-controls"><div className="section-title"><div><h2>Prior-date-only calibration</h2><p className="note">Global गणना समय बदलकर “गणना करें” दबाएँ। Feature और evidence उसी selected snapshot पर फिर बनेंगे।</p></div><span className="tag">{date||'समय लागू करें'}</span></div><div className="forecast-source-grid"><div><strong>Historical evidence</strong><span>{signals?.source||'लोड हो रही है…'}</span><small>{calibration.priorDates.toLocaleString('en-IN')} prior dates · selected date excluded</small></div><div><strong>Outcome source</strong><span>Supplied workbook · validation only</span><small>{history?`${history.rowCount.toLocaleString('en-IN')} rows · never used from selected date`:''}</small></div><div><strong>Current astrology features</strong><span>{snapshotFeatures(snapshot).length} features</span><small>{snapshotFeatures(snapshot).slice(0,3).join(' · ')||'गणना लंबित'}</small></div></div></section>
    {insufficient&&<section className="notice error"><strong>INSUFFICIENT HISTORICAL EVIDENCE</strong><div>इस selected date/time पर prior-date calibration या directional astrology match पर्याप्त नहीं है। कोई arbitrary stock forecast नहीं दिखाया गया।</div></section>}
    <div className="forecast-columns"><section className="panel"><div className="section-title"><div><h2><TrendingUp size={18}/> Astrology-generated gainer watch</h2><p className="note">Prior-date feature lift + active encoded तेजी rules; zero active-rule stocks excluded.</p></div><span className="tag">{forecastGainers.length?`Top ${Math.min(5,forecastGainers.length)}`:'INSUFFICIENT MATCH'}</span></div><div className="forecast-list">{forecastGainers.length?forecastGainers.slice(0,5).map((r,i)=><article className="forecast-card bullish" key={r.symbol}><span className="forecast-rank">#{i+1}</span><div className="forecast-main"><strong>{r.symbol}</strong><span>{r.name}</span><small>{r.group} · {r.element}</small></div><div className="forecast-score"><b>{(r.bullishScore-r.bearishScore).toFixed(2)}</b><small>calibrated net score</small></div><div className="forecast-rule-count"><b>{r.evidence}</b><small>prior-date evidence</small></div></article>):<div className="empty compact"><h3>INSUFFICIENT HISTORICAL MATCH</h3><p>बिना पर्याप्त prior evidence या active directional rule के कोई stock नहीं दिखाया गया।</p></div>}</div></section><section className="panel"><div className="section-title"><div><h2><TrendingDown size={18}/> Astrology-generated loser watch</h2><p className="note">Prior-date feature lift + active encoded मंदी rules; zero active-rule stocks excluded.</p></div><span className="tag">{forecastLosers.length?`Top ${Math.min(5,forecastLosers.length)}`:'INSUFFICIENT MATCH'}</span></div><div className="forecast-list">{forecastLosers.length?forecastLosers.slice(0,5).map((r,i)=><article className="forecast-card bearish" key={r.symbol}><span className="forecast-rank">#{i+1}</span><div className="forecast-main"><strong>{r.symbol}</strong><span>{r.name}</span><small>{r.group} · {r.element}</small></div><div className="forecast-score"><b>{(r.bearishScore-r.bullishScore).toFixed(2)}</b><small>calibrated net score</small></div><div className="forecast-rule-count"><b>{r.evidence}</b><small>prior-date evidence</small></div></article>):<div className="empty compact"><h3>INSUFFICIENT HISTORICAL MATCH</h3><p>बिना पर्याप्त prior evidence या active directional rule के कोई stock नहीं दिखाया गया।</p></div>}</div></section></div>
    <section className="panel"><div className="section-title"><div><h2>Historical outcome — validation only</h2><p className="note">Selected date: {date||'—'} · ये actual rows forecast score में शामिल नहीं हैं; केवल out-of-sample comparison के लिए हैं।</p></div><span className="tag">not a prediction source</span></div><div className="actual-columns"><div><h3>Actual Top Gainers</h3>{actualGainers.length?<table><thead><tr><th>Actual</th><th>Stock</th><th>Change</th><th>Astro rank / evidence</th></tr></thead><tbody>{actualGainers.map(r=>{const symbol=stockLabel(r.stock),s=stockMap.get(symbol);return <tr key={`${r.type}${r.rank}`}><td>{r.rank}</td><td><strong>{symbol}</strong></td><td className="up-text">{r.change.toFixed(4)}%</td><td>{gainRank.get(symbol)?`#${gainRank.get(symbol)}`:'—'} · {s?.evidence??0}</td></tr>})}</tbody></table>:<p className="note">इस date की actual validation row उपलब्ध नहीं है। Future date पर यह स्वाभाविक है।</p>}</div><div><h3>Actual Top Losers</h3>{actualLosers.length?<table><thead><tr><th>Actual</th><th>Stock</th><th>Change</th><th>Astro rank / evidence</th></tr></thead><tbody>{actualLosers.map(r=>{const symbol=stockLabel(r.stock),s=stockMap.get(symbol);return <tr key={`${r.type}${r.rank}`}><td>{r.rank}</td><td><strong>{symbol}</strong></td><td className="down-text">{r.change.toFixed(4)}%</td><td>{loseRank.get(symbol)?`#${loseRank.get(symbol)}`:'—'} · {s?.evidence??0}</td></tr>})}</tbody></table>:<p className="note">इस date की actual validation row उपलब्ध नहीं है। Future date पर यह स्वाभाविक है।</p>}</div></div></section>
    <section className="panel"><div className="section-title"><div><h2>सभी book / research rules searchable</h2><p className="note">Encoded book rules, supplied extracts और user hypotheses को source label के साथ पढ़ें। Missing numeric tables silently fabricate नहीं की गईं।</p></div><span className="tag">{rules.length} matched</span></div><label className="search-field"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="राहुकाल, बुध, वेध, विश्वे, बुध-शुक्र…"/></label><div className="forecast-rules">{rules.slice(0,showAllRules?rules.length:8).map(r=><article key={r.id}><div className="rule-meta"><span className="mono">{r.id}</span><span className="tag">{r.source}</span></div><h3>{r.title}</h3><p>{r.text}</p></article>)}</div>{rules.length>8&&<button className="button secondary" onClick={()=>setShowAllRules(x=>!x)}>{showAllRules?'कम दिखाएँ':`सभी ${rules.length} rules देखें`}</button>}</section>
    <section className="panel forecast-method"><h2>Reproducible research method</h2><p><strong>1.</strong> Supplied historical minute Panchang file से हर trading date का first available market-minute astrology feature vector बनाया गया। <strong>2.</strong> Selected date से strictly पहले वाले dates के Top-5 outcomes से feature–stock hit/lift evidence गिना गया। <strong>3.</strong> Current selected snapshot के Moon nakshatra/pada, Sun nakshatra/pada, weekday, hora, tithi और Sun–Moon angle bucket को उसी feature vocabulary में match किया गया। <strong>4.</strong> इस calibrated evidence को active Vyapar Ratna book rules के साथ directionally combine किया गया। <strong>5.</strong> Selected date का actual outcome score बनने के बाद ही validation में पढ़ा जाता है; forecast input नहीं।</p><p>इसलिए यह अभी भी statistical research model है, भविष्यवाणी की गारंटी नहीं। Historical astrology feature coverage 2015 onward है; उससे पहले dates पर “INSUFFICIENT HISTORICAL EVIDENCE” संभव है। BR-99 और अन्य user hypotheses reference/checklist हैं, स्वतः सिद्ध शास्त्रीय नियम नहीं।</p></section>
  </>;
}
