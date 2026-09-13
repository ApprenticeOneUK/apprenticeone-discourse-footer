#!/usr/bin/env python3

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
ABOUT_PATH = ROOT / "about.json"
SUPPORTED_SOURCE_SUFFIXES = {".css", ".gjs", ".hbs", ".js", ".scss"}
EXPECTED_URL_PREFIX = "https://github.com/ApprenticeOneUK/apprenticeone-discourse-"
SECRET_PATTERNS = (
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----"),
)


def main() -> int:
    errors: list[str] = []
    try:
        about = json.loads(ABOUT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"Invalid about.json: {error}")
        about = {}

    name = about.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append("about.json must contain a non-empty name.")
    if about.get("component") is not True:
        errors.append("about.json must declare this as a theme component.")
    if not str(about.get("about_url", "")).startswith(EXPECTED_URL_PREFIX):
        errors.append("about.json must reference its canonical ApprenticeOne repository.")
    if not about.get("authors"):
        errors.append("about.json must identify the component owner.")
    if not re.fullmatch(r"\d+\.\d+\.\d+", str(about.get("theme_version", ""))):
        errors.append("about.json theme_version must use MAJOR.MINOR.PATCH format.")

    source_files = [
        path
        for folder in ("common", "desktop", "mobile", "javascripts", "migrations", "scss")
        for path in (ROOT / folder).rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_SOURCE_SUFFIXES
    ]
    if not source_files:
        errors.append("The repository contains no supported theme-component source files.")
    for path in source_files:
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            errors.append(f"Unable to read {path.relative_to(ROOT)}: {error}")
            continue
        if not content.strip():
            errors.append(f"Source file is empty: {path.relative_to(ROOT)}")
        if path.suffix.lower() in {".css", ".scss"} and content.count("{") != content.count("}"):
            errors.append(f"Unbalanced braces in {path.relative_to(ROOT)}")
        for pattern in SECRET_PATTERNS:
            if pattern.search(content):
                errors.append(f"Secret-like value found in {path.relative_to(ROOT)}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("Discourse theme-component structure and metadata are valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
