#!/usr/bin/env python3
"""Resolve previews for the UDG cypher additions."""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ARTISTS = {
    "yoyi": (1762655152, "Emotion", "us"),
    "hidoyard": (1877647294, "莲華", "us"),
    "losty": (1582693499, "LAB", "us"),
    "isolyves": (1840807930, "EP777", "us"),
    "dd-ma-shawty": (1851131317, "21's Tears", "us"),
    "jesse-margiela": (1652274326, "幽默与笑话", "us"),
    "ananta": (1677716394, "Desperation 25", "kr"),
    "mitsu": (1537920672, "forbidden fruit", "kr"),
    "sei": (1844291283, "rogue-like", "kr"),
    "kianna": (1511764891, "Instinct", "jp"),
    "yvnlazy": (1618545208, "Re:Import", "jp"),
    "esdeekid": (1754179834, "Bandit", "gb"),
}


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/4.0"})
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

    path = Path(__file__).parent / "udg_cypher_previews.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path} ({len(output)} previews)")


if __name__ == "__main__":
    main()
