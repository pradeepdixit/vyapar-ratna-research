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
  const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});
  const [globalRows, setGlobalRows] = useState<unknown[][] | null>(null);
  const [globalTotal, setGlobalTotal] = useState(0);
  const [globalLoading, setGlobalLoading] = useState(false);
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
  const matches = (row: unknown[], cols: string[]) => {
    const q = query.trim().toLocaleLowerCase(); const d = dateQuery.trim().toLocaleLowerCase();
    return (!q || rowText(row).includes(q)) && (!d || rowText(row).includes(d)) && cols.every((_, index) => {
      const filter = (columnFilters[index] ?? '').trim().toLocaleLowerCase();
      return !filter || display(row[index]).toLocaleLowerCase().includes(filter);
    });
  };
  const filtered = useMemo(() => globalRows ?? sourceRows.filter(row => matches(row, columns)), [globalRows, sourceRows, columns, query, dateQuery, columnFilters]);
  const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  async function scanWholeDataset() {
    if (!manifest || sheet !== 'NIFTY Data') return;
    if (!query.trim() && !dateQuery.trim() && !Object.values(columnFilters).some(Boolean)) { setError('पहले कम-से-कम एक column filter, date या search value भरें।'); return; }
    setGlobalLoading(true); setError(''); setGlobalRows([]); setGlobalTotal(0); setPage(0);
    try {
      const found: unknown[][] = []; let total = 0;
      for (const info of manifest.years) {
        const part = await loadGzipJson<Chunk>(info.path);
        for (const row of part.rows) if (matches(row, part.columns)) { total += 1; if (found.length < 5000) found.push(row); }
      }
      setGlobalRows(found); setGlobalTotal(total);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setGlobalRows(null); }
    finally { setGlobalLoading(false); }
  }

  return <div className="online-data-page">
    <div className="page-heading"><div><div className="eyebrow">EXCEL-STYLE ONLINE VIEW</div><h1>NIFTY minute data — Excel जैसा view</h1><p>मूल Excel का column order और सभी values जस के तस हैं। नीचे header के ठीक नीचे हर column का अलग filter है—जैसे <b>Sun_nakshatra</b> में <b>Magha</b> लिखकर उसी column के records देखें।</p></div><div className="button-row"><button className="button secondary" onClick={() => { setQuery(''); setDateQuery(''); setColumnFilters({}); setPage(0); }}><RefreshCw size={16}/> सभी filters साफ करें</button>{manifest?.originalPath && <a className="button quiet" href={`${BASE}${manifest.originalPath}`} download><Download size={16}/> Original Excel</a>}</div></div>
    {manifestError && <div className="notice error"><Database size={18}/><div><strong>Data index अभी उपलब्ध नहीं</strong><br/>{manifestError}<br/><small>Source workbook: {manifest?.sourceFile ?? 'NIFTY_50_1MIN_2015_2026_panchang_updated.xlsx'}</small></div></div>}
    {manifest && <><section className="online-data-stats"><div><span>कुल records</span><strong>{manifest.totalRows.toLocaleString('en-IN')}</strong></div><div><span>Columns</span><strong>{manifest.columns.length}</strong></div><div><span>पूरे data में scan</span><strong>{globalTotal ? globalTotal.toLocaleString('en-IN') : '—'}</strong></div><div><span>Loaded chunk</span><strong>{year || '—'}</strong></div></section><section className="panel online-data-controls"><div className="section-title"><div><div className="eyebrow">EXCEL-STYLE FILTERS</div><h2>सभी records में filter लगाएँ</h2></div><span className="tag">{globalRows ? `${globalTotal.toLocaleString('en-IN')} पूरे data में मिले` : `${filtered.length.toLocaleString('en-IN')} current chunk rows`}</span></div><div className="online-filter-grid"><label>Sheet<select value={sheet} onChange={e => { setSheet(e.target.value); setPage(0); setGlobalRows(null); }}><option>NIFTY Data</option>{manifest.sheets?.filter(s => s.name !== 'NIFTY Data').map(s => <option key={s.name}>{s.name}</option>)}</select></label><label>Year / chunk<select value={year} onChange={e => { setYear(e.target.value); setColumnFilters({}); setGlobalRows(null); }}><option value="">Select period</option>{manifest.years.map(y => <option key={y.year} value={y.year}>{y.year} · {y.rows.toLocaleString('en-IN')} rows</option>)}</select></label><label>Search all columns<div className="search-field"><Search size={17}/><input value={query} onChange={e => { setQuery(e.target.value); setPage(0); setGlobalRows(null); }} placeholder="नक्षत्र, ग्रह, value…"/></div></label><label>Date / time filter<div className="search-field"><Filter size={17}/><input value={dateQuery} onChange={e => { setDateQuery(e.target.value); setPage(0); setGlobalRows(null); }} placeholder="2019-03-15 या 09:15"/></div></label></div><div className="online-column-filter-panel">{columns.map((c, i) => <label key={`${c}-${i}`}><span>{c}</span><input value={columnFilters[i] ?? ''} onChange={e => { setColumnFilters(v => ({ ...v, [i]: e.target.value })); setGlobalRows(null); setPage(0); }} placeholder="filter value…" /></label>)}</div><div className="online-global-actions"><button className="button primary" onClick={() => void scanWholeDataset()} disabled={globalLoading || sheet !== 'NIFTY Data'}><Database size={16}/>{globalLoading ? 'पूरे data को scan कर रहे हैं…' : 'पूरे 10,20,592 records में filter चलाएँ'}</button><button className="button secondary" onClick={() => { setQuery(''); setDateQuery(''); setColumnFilters({}); setGlobalRows(null); setGlobalTotal(0); setPage(0); }}>सभी filters साफ करें</button></div><p className="online-filter-help">यह button सभी 45 chunks को एक-एक करके scan करता है। पूरी file memory में नहीं आती; matching records पूरे 2015–2026 dataset से आते हैं। परिणामों में पहले 5,000 matches browser में दिखाये जाते हैं।</p></section><section className="panel online-data-table-panel"><div className="section-title"><div><h2>{sheet}</h2><p className="muted">{loading || globalLoading ? 'Data खुल/scan हो रहा है…' : `${page * pageSize + (visible.length ? 1 : 0)}–${page * pageSize + visible.length} / ${(globalRows ? globalTotal : filtered.length).toLocaleString('en-IN')} matching rows`}</p></div>{(loading || globalLoading) && <div className="spinner"/>}</div><div className="online-table-wrap"><table className="online-data-table"><thead><tr className="online-column-names"><th>#</th>{columns.map((c, i) => <th key={`${c}-${i}`}>{display(c)}</th>)}</tr><tr className="online-column-filters"><th>⌕</th>{columns.map((c, i) => <th key={`filter-${c}-${i}`}><input aria-label={`${c} filter`} value={columnFilters[i] ?? ''} onChange={e => { setColumnFilters(v => ({ ...v, [i]: e.target.value })); setGlobalRows(null); setPage(0); }} placeholder="filter…" /></th>)}</tr></thead><tbody>{visible.map((row, ri) => <tr key={`${page}-${ri}`}><td>{page * pageSize + ri + 1}</td>{columns.map((_, ci) => <td key={ci}>{display(row[ci])}</td>)}</tr>)}</tbody></table></div><div className="online-pagination"><button className="button secondary small" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Previous</button><strong>Page {page + 1} / {pageCount}</strong><button className="button secondary small" disabled={page + 1 >= pageCount} onClick={() => setPage(p => p + 1)}>Next →</button></div></section>{manifest.sheets?.filter(s => s.name !== 'NIFTY Data').map(s => <section className="panel online-sheet-note" key={s.name}><h2>{s.name}</h2><div className="online-small-table"><table><tbody>{s.rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{display(v)}</td>)}</tr>)}</tbody></table></div></section>)}</>}
  </div>;
}
