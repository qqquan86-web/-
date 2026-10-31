#!/usr/bin/env python3
"""Research helper: query the public iTunes Search API for candidates.

The preview URLs returned by Apple are official 30-second previews. This script
is only used while curating the static dataset; the site itself has no backend.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

OUT = Path(__file__).parent / "catalog_raw.json"

CANDIDATES = [
    {
        "id": "xia-zhiyu",
        "aliases": ["夏之禹", "Xia Zhiyu"],
        "queries": ["夏之禹", "Xia Zhiyu"],
        "countries": ["cn", "us", "jp"],
    },
    {
        "id": "straight-fire-gang",
        "aliases": ["直火帮", "Straight Fire Gang"],
        "queries": ["直火帮", "Straight Fire Gang"],
        "countries": ["cn", "us"],
    },
    {
        "id": "ar-liu-fuyang",
        "aliases": ["AR刘夫阳", "刘夫阳"],
        "queries": ["AR刘夫阳", "刘夫阳"],
        "countries": ["cn", "us"],
    },
    {
        "id": "j-fever",
        "aliases": ["小老虎", "J-Fever", "J Fever"],
        "queries": ["小老虎", "J-Fever"],
        "countries": ["cn", "us"],
    },
    {
        "id": "gordon",
        "aliases": ["国蛋", "GorDoN"],
        "queries": ["国蛋", "GorDoN"],
        "countries": ["tw", "hk", "us"],
    },
    {
        "id": "dj-didilong",
        "aliases": ["李英宏", "DJ Didilong"],
        "queries": ["李英宏", "DJ Didilong"],
        "countries": ["tw", "us"],
    },
    {
        "id": "youngqueenz",
        "aliases": ["YoungQueenz"],
        "queries": ["YoungQueenz"],
        "countries": ["hk", "tw", "us"],
    },
    {
        "id": "matt-force",
        "aliases": ["Matt Force"],
        "queries": ["Matt Force"],
        "countries": ["hk", "tw", "us"],
    },
    {
        "id": "justhis",
        "aliases": ["JUSTHIS", "저스디스"],
        "queries": ["JUSTHIS", "저스디스"],
        "countries": ["kr", "us"],
    },
    {
        "id": "kid-milli",
        "aliases": ["Kid Milli", "키드밀리"],
        "queries": ["Kid Milli", "키드밀리"],
        "countries": ["kr", "us"],
    },
    {
        "id": "khundi-panda",
        "aliases": ["Khundi Panda", "쿤디판다"],
        "queries": ["Khundi Panda", "쿤디판다"],
        "countries": ["kr", "us"],
    },
    {
        "id": "jvcki-wai",
        "aliases": ["Jvcki Wai", "젭키 와이", "재키와이"],
        "queries": ["Jvcki Wai", "재키와이"],
        "countries": ["kr", "us"],
    },
    {
        "id": "kid-fresino",
        "aliases": ["KID FRESINO", "Kid Fresino"],
        "queries": ["KID FRESINO"],
        "countries": ["jp", "us"],
    },
    {
        "id": "5lack",
        "aliases": ["5lack"],
        "queries": ["5lack"],
        "countries": ["jp", "us"],
    },
    {
        "id": "issugi",
        "aliases": ["ISSUGI"],
        "queries": ["ISSUGI"],
        "countries": ["jp", "us"],
    },
    {
        "id": "jin-dogg",
        "aliases": ["Jin Dogg", "JIN DOGG"],
        "queries": ["Jin Dogg"],
        "countries": ["jp", "us"],
    },
    {
        "id": "mike",
        "aliases": ["MIKE"],
        "queries": ["MIKE rapper", "MIKE"],
        "countries": ["us", "gb"],
    },
    {
        "id": "billy-woods",
        "aliases": ["billy woods", "Billy Woods"],
        "queries": ["billy woods"],
        "countries": ["us", "gb"],
    },
    {
        "id": "navy-blue",
        "aliases": ["Navy Blue"],
        "queries": ["Navy Blue rapper", "Navy Blue"],
        "countries": ["us", "gb"],
    },
    {
        "id": "pink-siifu",
        "aliases": ["Pink Siifu"],
        "queries": ["Pink Siifu"],
        "countries": ["us", "gb"],
    },
    {
        "id": "casisdead",
        "aliases": ["CASISDEAD", "Casisdead"],
        "queries": ["CASISDEAD"],
        "countries": ["gb", "us"],
    },
    {
        "id": "knucks",
        "aliases": ["Knucks"],
        "queries": ["Knucks"],
        "countries": ["gb", "us"],
    },
    {
        "id": "flohio",
        "aliases": ["FLOHIO", "Flohio"],
        "queries": ["FLOHIO"],
        "countries": ["gb", "us"],
    },
    {
        "id": "kojey-radical",
        "aliases": ["Kojey Radical"],
        "queries": ["Kojey Radical"],
        "countries": ["gb", "us"],
    },
]


def fetch(query: str, country: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "term": query,
            "entity": "song",
            "limit": 50,
            "country": country,
        }
    )
    url = f"https://itunes.apple.com/search?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "sublevel-curation/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return payload.get("results", [])


def matches_alias(artist_name: str, alias: str) -> bool:
    """Strict primary-artist matching, allowing featured credit separators."""
    name = (artist_name or "").strip().casefold()
    alias = alias.strip().casefold()
    if name == alias:
        return True
    for separator in (" & ", " feat", " ft.", ",", " / ", " x "):
        if name.startswith(alias + separator):
            return True
    return False


def main() -> None:
    output = {}
    for candidate in CANDIDATES:
        seen = set()
        tracks = []
        for query in candidate["queries"]:
            for country in candidate["countries"]:
                try:
                    results = fetch(query, country)
                except Exception as exc:  # pragma: no cover - research only
                    print(f"ERR {candidate['id']} {query} {country}: {exc}")
                    continue
                for item in results:
                    key = item.get("trackId")
                    if key in seen:
                        continue
                    seen.add(key)
                    item["_query"] = query
                    item["_country"] = country
                    tracks.append(item)
                time.sleep(0.25)
        aliases = {alias.casefold() for alias in candidate["aliases"]}
        matched = []
        for item in tracks:
            if any(matches_alias(item.get("artistName", ""), alias) for alias in aliases):
                if (item.get("releaseDate") or "") >= "2021-01-01":
                    matched.append(item)
        matched.sort(key=lambda x: x.get("releaseDate", ""), reverse=True)
        output[candidate["id"]] = {
            "candidate": candidate,
            "latest": matched[:12],
            "other_artists": sorted(
                {
                    item.get("artistName")
                    for item in tracks
                    if (item.get("artistName") or "").casefold() not in aliases
                }
            )[:25],
        }
        latest = matched[0] if matched else None
        print(
            candidate["id"],
            "|",
            latest.get("artistName") if latest else "NO MATCH",
            "|",
            latest.get("trackName") if latest else "",
            "|",
            latest.get("releaseDate", "")[:10] if latest else "",
            "|",
            "preview" if latest and latest.get("previewUrl") else "no-preview",
            "|",
            latest.get("_country") if latest else "",
        )
        time.sleep(0.25)

    OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
