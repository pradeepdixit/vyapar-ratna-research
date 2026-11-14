import * as XLSX from 'xlsx';
import type { AstroSnapshot } from './astro';
import type { BookRule } from './rules';
export type ExportRow = Record<string,string|number|boolean>;
export function downloadBlob(content:BlobPart,name:string,type='text/plain;charset=utf-8') { const u=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000); }
function csvCell(v:unknown) {let text=String(v??'');if(/^[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
export function exportRows(rows:ExportRow[], name:string, format:'csv'|'xlsx') {
 if(!rows.length)return;
 if(format==='csv'){const cols=[...new Set(rows.flatMap(Object.keys))];downloadBlob('\ufeff'+[cols.map(csvCell).join(','),...rows.map(r=>cols.map(k=>csvCell(r[k])).join(','))].join('\r\n'),name+'.csv','text/csv;charset=utf-8');return;}
 const wb=XLSX.utils.book_new();const chunk=100000;
 for(let i=0;i<rows.length;i+=chunk)XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows.slice(i,i+chunk)),`Data ${Math.floor(i/chunk)+1}`);
 XLSX.writeFile(wb,name+'.xlsx');
}
export function ruleRows(rules:BookRule[]):ExportRow[]{return rules.map(r=>({ID:r.id,नियम:r.title,अर्थ:r.summary,ग्रह:r.planets.join(' • '),पदार्थ:r.commodities.join(' • '),अवधि:r.timeframe,संकेत:r.signal,स्थिति:r.status,स्रोत:r.source_ids.join(', '),सीमा:r.reason}));}
export function snapshotRow(s:AstroSnapshot,active:BookRule[]):ExportRow{
 const row:ExportRow={UTC:s.iso,JulianDay:s.jd,अयनांश:s.ayanamsa,लग्न:s.ascendant,तिथि:s.tithi,पक्ष:s.paksha,योग:s.yoga,करण:s.karana,सूर्योदय:s.sunrise??'',सूर्यास्त:s.sunset??'',होरा:s.hora?.planet??'',होरा_आरंभ:s.hora?.start??'',होरा_अंत:s.hora?.end??'',RuleIDs:active.map(r=>r.id).join(' | ')};
 s.planets.forEach(p=>{row[`${p.name}_निरयन`]=p.longitude;row[`${p.name}_सायन`]=p.tropical;row[`${p.name}_गति`]=p.speed;row[`${p.name}_राशि_क्रम`]=p.sign+1;row[`${p.name}_नक्षत्र_क्रम`]=p.nakshatra+1;row[`${p.name}_चरण`]=p.pada;row[`${p.name}_वक्री`]=p.retrograde;});return row;
}
