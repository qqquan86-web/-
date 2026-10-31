#!/usr/bin/env python3
"""Candidate lookup for the UDG/UG edition."""
from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CANDIDATES = {
    "chun": (1617363726, "cn"),
    "bloodz-old": (825094034, "us"),
    "bloodzboi-a": (1451139871, "us"),
    "bloodzboi-b": (1459782000, "us"),
    "li-wenjun": (1809309930, "cn"),
    "yaka": (1519813408, "cn"),
    "charity": (1540081424, "cn"),
    "chaozhou-tugou": (1547663854, "tw"),
    "sowut": (1138324311, "tw"),
    "noly": (1352606173, "hk"),
    "yung-raise": (1462623610, "hk"),
    "kim-ximya": (1218103209, "kr"),
    "jvcki": (1123982621, "kr"),
    "choilb": (1114670716, "kr"),
    "cadejo-a": (1451614241, "kr"),
    "cadejo-b": (1548125436, "kr"),
    "cadejo-c": (1388189929, "kr"),
    "qim-isle-a": (434873328, "kr"),
    "qim-isle-b": (943780929, "kr"),
    "tohji": (1407773789, "jp"),
    "kzm": (1083743314, "jp"),
    "lil-soft-tennis": (1438054408, "jp"),
    "vava-jp": (125734880, "jp"),
    "clipping": (810595978, "us"),
    "backxwash": (1360719873, "us"),
    "ghais-guevara": (1490058480, "us"),
    "by-storm": (1700461008, "us"),
    "blackhaine": (1538365614, "gb"),
    "nukuluk": (1582787766, "gb"),
    "serane-a": (1528640260, "gb"),
    "serane-b": (1598196465, "gb"),
    "fakemink": (1744500063, "gb"),
}


def lookup(artist_id: int, country: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {"id": artist_id, "entity": "album", "limit": 200, "country": country}
    )
    req = urllib.request.Request(
        f"https://itunes.apple.com/lookup?{params}",
        headers={"User-Agent": "sublevel-curation/2.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8")).get("results", [])


def main() -> None:
    out = {}
    for key, (artist_id, country) in CANDIDATES.items():
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
        for album in albums[:10]:
            print(
                album.get("releaseDate", "")[:10],
                "|",
                album.get("collectionName"),
                "|",
                album.get("trackCount"),
                "|",
                album.get("primaryGenreName"),
            )

    path = Path(__file__).parent / "ug_candidates.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {path}")


if __name__ == "__main__":
    main()
