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
} catch {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value) => String(value || '')
  .normalize('NFKC')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();
const cleanTitle = (value) => normalize(value)
  .replace(/\s*\(feat[^)]*\)/g, '')
  .replace(/\s*\[feat[^\]]*\]/g, '')
  .replace(/\s*-\s*(single|ep)$/g, '')
  .replace(/\s+/g, ' ')
  .trim();

async function getJson(url, attempt = 0) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
      'Referer': 'https://music.163.com/',
      'Accept': 'application/json'
    },
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) throw new Error(String(response.status));
  const payload = await response.json();
  if (payload.code === 406 && attempt < 2) {
    await sleep(15000);
    return getJson(url, attempt + 1);
  }
  return payload;
}

const output = {};
for (const artist of data.artists) {
  const oldTracks = previous[artist.id] || [];
  const previewIndex = new Map();
  const baseIndex = new Map();
  for (const track of oldTracks) {
    if (!track.previewUrl) continue;
    previewIndex.set(normalize(track.title), track);
    const base = cleanTitle(track.title);
    if (base && !baseIndex.has(base)) baseIndex.set(base, track);
  }

  const songs = [];
  if (artist.neteaseId) {
    try {
      const payload = await getJson(`https://music.163.com/api/artist/top/song?id=${encodeURIComponent(artist.neteaseId)}`);
      for (const song of payload.songs || []) {
        const title = song.name;
        let matched = previewIndex.get(normalize(title)) || baseIndex.get(cleanTitle(title)) || null;
        songs.push({
          title,
          album: song.al?.name || "",
          year: matched?.year || "2026",
          durationMs: song.dt || matched?.durationMs || 0,
          previewUrl: matched?.previewUrl || null,
          artwork: matched?.artwork || null,
          appleUrl: matched?.appleUrl || null,
          externalUrl: `https://music.163.com/song?id=${song.id}`,
          source: "netease",
          neteaseId: String(song.id),
          neteasePop: Number(song.pop) || 0,
          artistName: (song.ar || []).map((a) => a.name).join(", ")
        });
      }
    } catch (error) {
      console.warn('netease failed', artist.id, error.message);
    }
  }

  songs.sort((a, b) => (b.neteasePop || 0) - (a.neteasePop || 0));
  const chosen = songs.slice(0, 10);
  const seen = new Set(chosen.map((t) => normalize(t.title)));
  for (const track of oldTracks) {
    if (chosen.length >= 10) break;
    const key = normalize(track.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    chosen.push(track);
  }
  output[artist.id] = chosen;
  console.log(artist.id, 'netease', songs.length, 'chosen', chosen.length, 'previews', chosen.filter((t) => t.previewUrl).length);
  await sleep(650);
}

fs.writeFileSync(TOP_PATH, `/* Auto-generated NetEase popularity top tracks, with Apple Music 30-second previews where available. */\nwindow.SUBLEVEL_TOP_TRACKS = ${JSON.stringify(output, null, 2)};\n`, 'utf8');
console.log('Wrote', TOP_PATH);
