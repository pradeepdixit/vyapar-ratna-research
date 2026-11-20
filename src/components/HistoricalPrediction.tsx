import { useEffect, useMemo, useState } from 'react';
import { Database, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import UserProvidedRules from './UserProvidedRules';

type Chunk = { columns: string[]; rows: string[][] };
type ManifestYear = { year: string; path: string; rows: number };
type Manifest = { totalRows: number; columns: string[]; years: ManifestYear[] };
type Match = { timestamp: string; row: string[]; similarity: number; meanDiff: number; withinTolerance: boolean; future: FutureCandle[] };
type FutureCandle = { minutes: number; time: string; open: number; high: number; low: number; close: number; direction: 'तेजी' | 'मंदी' | 'सम'; move: number };

type Props = { snapshot: AstroSnapshot | null; auto?: boolean };
const BASE = import.meta.env.BASE_URL;
const planetColumns: Record<string, string> = { सूर्य: 'Sun_longitude_sidereal_deg', चंद्रमा: 'Moon_longitude_sidereal_deg', मंगल: 'Mars_longitude_sidereal_deg', बुध: 'Mercury_longitude_sidereal_deg', गुरु: 'Jupiter_longitude_sidereal_deg', शुक्र: 'Venus_longitude_sidereal_deg', शनि: 'Saturn_longitude_sidereal_deg', राहु: 'Rahu_longitude_sidereal_deg', केतु: 'Ketu_longitude_sidereal_deg' };
const wanted = Object.keys(planetColumns);
function num(v: unknown) { const n = Number(v); return Number.isFinite(n) ? n : null; }
function circular(a: number, b: number) { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); }
function parseTime(v: string) { const t = Date.parse(v); return Number.isFinite(t) ? t : NaN; }
function fmt(v: number) { return `${v >= 0 ? '+' : ''}${v.toFixed(2)}`; }
function clockTime(v: string) { const d = new Date(v); return Number.isFinite(d.getTime()) ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : v; }
async function loadGzip<T>(path: string): Promise<T> { const r = await fetch(`${BASE}${path}`); if (!r.ok || !r.body) throw new Error(`Historical chunk load नहीं हुआ (${r.status})`); if (typeof DecompressionStream === 'undefined') throw new Error('इस browser में gzip data support नहीं है।'); return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json() as Promise<T>; }

export default function HistoricalPrediction({ snapshot, auto = false }: Props) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [tolerance, setTolerance] = useState(8);
  const [topN, setTopN] = useState(20);
  const [minMatches, setMinMatches] = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [lastRunIso, setLastRunIso] = useState('');

  useEffect(() => { fetch(`${BASE}online-data/manifest.json`).then(r => r.json()).then(setManifest).catch(e => setError(String(e))); }, []);
  useEffect(() => { setMatches([]); setTotalMatches(0); setLastRunIso(''); if (auto && snapshot) void runPrediction(snapshot); }, [snapshot?.iso, auto]);

  async function runPrediction(current: AstroSnapshot) {
    if (!manifest || loading) return;
    setLoading(true); setError(''); setMatches([]); setTotalMatches(0); setProgress('Historical file scan शुरू…');
    const index = new Map(current.planets.map(p => [p.name, p]));
    const currentMs = Date.parse(current.iso);
    const best: Match[] = []; let allMatches = 0; let scanned = 0; let carry: string[][] = [];
    try {
      for (let ci = 0; ci < manifest.years.length; ci += 1) {
        const part = await loadGzip<Chunk>(manifest.years[ci].path); const cols = part.columns; const pos = new Map(cols.map((c, i) => [c, i]));
        const combined = carry.concat(part.rows); const carryCount = carry.length;
        const timestampAt = (row: string[]) => row[pos.get('timestamp_IST') ?? 5] ?? '';
        for (let i = carryCount; i < Math.max(carryCount, combined.length - 361); i += 1) {
          const row = combined[i]; const historicalMs = parseTime(timestampAt(row));
          if (!Number.isFinite(historicalMs) || historicalMs >= currentMs) continue;
          let totalDiff = 0; let compared = 0;
          for (const name of wanted) { const p = index.get(name); const at = pos.get(planetColumns[name]); const hv = at === undefined ? null : num(row[at]); if (p && hv !== null) { totalDiff += circular(p.longitude, hv); compared += 1; } }
          if (compared < 7) continue;
          const meanDiff = totalDiff / compared;
          const similarity = Math.max(0, Math.min(100, 100 - (meanDiff / 180) * 100));
          const closeAt = pos.get('close') ?? 4; const openAt = pos.get('open') ?? 1; const highAt = pos.get('high') ?? 2; const lowAt = pos.get('low') ?? 3;
          const baseClose = num(row[closeAt]); if (baseClose === null) continue;
          const future: FutureCandle[] = [];
          for (let k = 1; k <= 361; k += 1) { const fr = combined[i + k]; if (!fr) break; const open = num(fr[openAt]); const high = num(fr[highAt]); const low = num(fr[lowAt]); const close = num(fr[closeAt]); if ([open, high, low, close].some(v => v === null)) continue; const move = close! - baseClose; const direction = move > 0 ? 'तेजी' : move < 0 ? 'मंदी' : 'सम'; future.push({ minutes: k, time: timestampAt(fr), open: open!, high: high!, low: low!, close: close!, move, direction }); }
          if (future.length < 361) continue;
          allMatches += 1; best.push({ timestamp: timestampAt(row), row, similarity, meanDiff, withinTolerance: meanDiff <= tolerance, future }); best.sort((a, b) => b.similarity - a.similarity); if (best.length > topN) best.pop();
        }
        carry = combined.slice(-361); scanned += part.rows.length; setProgress(`${ci + 1}/${manifest.years.length} chunks · ${scanned.toLocaleString('en-IN')} rows scan`);
      }
      setMatches(best); setTotalMatches(allMatches); setLastRunIso(current.iso); if (!best.length) setError('INSUFFICIENT HISTORICAL MATCH — file में valid historical row नहीं मिली।');
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); setProgress(''); }
  }

  const checkpoints = [1, 5, 10, 30, 60, 120, 180, 240, 300, 361];
  const horizons = useMemo(() => checkpoints.map(n => { const outcomes = matches.map(m => m.future[n - 1]).filter(Boolean); const bull = outcomes.filter(x => x.direction === 'तेजी').length; const bear = outcomes.filter(x => x.direction === 'मंदी').length; const equal = outcomes.length - bull - bear; const moves = outcomes.map(x => x.move); return { n, count: outcomes.length, bull, bear, equal, bullPct: outcomes.length ? bull / outcomes.length * 100 : 0, bearPct: outcomes.length ? bear / outcomes.length * 100 : 0, avgMove: moves.length ? moves.reduce((a, b) => a + b, 0) / moves.length : 0 }; }), [matches]);
  const trajectory = useMemo(() => Array.from({ length: 361 }, (_, i) => { const outcomes = matches.map(m => m.future[i]).filter(Boolean); const moves = outcomes.map(x => x.move); return { n: i + 1, time: outcomes[0]?.time || '', move: moves.length ? moves.reduce((a, b) => a + b, 0) / moves.length : 0 }; }).filter(x => Number.isFinite(x.move)), [matches]);
  const chart = useMemo(() => { if (!trajectory.length) return null; const width = 1000, height = 360, pad = 48; const values = trajectory.map(x => x.move); const min = Math.min(0, ...values), max = Math.max(0, ...values); const range = max - min || 1; const x = (n: number) => pad + ((n - 1) / 360) * (width - pad * 2); const y = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2); const zeroY = y(0); const sideBand = range * 0.06; const sideTop = y(sideBand), sideBottom = y(-sideBand); const segments = trajectory.slice(1).map((p, i) => <line key={p.n} x1={x(trajectory[i].n)} y1={y(trajectory[i].move)} x2={x(p.n)} y2={y(p.move)} stroke={Math.abs(p.move) <= sideBand ? '#9b7200' : p.move >= trajectory[i].move ? '#087a3b' : '#b00020'} strokeWidth="3"/>); const label = (p: typeof trajectory[number]) => `${clockTime(p.time)} · +${p.n}`; return <svg className="trajectory-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="361 minute average movement chart"><rect x={pad} y={pad} width={width - pad * 2} height={zeroY - pad} fill="#e3f5e9"/><rect x={pad} y={zeroY} width={width - pad * 2} height={height - pad - zeroY} fill="#ffe4e4"/><rect x={pad} y={sideTop} width={width - pad * 2} height={sideBottom - sideTop} fill="#fff3bd" opacity="0.9"/><line x1={pad} y1={zeroY} x2={width - pad} y2={zeroY} stroke="#111" strokeDasharray="5 5" strokeWidth="2"/><text x={pad + 8} y={pad + 18} className="chart-zone green-zone">तेजी zone</text><text x={pad + 8} y={height - pad - 8} className="chart-zone red-zone">मंदी zone</text><text x={width / 2 - 32} y={zeroY - 6} className="chart-zone side-zone">sideways</text><text x={pad} y={pad - 12} className="chart-label">औसत price move</text>{segments}<text x={pad} y={height - 10} className="chart-label">{label(trajectory[0])}</text><text x={width / 2 - 55} y={height - 10} className="chart-label">{label(trajectory[Math.min(179, trajectory.length - 1)])}</text><text x={width - 150} y={height - 10} className="chart-label">{label(trajectory[trajectory.length - 1])}</text><text x={width - 115} y={zeroY - 8} className="chart-label">base close</text></svg>; }, [trajectory]);
  const canPredict = Boolean(snapshot && manifest && !loading);
  return <div className="prediction-page">
    <div className="page-heading"><div><div className="eyebrow">FILE-ONLY HISTORICAL ENGINE</div><h1>NEXT 361 CANDLE MOVE</h1><p>हर मिनट की current planetary position को केवल supplied historical file से मिलाकर अगले 361 वास्तविक candles का पूरे session का move निकाला जाता है।</p></div><button className="button primary" disabled={!canPredict} onClick={() => snapshot && void runPrediction(snapshot)}><Play size={16}/> {loading ? 'Matching…' : 'इस समय की prediction चलाएँ'}</button></div>
    <section className="prediction-contract panel"><ShieldAlert size={22}/><div><h2>Strict data rule</h2><p>इस page पर केवल uploaded NIFTY minute file के 10,20,592 records उपयोग होते हैं। कोई external market feed, fabricated OHLC, RSI, MACD या technical indicator नहीं है। Historical candidate हमेशा current selected time से पहले का है; उसके बाद की 10 candles केवल उसी historical match का वास्तविक outcome हैं।</p></div></section><UserProvidedRules/>
    <section className="panel prediction-controls"><div className="section-title"><div><div className="eyebrow">MATCH SETTINGS</div><h2>Historical planetary similarity</h2></div><span className="tag">{snapshot ? new Date(snapshot.iso).toLocaleString('en-IN') : 'Current calculation pending'}</span></div><div className="prediction-control-grid"><label>Maximum mean degree difference <input type="number" min="0.1" max="60" step="0.1" value={tolerance} onChange={e => setTolerance(Number(e.target.value))}/> <small>कम value = exact match</small></label><label>Top matches <input type="number" min="5" max="100" value={topN} onChange={e => setTopN(Number(e.target.value))}/></label><label>Minimum required matches <input type="number" min="1" max="100" value={minMatches} onChange={e => setMinMatches(Number(e.target.value))}/></label></div><p className="muted">Matching: सूर्य से केतु तक available planetary longitude, 360° circular distance. Current time के बाद का कोई historical row candidate नहीं बनता।</p>{progress && <p className="prediction-progress">{progress}</p>}</section>
    {error && <div className="notice error"><Database size={18}/><div><strong>{error}</strong><br/><small>Nearest result न मिलने पर ही prediction रोकी गयी है; tolerance result को रोकती नहीं, केवल match label तय करती है।</small></div></div>}
    {matches.length > 0 ? <><section className="prediction-summary-grid"><div><span>Historical Match Count</span><strong>{totalMatches.toLocaleString('en-IN')}</strong></div><div><span>Displayed best matches</span><strong>{matches.length}</strong></div><div><span>Best similarity</span><strong>{matches[0]?.similarity.toFixed(2)}%</strong></div><div><span>Source</span><strong>FILE ONLY</strong></div></section>{matches.length < minMatches && <div className="notice warning"><ShieldAlert size={18}/><div><strong>INSUFFICIENT WITHIN-TOLERANCE MATCHES</strong><br/>फिर भी सबसे नजदीकी {matches.length} historical matches नीचे दिखाये गये हैं; इन्हें low-confidence fallback समझें।</div></div>}<section className="panel"><div className="section-title"><div><div className="eyebrow">361 MINUTE MOVE</div><h2>पूरे session का clock-time up / down chart</h2></div><span className="tag">{clockTime(matches[0].timestamp)} से 361 वास्तविक candles</span></div><div className="chart-legend"><span className="bull">हरा = तेजी / ऊपर</span><span className="bear">लाल = मंदी / नीचे</span><span className="sideways-key">पीला = sideways</span><span>काली dotted line = base close</span></div>{chart}<p className="muted">हर label historical candle का वास्तविक clock time दिखाता है। Line nearest matches के actual close movements का average है; कोई fabricated future candle नहीं है।</p></section><section className="panel"><div className="section-title"><div><div className="eyebrow">KEY CLOCK-TIME CHECKPOINTS</div><h2>अलग-अलग समय पर तेजी-मंदी ratio</h2></div><span className="tag">{matches.length} nearest historical matches</span></div><div className="prediction-horizon-grid">{horizons.map(h => <div className="prediction-horizon-card" key={h.n}><strong>{clockTime(matches[0].future[h.n - 1].time)}</strong><span>+{h.n} · {h.bullPct.toFixed(1)}% तेजी</span><span>{h.bearPct.toFixed(1)}% मंदी</span><small>{h.count} outcomes · avg {fmt(h.avgMove)} points</small></div>)}</div></section><section className="panel"><div className="section-title"><div><div className="eyebrow">HISTORICAL EVIDENCE</div><h2>सबसे नजदीकी historical matches</h2></div><span className="muted">Calculation: {new Date(lastRunIso).toLocaleString('en-IN')}</span></div><div className="prediction-match-list">{matches.map((m, i) => <article className="prediction-match" key={`${m.timestamp}-${i}`}><div><strong>#{i + 1} · {m.timestamp}</strong><span>Similarity {m.similarity.toFixed(2)}% · mean difference {m.meanDiff.toFixed(2)}° · {m.withinTolerance ? 'within tolerance' : 'nearest fallback'} · next 361 real candles</span></div><div className="prediction-match-summary">+361 ({clockTime(m.future[360].time)}) close move: <b className={m.future[360].move >= 0 ? 'bull' : 'bear'}>{fmt(m.future[360].move)} points</b> · +60 {clockTime(m.future[59].time)}: {fmt(m.future[59].move)} · +180 {clockTime(m.future[179].time)}: {fmt(m.future[179].move)}</div></article>)}</div></section></> : !loading && lastRunIso ? <section className="empty"><ShieldAlert size={30}/><h2>INSUFFICIENT HISTORICAL MATCH</h2><p>File में valid historical row नहीं मिली। कोई काल्पनिक prediction नहीं दिखाई गयी।</p></section> : <section className="empty"><Database size={30}/><h2>Prediction चलाने के लिए button दबाएँ</h2><p>ऊपर का current calculation time पहले से चुना snapshot है। फिर supplied file के सभी historical chunks scan होंगे।</p></section>}
  </div>;
}
