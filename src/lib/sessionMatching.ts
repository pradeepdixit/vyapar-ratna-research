export const SESSION_START = 9 * 60 + 15;
export const SESSION_COUNT = 361;
export const MATCH_PLANETS = [
  ['सूर्य', 'Sun'], ['चंद्रमा', 'Moon'], ['बुध', 'Mercury'], ['गुरु', 'Jupiter'],
  ['मंगल', 'Mars'], ['शुक्र', 'Venus'], ['शनि', 'Saturn'], ['राहु', 'Rahu'], ['केतु', 'Ketu'],
] as const;
export type SessionMinute = { time: string; degrees: number[]; close: number | null; open?: number | null; high?: number | null; low?: number | null };
export type PlanetNearest = { time: string; degrees: number[]; difference: number };
export type SessionMatch = { date: string; meanDifference: number; similarity: number; planetDifferences: number[]; planetNearest: PlanetNearest[]; minutes: SessionMinute[]; historicalMinutes: SessionMinute[]; bestTargetIndex: number; minuteDifferences: number[] };
export type SessionResults = { matches: SessionMatch[]; eligibleDays: number; incompleteDays: number; excludedDays: number; scannedRows: number };
export type HistoricalChunk = { columns: string[]; rows: unknown[][] };
export type OnlineManifest = { totalRows: number; years: { path: string; rows: number; first: string; last: string }[] };
export function numberValue(v: unknown): number | null {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
}
export function circularDifference(a: number, b: number): number {
  const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d);
}
export function minuteClock(index: number): string {
  const m = SESSION_START + index;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
export function clockLabel(clock: string): string {
  const [h, m] = clock.split(':').map(Number);
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
/** Exhaustive nine-planet nearest minute for EACH target minute; no same-clock restriction. */
export function scoreDay(date: string, historicalMinutes: SessionMinute[], target: number[][]): SessionMatch {
  if (!historicalMinutes.length || target.length !== SESSION_COUNT) throw new Error('Target 361 मिनट और historical rows अनिवार्य हैं।');
  if (historicalMinutes.some(m => m.degrees.length !== 9 || m.degrees.some(v => !Number.isFinite(v)))) throw new Error('हर historical row में नौ ग्रह अनिवार्य हैं।');
  const minutes: SessionMinute[] = [];
  const minuteDifferences: number[] = [];
  let bestTargetIndex = 0;
  for (let i = 0; i < SESSION_COUNT; i++) {
    if (target[i].length !== 9 || target[i].some(v => !Number.isFinite(v))) throw new Error('Target नौ ग्रह invalid');
    let bestSum = Infinity, bestRow = historicalMinutes[0];
    for (const row of historicalMinutes) {
      let sum = 0;
      // All differences are nonnegative: pruning cannot hide a better candidate.
      for (let p = 0; p < 9; p++) { sum += circularDifference(target[i][p], row.degrees[p]); if (sum > bestSum) break; }
      if (sum < bestSum) { bestSum = sum; bestRow = row; }
    }
    minutes.push(bestRow); minuteDifferences.push(bestSum / 9);
    if (minuteDifferences[i] < minuteDifferences[bestTargetIndex]) bestTargetIndex = i;
  }
  const meanDifference = minuteDifferences[bestTargetIndex];
  const planetDifferences = target[bestTargetIndex].map((v,p) => circularDifference(v,minutes[bestTargetIndex].degrees[p]));
  // Transparent planet-wise diagnostics. Date ranking above still uses one
  // same-row match containing all nine planets; rows are never combined.
  const planetNearest = target[bestTargetIndex].map((value, p) => {
    let nearest = historicalMinutes[0];
    let difference = circularDifference(value, nearest.degrees[p]);
    for (const row of historicalMinutes.slice(1)) {
      const candidate = circularDifference(value, row.degrees[p]);
      if (candidate < difference || (candidate === difference && row.time < nearest.time)) { nearest = row; difference = candidate; }
    }
    return { time: nearest.time, degrees: nearest.degrees, difference };
  });
  return { date, meanDifference, similarity: 100 * (1 - meanDifference / 180), planetDifferences, planetNearest, minutes, historicalMinutes, bestTargetIndex, minuteDifferences };
}

export class SessionMatcher {
  private date = '';
  private minutes: SessionMinute[] = [];
  readonly result: SessionResults = { matches: [], eligibleDays: 0, incompleteDays: 0, excludedDays: 0, scannedRows: 0 };
  constructor(private targetDate: string, private target: number[][]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate) || target.length !== SESSION_COUNT || target.some(r => r.length !== 9 || r.some(v => !Number.isFinite(v)))) throw new Error('Target date/361-minute degrees invalid');
  }
  addChunk(chunk: HistoricalChunk) {
    const positions = MATCH_PLANETS.map(([, name]) => chunk.columns.indexOf(`${name}_longitude_sidereal_deg`));
    const dayPos = chunk.columns.indexOf('local_date'), timePos = chunk.columns.indexOf('local_time');
    const ohlc = ['open','high','low','close'].map(c => chunk.columns.indexOf(c));
    if (positions.some(p => p < 0) || dayPos < 0 || timePos < 0) throw new Error('File में date/time या नौ ग्रहों के आवश्यक columns नहीं हैं।');
    for (const row of chunk.rows) {
      this.result.scannedRows++;
      const date = String(row[dayPos] ?? '').slice(0,10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Historical date format invalid');
      if (date !== this.date) {
        if (this.date && date < this.date) throw new Error('Historical chunks chronological क्रम में नहीं हैं।');
        this.flush(); this.date = date; this.minutes = [];
      }
      if (date >= this.targetDate) continue;
      const clock = String(row[timePos] ?? '');
      const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(clock);
      if (!match || (match[3] && match[3] !== '00') || Number(match[1]) > 23 || Number(match[2]) > 59) continue;
      const time = clock.slice(0,5);
      const degrees = positions.map(p => numberValue(row[p]));
      if (degrees.some(v => v === null || v < 0 || v >= 360)) continue;
      this.minutes.push({ time, degrees: degrees as number[], open:numberValue(row[ohlc[0]]), high:numberValue(row[ohlc[1]]), low:numberValue(row[ohlc[2]]), close:numberValue(row[ohlc[3]]) });
    }
  }
  private flush() {
    if (!this.date) return;
    if (this.date >= this.targetDate) { this.result.excludedDays++; return; }
    if (!this.minutes.length) { this.result.incompleteDays++; return; }
    this.result.eligibleDays++;
    this.minutes.sort((a,b)=>a.time.localeCompare(b.time));
    const score = scoreDay(this.date, this.minutes, this.target);
    const best = this.result.matches;
    if (best.length === 10 && (score.meanDifference > best[9].meanDifference || (score.meanDifference === best[9].meanDifference && score.date > best[9].date))) return;
    best.push(score);
    best.sort((a,b)=>a.meanDifference-b.meanDifference || a.date.localeCompare(b.date));
    if (best.length>10) best.pop();
  }
  finish() { this.flush(); this.date=''; return this.result; }
}
