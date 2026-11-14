import type { AstroSnapshot, Planet } from './astro';
import { angleDistance } from './rules';
export const normalize = (n:number) => ((n%360)+360)%360;
export const navamshaLongitude = (longitude:number) => normalize(normalize(longitude)*9);
export const navamshaSign = (longitude:number) => Math.floor(navamshaLongitude(longitude)/30);
export function navamshaSnapshot(s:AstroSnapshot):AstroSnapshot {
 const ascendant=navamshaLongitude(s.ascendant);
 return {...s,ascendant,ascSign:Math.floor(ascendant/30),planets:s.planets.map(p=>({...p,longitude:navamshaLongitude(p.longitude),sign:navamshaSign(p.longitude)}))};
}
export type Conjunction = { a:Planet; b:Planet; angle:number; sameSign:boolean; motion:'बनती हुई'|'अलग होती हुई'|'लगभग सटीक'|'स्थिर'; };
export function conjunctions(s:AstroSnapshot,mode:'sign'|'orb'='sign',orb=3,outer=false):Conjunction[]{
 if(!Number.isFinite(orb)||orb<0||orb>30)throw new RangeError('Orb 0–30° होना चाहिए।');
 const planets=outer?s.planets:s.planets.slice(0,9),result:Conjunction[]=[];
 for(let i=0;i<planets.length;i++)for(let j=i+1;j<planets.length;j++){
  const a=planets[i],b=planets[j],angle=angleDistance(a.longitude,b.longitude),sameSign=a.sign===b.sign;
  if(mode==='sign'?!sameSign:angle>orb)continue;
  const later=angleDistance(normalize(a.longitude+a.speed/1440),normalize(b.longitude+b.speed/1440));
  const motion=angle<1/60?'लगभग सटीक':Math.abs(later-angle)<1e-9?'स्थिर':later<angle?'बनती हुई':'अलग होती हुई';
  result.push({a,b,angle,sameSign,motion});
 }
 return result.sort((a,b)=>a.angle-b.angle);
}
