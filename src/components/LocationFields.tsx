export type Location = {name:string;lat:number;lon:number;zone:string};
export const LOCATIONS:Location[]=[{name:'Mumbai',lat:19.076,lon:72.8777,zone:'Asia/Kolkata'},{name:'Delhi',lat:28.6139,lon:77.209,zone:'Asia/Kolkata'},{name:'Jaipur',lat:26.9124,lon:75.7873,zone:'Asia/Kolkata'},{name:'Ahmedabad',lat:23.0225,lon:72.5714,zone:'Asia/Kolkata'},{name:'Kolkata',lat:22.5726,lon:88.3639,zone:'Asia/Kolkata'},{name:'London',lat:51.5074,lon:-0.1278,zone:'Europe/London'},{name:'New York',lat:40.7128,lon:-74.006,zone:'America/New_York'}];
export default function LocationFields({location,onChange}:{location:Location;onChange:(v:Location)=>void}) {
 return <div className="location-fields">
  <label>स्थान<select value={LOCATIONS.some(l=>l.name===location.name)?location.name:'Custom'} onChange={e=>{const l=LOCATIONS.find(x=>x.name===e.target.value);onChange(l||{...location,name:'Custom'});}}>{LOCATIONS.map(l=><option key={l.name}>{l.name}</option>)}<option>Custom</option></select></label>
  <label>Timezone<input aria-label="IANA timezone" value={location.zone} onChange={e=>onChange({...location,zone:e.target.value})}/></label>
  {location.name==='Custom'&&<>
   <label>Latitude<input type="number" min="-90" max="90" step="0.0001" value={location.lat} onChange={e=>onChange({...location,lat:Number(e.target.value)})}/></label>
   <label>Longitude<input type="number" min="-180" max="180" step="0.0001" value={location.lon} onChange={e=>onChange({...location,lon:Number(e.target.value)})}/></label>
  </>}
 </div>;
}
