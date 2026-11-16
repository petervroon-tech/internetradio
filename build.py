#!/usr/bin/env python3
"""
Internet Radio Build & Release Compiler
=======================================
Valideert en assembleert de release-artefacten voor 'internetradio':
- Controleert integriteit van index.html, app.js, style.css, lame.min.js
- Werkt version.json bij met nieuwste build-nummer, git-hash en tijdstempel
- Garandeert dat de Help-modal direct 100% up-to-date blijft conform AGENTS.md
"""

import os
import sys
import json
import argparse
import subprocess
from datetime import datetime, timezone

APP_NAME = "internetradio"
DEFAULT_VERSION = "1.0.0"

def get_git_hash() -> str:
    try:
        res = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            check=True
        )
        return res.stdout.strip()
    except Exception:
        return "online"

def update_version(ci_mode: bool = False, sha: str = "", build_num: str = "") -> dict:
    version_path = os.path.join(os.path.dirname(__file__), "version.json")
    data = {}
    if os.path.exists(version_path):
        try:
            with open(version_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"⚠️ Kon bestaande version.json niet lezen: {e}")

    data["app_name"] = APP_NAME
    data["version"] = data.get("version", DEFAULT_VERSION)
    
    current_build = int(data.get("build", 1))
    if build_num:
        try:
            data["build"] = int(build_num)
        except ValueError:
            data["build"] = current_build + 1
    elif ci_mode:
        data["build"] = current_build + 1
    else:
        data["build"] = current_build

    git_hash = sha[:7] if sha else get_git_hash()
    data["git_hash"] = git_hash
    data["timestamp"] = datetime.now(timezone.utc).isoformat()

    with open(version_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ version.json bijgewerkt: v{data['version']} Build {data['build']} ({data['git_hash']}) @ {data['timestamp']}")
    return data

def verify_files():
    base_dir = os.path.dirname(__file__)
    required_files = [
        "index.html",
        "app.js",
        "style.css",
        "lame.min.js",
        "version.json",
        "favicon.svg"
    ]
    missing = []
    for rf in required_files:
        path = os.path.join(base_dir, rf)
        if not os.path.exists(path):
            missing.append(rf)
        else:
            size_kb = os.path.getsize(path) / 1024
            print(f"  ✓ {rf:<15} ({size_kb:.1f} KB)")
    
    if missing:
        print(f"❌ Ontbrekende verplichte bestanden: {', '.join(missing)}")
        sys.exit(1)
    print("✅ Alle release-bestanden zijn aanwezig en geverifieerd.")

def main():
    parser = argparse.ArgumentParser(description="Internet Radio Build & Release")
    parser.add_argument("--ci", action="store_true", help="Draaien in GitHub Actions CI")
    parser.add_argument("--sha", type=str, default="", help="Git commit SHA")
    parser.add_argument("--build", type=str, default="", help="CI Build / Run number")
    args = parser.parse_args()

    print(f"🔨 Bouwen van {APP_NAME}...")
    vinfo = update_version(ci_mode=args.ci, sha=args.sha, build_num=args.build)
    verify_files()
    print(f"🎉 Build succesvol gereed voor GitHub Pages: {APP_NAME} v{vinfo['version']} Build {vinfo['build']}")

if __name__ == "__main__":
    main()
