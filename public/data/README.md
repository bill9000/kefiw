# Dictionary

`dict.txt` is a newline-delimited lowercase English word list used by the word-tool Web Worker.

The seed list shipped here is a small curated subset of common English words for v1 functionality.

## Upgrading to a larger list

For production, swap in a larger list such as:

- [dwyl/english-words](https://github.com/dwyl/english-words) — `words_alpha.txt` (~370k words, ~4MB)
- [SCOWL](http://wordlist.aspell.net/) — tunable by frequency
- TWL06 or SOWPODS (Scrabble-specific)

Drop the new file in this directory as `dict.txt` (one lowercase word per line).
