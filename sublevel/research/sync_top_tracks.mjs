import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(HERE, '..', 'data.js');
const TOP_PATH = path.join(HERE, '..', 'top-tracks.js');
const dataBox = { window: {} };
vm.runInNewContext(fs.readFileSync(DATA_PATH, 'utf8'), dataBox, { filename: DATA_PATH });
const data = dataBox.window.SUBLEVEL;

let previous = {};
try {
  const topBox = { window: {} };
  vm.runInNewContext(fs.readFileSync(TOP_PATH, 'utf8'), topBox, { filename: TOP_PATH });
  previous = topBox.window.SUBLEVEL_TOP_TRACKS || {};
} catch (error) {
  console.warn('No previous top-tracks.js; rebuilding from Apple only.');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value) => String(value || '')
  .normalize('NFKC')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

async function getJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'sublevel-top-tracks/2.0' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function numericId(url) {
  const match = String(url || '').match(/\/(\d+)(?:\?|$)/);
  return match ? match[1] : null;
}

async function searchTracks(artistId, term, country) {
  const payload = await getJson(`https://itunes.apple.com/search?${new URLSearchParams({
    term, entity: 'song', limit: '200', country
  })}`);
  return (payload.results || []).filter((track) => (
    track.previewUrl && artistId && String(track.artistId) === String(artistId)
  ));
}

async function lookupTracks(artistId, country) {
  const payload = await getJson(`https://itunes.apple.com/lookup?${new URLSearchParams({
    id: artistId, entity: 'song', limit: '200', country
  })}`);
  return (payload.results || []).filter((track) => track.wrapperType === 'track' && track.previewUrl);
}

function toTrack(track) {
  return {
    title: track.trackName,
    album: track.collectionName,
    year: (track.releaseDate || '').slice(0, 4),
    durationMs: track.trackTimeMillis || 0,
    previewUrl: track.previewUrl,
    artwork: track.artworkUrl100,
    appleUrl: track.trackViewUrl,
    artistName: track.artistName
  };
}

const output = {};
for (const artist of data.artists) {
  const artistId = numericId(artist.artistAppleUrl);
  const terms = [...new Set([artist.name.en, artist.name.zh, artist.name.ko, artist.name.ja].filter(Boolean))];
  const pool = [];
  if (artistId) {
    for (const term of terms) {
      try {
        pool.push(...await searchTracks(artistId, term, 'us'));
      } catch (error) {
        console.warn('search failed', artist.id, term, error.message);
      }
      await sleep(220);
    }
    if (pool.length < 10) {
      try {
        pool.push(...await lookupTracks(artistId, 'us'));
      } catch (error) {
        console.warn('lookup failed', artist.id, error.message);
      }
    }
  }

  const seen = new Set();
  const tracks = [];
  for (const track of pool) {
    const key = normalize(track.trackName);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    tracks.push(toTrack(track));
    if (tracks.length === 10) break;
  }

  // Preserve manually curated platform-only rows (e.g. NetEase songs with no Apple preview).
  const previousTracks = previous[artist.id] || [];
  const existingExternal = previousTracks.filter((track) => !track.previewUrl && track.externalUrl);
  for (const track of [...existingExternal, ...previousTracks]) {
    const key = normalize(track.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    tracks.push(track);
    if (tracks.length === 10) break;
  }

  output[artist.id] = tracks.slice(0, 10);
  console.log(`${artist.id}: ${output[artist.id].length} tracks (${output[artist.id].filter((t) => t.previewUrl).length} Apple)`);
}

fs.writeFileSync(TOP_PATH, `/* Auto-generated platform top tracks with Apple Music 30-second previews. */\nwindow.SUBLEVEL_TOP_TRACKS = ${JSON.stringify(output, null, 2)};\n`, 'utf8');
console.log(`Wrote ${TOP_PATH}`);
