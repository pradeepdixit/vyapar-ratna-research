import { SessionMatcher, type OnlineManifest, type HistoricalChunk } from './sessionMatching';
const ctx = self as unknown as { onmessage: ((e: MessageEvent) => void) | null; postMessage: (value: unknown) => void };
ctx.onmessage = async ({ data }: MessageEvent<{ base: string; date: string; target: number[][] }>) => {
  try {
    const r = await fetch(`${data.base}online-data/manifest.json`);
    if (!r.ok) throw new Error(`Manifest: HTTP ${r.status}`);
    const manifest: OnlineManifest = await r.json();
    const matcher = new SessionMatcher(data.date, data.target);
    for (let i = 0; i < manifest.years.length; i++) {
      const part = manifest.years[i];
      // Later quarters cannot contain earlier target-day history.
      if (part.first.slice(0, 10) >= data.date) break;
      ctx.postMessage({ type: 'progress', text: `${i + 1}/${manifest.years.length} · ${part.path} लोड हो रहा है` });
      const response = await fetch(`${data.base}${part.path}`);
      if (!response.ok || !response.body) throw new Error(`Data chunk HTTP ${response.status}`);
      // Some servers send Content-Encoding: gzip, so fetch has already decoded
      // the body. GitHub Pages can instead serve the raw gzip file. Inspect the
      // actual bytes rather than decompressing an already-decoded JSON response.
      const bytes = new Uint8Array(await response.arrayBuffer());
      let chunk: HistoricalChunk;
      if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
        if (typeof DecompressionStream === 'undefined') throw new Error('इस browser में gzip support नहीं है।');
        chunk = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
      } else {
        chunk = JSON.parse(new TextDecoder().decode(bytes));
      }
      matcher.addChunk(chunk);
      ctx.postMessage({ type: 'progress', text: `${matcher.result.scannedRows.toLocaleString('en-IN')} rows · ${matcher.result.eligibleDays} तारीखों पर any-time मिलान` });
    }
    ctx.postMessage({ type: 'complete', result: matcher.finish() });
  } catch (error) {
    ctx.postMessage({ type: 'error', text: error instanceof Error ? error.message : String(error) });
  }
};
