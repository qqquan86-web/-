import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(HERE, '..', 'data.js');
const REPORT_PATH = path.join(HERE, 'catalog_sync_report.json');
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
const source = fs.readFileSync(DATA_PATH, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: DATA_PATH });
const data = sandbox.window.SUBLEVEL;
const artists = data.artists.map((artist) => ({ ...artist }));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value) => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(18000) });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}
function numericId(url) {
  const match = String(url || '').match(/\/(\d+)(?:\?|$)/);
  return match ? Number(match[1]) : null;
}

const report = [];
for (const artist of artists) {
  const artistId = numericId(artist.artistAppleUrl);
  if (!artistId) continue;
  const aliases = [artist.name.en, artist.name.zh, artist.name.ko, artist.name.ja].filter(Boolean).map(normalize);
  try {
    const payload = await getJson(`https://itunes.apple.com/lookup?${new URLSearchParams({ id: artistId, entity: 'album', limit: '200', country: 'us' })}`);
    const albums = (payload.results || [])
      .filter((item) => item.wrapperType === 'collection' && item.collectionType === 'Album')
      .filter((item) => (item.releaseDate || '').slice(0, 10) <= TODAY)
      .filter((item) => {
        const name = normalize(item.artistName);
        return aliases.some((alias) => name === alias || name.startsWith(`${alias} `) || name.startsWith(`${alias},`) || name.startsWith(`${alias} &`));
      })
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
    let chosen = null;
    for (const album of albums) {
      try {
        const tracksData = await getJson(`https://itunes.apple.com/lookup?${new URLSearchParams({ id: album.collectionId, entity: 'song', limit: '100', country: 'us' })}`);
        const tracks = (tracksData.results || []).filter((t) => t.wrapperType === 'track' && t.previewUrl);
        if (!tracks.length) continue;
        const track = tracks[0];
        chosen = {
          title: (album.collectionName || '').replace(/ - Single$/, '').replace(/ - EP$/, ''),
          type: album.trackCount <= 2 ? 'single' : (String(album.collectionName).includes('EP') && album.trackCount <= 6 ? 'ep' : 'album'),
          date: (album.releaseDate || '').slice(0, 10),
          tracks: album.trackCount,
          appleUrl: album.collectionViewUrl,
          preview: { title: track.trackName, durationMs: track.trackTimeMillis || 0, url: track.previewUrl, artwork: track.artworkUrl100, appleUrl: track.trackViewUrl }
        };
        break;
      } catch (error) {
        console.warn('track lookup failed', artist.id, error.message);
      }
    }
    if (chosen && chosen.date !== artist.project.date) {
      const oldDate = artist.project.date;
      console.log(`${artist.id}: ${oldDate} -> ${chosen.date} / ${chosen.title}`);
      artist.project = chosen;
      report.push({ id: artist.id, from: oldDate, to: chosen.date, title: chosen.title });
    }
  } catch (error) {
    console.warn('album lookup failed', artist.id, error.message);
  }
  await sleep(140);
}

const start = source.indexOf('  const ARTISTS = [');
const end = source.indexOf('  window.SUBLEVEL = {');
if (start < 0 || end < 0) throw new Error('Could not locate ARTISTS');
let next = source.slice(0, start) + `  const ARTISTS = ${JSON.stringify(artists, null, 2)};\n\n` + source.slice(end);
next = next.replace(/updated: "\d{4}-\d{2}-\d{2}"/, `updated: "${TODAY}"`);
fs.writeFileSync(DATA_PATH, next, 'utf8');
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
console.log(`updated ${report.length} projects; wrote ${REPORT_PATH}`);
