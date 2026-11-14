import type { BookRule } from './rules';
export type SelectionMode='any'|'all';
export function selectedMatches(actual:string[],selected:string[],mode:SelectionMode='any') {
 return !selected.length || (mode==='all'?selected.every(x=>actual.includes(x)):selected.some(x=>actual.includes(x)));
}
export function filterSelection(rules:BookRule[],planets:string[],commodities:string[],mode:SelectionMode='any') {
 return rules.filter(r=>selectedMatches(r.planets,planets,mode)&&selectedMatches(r.commodities,commodities,mode));
}
/** User-facing market aliases; these are tags already present in the supplied book, not live price data. */
export function marketCommodityTags(value:string):string[] {
 const q=value.trim().toLowerCase();
 if (!q) return [];
 if (q==='nifty' || q==='nifty 50' || q==='banknifty' || q==='sensex' || q.includes('index')) return ['शेयर','साधारण शेयर','कंपनियों के शेयर','बैंक शेयर','सामान्य बाजार','सभी व्यापारिक वस्तुएँ','सभी व्यापारिक पदार्थ'];
 if (q.includes('gold') || q.includes('सोना')) return ['सोना'];
 if (q.includes('silver') || q.includes('चाँदी') || q.includes('चांदी')) return ['चाँदी'];
 if (q.includes('cotton') || q.includes('रुई') || q.includes('कपास')) return ['रुई'];
 return [value.trim()];
}
export function marketMatches(actual:string[],query:string) {
 const tags=marketCommodityTags(query);
 return !tags.length || actual.some(x=>tags.includes(x));
}
