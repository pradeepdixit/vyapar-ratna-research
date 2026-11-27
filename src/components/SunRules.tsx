import { useEffect, useMemo, useState } from 'react';
import { Download, Search, Sun, Sparkles } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import { NAKSHATRAS, RASHIS } from '../lib/astro';
import './SunRules.css';

type Line = { no: number; text: string; bullet: boolean };
type Section = { id: string; title: string; lines: Line[] };
type StatusFilter = 'all' | 'active' | 'reference';
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
    } else current.lines.push({ no: index + 1, text, bullet: /^[-*]\s/.test(text) });
  }
  if (current.lines.length) sections.push(current);
  return sections;
}

function isReference(text: string) {
  return /अनुपलब्ध|उपलब्ध नहीं|नहीं दिया|केवल उल्लेख|reference|partial|अभी अलग|गणना नहीं/i.test(text);
}

export default function SunRules({ snapshot }: Props) {
  const [raw, setRaw] = useState('');
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [sourceFrom, setSourceFrom] = useState('');
  const [sourceTo, setSourceTo] = useState('');
  const [open, setOpen] = useState<string[]>(['1', '2', '5', '6', '9', '10']);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_6.txt')
      .then((r) => r.text()).then(setRaw).catch(() => setRaw('स्रोत फाइल लोड नहीं हो सकी।'));
  }, []);

  const sections = useMemo(() => parseSections(raw), [raw]);
  const sun = snapshot?.planets.find((p) => p.name === 'सूर्य');
  const rashi = sun ? RASHIS[sun.sign] : '';
  const nakshatra = sun ? NAKSHATRAS[sun.nakshatra] : '';
  const isCurrentMatch = (line: Line) => {
    if (!rashi && !nakshatra) return false;
    const text = line.text.toLowerCase();
    return Boolean((rashi && text.includes(rashi.toLowerCase())) || (nakshatra && text.includes(nakshatra.toLowerCase())));
  };
  const activeLines = useMemo(() => sections.flatMap((section) => section.lines.filter(isCurrentMatch).map((line) => ({ ...line, section: section.title }))), [sections, rashi, nakshatra]);
  const queryLower = query.trim().toLowerCase();
  const from = Number(sourceFrom) || 0;
  const to = Number(sourceTo) || Number.MAX_SAFE_INTEGER;
  const matchesLine = (line: Line) => {
    const text = line.text.toLowerCase();
    const queryMatch = !queryLower || text.includes(queryLower);
    const statusMatch = statusFilter === 'all' || (statusFilter === 'reference' ? isReference(line.text) : !isReference(line.text));
    const activeMatch = !activeOnly || isCurrentMatch(line);
    return queryMatch && statusMatch && activeMatch && line.no >= from && line.no <= to;
  };
  const visible = sections.map((section) => ({ ...section, lines: section.lines.filter(matchesLine) })).filter((section) => sectionFilter === 'all' || section.id === sectionFilter).filter((section) => section.lines.length > 0 || (!queryLower && sectionFilter === section.id));
  const filteredCount = visible.reduce((total, section) => total + section.lines.length, 0);
  const toggle = (id: string) => setOpen((x) => x.includes(id) ? x.filter((v) => v !== id) : [...x, id]);
  const download = () => { const a = document.createElement('a'); a.href = import.meta.env.BASE_URL + 'research-source/pasted_content_6.txt'; a.download = 'pasted_content_6-surya-rules.txt'; a.click(); };

  const horoscope = useMemo(() => {
    const texts = activeLines.map((line) => line.text).join(' ');
    const fast = ['तेजी', 'लाभ', 'शुभ', 'वृद्धि', 'प्राप्ति'].filter((word) => texts.includes(word));
    const slow = ['मंदी', 'हानि', 'अशुभ', 'दुर्भिक्ष', 'नुकसान'].filter((word) => texts.includes(word));
    const neutral = ['समान', 'स्थिर', 'मिश्रित'].filter((word) => texts.includes(word));
    const direction = fast.length && slow.length ? 'मिश्रित' : fast.length ? 'तेजी / अनुकूल' : slow.length ? 'मंदी / सावधानी' : neutral.length ? 'स्थिर / समान' : 'दिशा source lines में स्पष्ट नहीं';
    return { direction, fast, slow, neutral };
  }, [activeLines]);

  return <section className="panel sun-rules-panel">
    <div className="page-heading sun-rules-heading"><div><div className="eyebrow"><Sun size={14} /> SOURCE P6 · सूर्य आधारित नियम</div><h2>सूर्य से सम्बन्धित सभी योग एवं नियम</h2><p>Attachment के सभी 410 source lines सुरक्षित हैं। नीचे का राशिफल केवल चुनी हुई सूर्य-स्थिति से मिले source text का सार है; कोई नया या काल्पनिक नियम नहीं जोड़ा गया है।</p></div><button className="button secondary" onClick={download}><Download size={16}/> मूल text डाउनलोड</button></div>
    <div className="sun-rules-summary"><strong>{raw ? raw.split(/\r?\n/).filter(Boolean).length : '…'}</strong><span>source lines</span><strong>{sections.length}</strong><span>मुख्य sections</span><strong>{activeLines.length}</strong><span>वर्तमान सूर्य से match</span></div>

    <div className="sun-rules-controls">
      <label className="sun-rule-search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="सूर्य, मेष, सोना, संक्रांति, ग्रहण, तेजी…" /></label>
      <label className="sun-filter-field"><span>Section</span><select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}><option value="all">सभी sections</option>{sections.map((section) => <option value={section.id} key={section.id}>{section.id === 'intro' ? 'भूमिका' : `भाग ${section.id}`} · {section.title}</option>)}</select></label>
      <label className="sun-filter-field"><span>Status</span><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="all">सभी source lines</option><option value="active">गणना योग्य/वर्णनात्मक</option><option value="reference">REFERENCE / unavailable</option></select></label>
      <label className="sun-filter-field"><span>Line से</span><input type="number" min="1" value={sourceFrom} onChange={(e) => setSourceFrom(e.target.value)} placeholder="1" /></label>
      <label className="sun-filter-field"><span>Line तक</span><input type="number" min="1" value={sourceTo} onChange={(e) => setSourceTo(e.target.value)} placeholder="410" /></label>
      <label className="sun-check-filter"><input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} /> केवल वर्तमान सूर्य से matching</label>
      <button className="button secondary small" onClick={() => setOpen(visible.map((x) => x.id))}>सभी खोलें</button><button className="button secondary small" onClick={() => setOpen([])}>सभी बंद करें</button>
    </div>
    <div className="sun-filter-result">{filteredCount} source lines दिखाई जा रही हैं · query, section, status और line-range filters लागू</div>

    {snapshot ? <>
      <div className="sun-horoscope-card"><div className="sun-horoscope-title"><Sparkles size={19}/><div><strong>चुनी तिथि-समय का सूर्य राशिफल</strong><small>{snapshot.iso}</small></div><span className={`sun-direction ${horoscope.direction.includes('तेजी') ? 'up' : horoscope.direction.includes('मंदी') ? 'down' : 'mixed'}`}>{horoscope.direction}</span></div><p><b>स्थिति:</b> सूर्य {rashi} · {nakshatra} · {(sun!.longitude % 30).toFixed(2)}°। इस राशिफल में केवल वे source lines शामिल हैं जिनमें वर्तमान सूर्य की राशि या नक्षत्र का नाम मिला है।</p><div className="sun-horoscope-facts"><div><b>अनुकूल/तेजी शब्द</b><span>{horoscope.fast.length ? horoscope.fast.join(' · ') : 'स्पष्ट नहीं'}</span></div><div><b>सावधानी/मंदी शब्द</b><span>{horoscope.slow.length ? horoscope.slow.join(' · ') : 'स्पष्ट नहीं'}</span></div><div><b>स्थिर/समान शब्द</b><span>{horoscope.neutral.length ? horoscope.neutral.join(' · ') : 'स्पष्ट नहीं'}</span></div></div><small>यह source-derived राशिफल है, निश्चित भविष्यवाणी नहीं। युति, दृष्टि, संक्रांति, ग्रहण, वस्तु-स्वामी और अन्य शर्तें अलग से पूरी होने पर ही संबंधित नियम को CHECKED माना जाएगा।</small></div>
      <div className="sun-active-card"><div><strong>चुना समय:</strong> सूर्य {rashi} · {nakshatra} · {(sun!.longitude % 30).toFixed(2)}°</div><p>नीचे matching lines को पीले रंग में highlight किया गया है। यह केवल text/source match है; लागू होने से पहले युति, दृष्टि, वेध, संक्रांति और देश-काल की शर्तें भी देखनी होंगी।</p>{activeLines.slice(0, 18).map((line) => <div className="sun-active-line" key={`active-${line.no}`}><b>{line.section}</b><span>{line.text}</span><small>line {line.no}</small></div>)}{activeLines.length > 18 && <small>+ {activeLines.length - 18} और matching source lines नीचे sections में हैं।</small>}</div>
    </> : <div className="notice warning">पहले ऊपर date-time पर गणना करें; फिर सूर्य की राशि और नक्षत्र के अनुसार राशिफल और matching प्रभाव दिखेंगे।</div>}

    <div className="sun-sections">{visible.map((section) => { const isOpen = open.includes(section.id); return <article className={`sun-section ${isOpen ? 'is-open' : ''}`} key={section.id}><button className="sun-section-toggle" onClick={() => toggle(section.id)} aria-expanded={isOpen}><span>{section.id === 'intro' ? 'भूमिका' : `भाग ${section.id}`}</span><strong>{section.title}</strong><em>{section.lines.length} lines</em></button>{isOpen && <div className="sun-section-body">{section.lines.map((line) => <div className={`sun-source-line ${isCurrentMatch(line) ? 'active' : ''}`} key={line.no}><span className={line.bullet ? 'bullet' : ''}>{line.text}</span><small>line {line.no}</small></div>)}</div>}</article>; })}</div>
    <p className="note sun-source-note">Source: pasted_content_6.txt · सभी मूल बिंदु और चेतावनियाँ source lines के साथ रखी गई हैं।</p>
  </section>;
}
