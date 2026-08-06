# NeSy Atlas

A source-backed directory of neurosymbolic companies, their posts, and relevant arXiv papers. Inclusion requires an explicit "neurosymbolic" (or equivalent) claim from a homepage, founder, or official announcement. Table format inspired by [GDB-Engines](https://gdb-engines.com/) by [cjlm](https://github.com/cjlm).

## Preview locally

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Project structure

- `index.html` - table structure, accessibility, methodology, attribution
- `styles.css` - styling
- `script.js` - rendering, search, sorting, navigation
- `data/` - generated snapshots consumed by the site
- `config/paper-corpus.json` - arXiv/conference discovery config
- `scripts/` - data-refresh scripts (see below)
- `fonts/` - local web fonts
- `THIRD_PARTY_NOTICES.md` - attribution and license notice

Founding years use LinkedIn About pages, falling back to the current CEO's start year. GitHub stars reflect a snapshot dated 05 Aug 2026. Company and funding data should be rechecked periodically.

## Refresh arXiv papers

```bash
node scripts/update-arxiv-papers.mjs
node scripts/paper-corpus.mjs refresh-arxiv
```

Queries the arXiv API, keeps papers whose title/abstract match an explicit NeSy keyword, and syncs them into the combined corpus used by the Paper tab. The extraction command accepts cached Atom feeds via repeated `--input path`. Run tests with `node --test scripts/*.test.mjs`.

The `Update arXiv papers` GitHub Actions workflow runs this extraction daily at 12:00 UTC, refreshes the Paper tab's combined corpus, and commits updated snapshots. It can also be run manually from the Actions tab.

## Build the paper corpus

Builds `data/research-papers.json` from arXiv plus NeSy, ICLR, ICML, NeurIPS, AAAI, and IJCAI proceedings, with entity resolution across papers/authors/institutions. Configurable in `config/paper-corpus.json`.

```bash
docker run -d --rm --name nesy-grobid -p 8070:8070 grobid/grobid:0.8.2
node scripts/paper-corpus.mjs all   # or: discover / resolve / download / extract / build
```

Add `--limit 10` to test on a small batch, or `resolve --local-only` to skip API calls. `--retry-errors` retries known download failures. Concurrency is configurable via `--download-concurrency`, `--extract-concurrency`, or `--concurrency`. Caches live under the gitignored `.paper-corpus/`.

## Refresh the Posts keyword audit

```bash
node scripts/update-blog-keyword-matches.mjs --concurrency 12
```

Checks every Posts-tab entry for an explicit neurosymbolic keyword and writes the result to `data/blog-keyword-matches.js`.
