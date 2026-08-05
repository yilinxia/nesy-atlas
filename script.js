const organizations = [
  {
    name: 'AUI', initials: 'AUI', website: 'https://www.aui.io/',
    linkedin: 'https://www.linkedin.com/company/augmentedintelligence-aui/posts/?feedView=all',
    ceoName: 'Ohad Elhelo', ceoLinkedin: 'https://www.linkedin.com/in/ohadelhelo/', ceoSince: '2017-09',
    favicon: 'https://www.aui.io/favicon-32x32.png', product: 'Apollo-1',
    industry: 'Conversational AI', location: 'New York, US', funding: '$20M round (2025)',
    fundingUrl: 'https://venturebeat.com/ai/the-beginning-of-the-end-of-the-transformer-era-neuro-symbolic-ai-startup',
    postTitle: 'Welcoming Quack AI to AUI', postDate: '2026-02-23',
    postUrl: 'https://www.aui.io/resources/welcoming-quack-ai-to-aui/', color: '#202020',
    posts: [
      { title: 'Welcoming Quack AI to AUI', date: '2026-02-23', url: 'https://www.aui.io/resources/welcoming-quack-ai-to-aui/' },
      { title: 'Neuro-Symbolic AI in Action: Apollo-1 Aces Amazon Scenarios; Rufus Falls Short', date: '2025-11-18', url: 'https://www.aui.io/resources/apollo-1-amazon-rufus-comparison/' },
      { title: 'AUI Raises $20 Million at $750 Million Valuation Cap Following Breakthrough in Neuro-Symbolic AI', date: '2025-11-03', url: 'https://www.aui.io/resources/aui-raises-20-million-at-750-million-valuation-cap-following-breakthrough-in-neuro-symbolic-ai/' },
      { title: 'Welcoming Zac Maufe to AUI', date: '', url: 'https://www.aui.io/resources/welcoming-zac-maufe-to-aui/' },
      { title: 'Mutable Intelligence: Cognition in Code, Not Weights', date: '2025-07-12', url: 'https://www.aui.io/resources/beyond-generative-ai/' }
    ]
  },
  {
    name: 'Beyond AI', initials: 'BA', website: 'https://www.beyond.ai/',
    linkedin: 'https://www.linkedin.com/company/beyond-ai/',
    ceoName: 'AJ Abdallat', ceoLinkedin: 'https://www.linkedin.com/in/ajabdallat/', ceoSince: '2014-04',
    favicon: 'https://cdn.prod.website-files.com/66fa4dc606c7344f4b994f9a/6995097a786449c2691b10e5_favicon-32x32.png',
    product: 'Industrial AI Platform', industry: 'Energy & Industrial', location: 'California, US',
    funding: '$133M Series C (2020)',
    fundingUrl: 'https://www.finsmes.com/2020/09/beyond-limits-raises-133m-in-series-c-funding.html',
    postTitle: 'The Bridge to Tomorrow is Built by Humans and Strengthened by AI', postDate: '2026-03-06',
    postUrl: 'https://www.beyond.ai/blog/built-by-humans-strengthened-by-ai', color: '#156b78',
    posts: [
      { title: 'The Bridge to Tomorrow is Built by Humans and Strengthened by AI', date: '2026-03-06', url: 'https://www.beyond.ai/blog/built-by-humans-strengthened-by-ai' },
      { title: 'Why Pure LLM Agents Fail in High-Stakes Operations', date: '2026-02-19', url: 'https://www.beyond.ai/blog/why-llm-agents-fail' },
      { title: 'Neuro-symbolic AI Explained: What It Is & Why It Matters', date: '2026-02-16', url: 'https://www.beyond.ai/blog/what-is-neuro-symbolic-ai' },
      { title: 'AI for the Energy Sector Must Move Beyond Experimentation', date: '', url: 'https://www.beyond.ai/blog/ai-for-the-energy-sector' },
      { title: 'What Modern AI Infrastructure Means for Industrial-Grade AI', date: '', url: 'https://www.beyond.ai/blog/ai-infrastructure-for-industrial-grade-ai' },
      { title: 'AI-in-a-Box for LNG Operations: Why Industrial-Grade Infrastructure Is Critical', date: '', url: 'https://www.beyond.ai/blog/ai-in-a-box-for-lng-operations' },
      { title: 'BeyondAI and Compal Introduce On-Premises "AI in a Box"', date: '', url: 'https://www.beyond.ai/blog/beyondai-and-compal-ai-in-a-box' },
      { title: 'Beyond Limits Unveils New Brand Identity: BeyondAI at LNG2026', date: '', url: 'https://www.beyond.ai/blog/new-brand-identity-beyondai' },
      { title: 'Industrial Autonomy: Why Real Autonomy Requires More Than AI Agents', date: '', url: 'https://www.beyond.ai/blog/industrial-autonomy' },
      { title: 'Why Black Box AI Fails', date: '', url: 'https://www.beyond.ai/blog/why-black-box-ai-fails' },
      { title: 'Capturing Domain Expertise in AI', date: '', url: 'https://www.beyond.ai/blog/capturing-domain-expertise-in-ai' },
      { title: 'Agentic AI Needs Reasoning', date: '', url: 'https://www.beyond.ai/blog/agentic-ai-needs-reasoning' },
      { title: 'Explainable AI in High-Stakes Industries: Why Neuro-Symbolic matters', date: '', url: 'https://www.beyond.ai/blog/explainable-ai-in-high-stakes-industries' },
      { title: 'Neuro-Symbolic AI vs Deep Learning: Key Differences, Benefits & Future Insights', date: '', url: 'https://www.beyond.ai/blog/neuro-symbolic-ai-vs-deep-learning' },
      { title: 'AI Advantage in LNG Technology: Boost Efficiency & Innovation', date: '', url: 'https://www.beyond.ai/blog/ai-advantage-in-lng' },
      { title: 'The Intelligent Back Office for LNG', date: '', url: 'https://www.beyond.ai/blog/back-office-for-lng' },
      { title: 'Why LNG Operators Are Redefining Document Automation', date: '', url: 'https://www.beyond.ai/blog/lng-operators-document-automation' },
      { title: 'AI-Powered Accounts Payable Automation in Energy', date: '', url: 'https://www.beyond.ai/blog/ai-powered-accounts-payable-automation' },
      { title: 'How AI for Energy Transforms LNG Supply Chains', date: '', url: 'https://www.beyond.ai/blog/how-ai-strengthens-lng' },
      { title: 'Top LNG Technology Trends 2030: Future Leaders & Innovations', date: '', url: 'https://www.beyond.ai/blog/lng-leaders-in-2030' },
      { title: 'Harnessing LNG Technology: How AI is Shaping the Future of Natural Gas', date: '', url: 'https://www.beyond.ai/blog/the-new-lng-equation-ai' },
      { title: 'The Next Generation of LNG Technology Will Be AI Driven', date: '', url: 'https://www.beyond.ai/blog/lng-technology-will-be-ai-driven' },
      { title: 'AI LNG Efficiency: How AI Transforms LNG Operations', date: '', url: 'https://www.beyond.ai/blog/how-ai-helps-lng-operators' },
      { title: 'Geopolitics & LNG Future', date: '', url: 'https://www.beyond.ai/blog/geopolitics-and-the-future-of-lng' },
      { title: 'AI Accountability: Explainability in Agentic AI', date: '', url: 'https://www.beyond.ai/blog/explainability-and-agentic-ai' }
    ]
  },
  {
    name: 'Bitterbot AI', initials: 'BB', website: 'https://bitterbot.ai/',
    linkedin: 'https://www.linkedin.com/company/bitterbot-ai/',
    ceoName: 'Victor Michael Gil', ceoLinkedin: 'https://www.linkedin.com/in/vmgil/', ceoSince: '2026-05',
    favicon: 'https://bitterbot.ai/favicon.svg', product: 'Bitterbot AI Agent',
    industry: 'Decentralized AI', location: 'Ontario, Canada', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'The Agentic Economy: Why Your AI Will Soon Pay Its Own Server Bills', postDate: '2026-03-23',
    postUrl: 'https://victormgil.medium.com/the-agentic-economy-why-your-ai-will-soon-pay-its-own-server-bills-c51289d3e53d', color: '#7c3aed',
    posts: [
      { title: 'The Agentic Economy: Why Your AI Will Soon Pay Its Own Server Bills', date: '2026-03-23', url: 'https://victormgil.medium.com/the-agentic-economy-why-your-ai-will-soon-pay-its-own-server-bills-c51289d3e53d' },
      { title: 'Forget Context Windows: Why "Agentic Memory" is the Ultimate Flex of 2026', date: '2026-03-10', url: 'https://victormgil.medium.com/forget-context-windows-why-agentic-memory-is-the-ultimate-flex-of-2026-7b000f9fae73' },
      { title: 'The "Vibes" Are Over: Why 2026 Belongs to Neuro-Symbolic AI', date: '2025-12-14', url: 'https://victormgil.medium.com/the-vibes-are-over-why-2026-belongs-to-neuro-symbolic-ai-105575d361de' }
    ]
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
    postUrl: 'https://blog.cognaize.com/cognaize-joins-fintech-armenia-association-as-a-founding-member', color: '#176b57',
    posts: [
      { title: 'Cognaize joins FinTech Armenia Association as a Founding Member', date: '2026-05-27', url: 'https://blog.cognaize.com/cognaize-joins-fintech-armenia-association-as-a-founding-member' },
      { title: 'Why Financial Spreading Is Still Broken in 2025 and How AI Fixes It', date: '2025-11-07', url: 'https://blog.cognaize.com/why-financial-spreading-is-still-broken-in-2025-and-how-ai-fixes-it' },
      { title: "Cognaize Awarded Highly Commended in 'AI in FinTech' at Global FinTech Awards 2025", date: '2025-10-27', url: 'https://blog.cognaize.com/cognaize-awarded-highly-commended-in-ai-in-fintech-at-global-fintech-awards-2025' },
      { title: 'Webinar: Cognaize CEO Vahe Andonians to Join A-Team Panel on Structuring Data for AI Success', date: '2025-09-04', url: 'https://blog.cognaize.com/webinar-structuring-data-for-ai-success' },
      { title: 'Cognaize Named Finalist for AI in FinTech at The Global FinTech Awards 2025', date: '2025-08-20', url: 'https://blog.cognaize.com/cognaize-named-finalist-for-ai-in-fintech-at-the-global-fintech-awards-2025' },
      { title: 'Taming the Paper Avalanche: Hypergraph Orchestration for Agent Bank Notices', date: '2025-06-13', url: 'https://blog.cognaize.com/taming-the-paper-avalanche-hypergraph-orchestration-for-agent-bank-notices' },
      { title: 'Hypergraph-Driven Orchestration of AI Systems', date: '2025-06-03', url: 'https://blog.cognaize.com/hypergraph-driven-orchestration-of-ai-systems' },
      { title: 'Cognaize CEO Vahe Andonians Speaks at Yerevan Dialogue on Artificial Intelligence', date: '2025-05-27', url: 'https://blog.cognaize.com/yerevan-dialogue-on-artificial-intelligence' },
      { title: "Cognaize Wins A-Team Group's 2025 Innovation Award for Knowledge Graph Excellence", date: '2025-05-05', url: 'https://blog.cognaize.com/innovation-award-for-knowledge-graph-excellence-2025' },
      { title: 'Strategies and Solutions For Unlocking Value From Unstructured Data', date: '2025-04-25', url: 'https://blog.cognaize.com/strategies-and-solutions-for-unlocking-value-from-unstructured-data' },
      { title: 'Cognaize Named Finalist at the 2025 Banking Tech Awards USA', date: '2025-04-15', url: 'https://blog.cognaize.com/cognaize-named-finalist-at-the-2025-banking-tech-awards-usa' },
      { title: 'Reimagining Financial Services with Neuro-Symbolic Agentic Systems: The Dawn of a New Era', date: '2025-04-03', url: 'https://blog.cognaize.com/reimagining-financial-services-with-neuro-symbolic-agentic-systems-part-1' },
      { title: 'Where Innovation Meets Collaboration: A Deep Dive into Cognaize AI Pulse', date: '2025-01-31', url: 'https://blog.cognaize.com/where-innovation-meets-collaboration-a-deep-dive-into-cognaize-ai-pulse' }
    ]
  },
  {
    name: 'CogniSwitch', initials: 'CS', website: 'https://cogniswitch.ai/',
    linkedin: 'https://www.linkedin.com/company/cogniswitch-inc/',
    ceoName: 'Dilip Ittyera', ceoLinkedin: 'https://www.linkedin.com/in/dilipti/', ceoSince: '2022-04',
    favicon: 'https://cogniswitch.ai/icon.png?icon.0r87w_.~ngn1k.png', product: 'Neuro-symbolic Trust Layer',
    industry: 'Healthcare', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Understanding How Model Bias Impacts Agents Outputs', postDate: '2026-06-19',
    postUrl: 'https://cogniswitch.ai/blog/bias-you-cant-locate', color: '#316f68',
    posts: [
      { title: 'Understanding How Model Bias Impacts Agents Outputs', date: '2026-06-19', url: 'https://cogniswitch.ai/blog/bias-you-cant-locate' },
      { title: 'Explanation, Citation, Verification: Why Treating These Same Thing Is Costing You', date: '2026-05-26', url: 'https://cogniswitch.ai/blog/explanation-citation-verification' },
      { title: 'The Handover Problem', date: '2026-04-24', url: 'https://cogniswitch.ai/blog/the-handover-problem' },
      { title: 'ContextOps: Making Knowledge First-Class in AI Systems', date: '2026-03-30', url: 'https://cogniswitch.ai/blog/context-as-first-class-citizen' },
      { title: 'Garbage In, Garbage Out: The AI Knowledge Quality Problem', date: '2026-03-15', url: 'https://cogniswitch.ai/blog/garbage-in-garbage-out' },
      { title: 'Phantom Human-In-The-Loop', date: '2026-03-08', url: 'https://cogniswitch.ai/blog/phantom-human-in-the-loop' },
      { title: 'AI Guardrails: What the Status Quo Gets Wrong', date: '2026-02-13', url: 'https://cogniswitch.ai/blog/guardrails-status-quo' },
      { title: 'Evals Are NOT Audits', date: '2026-02-06', url: 'https://cogniswitch.ai/blog/evals-are-not-audits' },
      { title: 'Ontologies: What They Are, Why They Matter Now', date: '2026-01-30', url: 'https://cogniswitch.ai/blog/ontologies-eli5' },
      { title: "Neuro-Symbolic AI: A Practitioner's Taxonomy", date: '2026-01-22', url: 'https://cogniswitch.ai/blog/neuro-symbolic-eli5' },
      { title: 'Context Graphs: From AI Pilot to Production', date: '2026-01-19', url: 'https://cogniswitch.ai/blog/context-graphs-eli5' },
      { title: 'CogniSwitch: An Ontology-Governed Approach to Enterprise AI', date: '2025-12-10', url: 'https://cogniswitch.ai/blog/why-cogniswitch-leverages-ontologies' },
      { title: 'The End of Deploy and Pray', date: '2025-12-01', url: 'https://cogniswitch.ai/blog/governance-manifesto' },
      { title: 'Intelligence Migration is NOT Possible', date: '2025-10-01', url: 'https://cogniswitch.ai/blog/consider-migrating-intelligence' },
      { title: 'Neuro-Symbolic AI: How Knowledge Graphs and LLMs Work Together', date: '2023-12-01', url: 'https://cogniswitch.ai/blog/neuro-symbolic-ai' }
    ]
  },
  {
    name: 'DaaX', initials: 'DX', website: 'https://daax.ai/',
    linkedin: 'https://www.linkedin.com/company/daax-ai/',
    ceoName: 'Sunil Baliga', ceoLinkedin: 'https://www.linkedin.com/in/sunil-baliga/', ceoSince: '2024-11',
    favicon: 'https://daax.ai/favicon.ico', product: 'Agentic Enterprise Search',
    industry: 'Enterprise Search', location: 'California, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Technical Note: LAKEer + UCP Verification Architecture', postDate: '2026-08-01',
    postUrl: 'https://daax.ai/blog/ucp-verification-technical-note', color: '#21295b',
    posts: [
      { title: 'Technical Note: LAKEer + UCP Verification Architecture', date: '2026-08-01', url: 'https://daax.ai/blog/ucp-verification-technical-note' },
      { title: 'DaaX ClaimGuard: A Confidence Score Is Not Verification', date: '2026-08-01', url: 'https://daax.ai/blog/claimguard-verification' },
      { title: 'The Verification Gap: Why Autonomous Auditing Is Only as Good as What the AI Actually Read', date: '2026-04-21', url: 'https://daax.ai/blog/verification-gap' },
      { title: 'Autonomous Auditing Is Coming. The Knowledge Problem Is Already Here.', date: '2026-04-16', url: 'https://daax.ai/blog/autonomous-auditing' },
      { title: 'The Information Supply Chain Problem', date: '2026-04-06', url: 'https://daax.ai/blog/information-supply-chain' },
      { title: "Anthropic's Study of 81,000 People Confirms What Enterprise AI Buyers Already Suspect", date: '2026-03-26', url: 'https://daax.ai/blog/anthropic-unreliability-study' },
      { title: 'Technical Note: LAKEer on the FACTS Grounding Benchmark', date: '2026-03-09', url: 'https://daax.ai/blog/facts-technical-note' },
      { title: 'The Backstory on our FACTS Benchmark Results', date: '2026-03-09', url: 'https://daax.ai/blog/facts-backstory' },
      { title: 'The Denied Claim: Why Your AI Needs to Be a Detective, Not Just a Reader', date: '2026-03-04', url: 'https://daax.ai/blog/cross-document-verification' },
      { title: 'Computational Knowledge and Reasoning — From Plato to Production Systems', date: '2026-03-04', url: 'https://daax.ai/whitepaper/computational-knowledge' },
      { title: 'One Hallucinated Deadline Costs You the Refund', date: '2026-02-26', url: 'https://daax.ai/blog/lakeer-architecture-prevents-hallucinations' },
      { title: 'The SCOTUS Ruling Handed Importers a Legal Victory. It Also Created a Data Engineering Crisis.', date: '2026-02-25', url: 'https://daax.ai/blog/ieepa-data-crisis' },
      { title: '$133 Billion in Tariff Refunds Are Up for Grabs', date: '2026-02-24', url: 'https://daax.ai/blog/tariff-refunds' },
      { title: "The SCOTUS Tariff Ruling Didn't End the Uncertainty", date: '2026-02-20', url: 'https://daax.ai/blog/tariff-ruling-data-problem' },
      { title: 'DaaX Business Model Innovation', date: '2026-02-10', url: 'https://daax.ai/blog/business-model-innovation' },
      { title: 'Case Study: DaaX LAKEer vs. ChatGPT-5 – Oil & Gas Natural Language Search', date: '2025-11-01', url: 'https://daax.ai/blog/case-study-oil-gas' },
      { title: "What's Missing in AI For Enterprise Search? Domain Knowledge and Company Language", date: '2025-11-01', url: 'https://daax.ai/blog/domain-knowledge' },
      { title: 'Preserving Critical Enterprise Knowledge: An AI-Powered Solution', date: '2025-02-01', url: 'https://daax.ai/blog/preserving-knowledge' }
    ]
  },
  {
    name: 'expert.ai', initials: 'eAI', website: 'https://www.expert.ai/',
    linkedin: 'https://www.linkedin.com/company/expert-ai/',
    ceoName: 'Dario Pardi', ceoLinkedin: 'https://www.linkedin.com/in/dario-pardi-aa834b8/', ceoSince: '2023-07',
    favicon: 'https://d2bd3fvxio3enu.cloudfront.net/expertai2025/uploads/2025/04/cropped-favicon-png-32x32.avif',
    product: 'EidenAI Suite', industry: 'Enterprise NLP', location: 'Emilia-Romagna, Italy',
    funding: 'Public (EXAI)', fundingUrl: 'https://www.expert.ai/investors/',
    postTitle: 'Explainable AI in Banking: Why Trust Matters', postDate: '2026-07-24',
    postUrl: 'https://www.expert.ai/blog/explainable-ai-in-banking-why-trust-matters/', color: '#d44b32',
    posts: [
      { title: 'Explainable AI in Banking: Why Trust Matters', date: '2026-07-24', url: 'https://www.expert.ai/blog/explainable-ai-in-banking-why-trust-matters/' },
      { title: 'Rabobank and Expert.ai Strengthen Longstanding Partnership to Advance Trusted AI Innovation in Financial Services', date: '2026-07-15', url: 'https://www.expert.ai/news/rabobank-and-expert-ai-strengthen-longstanding-partnership-to-advance-trusted-ai-innovation-in-financial-services/' },
      { title: 'Expert.ai Joins the Intermonte Valore Italia Index', date: '2026-07-02', url: 'https://www.expert.ai/news/expert-ai-joins-the-intermonte-valore-italia-index/' },
      { title: 'Expert.ai Named to AIFinTech100 for the Third Consecutive Year', date: '2026-06-17', url: 'https://www.expert.ai/news/expert-ai-named-to-aifintech100-for-the-third-consecutive-year/' },
      { title: 'Meet Expert.ai at AIRMIC 2026', date: '2026-06-04', url: 'https://www.expert.ai/resources/expertai-will-be-at-the-airmic-2026/' },
      { title: 'Expert.ai and Fincons Group Join Forces to Bring Neuro-Symbolic AI to Data-Driven Businesses', date: '2026-05-25', url: 'https://www.expert.ai/news/expert-ai-and-fincons-group-join-forces-to-bring-neuro-symbolic-ai-to-data-driven-businesses/' },
      { title: 'Expert.ai and UCIMA Launch the First Italian LLM for Manufacturing', date: '2026-05-19', url: 'https://www.expert.ai/news/expert-ai-and-ucima-launch-the-first-italian-llm-for-manufacturing/' },
      { title: 'EIX–Submission Readiness Named Finalist for Best of Show Award at 2026 Bio-IT World Conference & Expo', date: '2026-05-18', url: 'https://www.expert.ai/news/eix-submission-readiness-named-finalist-for-best-of-show-award-at-2026-bio-it-world-conference-expo/' },
      { title: 'Expert.ai Recognized in the FinCrimeTech50 2026 List of Leading Financial Crime Technology Innovators', date: '2026-05-15', url: 'https://www.expert.ai/news/expert-ai-recognized-in-the-fincrimetech50-2026-list-of-leading-financial-crime-technology-innovators/' },
      { title: 'Advancing Responsible AI in Healthcare', date: '2026-05-14', url: 'https://www.expert.ai/news/advancing-responsible-ai-in-healthcare/' },
      { title: 'Expert.ai Partners with GRENKE Italia to Make Contract Onboarding Simpler, Faster and More Secure', date: '2026-05-13', url: 'https://www.expert.ai/news/expert-ai-partners-with-grenke-italia-to-make-contract-onboarding-simpler-faster-and-more-secure/' },
      { title: 'Expert.ai and Protiviti at ACAMS – THE ASSEMBLY EUROPE 2026', date: '2026-05-07', url: 'https://www.expert.ai/news/expert-ai-and-protiviti-at-acams-the-assembly-europe-2026/' },
      { title: 'Trust Is the Product: What AI Needs to Get Right in the Newsroom', date: '2026-04-23', url: 'https://www.expert.ai/blog/ai-trust-in-the-newsroom/' },
      { title: 'Beyond the Hype: Why Enterprise AI Success Depends on Hybrid AI', date: '2026-03-12', url: 'https://www.expert.ai/blog/why-hybrid-ai-for-enterprise/' },
      { title: 'What Our Most-Read Content Says About AI Adoption Today', date: '2026-01-12', url: 'https://www.expert.ai/blog/what-our-most-read-content-says-about-ai-adoption-today/' },
      { title: 'Beyond Alert Fatigue: How AI Sharpens Adverse Media Screening for AML Teams', date: '2025-11-14', url: 'https://www.expert.ai/blog/beyond-alert-fatigue-how-ai-sharpens-adverse-media-screening-for-aml-teams/' },
      { title: 'How to Build an AI Success Story in Insurance', date: '2025-09-09', url: 'https://www.expert.ai/blog/how-to-build-an-ai-success-story-in-insurance/' },
      { title: 'Human-Centered AI for Content Teams', date: '2025-08-04', url: 'https://www.expert.ai/blog/human-centered-ai-for-content-teams/' },
      { title: 'Why Modern Compliance Needs AI', date: '2025-07-30', url: 'https://www.expert.ai/blog/why-modern-compliance-needs-ai/' },
      { title: 'How AI is Transforming Content Monetization for B2B Publishers', date: '2025-05-29', url: 'https://www.expert.ai/blog/how-ai-is-transforming-content-monetization-for-b2b-publishers/' },
      { title: 'How AI is Transforming Clinical Trials: A Conversation with expert.ai', date: '2025-03-31', url: 'https://www.expert.ai/blog/how-ai-is-transforming-clinical-trials-a-conversation-with-expert-ai/' },
      { title: "How expert.ai Empowers Publishers to Overcome Today's Biggest Challenges", date: '2025-03-25', url: 'https://www.expert.ai/blog/how-expert-ai-empowers-publishers-to-overcome-todays-biggest-challenges/' },
      { title: 'Drowning in Information? Discover the Content That Truly Matters', date: '2025-03-21', url: 'https://www.expert.ai/blog/drowning-in-information-discover-the-content-that-truly-matters/' }
    ]
  },
  {
    name: 'ExtensityAI', initials: 'EX', website: 'https://www.extensity.ai/',
    linkedin: 'https://www.linkedin.com/company/extensityai/',
    ceoName: 'Thomas N.', ceoLinkedin: 'https://www.linkedin.com/in/thomas-n-08b31370/', ceoSince: '2024-03',
    favicon: 'https://framerusercontent.com/images/USE7pqix9s7NoahhFPQipfDaDok.svg', product: 'SymbolicAI',
    industry: 'Research Automation', location: 'Upper Austria, Austria', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Trusted AI for Enterprise Knowledge', postDate: '2026-06-29',
    postUrl: 'https://www.extensity.ai/whitepaper/trusted-ai-for-enterprise-knowledge', color: '#7147b8',
    posts: [
      { title: 'Trusted AI for Enterprise Knowledge', date: '2026-06-29', url: 'https://www.extensity.ai/whitepaper/trusted-ai-for-enterprise-knowledge' },
      { title: 'Trustworthy Agent Design', date: '', url: 'https://arxiv.org/abs/2508.03665' },
      { title: 'HyDRA – Knowledge Graph Construction', date: '', url: 'https://arxiv.org/abs/2507.15917' },
      { title: 'SymbolicAI Framework', date: '', url: 'https://github.com/ExtensityAI/symbolicai' }
    ]
  },
  {
    name: 'Franz Inc.', initials: 'F', website: 'https://franz.com/',
    linkedin: 'https://www.linkedin.com/company/franz-inc/', favicon: 'https://franz.com/images/favicon.ico',
    ceoName: 'Jans Aasman', ceoLinkedin: 'https://www.linkedin.com/in/jans-aasman/', ceoSince: '2006-02',
    product: 'AllegroGraph', industry: 'Knowledge Graphs', location: 'California, US',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'AllegroGraph named to the AI100', postDate: '2026-07-16',
    postUrl: 'https://allegrograph.com/allegrograph-named-to-the-ai100/', color: '#be3e33',
    posts: [
      { title: 'AllegroGraph named to the AI100', date: '2026-07-16', url: 'https://allegrograph.com/allegrograph-named-to-the-ai100/' },
      { title: 'Franz Inc. Named to DBTA 100 Companies That Matter Most in Data', date: '2026-06-16', url: 'https://allegrograph.com/franz-inc-named-to-dbta-100-companies-that-matter-most-in-data/' },
      { title: 'GraphTalker: The AI Agent for Enterprise Knowledge Graphs', date: '2026-05-21', url: 'https://allegrograph.com/graphtalker-in-allegrograph-v9-the-ai-agent-for-enterprise-knowledge-graphs/' },
      { title: 'STIDS – Semantic Technology for Intelligence, Defense, and Security', date: '2026-05-18', url: 'https://allegrograph.com/stids2026/' },
      { title: 'AllegroGraph 9.0 Launches with GraphTalker, the AI Agent for Enterprise Knowledge Graphs', date: '2026-05-04', url: 'https://allegrograph.com/allegrograph-9-0-launches-with-graphtalker-the-ai-agent-for-enterprise-knowledge-graphs/' },
      { title: 'The Knowledge Graph Conference – 2026', date: '2026-05-01', url: 'https://allegrograph.com/the-knowledge-graph-conference-2026/' },
      { title: 'Gary Marcus, Claude Code, and Why Neuro-Symbolic AI Needs Knowledge Graphs', date: '2026-04-15', url: 'https://allegrograph.com/gary-marcus-claude-code-and-why-neuro-symbolic-ai-needs-knowledge-graphs/' },
      { title: 'Beyond Graphify: Why the Enterprise Needs More Than a Folder-to-Graph Tool', date: '2026-04-10', url: 'https://allegrograph.com/beyond-graphify-why-the-enterprise-needs-more-than-a-folder-to-graph-tool/' },
      { title: 'Gartner Is Sending a Clear Signal: Semantics are Essential in the AI Enterprise Infrastructure', date: '2026-04-03', url: 'https://allegrograph.com/gartner-is-sending-a-clear-signal-semantics-are-essential-in-the-ai-enterprise-infrastructure/' },
      { title: 'Understanding the Autonomous Electric Vehicle Cyber Threat Landscape', date: '2026-04-02', url: 'https://allegrograph.com/understanding-the-autonomous-electric-vehicle-cyber-threat-landscape-a-focus-on-infrastructure-threats-and-ontology-based-modelling/' },
      { title: 'Securing Your Internal Knowledge Amidst Shadow AI', date: '2026-03-19', url: 'https://allegrograph.com/securing-your-internal-knowledge-amidst-shadow-ai/' },
      { title: 'Monitoring AllegroGraph with Prometheus and Grafana', date: '2026-03-16', url: 'https://allegrograph.com/monitoring-allegrograph-with-prometheus-and-grafana/' },
      { title: 'Top 100 Company in KM – Franz Inc.', date: '2026-03-16', url: 'https://allegrograph.com/top-100-company-in-km-franz-inc/' },
      { title: 'From ALICE to Neuro-Symbolic AI: A Conversation with Dr. Richard Wallace', date: '2026-01-07', url: 'https://allegrograph.com/from-alice-to-neuro-symbolic-ai-a-conversation-with-dr-richard-wallace/' },
      { title: "Collaborative Machine Reasoning Marks AI's Next Inflection Point", date: '2026-01-06', url: 'https://allegrograph.com/collaborative-machine-reasoning-marks-ais-next-inflection-point/' },
      { title: 'Data in 2026: Interchangeable Models, Clouds, and Specialization', date: '2026-01-06', url: 'https://allegrograph.com/data-in-2026-interchangeable-models-clouds-and-specialization/' },
      { title: 'AllegroGraph Named "2025 Best Knowledge Graph" by KMWorld Readers\' Choice', date: '2025-11-12', url: 'https://allegrograph.com/allegrograph-named-2025-best-knowledge-graph-by-kmworld-readers-choice/' },
      { title: 'The rise of accountable AI agents: How knowledge graphs solve the autonomy problem', date: '2025-10-30', url: 'https://allegrograph.com/the-rise-of-accountable-ai-agents-how-knowledge-graphs-solve-the-autonomy-problem/' },
      { title: 'Webinar – Building Accountable AI Agents with Knowledge Graphs', date: '2025-10-13', url: 'https://allegrograph.com/webinar-building-accountable-ai-agents-with-knowledge-graphs/' },
      { title: 'The Neuro-Symbolic Foundation for the AI-Driven Enterprise', date: '2025-10-09', url: 'https://allegrograph.com/the-neuro-symbolic-foundation-for-the-ai-driven-enterprise/' }
    ]
  },
  {
    name: 'Growth Protocol', initials: 'GP', website: 'https://www.growthprotocol.ai/',
    linkedin: 'https://www.linkedin.com/company/growthprotocolai/',
    ceoName: 'Miroslav Dimitrov', ceoLinkedin: 'https://www.linkedin.com/in/mirodimitrov/', ceoSince: '2024-11',
    favicon: 'https://www.growthprotocol.ai/favicon.ico', product: 'Enterprise Reasoning Platform',
    industry: 'Decision Intelligence', location: 'New York, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: "The Future of Women's Health: Why Smart CPG Brands Are Betting on Cycle Syncing", postDate: '2025-05-21',
    postUrl: 'https://thegrowthsignal.substack.com/p/the-future-of-womens-health-why-smart', color: '#6b4d2e',
    posts: [
      { title: "The Future of Women's Health: Why Smart CPG Brands Are Betting on Cycle Syncing", date: '2025-05-21', url: 'https://thegrowthsignal.substack.com/p/the-future-of-womens-health-why-smart' },
      { title: 'Why Luxury Postpartum Retreats Are The New CPG Wellness Frontier', date: '2025-05-08', url: 'https://thegrowthsignal.substack.com/p/why-luxury-postpartum-retreats-are' },
      { title: 'Natural vs. Synthetic: Navigating the 2026 FDA Food Dye Ban', date: '2025-05-01', url: 'https://thegrowthsignal.substack.com/p/natural-vs-synthetic-navigating-the' },
      { title: 'The $18 Billion Baby Boom Opportunity', date: '2025-04-25', url: 'https://thegrowthsignal.substack.com/p/the-18-billion-baby-boom-opportunity' },
      { title: 'The New Beauty Economy: How GLP-1s and Biohacking Are Reshaping CPG', date: '2025-04-18', url: 'https://thegrowthsignal.substack.com/p/the-new-beauty-economy-how-glp-1s' },
      { title: 'Investing in Third & Fourth Spaces Will Strengthen Your Product Strategy', date: '2025-04-11', url: 'https://thegrowthsignal.substack.com/p/investing-in-third-and-fourth-spaces' },
      { title: 'What the Wellness Economy Means for a Skincare Slowdown', date: '2025-04-04', url: 'https://thegrowthsignal.substack.com/p/what-the-wellness-economy-means-for' },
      { title: 'Navigating The Luxury Fragrance Slow-Down', date: '2025-03-21', url: 'https://thegrowthsignal.substack.com/p/navigating-the-luxury-fragrance-slow' },
      { title: 'Understanding the Gummy Supplement Boom', date: '2025-03-14', url: 'https://thegrowthsignal.substack.com/p/understanding-the-gummy-supplement' },
      { title: 'Curated Insights From Our Most Impactful Forecasts and Analysis', date: '2025-03-03', url: 'https://thegrowthsignal.substack.com/p/curated-insights-from-our-most-impactful' }
    ]
  },
  {
    name: 'icogz', initials: 'IC', website: 'https://www.icogz.com/',
    linkedin: 'https://www.linkedin.com/company/icogz/',
    ceoName: 'Amit Tripathi', ceoLinkedin: 'https://www.linkedin.com/in/amitt/', ceoSince: '2018-06',
    favicon: 'https://framerusercontent.com/images/qBvmLNzKoLpEu6fCTv5Hc2WMlg0.png', product: 'Aryabot',
    industry: 'Business Intelligence', location: 'Dubai, UAE', funding: '$1.4M pre-seed (2025)',
    fundingUrl: 'https://www.thesaasnews.com/news/icogz-raises-1-4-million-in-pre-seed-round/',
    postTitle: 'How MENA & SEA Retailers Are Leapfrogging with AI', postDate: '2026-03-20',
    postUrl: 'https://www.icogz.com/blogs/how-mena-sea-retailers-are-leapfrogging-with-ai', color: '#08759a',
    posts: [
      { title: 'How MENA & SEA Retailers Are Leapfrogging with AI', date: '2026-03-20', url: 'https://www.icogz.com/blogs/how-mena-sea-retailers-are-leapfrogging-with-ai' },
      { title: "Inside Aryabot™ Agentic Mode: AI That Doesn't Wait for Commands", date: '', url: 'https://www.icogz.com/blogs/inside-aryabot-agentic-mode-ai-that-doesn%E2%80%99t-wait-for-commands' },
      { title: 'How AI-Driven Forecasting Helps Plan Inventory Smarter in Omnichannel Retail', date: '', url: 'https://www.icogz.com/blogs/how-ai-driven-forecasting-helps-plan-inventory-smarter-in-omnichannel-retail' },
      { title: 'Retail Shrinkage to Growth, How Aryabot™ Helps Reduce Loss and Boost ROI', date: '', url: 'https://www.icogz.com/blogs/retail-shrinkage-to-growth-how-aryabot-helps-reduce-loss-and-boost-roi' },
      { title: 'Why Market Coverage Is the Missing Metric in Retail Sales Intelligence', date: '', url: 'https://www.icogz.com/blogs/why-market-coverage-is-the-missing-metric-in-retail-sales-intelligence' },
      { title: 'From Dashboards to Action - Why Traditional Sales Reports No Longer Work', date: '', url: 'https://www.icogz.com/blogs/from-dashboards-to-action-why-traditional-sales-reports-no-longer-work' },
      { title: 'How AI Is Reshaping Retail Sales: Real-Time Insights That Convert', date: '', url: 'https://www.icogz.com/blogs/how-ai-is-reshaping-retail-sales-real-time-insights-that-convert' },
      { title: 'Retail Agents at Work: Autonomous Inventory & Pricing Decisions', date: '', url: 'https://www.icogz.com/blogs/retail-agents-at-work-autonomous-inventory-pricing-decisions' },
      { title: 'From Assistants to Agents: Why GenAI 2.0 Is Redefining Retail Ops', date: '', url: 'https://www.icogz.com/blogs/from-assistants-to-agents-why-genai-2-0-is-redefining-retail-ops' },
      { title: 'Agentic AI Is Here: What It Means for Enterprise Intelligence in 2025', date: '', url: 'https://www.icogz.com/blogs/agentic-ai-is-here-what-it-means-for-enterprise-intelligence-in-2025' },
      { title: 'AI-Powered Business Intelligence for E-Commerce and Supply Chains', date: '', url: 'https://www.icogz.com/blogs/ai-powered-business-intelligence-for-e-commerce-and-supply-chains' },
      { title: 'AI Business Intelligence Solutions: Transforming Decision-Making in the B2B Landscape', date: '', url: 'https://www.icogz.com/blogs/ai-business-intelligence-solutions-transforming-decision-making-in-the-b2b-landscape' },
      { title: 'From Data to Action: The KPIs CEOs Need to Watch in 2025', date: '', url: 'https://www.icogz.com/blogs/from-data-to-action-the-kpis-ceos-need-to-watch-in-2025' },
      { title: 'Transforming Retail Intelligence: How Advanced Analytics and Agentic AI Are Shaping the Future', date: '', url: 'https://www.icogz.com/blogs/the-current-state-of-analytics-in-retail-intelligence' },
      { title: 'Advancing Business Intelligence: The Impact of AI and ML Innovations', date: '', url: 'https://www.icogz.com/blogs/advancing-business-intelligence-the-impact-of-ai-and-ml-innovations' },
      { title: 'AI and ML Innovations: Revolutionising Business Intelligence', date: '', url: 'https://www.icogz.com/blogs/ai-and-ml-innovations-revolutionising-business-intelligence' },
      { title: 'The Cogs of Intelligence: The Role of AI-Driven Business Intelligence Solutions', date: '', url: 'https://www.icogz.com/blogs/the-cogs-of-intelligence-the-role-of-ai-driven-business' },
      { title: 'Unlocking the Power of Business Intelligence: Turning Data into Actionable Insights', date: '', url: 'https://www.icogz.com/blogs/unlocking-the-power-of-business-intelligence' },
      { title: 'The Journey of AI: Overcoming Implementation Challenges', date: '', url: 'https://www.icogz.com/blogs/the-journey-of-ai-overcoming-implementation-challenges' },
      { title: 'From Raw Data to Actionable Insights: A Complete Overview of Business Intelligence', date: '', url: 'https://www.icogz.com/blogs/from-raw-data-to-actionable-insights' },
      { title: 'Data Security in AI: Striking the Delicate Balance Between Actionable Insights and Confidentiality', date: '', url: 'https://www.icogz.com/blogs/data-security-in-ai' },
      { title: 'Data Analytics: A Catalyst for Climate Action', date: '', url: 'https://www.icogz.com/blogs/data-analytics-a-catalyst-for-climate-action' }
    ]
  },
  {
    name: 'Imandra', initials: 'IM', website: 'https://www.imandra.ai/',
    linkedin: 'https://www.linkedin.com/company/imandra/',
    ceoName: 'Grant Olney Passmore', ceoLinkedin: 'https://www.linkedin.com/in/grantolneypassmore/', ceoSince: '2014-04',
    favicon: 'https://www.imandra.ai/favicon/favicon.png', product: 'Imandra Universe',
    industry: 'Formal Verification', location: 'Texas, US', funding: '$9.9M disclosed',
    fundingUrl: 'https://www.dealdata.net/company-profile/0001765781/',
    postTitle: "BLOX Markets selects Imandra's Automated Reasoning technology to enhance Openpool Customer Onboarding and Development", postDate: '2026-06-30',
    postUrl: 'https://www.imandra.ai/articles/blox-markets-selects-imandra-openpool', color: '#5b47aa',
    posts: [
      { title: "BLOX Markets selects Imandra's Automated Reasoning technology to enhance Openpool Customer Onboarding and Development", date: '2026-06-30', url: 'https://www.imandra.ai/articles/blox-markets-selects-imandra-openpool' },
      { title: 'Coding agents need a shared behavioral model of the software they change', date: '2026-06-11', url: 'https://medium.com/imandra/coding-agents-need-a-shared-behavioral-model-of-the-software-they-change-062f2899ccf6' },
      { title: 'Managing complexity with math and logic: changing Stripe payment flow with Claude and CodeLogician', date: '2026-03-07', url: 'https://medium.com/imandra/managing-complexity-with-math-and-logic-changing-stripe-payment-flow-with-claude-and-codelogician-cdd386001e40' },
      { title: 'Vibe Coding was phase 1. Logic-first AI is phase 2. It is here now.', date: '2026-02-15', url: 'https://medium.com/imandra/vibe-coding-was-phase-1-logic-first-ai-is-phase-2-it-is-here-now-7523beff4188' },
      { title: 'Imandra Inc. Unveils Imandra Universe: The Platform for Neurosymbolic AI Agents with Logical Reasoning', date: '2025-06-04', url: 'https://www.imandra.ai/articles/imandra-universe-launch' },
      { title: 'First steps with ImandraX', date: '2025-05-08', url: 'https://medium.com/imandra/first-steps-with-imandrax-5c3e3a028857' },
      { title: 'Imandra Unveils CodeLogician: A Groundbreaking Neurosymbolic AI Agent for Mathematical Code Reasoning', date: '2025-03-26', url: 'https://www.imandra.ai/articles/imandra-releases-codelogician' },
      { title: 'Imandra Inc. Advances Neurosymbolic AI Reasoning with ImandraX Release', date: '2025-02-25', url: 'https://www.imandra.ai/articles/imandra-releases-imandrax' },
      { title: 'Imandra Appoints Zehra Akbar as Chief Operating Officer', date: '2024-07-30', url: 'https://www.imandra.ai/articles/imandra-appoints-coo' },
      { title: 'Imandra wins the A-Team Innovation Award', date: '2024-05-01', url: 'https://www.imandra.ai/articles/imandra-wins-a-team-innovation-award' },
      { title: 'Imandra launches AI assistant for FIX Connectivity', date: '2024-04-22', url: 'https://www.imandra.ai/articles/imandra-fix-wizard-press-release' },
      { title: 'Press Release: Imandra awarded ISO 27001 certification', date: '2024-02-29', url: 'https://www.imandra.ai/articles/imandra-awarded-iso-27001-certification' },
      { title: 'Press Release: Imandra Gains Significant Traction across European Exchanges', date: '2024-02-22', url: 'https://www.imandra.ai/articles/imandra-gains-significant-traction' },
      { title: 'An Introduction to Imandra Markets', date: '2024-02-20', url: 'https://medium.com/imandra/an-introduction-to-imandra-markets-d9b7419916f2' },
      { title: 'Automated Reasoning for SysML v2 Part 3', date: '2023-11-28', url: 'https://medium.com/imandra/automated-reasoning-for-sysml-v2-part-3-cfc8fc60c8af' },
      { title: 'Automated Reasoning for SysML v2 Part 2', date: '2023-11-02', url: 'https://medium.com/imandra/automated-reasoning-for-sysml-v2-part-2-7afd4fbd549c' },
      { title: 'Automated Reasoning for SysML v2 Part 1', date: '2023-08-07', url: 'https://medium.com/imandra/automated-reasoning-for-sysml-v2-ad7e87addba8' },
      { title: 'Analysing Machine Learning Models with Imandra', date: '2019-09-27', url: 'https://medium.com/imandra/analysing-machine-learning-models-with-imandra-4510cf586927' },
      { title: 'PyIDF: Diversity of experiences in Reinforcement Learning', date: '2019-09-13', url: 'https://medium.com/imandra/pyidf-diversity-of-experiences-in-reinforcement-learning-8d59f60f59ed' },
      { title: 'Describing Algorithms: Introduction', date: '2019-06-14', url: 'https://medium.com/imandra/describing-algorithms-introduction-8d8224a0f920' },
      { title: 'Constraint solving your UIs', date: '2019-02-05', url: 'https://medium.com/imandra/constraint-solving-your-uis-8933f4cf8927' },
      { title: 'Introducing Verified React', date: '2019-01-07', url: 'https://medium.com/imandra/introducing-verified-react-9c2ef03f821b' },
      { title: 'Probabilistic reasoning in ReasonML', date: '2018-10-26', url: 'https://medium.com/imandra/reasoning-about-probabilities-in-reasonml-2b43bf01873e' },
      { title: 'Verifying ReasonReact component logic - ReasonML & Imandra', date: '2018-09-04', url: 'https://medium.com/imandra/verifying-reasonreact-component-logic-reasonml-imandra-e350d4812a9f' },
      { title: 'Machine Reasonable Design with Imandra', date: '2018-08-22', url: 'https://medium.com/imandra/machine-reasonable-design-with-imandra-9a7febcab6f5' },
      { title: 'Imandra interface to Robot OS: Part I', date: '2018-08-07', url: 'https://medium.com/imandra/imandra-interface-to-robot-os-part-i-9f3888c5c3a1' }
    ]
  },
  {
    name: 'Kognitos', initials: 'KO', website: 'https://www.kognitos.com/',
    linkedin: 'https://www.linkedin.com/company/kognitos/',
    ceoName: 'Binny Gill', ceoLinkedin: 'https://www.linkedin.com/in/binnygill/', ceoSince: '2021-01',
    favicon: 'https://www.kognitos.com/img/favicon.png', product: 'Kognitos', industry: 'Process Automation',
    location: 'California, US', funding: '$25M Series B',
    fundingUrl: 'https://www.kognitos.com/news/kognitos-launches-neurosymbolic-ai-platform-for-automating-business-operations-backed-by-25m-series-b/',
    postTitle: 'Deduction Management: What It Is and How to Automate It',
    postDate: '2026-08-04',
    postUrl: 'https://www.kognitos.com/blog/deduction-management/', color: '#d75436',
    posts: [
      { title: 'Deduction Management: What It Is and How to Automate It', date: '2026-08-04', url: 'https://www.kognitos.com/blog/deduction-management/' },
      { title: 'Procurement Automation Beyond 3-Way Match: Sourcing to Contract (2026)', date: '2026-08-04', url: 'https://www.kognitos.com/blog/procurement-automation-sourcing-to-contract-2026/' },
      { title: "Contract Lifecycle Automation with Agentic AI: The 2026 Buyer's Guide", date: '2026-08-04', url: 'https://www.kognitos.com/blog/contract-lifecycle-automation-agentic-ai-buyers-guide-2026/' },
      { title: 'Invoice Fraud: Types, Warning Signs, and How to Prevent It', date: '2026-07-31', url: 'https://www.kognitos.com/blog/invoice-fraud/' },
      { title: 'Spend Management: What It Is, Why It Matters, and How AI Improves It', date: '2026-07-31', url: 'https://www.kognitos.com/blog/spend-management/' },
      { title: 'Supplier Statement Reconciliation: What It Is and How to Automate It', date: '2026-07-29', url: 'https://www.kognitos.com/blog/supplier-statement-reconciliation/' },
      { title: 'Business Process Reengineering: What It Is and When to Use It', date: '2026-07-28', url: 'https://www.kognitos.com/blog/business-process-reengineering/' },
      { title: 'Finance Transformation: A Practical Guide for Modern CFOs', date: '2026-07-24', url: 'https://www.kognitos.com/blog/finance-transformation/' },
      { title: 'Business Process Optimization: A Practical Guide for Enterprise Teams', date: '2026-07-24', url: 'https://www.kognitos.com/blog/business-process-optimization/' },
      { title: 'Operational Excellence: What It Is and How to Achieve It', date: '2026-07-24', url: 'https://www.kognitos.com/blog/operational-excellence/' },
      { title: 'Three-Way Matching: What It Is and How Touchless AP Works', date: '2026-07-21', url: 'https://www.kognitos.com/blog/three-way-matching/' },
      { title: 'Underwriting Automation: What AI Can and Cannot Do', date: '2026-07-21', url: 'https://www.kognitos.com/blog/underwriting-automation/' },
      { title: 'Expense Management Automation: What It Covers and Where AI Fits', date: '2026-07-20', url: 'https://www.kognitos.com/blog/expense-management-automation/' },
      { title: 'Automated Invoice Processing: How It Works and Where AI Fits', date: '2026-07-20', url: 'https://www.kognitos.com/blog/automated-invoice-processing/' },
      { title: 'Purchase Order Automation: Streamlining the PO Lifecycle with AI', date: '2026-07-17', url: 'https://www.kognitos.com/blog/purchase-order-automation/' },
      { title: "Agentic AI vs Generative AI: What's the Difference?", date: '2026-07-15', url: 'https://www.kognitos.com/blog/agentic-ai-vs-generative-ai/' },
      { title: 'AP and AR: The Same Exception Problem on Both Sides of the Ledger', date: '2026-07-15', url: 'https://www.kognitos.com/blog/ap-vs-ar-same-exception-problem-both-sides-ledger-2026/' },
      { title: 'AI in Procure-to-Pay: Where the P2P Cycle Actually Breaks', date: '2026-07-15', url: 'https://www.kognitos.com/blog/ai-procure-to-pay-where-p2p-cycle-breaks-2026/' },
      { title: 'Accounts Payable KPIs: The Metrics That Actually Matter in 2026', date: '2026-07-14', url: 'https://www.kognitos.com/blog/accounts-payable-kpis-metrics-that-matter-2026/' },
      { title: 'Accrual Accounting Automation: Closing Faster with AI (2026)', date: '2026-07-14', url: 'https://www.kognitos.com/blog/accrual-accounting-automation-closing-faster-with-ai-2026/' },
      { title: 'PO vs Non-PO Invoices: Why the Difference Decides Whether AP Automates (2026)', date: '2026-07-14', url: 'https://www.kognitos.com/blog/po-vs-non-po-invoices-why-the-difference-decides-ap-automation-2026/' },
      { title: 'AI Agents in Finance: What "Autonomous Finance" Actually Means (and Doesn\'t) in 2026', date: '2026-07-09', url: 'https://www.kognitos.com/blog/ai-agents-finance-autonomous-finance-what-it-means-2026/' },
      { title: 'Continuous Close: How AI Is Ending the Month-End Scramble', date: '2026-07-09', url: 'https://www.kognitos.com/blog/continuous-close-how-ai-ends-month-end-scramble-2026/' },
      { title: 'Automated Financial Reporting: From Close to Board Deck', date: '2026-07-09', url: 'https://www.kognitos.com/blog/automated-financial-reporting-close-to-board-deck-2026/' },
      { title: 'T&E Policy Enforcement: Turning Expense Rules Into Controls That Actually Hold', date: '2026-07-09', url: 'https://www.kognitos.com/blog/travel-expense-policy-enforcement-controls-2026/' },
      { title: 'Enterprise AI Assistants: Execution Engines vs. Copilots', date: '2026-04-22', url: 'https://www.kognitos.com/blog/enterprise-ai-assistants/' },
      { title: 'Channel Partner & AI: Opportunity, Infrastructure Spend, Business Value', date: '2026-06-24', url: 'https://www.kognitos.com/news/binny-gill-channel-partner-ai-opportunity-channeldive-2026/' },
      { title: 'Kognitos Named an HFS Research Hot Tech 2026 Company for Deterministic AI Automation', date: '2026-06-15', url: 'https://www.kognitos.com/news/kognitos-named-hfs-hot-tech-2026/' },
      { title: 'The Hidden Reason Most Enterprise AI Deployments Break Down', date: '2026-06-09', url: 'https://www.kognitos.com/news/binny-gill-ai-2030-why-enterprise-ai-deployments-break-down/' },
      { title: 'Kognitos Named in Two Independent Gartner Research Reports on Trustworthy AI', date: '2026-05-26', url: 'https://www.kognitos.com/news/kognitos-named-2026-gartner-trustworthy-ai-research/' },
      { title: 'Kognitos Named Exemplary Provider and #1 Overall in 2026 ISG Buyers Guide', date: '2026-03-24', url: 'https://www.kognitos.com/news/kognitos-named-exemplary-isg-buyers-guide-automation-orchestration/' },
      { title: 'Kognitos Bridges the AI Trust Gap with Governed, Deterministic Execution', date: '2026-03-03', url: 'https://www.kognitos.com/news/kognitos-platform-enhancements-governed-execution/' },
      { title: 'Kognitos Wins Most Innovative AI Product in CUBEd Awards', date: '2026-02-24', url: 'https://www.kognitos.com/news/kognitos-wins-cubed-award/' }
    ]
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
    postUrl: 'https://kyield.com/insights/newsletter/2026/07/declaration-digital-independence.html', color: '#1464c8',
    posts: [
      { title: 'A Declaration of Digital Independence', date: '2026-07-04', url: 'https://kyield.com/insights/newsletter/2026/07/declaration-digital-independence.html' },
      { title: 'The Enterprise AI Performance Pricing Illusion', date: '2026-06-01', url: 'https://kyield.com/insights/newsletter/2026/06/enterprise-ai-performance-pricing-illusion.html' },
      { title: 'Enterprise AI Challenges in 2026: Mystery Meat, Kill Zones, Cognitive Surrender, and Vibe Bombs', date: '2026-05-01', url: 'https://kyield.com/insights/newsletter/2026/05/vibe-bombs-cognitive-surrender.html' },
      { title: 'KYield Releases KOS v3, the First Enterprise Neurosymbolic AI Operating System', date: '2026-04-29', url: 'https://kyield.com/press/kos-v3-release-2026-04-29.html' },
      { title: 'The Science of Uncertainty: And the Reliability Premium', date: '2026-04-15', url: 'https://kyield.com/insights-science-of-uncertainty.html' },
      { title: 'Neurosymbolic AI 2026: Strategic Design Will Determine Outcomes', date: '', url: 'https://kyield.com/insights-neurosymbolic-ai-2026.html' },
      { title: 'The Power of Neurosymbolic AI', date: '', url: 'https://kyield.com/insights-power-of-neurosymbolic-ai.html' }
    ]
  },
  {
    name: 'Lakmoos', initials: 'LK', website: 'https://lakmoos.com/',
    linkedin: 'https://www.linkedin.com/company/lakmoos/',
    ceoName: 'Kamila Zahradnickova', ceoLinkedin: 'https://www.linkedin.com/in/kamila-zahradnickova/', ceoSince: '2023-06',
    favicon: 'https://framerusercontent.com/images/0mjREm7vY2D4GrHhBYxIbAHOEA0.png', product: 'Lakmoos AI',
    industry: 'Market Research', location: 'South Moravian, Czechia', funding: '€300K pre-seed (2024)',
    fundingUrl: 'https://www.vestbee.com/insights/articles/czech-lakmoos-raises-300k-from-presto-ventures',
    postTitle: "Digital Twins vs Synthetic Respondents: The Label Doesn't Matter, the Model Does", postDate: '2026-07-06',
    postUrl: 'https://lakmoos.com/blog/labels', color: '#a34167',
    posts: [
      { title: "Digital Twins vs Synthetic Respondents: The Label Doesn't Matter, the Model Does", date: '2026-07-06', url: 'https://lakmoos.com/blog/labels' },
      { title: "Your Synthetic Persona Is Not a Chatbot. Here's Why It Matters.", date: '2026-04-22', url: 'https://lakmoos.com/blog/your-synthetic-persona-is-not-a-chatbot' },
      { title: "The 12× Problem: Why Teams Don't Do Enough Research (And What Changes Now)", date: '2026-04-10', url: "https://lakmoos.com/blog/the-12×-problem-why-teams-don't-do-enough-research-(and-what-changes-now)" },
      { title: 'What Are Synthetic Respondents? (2026 Guide to AI Market Research)', date: '2026-03-26', url: 'https://lakmoos.com/blog/what-are-synthetic-respondents-(2026-guide-to-ai-market-research)' },
      { title: 'Lakmoos at Succeet 2026: The Future of Market Research Is Already Here', date: '2026-03-19', url: 'https://lakmoos.com/blog/succeet-2026' },
      { title: 'Synthetic Panels Are Not LLMs', date: '2026-01-15', url: 'https://lakmoos.com/blog/synthetic-panels-are-not-llms' },
      { title: 'Why Most AI Research Fails', date: '2026-01-03', url: 'https://lakmoos.com/blog/there-is-no-one-ai' },
      { title: 'If AI Panels Were Holiday Movies', date: '2025-12-18', url: 'https://lakmoos.com/blog/ai-panels-as-christmas-movies' },
      { title: 'The Research Department of One', date: '2025-12-10', url: 'https://lakmoos.com/blog/research-department-of-one' },
      { title: 'The Rise of the AI Researcher', date: '2025-12-01', url: 'https://lakmoos.com/blog/ai-researcher' },
      { title: 'The Executive Guide to AI Panels in Marketing and Product', date: '2025-11-27', url: 'https://lakmoos.com/blog/the-executive-guide-to-ai-panels-in-marketing-and-product' },
      { title: 'AI Panels: Not All Are Created Equal', date: '2025-11-20', url: 'https://lakmoos.com/blog/aipanel-comparison' },
      { title: 'Boost Your Consumer Research Maturity', date: '2025-11-14', url: 'https://lakmoos.com/blog/boost-your-research-maturity' },
      { title: 'Sample Boost vs. Synthetic Sample', date: '2025-11-10', url: 'https://lakmoos.com/blog/sample-boost-or-synthetic-sample' },
      { title: 'AI Panels in Marketing: An Easy Guide for Busy People', date: '2025-11-04', url: 'https://lakmoos.com/blog/ai-panels-in-marketing' },
      { title: 'Choose the Right AI for the Right Research', date: '2025-10-29', url: 'https://lakmoos.com/blog/llm-are-not-enough' },
      { title: '5 Ways to Start Using AI Panels for Customer Research Today', date: '2025-10-20', url: 'https://lakmoos.com/blog/5-ways-to-start' },
      { title: 'Pitch Smarter, Deliver Faster', date: '2025-10-13', url: 'https://lakmoos.com/blog/creative-agencies' },
      { title: '10 Questions to Ask Before You Buy AI Data or a Synthetic Panel', date: '2025-10-07', url: 'https://lakmoos.com/blog/10-questions-checklist' },
      { title: 'AI Panels vs Traditional Surveys: Pros and Cons', date: '2025-10-03', url: 'https://lakmoos.com/blog/ai-panels-vs-traditional-surveys-what-you-gain-what-you-lose' },
      { title: 'The Hyper-Personalised Era: A Billion Segments of One', date: '2025-10-01', url: 'https://lakmoos.com/blog/billion-segments-of-one' },
      { title: 'How Agencies Can Scale Smart Research', date: '2025-09-25', url: 'https://lakmoos.com/blog/ai-for-agencies' },
      { title: 'The Best 10 AI Panels for Market Research', date: '2025-09-22', url: 'https://lakmoos.com/blog/the-best-10-ai-panels-for-market-research' },
      { title: 'Beware of Botshit: Market Research Edition', date: '2025-09-15', url: 'https://lakmoos.com/blog/beware-of-botshit' },
      { title: 'Beyond Design Sprints', date: '2025-09-01', url: 'https://lakmoos.com/blog/beyond-design-sprints' },
      { title: 'Forget the Data Dump', date: '2025-08-28', url: 'https://lakmoos.com/blog/progressive-enrichment' },
      { title: 'From Gut Feelings to Always-On Insights', date: '2025-08-26', url: 'https://lakmoos.com/blog/research-model-maturity' },
      { title: 'Neuro-symbolic AI', date: '2025-08-20', url: 'https://lakmoos.com/blog/neuro-symbolic-ai' },
      { title: 'Beyond Self-Report', date: '2025-08-13', url: 'https://lakmoos.com/blog/validating-synthetic-panels' },
      { title: 'Cultural Fidelity', date: '2025-08-13', url: 'https://lakmoos.com/blog/cultural-fidelity' },
      { title: 'Lakmoos Tarot Cards', date: '2025-08-11', url: 'https://lakmoos.com/blog/tarot-cards' },
      { title: 'What Are Synthetic Respondents?', date: '2025-08-07', url: 'https://lakmoos.com/blog/synthetic-respondents' },
      { title: 'Multi-Agent Simulation', date: '2025-08-04', url: 'https://lakmoos.com/blog/multi-agent-simulation-the-future-of-consumer-insight-has-already-begun' },
      { title: "Lakmoos AI Answers ESOMAR's 20 Questions", date: '2025-07-30', url: 'https://lakmoos.com/blog/lakmoos-answers-esomar-questions' },
      { title: 'Glossary: AI Panels and Synthetic Research Terms', date: '2025-07-25', url: 'https://lakmoos.com/blog/glossary' },
      { title: 'Choosing the Right AI for Synthetic Panels', date: '2025-07-23', url: 'https://lakmoos.com/blog/comparison-of-ai-for-synthetic-panels' },
      { title: 'WHITEPAPER: Buy AI for Research Without the Hype', date: '2025-07-21', url: 'https://lakmoos.com/blog/whitepaper-esomar-questions' },
      { title: 'WHITEPAPER: Consumer Research Maturity Model', date: '2025-07-21', url: 'https://lakmoos.com/blog/whitepaper-consumer-research-maturity-model' },
      { title: 'WHITEPAPER: AI Agents in Market Research', date: '2025-07-21', url: 'https://lakmoos.com/blog/whitepaper-ai-agents' },
      { title: 'AI Agents in Market Research: From Expertise Bottlenecks to Instant Insight', date: '2025-07-17', url: 'https://lakmoos.com/blog/ai-agents-in-market-research-in-2025' },
      { title: 'AI for Quant & Qual Market Research', date: '2025-07-16', url: 'https://lakmoos.com/blog/ai-for-quant-qual-market-researchers' },
      { title: 'From Static Surveys to Synthetic Samples', date: '2025-07-11', url: 'https://lakmoos.com/blog/static-surveys-to-synthetic-samples' },
      { title: 'Co je syntetický respondent?', date: '2025-07-01', url: 'https://lakmoos.com/blog/synteticky-respondent' },
      { title: 'Slovníček pojmů pro AI průzkum trhu', date: '2025-07-01', url: 'https://lakmoos.com/blog/slovnicek' },
      { title: 'Jak poznat, že váš AI panel není výzkum', date: '2025-07-01', url: 'https://lakmoos.com/blog/jak-poznat-že-váš-ai-panel-není-výzkum-ale-jen-mluvka' },
      { title: 'Kde už ChatGPT nestačí', date: '2025-07-01', url: 'https://lakmoos.com/blog/kde-už-chatgpt-nestačí' },
      { title: 'Proč se firmy bojí nahradit dotazníky AI', date: '2025-07-01', url: 'https://lakmoos.com/blog/proc-se-lidi-boji' },
      { title: 'Syntetický respondent od A do Z', date: '2025-07-01', url: 'https://lakmoos.com/blog/pruvodce' }
    ]
  },
  {
    name: 'Logical Intelligence', initials: 'LI', website: 'https://logicalintelligence.com/',
    linkedin: 'https://www.linkedin.com/company/logical-intelligence/',
    ceoName: 'Eve Bodnia', ceoLinkedin: 'https://www.linkedin.com/in/eve-bodnia-351b41355/', ceoSince: '2025-01',
    favicon: 'https://framerusercontent.com/images/xAxeJPFxOsjXbeP6wP6ChkJieT0.png',
    product: 'Kona 1.0 / Aleph', industry: 'Critical Systems AI', location: 'California, US',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Automatic Formal Verification for Code Generation', postDate: '2026-06-03',
    postUrl: 'https://logicalintelligence.com/blog/automatic-formal-verification-for-code-generation', color: '#c44632',
    posts: [
      { title: 'Automatic Formal Verification for Code Generation', date: '2026-06-03', url: 'https://logicalintelligence.com/blog/automatic-formal-verification-for-code-generation' },
      { title: 'Aleph Prover Uses Formal Methods to Disproof Erdős Theorem', date: '2026-05-28', url: 'https://logicalintelligence.com/blog/aleph-prover-erdos-disproof-lean-4-formal-methods' },
      { title: 'Aleph Prover Tops Leading Formal Reasoning Benchmarks and Signals What Comes Next for AI', date: '2026-05-20', url: 'https://logicalintelligence.com/blog/aleph-prover-tops-leading-benchmarks' },
      { title: 'Aleph Reaches State-of-the-Art Across the Leading Formal Reasoning Benchmarks as Verified Code Generation Nears Reality', date: '2026-05-14', url: 'https://logicalintelligence.com/blog/aleph-leading-benchmarks' },
      { title: "Beyond the GPU Bottleneck: Reflections from Milken on AI's Hypergrowth Era", date: '2026-05-07', url: 'https://logicalintelligence.com/blog/ai-hypergrowth-milken-gpu-bottleneck' },
      { title: 'George Washington, Carb Loading, and the Future of AI', date: '2026-05-04', url: 'https://logicalintelligence.com/blog/the-future-of-ai' },
      { title: 'EBM vs. LLMs: Our Kona EBM a 96% vs. 2% Sudoku Benchmark', date: '2026-02-03', url: 'https://logicalintelligence.com/blog/energy-based-model-sudoku-demo' },
      { title: 'Eve Bodnia: Why AI Needs Energy-Based Models, Not Just LLMs', date: '2026-01-21', url: 'https://logicalintelligence.com/blog/energy-based-ai-vision-the-art-of-knowing/' },
      { title: 'Energy-Based Models for Reasoning, LLMs for the Interface: Scaling Reasoning with Agentic AI', date: '2026-01-21', url: 'https://logicalintelligence.com/blog/energy-based-models-for-reasoning' },
      { title: 'Aleph AI Solves 99.4% of PutnamBench, Topping Leaderboard', date: '2026-01-21', url: 'https://logicalintelligence.com/blog/aleph-solves-putnambench' }
    ]
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
    postUrl: 'https://www.onteric.com/news-and-insights/ai-needs-datasheets', color: '#315f4c',
    posts: [
      { title: 'AI needs datasheets', date: '2026-08-03', url: 'https://www.onteric.com/news-and-insights/ai-needs-datasheets' },
      { title: "The Cost of Doing Nothing (And Why You're Ready for the Alternative)", date: '2026-03-23', url: 'https://www.onteric.com/news-and-insights/the-cost-of-doing-nothing-and-why-youre-ready-for-the-alternative' },
      { title: 'Is AI in the public sector just naïve techno-utopianism?', date: '2026-03-03', url: 'https://www.onteric.com/news-and-insights/is-ai-in-the-public-sector-just-naive-techno-utopianism' },
      { title: 'Not all AI is created equal: Choosing the right AI', date: '2026-02-04', url: 'https://www.onteric.com/news-and-insights/not-all-ai-is-created-equal-choosing-the-right-ai-for-financial-services-and-open-finance' },
      { title: 'Onteric founders win Technology Entrepreneur of the Year award', date: '2026-01-13', url: 'https://www.onteric.com/news-and-insights/onteric-founders-win-technology-entrepreneur-of-the-year-award' },
      { title: 'Is there an AI bubble? Wrong question.', date: '2025-12-15', url: 'https://www.onteric.com/news-and-insights/is-there-an-ai-bubble-wrong-question' },
      { title: 'Onteric wins Future of Mortgage Innovation Award', date: '2025-12-12', url: 'https://www.onteric.com/news-and-insights/onteric-wins-future-of-mortgage-innovation-award' }
    ]
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
    postUrl: 'https://onton.com/research/ontology-1', color: '#d05b3f',
    posts: [
      { title: 'Ontology 1: A Successor Architecture for Search', date: '2026-07-29', url: 'https://onton.com/research/ontology-1' },
      { title: 'Ontology 1: Benchmarks', date: '2026-07-29', url: 'https://onton.com/research/ontology-1-benchmarks' },
      { title: 'Everything New on Onton (May 2026)', date: '2026-05-06', url: 'https://onton.com/research/may-2026-updates' },
      { title: 'Self-learning search', date: '2025-11-25', url: 'https://onton.com/research/self-learning' },
      { title: "Ontonathon: Our Unfiltered Failure Log", date: '2025-11-18', url: 'https://onton.com/research/failure-wall' },
      { title: "Onton's New Canvas Tool Helps You Design, Visualize, and Shop Your Dream Space", date: '2025-11-07', url: 'https://onton.com/research/introducing-canvas' },
      { title: 'Rethinking Product Search: Why Smaller Models and Better Context Win', date: '2025-10-17', url: 'https://onton.com/research/rethinking-product-search-why-smaller-models-and-context-win' },
      { title: 'Introducing Onton', date: '2024-08-05', url: 'https://onton.com/research/deft-is-now-onton' }
    ]
  },
  {
    name: 'Permion', initials: 'PE', website: 'https://www.permion.ai/',
    linkedin: 'https://www.linkedin.com/company/permion/',
    ceoName: 'Arun Majumdar', ceoLinkedin: 'https://www.linkedin.com/in/arun-majumdar-8a555336/', ceoSince: '2018-03',
    favicon: 'https://www.permion.ai/wp-content/uploads/2025/01/cropped-permion-logo_icon-192x192.png', product: 'Permion AI',
    industry: 'Mission-Critical AI', location: 'Washington DC Metro, US', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Permion selected and representing the USA as the winner in the Government AI Grand Challenge for the G7+EU', postDate: '2026-07-01',
    postUrl: 'https://www.permion.ai/permion-selected-and-representing-the-usa-as-the-winner-in-the-government-ai-grand-challenge-for-the-g7eu/', color: '#405a67',
    posts: [
      { title: 'Permion selected and representing the USA as the winner in the Government AI Grand Challenge for the G7+EU', date: '2026-07-01', url: 'https://www.permion.ai/permion-selected-and-representing-the-usa-as-the-winner-in-the-government-ai-grand-challenge-for-the-g7eu/' },
      { title: 'What Sets Permion Apart? Neurosymbolic AI and Large Graph Models', date: '2025-11-20', url: 'https://www.permion.ai/what-sets-permion-apart-from-others-neurosymbolic-ai-large-graph-models/' },
      { title: 'Response to Regulatory Reform on Artificial Intelligence', date: '2025-10-28', url: 'https://www.permion.ai/response-to-regulatory-reform-on-artificial-intelligence/' }
    ]
  },
  {
    name: 'QGI', initials: 'QG', website: 'https://qgi.dev/',
    linkedin: 'https://www.linkedin.com/company/quantum-general-intelligence-inc',
    ceoName: 'Dain Ehring', ceoLinkedin: 'https://www.linkedin.com/in/dainehring/', ceoSince: '2026-01',
    favicon: 'favicons/qgi.jpg', product: 'QAG Engine',
    industry: 'AI Infrastructure', location: 'California, US', funding: '$3M SAFE (planned, 2026)',
    fundingUrl: 'https://www.einpresswire.com/article/885914885/quantum-general-intelligence-qgi-emerges-from-stealth-to-make-ai-admissible-for-regulated-industries',
    postTitle: 'The AI factory is the next enterprise operating model', postDate: '2026-05-02',
    postUrl: 'https://qgi.dev/blog/ai-factory-custom-ai-context-engineering/', color: '#2f4a8f',
    posts: [
      { title: 'The AI factory is the next enterprise operating model', date: '2026-05-02', url: 'https://qgi.dev/blog/ai-factory-custom-ai-context-engineering/' },
      { title: 'From black-box RAG to deterministic QAG: a map of the five-layer stack', date: '2026-04-25', url: 'https://qgi.dev/blog/deterministic-stack-five-layers/' },
      { title: 'Why Q-Prime has no public weights — and why that matters for regulated AI', date: '2026-04-25', url: 'https://qgi.dev/blog/why-q-prime-has-no-weights/' },
      { title: 'QGI Launches the Deterministic AI Stack: Five Products for Regulated Decisions', date: '2026-04-24', url: 'https://qgi.dev/news/qgi-relaunch/' },
      { title: "Quantum General Intelligence Inc. Unveils Q-Prime, the World's First Commercial Quantum Embedding Model on HuggingFace", date: '2026-04-21', url: 'https://qgi.dev/news/q-prime-huggingface-launch' },
      { title: 'QGI Introduces Quantum Algorithm Engine for Real-World Production AI Systems', date: '2026-04-21', url: 'https://qgi.dev/news/qag-engine-production-preview' },
      { title: 'LoanLogics Evaluates Deterministic AI from QGI to Strengthen Mortgage Compliance', date: '2026-03-03', url: 'https://qgi.dev/news/loanlogics-evaluates-qgi' },
      { title: 'QGI (Quantum General Intelligence) Emerges from Stealth to Make AI Admissible for Regulated Industries', date: '2026-01-23', url: 'https://qgi.dev/news/qgi-emerges-from-stealth' }
    ]
  },
  {
    name: 'RAAPID', initials: 'RP', website: 'https://www.raapidinc.com/',
    linkedin: 'https://www.linkedin.com/company/raapid/',
    ceoName: 'Chetan Parikh', ceoLinkedin: 'https://www.linkedin.com/in/chetanparikh/', ceoSince: '2022-02',
    favicon: 'https://www.raapidinc.com/favicon.ico', product: 'Risk Adjustment Platform', industry: 'Healthcare',
    location: 'Kentucky, US', funding: '$6.7M disclosed',
    fundingUrl: 'https://www.cbinsights.com/company/raapid/financials',
    postTitle: 'The Defensible Risk Adjustment Playbook for 2026-27', postDate: '2026-07-29',
    postUrl: 'https://www.raapidinc.com/blogs/defensible-risk-adjustment-playbook/', color: '#0c6d7b',
    posts: [
      { title: 'The Defensible Risk Adjustment Playbook for 2026-27', date: '2026-07-29', url: 'https://www.raapidinc.com/blogs/defensible-risk-adjustment-playbook/' },
      { title: 'CMS Risk Adjustment Submission Deadlines for 2026, 2027, and 2028: Key Dates for Compliance', date: '2026-07-24', url: 'https://www.raapidinc.com/blogs/cms-risk-adjustment-submission-deadlines/' },
      { title: 'CMS-HCC Model V28: What Changed, the RAF Impact, and the CY2027 Update', date: '2026-07-14', url: 'https://www.raapidinc.com/blogs/cms-hcc-model-v28/' },
      { title: 'CY2027 Rate Announcement: What It Actually Costs Your Risk Scores', date: '2026-07-02', url: 'https://www.raapidinc.com/blogs/cy2027-rate-announcement-risk-score-impact/' },
      { title: 'What If Risk Adjustment Coding Only Needed OnePass?', date: '2026-07-01', url: 'https://www.raapidinc.com/blog/onepass-vs-multi-pass-coding/' },
      { title: 'Top Risk Adjustment Vendors to Compare in 2026', date: '2026-06-22', url: 'https://www.raapidinc.com/blogs/top-4-risk-adjustment-vendors-2026/' },
      { title: 'RADV Audits in 2026: What Medicare Advantage Plans Need to Know', date: '2026-06-10', url: 'https://www.raapidinc.com/blogs/radv-audits-2026/' },
      { title: 'How Neuro-Symbolic AI Enables Defensible Coding in Risk Adjustment', date: '2026-05-18', url: 'https://www.raapidinc.com/blogs/neuro-symbolic-ai-in-risk-adjustment/' }
    ]
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
    postUrl: 'https://www.rippletide.com/resources/blog/the-harness-is-the-agent-whats-inside', color: '#623d8f',
    posts: [
      { title: "The Harness is the agent: what's inside?", date: '2026-07-15', url: 'https://www.rippletide.com/resources/blog/the-harness-is-the-agent-whats-inside' },
      { title: 'Same Research, Sharper Wedge: Why Rippletide Now Leads with Write-Access Safety', date: '2026-07-02', url: 'https://www.rippletide.com/resources/blog/same-research-sharper-wedge' },
      { title: 'AI Agent Control Towers Are Coming. The Action Boundary Is Still Missing.', date: '2026-06-25', url: 'https://www.rippletide.com/resources/blog/ai-agent-control-towers-action-boundary' },
      { title: 'A Backup Model Is Not an Agent Continuity Plan', date: '2026-06-15', url: 'https://www.rippletide.com/resources/blog/backup-model-is-not-an-agent-continuity-plan' },
      { title: "What if you can't afford Palantir agents?", date: '2026-05-13', url: 'https://www.rippletide.com/resources/blog/what-if-you-cant-afford-palantir-agents' },
      { title: 'Salesforce Validated the Execution Layer. Its Perimeter Proves Why Enforcement Must Be Neutral.', date: '2026-05-04', url: 'https://www.rippletide.com/resources/blog/agentforce-operations-and-the-neutral-enforcement-layer' },
      { title: "The Harness Is Replaceable. The Decision Problem Isn't.", date: '2026-04-22', url: 'https://www.rippletide.com/resources/blog/the-harness-is-replaceable-the-decision-problem-isnt' },
      { title: 'Eval: graph harness outperforms all LLM-based agents', date: '2026-04-15', url: 'https://www.rippletide.com/resources/blog/your-ai-keeps-making-mistakes-the-problem-isnt-the-model' },
      { title: "F/AI Deal Day: What We Learned in 3 Months Inside Europe's Top AI Program", date: '2026-04-14', url: 'https://www.rippletide.com/resources/blog/rippletide-station-f-fai-deal-day-2026' },
      { title: 'Context without enforcement is not infrastructure', date: '2026-03-25', url: 'https://www.rippletide.com/resources/blog/context-without-enforcement-is-not-infrastructure' },
      { title: 'AI Agent Evaluation: Why Your Current Testing Framework Will Not Survive Production', date: '2026-03-19', url: 'https://www.rippletide.com/resources/blog/ai-agent-evaluation-why-your-current-testing-framework-will-not-survive-production' },
      { title: 'Self-Learning, Non-Regressive Agents', date: '2026-03-11', url: 'https://www.rippletide.com/resources/blog/self-learning-non-regressive-agents' },
      { title: 'We Were in the Room When the Context Graph Conversation Got Serious', date: '2026-03-04', url: 'https://www.rippletide.com/resources/blog/we-were-in-the-room-when-the-context-graph-conversation-got-serious' },
      { title: 'How to Keep Codex Aligned with Team Style and Avoid Regressions', date: '2026-02-26', url: 'https://www.rippletide.com/resources/blog/how-to-keep-codex-aligned-with-team-style-and-avoid-regressions' },
      { title: 'How to Build a Reliable AI Agent', date: '2026-02-24', url: 'https://www.rippletide.com/resources/blog/how-to-build-a-reliable-ai-agent' },
      { title: 'Autonomous Agents Need Authority', date: '2026-02-17', url: 'https://www.rippletide.com/resources/blog/autonomous-agents-need-execution-authority' },
      { title: 'Winning the OpenAI Codex Hackathon: Moving from Outputs to Outcomes — The Decision Layer', date: '2026-02-07', url: 'https://www.rippletide.com/resources/blog/winning-the-openai-codex-hackathon-moving-from-outputs-to-outcomes-the-decision-layer' },
      { title: 'Building a Product With Multiple Claude Code Agents: What Breaks First', date: '2026-01-28', url: 'https://www.rippletide.com/resources/blog/managing-multiple-claude-code-agents-building-product' },
      { title: 'Context Graphs: What They Actually Solve?', date: '2026-01-27', url: 'https://www.rippletide.com/resources/blog/context-graphs-what-they-actually-solve' },
      { title: 'The Market Shift Around the $1T Context Opportunity', date: '2026-01-22', url: 'https://www.rippletide.com/resources/blog/the-market-shift-around-the-1t-context-opportunity' },
      { title: 'If your AI agent has a 95% accuracy, it will fail in production', date: '2026-01-13', url: 'https://www.rippletide.com/resources/blog/if-your-ai-agent-has-95-accuracy-it-will-fail-in-production' },
      { title: 'Rippletide at Adopt AI 2025: Building the Foundation for Trustworthy AI Agents', date: '2026-01-13', url: 'https://www.rippletide.com/resources/blog/rippletide-at-adopt-ai-2025-building-the-foundation-for-trustworthy-ai-agents' },
      { title: 'Rippletide x Blaxel: Safe Enterprise Agents at Real-Time Speed', date: '2025-12-09', url: 'https://www.rippletide.com/resources/blog/rippletide-blaxel-safe-enterprise-agents-at-real-time-speed' },
      { title: 'Why You Should Join Rippletide — Now', date: '2025-12-06', url: 'https://www.rippletide.com/resources/blog/why-you-should-join-rippletide-now' },
      { title: 'Agents for Enterprise: Why the Prompt Is the Tip of the Iceberg', date: '2025-11-20', url: 'https://www.rippletide.com/resources/blog/the-prompt-is-the-tip-of-the-iceberg' },
      { title: 'The Cost of Non-Explainability: Why Enterprises Need Trustworthy Agent Architecture by Design', date: '2025-11-14', url: 'https://www.rippletide.com/resources/blog/the-cost-of-non-explainability-why-enterprises-need-trustworthy-agent-architecture-by-design' },
      { title: "The State of AI Agents 2025: A CEO's Framework to Read the Agentic Market", date: '2025-11-04', url: 'https://www.rippletide.com/resources/blog/the-state-of-ai-agents-2025-a-ceo-s-framework-to-read-the-agentic-market' },
      { title: "Agent Reliability: What's Missing in Enterprise AI Agent Architecture", date: '2025-10-29', url: 'https://www.rippletide.com/resources/blog/agent-reliability-what-s-missing-in-enterprise-ai-agent-architecture' },
      { title: "Rippletide: The Decision Kernel for Your Agent OS", date: '2025-10-07', url: 'https://www.rippletide.com/resources/blog/rippletide-the-decision-kernel-for-your-agent-os' },
      { title: 'Micro, Macro, and Multi-Determinism for AI Agents', date: '2025-09-30', url: 'https://www.rippletide.com/resources/blog/micro-macro-and-multi-determinism-for-ai-agents' },
      { title: 'Beyond the POC Wall: Engineering Trust for Enterprise-Grade AI Agents', date: '2025-09-26', url: 'https://www.rippletide.com/resources/blog/beyond-the-poc-wall-engineering-trust-for-enterprise-grade-ai-agents' },
      { title: 'The Death of RAG', date: '2025-08-19', url: 'https://www.rippletide.com/resources/blog/the-death-of-rag' },
      { title: 'Autonomous AI in the Enterprise: Transforming Operations Through Strategic Autonomy', date: '2025-08-13', url: 'https://www.rippletide.com/resources/blog/autonomous-ai-enterprise' },
      { title: 'The Complete Guide to AI Sales Agent for Inside Sales (2025 Edition)', date: '2025-07-22', url: 'https://www.rippletide.com/resources/blog/ai-sales-agent-guide-2025' },
      { title: 'What is an AI Sales Agent?', date: '2025-06-30', url: 'https://www.rippletide.com/resources/blog/what-is-an-ai-sales-agent' },
      { title: 'What Can Go Wrong with Agents in Production', date: '2025-06-26', url: 'https://www.rippletide.com/resources/blog/what-can-go-wrong-with-agents-in-production' },
      { title: '12 Questions to Ask Before You Ship an AI Agent', date: '2025-06-24', url: 'https://www.rippletide.com/resources/blog/12-questions-before-shipping-ai-agent' },
      { title: 'AI Sales Agent vs. AI Sales Copilot', date: '2025-06-15', url: 'https://www.rippletide.com/resources/blog/ai-sales-agent-vs-copilot' },
      { title: 'Why Verticalizing Reasoning Models?', date: '2025-06-02', url: 'https://www.rippletide.com/resources/blog/why-verticalizing-reasoning-models' },
      { title: '5 Follow-Up Touches, 5X the Sales', date: '2025-05-20', url: 'https://www.rippletide.com/resources/blog/persistent-follow-up-b2b-sales' },
      { title: 'Press: Where Rippletide is Making Waves', date: '2025-05-16', url: 'https://www.rippletide.com/resources/blog/where-rippletide-is-making-waves' },
      { title: 'Inbound vs Outbound Marketing?', date: '2025-05-05', url: 'https://www.rippletide.com/resources/blog/inbound-vs-outbound-marketing' },
      { title: "Rippletide : L'IA native qui booste la performance des équipes de vente", date: '2025-04-10', url: 'https://www.rippletide.com/resources/blog/rippletide-ia-performance-ventes' },
      { title: 'How to Attract Exceptional Talent for Your Startup', date: '2025-03-26', url: 'https://www.rippletide.com/resources/blog/how-to-attract-exceptional-talent-for-your-startup' },
      { title: 'Paris AI Summit: Main Takeaways', date: '2025-02-12', url: 'https://www.rippletide.com/resources/blog/paris-ai-summit-main-takeaways' },
      { title: 'Building a Culture of Innovation, Empowerment, Accountability, and Collaboration at Rippletide', date: '2025-02-07', url: 'https://www.rippletide.com/resources/blog/building-a-culture-of-innovation-empowerment-accountability-and-collaboration-at-rippletide' },
      { title: "The AI Act Comes Into Play: Don't Panic — Here's How to Survive and Thrive in the World of Regulated AI", date: '2025-01-31', url: 'https://www.rippletide.com/resources/blog/the-ai-act-comes-into-play-dont-panic-heres-how-to-survive-and-thrive-in-the-world-of-regulated-ai' },
      { title: 'Key Findings for Selling in the French Canadian Market', date: '2024-11-06', url: 'https://www.rippletide.com/resources/blog/french-canadian-market' },
      { title: 'How Far Are We from AI on the Edge?', date: '2024-06-21', url: 'https://www.rippletide.com/resources/blog/how-far-are-we-from-ai-on-edge' },
      { title: "Rippletide's Values — #3: Integrity", date: '2024-06-20', url: 'https://www.rippletide.com/resources/blog/rippletides-values-integrity' },
      { title: 'Imperial College Ranks 2nd in QS Rankings', date: '2024-06-11', url: 'https://www.rippletide.com/resources/blog/imperial-college-ranks-2nd-in-2025-qs-rankings' },
      { title: 'Rippletide: Top 5 Startups to Watch at VivaTech 2024', date: '2024-05-23', url: 'https://www.rippletide.com/resources/blog/rippletide-top-5-startups-to-watch-at-vivatech-2024' },
      { title: "Rippletide's Values — #2: Teamplay", date: '2024-05-22', url: 'https://www.rippletide.com/resources/blog/rippletides-values-2-teamplay' },
      { title: 'Llama 3: Enhancing AI Accessibility', date: '2024-05-15', url: 'https://www.rippletide.com/resources/blog/llama-3-enhancing-ai-accessibility' },
      { title: "Rippletide's Values — #1: Innovation", date: '2024-05-13', url: 'https://www.rippletide.com/resources/blog/rippletides-values-1-innovation' }
    ]
  },
  {
    name: 'SeKondBrain AI', initials: 'SB', website: 'https://www.sekondbrain.ai/',
    linkedin: 'https://www.linkedin.com/company/sekondbrain/',
    ceoName: 'Sachin Dev Duggal', ceoLinkedin: 'https://www.linkedin.com/in/sachin-dev-duggal-255406/', ceoSince: '2025-09',
    favicon: 'https://framerusercontent.com/images/TpDgoIiYXMbCgvdh8KAaXl3zuxc.png', product: 'Cognitive OS',
    industry: 'Cognitive AI', location: 'Dubai, UAE', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Atomic Unit of X', postDate: '2026-05-05',
    postUrl: 'https://www.sekondbrain.ai/research/atomic-unit-of-x', color: '#9e77e9',
    posts: [
      { title: 'Atomic Unit of X', date: '2026-05-05', url: 'https://www.sekondbrain.ai/research/atomic-unit-of-x' },
      { title: 'Cognition as an Ecology: Designing AI for Internal Memory, Proximal Ecosystems, and External Unknowns', date: '2025-12-17', url: 'https://www.sekondbrain.ai/research/cognition-as-an-ecology' }
    ]
  },
  {
    name: 'Symbolica', initials: 'SY', website: 'https://www.symbolica.ai/',
    linkedin: 'https://www.linkedin.com/company/symbolica-ai/',
    ceoName: 'George Morgan', ceoLinkedin: 'https://www.linkedin.com/in/georgemorgan2/', ceoSince: '2022-07',
    favicon: 'https://www.symbolica.ai/favicon-symbolica.png', product: 'Agentica',
    industry: 'AI Agent Infrastructure', location: 'California, US', funding: '$33M total (2024)',
    fundingUrl: 'https://siliconangle.com/2024/04/09/symbolica-launches-33m-change-ai-industry-symbolic-models/',
    postTitle: 'The Collaborative Canvas: A New Era of Agentic Interaction', postDate: '2026-05-05',
    postUrl: 'https://www.symbolica.ai/blog/collaborative-canvas', color: '#7678e3',
    posts: [
      { title: 'The Collaborative Canvas: A New Era of Agentic Interaction', date: '2026-05-05', url: 'https://www.symbolica.ai/blog/collaborative-canvas' },
      { title: 'Agentica MCP: A Stateful REPL for Your Agents', date: '2026-05-05', url: 'https://www.symbolica.ai/blog/agentica-mcp' },
      { title: 'Introducing Agentica: Agents by Anyone, for Everyone', date: '2026-03-19', url: 'https://www.symbolica.ai/blog/introducing-agentica' },
      { title: 'Runtime as Context: How Agentica SDK Agents Reason Over Data', date: '2026-02-19', url: 'https://www.symbolica.ai/blog/runtime-as-context' }
    ]
  },
  {
    name: 'Synalinks', initials: 'SL', website: 'https://www.synalinks.com/',
    linkedin: 'https://www.linkedin.com/company/synalinks/',
    ceoName: 'Yoan Sallami', ceoLinkedin: 'https://www.linkedin.com/in/yoan-sallami/', ceoSince: '2023-09',
    favicon: 'https://www.synalinks.com/favicon.svg', product: 'Synalinks', industry: 'AI Agent Infrastructure',
    location: 'Occitanie, France', funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Context Graphs: The Three Graph Structures Behind Reliable AI Agents', postDate: '2026-02-25',
    postUrl: 'https://www.synalinks.com/en/blog/context-graphs-for-ai-agents', color: '#286f63',
    posts: [
      { title: 'Context Graphs: The Three Graph Structures Behind Reliable AI Agents', date: '2026-02-25', url: 'https://www.synalinks.com/en/blog/context-graphs-for-ai-agents' },
      { title: 'GraphRAG vs Synalinks: Retrieval is Not Reasoning', date: '2026-02-21', url: 'https://www.synalinks.com/en/blog/graphrag-vs-synalinks' },
      { title: 'Build an AI Agent That Never Hallucinates', date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/how-to-build-an-ai-agent-that-never-hallucinates' },
      { title: "RAG vs Knowledge Graphs: A Developer's Decision Guide", date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/rag-vs-knowledge-graphs' },
      { title: 'Traceable AI: Make Your Agents EU AI Act Ready', date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/traceable-ai-eu-ai-act-compliance' },
      { title: 'What Is a Deterministic Reasoning Layer for AI Agents?', date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/what-is-a-deterministic-reasoning-layer' },
      { title: 'Why AI Agent Failures Start at the Memory Layer', date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/why-ai-agents-fail-in-production' },
      { title: 'Your AI Agent Gave the Wrong Answer. Now What?', date: '2026-02-20', url: 'https://www.synalinks.com/en/blog/why-ai-agents-hallucinate' }
    ]
  },
  {
    name: 'UMNAI', initials: 'UM', website: 'https://umnai.com/',
    linkedin: 'https://www.linkedin.com/company/umnai/',
    ceoName: 'Angelo Dalli', ceoLinkedin: 'https://www.linkedin.com/in/angelodalli/', ceoSince: '2019-04',
    favicon: 'https://umnai.com/__l5e/assets-v1/cb515d94-bfd9-42ac-b900-6051f0fedd97/umnai-logo-footer.png',
    product: 'Hybrid Intelligence', industry: 'Decision Intelligence', location: 'England, UK',
    funding: 'Not disclosed', fundingUrl: '',
    postTitle: 'Explainable AI in Finance: Compliance and Governance', postDate: '2026-08-01',
    postUrl: 'https://umnai.com/research/technical-insights/governance-audit-trust/explainable-ai-compliance', color: '#a86a11',
    posts: [
      { title: 'Explainable AI in Finance: Compliance and Governance', date: '2026-08-01', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/explainable-ai-compliance' },
      { title: 'Sovereign AI Begins With Architectural Choice', date: '2026-07-29', url: 'https://umnai.com/company/blog/sovereign-ai-begins-with-architectural-choice' },
      { title: 'What are Explainable Neural Networks (XNNs)?', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/foundations/explainable-neural-networks' },
      { title: 'What is an Explanation Structure Model (ESM)?', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/foundations/explanation-structure-model' },
      { title: 'What Makes a Good AI Explanation?', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/explanations-interpretability/good-ai-explanation' },
      { title: 'Seven Types of AI Explanation in Hybrid Intelligence', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/explanations-interpretability/explanation-types' },
      { title: 'How XNN Attributions Explain AI Decisions', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/explanations-interpretability/xnn-attributions' },
      { title: 'How to Interpret XNN Results', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/explanations-interpretability/interpret-xnn-results' },
      { title: 'XNN What-If and Counterfactual Analysis', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/explanations-interpretability/what-if-counterfactual' },
      { title: 'How to Query XNNs and Receive Explanations', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/working-with-xnns/query-xnns-explanations' },
      { title: 'How XNN Predictions are Built', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/working-with-xnns/xnn-predictions-built' },
      { title: 'XNN Feature, Rule and Attribution Views', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/working-with-xnns/feature-rollups-rule-attribution-views' },
      { title: 'Local, Module and Global XNN Interpretability', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/working-with-xnns/local-module-global-interpretability' },
      { title: 'The Hybrid Intelligence Induction Process', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/model-lifecycle/hybrid-intelligence-induction-process' },
      { title: 'Training and Retraining Explainable Neural Networks', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/model-lifecycle/training-and-retraining-xnns' },
      { title: 'Retraining vs Reinduction for XNNs', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/model-lifecycle/retraining-vs-reinduction' },
      { title: 'Monitoring XNN Drift and Explanation Stability', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/model-lifecycle/monitoring-drift-activation-paths-explanation-stability' },
      { title: 'Incorporating Human Knowledge into XNNs', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/incorporating-human-knowledge-into-xnns' },
      { title: 'Auditing Explainable Neural Network Outputs', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/auditing-xnn-outputs' },
      { title: 'Unique Verification Codes for XNN Models and Queries', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/unique-verification-codes' },
      { title: 'Privacy-Preserving AI Auditability with XNNs', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/privacy-preserving-auditability' },
      { title: 'Trusted AI Infrastructure for Explainable Decisions', date: '2026-07-28', url: 'https://umnai.com/research/technical-insights/governance-audit-trust/trusted-ai-infrastructure' },
      { title: 'What is Neuro-Symbolic AI? A Technical Introduction', date: '2026-07-27', url: 'https://umnai.com/research/technical-insights/foundations/neuro-symbolic-ai' },
      { title: 'What is UMNAI Hybrid Intelligence?', date: '2026-07-27', url: 'https://umnai.com/research/technical-insights/foundations/hybrid-intelligence' },
      { title: 'Governing AI Decisions', date: '2026-07-06', url: 'https://umnai.com/company/blog/governing-ai-decisions' },
      { title: 'From Behavioural Testing to Inspectable Decisions: The Next Phase of AI Assurance', date: '2026-07-01', url: 'https://umnai.com/company/blog/from-behavioural-testing-to-inspectable-decisions-the-next-phase-of-ai-assurance' },
      { title: 'Deterministic Explanation in Hybrid Intelligence', date: '2026-06-26', url: 'https://umnai.com/research/deterministic-explanation-in-hybrid-intelligence' },
      { title: "UMNAI's approach to Neuro-symbolic AI", date: '2025-07-18', url: 'https://umnai.com/company/blog/umnai-neuro-symbolic-ai' },
      { title: 'Hybrid Agentic Computing', date: '2025-03-13', url: 'https://umnai.com/company/blog/hybrid-agentic-computing' },
      { title: 'Retrieval-Augmented Generation in Hybrid Intelligence', date: '2025-03-10', url: 'https://umnai.com/company/blog/agents-and-explainable-reinforcement-learning-fbjht' },
      { title: 'Agents and Explainable Reinforcement Learning', date: '2025-03-05', url: 'https://umnai.com/company/blog/agents-and-explainable-reinforcement-learning' },
      { title: 'The Quality of Explanations', date: '2025-03-05', url: 'https://umnai.com/company/blog/quality-of-explanations' },
      { title: 'Knowledge Discovery in Hybrid Intelligence', date: '2025-03-05', url: 'https://umnai.com/company/blog/knowledge-discovery-in-hybrid-intelligence' }
    ]
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
    postUrl: 'https://www.uniphore.com/blog/are-your-ai-models-limiting-your-business/', color: '#2d88a4',
    posts: [
      { title: 'Are Your AI Models Limiting Your Business?', date: '2026-07-17', url: 'https://www.uniphore.com/blog/are-your-ai-models-limiting-your-business/' },
      { title: 'Is AI Token Consumption Getting Out of Control?', date: '2026-07-14', url: 'https://www.uniphore.com/blog/is-ai-token-consumption-getting-out-of-control/' },
      { title: 'From Pilot Purgatory to AI That Actually Works in Production', date: '2026-07-10', url: 'https://www.uniphore.com/blog/from-pilot-purgatory-to-ai-that-actually-works-in-production/' },
      { title: 'Who Owns Your Competitive Intelligence?', date: '2026-07-07', url: 'https://www.uniphore.com/blog/who-owns-your-competitive-intelligence/' },
      { title: "Today's Customers Are Already AI Experts—and They're Ready to Operationalize It", date: '2026-06-25', url: 'https://www.uniphore.com/blog/todays-customers-are-already-ai-experts-and-theyre-ready-to-operationalize-it/' },
      { title: "Tokenmaxxing is Over. Here's What Comes Next.", date: '2026-06-16', url: 'https://www.uniphore.com/blog/tokenmaxxing-is-over-heres-what-comes-next/' },
      { title: 'Regulatory Compliance Decoded', date: '2026-05-11', url: 'https://www.uniphore.com/blog/regulatory-compliance-decoded/' },
      { title: 'Introducing Audience Agent', date: '2026-05-06', url: 'https://www.uniphore.com/blog/introducing-ai-audience-agent/' },
      { title: 'Automatic Speech Recognition in Practice', date: '2026-04-28', url: 'https://www.uniphore.com/blog/automatic-speech-recognition-in-practice/' }
    ]
  },
  {
    name: 'UnlikelyAI', initials: 'UA', website: 'https://www.unlikely.ai/',
    linkedin: 'https://www.linkedin.com/company/unlikely-ai/', favicon: 'https://www.unlikely.ai/favicon.ico',
    ceoName: 'William Tunstall-Pedoe', ceoLinkedin: 'https://www.linkedin.com/in/williamtp/', ceoSince: '2019-01',
    product: 'UnlikelyAI Platform', industry: 'Trustworthy AI', location: 'England, UK', funding: '$20M seed (2022)',
    fundingUrl: 'https://www.unlikely.ai/newsroom/unlikely-ai-raises-20-million-in-oversubscribed-seed-round',
    postTitle: "STRIDE and the way forward for trustworthy AI: our founder's new essay", postDate: '2026-07-31',
    postUrl: 'https://www.unlikely.ai/newsroom/stride-and-the-way-forward-for-trustworthy-ai-our-founder-s-new-essay', color: '#402f73',
    posts: [
      { title: "STRIDE and the way forward for trustworthy AI: our founder's new essay", date: '2026-07-31', url: 'https://www.unlikely.ai/newsroom/stride-and-the-way-forward-for-trustworthy-ai-our-founder-s-new-essay' },
      { title: "Why trust has become the defining constraint on AI: our founder's new essays", date: '2026-07-23', url: 'https://www.unlikely.ai/newsroom/why-trust-has-become-the-defining-constraint-on-ai-our-founder-s-new-essays' },
      { title: 'Iceland Innovation Week put AI sovereignty on the agenda. Here is what you need to know.', date: '2026-07-22', url: 'https://www.unlikely.ai/newsroom/iiw' },
      { title: "UnlikelyAI Webinar: Understanding AI reasoning through Kahneman's Thinking, Fast and Slow", date: '2026-07-22', url: 'https://www.unlikely.ai/newsroom/unlikely-ai-webinar-understanding-ai-reasoning-through-kahneman-s-thinking-fast-and-slow' },
      { title: "Our team won two awards at the National AI Awards 2026. Here's what they recognise.", date: '2026-07-22', url: 'https://www.unlikely.ai/newsroom/ai-awards-2026' },
      { title: "We've been named to the AIFinTech100 2026. Here's what the list is really telling.", date: '2026-07-22', url: 'https://www.unlikely.ai/newsroom/we-ve-been-named-to-the-ai-fin-tech100-2026-here-s-what-the-list-is-really-telling' },
      { title: "It's National AI Day. Here's the vocabulary, from household names to deep cuts.", date: '2026-07-22', url: 'https://www.unlikely.ai/newsroom/national-ai-day' },
      { title: 'The autonomous bank does not exist yet. What comes next depends on how you build.', date: '2026-07-03', url: 'https://www.unlikely.ai/newsroom/the-autonomous-bank-does-not-exist-yet' },
      { title: 'Welcoming to the team our new CTO and COO', date: '2026-06-29', url: 'https://www.unlikely.ai/newsroom/welcoming-to-the-team-our-new-cto-and-coo' },
      { title: "Regulated industries aren't slow to adopt AI. That's a costly misconception.", date: '2026-06-23', url: 'https://www.unlikely.ai/newsroom/regulated-industries-aren-t-slow-to-adopt-ai-that-s-a-costly-misconception' },
      { title: 'If it can be expressed as a rule, it should already be automated. What is AI actually for - Notes from London Tech Week', date: '2026-06-12', url: 'https://www.unlikely.ai/newsroom/if-it-can-be-expressed-as-a-rule-it-should-already-be-automated-what-is-ai-actually-for-notes-from-london-tech-week' },
      { title: 'The AI black box problem', date: '2026-04-24', url: 'https://www.unlikely.ai/newsroom/the-ai-black-box-problem' },
      { title: 'Two kinds of data, two kinds of AI', date: '2026-04-24', url: 'https://www.unlikely.ai/newsroom/two-kinds-of-data-two-kinds-of-ai' },
      { title: 'UnlikelyAI Webinar: What stands in the way of true AI ROI in Financial Services', date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/what-stands-in-the-way-of-true-ai-roi-in-financial-services' },
      { title: 'The AI Trust Report 2026: the trust ceiling is here', date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/the-ai-trust-report-2026-the-trust-ceiling-is-here' },
      { title: 'UnlikelyAI Webinar: The three shifts in accounting to watch next', date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/webinar-recap-the-three-shifts-in-accounting-to-watch-next' },
      { title: 'Can we trust humanlike AI? A fireside debate from OxGen25', date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/how-human-is-too-human-for-ai-a-fireside-debate-from-ox-gen25' },
      { title: "We launched the AI Trust Ceiling research. Here's what happened.", date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/we-launched-the-ai-trust-ceiling-research-here-s-what-happened' },
      { title: 'UnlikelyAI Webinar: Explainable AI in practice: techniques to build trust on top of LLMs', date: '2026-04-22', url: 'https://www.unlikely.ai/newsroom/webinar-recap-explainable-ai-in-practice-techniques-to-build-trust-on-top-of-ll-ms' },
      { title: 'Neurosymbolic AI explained (with legislation example)', date: '2026-04-17', url: 'https://www.unlikely.ai/newsroom/neurosymbolic-ai-explained-with-legislation-example' },
      { title: 'What fractals teach us about the limits of deep learning', date: '2026-04-10', url: 'https://www.unlikely.ai/newsroom/what-fractals-teach-us-about-the-limits-of-deep-learning' },
      { title: 'Channel 4 News came to our office this month. Here is what our CEO commented', date: '2026-04-08', url: 'https://www.unlikely.ai/newsroom/channel4' },
      { title: "As covered by City AM: Our report data a £29bn trust problem and the UK's AI ambition", date: '2026-04-08', url: 'https://www.unlikely.ai/newsroom/city-am' },
      { title: 'Beyond RAG: why regulated AI needs NeurosymbolicRAG', date: '2026-03-27', url: 'https://www.unlikely.ai/newsroom/beyond-rag-why-regulated-ai-needs-neurosymbolic-rag' },
      { title: 'UnlikelyAI raises $20 million in oversubscribed seed round', date: '2026-03-11', url: 'https://www.unlikely.ai/newsroom/unlikely-ai-raises-20-million-in-oversubscribed-seed-round' },
      { title: 'Why AI guardrails are not enough for enterprise reliability', date: '2026-02-12', url: 'https://www.unlikely.ai/newsroom/why-ai-guardrails-are-not-enough-for-enterprise-ai-reliability' },
      { title: "What is AI reasoning and why you can't trust it", date: '2026-01-22', url: 'https://www.unlikely.ai/newsroom/what-is-ai-reasoning-and-why-you-can-t-trust-it' },
      { title: 'UnlikelyAI wins Excellence in Claims Technology at the Insurance Times Awards 2025', date: '2026-01-22', url: 'https://www.unlikely.ai/newsroom/unlikely-ai-wins-excellence-in-claims-technology-at-the-insurance-times-awards-2025' },
      { title: '2026: Closing the trust gap will decide whether enterprise AI scales', date: '2026-01-05', url: 'https://www.unlikely.ai/newsroom/2026-closing-the-trust-gap-will-decide-whether-enterprise-ai-scales-2' },
      { title: 'What causes AI hallucinations and how to stop them', date: '2025-12-11', url: 'https://www.unlikely.ai/newsroom/what-causes-ai-hallucinations-and-how-to-stop-them' },
      { title: "SBS Claims Transforms Insurance Processing with UnlikelyAI's Neurosymbolic Technology", date: '2025-12-04', url: 'https://www.unlikely.ai/newsroom/sbs-claims-transforms-insurance-processing-with-unlikely-ai-s-neurosymbolic-technology' },
      { title: "Alexa co-creator gives first glimpse of UnlikelyAI's tech strategy", date: '2025-09-01', url: 'https://www.unlikely.ai/newsroom/alexa-co-creator-gives-first-glimpse-of-unlikely-ai-s-tech-strategy-1' },
      { title: 'Get ahead of AI regulation', date: '2025-09-01', url: 'https://www.unlikely.ai/newsroom/get-ahead-of-ai-regulation' }
    ]
  }
];

const state = {
  query: '',
  country: '',
  sortKey: 'name',
  sortDirection: 'asc',
  blogCompanies: new Set()
};

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
  methodLinks: [document.querySelector('#footer-method-link')],
  navDirectory: document.querySelector('#nav-directory'),
  navBlogs: document.querySelector('#nav-blogs'),
  directoryView: document.querySelector('#directory-view'),
  blogsView: document.querySelector('#blogs-view'),
  blogsList: document.querySelector('#blogs-list'),
  blogCompanyFilters: document.querySelector('#blog-company-filters'),
  clearBlogFilters: document.querySelector('#clear-blog-filters'),
  blogResultsCount: document.querySelector('#blog-results-count'),
  blogsEmpty: document.querySelector('#blogs-empty')
};

const externalIcon = `
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const calendarIcon = `
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 2v4M16 2v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <rect width="18" height="18" x="3" y="4" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <path d="M3 10h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

function postsForOrganization(organization) {
  if (organization.posts && organization.posts.length) return organization.posts;
  if (organization.postUrl && organization.postTitle) {
    return [{ title: organization.postTitle, date: organization.postDate, url: organization.postUrl }];
  }
  return [];
}

function allPosts() {
  const flattened = [];

  organizations.forEach((organization) => {
    postsForOrganization(organization).forEach((post) => {
      flattened.push({ organization, title: post.title, date: post.date, url: post.url });
    });
  });

  return flattened.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

function blogFilterTemplate(organization, index) {
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const postCount = postsForOrganization(organization).length;

  return `
    <li>
      <label class="blog-company-filter" for="blog-company-${index}">
        <input id="blog-company-${index}" type="checkbox" data-blog-company="${escapeHtml(organization.name)}" />
        <span class="company-icon" style="--company-color:${escapeHtml(organization.color)}" aria-hidden="true">
          ${escapeHtml(organization.initials)}
          ${favicon}
        </span>
        <span class="blog-company-filter-name">${escapeHtml(organization.name)}</span>
        <span class="blog-company-filter-count">${postCount}</span>
      </label>
    </li>`;
}

function renderBlogFilters() {
  const companiesWithPosts = organizations
    .filter((organization) => postsForOrganization(organization).length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  elements.blogCompanyFilters.innerHTML = companiesWithPosts
    .map(blogFilterTemplate)
    .join('');
  elements.blogCompanyFilters.querySelectorAll('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });
}

function blogItemTemplate(post, index, posts, today) {
  const organization = post.organization;
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const date = formatPostDate(post.date);
  const period = post.date ? post.date.slice(0, 7) : 'undated';
  const previousPeriod = index > 0
    ? (posts[index - 1].date ? posts[index - 1].date.slice(0, 7) : 'undated')
    : '';
  const startsPeriod = period !== previousPeriod;
  const [year, month] = post.date ? post.date.split('-') : ['', ''];
  const timelineLabel = startsPeriod
    ? (post.date
        ? `<span class="blog-timeline-year">${escapeHtml(year)}</span><span class="blog-timeline-month">${monthNames[Number(month) - 1]}</span>`
        : '<span class="blog-timeline-month">Undated</span>')
    : '';

  return `
    <li class="blog-card${post.date === today ? ' is-today' : ''}">
      <span class="blog-card-timeline${startsPeriod ? ' is-period-start' : ''}" aria-hidden="true">
        ${timelineLabel}
      </span>
      <a class="blog-card-link" href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer">
        <span class="blog-card-header">
          <span class="blog-card-company">
            <span class="company-icon" style="--company-color:${escapeHtml(organization.color)}" aria-hidden="true">
              ${escapeHtml(organization.initials)}
              ${favicon}
            </span>
            <span>${escapeHtml(organization.name)}</span>
          </span>
          <span class="blog-card-external" aria-hidden="true">${externalIcon}</span>
        </span>
        <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
        <span class="blog-card-date">${calendarIcon}${escapeHtml(date)}</span>
      </a>
    </li>`;
}

function renderBlogs() {
  const posts = allPosts().filter((post) => (
    state.blogCompanies.size === 0 || state.blogCompanies.has(post.organization.name)
  ));
  const today = localIsoDate();

  elements.blogsList.innerHTML = posts
    .map((post, index) => blogItemTemplate(post, index, posts, today))
    .join('');
  elements.blogsList.querySelectorAll('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });
  elements.blogResultsCount.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  elements.blogsEmpty.hidden = posts.length !== 0;
  elements.clearBlogFilters.hidden = state.blogCompanies.size === 0;
}

function showView(view) {
  const isBlogs = view === 'blogs';
  elements.directoryView.hidden = isBlogs;
  elements.blogsView.hidden = !isBlogs;
  elements.navDirectory.classList.toggle('is-active', !isBlogs);
  elements.navBlogs.classList.toggle('is-active', isBlogs);
  if (isBlogs) {
    elements.navBlogs.setAttribute('aria-current', 'page');
    elements.navDirectory.removeAttribute('aria-current');
  } else {
    elements.navDirectory.setAttribute('aria-current', 'page');
    elements.navBlogs.removeAttribute('aria-current');
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function navigateToView(event, view) {
  event.preventDefault();
  const targetHash = event.currentTarget.getAttribute('href');
  if (window.location.hash !== targetHash) {
    window.history.pushState(null, '', targetHash);
  }
  showView(view);
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

elements.navDirectory.addEventListener('click', (event) => navigateToView(event, 'directory'));
elements.navBlogs.addEventListener('click', (event) => navigateToView(event, 'blogs'));
window.addEventListener('popstate', () => {
  showView(window.location.hash === '#blogs' ? 'blogs' : 'directory');
});

elements.blogCompanyFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-blog-company]');
  if (!input) return;

  if (input.checked) {
    state.blogCompanies.add(input.dataset.blogCompany);
  } else {
    state.blogCompanies.delete(input.dataset.blogCompany);
  }
  renderBlogs();
});

elements.clearBlogFilters.addEventListener('click', () => {
  state.blogCompanies.clear();
  elements.blogCompanyFilters.querySelectorAll('[data-blog-company]').forEach((input) => {
    input.checked = false;
  });
  renderBlogs();
});

elements.help.addEventListener('click', openAbout);
elements.methodLinks.forEach((link) => link?.addEventListener('click', openAbout));
elements.close.addEventListener('click', closeAbout);
elements.modal.addEventListener('cancel', closeAbout);
elements.modal.addEventListener('click', (event) => {
  if (event.target === elements.modal) closeAbout();
});

render();
renderBlogFilters();
renderBlogs();
if (window.location.hash === '#blogs') showView('blogs');
