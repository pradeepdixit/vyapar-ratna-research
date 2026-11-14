import assert from 'node:assert/strict';
import { navamshaSign, navamshaLongitude, navamshaSnapshot, conjunctions } from '../src/lib/divisions';
import { selectedMatches, filterSelection } from '../src/lib/selection';
import type { AstroSnapshot } from '../src/lib/astro';
import type { BookRule } from '../src/lib/rules';
for(let sign=0;sign<12;sign++)for(let part=0;part<9;part++){
 const lon=sign*30+(part+.5)*30/9;
 const start=sign%3===0?sign:sign%3===1?(sign+8)%12:(sign+4)%12;
 assert.equal(navamshaSign(lon),(start+part)%12);
}
assert.equal(navamshaSign(30),9);assert.equal(navamshaSign(0),0);assert.equal(navamshaSign(360),0);assert.ok(navamshaLongitude(359.999)<360);
const p={name:'सूर्य',id:0,longitude:29,tropical:53,speed:1,sign:0,nakshatra:2,pada:1,retrograde:false,latitude:0};
const s:AstroSnapshot={iso:'2026-11-15T00:00:00Z',jd:0,ayanamsa:24,planets:[p,{...p,name:'बुध',id:2,longitude:31,tropical:55,sign:1,speed:-1}],ascendant:30,ascSign:1,tithi:1,paksha:'शुक्ल',yoga:'',karana:'',weekday:0,sunrise:null,sunset:null,hora:null,engine:'test'};
assert.equal(conjunctions(s,'sign').length,0);assert.equal(conjunctions(s,'orb',3).length,1);assert.equal(conjunctions(s,'orb',1).length,0);assert.equal(conjunctions(s,'orb',3)[0].motion,'बनती हुई');assert.equal(navamshaSnapshot(s).ascSign,9);
assert.ok(selectedMatches(['सूर्य'],['सूर्य','बुध'],'any'));assert.ok(!selectedMatches(['सूर्य'],['सूर्य','बुध'],'all'));assert.ok(selectedMatches([],[],'all'));
const base:BookRule={id:'1',title:'',summary:'',source_ids:[],planets:['सूर्य','बुध'],commodities:['सोना'],timeframe:'',signal:'',status:'reference',reason:'',conditions:[],section:'01'};
assert.equal(filterSelection([base],['सूर्य','बुध'],['सोना'],'all').length,1);assert.equal(filterSelection([base],['सूर्य','बुध'],['सोना','चाँदी'],'all').length,0);assert.equal(filterSelection([base],[],['सोना','चाँदी'],'any').length,1);
console.log('PASS D9 all 108 partitions, lagna, zodiac boundaries, cross-sign orb conjunction, applying motion, any/all planet and commodity selection.');
