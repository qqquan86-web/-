#!/usr/bin/env python3
"""Refresh platform avatars for every artist in data.js.

Usage (from the workspace root):
    python sublevel/research/sync_avatars.py
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data.js"
AVATAR_PATH = ROOT / "research/artist_avatars.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"}
source = DATA_PATH.read_text(encoding="utf-8")
start = source.index("  const ARTISTS = [")
end = source.index("  window.SUBLEVEL = {")
block = source[start + len("  const ARTISTS = "):end].rstrip().rstrip(";")
artists = json.loads(block)


def norm(value: str) -> str:
    return re.sub(r"[^\w\u4e00-\u9fff]+", "", (value or "").lower())


def get_json(url: str, referer: str | None = None):
    headers = dict(HEADERS)
    if referer:
        headers["Referer"] = referer
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=8) as response:
        return json.loads(response.read().decode("utf-8", "replace"))


def deezer_avatar(artist: dict) -> str | None:
    aliases = [artist["name"].get("en"), artist["name"].get("zh"), artist["name"].get("ko"), artist.get("latin")]
    aliases = [a for a in aliases if a]
    normalized = {norm(a) for a in aliases}
    for alias in aliases:
        try:
            payload = get_json("https://api.deezer.com/search/artist?" + urllib.parse.urlencode({"q": alias, "limit": "8"}))
            for item in payload.get("data", []):
                if norm(item.get("name", "")) in normalized and item.get("picture_big"):
                    return item["picture_big"]
        except Exception:
            pass
        time.sleep(0.12)
    return None


def netease_avatar(artist: dict) -> str | None:
    aliases = [artist["name"].get("zh"), artist["name"].get("en")]
    normalized = {norm(a) for a in aliases if a}
    for alias in aliases:
        if not alias:
            continue
        try:
            payload = get_json(
                "https://music.163.com/api/search/get/web?" + urllib.parse.urlencode(
                    {"csrf_token": "", "s": alias, "type": "100", "offset": "0", "total": "true", "limit": "10"}
                ),
                "https://music.163.com/",
            )
            for item in payload.get("result", {}).get("artists", []):
                if norm(item.get("name", "")) in normalized:
                    image = item.get("img1v1Url") or item.get("picUrl")
                    if image and "5639395138885805" not in image:
                        return image
        except Exception:
            pass
        time.sleep(0.18)
    return None


avatars = {}
for artist in artists:
    avatar = deezer_avatar(artist) or netease_avatar(artist)
    if avatar:
        artist["avatar"] = avatar
        avatars[artist["id"]] = avatar
        print("OK", artist["id"])
    else:
        print("MISS", artist["id"])
        artist.setdefault("avatar", artist["project"]["preview"]["artwork"])
    time.sleep(0.08)

new_block = "  const ARTISTS = " + json.dumps(artists, ensure_ascii=False, indent=2) + ";\n\n"
DATA_PATH.write_text(source[:start] + new_block + source[end:], encoding="utf-8")
AVATAR_PATH.write_text(json.dumps(avatars, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"avatars {len(avatars)}/{len(artists)} -> {AVATAR_PATH}")
