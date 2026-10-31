#!/usr/bin/env python3
"""Resolve the expanded UDG roster's recent releases and official previews."""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ARTISTS = {
    "babybako": (6815259433, "Smoke/Music", "us"),
    "shoujo-band": (1872990204, "地下少女樂隊Mixtape1", "tw"),
    "kisso-cotty": (1743154999, "Melted Summer Dream", "us"),
    "vovo-weng": (1463761737, "VOVO WENG", "us"),
    "chilloud": (1503274785, "헤븐스타", "kr"),
    "yeil": (1690436799, "heart pop", "kr"),
    "0siggy": (1625823326, "UNDERGROUND", "kr"),
    "molly-yam": (1761391705, "TIKTOKSTA Ⅱ", "us"),
    "skiboyvv": (1615067300, "BOYS2", "us"),
    "dark9community": (1727440811, "D9 Ⅱ", "cn"),
    "billionhappy": (1528136004, "潮", "cn"),
    "trickyzb": (1751440130, "马丁的早晨", "cn"),
    "hebei-wumengda": (1726902029, "我像一个傻瓜", "cn"),
    "devstacks": (1543581587, "Soul", "us"),
}


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/3.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    output = {}
    for key, (artist_id, title, country) in ARTISTS.items():
        params = urllib.parse.urlencode(
            {"id": artist_id, "entity": "album", "limit": 200, "country": country}
        )
        data = fetch(f"https://itunes.apple.com/lookup?{params}")
        artist = next((x for x in data.get("results", []) if x.get("wrapperType") == "artist"), {})
        albums = [
            x for x in data.get("results", [])
            if x.get("wrapperType") == "collection"
            and x.get("collectionType") == "Album"
            and title in (x.get("collectionName") or "")
        ]
        albums.sort(key=lambda x: x.get("releaseDate", ""), reverse=True)
        if not albums:
            print(f"MISSING RELEASE: {key} / {title}")
            continue

        release = None
        track = None
        for candidate in albums:
            params = urllib.parse.urlencode(
                {"id": candidate["collectionId"], "entity": "song", "limit": 200, "country": "us"}
            )
            tracks_data = fetch(f"https://itunes.apple.com/lookup?{params}")
            tracks = [
                x for x in tracks_data.get("results", [])
                if x.get("wrapperType") == "track" and x.get("previewUrl")
            ]
            skip = re.compile(r"\b(intro|outro|skit|interlude|speech)\b", re.IGNORECASE)
            substantial = [
                x for x in tracks
                if (x.get("trackTimeMillis") or 0) > 60_000
                and not skip.search(x.get("trackName") or "")
            ]
            pool = sorted(substantial or tracks, key=lambda x: (x.get("trackNumber") or 99))
            if pool:
                release = candidate
                track = pool[0]
                break

        if not release or not track:
            print(f"NO PREVIEW: {key} / {title}")
            continue
        output[key] = {
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
            "artistViewUrl": artist.get("artistLinkUrl"),
        }
        print(
            key,
            "|",
            release.get("releaseDate", "")[:10],
            "|",
            release.get("collectionName"),
            "|",
            track.get("trackName"),
            "| preview ok",
        )
    path = Path(__file__).parent / "expanded_previews.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path} ({len(output)} previews)")


if __name__ == "__main__":
    main()
