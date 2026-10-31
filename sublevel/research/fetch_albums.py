#!/usr/bin/env python3
"""Look up recent albums for the curated artist list."""
from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ARTISTS = {
    "xia-zhiyu": (1071480809, "cn"),
    "straight-fire-gang": (1337546923, "us"),
    "ar-liu-fuyang": (1459429029, "us"),
    "j-fever": (1034188077, "us"),
    "gordon": (929947296, "tw"),
    "dj-didilong": (738352695, "tw"),
    "youngqueenz": (1054093946, "hk"),
    "matt-force": (886042450, "hk"),
    "justhis": (1005397107, "kr"),
    "kid-milli": (998838184, "kr"),
    "khundi-panda": (1280943441, "kr"),
    "jvcki-wai": (1123982621, "kr"),
    "kid-fresino": (597838190, "jp"),
    "5lack": (518532376, "jp"),
    "issugi": (395761199, "jp"),
    "jin-dogg": (761621107, "jp"),
    "mike": (1253023714, "us"),
    "billy-woods": (18117504, "us"),
    "navy-blue-a": (1490188561, "us"),
    "navy-blue-b": (1446668099, "us"),
    "pink-siifu": (1087355934, "us"),
    "casisdead": (785585142, "gb"),
    "knucks": (214299649, "gb"),
    "flohio": (1219509463, "gb"),
    "kojey-radical": (992166757, "gb"),
}


def lookup(artist_id: int, country: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {"id": artist_id, "entity": "album", "limit": 200, "country": country}
    )
    url = f"https://itunes.apple.com/lookup?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8")).get("results", [])


def main() -> None:
    out = {}
    for key, (artist_id, country) in ARTISTS.items():
        try:
            results = lookup(artist_id, country)
        except Exception as exc:  # pragma: no cover
            print(f"ERR {key}: {exc}")
            continue
        artist = next((x for x in results if x.get("wrapperType") == "artist"), {})
        albums = [
            x
            for x in results
            if x.get("wrapperType") == "collection"
            and x.get("collectionType") == "Album"
            and (x.get("releaseDate") or "") >= "2021-10-01"
        ]
        albums.sort(key=lambda x: x.get("releaseDate", ""), reverse=True)
        out[key] = {"artist": artist, "albums": albums}
        print(f"\n## {key} | {artist.get('artistName')} | {artist.get('artistLinkUrl')}")
        for album in albums[:12]:
            print(
                album.get("releaseDate", "")[:10],
                "|",
                album.get("collectionName"),
                "|",
                album.get("trackCount"),
                "|",
                album.get("primaryGenreName"),
            )

    path = Path(__file__).parent / "albums_raw.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path}")


if __name__ == "__main__":
    main()
