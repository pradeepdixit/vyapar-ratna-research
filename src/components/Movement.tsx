import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Download, RefreshCw } from 'lucide-react';
import { DateTime } from 'luxon';
import { calculateAstro, type AstroSnapshot, RASHIS } from '../lib/astro';
import { angleDistance, type BookData } from '../lib/rules';
import { exportRows } from '../lib/export';
import type { Location } from './LocationFields';

type Props = { snapshot: AstroSnapshot | null; location: Location; data: BookData };
type PairMovement = { a: string; b: string; before: number; after: number; change: number };

const PLANET_COLORS: Record<string, string> = {
  सूर्य: '#a22820', चंद्रमा: '#245a9b', मंगल: '#bd3a2d', बुध: '#16704c', गुरु: '#8a5b08', शुक्र: '#7a3e8f', शनि: '#39465a', राहु: '#5b4a2e', केतु: '#6c3434',
};
function signedDelta(a: number, b: number) { return ((b - a + 540) % 360) - 180; }
function magnitudeLabel(value: number) { const n = Math.abs(value); return n >= 1 ? 'बहुत बड़ा movement' : n >= .25 ? 'बड़ा movement' : n >= .05 ? 'मध्यम movement' : 'कम movement'; }
function formatChange(value: number) { return `${value >= 0 ? '+' : ''}${value.toFixed(4)}°`; }
function direction(value: number) { return value >= 0 ? 'आगे' : 'पीछे'; }
function localLabel(iso: string, zone: string) { return DateTime.fromISO(iso).setZone(zone).toFormat('dd MMM yyyy · HH:mm'); }
function inputValue(iso: string, zone: string) { return DateTime.fromISO(iso).setZone(zone).toFormat("yyyy-MM-dd'T'HH:mm"); }

function MovementWheel({ before, after }: { before: AstroSnapshot; after: AstroSnapshot }) {
  const cx = 190, cy = 190, r = 142;
  const point = (longitude: number, radius = r) => {
    const a = (longitude - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };
  return <svg className="movement-wheel" viewBox="0 0 380 380" role="img" aria-label="दो समय के ग्रह movement का गोल chart">
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#000" strokeWidth="2" />
    <circle cx={cx} cy={cy} r={r - 35} fill="none" stroke="#9aa9bf" strokeWidth="1" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(d => { const p = point(d); return <line key={d} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#d7deea" strokeWidth="1" />; })}
    {before.planets.slice(0, 9).map(p => { const a = point(p.longitude); const b = point(after.planets.find(q => q.name === p.name)?.longitude ?? p.longitude, r - 35); const color = PLANET_COLORS[p.name] ?? '#000'; return <g key={p.name}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="1.8" opacity=".75" /><circle cx={a.x} cy={a.y} r="4" fill="#fff" stroke={color} strokeWidth="2" /><circle cx={b.x} cy={b.y} r="4" fill={color} stroke="#000" strokeWidth="1" /><text x={b.x} y={b.y - 8} textAnchor="middle" fontSize="9" fill="#000" fontWeight="700">{p.name.slice(0, 2)}</text></g>; })}
    <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#000">ग्रह गति</text><text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#000">● बाद का समय</text>
  </svg>;
}

export default function Movement({ snapshot, location, data }: Props) {
  const initialStart = snapshot ? inputValue(snapshot.iso, location.zone) : '';
  const initialEnd = snapshot ? DateTime.fromISO(snapshot.iso).setZone(location.zone).plus({ hours: 1 }).toFormat("yyyy-MM-dd'T'HH:mm") : '';
  const [startAt, setStartAt] = useState(initialStart);
  const [endAt, setEndAt] = useState(initialEnd);
  const [before, setBefore] = useState<AstroSnapshot | null>(snapshot);
  const [later, setLater] = useState<AstroSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState(false);
  useEffect(() => {
    if (!snapshot || manualInput) return;
    setBefore(snapshot);
    setStartAt(inputValue(snapshot.iso, location.zone));
    setEndAt(DateTime.fromISO(snapshot.iso).setZone(location.zone).plus({ hours: 1 }).toFormat("yyyy-MM-dd'T'HH:mm"));
  }, [snapshot, location.zone, manualInput]);
  const calculatePair = async () => {
    const start = DateTime.fromISO(startAt, { zone: location.zone });
    const end = DateTime.fromISO(endAt, { zone: location.zone });
    if (!start.isValid || !end.isValid) { setError('दोनों date-time सही भरें।'); return; }
    if (end.toMillis() === start.toMillis()) { setError('समय-1 और समय-2 अलग रखें।'); return; }
    setLoading(true); setError('');
    try {
      const [first, second] = await Promise.all([
        calculateAstro(start.toJSDate(), location.lat, location.lon, location.zone),
        calculateAstro(end.toJSDate(), location.lat, location.lon, location.zone),
      ]);
      setBefore(first); setLater(second); setManualInput(true);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  };
  const activeBefore = before ?? snapshot;

  const rows = useMemo(() => {
    if (!activeBefore || !later) return [];
    const laterMap = new Map(later.planets.map(p => [p.name, p]));
    return activeBefore.planets.slice(0, 9).map(p => { const q = laterMap.get(p.name) ?? p; const change = signedDelta(p.longitude, q.longitude); return { ...p, later: q, change, magnitude: Math.abs(change), label: magnitudeLabel(change) }; }).sort((a, b) => b.magnitude - a.magnitude);
  }, [activeBefore, later]);
  const pairs = useMemo<PairMovement[]>(() => {
    if (!activeBefore || !later) return [];
    const map = new Map(later.planets.map(p => [p.name, p]));
    const ps = activeBefore.planets.slice(0, 9); const out: PairMovement[] = [];
    for (let i = 0; i < ps.length; i += 1) for (let j = i + 1; j < ps.length; j += 1) { const a = map.get(ps[i].name) ?? ps[i]; const b = map.get(ps[j].name) ?? ps[j]; const before = angleDistance(ps[i].longitude, ps[j].longitude); const after = angleDistance(a.longitude, b.longitude); out.push({ a: ps[i].name, b: ps[j].name, before, after, change: signedDelta(before, after) }); }
    return out.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [activeBefore, later]);
  const high = rows.filter(r => r.magnitude >= .25);
  const angleHigh = pairs.filter(p => Math.abs(p.change) >= .25);
  const exportMovement = () => { if (!activeBefore || !later) return; exportRows(rows.map(r => ({ समय: localLabel(activeBefore.iso, location.zone), अगला_समय: localLabel(later.iso, location.zone), ग्रह: r.name, पहले_का_अंश: r.longitude.toFixed(5), बाद_का_अंश: r.later.longitude.toFixed(5), बदलाव: r.change.toFixed(5), राशि: RASHIS[r.later.sign], गति: r.speed.toFixed(5), संकेत: r.label })), 'planet-movement', 'xlsx'); };
  if (!snapshot || !activeBefore) return <div className="empty"><Activity size={32}/><h3>ग्रह गति की गणना प्रतीक्षित है</h3><p>ऊपर तारीख और समय चुनकर “गणना करें” दबाएँ।</p></div>;
  return <>
    <div className="page-heading movement-heading"><div><div className="eyebrow">PLANETARY MOVEMENT RESEARCH</div><h1>ग्रह गति और Angle Movement</h1><p>दो अलग समयों की ग्रह स्थिति, आपसी कोण और बड़े बदलावों की सूची। यह research signal है, निश्चित market prediction नहीं।</p></div><button className="button secondary" onClick={exportMovement} disabled={!later}><Download size={16}/> Movement Excel</button></div>
    <section className="panel movement-time-panel"><div className="section-title"><div><h2>समय-1 और समय-2 खुद भरें</h2><p className="movement-time-note">आप दोनों पूरी तारीख और समय चुनें। गणना केवल इन्हीं दो समयों के आधार पर होगी।</p></div><span className="tag">{location.name} · {location.zone}</span></div><div className="movement-controls"><label>समय-1 <input type="datetime-local" value={startAt} onChange={e=>{setStartAt(e.target.value);setManualInput(true)}}/></label><label>समय-2 <input type="datetime-local" value={endAt} onChange={e=>{setEndAt(e.target.value);setManualInput(true)}}/></label><button className="button primary" onClick={()=>void calculatePair()} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''}/>{loading ? 'गणना…' : 'इन दोनों समयों की गणना करें'}</button></div><p className="movement-input-help">पहला समय: {activeBefore ? localLabel(activeBefore.iso, location.zone) : '—'} · दूसरा समय: {later ? localLabel(later.iso, location.zone) : 'अभी गणना बाकी'}</p>{error && <div className="notice error">{error}</div>}</section>
    {later && <><section className="movement-overview"><div className="movement-hero panel"><MovementWheel before={activeBefore} after={later}/><div><div className="eyebrow">AT A GLANCE</div><h2>किस समय movement बड़ा है?</h2><p>लाल/गहरे रंग की रेखाएँ ग्रह की longitude movement दिखाती हैं। dotted/हल्की lines को कम movement माना गया है।</p><div className="movement-stat-grid"><div><strong>{high.length}</strong><span>बड़े ग्रह movement</span></div><div><strong>{angleHigh.length}</strong><span>बड़े angle changes</span></div><div><strong>{rows[0]?.name ?? '—'}</strong><span>सबसे अधिक चलायमान</span></div></div></div></div><div className="movement-summary panel"><div className="eyebrow">RESEARCH INTERPRETATION</div><h2>संभावित तेज बदलाव के संकेत</h2>{high.length ? <ul>{high.slice(0, 5).map(r => <li key={r.name}><b>{r.name}</b> {formatChange(r.change)} · {r.label} · {direction(r.change)}</li>)}</ul> : <p>इस अवधि में कोई बड़ा longitude movement नहीं मिला। Angle table में छोटे बदलाव फिर भी देखें।</p>}<p className="movement-disclaimer">यह केवल गणितीय ग्रह/angle movement है। NIFTY या किसी वस्तु की वास्तविक कीमत के लिए market data उपलब्ध नहीं है।</p></div></section>
      <section className="panel movement-table-panel"><div className="section-title"><div><div className="eyebrow">PLANET-BY-PLANET</div><h2>ग्रहों की गति — बड़े movement सबसे ऊपर</h2></div><span className="muted">{localLabel(activeBefore?.iso ?? snapshot.iso, location.zone)} → {localLabel(later.iso, location.zone)}</span></div><div className="movement-table-wrap"><table><thead><tr><th>ग्रह</th><th>पहला longitude</th><th>बाद का longitude</th><th>बदलाव</th><th>राशि / स्थिति</th><th>movement वर्ग</th></tr></thead><tbody>{rows.map(r => <tr className={r.magnitude >= .25 ? 'movement-high' : ''} key={r.name}><td><strong style={{ color: PLANET_COLORS[r.name] ?? '#000' }}>{r.name}</strong></td><td>{r.longitude.toFixed(4)}°</td><td>{r.later.longitude.toFixed(4)}°</td><td className="movement-change">{formatChange(r.change)}</td><td>{RASHIS[r.later.sign]} · {r.later.retrograde ? 'वक्री' : 'मार्गी'}</td><td><span className="movement-badge">{r.label}</span></td></tr>)}</tbody></table></div></section>
      <section className="panel movement-angle-panel"><div className="section-title"><div><div className="eyebrow">ANGLE CHANGES</div><h2>ग्रहों के आपसी कोण में बदलाव</h2></div><span className="muted">बड़े angle change सबसे ऊपर</span></div><div className="movement-angle-grid">{pairs.slice(0, 18).map(p => <div className={Math.abs(p.change) >= .25 ? 'movement-angle-card high' : 'movement-angle-card'} key={p.a + p.b}><div><strong>{p.a} — {p.b}</strong><span>{formatChange(p.change)}</span></div><small>{p.before.toFixed(3)}° → {p.after.toFixed(3)}° · {Math.abs(p.change) >= .25 ? 'बड़ा angle change' : 'छोटा angle change'}</small></div>)}</div></section></>}
    <section className="panel movement-rule-panel"><div className="eyebrow">BOOK-LINKED RESEARCH</div><h2>इस समय लागू पुस्तक-नियम</h2><p>चुने हुए समय पर {data.stats.computable.toLocaleString('en-IN')} computable rules में से वर्तमान ग्रह-शर्तों से मिलते rules dashboard और नियम संग्रह में दिखते हैं। इस page पर movement को अलग ranking में रखा गया है ताकि तेज बदलाव वाले ग्रह और angles पहले दिखाई दें।</p></section>
  </>;
}
