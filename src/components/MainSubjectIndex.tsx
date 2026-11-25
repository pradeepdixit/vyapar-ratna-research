import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, Download, Search } from 'lucide-react';
import './MainSubjectIndex.css';

type Item = { title: string; sourceLine: number; kind: string };
type Section = { id: string; section: string; chapter: string; title: string; pages: string; sourceLine: number; items: Item[] };
type IndexData = { source: string; title: string; description: string; sourceLineCount: number; sectionCount: number; chapterCount: number; subjectCount: number; sections: Section[]; otherImportantParts: Item[] };

type Props = { onNavigate?: (route: string) => void };
const PAGE_NAMES: Record<string, string> = { '': 'शोध डैशबोर्ड', library: 'नियम संग्रह', source: 'मूल पुस्तक', sbc: 'सर्वतोभद्र वेध', 'book-rules': 'पुस्तक नियम विस्तार', analysis: 'समय-सीमा विश्लेषण', intraday: 'Intraday ग्रह अध्ययन', movement: 'ग्रह गति / Angle Movement', panchang: 'विस्तृत पंचांग', chart: 'D1 / D9 और युति', nifty50: 'NIFTY 50 शोध', 'my-stocks': 'My Stock Selection List', daily: 'दैनिक शोध / नये नियम', prediction: 'Nearest 10 historical dates', 'online-data': 'NIFTY minute data', archive: 'Research archive', review: 'समीक्षा और कवरेज' };
const CHAPTER_LINKS: Record<string, string[]> = { S01: ['library', 'source'], S02: ['sbc', 'book-rules'], S03: ['analysis', 'intraday', 'movement'], S04: ['panchang', 'analysis'], S05: ['panchang', 'analysis'], S06: ['movement', 'analysis'], S07: ['library', 'my-stocks', 'nifty50'], S08: ['daily'], S09: ['nifty50', 'my-stocks', 'daily'], S10: ['chart', 'movement'], S11: ['book-rules', 'nifty50'], S12: ['chart', 'movement'], S13: ['chart', 'panchang'], S14: ['movement', 'chart'], S15: ['sbc', 'book-rules'], S16: ['sbc', 'panchang', 'book-rules'] };

export default function MainSubjectIndex({ onNavigate }: Props) {
  const [data, setData] = useState<IndexData | null>(null);
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [open, setOpen] = useState<string[]>(['S01', 'S02']);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'research-source/pasted-content-5-subject-index.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.sections.filter((s) => {
      if (sectionFilter !== 'all' && s.section !== sectionFilter) return false;
      if (!q) return true;
      return `${s.section} ${s.chapter} ${s.title} ${s.pages} ${s.items.map((i) => i.title).join(' ')}`.toLowerCase().includes(q);
    });
  }, [data, q, sectionFilter]);

  if (!data) return <div className="loading-panel"><div className="spinner" /><h2>मुख्य विषय-सूची खुल रही है…</h2><p>सभी खण्ड और प्रकरण तैयार किए जा रहे हैं।</p></div>;

  const toggle = (id: string) => setOpen((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  const expandAll = () => setOpen(filtered.map((s) => s.id));
  const collapseAll = () => setOpen([]);
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = href; a.download = 'vyapar-ratna-main-subject-index.json'; a.click(); URL.revokeObjectURL(href);
  };
  const sectionNames = [...new Set(data.sections.map((s) => s.section))];

  return <>
    <div className="page-heading main-index-heading">
      <div><div className="eyebrow"><BookOpen size={14} /> MASTER SUBJECT INDEX · SOURCE P5</div><h1>मुख्य विषय-सूची</h1><p>{data.description} आगे के नियम, calculations और data extraction इसी index के section/chapter reference से जोड़े जाएंगे।</p></div>
      <div className="button-row"><button className="button secondary" onClick={download}><Download size={16} /> JSON index डाउनलोड</button><a className="button secondary" href={import.meta.env.BASE_URL + 'research-source/pasted_content_5.txt'} download><BookOpen size={16} /> मूल विषय-सूची</a></div>
    </div>

    <section className="panel main-index-summary"><div className="main-index-stat"><strong>{data.sectionCount}</strong><span>मुख्य खण्ड</span></div><div className="main-index-stat"><strong>{data.chapterCount}</strong><span>प्रकरण / परिशिष्ट</span></div><div className="main-index-stat"><strong>{data.subjectCount}</strong><span>विषय entries</span></div><div className="main-index-stat"><strong>{data.sourceLineCount}</strong><span>मूल source lines</span></div></section>

    <section className="panel main-index-controls"><div className="section-title"><div><h2>सभी पाठ खोजें</h2><p className="note">हर entry के साथ original pasted_content_5.txt की source line दी गई है।</p></div><span className="tag">{filtered.length} chapters shown</span></div><label className="book-rule-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="सर्वतोभद्र, ग्रहण, शेयर, दृष्टि, संक्रान्ति…" /></label><div className="main-index-filter-row"><select aria-label="खण्ड चुनें" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}><option value="all">सभी खण्ड</option>{sectionNames.map((s) => <option key={s} value={s}>{s}</option>)}</select><button className="button secondary small" onClick={expandAll}>सभी खोलें</button><button className="button secondary small" onClick={collapseAll}>सभी बंद करें</button></div></section>

    <section className="panel main-index-quicklinks"><div className="section-title"><h2>सभी pages यहीं से खोलें</h2><span className="tag">{Object.keys(PAGE_NAMES).length} pages</span></div><div className="main-index-links">{Object.entries(PAGE_NAMES).map(([r, name]) => <a key={r} href={'#' + r}>{name}</a>)}</div></section>

    <section className="main-index-list">{filtered.map((section) => { const isOpen = open.includes(section.id); return <article className={`panel main-index-chapter ${isOpen ? 'is-open' : ''}`} key={section.id}><button className="main-index-chapter-toggle" onClick={() => toggle(section.id)} aria-expanded={isOpen}><span className="main-index-chapter-number">{section.id}</span><span className="main-index-chapter-copy"><small>{section.section} · {section.chapter}</small><strong>{section.title}</strong><em>{section.pages} · source line {section.sourceLine}</em></span><ChevronDown size={20} /></button>{isOpen && <div className="main-index-items"><div className="main-index-links"><span>संबंधित page (केवल navigation):</span>{(CHAPTER_LINKS[section.id] || []).map((r) => <a key={r} href={'#' + r}>{PAGE_NAMES[r]}</a>)}</div>{section.items.length ? section.items.map((item, i) => <div className="main-index-item" key={`${section.id}-${item.sourceLine}-${i}`}><span>{i + 1}</span><p>{item.title}</p><small>line {item.sourceLine}</small></div>) : <div className="main-index-item empty-item"><span>—</span><p>इस प्रकरण के विषय उसी मूल source line में संयुक्त रूप से लिखे हैं। मूल पाठ डाउनलोड करके पूरा विवरण देखें।</p><small>source-preserved</small></div>}</div>}</article>; })}</section>

    {data.otherImportantParts.length > 0 && <section className="panel other-index-parts"><div className="section-title"><h2>अन्य महत्वपूर्ण भाग</h2><span className="tag">source lines 258–260</span></div>{data.otherImportantParts.map((item) => <div className="main-index-item" key={item.sourceLine}><span>•</span><p>{item.title}</p><small>line {item.sourceLine}</small></div>)}</section>}
    <div className="notice warning"><BookOpen size={17} /><div><strong>Implementation note:</strong> यह page supplied विषय-सूची का master index है। किसी विषय को computable rule बनाने से पहले उसके मूल पाठ, सारिणी, condition और उपलब्ध source evidence को अलग से CHECKED / PARTIAL / REFERENCE status दिया जाएगा।{onNavigate && <button className="text-button" onClick={() => onNavigate('book-rules')}>पुस्तक नियम विस्तार खोलें →</button>}</div></div>
  </>;
}
