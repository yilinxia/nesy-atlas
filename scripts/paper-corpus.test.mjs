import assert from 'node:assert/strict';
import test from 'node:test';

import {
  arxivPaperToRecord,
  completePaper,
  dedupeRecords,
  hasExtractedMetadata,
  huggingFaceRowToRecord,
  matchedKeywords,
  openReviewNoteToRecord,
  parseDblpToc,
  parseDblpTocLinks,
  parseGrobidHeader,
  parseIjcaiDetail,
  parseIjcaiProceedings,
  refreshArxivCorpus,
  resolveCorpusEntities,
  runWorkerPool,
  sameWorkCandidate,
  selectDownloadCandidates
} from './paper-corpus.mjs';

test('normalizes arXiv snapshot papers into corpus records', () => {
  const record = arxivPaperToRecord({
    id: '2608.00001',
    title: 'A Neuro-Symbolic System',
    abstract: 'A model.',
    authors: ['Ada Lovelace'],
    authorAffiliations: [{ name: 'Ada Lovelace', affiliations: ['Example University'] }],
    affiliations: ['Example University'],
    published: '2026-08-01',
    categories: ['cs.AI'],
    url: 'https://arxiv.org/abs/2608.00001',
    pdfUrl: 'https://arxiv.org/pdf/2608.00001',
    matches: { title: ['neuro-symbolic'], abstract: [] }
  }, { id: 'arxiv-keywords', venue: 'arXiv' });

  assert.equal(record.sourceType, 'arxiv');
  assert.equal(record.arxivId, '2608.00001');
  assert.equal(record.year, 2026);
  assert.deepEqual(record.keywords, ['neuro-symbolic']);
});

test('refreshes the website corpus with new arXiv papers without losing conference metadata', () => {
  const resolved = resolveCorpusEntities([{
    id: 'conference-paper',
    title: 'A Neuro-Symbolic System',
    abstract: 'Conference abstract.',
    authors: ['Ada Lovelace'],
    authorAffiliations: [{ name: 'Ada Lovelace', affiliations: ['Example University'] }],
    affiliations: ['Example University'],
    keywords: ['reasoning'],
    categories: [],
    venue: 'ICLR',
    conference: 'ICLR',
    year: 2026,
    published: '2026-04-01',
    url: 'https://example.org/conference-paper',
    pdfUrl: 'https://example.org/conference-paper.pdf',
    doi: '',
    arxivId: '',
    sourceType: 'huggingface-dataset',
    sourceIds: ['ai-conferences-hf'],
    metadataComplete: true,
    extractionStatus: 'extracted'
  }, {
    id: 'stale-arxiv-paper',
    title: 'A Removed Neurosymbolic Paper',
    abstract: 'No longer in the snapshot.',
    authors: ['Grace Hopper'],
    authorAffiliations: [],
    affiliations: [],
    keywords: ['neurosymbolic'],
    categories: ['cs.AI'],
    venue: 'arXiv',
    conference: '',
    year: 2026,
    published: '2026-01-01',
    url: 'https://arxiv.org/abs/2601.00001',
    pdfUrl: 'https://arxiv.org/pdf/2601.00001',
    doi: '',
    arxivId: '2601.00001',
    sourceType: 'arxiv',
    sourceIds: ['arxiv-keywords'],
    metadataComplete: false,
    extractionStatus: 'not-extracted'
  }]);
  const existingCorpus = {
    schemaVersion: 1,
    generatedAt: '2026-08-01T00:00:00.000Z',
    yearRange: { from: 2023, to: 2026 },
    keywords: ['neuro-symbolic'],
    sources: [{ id: 'ai-conferences-hf', type: 'huggingface-parquet', status: 'ok', count: 1 }],
    entityResolution: resolved.metadata,
    entities: resolved.entities,
    papers: resolved.papers
  };
  const snapshot = [{
    id: '2608.00001',
    title: 'A Neuro-Symbolic System',
    abstract: 'Updated arXiv abstract.',
    authors: ['Ada Lovelace'],
    authorAffiliations: [],
    affiliations: [],
    published: '2026-03-01',
    categories: ['cs.AI'],
    url: 'https://arxiv.org/abs/2608.00001',
    pdfUrl: 'https://arxiv.org/pdf/2608.00001',
    matches: { title: ['neuro-symbolic'], abstract: [] }
  }, {
    id: '2608.00002',
    title: 'A Second Neurosymbolic Paper',
    abstract: 'Another model.',
    authors: ['Alan Turing'],
    authorAffiliations: [],
    affiliations: [],
    published: '2026-08-02',
    categories: ['cs.LG'],
    url: 'https://arxiv.org/abs/2608.00002',
    pdfUrl: 'https://arxiv.org/pdf/2608.00002',
    matches: { title: ['neurosymbolic'], abstract: [] }
  }];

  const output = refreshArxivCorpus(existingCorpus, snapshot, {
    id: 'arxiv-keywords',
    type: 'arxiv-snapshot',
    venue: 'arXiv',
    years: [2023, 2024, 2025, 2026]
  }, { generatedAt: '2026-08-06T00:00:00.000Z' });

  assert.equal(output.paperCount, 2);
  assert.equal(output.generatedAt, '2026-08-06T00:00:00.000Z');
  assert.equal(output.sources.find((source) => source.id === 'arxiv-keywords').count, 2);
  assert.equal(output.papers[0].venue, 'ICLR');
  assert.equal(output.papers[0].url, 'https://example.org/conference-paper');
  assert.equal(output.papers[0].abstract, 'Updated arXiv abstract.');
  assert.equal(output.papers[0].arxivId, '2608.00001');
  assert.deepEqual(output.papers[0].sourceIds, ['ai-conferences-hf', 'arxiv-keywords']);
  assert.equal(output.papers[1].venue, 'arXiv');
  assert.equal(output.papers[1].sourceType, 'arxiv');
  assert.equal(output.papers.some((paper) => paper.id === 'stale-arxiv-paper'), false);
});

test('normalizes pinned Hugging Face conference records', () => {
  const record = huggingFaceRowToRecord({
    paper_id: 'iclr-2025-1',
    source_paper_id: 'abc123',
    conference: 'ICLR',
    year: 2025,
    title: 'A Neurosymbolic Model',
    abstract: 'Combines learning and reasoning.',
    authors_json: '["Ada Lovelace","Alan Turing"]',
    keywords_json: '["reasoning"]',
    arxiv_id: '2501.01234v2',
    primary_area: 'Neuro-Symbolic AI',
    type: 'poster',
    award: 'spotlight'
  }, {
    id: 'ai-conferences-hf',
    dataset: 'ai-conferences/all-papers',
    revision: 'pinned-revision'
  });
  assert.equal(record.id, 'huggingface:ai-conferences/all-papers:iclr-2025-1');
  assert.equal(record.venue, 'ICLR');
  assert.deepEqual(record.authors, ['Ada Lovelace', 'Alan Turing']);
  assert.equal(record.arxivId, '2501.01234');
  assert.equal(record.pdfUrl, 'https://arxiv.org/pdf/2501.01234');
  assert.equal(record.discoveryMetadata.revision, 'pinned-revision');
});

test('deduplication preserves an existing downloaded arXiv identity and adds its conference', () => {
  const base = {
    title: 'A Neurosymbolic Model', abstract: '', authors: ['Ada'], affiliations: [],
    categories: [], keywords: [], doi: '', arxivId: '2501.01234'
  };
  const records = dedupeRecords([
    { ...base, id: '2501.01234', sourceId: 'arxiv', venue: 'arXiv', pdfUrl: 'https://arxiv.org/pdf/2501.01234' },
    { ...base, id: 'hf:1', sourceId: 'hf', venue: 'ICLR', pdfUrl: '', award: 'spotlight' }
  ]);
  assert.equal(records.length, 1);
  assert.equal(records[0].id, '2501.01234');
  assert.equal(records[0].venue, 'ICLR');
  assert.equal(records[0].award, 'spotlight');
  assert.deepEqual(records[0].sourceIds, ['arxiv', 'hf']);
});

test('matches explicit neurosymbolic phrases', () => {
  assert.deepEqual(matchedKeywords('Neuro-symbolic and NeSy systems'), ['neuro-symbolic', 'NeSy']);
});

test('normalizes OpenReview notes into the website schema', () => {
  const record = openReviewNoteToRecord({
    id: 'abc123',
    content: {
      title: { value: 'A Neurosymbolic Model' },
      abstract: { value: 'A model.' },
      authors: { value: ['Ada Lovelace'] },
      authorids: { value: ['~Ada_Lovelace1'] }
    }
  }, { id: 'iclr', venue: 'ICLR' }, 'ICLR.cc/2025/Conference');
  assert.equal(record.id, 'openreview:abc123');
  assert.equal(record.year, 2025);
  assert.deepEqual(record.authors, ['Ada Lovelace']);
  assert.equal(record.pdfUrl, 'https://openreview.net/pdf?id=abc123');
});

test('extracts DBLP TOC links and paper records', () => {
  const index = '<a class="toc-link" href="nesy2025.html">contents</a>';
  assert.deepEqual(parseDblpTocLinks(index, 'https://dblp.org/db/conf/nesy/index.html'), [
    'https://dblp.org/db/conf/nesy/nesy2025.html'
  ]);
  const toc = `<li class="entry inproceedings" id="conf/nesy/Test25">
    <span itemprop="name" title="Ada Lovelace"></span>
    <span class="title" itemprop="name">A Neural-Symbolic System.</span>
    <span itemprop="datePublished">2025</span>
    <li class="ee"><a href="https://example.org/paper.pdf">paper</a></li>
  </li>`;
  const records = parseDblpToc(toc, { id: 'nesy', venue: 'NeSy', include: 'all' }, 'https://dblp.org/toc');
  assert.equal(records[0].title, 'A Neural-Symbolic System.');
  assert.deepEqual(records[0].authors, ['Ada Lovelace']);
  assert.equal(records[0].pdfUrl, 'https://example.org/paper.pdf');
});

test('extracts official IJCAI paper metadata and PDF links', () => {
  const html = `<div id="paper42" class="paper_wrapper"><div class="title">A Neuro-Symbolic System</div><div class="authors">Ada Lovelace, Alan Turing</div><div class="details">(<a href="0042.pdf">PDF</a> | <a href="/proceedings/2025/42"> Details</a>)</div></div>`;
  const records = parseIjcaiProceedings(
    html,
    { id: 'ijcai-proceedings', venue: 'IJCAI' },
    { year: 2025, url: 'https://www.ijcai.org/proceedings/2025/' }
  );
  assert.equal(records.length, 1);
  assert.equal(records[0].conference, 'IJCAI');
  assert.deepEqual(records[0].authors, ['Ada Lovelace', 'Alan Turing']);
  assert.equal(records[0].pdfUrl, 'https://www.ijcai.org/proceedings/2025/0042.pdf');
  assert.equal(records[0].qualifies, true);
});

test('extracts abstracts and citation metadata from IJCAI detail pages', () => {
  const html = `<meta name="citation_title" content="A Neuro-Symbolic System" />
    <meta name="citation_author" content="Ada Lovelace" />
    <meta name="citation_publication_date" content="2025/09/16" />
    <meta name="citation_pdf_url" content="https://www.ijcai.org/proceedings/2025/0042.pdf" />
    <meta name="citation_doi" content="10.24963/ijcai.2025/42" />
    <hr><div class="row"><div class="col-md-12">This is the official abstract.</div>
    <div class="col-md-12"><div class="keywords"><div class="topic">Neuro-symbolic methods</div></div></div>`;
  assert.deepEqual(parseIjcaiDetail(html), {
    title: 'A Neuro-Symbolic System',
    abstract: 'This is the official abstract.',
    authors: ['Ada Lovelace'],
    keywords: ['Neuro-symbolic methods'],
    doi: '10.24963/ijcai.2025/42',
    pdfUrl: 'https://www.ijcai.org/proceedings/2025/0042.pdf',
    published: '2025-09-16'
  });
});

test('extracts complete paper metadata from GROBID TEI', () => {
  const tei = `<TEI><teiHeader><fileDesc><titleStmt><title level="a">Paper Title</title></titleStmt>
    <sourceDesc><biblStruct><analytic><author><persName><forename>Ada</forename><surname>Lovelace</surname></persName>
    <affiliation><orgName type="department">Computer Science</orgName><orgName type="institution">Example University</orgName></affiliation>
    </author></analytic></biblStruct></sourceDesc>
    </fileDesc><profileDesc><abstract><p>Paper abstract.</p></abstract><textClass><keywords><term>reasoning</term></keywords></textClass></profileDesc></teiHeader>
    <idno type="DOI">10.1000/example</idno></TEI>`;
  assert.deepEqual(parseGrobidHeader(tei), {
    title: 'Paper Title',
    abstract: 'Paper abstract.',
    authors: ['Ada Lovelace'],
    authorAffiliations: [{ name: 'Ada Lovelace', affiliations: ['Example University'] }],
    affiliations: ['Example University'],
    keywords: ['reasoning'],
    doi: '10.1000/example'
  });
});

test('rejects empty GROBID metadata caches', () => {
  assert.equal(hasExtractedMetadata({
    title: '', abstract: '', authors: [], affiliations: [], keywords: [], doi: ''
  }), false);
  assert.equal(hasExtractedMetadata({ title: 'Recovered title' }), true);
});

test('applies GROBID metadata without replacing an existing abstract', () => {
  const paper = completePaper({
    id: 'paper-1',
    title: 'Discovery title',
    abstract: 'Trusted first-round abstract.',
    authors: ['Discovery Author'],
    authorAffiliations: [],
    affiliations: [],
    keywords: ['discovery keyword'],
    doi: '10.1000/discovery',
    venue: 'NeSy',
    year: 2025,
    published: '2025-01-01',
    url: 'https://example.org/paper',
    pdfUrl: 'https://example.org/paper.pdf',
    sourceType: 'test',
    sourceId: 'test'
  }, {
    title: 'GROBID title',
    abstract: 'Extracted abstract.',
    authors: ['Ada Lovelace'],
    authorAffiliations: [{ name: 'Ada Lovelace', affiliations: ['Example University'] }],
    affiliations: ['Example University'],
    keywords: ['grobid keyword'],
    doi: '10.1000/grobid'
  });

  assert.equal(paper.title, 'GROBID title');
  assert.equal(paper.abstract, 'Trusted first-round abstract.');
  assert.deepEqual(paper.authors, ['Ada Lovelace']);
  assert.deepEqual(paper.affiliations, ['Example University']);
  assert.deepEqual(paper.keywords, ['grobid keyword']);
  assert.equal(paper.doi, '10.1000/grobid');
  assert.equal(paper.doiUrl, 'https://doi.org/10.1000/grobid');
});

test('resolves conservative author and institution aliases while preserving raw values', () => {
  const base = {
    abstract: 'Abstract', keywords: [], categories: [], venue: 'NeSy', conference: 'NeSy',
    year: 2025, published: '2025-01-01', url: '', pdfUrl: '', doi: '', arxivId: '',
    metadataComplete: true
  };
  const resolved = resolveCorpusEntities([
    {
      ...base,
      id: 'one',
      title: 'Paper One',
      doi: '10.1000/one',
      authors: ['Lovelace, Ada'],
      affiliations: ['Massachusetts Institute of Technology'],
      authorAffiliations: [{
        name: 'Lovelace, Ada', affiliations: ['Massachusetts Institute of Technology']
      }]
    },
    {
      ...base,
      id: 'two',
      title: 'Paper Two',
      authors: ['Ada Lovelace'],
      affiliations: ['MIT'],
      authorAffiliations: [{ name: 'Ada Lovelace', affiliations: ['MIT'] }]
    }
  ]);

  assert.equal(resolved.entities.authors.length, 1);
  assert.equal(resolved.entities.authors[0].paperCount, 2);
  assert.equal(resolved.entities.institutions.length, 1);
  assert.equal(resolved.entities.institutions[0].name, 'Massachusetts Institute of Technology');
  assert.deepEqual(resolved.entities.institutions[0].aliases, ['MIT', 'Massachusetts Institute of Technology']);
  assert.deepEqual(resolved.papers[1].rawAffiliations, ['MIT']);
  assert.deepEqual(resolved.papers[1].affiliations, ['Massachusetts Institute of Technology']);
  assert.match(resolved.papers[0].entityId, /^paper:[a-f0-9]{16}$/);
  assert.notEqual(resolved.papers[0].entityId, resolved.papers[1].entityId);
});

test('worker pool respects its concurrency bound', async () => {
  let active = 0;
  let peak = 0;
  await runWorkerPool([1, 2, 3, 4, 5, 6], 3, async () => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 5));
    active -= 1;
  });
  assert.equal(peak, 3);
});

test('download selection skips known failures unless retrying explicitly', () => {
  const papers = [
    { id: 'done', pdfUrl: 'done.pdf', downloadStatus: 'downloaded' },
    { id: 'failed', pdfUrl: 'failed.pdf', downloadStatus: 'error' },
    { id: 'new', pdfUrl: 'new.pdf' }
  ];
  assert.deepEqual(selectDownloadCandidates(papers).map((paper) => paper.id), ['new']);
  assert.deepEqual(selectDownloadCandidates(papers, true).map((paper) => paper.id), ['new', 'failed']);
});

test('arXiv fallback accepts only the same work, not a merely similar paper', () => {
  const paper = {
    title: 'Neuro-Symbolic Reasoning for Visual Question Answering',
    authors: ['Ada Lovelace', 'Alan Turing'],
    year: 2025
  };
  assert.equal(sameWorkCandidate(paper, {
    title: 'Neuro Symbolic Reasoning for Visual Question Answering',
    authors: ['Ada Lovelace'],
    year: 2024
  }), true);
  assert.equal(sameWorkCandidate(paper, {
    title: 'Neuro-Symbolic Reasoning for Visual Question Generation',
    authors: ['Different Author'],
    year: 2025
  }), false);
});
