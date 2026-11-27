import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import type { AstroSnapshot } from '../lib/astro';
import { NAKSHATRAS, RASHIS } from '../lib/astro';
import './GlobalPlanetRulesBar.css';

type Props = { snapshot: AstroSnapshot | null; onNavigate: (route: string) => void };

function countMatches(raw: string, value: string) {
  if (!value) return 0;
  const needle = value.toLowerCase();
  return raw.split(/\r?\n/).filter((line) => line.toLowerCase().includes(needle)).length;
}

function signal(raw: string, value: string) {
  if (!value) return 'गणना लंबित';
  const lines = raw.toLowerCase().split(/\r?\n/).filter((line) => line.includes(value.toLowerCase())).join(' ');
  const up = ['तेजी', 'लाभ', 'वृद्धि', 'सुख-समृद्धि', 'उत्तम'].some((x) => lines.includes(x));
  const down = ['मंदी', 'हानि', 'दुर्भिक्ष', 'रोग', 'नुकसान'].some((x) => lines.includes(x));
  return up && down ? 'मिश्रित source संकेत' : up ? 'तेजी/अनुकूल source संकेत' : down ? 'मंदी/सावधानी source संकेत' : 'source में दिशा स्पष्ट नहीं';
}

export default function GlobalPlanetRulesBar({ snapshot, onNavigate }: Props) {
  const [sunRaw, setSunRaw] = useState('');
  const [moonRaw, setMoonRaw] = useState('');
  useEffect(() => {
    Promise.all([
      fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_6.txt').then((r) => r.text()),
      fetch(import.meta.env.BASE_URL + 'research-source/pasted_content_8.txt').then((r) => r.text()),
    ]).then(([sun, moon]) => { setSunRaw(sun); setMoonRaw(moon); }).catch(() => undefined);
  }, []);
  const sun = snapshot?.planets.find((p) => p.name === 'सूर्य');
  const moon = snapshot?.planets.find((p) => p.name === 'चंद्रमा');
  const values = useMemo(() => {
    const sr = sun ? RASHIS[sun.sign] : '';
    const sn = sun ? NAKSHATRAS[sun.nakshatra] : '';
    const mr = moon ? RASHIS[moon.sign] : '';
    const mn = moon ? NAKSHATRAS[moon.nakshatra] : '';
    return {
      sun: { rashi: sr, nakshatra: sn, matches: countMatches(sunRaw, sr) + countMatches(sunRaw, sn), signal: signal(sunRaw, sr || sn) },
      moon: { rashi: mr, nakshatra: mn, matches: countMatches(moonRaw, mr) + countMatches(moonRaw, mn), signal: signal(moonRaw, mr || mn) },
    };
  }, [sun, moon, sunRaw, moonRaw]);
  return <section className="global-planet-rules-bar" aria-label="सूर्य और चन्द्र नियम context">
    <div className="global-planet-rules-heading"><div><strong>सूर्य + चन्द्र नियम context</strong><span>चुने हुए date-time के source-linked संकेत · सभी pages पर साझा</span></div><button className="global-rules-link" onClick={() => onNavigate('sun-moon-rules')}>विस्तृत संयुक्त page <ArrowUpRight size={14}/></button></div>
    {snapshot ? <div className="global-planet-rule-grid"><article className="global-planet-rule sun"><div><Sun size={17}/><strong>सूर्य</strong></div><b>{values.sun.rashi} · {values.sun.nakshatra}</b><span>{(sun!.longitude % 30).toFixed(2)}° · {values.sun.matches} source matches</span><small>{values.sun.signal}</small></article><article className="global-planet-rule moon"><div><Moon size={17}/><strong>चन्द्रमा</strong></div><b>{values.moon.rashi} · {values.moon.nakshatra}</b><span>{(moon!.longitude % 30).toFixed(2)}° · {values.moon.matches} source matches</span><small>{values.moon.signal}</small></article></div> : <div className="global-rules-pending">पहले ऊपर date-time पर गणना करें; तब ये source-linked नियम context हर page पर दिखेगा।</div>}
    <p className="global-rules-disclaimer">यह source matching है, निश्चित market prediction नहीं। युति, दृष्टि, वेध, संक्रांति, ग्रहण, वस्तु mapping और उपलब्ध गणना-शर्तें अलग से पूरी होने पर ही संबंधित नियम CHECKED होगा।</p>
  </section>;
}
