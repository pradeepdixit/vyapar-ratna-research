import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import SwissEPH from 'sweph-wasm';
import wasmFactory from 'sweph-wasm/wasm/swisseph';
import { calculateAstro } from '../src/lib/astro';
import { SessionMatcher, MATCH_PLANETS, SESSION_COUNT, minuteClock, scoreDay, circularDifference, numberValue, type HistoricalChunk, type OnlineManifest } from '../src/lib/sessionMatching';
assert.equal(circularDifference(359, 1), 2);
assert.equal(numberValue(''), null);
assert.equal(numberValue(null), null);
assert.equal(minuteClock(0), '09:15'); assert.equal(minuteClock(360), '15:15');
const columns = ['local_date', 'local_time', 'close', ...MATCH_PLANETS.map(([,n]) => `${n}_longitude_sidereal_deg`)];
const target = Array.from({length:SESSION_COUNT}, (_, i) => MATCH_PLANETS.map((_, p) => p * 30));
const rows = (date: string, gap: number) => target.map((deg, i) => [date, minuteClock(i), 100, ...deg.map(d => (d + gap) % 360)]);
const m = new SessionMatcher('2020-01-20', target);
const r = rows('2020-01-01', 5);
m.addChunk({ columns, rows:r.slice(0,180) });m.addChunk({columns,rows:r.slice(180)});
m.addChunk({columns,rows:rows('2020-01-02',1)});
m.addChunk({columns,rows:rows('2020-01-03',0).slice(1)});
const missing = rows('2020-01-04',0); for (const row of missing) row[3] = '';m.addChunk({columns,rows:missing});
m.addChunk({columns,rows:rows('2020-01-20',0)});
const result=m.finish();assert.equal(result.matches[0].date,'2020-01-03'); assert.equal(result.matches[0].meanDifference,0);assert.equal(result.eligibleDays,3);assert.equal(result.incompleteDays,1);assert.equal(result.excludedDays,1);
const manyStrict=new SessionMatcher('2021-01-01',target);
for(let d=1;d<=15;d++)manyStrict.addChunk({columns,rows:rows(`2020-02-${String(d).padStart(2,'0')}`,0)});
const top=manyStrict.finish();assert.equal(top.matches.length,10);assert.equal(new Set(top.matches.map(x=>x.date)).size,10);assert.equal(top.matches[0].date,'2020-02-01');
const identity=scoreDay('2020-01-01',target.map((degrees,i)=>({time:minuteClock(i),degrees,close:null})),target);assert.equal(identity.meanDifference,0);assert.equal(identity.similarity,100);
const anyTime=new SessionMatcher('2020-01-20',target);anyTime.addChunk({columns,rows:[['2020-01-01','14:45:00',100,...target[0]]]});const unrestricted=anyTime.finish();assert.equal(unrestricted.matches[0].minutes[0].time,'14:45');assert.equal(unrestricted.matches[0].meanDifference,0);assert.equal(unrestricted.matches[0].minutes.length,361);console.log('PASS unit: 361 targets/all-nine identity, ANY historical time, wraparound, missing value exclusion, chunk carry, cutoff, 10 unique ascending dates');

if(process.argv.includes('--full')){
 const engine=async()=>{
  const mod=await wasmFactory({wasmBinary:new Uint8Array(await readFile('public/swisseph.wasm'))});
  const swe=new SwissEPH(mod);mod.FS.mkdir('/ephe');
  for(const f of ['sepl_18.se1','semo_18.se1'])mod.FS.createDataFile('/ephe',f,await readFile(`public/ephe/${f}`),true,true,true);
  const path='/ephe\0';const pointer=mod._malloc(path.length);mod.stringToUTF8(path,pointer,path.length);mod._swe_set_ephe_path(pointer);mod._free(pointer);return swe;
 };
 (globalThis as typeof globalThis & {__ASTRO_SWISS_ENGINE__?:()=>Promise<SwissEPH>}).__ASTRO_SWISS_ENGINE__=engine;
 const date=process.env.MATCH_DATE || '2026-11-21';const degrees:number[][]=[];
 for(let i=0;i<361;i++){
  const instant=new Date(`${date}T09:15:00+05:30`).getTime()+i*60000;
  const s=await calculateAstro(new Date(instant),19.0728,72.8826,'Asia/Kolkata');
  degrees.push(MATCH_PLANETS.map(([n])=>s.planets.find(p=>p.name===n)!.longitude));
 }
 const manifest:OnlineManifest=JSON.parse(await readFile('public/online-data/manifest.json','utf8'));
 const actual=new SessionMatcher(date,degrees);
 for(const part of manifest.years){if(part.first.slice(0,10)>=date)break;
  const chunk:HistoricalChunk=JSON.parse(gunzipSync(await readFile('public/'+part.path)).toString('utf8'));actual.addChunk(chunk);
  console.log(part.path,actual.result.scannedRows,'rows');
 }
 const actualResult=actual.finish();assert.equal(actualResult.matches.length,10);
 assert.equal(new Set(actualResult.matches.map(m=>m.date)).size,10);
 for(let i=0;i<10;i++){
  const a=actualResult.matches[i];assert(a.date<date);assert.equal(a.minutes.length,361);
  if(i)assert(actualResult.matches[i-1].meanDifference<=a.meanDifference);
 }
 const report={date,window:'09:15–15:15 IST targets; any historical time',rule:'Moon degree is the primary anchor; dates with best lunar difference above 1° are rejected; nakshatra-pada then nine-planet mean are tie-breakers',moonMaxDifference:1,scannedRows:actualResult.scannedRows,eligibleDays:actualResult.eligibleDays,incompleteDays:actualResult.incompleteDays,excludedDays:actualResult.excludedDays,moonRejectedDays:actualResult.moonRejectedDays,top10:actualResult.matches.map(m=>({date:m.date,moonDifference:m.moonDifference,meanDifference:m.meanDifference,similarity:m.similarity,planetDifferences:m.planetDifferences,targetTime:minuteClock(m.bestTargetIndex),historicalTime:m.minutes[m.bestTargetIndex].time})),firstMinuteTarget:degrees[0],lastMinuteTarget:degrees[360]};
 await writeFile(`research/any-time-match-${date}.json`,JSON.stringify(report,null,2)+'\n');
 console.log('REAL FULL-DATA RESULT',JSON.stringify(report));
}
