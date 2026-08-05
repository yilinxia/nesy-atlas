const organizations = [
  {
    name: 'AUI', initials: 'AUI', website: 'https://www.aui.io/',
    linkedin: 'https://www.linkedin.com/company/augmented-intelligence-inc/',
    ceoName: 'Amir Shabani', ceoLinkedin: 'https://www.linkedin.com/in/amir-shabani-ph-d-p-eng-81135a22/', ceoSince: '2020-01',
    favicon: 'https://www.aui.io/favicon-32x32.png', product: 'Apollo-1',
    industry: 'Conversational AI', location: 'New York, US', funding: '$20M round (2025)',
    fundingUrl: 'https://www.prnewswire.com/news-releases/aui-raises-20-million-at-750-million-valuation-cap-following-breakthrough-in-neuro-symbolic-ai-302602677.html',
    postTitle: 'Neuro-Symbolic AI: with Ohad Elhelo and Nicholas Thompson', postDate: '2025-10-17',
    postUrl: 'https://www.aui.io/resources/neuro-symbolic-ai-with-ohad-elhelo-and-nicholas-thompson/', color: '#202020'
  },
  {
    name: 'Beyond AI', initials: 'BA', website: 'https://www.beyond.ai/',
    linkedin: 'https://www.linkedin.com/company/beyond-ai/',
    ceoName: 'AJ Abdallat', ceoLinkedin: 'https://www.linkedin.com/in/ajabdallat/', ceoSince: '2014-04',
    favicon: 'https://cdn.prod.website-files.com/66fa4dc606c7344f4b994f9a/6995097a786449c2691b10e5_favicon-32x32.png',
    product: 'Industrial AI Platform', industry: 'Energy & Industrial', location: 'California, US',
    funding: '$133M Series C (2020)',
    fundingUrl: 'https://www.finsmes.com/2020/09/beyond-limits-raises-133m-in-series-c-funding.html',
    postTitle: 'Neuro-symbolic AI Explained: What It Is & Why It Matters', postDate: '2026-02-16',
    postUrl: 'https://www.beyond.ai/blog/what-is-neuro-symbolic-ai', color: '#156b78'
  },
  {
    name: 'Cognaize', initials: 'CG', website: 'https://www.cognaize.com/',
    linkedin: 'https://www.linkedin.com/company/cognaize/',
    ceoName: 'Vahe Andonians', ceoLinkedin: 'https://www.linkedin.com/in/vaheandonians/', ceoSince: '2018-04',
    favicon: 'https://www.cognaize.com/hubfs/dot-rgb-cognaize-royal-favicon.svg',
    product: 'Hybrid Intelligence Platform', industry: 'Financial Services', location: 'California, US',
    funding: '$18M Series A (2023)',
    fundingUrl: 'https://blog.cognaize.com/cognaize-raises-18m-to-build-a-better-llm-for-the-finance-sector',
    postTitle: 'Why Financial Spreading Is Still Broken in 2025 and How AI Fixes It', postDate: '2025-11-07',
    postUrl: 'https://blog.cognaize.com/why-financial-spreading-is-still-broken-in-2025-and-how-ai-fixes-it', color: '#176b57'
  },
  {
    name: 'CogniSwitch', initials: 'CS', website: 'https://cogniswitch.ai/',
    linkedin: 'https://www.linkedin.com/company/cogniswitch-inc/',
    ceoName: 'Dilip Ittyera', ceoLinkedin: 'https://www.linkedin.com/in/dilipti/', ceoSince: '2022-04',
    favicon: 'https://cogniswitch.ai/favicon.ico', product: 'Neuro-symbolic Trust Layer',
    industry: 'Healthcare', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: '', postDate: '', postUrl: '', color: '#316f68'
  },
  {
    name: 'DaaX', initials: 'DX', website: 'https://daax.ai/',
    linkedin: 'https://www.linkedin.com/company/daax-ai/',
    ceoName: 'Sunil Baliga', ceoLinkedin: 'https://www.linkedin.com/in/sunil-baliga/', ceoSince: '2024-11',
    favicon: 'https://daax.ai/favicon.ico', product: 'Agentic Enterprise Search',
    industry: 'Enterprise Search', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Autonomous Auditing and the Knowledge Problem', postDate: '2026-04-16',
    postUrl: 'https://daax.ai/blog/autonomous-auditing', color: '#21295b'
  },
  {
    name: 'expert.ai', initials: 'eAI', website: 'https://www.expert.ai/',
    linkedin: 'https://www.linkedin.com/company/expert-ai/',
    ceoName: 'Dario Pardi', ceoLinkedin: 'https://www.linkedin.com/in/dario-pardi-aa834b8/', ceoSince: '2023-07',
    favicon: 'https://d2bd3fvxio3enu.cloudfront.net/expertai2025/uploads/2025/04/cropped-favicon-png-32x32.avif',
    product: 'EidenAI Suite', industry: 'Enterprise NLP', location: 'Emilia-Romagna, Italy',
    funding: 'Public (EXAI)', fundingUrl: 'https://www.expert.ai/investors/',
    postTitle: 'Expert.ai and Fincons Bring Neuro-Symbolic AI to Data-Driven Businesses', postDate: '2026-05-25',
    postUrl: 'https://www.expert.ai/news/expert-ai-and-fincons-group-join-forces-to-bring-neuro-symbolic-ai-to-data-driven-businesses/', color: '#d44b32'
  },
  {
    name: 'ExtensityAI', initials: 'EX', website: 'https://www.extensity.ai/',
    linkedin: 'https://www.linkedin.com/company/extensityai/',
    ceoName: 'Thomas N.', ceoLinkedin: 'https://www.linkedin.com/in/thomas-n-08b31370/', ceoSince: '2024-03',
    favicon: 'https://framerusercontent.com/images/USE7pqix9s7NoahhFPQipfDaDok.svg', product: 'SymbolicAI',
    industry: 'Research Automation', location: 'Upper Austria, Austria', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'The SymbolicAI Framework', postDate: '',
    postUrl: 'https://www.extensity.ai/whitepaper/symbolicai-framework', color: '#7147b8'
  },
  {
    name: 'Franz Inc.', initials: 'F', website: 'https://franz.com/',
    linkedin: 'https://www.linkedin.com/company/franz-inc/', favicon: 'https://franz.com/images/favicon.ico',
    ceoName: 'Jans Aasman', ceoLinkedin: 'https://www.linkedin.com/in/jans-aasman/', ceoSince: '2006-02',
    product: 'AllegroGraph', industry: 'Knowledge Graphs', location: 'California, US',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'The Rise of Neuro-Symbolic AI: Gartner 2025 AI Hype Cycle', postDate: '2025-07-28',
    postUrl: 'https://allegrograph.com/the-rise-of-neuro-symbolic-ai-a-spotlight-in-gartners-2025-ai-hype-cycle/', color: '#be3e33'
  },
  {
    name: 'Growth Protocol', initials: 'GP', website: 'https://www.growthprotocol.ai/',
    linkedin: 'https://www.linkedin.com/company/growthprotocolai/',
    ceoName: 'Miroslav Dimitrov', ceoLinkedin: 'https://www.linkedin.com/in/mirodimitrov/', ceoSince: '2024-11',
    favicon: 'https://www.growthprotocol.ai/favicon.ico', product: 'Enterprise Reasoning Platform',
    industry: 'Decision Intelligence', location: 'New York, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: '', postDate: '', postUrl: '', color: '#6b4d2e'
  },
  {
    name: 'icogz', initials: 'IC', website: 'https://www.icogz.com/',
    linkedin: 'https://www.linkedin.com/company/icogz/',
    ceoName: 'Amit Tripathi', ceoLinkedin: 'https://www.linkedin.com/in/amitt/', ceoSince: '2018-06',
    favicon: 'https://framerusercontent.com/images/qBvmLNzKoLpEu6fCTv5Hc2WMlg0.png', product: 'Aryabot',
    industry: 'Business Intelligence', location: 'Dubai, UAE', funding: '$1.4M pre-seed (2025)',
    fundingUrl: 'https://www.thesaasnews.com/news/icogz-raises-1-4-million-in-pre-seed-round/',
    postTitle: '', postDate: '', postUrl: '', color: '#08759a'
  },
  {
    name: 'Imandra', initials: 'IM', website: 'https://www.imandra.ai/',
    linkedin: 'https://www.linkedin.com/company/imandra/',
    ceoName: 'Grant Olney Passmore', ceoLinkedin: 'https://www.linkedin.com/in/grantolneypassmore/', ceoSince: '2014-04',
    favicon: 'https://www.imandra.ai/favicon/favicon.png', product: 'Imandra Universe',
    industry: 'Formal Verification', location: 'Texas, US', funding: '$9.9M disclosed',
    fundingUrl: 'https://www.dealdata.net/company-profile/0001765781/',
    postTitle: 'Imandra Universe: Neurosymbolic AI Agents with Logical Reasoning', postDate: '2025-06-04',
    postUrl: 'https://www.imandra.ai/articles/imandra-universe-launch', color: '#5b47aa'
  },
  {
    name: 'Kognitos', initials: 'KO', website: 'https://www.kognitos.com/',
    linkedin: 'https://www.linkedin.com/company/kognitos/',
    ceoName: 'Binny Gill', ceoLinkedin: 'https://www.linkedin.com/in/binnygill/', ceoSince: '2021-01',
    favicon: 'https://www.kognitos.com/img/favicon.png', product: 'Kognitos', industry: 'Process Automation',
    location: 'California, US', funding: '$25M Series B',
    fundingUrl: 'https://www.kognitos.com/news/kognitos-launches-neurosymbolic-ai-platform-for-automating-business-operations-backed-by-25m-series-b/',
    postTitle: 'Kognitos Raises Series B for Neurosymbolic AI',
    postDate: '2026-04-10',
    postUrl: 'https://www.kognitos.com/news/kognitos-launches-neurosymbolic-ai-platform-for-automating-business-operations-backed-by-25m-series-b/', color: '#d75436'
  },
  {
    name: 'Kortexya', initials: 'KX', website: 'https://kortexya.com/',
    linkedin: 'https://www.linkedin.com/company/kortexya/', favicon: 'https://kortexya.com/favicon.ico',
    ceoName: 'David Loiret', ceoLinkedin: 'https://www.linkedin.com/in/david-loiret/', ceoSince: '2025-05',
    product: 'ReasoningLayer', industry: 'Enterprise AI Infrastructure', location: 'Grand Est, France',
    funding: 'Bpifrance grant', fundingUrl: 'https://lafrenchtechest.fr/startup/kortexya-ak7z/',
    postTitle: '', postDate: '', postUrl: '', color: '#394cc8'
  },
  {
    name: 'Lakmoos', initials: 'LK', website: 'https://lakmoos.com/',
    linkedin: 'https://www.linkedin.com/company/lakmoos/',
    ceoName: 'Kamila Zahradnickova', ceoLinkedin: 'https://www.linkedin.com/in/kamila-zahradnickova/', ceoSince: '2023-06',
    favicon: 'https://framerusercontent.com/images/0mjREm7vY2D4GrHhBYxIbAHOEA0.png', product: 'Lakmoos AI',
    industry: 'Market Research', location: 'South Moravian, Czechia', funding: '€300K pre-seed (2024)',
    fundingUrl: 'https://www.vestbee.com/insights/articles/czech-lakmoos-raises-300k-from-presto-ventures',
    postTitle: 'Neuro-symbolic AI: Why Explainability Matters in Market Research', postDate: '2025-08-20',
    postUrl: 'https://lakmoos.com/blog/neuro-symbolic-ai', color: '#a34167'
  },
  {
    name: 'Logical Intelligence', initials: 'LI', website: 'https://logicalintelligence.com/',
    linkedin: 'https://www.linkedin.com/company/logical-intelligence/',
    ceoName: 'Eve Bodnia', ceoLinkedin: 'https://www.linkedin.com/in/eve-bodnia-351b41355/', ceoSince: '2025-01',
    favicon: 'https://framerusercontent.com/images/xAxeJPFxOsjXbeP6wP6ChkJieT0.png',
    product: 'Kona 1.0 / Aleph', industry: 'Critical Systems AI', location: 'California, US',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Automatic Formal Verification for Code Generation', postDate: '2026-06-03',
    postUrl: 'https://logicalintelligence.com/blog/automatic-formal-verification-for-code-generation', color: '#c44632'
  },
  {
    name: 'NeuroFusion', initials: 'NF', website: 'https://neurofusion.ai/en/',
    linkedin: 'https://www.linkedin.com/company/neurofusion/',
    ceoName: 'Hans Choi', ceoLinkedin: 'https://www.linkedin.com/in/hanchul/', ceoSince: '2022-01',
    favicon: 'https://neurofusion.ai/static/img/favicon.ico?v=1.0.0', product: 'Valley AI',
    industry: 'FinTech & Investing', location: 'Gyeonggi, South Korea', funding: 'Not disclosed', fundingUrl: '',
    postTitle: '', postDate: '', postUrl: '', color: '#1764a1'
  },
  {
    name: 'Onteric', initials: 'ON', website: 'https://www.onteric.com/',
    linkedin: 'https://www.linkedin.com/company/onteric/',
    ceoName: 'Jen Lothian', ceoLinkedin: 'https://www.linkedin.com/in/jjlothian/', ceoSince: '2022-07',
    favicon: 'https://cdn.prod.website-files.com/6a1ea9eb23a5f0abcf6c5c04/6a24639580346fdd1523423b_onteric-icon-light-tight.png',
    product: 'Onteric', industry: 'Financial Services', location: 'Wales, UK', funding: '£1.3M pre-seed (2026)',
    fundingUrl: 'https://businesscloud.co.uk/news/female-angels-back-former-british-army-captains-datawollet/',
    postTitle: '', postDate: '', postUrl: '', color: '#315f4c'
  },
  {
    name: 'Onton', initials: 'OT', website: 'https://onton.com/',
    linkedin: 'https://www.linkedin.com/company/onton-ai/',
    ceoName: 'Zach Hudson', ceoLinkedin: 'https://www.linkedin.com/in/hudsonzp/', ceoSince: '2022-04',
    favicon: 'favicons/onton.png',
    product: 'AI Shopping Assistant', industry: 'Software Development', location: 'California, US',
    funding: '~$10M total (2025)',
    fundingUrl: 'https://techcrunch.com/2025/11/26/onton-raises-7-5m-to-expand-its-ai-powered-shopping-site-beyond-furniture/',
    postTitle: '', postDate: '', postUrl: '', color: '#d05b3f'
  },
  {
    name: 'Permion', initials: 'PE', website: 'https://www.permion.ai/',
    linkedin: 'https://www.linkedin.com/company/permion/',
    ceoName: 'Arun Majumdar', ceoLinkedin: 'https://www.linkedin.com/in/arun-majumdar-8a555336/', ceoSince: '2018-03',
    favicon: 'https://www.permion.ai/wp-content/uploads/2025/01/cropped-permion-logo_icon-192x192.png', product: 'Permion AI',
    industry: 'Mission-Critical AI', location: 'Virginia, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'What Sets Permion Apart? Neurosymbolic AI and Large Graph Models', postDate: '2025-11-20',
    postUrl: 'https://www.permion.ai/what-sets-permion-apart-from-others-neurosymbolic-ai-large-graph-models/', color: '#405a67'
  },
  {
    name: 'RAAPID', initials: 'RP', website: 'https://www.raapidinc.com/',
    linkedin: 'https://www.linkedin.com/company/raapid/',
    ceoName: 'Chetan Parikh', ceoLinkedin: 'https://www.linkedin.com/in/chetanparikh/', ceoSince: '2022-02',
    favicon: 'https://www.raapidinc.com/favicon.ico', product: 'Risk Adjustment Platform', industry: 'Healthcare',
    location: 'Kentucky, US', funding: '$6.7M disclosed',
    fundingUrl: 'https://www.cbinsights.com/company/raapid/financials',
    postTitle: 'Neuro-Symbolic AI for Automated Medical Coding and Risk Adjustment', postDate: '2026-05-20',
    postUrl: 'https://www.raapidinc.com/labs/neuro-symbolic-ai-automated-medical-coding-risk-adjustment/', color: '#0c6d7b'
  },
  {
    name: 'Reshuffle AI', initials: 'RS', website: 'https://reshuffleai.com/',
    linkedin: 'https://www.linkedin.com/company/reshuffle-ai/',
    ceoName: 'Sameer Koul', ceoLinkedin: 'https://www.linkedin.com/in/samkoul/', ceoSince: '2023-01',
    favicon: 'https://reshuffleai.com/favicon.ico', product: 'Reasonex', industry: 'Regulated Industries',
    location: 'Singapore, Singapore', funding: 'Not disclosed', fundingUrl: '',
    postTitle: '', postDate: '', postUrl: '', color: '#8f3746'
  },
  {
    name: 'Rippletide', initials: 'RT', website: 'https://www.rippletide.com/',
    linkedin: 'https://www.linkedin.com/company/rippletide/',
    ceoName: 'Patrick Joubert', ceoLinkedin: 'https://www.linkedin.com/in/patrick-joubert-%F0%9F%A7%A2-9028231/', ceoSince: '2024-02',
    favicon: 'https://www.rippletide.com/favicon.ico', product: 'Decision Runtime', industry: 'AI Agent Infrastructure',
    location: 'Ile-de-France, France', funding: '€4M seed (2025)',
    fundingUrl: 'https://www.oneragtime.com/stories/rippletide-seed-4m-europe-us',
    postTitle: '', postDate: '', postUrl: '', color: '#623d8f'
  },
  {
    name: 'Symbolica', initials: 'SY', website: 'https://www.symbolica.ai/',
    linkedin: 'https://www.linkedin.com/company/symbolica-ai/',
    ceoName: 'George Morgan', ceoLinkedin: 'https://www.linkedin.com/in/georgemorgan2/', ceoSince: '2022-07',
    favicon: 'https://www.symbolica.ai/favicon-symbolica.png', product: 'Agentica',
    industry: 'AI Agent Infrastructure', location: 'California, US', funding: '$33M total (2024)',
    fundingUrl: 'https://siliconangle.com/2024/04/09/symbolica-launches-33m-change-ai-industry-symbolic-models/',
    postTitle: 'Neural + Symbolic', postDate: '',
    postUrl: 'https://www.symbolica.ai/research', color: '#7678e3'
  },
  {
    name: 'Synalinks', initials: 'SL', website: 'https://www.synalinks.com/',
    linkedin: 'https://www.linkedin.com/company/synalinks/',
    ceoName: 'Yoan Sallami', ceoLinkedin: 'https://www.linkedin.com/in/yoan-sallami/', ceoSince: '2023-09',
    favicon: 'https://www.synalinks.com/favicon.svg', product: 'Synalinks', industry: 'AI Agent Infrastructure',
    location: 'Occitanie, France', funding: 'Not disclosed', fundingUrl: '',
    postTitle: '', postDate: '', postUrl: '', color: '#286f63'
  },
  {
    name: 'UMNAI', initials: 'UM', website: 'https://umnai.com/',
    linkedin: 'https://www.linkedin.com/company/umnai/',
    ceoName: 'Angelo Dalli', ceoLinkedin: 'https://www.linkedin.com/in/angelodalli/', ceoSince: '2019-04',
    favicon: 'https://umnai.com/__l5e/assets-v1/cb515d94-bfd9-42ac-b900-6051f0fedd97/umnai-logo-footer.png',
    product: 'Hybrid Intelligence', industry: 'Decision Intelligence', location: 'England, UK',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'What Is Neuro-Symbolic AI? A Technical Introduction', postDate: '2026-07-27',
    postUrl: 'https://umnai.com/research/technical-insights/foundations/neuro-symbolic-ai', color: '#a86a11'
  },
  {
    name: 'Uniphore', initials: 'UP', website: 'https://www.uniphore.com/',
    linkedin: 'https://www.linkedin.com/company/uniphore',
    ceoName: 'Umesh Sachdev', ceoLinkedin: 'https://www.linkedin.com/in/umeshsachdev/', ceoSince: '2008-04',
    favicon: 'https://www.uniphore.com/wp-content/uploads/2025/12/cropped-Uniphore–Bug–Gradient–Light-192x192.webp',
    product: 'Business AI Cloud', industry: 'Business AI', location: 'California, US',
    funding: '$260M Series F (2025)',
    fundingUrl: 'https://www.uniphore.com/press-releases/nvidia-amd-snowflake-databricks-invest-in-uniphores-series-f/',
    postTitle: 'A Look Inside Uniphore\'s AI Research and Innovation Strategy', postDate: '2026-01-30',
    postUrl: 'https://www.uniphore.com/blog/a-look-inside-uniphores-ai-research-and-innovation-strategy/', color: '#2d88a4'
  },
  {
    name: 'UnlikelyAI', initials: 'UA', website: 'https://www.unlikely.ai/',
    linkedin: 'https://www.linkedin.com/company/unlikely-ai/', favicon: 'https://www.unlikely.ai/favicon.ico',
    ceoName: 'William Tunstall-Pedoe', ceoLinkedin: 'https://www.linkedin.com/in/williamtp/', ceoSince: '2019-01',
    product: 'UnlikelyAI Platform', industry: 'Trustworthy AI', location: 'England, UK', funding: '$20M seed (2022)',
    fundingUrl: 'https://www.unlikely.ai/newsroom/unlikely-ai-raises-20-million-in-oversubscribed-seed-round',
    postTitle: 'Neurosymbolic AI Explained (with Legislation Example)', postDate: '2026-04-17',
    postUrl: 'https://www.unlikely.ai/newsroom/neurosymbolic-ai-explained-with-legislation-example', color: '#402f73'
  }
];

const state = { query: '', country: '', sortKey: 'name', sortDirection: 'asc' };

const elements = {
  tbody: document.querySelector('#company-table tbody'),
  search: document.querySelector('#search'),
  count: document.querySelector('#org-count'),
  clearSearch: document.querySelector('#clear-search'),
  empty: document.querySelector('#empty-state'),
  sortableHeaders: [...document.querySelectorAll('th.sortable')],
  modal: document.querySelector('#modal'),
  help: document.querySelector('#help'),
  close: document.querySelector('#close'),
  methodLinks: [document.querySelector('#footer-method-link')]
};

const externalIcon = `
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const linkedinIcon = `
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 17.34V9.67H5.79v7.67h2.55M7.07 8.57a1.48 1.48 0 1 0-.01-2.96 1.48 1.48 0 0 0 .01 2.96m11.14 8.77v-4.21c0-2.25-1.2-3.29-2.83-3.29a2.8 2.8 0 0 0-2.55 1.4V9.67h-2.55v7.67h2.55v-3.8c0-1 .19-1.97 1.43-1.97s1.24 1.14 1.24 2.04v3.73h2.71Z"></path>
  </svg>`;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function searchableText(organization) {
  return [
    organization.name,
    organization.ceoName,
    organization.ceoSince,
    organization.product,
    organization.industry,
    organization.location,
    organization.funding,
    organization.postTitle,
    organization.postDate
  ].join(' ').toLowerCase();
}

function locationCountry(location) {
  if (!location || location === 'Not disclosed') return '';
  return location.split(',').at(-1).trim();
}

function matchingOrganizations() {
  const query = state.query.trim().toLowerCase();
  const matches = organizations.filter((organization) => {
    if (state.country && locationCountry(organization.location) !== state.country) return false;
    return !query || searchableText(organization).includes(query);
  });

  return matches.sort((a, b) => {
    const aValue = a[state.sortKey] ?? '';
    const bValue = b[state.sortKey] ?? '';

    if (state.sortKey === 'postDate') {
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
    }

    const comparison = String(aValue).localeCompare(
      String(bValue),
      undefined,
      { sensitivity: 'base', numeric: true }
    );
    return state.sortDirection === 'asc' ? comparison : -comparison;
  });
}

function fundingTemplate(organization) {
  const label = escapeHtml(organization.funding);
  if (!organization.fundingUrl) return `<span class="muted-value">${label}</span>`;
  return `<a class="value-link" href="${escapeHtml(organization.fundingUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function locationTemplate(location) {
  const country = locationCountry(location);
  if (!country) return escapeHtml(location);
  const selected = state.country === country;
  const action = selected ? 'Clear' : 'Filter by';
  return `<button class="location-filter" type="button" data-country-filter="${escapeHtml(country)}" aria-pressed="${selected}" aria-label="${action} ${escapeHtml(country)}">${escapeHtml(location)}</button>`;
}

function ceoTemplate(organization) {
  return `<a class="ceo-link" href="${escapeHtml(organization.ceoLinkedin)}" target="_blank" rel="noopener noreferrer">
    <span>${escapeHtml(organization.ceoName)}</span>${externalIcon}
  </a>`;
}

function formatCeoSince(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
    .format(new Date(`${date}-01T00:00:00`));
}

function formatPostDate(date) {
  if (!date) return 'Undated';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T00:00:00`));
}

function postTemplate(organization) {
  if (!organization.postUrl) return '<span class="muted-value">None found</span>';
  const date = formatPostDate(organization.postDate);
  const label = `${organization.postTitle}, ${date}`;
  return `
    <a class="post-link" href="${escapeHtml(organization.postUrl)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(organization.postTitle)}" aria-label="${escapeHtml(label)}">
      <span class="post-date">${escapeHtml(date)}</span>
      <span class="post-title">${escapeHtml(organization.postTitle)}</span>
    </a>`;
}

function rowTemplate(organization) {
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const linkedin = organization.linkedin
    ? `<a class="company-linkedin" href="${escapeHtml(organization.linkedin)}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(organization.name)} on LinkedIn" aria-label="${escapeHtml(organization.name)} on LinkedIn">${linkedinIcon}</a>`
    : '';

  return `
    <tr>
      <td class="sticky-name-column">
        <div class="database-cell">
          <span class="company-icon" style="--company-color:${escapeHtml(organization.color)}" aria-hidden="true">
            ${escapeHtml(organization.initials)}
            ${favicon}
          </span>
          <span class="company-title">
            <a class="company-homepage" href="${escapeHtml(organization.website)}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(organization.name)} homepage">${escapeHtml(organization.name)}</a>
            ${linkedin}
          </span>
        </div>
      </td>
      <td>${ceoTemplate(organization)}</td>
      <td>${escapeHtml(formatCeoSince(organization.ceoSince))}</td>
      <td>${escapeHtml(organization.product)}</td>
      <td>${escapeHtml(organization.industry)}</td>
      <td>${locationTemplate(organization.location)}</td>
      <td>${fundingTemplate(organization)}</td>
      <td class="post-cell">${postTemplate(organization)}</td>
    </tr>`;
}

function updateSortIndicators() {
  elements.sortableHeaders.forEach((header) => {
    const indicator = header.querySelector('.sort-indicator');
    if (!indicator) return;
    indicator.textContent = header.dataset.key === state.sortKey
      ? state.sortDirection === 'asc' ? '↑' : '↓'
      : '';
  });
}

function render() {
  const matches = matchingOrganizations();
  elements.tbody.innerHTML = matches.map(rowTemplate).join('');
  elements.tbody.querySelectorAll?.('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });
  elements.count.textContent = matches.length === organizations.length
    ? String(organizations.length)
    : `${matches.length} / ${organizations.length}`;
  elements.clearSearch.hidden = !state.query && !state.country;
  elements.empty.hidden = matches.length !== 0;
  updateSortIndicators();
}

function clearSearch() {
  state.query = '';
  state.country = '';
  elements.search.value = '';
  render();
}

function openAbout() {
  if (typeof elements.modal.showModal === 'function') elements.modal.showModal();
}

function closeAbout() {
  elements.modal.close();
}

elements.search.addEventListener('input', (event) => {
  state.country = '';
  state.query = event.target.value;
  render();
});

elements.search.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearSearch();
    elements.search.blur();
  }
});

elements.clearSearch.addEventListener('click', () => {
  clearSearch();
  elements.search.focus();
});

elements.sortableHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const key = header.dataset.key;
    if (!key) return;
    if (state.sortKey === key) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = key;
      state.sortDirection = key === 'postDate' ? 'desc' : 'asc';
    }
    render();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== elements.search) {
    event.preventDefault();
    elements.search.focus();
  }
});

document.addEventListener('click', (event) => {
  const locationFilter = event.target.closest('[data-country-filter]');
  if (locationFilter) {
    if (state.country === locationFilter.dataset.countryFilter) {
      clearSearch();
      return;
    }

    state.query = '';
    state.country = locationFilter.dataset.countryFilter;
    elements.search.value = state.country;
    render();
    return;
  }

  if (event.target.closest('[data-reset]')) {
    clearSearch();
    elements.search.focus();
  }
});

elements.help.addEventListener('click', openAbout);
elements.methodLinks.forEach((link) => link?.addEventListener('click', openAbout));
elements.close.addEventListener('click', closeAbout);
elements.modal.addEventListener('cancel', closeAbout);
elements.modal.addEventListener('click', (event) => {
  if (event.target === elements.modal) closeAbout();
});

render();
