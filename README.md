# NeSy Atlas

A source-backed directory of neurosymbolic companies, their posts, and relevant arXiv papers. Company inclusion requires an own homepage, founder, or official announcement that explicitly uses "neurosymbolic," "neuro-symbolic," "neural-symbolic," "NeSy," or "logical intelligence," or directly states that it combines neural and symbolic methods. The site is a standalone static project whose table format is inspired by [GDB-Engines](https://gdb-engines.com/) by [cjlm](https://github.com/cjlm).

## Preview locally

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Project structure

- `index.html` - table structure, accessibility, methodology, and attribution
- `styles.css` - header, table, badge, dialog, and responsive styling
- `script.js` - directory, post, and paper rendering, search, sorting, and navigation
- `data/arxiv-papers.js` - generated arXiv paper snapshot used by the Papers view
- `scripts/update-arxiv-papers.mjs` - refreshes papers whose title or abstract matches an explicit NeSy keyword
- `config/paper-corpus.json` - configurable arXiv and conference discovery sources
- `scripts/paper-corpus.mjs` - discovers, downloads, extracts, and builds the complete research corpus
- `fonts/` - local web fonts used by the interface
- `THIRD_PARTY_NOTICES.md` - attribution and license notice for adapted work

Every company links to its root homepage. Inclusion primarily requires that homepage to use "neurosymbolic," "neuro-symbolic," "neural-symbolic," "NeSy," or "logical intelligence," or directly state that it combines neural and symbolic methods. For product-first sites that omit architecture language, a direct, attributable statement from a founder or official company announcement may qualify the company; unattributed third-party descriptions do not qualify on their own. The current scope focuses on independent and specialist companies and excludes major technology companies for now, even when they have qualifying neurosymbolic work. Founding years use the company's LinkedIn About page when available; if no founding year is listed, the current CEO's start year is used as the fallback. Funding amounts link to public disclosures where available. For verified GitHub organizations, the directory shows a GitHub link and the star total of its most-starred public repository, using a snapshot dated 05 Aug 2026. The Posts column charts dated entries by month over the past 12 months; companies without a dated entry in that range display “–”. Company claims and financing data should be rechecked periodically.

## Refresh arXiv papers

```bash
node scripts/update-arxiv-papers.mjs
```

The refresh queries the public arXiv API and keeps papers whose title or abstract contains `neurosymbolic`, `neuro-symbolic`, `neuro symbolic`, `neural-symbolic`, `neural symbolic`, or `NeSy`. Run all tests with `node --test scripts/*.test.mjs`.

Already-downloaded Atom feeds can be parsed without network access by repeating the input option: `node scripts/update-arxiv-papers.mjs --input /path/to/feed-1.xml --input /path/to/feed-2.xml`.

The Papers view ranks its author and institution filters by matching-paper count. Institutions come only from affiliations explicitly included in each paper's arXiv record. Missing affiliations are left blank rather than inferred from an author's current profile.

## Build the paper corpus

The corpus covers 2023–2026 and includes the keyword-matched arXiv snapshot, every paper indexed in the NeSy proceedings, and explicit neurosymbolic matches from ICLR, ICML, NeurIPS, AAAI, and IJCAI. ICLR, ICML, NeurIPS, and AAAI discovery uses the pinned `ai-conferences/all-papers` Hugging Face Parquet dataset. IJCAI uses its official 2023–2025 proceedings pages for abstracts, DOI metadata, and direct PDFs. NeSy remains DBLP-backed, with abstracts and paper-specific affiliations extracted from downloaded PDFs by GROBID. Venues and years are configurable in `config/paper-corpus.json`.

Start local GROBID:

```bash
docker run -d --rm --name nesy-grobid -p 8070:8070 grobid/grobid:0.8.2
```

Then run each resumable stage:

```bash
node scripts/paper-corpus.mjs discover
node scripts/paper-corpus.mjs resolve
node scripts/paper-corpus.mjs download
node scripts/paper-corpus.mjs extract
node scripts/paper-corpus.mjs build
```

`node scripts/paper-corpus.mjs all` runs all five stages. Add `--limit 10` to test resolution, download, and extraction on a small batch. The resolver looks for the same work on arXiv using normalized title, publication year, and author validation; it never substitutes a merely related paper. Use `resolve --local-only` to match against the cached arXiv snapshot without API requests. When no safe PDF is found, the record retains its published conference and DOI/source page. The Hugging Face adapter requires the `duckdb` CLI. Its pinned metadata file is about 155 MB and is downloaded once into `.paper-corpus/sources/`; embeddings are not downloaded.

The download command skips PDFs already downloaded and records that previously failed. Pass `--retry-errors` only when you intentionally want to retry known 404, paywall, or transient failures.

Downloads use six workers by default and GROBID extraction uses four. Override them independently with `--download-concurrency 10` and `--extract-concurrency 6`, or set both with `--concurrency 6`. Host-aware throttling still starts arXiv requests at least three seconds apart; other paper hosts continue in parallel. Defaults and host delays live in `config/paper-corpus.json`.

PDFs, the discovery manifest, and GROBID results are cached under the gitignored `.paper-corpus/` directory. The build stage generates `data/research-papers.json` and `data/research-papers.js`. Every website record has a stable ID, title, abstract, authors, paper-specific affiliations, keywords, categories, published conference, year/date, canonical URL, PDF URL, DOI/arXiv ID when available, resolution/source provenance, extraction status, and a `metadataComplete` flag. No affiliation is taken from a current author profile.

The build stage also performs conservative, local entity resolution. Papers receive stable IDs from DOI, arXiv ID, or normalized title; author aliases are joined only by normalized exact name; and institution aliases are joined by normalized exact name or a unique, unambiguous acronym expansion. Raw author and affiliation strings remain on every paper alongside the resolved values, and the generated corpus includes author and institution entity indexes. This pass does not claim that common same-name authors are definitively the same person, and it does not infer current affiliations.

The Hugging Face dataset currently declares no license in its dataset card. Keep its pinned revision and provenance in generated records, and verify reuse/redistribution terms with the dataset owner before publishing dataset-derived metadata.

## Refresh o9 posts and resources

The o9 listing pages are client-rendered, so their complete article and resource collections come from o9's public WordPress REST endpoints rather than the initial listing HTML. Refresh the static Posts-tab snapshot with:

```bash
node scripts/update-o9-posts.mjs
```

This generates `data/o9-posts.json` and `data/o9-posts.js`, retaining the source content type and publication date for every English article and resource.

## Refresh the Posts keyword audit

```bash
node scripts/update-blog-keyword-matches.mjs --concurrency 12
```

This checks every post displayed on the Posts tab for an explicit neurosymbolic keyword in its title or article content. It writes the auditable result set to `data/blog-keyword-matches.json` and the compact browser lookup to `data/blog-keyword-matches.js`; the toggle remains instantaneous because article bodies are not shipped to the browser.
