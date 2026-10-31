#!/usr/bin/env python3
"""Resolve UDG/UG edition releases to official 30-second previews."""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# key: (candidate key in ug_candidates.json, exact release title, project type)
SELECTED = {
    "bloodz-boi": ("bloodz-old", "Bloodzebra", "album"),
    "yaka": ("yaka", "¡2busy4u! Jungle Rage *LP", "album"),
    "charity-ssb": ("charity", "Clemency", "album"),
    "chaozhou-tugou": ("chaozhou-tugou", "雙眼皮男孩 (feat. 徐晧程徐晧程) - Single", "single"),
    "sowut": ("sowut", "GOOD4SUMMER", "album"),
    "noly": ("noly", "龍寨 DT2", "album"),
    "kim-ximya": ("kim-ximya", "Dogma", "album"),
    "jvcki-wai": ("jvcki", "MOLLAK", "album"),
    "choilb": ("choilb", "her.", "album"),
    "tohji": ("tohji", "Kuuga β", "album"),
    "kzm": ("kzm", "King of Nostalgia - EP", "ep"),
    "lil-soft-tennis": ("lil-soft-tennis", "Big Hard Tennis - EP", "ep"),
    "clipping": ("clipping", "Dead Channel Sky", "album"),
    "backxwash": ("backxwash", "Only Dust Remains", "album"),
    "by-storm": ("by-storm", "My Ghosts Go Ghost", "album"),
    "blackhaine": ("blackhaine", "Armour II - EP", "ep"),
    "nukuluk": ("nukuluk", "stillworld", "album"),
    "serane": ("serane-a", "PRISE STARS", "album"),
}

COUNTRY = {
    # The US storefront is used only to retrieve preview clips. Project links
    # remain on the artist's home storefront where possible.
    "bloodz-boi": "us",
    "yaka": "us",
    "charity-ssb": "us",
    "chaozhou-tugou": "us",
    "sowut": "us",
    "noly": "us",
    "kim-ximya": "us",
    "jvcki-wai": "us",
    "choilb": "us",
    "tohji": "us",
    "kzm": "us",
    "lil-soft-tennis": "us",
    "clipping": "us",
    "backxwash": "us",
    "by-storm": "us",
    "blackhaine": "us",
    "nukuluk": "us",
    "serane": "us",
}


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/2.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    here = Path(__file__).parent
    candidates = json.loads((here / "ug_candidates.json").read_text(encoding="utf-8"))
    output = {}
    for key, (candidate_key, title, project_type) in SELECTED.items():
        albums = candidates[candidate_key]["albums"]
        release = next((x for x in albums if x.get("collectionName") == title), None)
        if not release:
            print(f"MISSING RELEASE: {key} / {title}")
            continue
        collection_id = release["collectionId"]
        params = urllib.parse.urlencode(
            {"id": collection_id, "entity": "song", "limit": 200, "country": "us"}
        )
        data = fetch(f"https://itunes.apple.com/lookup?{params}")
        tracks = [
            x for x in data.get("results", [])
            if x.get("wrapperType") == "track" and x.get("previewUrl")
        ]
        skip = re.compile(r"\b(intro|outro|skit|interlude|speech)\b", re.IGNORECASE)
        substantial = [
            x for x in tracks
            if (x.get("trackTimeMillis") or 0) > 60_000
            and not skip.search(x.get("trackName") or "")
        ]
        pool = substantial or tracks
        pool = sorted(pool, key=lambda x: (x.get("trackNumber") or 99))
        track = pool[0] if pool else None
        if not track:
            print(f"NO PREVIEW: {key} / {title}")
            continue
        output[key] = {
            "project": release.get("collectionName"),
            "projectArtist": release.get("artistName"),
            "projectUrl": release.get("collectionViewUrl"),
            "releaseDate": release.get("releaseDate"),
            "trackCount": release.get("trackCount"),
            "type": project_type,
            "trackName": track.get("trackName"),
            "trackTimeMillis": track.get("trackTimeMillis"),
            "previewUrl": track.get("previewUrl"),
            "trackViewUrl": track.get("trackViewUrl"),
            "artworkUrl100": track.get("artworkUrl100"),
            "artistViewUrl": track.get("artistViewUrl"),
        }
        print(
            key,
            "|",
            release.get("releaseDate", "")[:10],
            "|",
            title,
            "|",
            track.get("trackName"),
            "|",
            "preview ok",
        )

    path = here / "ug_previews.json"
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path} ({len(output)} previews)")


if __name__ == "__main__":
    main()
