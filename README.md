# NeSy Atlas

A source-backed directory of companies whose own homepage, founder, or official announcement explicitly uses "neurosymbolic," "neuro-symbolic," "neural-symbolic," "NeSy," or "logical intelligence," or directly states that it combines neural and symbolic methods. The site is a standalone static project whose table format is inspired by [GDB-Engines](https://gdb-engines.com/) by [cjlm](https://github.com/cjlm).

## Preview locally

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Project structure

- `index.html` - table structure, accessibility, methodology, and attribution
- `styles.css` - header, table, badge, dialog, and responsive styling
- `script.js` - directory data, company favicons, table rendering, search, and sorting
- `fonts/` - local web fonts used by the interface
- `THIRD_PARTY_NOTICES.md` - attribution and license notice for adapted work

Every company links to its root homepage. Inclusion primarily requires that homepage to use "neurosymbolic," "neuro-symbolic," "neural-symbolic," "NeSy," or "logical intelligence," or directly state that it combines neural and symbolic methods. For product-first sites that omit architecture language, a direct, attributable statement from a founder or official company announcement may qualify the company; unattributed third-party descriptions do not qualify on their own. Funding amounts link to public disclosures where available, and latest-post links use dated first-party NeSy material when found. Company claims and financing data should be rechecked periodically.
