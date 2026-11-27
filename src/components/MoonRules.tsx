import { useEffect, useMemo, useState } from 'react';
import { Download, Moon, Search, Sparkles } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import { NAKSHATRAS, RASHIS } from '../lib/astro';
import './MoonRules.css';

type Line = { no: number; text: string };
type Stock = { rank: number; company: string; symbol: string; relation: string; group: string };
type Props = { snapshot: AstroSnapshot | null };

const groupTitles: Record<string, string> = {
  '1': 'प्रत्यक्ष खनन, धातु और पेट्रोलियम',
  '2': 'धातु, खनिज, रत्न एवं आभूषण',
  '3': 'नमक, खाद्य पदार्थ, जल, रस, शहद एवं वनस्पति',
  '4': 'वस्त्र, होटल, तैयार भोजन, शराब एवं प्लास्टिक',
};

function parseStocks(raw: string): Stock[] {
  let group = '1';
  return raw.split(/\r?\n/).flatMap((line) => {
    const heading = line.match(/^## \*\*(\d+)\./);
    if (heading) { group = heading[1]; return []; }
    const match = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/);
    return match ? [{ rank: Number(match[1]), company: match[2].trim(), symbol: match[3].trim(), relation: match[4].trim(), group: groupTitles[group] || group }] : [];
  });
}

function parseLines(raw: string): Line[] {
  return raw.split(/\r?\n/).map((text, i) => ({ no: i + 1, text: text.trim() })).filter((x) => x.text.length > 0);
}

export default function MoonRules({ snapshot }: Props) {
  const [rulesRaw, setRulesRaw] = useState('');
  const [stocksRaw, setStocksRaw] = useState('');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [minRank, setMinRank] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const [showRules, setShowRules] = useState(false);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_8.txt').then((r) => r.text()).then(setRulesRaw);
    fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_7.txt').then((r) => r.text()).then(setStocksRaw);
  }, []);
  const moon = snapshot?.planets.find((p) => p.name === 'चंद्रमा');
  const rashi = moon ? RASHIS[moon.sign] : '';
  const nakshatra = moon ? NAKSHATRAS[moon.nakshatra] : '';
  const stocks = useMemo(() => parseStocks(stocksRaw), [stocksRaw]);
  const rules = useMemo(() => parseLines(rulesRaw), [rulesRaw]);
  const q = query.trim().toLowerCase();
  const from = Number(minRank) || 1;
  const to = Number(maxRank) || Number.MAX_SAFE_INTEGER;
  const filteredStocks = stocks.filter((stock) => stock.rank >= from && stock.rank <= to && (group === 'all' || stock.group === group) && (!q || `${stock.company} ${stock.symbol} ${stock.relation} ${stock.group}`.toLowerCase().includes(q)));
  const activeRules = useMemo(() => {
    if (!rashi && !nakshatra) return [];
    return rules.filter((line) => { const t = line.text.toLowerCase(); return (rashi && t.includes(rashi.toLowerCase())) || (nakshatra && t.includes(nakshatra.toLowerCase())); }).slice(0, 24);
  }, [rules, rashi, nakshatra]);
  const horoscope = useMemo(() => {
    const text = activeRules.map((x) => x.text).join(' ');
    const up = ['तेजी', 'लाभ', 'सुख-समृद्धि', 'उत्तम', 'वृद्धि'].filter((x) => text.includes(x));
    const down = ['मंदी', 'हानि', 'दुर्भिक्ष', 'रोग', 'नुकसान'].filter((x) => text.includes(x));
    return { direction: up.length && down.length ? 'मिश्रित' : up.length ? 'तेजी / अनुकूल' : down.length ? 'मंदी / सावधानी' : 'दिशा source में स्पष्ट नहीं', up, down };
  }, [activeRules]);
  const download = (file: string) => { const a = document.createElement('a'); a.href = import.meta.env.BASE_URL + `research-source/${file}`; a.download = file; a.click(); };
  return <section className="panel moon-rules-panel">
    <div className="page-heading moon-heading"><div><div className="eyebrow"><Moon size={14}/> SOURCE P7 + P8 · चन्द्र नियम एवं stock mapping</div><h2>चन्द्रमा के नियम और NSE F&O stock ranking</h2><p>चन्द्रमा की चुनी हुई तिथि-समय की स्थिति को supplied चन्द्र नियमों से मिलाया जाता है। stocks की ranking attachment में दी गयी व्यवसायिक mapping है; यह live price prediction नहीं है।</p></div><div className="button-row"><button className="button secondary" onClick={() => download('pasted_content_8.txt')}><Download size={16}/> नियम text</button><button className="button secondary" onClick={() => download('pasted_content_7.txt')}><Download size={16}/> stock source</button></div></div>
    <div className="moon-summary"><strong>{rules.length || '…'}</strong><span>चन्द्र source lines</span><strong>{stocks.length || '…'}</strong><span>ranked stocks</span><strong>{activeRules.length}</strong><span>वर्तमान चन्द्र match</span></div>
    {snapshot ? <div className="moon-horoscope"><div className="moon-horoscope-title"><Sparkles size={19}/><div><strong>चुनी तिथि-समय का चन्द्र राशिफल</strong><small>{snapshot.iso}</small></div><span className={`moon-direction ${horoscope.direction.includes('तेजी') ? 'up' : horoscope.direction.includes('मंदी') ? 'down' : 'mixed'}`}>{horoscope.direction}</span></div><p><b>स्थिति:</b> चन्द्रमा {rashi} · {nakshatra} · {(moon!.longitude % 30).toFixed(2)}°। यह summary matching source lines पर आधारित है।</p><div className="moon-facts"><div><b>तेजी/अनुकूल शब्द</b><span>{horoscope.up.length ? horoscope.up.join(' · ') : 'स्पष्ट नहीं'}</span></div><div><b>मंदी/सावधानी शब्द</b><span>{horoscope.down.length ? horoscope.down.join(' · ') : 'स्पष्ट नहीं'}</span></div></div><div className="moon-active-lines">{activeRules.map((line) => <div key={line.no}><span>{line.text}</span><small>line {line.no}</small></div>)}</div><small>युति, दृष्टि, नक्षत्र-वेध, गति, संक्रांति/ग्रहण जैसी अतिरिक्त शर्तें अलग से जाँचनी होंगी। केवल text match को CHECKED नहीं माना गया है।</small></div> : <div className="notice warning">ऊपर date-time पर गणना करें; तब चन्द्र राशि, नक्षत्र और source-linked राशिफल दिखेगा।</div>}

    <section className="moon-logic-card"><h3>चन्द्र-द्रव्य stock ranking कैसे काम करती है?</h3><ol><li>Attachment 7 में दिए प्रत्येक stock का symbol, business और चन्द्रमा से सम्बन्ध पढ़ा जाता है।</li><li>प्रत्यक्ष खनन/उत्पादन को सबसे मजबूत सम्बन्ध, industrial processing को अगला, मुख्य raw material उपयोग को मध्यम और केवल बिक्री/distribution को कम सम्बन्ध माना जाता है—यही supplied ranking का research logic है।</li><li>एक से अधिक चन्द्र-द्रव्य और direct production वाले stocks ऊपर रहते हैं; यह source rank है, forecast return या buy/sell score नहीं।</li><li>चुने समय का चन्द्र राशिफल अलग दिखता है। उसे stock mapping के साथ पढ़कर researcher देख सकता है कि कौन-से ranked businesses पर source commodities लागू हो सकती हैं।</li><li>OHLC, volume, technical indicators या बाहरी market data इस ranking में नहीं मिलाए जाते। पर्याप्त astrological condition न मिले तो “source mapping only” ही दिखेगा।</li></ol><p><b>महत्वपूर्ण:</b> NSE F&O सूची और company-business mapping attachment में supplied research के अनुसार रखी गयी है; बदलती exchange list या corporate ownership को स्वतः सत्यापित नहीं माना गया है।</p></section>

    <div className="moon-stock-controls"><label className="moon-search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Company, symbol, चाँदी, पेट्रोलियम…"/></label><label><span>Group</span><select value={group} onChange={(e) => setGroup(e.target.value)}><option value="all">सभी groups</option>{Object.values(groupTitles).map((name) => <option value={name} key={name}>{name}</option>)}</select></label><label><span>Rank से</span><input type="number" min="1" value={minRank} onChange={(e) => setMinRank(e.target.value)} placeholder="1"/></label><label><span>Rank तक</span><input type="number" min="1" value={maxRank} onChange={(e) => setMaxRank(e.target.value)} placeholder="40"/></label></div>
    <div className="moon-result-count">{filteredStocks.length} stocks दिख रहे हैं · source ranking के क्रम में</div>
    <div className="moon-stock-table-wrap"><table className="moon-stock-table"><thead><tr><th>Rank</th><th>Company</th><th>NSE code</th><th>चन्द्र-द्रव्य / business relation</th><th>Research group</th></tr></thead><tbody>{filteredStocks.map((stock) => <tr key={stock.symbol}><td><strong>#{stock.rank}</strong></td><td><strong>{stock.company}</strong></td><td><span className="moon-symbol">{stock.symbol}</span></td><td>{stock.relation}</td><td>{stock.group}</td></tr>)}</tbody></table></div>
    <button className="button secondary moon-rules-toggle" onClick={() => setShowRules(!showRules)}>{showRules ? 'चन्द्र source lines छिपाएँ' : 'पूरी चन्द्र source सामग्री देखें'}</button>
    {showRules && <div className="moon-source-lines">{rules.map((line) => <div className={(rashi && line.text.includes(rashi)) || (nakshatra && line.text.includes(nakshatra)) ? 'active' : ''} key={line.no}><span>{line.text}</span><small>line {line.no}</small></div>)}</div>}
    <p className="note moon-note">Sources: pasted_content_7.txt और pasted_content_8.txt · research ranking, निश्चित निवेश सलाह नहीं।</p>
  </section>;
}
