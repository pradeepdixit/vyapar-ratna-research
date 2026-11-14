import { DateTime } from 'luxon';
export type RangeOptions={from:string;to:string;startTime:string;endTime:string;mode:'continuous'|'daily';interval:number;zone:string};
export function makeTimes(o:RangeOptions,max=20000):Date[]{
 if(![1,5,15,30].includes(o.interval))throw new Error('अंतराल 1, 5, 15 या 30 मिनट रखें।');
 const a=DateTime.fromISO(o.from,{zone:o.zone}),b=DateTime.fromISO(o.to,{zone:o.zone});
 if(!a.isValid||!b.isValid)throw new Error('तारीख या IANA timezone सही नहीं है।');
 if(a.year<1800||b.year>2399||a.year>2399||b.year<1800)throw new Error('समर्थित वर्ष 1800 से 2399 हैं।');
 if(b.toMillis()<a.toMillis())throw new Error('अंतिम तारीख/समय शुरुआती समय के बाद रखें।');
 const times:Date[]=[];const push=(d:DateTime)=>{times.push(d.toJSDate());if(times.length>max)throw new Error(`एक गणना में अधिकतम ${max.toLocaleString('en-IN')} samples। range छोटी करें या interval बढ़ाएँ।`);};
 if(o.mode==='continuous'){for(let d=a;d.toMillis()<=b.toMillis();d=d.plus({minutes:o.interval}))push(d);}
 else {if(!/^\d{2}:\d{2}$/.test(o.startTime)||!/^\d{2}:\d{2}$/.test(o.endTime))throw new Error('दिन का start/end time सही भरें।');for(let day=a.startOf('day');day.toMillis()<=b.startOf('day').toMillis();day=day.plus({days:1})){let start=DateTime.fromISO(day.toISODate()+'T'+o.startTime,{zone:o.zone});const end=DateTime.fromISO(day.toISODate()+'T'+o.endTime,{zone:o.zone});if(!start.isValid||!end.isValid||end<start)throw new Error('रोज का अंतिम समय शुरुआती समय से पहले नहीं हो सकता।');for(;start<=end;start=start.plus({minutes:o.interval}))push(start);}}
 if(!times.length)throw new Error('इस सीमा में कोई sample नहीं है।');return times;
}
