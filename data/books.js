// Curated reading list. Author lists and links are taken from the publisher's
// official page (or the cover itself) for each title.
globalThis.BOOKS_LIBRARY = {
  schemaVersion: 1,
  updatedAt: '2026-08-09',
  sections: [
    {
      id: 'neurosymbolic',
      eyebrow: 'Reading path',
      title: 'Neurosymbolic AI',
      intro:
        'From the motivation for symbolic structure, through the conceptual frame and technical '
        + 'frameworks, to hands-on practice and broader survey reading.',
      books: [
        {
          id: 'rebooting-ai',
          title: 'Rebooting AI: Building Artificial Intelligence We Can Trust',
          subtitle: '',
          authors: ['Gary Marcus', 'Ernest Davis'],
          publisher: 'Pantheon Books',
          year: 2019,
          format: 'Book',
          isbn: '978-1-5247-4825-8',
          cover: 'assets/books/nesy-rebooting.jpg',
          url: 'https://www.penguinrandomhouse.com/books/603982/rebooting-ai-by-gary-marcus-and-ernest-davis/',
          linkLabel: 'Penguin Random House',
          note:
            'Motivation and intuition: why purely neural approaches — including LLMs — fall short, '
            + 'and why symbolic structure matters.'
        },
        {
          id: 'nesy-3rd-wave',
          title: 'Neurosymbolic AI: The 3rd Wave',
          subtitle: 'Artificial Intelligence Review 56(11), 12387–12406',
          authors: ['Artur d’Avila Garcez', 'Luís C. Lamb'],
          publisher: 'Springer',
          year: 2023,
          format: 'Journal article',
          doi: '10.1007/s10462-023-10448-w',
          cover: 'assets/books/nesy-3rdwave.jpg',
          url: 'https://doi.org/10.1007/s10462-023-10448-w',
          linkLabel: 'Springer',
          altUrl: 'https://arxiv.org/abs/2012.05876',
          altLabel: 'arXiv',
          note:
            'The conceptual frame for the field. Not a book — it is the survey article that named '
            + 'the third wave, so it is listed here alongside the books it frames.'
        },
        {
          id: 'nesy-reasoning-learning',
          title: 'Neuro Symbolic Reasoning and Learning',
          subtitle: 'SpringerBriefs in Computer Science',
          authors: ['Paulo Shakarian', 'Chitta Baral', 'Gerardo I. Simari', 'Bowen Xi', 'Lahari Pokala'],
          publisher: 'Springer',
          year: 2023,
          format: 'Book',
          isbn: '978-3-031-39178-1',
          cover: 'assets/books/nesy-shakarian.jpg',
          url: 'https://link.springer.com/book/10.1007/978-3-031-39179-8',
          linkLabel: 'Springer',
          note:
            'The technical frameworks: LNN, LTN, and NeurASP for reasoning; differentiable ILP, '
            + 'constraint learning, and deep symbolic policy learning for learning.'
        },
        {
          id: 'nesy-packt',
          title: 'Neuro-Symbolic AI: Design transparent and trustworthy systems that understand the world as you do',
          subtitle: '',
          authors: ['Alexiei Dingli', 'David Farrugia'],
          publisher: 'Packt Publishing',
          year: 2023,
          format: 'Book',
          isbn: '978-1-80461-762-5',
          cover: 'assets/books/nesy-packt.jpg',
          url: 'https://www.packtpub.com/en-us/product/neuro-symbolic-ai-9781804617625',
          linkLabel: 'Packt',
          note: 'Hands-on Python practice, with worked examples and case studies.'
        },
        {
          id: 'nesy-bridging',
          title: 'Neuro-Symbolic Artificial Intelligence: Bridging Logic and Learning',
          subtitle: 'Studies in Computational Intelligence 1176',
          authors: ['Bikram Pratim Bhuyan', 'Amar Ramdane-Cherif', 'Thipendra P. Singh', 'Ravi Tomar'],
          publisher: 'Springer',
          year: 2024,
          format: 'Book',
          isbn: '978-981-97-8170-6',
          cover: 'assets/books/nesy-bhuyan.jpg',
          url: 'https://link.springer.com/book/10.1007/978-981-97-8171-3',
          linkLabel: 'Springer',
          note: 'Broader reference reading across representation, integration, and applications.'
        },
        {
          id: 'nesy-best-of-both',
          title: 'The Best of Both Worlds: Neuro-Symbolic AI',
          subtitle: 'Chapter 9 of Artificial Intelligence: Transcending Traditional Paradigms',
          authors: ['Rajendra Akerkar'],
          publisher: 'Springer',
          year: 2026,
          format: 'Book chapter',
          doi: '10.1007/978-3-031-91084-5_9',
          cover: 'assets/books/nesy-akerkar.jpg',
          url: 'https://link.springer.com/chapter/10.1007/978-3-031-91084-5_9',
          linkLabel: 'Springer',
          altUrl: 'https://link.springer.com/book/10.1007/978-3-031-91084-5',
          altLabel: 'Full book',
          note:
            'Survey-level overview of the hybrid paradigm. A single chapter rather than a standalone '
            + 'book; the cover shown is the parent volume.'
        }
      ]
    },
    {
      id: 'knowledge-graphs',
      eyebrow: 'Reading path',
      title: 'Knowledge graphs',
      intro:
        'Business framing, the standard academic reference, practitioner guides, and the semantic-web '
        + 'and industrial-ontology foundations underneath them.',
      books: [
        {
          id: 'kg-data-in-context',
          title: 'Knowledge Graphs: Data in Context for Responsive Businesses',
          subtitle: '',
          authors: ['Jesús Barrasa', 'Amy E. Hodler', 'Jim Webber'],
          publisher: "O'Reilly Media",
          year: 2021,
          format: 'Report',
          isbn: '978-1-098-10485-6',
          cover: 'assets/books/kg-context.jpg',
          url: 'https://www.oreilly.com/library/view/knowledge-graphs/9781098104863/',
          linkLabel: "O'Reilly",
          altUrl: 'https://go.neo4j.com/rs/710-RRC-335/images/Knowledge-Graphs-Data-in-context-responsive.pdf',
          altLabel: 'Free PDF',
          note: 'Short report framing what a knowledge graph is and what it buys a business.'
        },
        {
          id: 'kg-hogan',
          title: 'Knowledge Graphs',
          subtitle: 'Synthesis Lectures on Data, Semantics, and Knowledge',
          authors: [
            'Aidan Hogan', 'Eva Blomqvist', 'Michael Cochez', 'Claudia d’Amato', 'Gerard de Melo',
            'Claudio Gutierrez', 'Sabrina Kirrane', 'José Emilio Labra Gayo', 'Roberto Navigli',
            'Sebastian Neumaier', 'Axel-Cyrille Ngonga Ngomo', 'Axel Polleres', 'Sabbir M. Rashid',
            'Anisa Rula', 'Lukas Schmelzeisen', 'Juan Sequeda', 'Steffen Staab', 'Antoine Zimmermann'
          ],
          publisher: 'Springer',
          year: 2021,
          format: 'Book',
          isbn: '978-3-031-00790-3',
          cover: 'assets/books/kg-hogan.jpg',
          url: 'https://kgbook.org/',
          linkLabel: 'kgbook.org',
          altUrl: 'https://link.springer.com/book/10.1007/978-3-031-01918-0',
          altLabel: 'Springer',
          note: 'The standard academic reference. Freely readable online in full.'
        },
        {
          id: 'kg-building',
          title: 'Building Knowledge Graphs: A Practitioner’s Guide',
          subtitle: '',
          authors: ['Jesús Barrasa', 'Jim Webber'],
          publisher: "O'Reilly Media",
          year: 2023,
          format: 'Book',
          isbn: '978-1-098-12710-7',
          cover: 'assets/books/kg-building.jpg',
          url: 'https://www.oreilly.com/library/view/building-knowledge-graphs/9781098127091/',
          linkLabel: "O'Reilly",
          altUrl: 'https://neo4j.com/knowledge-graphs-practitioners-guide/',
          altLabel: 'Free copy',
          note: 'How to actually model, load, and operate a knowledge graph.'
        },
        {
          id: 'kg-llms-in-action',
          title: 'Knowledge Graphs and LLMs in Action',
          subtitle: 'Build AI systems using connected data',
          authors: ['Alessandro Negro', 'Vlastimil Kus', 'Giuseppe Futia', 'Fabio Montagna'],
          publisher: 'Manning Publications',
          year: 2025,
          format: 'Book',
          isbn: '978-1-63343-989-4',
          cover: 'assets/books/kg-llms.jpg',
          url: 'https://www.manning.com/books/knowledge-graphs-and-llms-in-action',
          linkLabel: 'Manning',
          note: 'Graphs inside LLM-powered applications and RAG pipelines, with Python examples.'
        },
        {
          id: 'kg-swwo',
          title: 'Semantic Web for the Working Ontologist: Effective Modeling for Linked Data, RDFS, and OWL',
          subtitle: 'Third Edition',
          authors: ['Dean Allemang', 'Jim Hendler', 'Fabien Gandon'],
          publisher: 'ACM Books',
          year: 2020,
          format: 'Book',
          isbn: '978-1-4503-7614-3',
          cover: 'assets/books/kg-swwo.jpg',
          url: 'https://dl.acm.org/doi/book/10.1145/3382097',
          linkLabel: 'ACM DL',
          altUrl: 'https://data.world/swwo',
          altLabel: 'Datasets',
          note: 'The modelling foundations — RDF, RDFS, and OWL — that the rest of the stack assumes.'
        },
        {
          id: 'kg-industry',
          title: 'Ontology-Based Development of Industry 4.0 and 5.0 Solutions for Smart Manufacturing and Production',
          subtitle: 'Knowledge Graph and Semantic Based Modeling and Optimization of Complex Systems',
          authors: ['János Abonyi', 'László Nagy', 'Tamás Ruppert'],
          publisher: 'Springer',
          year: 2024,
          format: 'Book',
          isbn: '978-3-031-47443-9',
          cover: 'assets/books/kg-abonyi.jpg',
          url: 'https://link.springer.com/book/10.1007/978-3-031-47444-6',
          linkLabel: 'Springer',
          note: 'Ontologies and graph-based optimisation applied to industrial systems.'
        }
      ]
    }
  ]
};
