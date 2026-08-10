# Data files

This directory contains three kinds of data. Keeping the distinction explicit prevents generated snapshots from being edited by hand.

## Curated source data

- `companies.js` — company profiles and maintained post lists.
- `company-verification.js` — first-party evidence used to include each company.
- `books.js` — the curated reading list.
- `blog-sources.json` — company pages checked by the daily blog workflow.

## Generated snapshots

- `arxiv-papers.js` — the arXiv extraction used by the paper-corpus pipeline.
- `research-papers.json` — the browser dataset, fetched only when the Papers view opens.
- `company-focus.{json,js}` — generated company positioning and publishing analysis.
- `blog-keyword-matches.{json,js}` — generated post classifications.
- `o9-posts.{json,js}` — generated o9 post and resource records.

Regenerate these files with the commands in the repository README. Do not edit them manually.

## Workflow state

- `known-posts.json` — URLs already seen by the blog checker.
- `pending-posts.json` — newly discovered candidates awaiting review.

These two files are updated by the daily workflow and intentionally versioned.
