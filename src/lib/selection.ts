import type { BookRule } from './rules';
export type SelectionMode='any'|'all';
export function selectedMatches(actual:string[],selected:string[],mode:SelectionMode='any') {
 return !selected.length || (mode==='all'?selected.every(x=>actual.includes(x)):selected.some(x=>actual.includes(x)));
}
export function filterSelection(rules:BookRule[],planets:string[],commodities:string[],mode:SelectionMode='any') {
 return rules.filter(r=>selectedMatches(r.planets,planets,mode)&&selectedMatches(r.commodities,commodities,mode));
}
