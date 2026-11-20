import { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Filter, Search, Database, RefreshCw } from 'lucide-react';

type ManifestYear = { year: string; path: string; rows: number; first?: string; last?: string };
type Manifest = { title: string; sourceFile: string; totalRows: number; columns: string[]; years: ManifestYear[]; sheets?: { name: string; rows: string[][] }[]; originalPath?: string };
type Chunk = { year: string; columns: string[]; rows: unknown[][] };

const BASE = import.meta.env.BASE_URL;
const SAMPLE_COLUMNS = ['date', 'open', 'high', 'low', 'close', 'timestamp_IST', 'local_date', 'local_time'];
const SAMPLE_ROWS = [
  ['डेटा index तैयार हो रहा है', '—', '—', '—', '—', '—', '—', '—'],
];
function display(value: unknown) { if (value === null || value === undefined || value === '') return '—'; return String(value); }
function rowText(row: unknown[]) { return row.map(display).join(' ').toLocaleLowerCase(); }
async function loadGzipJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE}${url}`);
  if (!response.ok) throw new Error(`Data chunk load नहीं हुआ (${response.status})।`);
  if (typeof DecompressionStream === 'undefined') throw new Error('इस browser में gzip data खोलने की सुविधा नहीं है। Chrome/Edge/Firefox का नया version इस्तेमाल करें।');
  const decompressed = new Response(response.body!.pipeThrough(new DecompressionStream('gzip')));
  return decompressed.json() as Promise<T>;
}

export default function OnlineDataViewer() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [manifestError, setManifestError] = useState('');
  const [chunk, setChunk] = useState<Chunk | null>(null);
  const [year, setYear] = useState('');
  const [sheet, setSheet] = useState('NIFTY Data');
  const [query, setQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 100;

  useEffect(() => {
    fetch(`${BASE}online-data/manifest.json`, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('Online data index अभी publish नहीं हुआ है।'); return r.json(); }).then((m: Manifest) => {
      setManifest(m); setYear(m.years[0]?.year ?? '');
    }).catch(e => setManifestError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!manifest || !year || sheet !== 'NIFTY Data') return;
    const info = manifest.years.find(y => y.year === year); if (!info) return;
    setLoading(true); setError(''); setPage(0);
    loadGzipJson<Chunk>(info.path).then(c => setChunk(c)).catch(e => { setChunk(null); setError(e instanceof Error ? e.message : String(e)); }).finally(() => setLoading(false));
  }, [manifest, year, sheet]);

  const columns = sheet === 'NIFTY Data' ? (chunk?.columns ?? manifest?.columns ?? SAMPLE_COLUMNS) : (manifest?.sheets?.find(s => s.name === sheet)?.rows[0] ?? []);
  const sourceRows = sheet === 'NIFTY Data' ? (chunk?.rows ?? SAMPLE_ROWS) : (manifest?.sheets?.find(s => s.name === sheet)?.rows.slice(1) ?? []);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(); const d = dateQuery.trim().toLocaleLowerCase();
    return sourceRows.filter(row => (!q || rowText(row).includes(q)) && (!d || rowText(row).includes(d)));
  }, [sourceRows, query, dateQuery]);
  const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  return <div className="online-data-page">
    <div className="page-heading"><div><div className="eyebrow">ONLINE RESEARCH DATA</div><h1>NIFTY minute data viewer</h1><p>बड़ी Excel file को browser में year-wise खोलें। पूरी workbook एक साथ memory में load नहीं होती, इसलिए search और research अधिक smooth रहता है।</p></div><div className="button-row"><button className="button secondary" onClick={() => window.location.reload()}><RefreshCw size={16}/> Reload index</button>{manifest?.originalPath && <a className="button quiet" href={`${BASE}${manifest.originalPath}`} download><Download size={16}/> Original Excel</a>}</div></div>
    {manifestError && <div className="notice error"><Database size={18}/><div><strong>Data index अभी उपलब्ध नहीं</strong><br/>{manifestError}<br/><small>Source workbook: {manifest?.sourceFile ?? 'NIFTY_50_1MIN_2015_2026_panchang_updated.xlsx'}</small></div></div>}
    {manifest && <><section className="online-data-stats"><div><span>कुल records</span><strong>{manifest.totalRows.toLocaleString('en-IN')}</strong></div><div><span>Columns</span><strong>{manifest.columns.length}</strong></div><div><span>Years / chunks</span><strong>{manifest.years.length}</strong></div><div><span>Loaded chunk</span><strong>{year || '—'}</strong></div></section><section className="panel online-data-controls"><div className="section-title"><div><div className="eyebrow">LAZY DATA EXPLORER</div><h2>जिस अवधि का data देखना है, वही खोलें</h2></div><span className="tag">{filtered.length.toLocaleString('en-IN')} loaded rows</span></div><div className="online-filter-grid"><label>Sheet<select value={sheet} onChange={e => { setSheet(e.target.value); setPage(0); }}><option>NIFTY Data</option>{manifest.sheets?.filter(s => s.name !== 'NIFTY Data').map(s => <option key={s.name}>{s.name}</option>)}</select></label><label>Year / chunk<select value={year} onChange={e => setYear(e.target.value)}>{manifest.years.map(y => <option key={y.year} value={y.year}>{y.year} · {y.rows.toLocaleString('en-IN')} rows</option>)}</select></label><label>Search all loaded columns<div className="search-field"><Search size={17}/><input value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="नक्षत्र, ग्रह, value…"/></div></label><label>Date / time filter<div className="search-field"><Filter size={17}/><input value={dateQuery} onChange={e => { setDateQuery(e.target.value); setPage(0); }} placeholder="2019-03-15 या 09:15"/></div></label></div></section><section className="panel online-data-table-panel"><div className="section-title"><div><h2>{sheet}</h2><p className="muted">{loading ? 'Chunk खुल रहा है…' : `${page * pageSize + (visible.length ? 1 : 0)}–${page * pageSize + visible.length} / ${filtered.length.toLocaleString('en-IN')} filtered rows`}</p></div>{loading && <div className="spinner"/>}</div><div className="online-table-wrap"><table className="online-data-table"><thead><tr>{columns.map((c, i) => <th key={`${c}-${i}`}>{display(c)}</th>)}</tr></thead><tbody>{visible.map((row, ri) => <tr key={`${page}-${ri}`}>{columns.map((_, ci) => <td key={ci}>{display(row[ci])}</td>)}</tr>)}</tbody></table></div><div className="online-pagination"><button className="button secondary small" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Previous</button><strong>Page {page + 1} / {pageCount}</strong><button className="button secondary small" disabled={page + 1 >= pageCount} onClick={() => setPage(p => p + 1)}>Next →</button></div></section>{manifest.sheets?.filter(s => s.name !== 'NIFTY Data').map(s => <section className="panel online-sheet-note" key={s.name}><h2>{s.name}</h2><div className="online-small-table"><table><tbody>{s.rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{display(v)}</td>)}</tr>)}</tbody></table></div></section>)}</>}
  </div>;
}
