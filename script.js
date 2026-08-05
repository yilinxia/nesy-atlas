const organizations = [
  {
    name: 'AUI', initials: 'AUI', website: 'https://www.aui.io/',
    linkedin: 'https://www.linkedin.com/company/augmentedintelligence-aui/posts/?feedView=all',
    ceoName: 'Ohad Elhelo', ceoLinkedin: 'https://www.linkedin.com/in/ohadelhelo/', ceoSince: '2017-09',
    favicon: 'https://www.aui.io/favicon-32x32.png', product: 'Apollo-1',
    industry: 'Conversational AI', location: 'New York, US', funding: '$20M round (2025)',
    fundingUrl: 'https://venturebeat.com/ai/the-beginning-of-the-end-of-the-transformer-era-neuro-symbolic-ai-startup',
    postTitle: 'Welcoming Quack AI to AUI', postDate: '2026-02-23',
    postUrl: 'https://www.aui.io/resources/welcoming-quack-ai-to-aui/', color: '#202020'
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
    name: 'Bitterbot AI', initials: 'BB', website: 'https://bitterbot.ai/',
    linkedin: 'https://www.linkedin.com/company/bitterbot-ai/',
    ceoName: 'Victor Michael Gil', ceoLinkedin: 'https://www.linkedin.com/in/vmgil/', ceoSince: '2026-05',
    favicon: 'https://bitterbot.ai/favicon.svg', product: 'Bitterbot AI Agent',
    industry: 'Decentralized AI', location: 'Ontario, Canada', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'The "Vibes" Are Over: Why 2026 Belongs to Neuro-Symbolic AI', postDate: '2025-12-14',
    postUrl: 'https://victormgil.medium.com/the-vibes-are-over-why-2026-belongs-to-neuro-symbolic-ai-105575d361de', color: '#7c3aed'
  },
  {
    name: 'Cognaize', initials: 'CG', website: 'https://www.cognaize.com/',
    linkedin: 'https://www.linkedin.com/company/cognaize/',
    ceoName: 'Vahe Andonians', ceoLinkedin: 'https://www.linkedin.com/in/vaheandonians/', ceoSince: '2018-04',
    favicon: 'https://www.cognaize.com/hubfs/dot-rgb-cognaize-royal-favicon.svg',
    product: 'Hybrid Intelligence Platform', industry: 'Financial Services', location: 'California, US',
    funding: '$18M Series A (2023)',
    fundingUrl: 'https://blog.cognaize.com/cognaize-raises-18m-to-build-a-better-llm-for-the-finance-sector',
    postTitle: 'Cognaize joins FinTech Armenia Association as a Founding Member', postDate: '2026-05-27',
    postUrl: 'https://blog.cognaize.com/cognaize-joins-fintech-armenia-association-as-a-founding-member', color: '#176b57'
  },
  {
    name: 'CogniSwitch', initials: 'CS', website: 'https://cogniswitch.ai/',
    linkedin: 'https://www.linkedin.com/company/cogniswitch-inc/',
    ceoName: 'Dilip Ittyera', ceoLinkedin: 'https://www.linkedin.com/in/dilipti/', ceoSince: '2022-04',
    favicon: 'https://cogniswitch.ai/icon.png?icon.0r87w_.~ngn1k.png', product: 'Neuro-symbolic Trust Layer',
    industry: 'Healthcare', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Understanding How Model Bias Impacts Agents Outputs', postDate: '2026-06-19',
    postUrl: 'https://cogniswitch.ai/blog/bias-you-cant-locate', color: '#316f68'
  },
  {
    name: 'DaaX', initials: 'DX', website: 'https://daax.ai/',
    linkedin: 'https://www.linkedin.com/company/daax-ai/',
    ceoName: 'Sunil Baliga', ceoLinkedin: 'https://www.linkedin.com/in/sunil-baliga/', ceoSince: '2024-11',
    favicon: 'https://daax.ai/favicon.ico', product: 'Agentic Enterprise Search',
    industry: 'Enterprise Search', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Technical Note: LAKEer + UCP Verification Architecture', postDate: '2026-08-01',
    postUrl: 'https://daax.ai/blog/ucp-verification-technical-note', color: '#21295b'
  },
  {
    name: 'expert.ai', initials: 'eAI', website: 'https://www.expert.ai/',
    linkedin: 'https://www.linkedin.com/company/expert-ai/',
    ceoName: 'Dario Pardi', ceoLinkedin: 'https://www.linkedin.com/in/dario-pardi-aa834b8/', ceoSince: '2023-07',
    favicon: 'https://d2bd3fvxio3enu.cloudfront.net/expertai2025/uploads/2025/04/cropped-favicon-png-32x32.avif',
    product: 'EidenAI Suite', industry: 'Enterprise NLP', location: 'Emilia-Romagna, Italy',
    funding: 'Public (EXAI)', fundingUrl: 'https://www.expert.ai/investors/',
    postTitle: 'Explainable AI in Banking: Why Trust Matters', postDate: '2026-07-24',
    postUrl: 'https://www.expert.ai/blog/explainable-ai-in-banking-why-trust-matters/', color: '#d44b32'
  },
  {
    name: 'ExtensityAI', initials: 'EX', website: 'https://www.extensity.ai/',
    linkedin: 'https://www.linkedin.com/company/extensityai/',
    ceoName: 'Thomas N.', ceoLinkedin: 'https://www.linkedin.com/in/thomas-n-08b31370/', ceoSince: '2024-03',
    favicon: 'https://framerusercontent.com/images/USE7pqix9s7NoahhFPQipfDaDok.svg', product: 'SymbolicAI',
    industry: 'Research Automation', location: 'Upper Austria, Austria', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Trusted AI for Enterprise Knowledge', postDate: '2026-06-29',
    postUrl: 'https://www.extensity.ai/whitepaper/trusted-ai-for-enterprise-knowledge', color: '#7147b8'
  },
  {
    name: 'Franz Inc.', initials: 'F', website: 'https://franz.com/',
    linkedin: 'https://www.linkedin.com/company/franz-inc/', favicon: 'https://franz.com/images/favicon.ico',
    ceoName: 'Jans Aasman', ceoLinkedin: 'https://www.linkedin.com/in/jans-aasman/', ceoSince: '2006-02',
    product: 'AllegroGraph', industry: 'Knowledge Graphs', location: 'California, US',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'AllegroGraph named to the AI100', postDate: '2026-07-16',
    postUrl: 'https://allegrograph.com/allegrograph-named-to-the-ai100/', color: '#be3e33'
  },
  {
    name: 'Growth Protocol', initials: 'GP', website: 'https://www.growthprotocol.ai/',
    linkedin: 'https://www.linkedin.com/company/growthprotocolai/',
    ceoName: 'Miroslav Dimitrov', ceoLinkedin: 'https://www.linkedin.com/in/mirodimitrov/', ceoSince: '2024-11',
    favicon: 'https://www.growthprotocol.ai/favicon.ico', product: 'Enterprise Reasoning Platform',
    industry: 'Decision Intelligence', location: 'New York, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: "The Future of Women's Health: Why Smart CPG Brands Are Betting on Cycle Syncing", postDate: '2025-05-21',
    postUrl: 'https://thegrowthsignal.substack.com/p/the-future-of-womens-health-why-smart', color: '#6b4d2e'
  },
  {
    name: 'icogz', initials: 'IC', website: 'https://www.icogz.com/',
    linkedin: 'https://www.linkedin.com/company/icogz/',
    ceoName: 'Amit Tripathi', ceoLinkedin: 'https://www.linkedin.com/in/amitt/', ceoSince: '2018-06',
    favicon: 'https://framerusercontent.com/images/qBvmLNzKoLpEu6fCTv5Hc2WMlg0.png', product: 'Aryabot',
    industry: 'Business Intelligence', location: 'Dubai, UAE', funding: '$1.4M pre-seed (2025)',
    fundingUrl: 'https://www.thesaasnews.com/news/icogz-raises-1-4-million-in-pre-seed-round/',
    postTitle: 'How MENA & SEA Retailers Are Leapfrogging with AI', postDate: '2026-03-20',
    postUrl: 'https://www.icogz.com/blogs/how-mena-sea-retailers-are-leapfrogging-with-ai', color: '#08759a'
  },
  {
    name: 'Imandra', initials: 'IM', website: 'https://www.imandra.ai/',
    linkedin: 'https://www.linkedin.com/company/imandra/',
    ceoName: 'Grant Olney Passmore', ceoLinkedin: 'https://www.linkedin.com/in/grantolneypassmore/', ceoSince: '2014-04',
    favicon: 'https://www.imandra.ai/favicon/favicon.png', product: 'Imandra Universe',
    industry: 'Formal Verification', location: 'Texas, US', funding: '$9.9M disclosed',
    fundingUrl: 'https://www.dealdata.net/company-profile/0001765781/',
    postTitle: 'Coding agents need a shared behavioral model of the software they change', postDate: '2026-06-11',
    postUrl: 'https://medium.com/imandra/coding-agents-need-a-shared-behavioral-model-of-the-software-they-change-062f2899ccf6', color: '#5b47aa'
  },
  {
    name: 'Kognitos', initials: 'KO', website: 'https://www.kognitos.com/',
    linkedin: 'https://www.linkedin.com/company/kognitos/',
    ceoName: 'Binny Gill', ceoLinkedin: 'https://www.linkedin.com/in/binnygill/', ceoSince: '2021-01',
    favicon: 'https://www.kognitos.com/img/favicon.png', product: 'Kognitos', industry: 'Process Automation',
    location: 'California, US', funding: '$25M Series B',
    fundingUrl: 'https://www.kognitos.com/news/kognitos-launches-neurosymbolic-ai-platform-for-automating-business-operations-backed-by-25m-series-b/',
    postTitle: 'Enterprise AI Assistants: Execution Engines vs. Copilots',
    postDate: '2026-04-22',
    postUrl: 'https://www.kognitos.com/blog/enterprise-ai-assistants/', color: '#d75436'
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
    name: 'KYield', initials: 'KY', website: 'https://kyield.com/',
    linkedin: 'https://www.linkedin.com/company/kyield',
    ceoName: 'Mark Montgomery', ceoLinkedin: 'https://www.linkedin.com/in/markamontgomery/', ceoSince: '2002-05',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><polygon points='16,0 32,8 32,24 16,32 0,24 0,8' fill='%231464c8'/><text x='16' y='22' text-anchor='middle' fill='white' font-size='16' font-weight='900' font-family='sans-serif'>K</text></svg>",
    product: 'KYield OS (KOS)', industry: 'Enterprise AI', location: 'New Mexico, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'A Declaration of Digital Independence', postDate: '2026-07-04',
    postUrl: 'https://kyield.com/insights/newsletter/2026/07/declaration-digital-independence.html', color: '#1464c8'
  },
  {
    name: 'Lakmoos', initials: 'LK', website: 'https://lakmoos.com/',
    linkedin: 'https://www.linkedin.com/company/lakmoos/',
    ceoName: 'Kamila Zahradnickova', ceoLinkedin: 'https://www.linkedin.com/in/kamila-zahradnickova/', ceoSince: '2023-06',
    favicon: 'https://framerusercontent.com/images/0mjREm7vY2D4GrHhBYxIbAHOEA0.png', product: 'Lakmoos AI',
    industry: 'Market Research', location: 'South Moravian, Czechia', funding: '€300K pre-seed (2024)',
    fundingUrl: 'https://www.vestbee.com/insights/articles/czech-lakmoos-raises-300k-from-presto-ventures',
    postTitle: "Digital Twins vs Synthetic Respondents: The Label Doesn't Matter, the Model Does", postDate: '2026-07-06',
    postUrl: 'https://lakmoos.com/blog/labels', color: '#a34167'
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
    postTitle: 'AI needs datasheets', postDate: '2026-08-03',
    postUrl: 'https://www.onteric.com/news-and-insights/ai-needs-datasheets', color: '#315f4c'
  },
  {
    name: 'Onton', initials: 'OT', website: 'https://onton.com/',
    linkedin: 'https://www.linkedin.com/company/onton-ai/',
    ceoName: 'Zach Hudson', ceoLinkedin: 'https://www.linkedin.com/in/hudsonzp/', ceoSince: '2022-04',
    favicon: 'favicons/onton.png',
    product: 'AI Shopping Assistant', industry: 'Software Development', location: 'California, US',
    funding: '~$10M total (2025)',
    fundingUrl: 'https://techcrunch.com/2025/11/26/onton-raises-7-5m-to-expand-its-ai-powered-shopping-site-beyond-furniture/',
    postTitle: 'Ontology 1: A Successor Architecture for Search', postDate: '2026-07-29',
    postUrl: 'https://onton.com/research/ontology-1', color: '#d05b3f'
  },
  {
    name: 'Permion', initials: 'PE', website: 'https://www.permion.ai/',
    linkedin: 'https://www.linkedin.com/company/permion/',
    ceoName: 'Arun Majumdar', ceoLinkedin: 'https://www.linkedin.com/in/arun-majumdar-8a555336/', ceoSince: '2018-03',
    favicon: 'https://www.permion.ai/wp-content/uploads/2025/01/cropped-permion-logo_icon-192x192.png', product: 'Permion AI',
    industry: 'Mission-Critical AI', location: 'Washington DC Metro, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Permion selected and representing the USA as the winner in the Government AI Grand Challenge for the G7+EU', postDate: '2026-07-01',
    postUrl: 'https://www.permion.ai/permion-selected-and-representing-the-usa-as-the-winner-in-the-government-ai-grand-challenge-for-the-g7eu/', color: '#405a67'
  },
  {
    name: 'QGI', initials: 'QG', website: 'https://qgi.dev/',
    linkedin: 'https://www.linkedin.com/company/quantum-general-intelligence-inc',
    ceoName: 'Dain Ehring', ceoLinkedin: 'https://www.linkedin.com/in/dainehring/', ceoSince: '2026-01',
    favicon: 'favicons/qgi.jpg', product: 'QAG Engine',
    industry: 'AI Infrastructure', location: 'California, US', funding: '$3M SAFE (planned, 2026)',
    fundingUrl: 'https://www.einpresswire.com/article/885914885/quantum-general-intelligence-qgi-emerges-from-stealth-to-make-ai-admissible-for-regulated-industries',
    postTitle: 'The AI factory is the next enterprise operating model', postDate: '2026-05-02',
    postUrl: 'https://qgi.dev/blog/ai-factory-custom-ai-context-engineering/', color: '#2f4a8f'
  },
  {
    name: 'RAAPID', initials: 'RP', website: 'https://www.raapidinc.com/',
    linkedin: 'https://www.linkedin.com/company/raapid/',
    ceoName: 'Chetan Parikh', ceoLinkedin: 'https://www.linkedin.com/in/chetanparikh/', ceoSince: '2022-02',
    favicon: 'https://www.raapidinc.com/favicon.ico', product: 'Risk Adjustment Platform', industry: 'Healthcare',
    location: 'Kentucky, US', funding: '$6.7M disclosed',
    fundingUrl: 'https://www.cbinsights.com/company/raapid/financials',
    postTitle: 'CMS Risk Adjustment Submission Deadlines for 2026, 2027, and 2028: Key Dates for Compliance', postDate: '2026-07-24',
    postUrl: 'https://www.raapidinc.com/blogs/cms-risk-adjustment-submission-deadlines/', color: '#0c6d7b'
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
    postTitle: "The Harness is the agent: what's inside?", postDate: '2026-07-15',
    postUrl: 'https://www.rippletide.com/resources/blog/the-harness-is-the-agent-whats-inside', color: '#623d8f'
  },
  {
    name: 'SeKondBrain AI', initials: 'SB', website: 'https://www.sekondbrain.ai/',
    linkedin: 'https://www.linkedin.com/company/sekondbrain/',
    ceoName: 'Sachin Dev Duggal', ceoLinkedin: 'https://www.linkedin.com/in/sachin-dev-duggal-255406/', ceoSince: '2025-09',
    favicon: 'https://framerusercontent.com/images/TpDgoIiYXMbCgvdh8KAaXl3zuxc.png', product: 'Cognitive OS',
    industry: 'Cognitive AI', location: 'Dubai, UAE', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Atomic Unit of X', postDate: '2026-05-05',
    postUrl: 'https://www.sekondbrain.ai/research/atomic-unit-of-x', color: '#9e77e9'
  },
  {
    name: 'Symbolica', initials: 'SY', website: 'https://www.symbolica.ai/',
    linkedin: 'https://www.linkedin.com/company/symbolica-ai/',
    ceoName: 'George Morgan', ceoLinkedin: 'https://www.linkedin.com/in/georgemorgan2/', ceoSince: '2022-07',
    favicon: 'https://www.symbolica.ai/favicon-symbolica.png', product: 'Agentica',
    industry: 'AI Agent Infrastructure', location: 'California, US', funding: '$33M total (2024)',
    fundingUrl: 'https://siliconangle.com/2024/04/09/symbolica-launches-33m-change-ai-industry-symbolic-models/',
    postTitle: 'The Collaborative Canvas: A New Era of Agentic Interaction', postDate: '2026-05-05',
    postUrl: 'https://www.symbolica.ai/blog/collaborative-canvas', color: '#7678e3'
  },
  {
    name: 'Synalinks', initials: 'SL', website: 'https://www.synalinks.com/',
    linkedin: 'https://www.linkedin.com/company/synalinks/',
    ceoName: 'Yoan Sallami', ceoLinkedin: 'https://www.linkedin.com/in/yoan-sallami/', ceoSince: '2023-09',
    favicon: 'https://www.synalinks.com/favicon.svg', product: 'Synalinks', industry: 'AI Agent Infrastructure',
    location: 'Occitanie, France', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Context Graphs: The Three Graph Structures Behind Reliable AI Agents', postDate: '2026-02-25',
    postUrl: 'https://www.synalinks.com/en/blog/context-graphs-for-ai-agents', color: '#286f63'
  },
  {
    name: 'UMNAI', initials: 'UM', website: 'https://umnai.com/',
    linkedin: 'https://www.linkedin.com/company/umnai/',
    ceoName: 'Angelo Dalli', ceoLinkedin: 'https://www.linkedin.com/in/angelodalli/', ceoSince: '2019-04',
    favicon: 'https://umnai.com/__l5e/assets-v1/cb515d94-bfd9-42ac-b900-6051f0fedd97/umnai-logo-footer.png',
    product: 'Hybrid Intelligence', industry: 'Decision Intelligence', location: 'England, UK',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Sovereign AI Begins With Architectural Choice', postDate: '2026-07-29',
    postUrl: 'https://umnai.com/company/blog/sovereign-ai-begins-with-architectural-choice', color: '#a86a11'
  },
  {
    name: 'Uniphore', initials: 'UP', website: 'https://www.uniphore.com/',
    linkedin: 'https://www.linkedin.com/company/uniphore',
    ceoName: 'Umesh Sachdev', ceoLinkedin: 'https://www.linkedin.com/in/umeshsachdev/', ceoSince: '2008-04',
    favicon: 'https://www.uniphore.com/wp-content/uploads/2025/12/cropped-Uniphore–Bug–Gradient–Light-192x192.webp',
    product: 'Business AI Cloud', industry: 'Business AI', location: 'California, US',
    funding: '$260M Series F (2025)',
    fundingUrl: 'https://www.uniphore.com/press-releases/nvidia-amd-snowflake-databricks-invest-in-uniphores-series-f/',
    postTitle: 'Are Your AI Models Limiting Your Business?', postDate: '2026-07-17',
    postUrl: 'https://www.uniphore.com/blog/are-your-ai-models-limiting-your-business/', color: '#2d88a4'
  },
  {
    name: 'UnlikelyAI', initials: 'UA', website: 'https://www.unlikely.ai/',
    linkedin: 'https://www.linkedin.com/company/unlikely-ai/', favicon: 'https://www.unlikely.ai/favicon.ico',
    ceoName: 'William Tunstall-Pedoe', ceoLinkedin: 'https://www.linkedin.com/in/williamtp/', ceoSince: '2019-01',
    product: 'UnlikelyAI Platform', industry: 'Trustworthy AI', location: 'England, UK', funding: '$20M seed (2022)',
    fundingUrl: 'https://www.unlikely.ai/newsroom/unlikely-ai-raises-20-million-in-oversubscribed-seed-round',
    postTitle: "STRIDE and the way forward for trustworthy AI: our founder's new essay", postDate: '2026-07-31',
    postUrl: 'https://www.unlikely.ai/newsroom/stride-and-the-way-forward-for-trustworthy-ai-our-founder-s-new-essay', color: '#402f73'
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
