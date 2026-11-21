import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { Play, Copy, Download, Square } from 'lucide-react';
import { calculateAstro, type AstroSnapshot } from '../lib/astro';
import { MATCH_PLANETS, SESSION_COUNT, minuteClock, clockLabel, circularDifference, type SessionMatch, type SessionResults } from '../lib/sessionMatching';

type Props = { snapshot: AstroSnapshot | null; location: { lat: number; lon: number; zone: string } };
export default function HistoricalPrediction({ snapshot, location }: Props) {
  const initialDate = snapshot ? DateTime.fromISO(snapshot.iso).setZone('Asia/Kolkata').toISODate()! : DateTime.now().setZone('Asia/Kolkata').toISODate()!;
  const [date, setDate] = useState(initialDate);
  const [target, setTarget] = useState<number[][]>([]);
  const [result, setResult] = useState<SessionResults | null>(null);
  const [calculatedDate, setCalculatedDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(0);
  const [minute, setMinute] = useState(0);
  const [copyStatus, setCopyStatus] = useState('');
  const workerRef = useRef<Worker | null>(null);
  const runRef = useRef(0);
  useEffect(() => () => { runRef.current++; workerRef.current?.terminate(); }, []);
  function cancel() { runRef.current++; workerRef.current?.terminate(); workerRef.current = null; setBusy(false); setProgress('गणना रोकी गई।'); }
  async function calculate() {
    const start = DateTime.fromISO(`${date}T09:15`, { zone: 'Asia/Kolkata' });
    if (!start.isValid || start.year < 1800 || start.year > 2399) { setError('1800–2399 की सही तारीख भरें।'); return; }
    cancel(); const run = ++runRef.current;
    setBusy(true); setProgress('361 मिनटों की ग्रह गणना शुरू…'); setError(''); setResult(null); setSelected(0); setMinute(0); setCopyStatus('');
    try {
      const degrees: number[][] = [];
      for (let i = 0; i < SESSION_COUNT; i++) {
        if (run !== runRef.current) return;
        const s = await calculateAstro(start.plus({ minutes: i }).toJSDate(), location.lat, location.lon, 'Asia/Kolkata');
        degrees.push(MATCH_PLANETS.map(([name]) => {
          const p = s.planets.find(p => p.name === name);
          if (!p) throw new Error(`${name} की गणना उपलब्ध नहीं।`);
          return p.longitude;
        }));
        if (i % 12 === 0) { setProgress(`${date} · ${clockLabel(minuteClock(i))} · ${i + 1}/361 मिनट के ग्रह calculate`); await new Promise(resolve => setTimeout(resolve, 0)); }
      }
      if (run !== runRef.current) return;
      setTarget(degrees); setCalculatedDate(date);
      const worker = new Worker(new URL('../lib/sessionMatch.worker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;
      worker.onmessage = ({ data }) => {
        if (run !== runRef.current) return;
        if (data.type === 'progress') setProgress(data.text);
        else { if (data.type === 'complete') { setResult(data.result); setMinute(data.result.matches[0]?.bestTargetIndex ?? 0); setProgress('Minute-wise मिलान पूरा।'); } else { setError(data.text); setProgress(''); } worker.terminate(); workerRef.current = null; setBusy(false); }
      };
      worker.onerror = () => { if (run === runRef.current) { setError('Historical worker नहीं चल पाया। कृपया फिर प्रयास करें।'); setProgress(''); setBusy(false); worker.terminate(); workerRef.current = null; } };
      const base = new URL(import.meta.env.BASE_URL, window.location.href).href;
      worker.postMessage({ base, date, target: degrees });
    } catch (e) { if (run === runRef.current) { setError(e instanceof Error ? e.message : String(e)); setBusy(false); setProgress(''); } }
  }
  const active = result?.matches[selected];
  const rowsText = () => ['Rank\tDate\tTarget time IST\tHistorical time IST\tMean 9-planet difference\tAngular similarity (%)', ...(result?.matches ?? []).map((m, i) => `${i + 1}\t${m.date}\t${minuteClock(m.bestTargetIndex)}\t${m.minutes[m.bestTargetIndex].time}\t${m.meanDifference.toFixed(6)}\t${m.similarity.toFixed(4)}`)].join('\n');
  async function copy() { try { await navigator.clipboard.writeText(rowsText()); setCopyStatus('Copy हो गया'); } catch { setCopyStatus('Copy अनुमति नहीं मिली; CSV download करें।'); } }
  function download() { const blob = new Blob(['\ufeff' + rowsText().replaceAll('\t', ',')], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `nearest-10-dates-${calculatedDate}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <div className="prediction-page nearest-session-page">
    <div className="page-heading"><div><div className="eyebrow">MINUTE-WISE · ALL 9 PLANETS · FILE HISTORY</div><h1>Nearest 10 Historical Dates</h1><p>हर मिनट नौ ग्रहों का अंश मिलाएँ; सबसे नजदीकी 10 अलग तारीखें देखें। पुराने override, candle-probability और average-chart नियम इस page से हटा दिए गए हैं।</p></div></div>
    <section className="panel nearest-session-controls"><label>शोध की तारीख (IST)<input type="date" value={date} onChange={e => { setDate(e.target.value); setResult(null); setTarget([]); setCalculatedDate(''); setProgress(''); setCopyStatus(''); setError(''); }} disabled={busy}/></label><div><strong>09:15 AM → 03:15 PM</strong><p>दोनों समय शामिल · 361 मिनट · 9 ग्रह · 3,249 लक्ष्य ग्रह-अंश</p></div><button className="button primary" onClick={() => void calculate()} disabled={busy}><Play size={18}/>ग्रहों का मिलान करें</button>{busy && <button className="button" onClick={cancel}><Square size={18}/>रोकें</button>}</section>
    <section className="panel"><h2>इस page का एकमात्र मिलान नियम</h2><p>चुनी तारीख के 09:15 AM–03:15 PM के हर मिनट पर सभी 9 ग्रह calculate होते हैं। फिर उसी target minute के लिए historical file की <strong>किसी भी समय</strong> वाली row में पहले चंद्रमा की circular degree दूरी सबसे कम रखी जाती है—चंद्रमा की degree में कोई बदलाव, rounding या averaging नहीं होता। बराबर/निकट moon candidates में सूर्य, बुध, गुरु और बाकी ग्रहों के nakshatra–pada matches filter की तरह प्राथमिकता पाते हैं; अंत में सभी 9 ग्रहों का अंतर tie-breaker है।</p><p><strong>Strict lunar filter: अधिकतम 1.00000° अंतर।</strong> जिस historical date का सबसे अच्छा moon-anchored match भी 1° से अधिक हो, वह date nearest-10 में शामिल नहीं होगी। इसलिए 10 से कम dates आना गलत 5–20° result दिखाने से बेहतर है।</p><p>हर target minute का चुना हुआ historical row उसी एक समय का होता है; अलग-अलग ग्रहों को अलग rows से जोड़कर नकली match नहीं बनाया जाता। दस अलग तारीखों में rank moon-anchored result के mean nine-planet difference से है। हर card में शोध का समय और मिला हुआ historical समय दोनों हैं।</p><p>Similarity = 100 × (1 − नौ ग्रहों का औसत अंतर/180): यह केवल geometric score है, तेजी/मंदी probability नहीं। Target: Swiss Ephemeris · Lahiri · mean Rahu/Ketu · IST.</p></section>
    {progress && <p className="prediction-progress" role="status">{progress}</p>}{error && <div className="notice error" role="alert">{error}</div>}
    {result && <><section className="prediction-summary-grid"><div><span>शोध की तारीख</span><strong>{calculatedDate}</strong></div><div><span>Strict moon matches</span><strong>{result.matches.length}</strong></div><div><span>Moon &gt; 1° rejected</span><strong>{result.moonRejectedDays}</strong></div><div><span>Rows जाँची</span><strong>{result.scannedRows.toLocaleString('en-IN')}</strong></div></section>
      <section className="panel"><div className="section-title"><h2>सबसे नजदीकी {result.matches.length} अलग तारीखें · चंद्रमा पहले</h2><div className="nearest-session-actions"><button className="button" disabled={!active} onClick={() => void copy()}><Copy size={18}/>Copy list</button><button className="button" disabled={!active} onClick={download}><Download size={18}/>CSV</button></div></div>{copyStatus && <p role="status">{copyStatus}</p>}{result.matches.length < 10 && <p>Strict 1° चंद्रमा filter के बाद केवल {result.matches.length} valid historical दिन मिले; कोई fabricated wider match नहीं दिखाया गया।</p>}<div className="nearest-date-list">{result.matches.map((m, i) => <button key={m.date} className={`nearest-date-card ${selected === i ? 'selected' : ''}`} onClick={() => { setSelected(i); setMinute(m.bestTargetIndex); }}><strong>#{i + 1} · {m.date}</strong><span>चंद्रमा अंतर {m.moonDifference.toFixed(5)}°</span><span>नौ-ग्रह औसत अंतर {m.meanDifference.toFixed(4)}°</span><span>शोध: {clockLabel(minuteClock(m.bestTargetIndex))} IST</span><span>मिला समय: {clockLabel(m.minutes[m.bestTargetIndex].time)} IST</span><small>361 शोध मिनट जाँचे · {m.historicalMinutes.length} historical rows · 9 ग्रह</small></button>)}</div></section>
      {active && <><section className="panel"><h2>प्राथमिक ग्रहों की nearest जाँच</h2><p><strong>Target समय: {clockLabel(minuteClock(active.bestTargetIndex))} IST</strong> — सूर्य → चंद्रमा → बुध → गुरु को पहले पढ़ें। प्रत्येक ग्रह का सबसे नजदीकी historical row और वास्तविक समय अलग दिखाया गया है। यह diagnostic है; तारीख की rank सभी 9 ग्रहों वाली एक ही row से तय है।</p><div className="nearest-planet-summary">{MATCH_PLANETS.map(([name], p) => <div key={name}><strong>{name}</strong><span>{active.planetNearest[p].difference.toFixed(5)}° · {clockLabel(active.planetNearest[p].time)} IST</span></div>)}</div></section>
      <section className="panel"><div className="section-title"><h2>हर शोध मिनट का nearest historical समय</h2><label>समय<select value={minute} onChange={e => setMinute(Number(e.target.value))}>{Array.from({ length: SESSION_COUNT }, (_, i) => <option key={i} value={i}>{clockLabel(minuteClock(i))}</option>)}</select></label></div><p><strong>{calculatedDate}</strong> बनाम <strong>{active.date}</strong> · शोध समय {clockLabel(minuteClock(minute))} IST → मिला समय {clockLabel(active.minutes[minute].time)} IST</p><div className="nearest-minute-grid">{MATCH_PLANETS.map(([name], p) => <article key={name}><h3>{name}</h3><p>शोध अंश: <b>{target[minute][p].toFixed(6)}°</b></p><p>Historical अंश: <b>{active.minutes[minute].degrees[p].toFixed(6)}°</b></p><p>अंतर: <b>{circularDifference(target[minute][p], active.minutes[minute].degrees[p]).toFixed(6)}°</b></p></article>)}</div><div className="nearest-session-actions"><button className="button" disabled={minute === 0} onClick={() => setMinute(minute - 1)}>पिछला मिनट</button><button className="button" disabled={minute === 360} onClick={() => setMinute(minute + 1)}>अगला मिनट</button></div></section></>}
    </>}
  </div>;
}
