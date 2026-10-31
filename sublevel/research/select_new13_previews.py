#!/usr/bin/env python3
"""Resolve project previews for the final 13 additions."""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ARTISTS = {
    "slayr": (1676805496, "remember them days", "us"),
    "mofly": (1520323789, "How It Feel", "us"),
    "lsgc": (1581210956, "佛哦佛404", "us"),
    "arthur": (1725095916, "RAIN", "us"),
    "sion": (1410596394, "Quiet Damage", "kr"),
    "kuang": (1581747989, "Destruction frenzy", "cn"),
    "taco": (1652977716, "No Hook", "us"),
    "delphia": (1666004335, "Yah", "us"),
    "westwood": (1719387562, "Luxury", "us"),
    "nato": (1748413099, "Let The Young Punks Dance", "us"),
    "skyte": (1521974191, "lovekills", "us"),
    "hollis": (1535847112, "Sex", "us"),
    "lucy": (1734729660, "c", "us"),
}


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/5.0"})
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
        print(key, "|", release.get("releaseDate", "")[:10], "|", release.get("collectionName"), "|", track.get("trackName"), "| preview ok")

    path = Path(__file__).parent / "new13_previews.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path} ({len(output)} previews)")


if __name__ == "__main__":
    main()
