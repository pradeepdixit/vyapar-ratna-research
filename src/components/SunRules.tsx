import { useEffect, useMemo, useState } from 'react';
import { Download, Search, Sun } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import { NAKSHATRAS, RASHIS } from '../lib/astro';
import './SunRules.css';

type Line = { no: number; text: string; bullet: boolean };
type Section = { id: string; title: string; lines: Line[] };

type Props = { snapshot: AstroSnapshot | null };

function parseSections(raw: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { id: 'intro', title: 'स्रोत और भूमिका', lines: [] };
  for (const [index, rawLine] of raw.split(/\r?\n/).entries()) {
    const text = rawLine.trim();
    if (!text) continue;
    const heading = text.match(/^(\d+)\.\s+(.*)$/) || text.match(/^\*\*(\d+)[.)]\s*(.*?)\*\*$/);
    if (heading) {
      if (current.lines.length || current.id !== 'intro') sections.push(current);
      current = { id: heading[1], title: (heading[2] || '').replace(/\*\*/g, '').trim(), lines: [] };
    } else {
      current.lines.push({ no: index + 1, text, bullet: /^[-*]\s/.test(text) });
    }
  }
  if (current.lines.length) sections.push(current);
  return sections;
}

export default function SunRules({ snapshot }: Props) {
  const [raw, setRaw] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string[]>(['1', '2', '5', '6', '9', '10']);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_6.txt').then((r) => r.text()).then(setRaw).catch(() => setRaw('स्रोत फाइल लोड नहीं हो सकी।'));
  }, []);
  const sections = useMemo(() => parseSections(raw), [raw]);
  const sun = snapshot?.planets.find((p) => p.name === 'सूर्य');
  const rashi = sun ? RASHIS[sun.sign] : '';
  const nakshatra = sun ? NAKSHATRAS[sun.nakshatra] : '';
  const q = query.trim().toLowerCase();
  const activeLines = useMemo(() => {
    if (!rashi && !nakshatra) return [];
    return sections.flatMap((section) => section.lines.filter((line) => {
      const text = line.text.toLowerCase();
      return text.includes(rashi.toLowerCase()) || text.includes(nakshatra.toLowerCase());
    }).map((line) => ({ ...line, section: section.title })));
  }, [sections, rashi, nakshatra]);
  const visible = sections.filter((section) => !q || `${section.title} ${section.lines.map((x) => x.text).join(' ')}`.toLowerCase().includes(q));
  const toggle = (id: string) => setOpen((x) => x.includes(id) ? x.filter((v) => v !== id) : [...x, id]);
  const download = () => { const a = document.createElement('a'); a.href = import.meta.env.BASE_URL + 'research-source/pasted_content_6.txt'; a.download = 'pasted_content_6-surya-rules.txt'; a.click(); };
  return <section className="panel sun-rules-panel">
    <div className="page-heading sun-rules-heading"><div><div className="eyebrow"><Sun size={14} /> SOURCE P6 · सूर्य आधारित नियम</div><h2>सूर्य से सम्बन्धित सभी योग एवं नियम</h2><p>Attachment के सभी 410 source lines सुरक्षित हैं। नीचे के प्रभाव पुस्तक के लिखे अनुसार हैं; इन्हें निश्चित market prediction नहीं माना जाता।</p></div><button className="button secondary" onClick={download}><Download size={16}/> मूल text डाउनलोड</button></div>
    <div className="sun-rules-summary"><strong>{raw ? raw.split(/\r?\n/).filter(Boolean).length : '…'}</strong><span>source lines</span><strong>{sections.length}</strong><span>मुख्य sections</span><strong>{activeLines.length}</strong><span>वर्तमान सूर्य से match</span></div>
    <div className="sun-rules-controls"><label className="sun-rule-search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="सूर्य, मेष, सोना, संक्रांति, ग्रहण, तेजी…" /></label><button className="button secondary small" onClick={() => setOpen(visible.map((x) => x.id))}>सभी खोलें</button><button className="button secondary small" onClick={() => setOpen([])}>सभी बंद करें</button></div>
    {snapshot ? <div className="sun-active-card"><div><strong>चुना समय:</strong> सूर्य {rashi} · {nakshatra} · {(sun!.longitude % 30).toFixed(2)}°</div><p>नीचे matching lines को पीले रंग में highlight किया गया है। यह केवल text/source match है; लागू होने से पहले युति, दृष्टि, वेध, संक्रांति और देश-काल की शर्तें भी देखनी होंगी।</p>{activeLines.slice(0, 18).map((line) => <div className="sun-active-line" key={`active-${line.no}`}><b>{line.section}</b><span>{line.text}</span><small>line {line.no}</small></div>)}{activeLines.length > 18 && <small>+ {activeLines.length - 18} और matching source lines नीचे sections में हैं।</small>}</div> : <div className="notice warning">पहले ऊपर date-time पर गणना करें; फिर सूर्य की राशि और नक्षत्र के अनुसार matching प्रभाव दिखेंगे।</div>}
    <div className="sun-sections">{visible.map((section) => { const isOpen = open.includes(section.id); return <article className={`sun-section ${isOpen ? 'is-open' : ''}`} key={section.id}><button className="sun-section-toggle" onClick={() => toggle(section.id)} aria-expanded={isOpen}><span>{section.id === 'intro' ? 'भूमिका' : `भाग ${section.id}`}</span><strong>{section.title}</strong><em>{section.lines.length} lines</em></button>{isOpen && <div className="sun-section-body">{section.lines.map((line) => { const active = Boolean((rashi && line.text.toLowerCase().includes(rashi.toLowerCase())) || (nakshatra && line.text.toLowerCase().includes(nakshatra.toLowerCase()))); return <div className={`sun-source-line ${active ? 'active' : ''}`} key={line.no}><span className={line.bullet ? 'bullet' : ''}>{line.text}</span><small>line {line.no}</small></div>; })}</div>}</article>; })}</div>
    <p className="note sun-source-note">Source: pasted_content_6.txt · सभी मूल बिंदु और चेतावनियाँ source lines के साथ रखी गई हैं।</p>
  </section>;
}
