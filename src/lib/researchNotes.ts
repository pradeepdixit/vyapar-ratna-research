export type DailyResearchRule = {
  id: string;
  date: string;
  title: string;
  planets: string[];
  commodities: string[];
  timeframe: string;
  prediction: string;
  observation: string;
  source: string;
  createdAt: string;
};

const STORAGE_KEY = 'vr-daily-research-rules-v1';

export function readDailyResearch(): DailyResearchRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter(isDailyResearchRule) : [];
  } catch {
    return [];
  }
}

export function saveDailyResearch(rules: DailyResearchRule[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function isDailyResearchRule(value: unknown): value is DailyResearchRule {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<DailyResearchRule>;
  return typeof r.id === 'string' && typeof r.date === 'string' && typeof r.title === 'string' &&
    Array.isArray(r.planets) && Array.isArray(r.commodities) && typeof r.timeframe === 'string' &&
    typeof r.prediction === 'string' && typeof r.observation === 'string' && typeof r.source === 'string';
}

export function splitResearchTags(value: string) {
  return [...new Set(value.split(/[,،\n]/).map(x => x.trim()).filter(Boolean))];
}
