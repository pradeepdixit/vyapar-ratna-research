import type { AstroSnapshot } from './astro';

export type SourceBlock = { id: string; type: string; page: string; text: string; section: string };
export type Condition = { type: string; planet?: string; other?: string; values?: number[]; value?: number | boolean; orb?: number; min?: number; max?: number };
export type BookRule = { id: string; title: string; summary: string; source_ids: string[]; planets: string[]; commodities: string[]; timeframe: string; signal: string; status: 'computable'|'reference'|'missing'; reason: string; conditions: Condition[]; section: string };
export type Section = { id: string; title: string; summary: string; gaps: string[]; rule_count: number; block_count: number };
export type BookData = { rules: BookRule[]; blocks: SourceBlock[]; sections: Section[]; commodities: string[]; planets: string[]; review: { title: string; overview: string; limitations: string[] }; stats: { totalBlocks: number; tables: number; rules: number; computable: number; missing: number; reviewedSections: number; totalSections: number; sourceCharacters: number } };
export const normalize = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[\s़ँं.,;:।\-]/g, '');
export function queryText(query: string) {
  const q = normalize(query);
  const aliases: Record<string,string> = {gold:'सोना',silver:'चाँदी',cotton:'रुई',sun:'सूर्य',moon:'चंद्रमा',mars:'मंगल',mercury:'बुध',jupiter:'गुरु',venus:'शुक्र',saturn:'शनि',rahu:'राहु',ketu:'केतु',स्वर्ण:'सोना',सुवर्ण:'सोना',चन्द्र:'चंद्रमा',चंद्र:'चंद्रमा',चन्द्रमा:'चंद्रमा',कपास:'रुई',बृहस्पति:'गुरु',सूरज:'सूर्य'};
  return normalize(aliases[q] || query);
}
export function searchRules(rules: BookRule[], query: string, blocks: Map<string,SourceBlock>) {
  const q = queryText(query);
  if (!q) return rules;
  return rules.filter(r => normalize([r.id,r.title,r.summary,r.reason,...r.planets,...r.commodities,...r.source_ids.map(id=>blocks.get(id)?.text || '')].join(' ')).includes(q));
}
export function angleDistance(a: number, b: number) { const d = ((a-b)%360+360)%360; return Math.min(d,360-d); }
export function conditionMatches(c: Condition, s: AstroSnapshot): boolean {
  const p = s.planets.find(x=>x.name===c.planet), o=s.planets.find(x=>x.name===c.other);
  const has = (v:number) => Array.isArray(c.values) && c.values.includes(v);
  switch(c.type) {
    case 'weekday': return Boolean(has(s.weekday));
    case 'tithi': return Boolean(has(s.tithi));
    case 'sign': return Boolean(p && has(p.sign));
    case 'nakshatra': return Boolean(p && has(p.nakshatra));
    case 'pada': return Boolean(p && has(p.pada));
    case 'retrograde': return Boolean(p && typeof c.value==='boolean' && p.retrograde===c.value);
    case 'same_sign': return Boolean(p && o && p.sign===o.sign);
    case 'relative_sign': return Boolean(p && o && has((p.sign-o.sign+12)%12+1));
    case 'angle': return Boolean(p && o && typeof c.value==='number' && typeof c.orb==='number' && Math.abs(angleDistance(p.tropical,o.tropical)-c.value)<=c.orb);
    case 'longitude_range': return Boolean(p && typeof c.min==='number' && typeof c.max==='number' && p.longitude>=c.min && p.longitude<c.max);
    default: return false;
  }
}
export function matchesRule(r:BookRule,s:AstroSnapshot) { return r.status==='computable' && r.conditions.length>0 && r.conditions.every(c=>conditionMatches(c,s)); }
export function matchingRules(rules:BookRule[],s:AstroSnapshot,commodity='') {
  return rules.filter(r=>matchesRule(r,s) && (!commodity || r.commodities.includes(commodity)));
}
export const statusLabel = {computable:'स्वचालित शर्त-जाँच',reference:'पठन / व्याख्या आवश्यक',missing:'स्रोत / सारणी आवश्यक'};
export function sourcePages(r:BookRule, blocks:Map<string,SourceBlock>) {
  return [...new Set(r.source_ids.map(id=>blocks.get(id)?.page).filter(x=>x && x!=='अज्ञात'))].join(', ') || 'पृष्ठ अस्पष्ट';
}
