# Dictionary data

Two newline-delimited lowercase English word lists, fetched lazily by the word-tool Web Worker.

## `dict.txt` — full English dictionary (default)

- ~370,000 words, ~4.0 MB
- Source: [dwyl/english-words](https://github.com/dwyl/english-words) (`words_alpha.txt`)
- License: Unlicense (public domain)
- Used for: every word tool by default

## `enable.txt` — ENABLE1 (strict mode)

- ~172,800 words, ~1.7 MB
- Source: [dolph/dictionary](https://github.com/dolph/dictionary) mirror of ENABLE1 by Alan Beale
- License: public domain
- Used for: the "Strict mode" toggle in Scrabble and Words With Friends helpers to approximate tournament-safe play without shipping the copyrighted TWL or CSW lists

Loaded on demand — only fetched the first time a user enables strict mode. After that it's cached for 7 days via `public/_headers`.
