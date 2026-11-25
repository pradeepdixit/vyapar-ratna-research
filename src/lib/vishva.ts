import type { AstroSnapshot } from './astro';
import { NAKSHATRAS, RASHIS } from './astro';

export type VishvaFactor = {
  name: 'वर्ण'|'स्वर'|'तिथि'|'नक्षत्र'|'राशि';
  value: string;
  pada: number|null;
  status: 'CALCULATED'|'SOURCE LIMIT';
  source: string;
};

export type VishvaReport = {
  panya: string;
  factors: VishvaFactor[];
  calculatedCount: number;
  scoreStatus: 'PARTIAL';
  note: string;
};

const VOWELS = new Set(['अ','आ','इ','ई','उ','ऊ','ऋ','ॠ','ऌ','ॡ','ए','ऐ','ओ','औ']);
const DEVANAGARI_START: Record<string,string> = {
  N:'न', I:'इ', F:'फ', T:'ट', Y:'य',
};
function firstDevanagari(value: string): string {
  const cleaned=value.trim();
  if (!cleaned) return '';
  const first=cleaned[0].toUpperCase();
  return DEVANAGARI_START[first] || cleaned[0];
}

/**
 * Book P00098–P00104 requires five independent inputs before Vishva is
 * scored: varna, svara, tithi, nakshatra and rashi. This function calculates
 * those inputs from the selected panya name and the exact AstroSnapshot.
 * It deliberately does not invent the missing vedha-pada/drishti-pada match.
 */
export function calculateVishvaFiveLevels(snapshot: AstroSnapshot, panya='NIFTY'): VishvaReport {
  const moon=snapshot.planets.find(p=>p.name==='चंद्रमा');
  const letter=firstDevanagari(panya) || '—';
  const tithi=snapshot.tithi;
  const tithiLabel=tithi>15?`कृष्ण ${tithi-15}`:`शुक्ल ${tithi}`;
  const nakshatra=moon ? `${NAKSHATRAS[moon.nakshatra]} · पाद ${moon.pada}` : 'उपलब्ध नहीं';
  const rashi=moon ? RASHIS[moon.sign] : 'उपलब्ध नहीं';
  const factors: VishvaFactor[]=[
    {name:'वर्ण',value:letter,pada:null,status:letter==='—'?'SOURCE LIMIT':'CALCULATED',source:'DOCX-T0014/T0015 · पण्य के प्रथम वर्ण से'},
    {name:'स्वर',value:VOWELS.has(letter)?`${letter} · स्वर`:`${letter} · व्यंजन`,pada:null,status:letter==='—'?'SOURCE LIMIT':'CALCULATED',source:'DOCX-T0014/T0015 · वर्ण-सारणी'},
    {name:'तिथि',value:tithiLabel,pada:null,status:Number.isFinite(tithi)?'CALCULATED':'SOURCE LIMIT',source:'AstroSnapshot tithi · P00099–P00100'},
    {name:'नक्षत्र',value:nakshatra,pada:moon?.pada??null,status:moon?'CALCULATED':'SOURCE LIMIT',source:'Lahiri Moon longitude · P00100'},
    {name:'राशि',value:rashi,pada:null,status:moon?'CALCULATED':'SOURCE LIMIT',source:'Lahiri Moon sign · P00099–P00100'},
  ];
  return {panya:panya||'NIFTY',factors,calculatedCount:factors.filter(f=>f.status==='CALCULATED').length,scoreStatus:'PARTIAL',note:'पाँचों input values calculate हैं। पूर्ण विश्वा score के लिए प्रत्येक factor का वेध-पाद और राशि पर दृष्टि-पाद T0025/T0026 के अनुसार मिलना अभी आवश्यक है।'};
}
