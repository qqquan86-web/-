#!/usr/bin/env python3
"""Resolve selected releases to official Apple Music 30-second previews."""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SELECTED = {
    "xia-zhiyu": ("人人都爱嘻哈乐", "cn"),
    "straight-fire-gang": ("巴士的婚礼", "us"),
    "ar-liu-fuyang": ("餐盘里的汉尼拔", "us"),
    "j-fever": ("海的引力|Breathing Blue - EP", "us"),
    "gordon": ("SOUL FOOD COMA LIVE : THE SWEET SPOT - EP", "tw"),
    "dj-didilong": ("東方美人", "tw"),
    "youngqueenz": ("龍寨 DT2", "hk"),
    "matt-force": ("LAND - EP", "hk"),
    "justhis": ("LIT", "kr"),
    "kid-milli": ("SINS", "kr"),
    "khundi-panda": ("HOWANMAMA", "kr"),
    "jvcki-wai": ("MOLLAK", "kr"),
    "kid-fresino": ("runnin shot (feat. Tiji Jojo) - Single", "jp"),
    "5lack": ("Icchola", "jp"),
    "issugi": ("Day'n'nite 2", "jp"),
    "jin-dogg": ("Pain Makes You Better", "jp"),
    "mike": ("POMPEII // UTILITY", "us"),
    "billy-woods": ("GOLLIWOG", "us"),
    "navy-blue": ("Sir Render", "us"),
    "pink-siifu": ("Onyx’!", "us"),
    "casisdead": ("Famous Last Words", "gb"),
    "knucks": ("A Fine African Man", "gb"),
    "flohio": ("8 Billion Realities - Single", "gb"),
    "kojey-radical": ("Don't Look Down", "gb"),
}

ALBUM_KEYS = {
    "navy-blue": "navy-blue-a",
}


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    here = Path(__file__).parent
    albums = json.loads((here / "albums_raw.json").read_text(encoding="utf-8"))
    output = {}

    for artist_key, (title, country) in SELECTED.items():
        lookup_key = ALBUM_KEYS.get(artist_key, artist_key)
        candidates = albums[lookup_key]["albums"]
        release = next((x for x in candidates if x.get("collectionName") == title), None)
        if not release:
            print(f"MISSING RELEASE: {artist_key} / {title}")
            continue
        collection_id = release["collectionId"]
        # The Korean/Chinese storefronts omit previewUrl for many releases, while
        # the same catalog entries expose official 30s previews on the US store.
        params = urllib.parse.urlencode(
            {"id": collection_id, "entity": "song", "limit": 200, "country": "us"}
        )
        data = fetch(f"https://itunes.apple.com/lookup?{params}")
        tracks = [
            x
            for x in data.get("results", [])
            if x.get("wrapperType") == "track" and x.get("previewUrl")
        ]
        # Avoid intros, outros and skits when choosing a representative album cut.
        skip = re.compile(r"\b(intro|outro|skit|interlude|speech)\b", re.IGNORECASE)
        substantial = [
            x
            for x in tracks
            if (x.get("trackTimeMillis") or 0) > 75_000
            and not skip.search(x.get("trackName") or "")
        ]
        pool = substantial or tracks
        pool = sorted(pool, key=lambda x: (x.get("trackNumber") or 99))
        track = pool[0] if pool else None
        if not track:
            print(f"NO PREVIEW: {artist_key} / {title}")
            continue
        output[artist_key] = {
            "project": release.get("collectionName"),
            "projectArtist": release.get("artistName"),
            "projectUrl": release.get("collectionViewUrl"),
            "releaseDate": release.get("releaseDate"),
            "trackCount": release.get("trackCount"),
            "trackName": track.get("trackName"),
            "trackTimeMillis": track.get("trackTimeMillis"),
            "previewUrl": track.get("previewUrl"),
            "trackViewUrl": track.get("trackViewUrl"),
            "artworkUrl100": track.get("artworkUrl100"),
            "artistViewUrl": track.get("artistViewUrl"),
            "country": country,
        }
        print(
            artist_key,
            "|",
            release.get("releaseDate", "")[:10],
            "|",
            title,
            "|",
            track.get("trackName"),
            "|",
            "preview ok",
        )

    path = here / "preview_data.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path} ({len(output)} previews)")


if __name__ == "__main__":
    main()
