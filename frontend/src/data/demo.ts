import type {
  Citation,
  CompareRow,
  DemoAnswer,
  Paper,
  SearchFilters,
} from "../types";

// Метаданные статей настоящие (из data/processed/papers.parquet), цитаты дословно
// взяты из текстов статей. Формулировки ответа и ячеек таблицы собраны вручную для макета.
// Порядок и «релевантность» условные: ранжирования пока нет.
export const DEMO_PAPERS: Paper[] = [
  {
    "id": "p1",
    "arxivId": "2602.03442",
    "title": "A-RAG: Scaling Agentic Retrieval-Augmented Generation via Hierarchical Retrieval Interfaces",
    "authors": [
      "Mingxuan Du",
      "Benfeng Xu",
      "Chiwei Zhu",
      "Shaohan Wang",
      "Pengyu Wang",
      "Xiaorui Wang",
      "Zhendong Mao"
    ],
    "published": "2026-02-03",
    "categories": [
      "cs.CL"
    ],
    "citations": 40,
    "venue": "arXiv.org",
    "tldr": "Experiments on multiple open-domain QA benchmarks show that A-RAG consistently outperforms existing approaches with comparable or lower retrieved tokens, demonstrating that A-RAG effectively leverages model capabilities and dynamically adapts to different RAG tasks.",
    "abstract": "Frontier language models have demonstrated strong reasoning and long-horizon tool-use capabilities. However, existing RAG systems fail to leverage these capabilities. They still rely on two paradigms: (1) designing an algorithm that retrieves passages in a single shot and concatenates them into the model's input, or (2) predefining a workflow and prompting the model to execute it step-by-step. Neither paradigm allows the model to participate in retrieval decisions, preventing efficient scaling with model improvements. In this paper, we introduce A-RAG, an Agentic RAG framework that exposes hierarchical retrieval interfaces directly to the model. A-RAG provides three retrieval tools: keyword search, semantic search, and chunk read, enabling the agent to adaptively search and retrieve information across multiple granularities. Experiments on multiple open-domain QA benchmarks show that A-RAG consistently outperforms existing approaches with comparable or lower retrieved tokens, demonstrating that A-RAG effectively leverages model capabilities and dynamically adapts to different RAG tasks. We further systematically study how A-RAG scales with model size and test-time compute. We will release our code and evaluation suite to facilitate future research. Code and evaluation suite are available at https://github.com/Ayanami0730/arag.",
    "relevance": 0.96,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2602.03442",
    "htmlUrl": "https://arxiv.org/html/2602.03442"
  },
  {
    "id": "p2",
    "arxivId": "2603.26815",
    "title": "Sustainable Hybrid Document-Routed Retrieval for Financial RAG: Resolving the Robustness-Precision Trade-off",
    "authors": [
      "Zhiyuan Cheng",
      "Longying Lai",
      "Yue Liu"
    ],
    "published": "2026-03-26",
    "categories": [
      "cs.CL",
      "cs.AI",
      "cs.IR"
    ],
    "citations": 17,
    "venue": "Intelligent Systems with Applications",
    "tldr": "HDRR is proposed, a two-stage architecture that uses SFR as a document filter followed by chunk retrieval scoped to the identified document(s), eliminating cross-document confusion while preserving chunk precision and is the most efficient of the high-quality systems.",
    "abstract": "Retrieval-Augmented Generation (RAG) systems for financial document QA typically follow a chunk-based paradigm: documents are split into fragments, embedded, and retrieved by similarity. In structurally homogeneous corpora such as regulatory filings, this suffers from cross-document chunk confusion. Semantic File Routing (SFR), which uses LLM structured output to route queries to whole documents, reduces catastrophic failures but sacrifices targeted-chunk precision. We identify this robustness-precision trade-off on the FinDER benchmark (1,500 queries across five groups): SFR achieves higher average scores (6.45 vs. 6.02) and fewer failures (10.3% vs. 22.5%), while chunk-based retrieval (CBR) yields more perfect answers (13.8% vs. 8.5%). To resolve it, we propose Hybrid Document-Routed Retrieval (HDRR), a two-stage architecture that uses SFR as a document filter followed by chunk retrieval scoped to the identified document(s), eliminating cross-document confusion while preserving chunk precision. HDRR achieves the best performance on every metric: an average score of 7.54 (25.2% above CBR, 16.9% above SFR), a 6.4% failure rate, 67.7% correctness (+18.7 pp over CBR), and a 20.1% perfect-answer rate (+6.3 pp over CBR, +11.6 pp over SFR), simultaneously attaining the lowest failure rate and highest precision across all five groups. Beyond accuracy, HDRR is also the most efficient of the high-quality systems: it preserves CBR's compact per-query token budget (~5K-15K, an order of magnitude below SFR's ~50K-200K), incurs no indexing-time LLM spend (versus the one-time ~$100 cost of contextual indexing), and uses fewer per-query LLM calls than self-correcting agentic baselines, translating directly to lower API spend and inference-time energy at deployment scale.",
    "relevance": 0.93,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2603.26815",
    "htmlUrl": "https://arxiv.org/html/2603.26815"
  },
  {
    "id": "p3",
    "arxivId": "2605.06635",
    "title": "Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents",
    "authors": [
      "Hailey Onweller",
      "Elias Lumer",
      "Austin Huber",
      "Pia Ramchandani",
      "Vamse Kumar Subbiah",
      "Corey Feld"
    ],
    "published": "2026-05-07",
    "categories": [
      "cs.CL"
    ],
    "citations": 15,
    "venue": "arXiv.org",
    "tldr": "This work introduces the first source attribution evaluation framework that uses a reproducible AST parser to extract and evaluate inline citations from LLM-generated Markdown reports at scale, revealing a critical disconnect between surface-level citation quality and factual reliability.",
    "abstract": "Large language models (LLMs) power deep research agents that synthesize information from hundreds of web sources into cited reports, yet these citations cannot be reliably verified. Current approaches either trust models to self-cite accurately, risking bias, or employ retrieval-augmented generation (RAG) that does not validate source accessibility, relevance, or factual consistency. We introduce the first source attribution evaluation framework that uses a reproducible AST parser to extract and evaluate inline citations from LLM-generated Markdown reports at scale. Unlike methods that verify claims in isolation, our framework closes the loop by retrieving the actual cited content, enabling human or model evaluators to judge each citation against its source. Citations are evaluated along three dimensions. (1) Link Works verifies URL accessibility, (2) Relevant Content measures topical alignment, and (3) Fact Check validates factual accuracy against source content. We benchmark 14 closed-source and open-source LLMs across three evaluation dimensions using rubric-based LLM-as-a-judge evaluators calibrated through human review. Our results reveal that even the strongest frontier models maintain link validity above 94% and relevance above 80%, yet achieve only 39-77% factual accuracy, while fewer than half of open-source models successfully generate cited reports in a one-shot setting. Ablation studies on research depth show that Fact Check accuracy drops by approximately 42% on average across two frontier models as tool calls scale from 2 to 150, demonstrating that more retrieval does not produce more accurate citations. These findings reveal a critical disconnect between surface-level citation quality and factual reliability, and our framework provides the evaluation infrastructure to assess the disconnect.",
    "relevance": 0.91,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2605.06635",
    "htmlUrl": "https://arxiv.org/html/2605.06635"
  },
  {
    "id": "p4",
    "arxivId": "2604.03173",
    "title": "Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents",
    "authors": [
      "Delip Rao",
      "Eric Wong",
      "Chris Callison-Burch"
    ],
    "published": "2026-04-03",
    "categories": [
      "cs.CL"
    ],
    "citations": 9,
    "venue": "arXiv.org",
    "tldr": "We find that 3–13% of citation URLs are hallucinated: they have no record in the Wayback Machine and likely never existed.",
    "abstract": "Large language models and deep research agents supply citation URLs to support their claims, yet the reliability of these citations has not been systematically measured. We address six research questions about citation URL validity using 10 models and agents on DRBench (53,090 URLs) and 3 models on ExpertQA (168,021 URLs across 32 academic fields). We find that 3–13% of citation URLs are hallucinated – they have no record in the Wayback Machine and likely never existed – while 5–18% are non-resolving overall. Deep research agents generate substantially more citations per query than search-augmented LLMs but hallucinate URLs at higher rates. Domain effects are pronounced: non-resolving rates range from 5.4% (Business) to 11.4% (Theology), with per-model effects even larger. Decomposing failures reveals that some models fabricate every non-resolving URL, while others show substantial link-rot fractions indicating genuine retrieval. As a solution, we release urlhealth, an open-source tool for URL liveness checking and stale-vs-hallucinated classification using the Wayback Machine. In agentic self-correction experiments, models equipped with urlhealth reduce non-resolving citation URLs by $6\\textrm{–}79\\times$ to under 1%, though effectiveness depends on the model's tool-use competence. The tool and all data are publicly available. Our characterization findings, failure taxonomy, and open-source tooling establish that citation URL validity is both measurable at scale and correctable in practice.",
    "relevance": 0.88,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2604.03173",
    "htmlUrl": "https://arxiv.org/html/2604.03173"
  },
  {
    "id": "p5",
    "arxivId": "2604.23588",
    "title": "FinGround: Detecting and Grounding Financial Hallucinations via Atomic Claim Verification",
    "authors": [
      "Dongxin Guo",
      "Jikun Wu",
      "Siu Ming Yiu"
    ],
    "published": "2026-04-26",
    "categories": [
      "cs.AI",
      "cs.CL",
      "cs.IR"
    ],
    "citations": 11,
    "venue": "arXiv.org",
    "tldr": "FinGround, a three-stage verify-then-ground pipeline for financial document QA, proposes retrieval-equalized evaluation as standard methodology for RAG verification research: when all systems receive identical retrieval, FinGround still reduces hallucination rates by 68% over the strongest baseline.",
    "abstract": "Financial AI systems must produce answers grounded in specific regulatory filings, yet current LLMs fabricate metrics, invent citations, and miscalculate derived quantities. These errors carry direct regulatory consequences as the EU AI Act's high-risk enforcement deadline approaches (August 2026). Existing hallucination detectors treat all claims uniformly, missing 43% of computational errors that require arithmetic re-verification against structured tables. We present FinGround, a three-stage verify-then-ground pipeline for financial document QA. Stage 1 performs finance-aware hybrid retrieval over text and tables. Stage 2 decomposes answers into atomic claims classified by a six-type financial taxonomy and verified with type-routed strategies including formula reconstruction. Stage 3 rewrites unsupported claims with paragraph- and table-cell-level citations. To cleanly isolate verification value from retrieval quality, we propose retrieval-equalized evaluation as standard methodology for RAG verification research: when all systems receive identical retrieval, FinGround still reduces hallucination rates by 68% over the strongest baseline ($p < 0.01$). The full pipeline achieves a 78% reduction relative to GPT-4o. An 8B distilled detector retains 91.4% F1 at 18x lower per-claim latency, enabling $0.003/query deployment, supported by qualitative signals from a four-week analyst pilot.",
    "relevance": 0.86,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2604.23588",
    "htmlUrl": "https://arxiv.org/html/2604.23588"
  },
  {
    "id": "p6",
    "arxivId": "2603.04814",
    "title": "Beyond the Context Window: A Cost-Performance Analysis of Fact-Based Memory vs. Long-Context LLMs for Persistent Agents",
    "authors": [
      "Natchanon Pollertlam",
      "Witchayut Kornsuwannawit"
    ],
    "published": "2026-03-05",
    "categories": [
      "cs.CL"
    ],
    "citations": 14,
    "venue": "arXiv.org",
    "tldr": "This work compares a fact-based memory system built on the Mem0 framework against long-context LLM inference on three memory-centric benchmarks and constructs a cost model that incorporates prompt caching and shows that the two architectures have structurally different cost profiles.",
    "abstract": "Persistent conversational AI systems face a choice between passing full conversation histories to a long-context large language model (LLM) and maintaining a dedicated memory system that extracts and retrieves structured facts. We compare a fact-based memory system built on the Mem0 framework against long-context LLM inference on three memory-centric benchmarks - LongMemEval, LoCoMo, and PersonaMemv2 - and evaluate both architectures on accuracy and cumulative API cost. Long-context GPT-5-mini achieves higher factual recall on LongMemEval and LoCoMo, while the memory system is competitive on PersonaMemv2, where persona consistency depends on stable, factual attributes suited to flat-typed extraction. We construct a cost model that incorporates prompt caching and show that the two architectures have structurally different cost profiles: long-context inference incurs a per-turn charge that grows with context length even under caching, while the memory system's per-turn read cost remains roughly fixed after a one-time write phase. At a context length of 100k tokens, the memory system becomes cheaper after approximately ten interaction turns, with the break-even point decreasing as context length grows. These results characterize the accuracy-cost trade-off between the two approaches and provide a concrete criterion for selecting between them in production deployments.",
    "relevance": 0.84,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2603.04814",
    "htmlUrl": "https://arxiv.org/html/2603.04814"
  },
  {
    "id": "p7",
    "arxivId": "2605.15184",
    "title": "Is Grep All You Need? How Agent Harnesses Reshape Agentic Search",
    "authors": [
      "Sahil Sen",
      "Akhil Kasturi",
      "Elias Lumer",
      "Anmol Gulati",
      "Vamse Kumar Subbiah"
    ],
    "published": "2026-05-14",
    "categories": [
      "cs.CL"
    ],
    "citations": 26,
    "venue": "arXiv.org",
    "tldr": "An empirical study organized into two experiments that compares grep and vector retrieval on a 116-question sample from LongMemEval using a custom agent harness (Chronos) and provider-native CLI harnesses (Claude Code, Codex, and Gemini CLI), for both inline tool results and file-based tool results that the model reads separately.",
    "abstract": "Recent advances in Large Language Model (LLM) agents have enabled complex agentic workflows where models autonomously retrieve information, call tools, and reason over large corpora to complete tasks on behalf of users. Despite the growing adoption of retrieval-augmented generation (RAG) in agentic search systems, existing literature lacks a systematic comparison of how retrieval strategy choice interacts with agent architecture and tool-calling paradigm. Important practical dimensions, including how tool outputs are presented to the model and how performance changes when searches must cope with more irrelevant surrounding text, remain under-explored in agent loops. This paper reports an empirical study organized into two experiments. Experiment 1 compares grep and vector retrieval on a 116-question sample from LongMemEval, using a custom agent harness (Chronos) and provider-native CLI harnesses (Claude Code, Codex, and Gemini CLI), for both inline tool results and file-based tool results that the model reads separately. Experiment 2 compares grep-only and vector-only retrieval while progressively mixing in additional unrelated conversation history, so that each query is embedded in more distracting material alongside the passages that matter. Across Chronos and the provider CLIs, grep generally yields higher accuracy than vector retrieval in our comparisons in experiment 1; at the same time, overall scores still depend strongly on which harness and tool-calling style is used, even when the underlying conversation data are the same.",
    "relevance": 0.81,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2605.15184",
    "htmlUrl": "https://arxiv.org/html/2605.15184"
  },
  {
    "id": "p8",
    "arxivId": "2601.14949",
    "title": "What Should I Cite? A RAG Benchmark for Academic Citation Prediction",
    "authors": [
      "Leqi Zheng",
      "Jiajun Zhang",
      "Canzhi Chen",
      "Chaokun Wang",
      "Hongwei Li",
      "Yuying Li",
      "Yaoxin Mao",
      "Shannan Yan",
      "Zixin Song",
      "Zhiyuan Feng",
      "Zhaolu Kang",
      "Zirong Chen",
      "Hang Zhang",
      "Qiang Liu",
      "Liang Wang",
      "Ziyang Liu"
    ],
    "published": "2026-01-21",
    "categories": [
      "cs.IR"
    ],
    "citations": 14,
    "venue": "The Web Conference",
    "tldr": "CiteRAG is presented, the first comprehensive retrieval-augmented generation (RAG)-integrated benchmark for evaluating large language models on academic citation prediction, featuring a multi-level retrieval strategy, specialized retrievers, and generators.",
    "abstract": "With the rapid growth of Web-based academic publications, more and more papers are being published annually, making it increasingly difficult to find relevant prior work. Citation prediction aims to automatically suggest appropriate references, helping scholars navigate the expanding scientific literature. Here we present \\textbf{CiteRAG}, the first comprehensive retrieval-augmented generation (RAG)-integrated benchmark for evaluating large language models on academic citation prediction, featuring a multi-level retrieval strategy, specialized retrievers, and generators. Our benchmark makes four core contributions: (1) We establish two instances of the citation prediction task with different granularity. Task 1 focuses on coarse-grained list-specific citation prediction, while Task 2 targets fine-grained position-specific citation prediction. To enhance these two tasks, we build a dataset containing 7,267 instances for Task 1 and 8,541 instances for Task 2, enabling comprehensive evaluation of both retrieval and generation. (2) We construct a three-level large-scale corpus with 554k papers spanning many major subfields, using an incremental pipeline. (3) We propose a multi-level hybrid RAG approach for citation prediction, fine-tuning embedding models with contrastive learning to capture complex citation relationships, paired with specialized generation models. (4) We conduct extensive experiments across state-of-the-art language models, including closed-source APIs, open-source models, and our fine-tuned generators, demonstrating the effectiveness of our framework. Our open-source toolkit enables reproducible evaluation and focuses on academic literature, providing the first comprehensive evaluation framework for citation prediction and serving as a methodological template for other scientific domains. Our source code and data are released at https://github.com/LQgdwind/CiteRAG.",
    "relevance": 0.79,
    "license": "cc",
    "pdfUrl": "https://arxiv.org/pdf/2601.14949",
    "htmlUrl": "https://arxiv.org/html/2601.14949"
  }
];

export const DEMO_CITATIONS: Citation[] = [
  {
    "id": "c1",
    "paperId": "p1",
    "section": "1 Introduction",
    "url": "https://arxiv.org/html/2602.03442#S1.p3",
    "quote": "Even the simplest Naive Agentic RAG, equipped with only a single embedding-based tool to retrieve from the corpus, consistently outperforms Naive RAG and previous baselines."
  },
  {
    "id": "c2",
    "paperId": "p2",
    "section": "6.2 Key Findings",
    "url": "https://arxiv.org/html/2603.26815#S6.SS2.p4",
    "quote": "Compared to CBR, HDRR improves average score by 1.52 points (+25.2%), reduces failures by 16.1 percentage points (−71.6% relative), increases correctness rate by 18.7 pp (+38.2%), and increases perfect rate by 6.3 pp (+45.7%)."
  },
  {
    "id": "c3",
    "paperId": "p3",
    "section": "4.1 Finding 1",
    "url": "https://arxiv.org/html/2605.06635#S4.SS1.p3",
    "quote": "Fewer than half of open-source models successfully generate cited reports. OSS-120B achieves 40% task success, Llama 4 Maverick 30%, and Pixtral Large only 17%, compared to 83–100% for frontier models."
  },
  {
    "id": "c4",
    "paperId": "p4",
    "section": "4.1 Overall rates",
    "url": "https://arxiv.org/html/2604.03173#S4.SS1.SSS0.Px1.p1",
    "quote": "Non-resolving URL rates across models range from 5.4% (gpt-4.1) to 18.5% (gemini-2.5-pro-deepresearch), while hallucinated URL rates range from 3.0% (claude-3-5-sonnet-with-search) to 13.3% (gemini-2.5-pro-deepresearch)."
  },
  {
    "id": "c5",
    "paperId": "p5",
    "section": "5.1 Detection Performance",
    "url": "https://arxiv.org/html/2604.23588#S5.SS1.p1",
    "quote": "FinGround’s distilled 8B detector achieves 91.4% F1, retaining 96.2% of the GPT-4o teacher’s performance at 18× lower per-claim latency."
  },
  {
    "id": "c6",
    "paperId": "p6",
    "section": "4.1 Accuracy Results",
    "url": "https://arxiv.org/html/2603.04814#S4.SS1.p2",
    "quote": "LC GPT-5-mini achieves the highest accuracy on LoCoMo and LongMemEval, exceeding the memory system by 35.2 and 33.4 percentage points respectively."
  },
  {
    "id": "c7",
    "paperId": "p1",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2602.03442",
    "quote": "In this paper, we introduce A-RAG, an Agentic RAG framework that exposes hierarchical retrieval interfaces directly to the model."
  },
  {
    "id": "c8",
    "paperId": "p1",
    "section": "D.3 Analysis",
    "url": "https://arxiv.org/html/2602.03442#A4.SS3.p2",
    "quote": "Across both datasets, entity confusion is the largest secondary failure mode (40% on MuSiQue, 71% on 2Wiki)."
  },
  {
    "id": "c9",
    "paperId": "p2",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2603.26815",
    "quote": "We identify this robustness-precision trade-off on the FinDER benchmark (1,500 queries across five groups): SFR achieves higher average scores (6.45 vs. 6.02) and fewer failures (10.3% vs. 22.5%)."
  },
  {
    "id": "c10",
    "paperId": "p3",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2605.06635",
    "quote": "We introduce the first source attribution evaluation framework that uses a reproducible AST parser to extract and evaluate inline citations from LLM-generated Markdown reports at scale."
  },
  {
    "id": "c11",
    "paperId": "p4",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2604.03173",
    "quote": "We find that 3–13% of citation URLs are hallucinated – they have no record in the Wayback Machine and likely never existed – while 5–18% are non-resolving overall."
  },
  {
    "id": "c12",
    "paperId": "p4",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2604.03173",
    "quote": "We address six research questions about citation URL validity using 10 models and agents on DRBench (53,090 URLs) and 3 models on ExpertQA (168,021 URLs across 32 academic fields)."
  },
  {
    "id": "c13",
    "paperId": "p5",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2604.23588",
    "quote": "We present FinGround, a three-stage verify-then-ground pipeline for financial document QA."
  },
  {
    "id": "c14",
    "paperId": "p6",
    "section": "Аннотация",
    "url": "https://arxiv.org/abs/2603.04814",
    "quote": "We compare a fact-based memory system built on the Mem0 framework against long-context LLM inference on three memory-centric benchmarks - LongMemEval, LoCoMo, and PersonaMemv2 - and evaluate both architectures on accuracy and cumulative API cost."
  }
];

export const DEMO_ANSWER: DemoAnswer = {
  "question": "Какие подходы к RAG появились за последний год?",
  "summary": [
    {
      "text": "Главный сдвиг: модель сама участвует в решениях о поиске. По результатам A-RAG, даже простейший агентный RAG с одним инструментом поиска по эмбеддингам стабильно обгоняет обычный RAG и прежние базовые методы.",
      "citationIds": [
        "c1"
      ]
    },
    {
      "text": "Для однородных корпусов (например, финансовых отчётов) вместо поиска по фрагментам предлагают сначала выбрать документ, а потом искать внутри него: HDRR сокращает долю провалов на 71,6% относительно поиска по фрагментам.",
      "citationIds": [
        "c2"
      ]
    },
    {
      "text": "Отдельно оформилось направление проверки цитат. Доля выдуманных ссылок в ответах LLM-агентов составляет от 3,0% до 13,3%, а у открытых моделей получается собрать отчёт с цитатами лишь в 17–40% случаев против 83–100% у закрытых.",
      "citationIds": [
        "c4",
        "c3"
      ]
    },
    {
      "text": "Верификация по отдельным утверждениям работает и на практике: детектор FinGround даёт 91,4% F1 при существенно меньшей задержке, чем у модели-учителя.",
      "citationIds": [
        "c5"
      ]
    },
    {
      "text": "Длинный контекст и отдельная система памяти ведут себя по-разному: GPT-5-mini с длинным контекстом точнее памяти на LoCoMo и LongMemEval более чем на 33 п.п.",
      "citationIds": [
        "c6"
      ]
    },
    {
      "text": "Исследователи также сравнивают grep и векторный поиск внутри агентных циклов, но какой из подходов лучше в целом, по найденным фрагментам сказать нельзя.",
      "citationIds": [],
      "unverified": true
    }
  ]
};

export const DEMO_COMPARE: CompareRow[] = [
  {
    "paperId": "p1",
    "cells": {
      "task": {
        "value": "Open-domain QA",
        "unverified": true
      },
      "method": {
        "value": "Агентный RAG с иерархическими инструментами поиска",
        "citationId": "c7"
      },
      "datasets": {
        "value": "MuSiQue, 2Wiki",
        "citationId": "c8"
      },
      "metrics": {
        "value": "Точность по оценке LLM-судьи",
        "unverified": true
      },
      "result": {
        "value": "Простой агентный RAG стабильно лучше обычного",
        "citationId": "c1"
      }
    }
  },
  {
    "paperId": "p2",
    "cells": {
      "task": {
        "value": "QA по финансовым документам",
        "citationId": "c9"
      },
      "method": {
        "value": "Выбор документа, затем поиск фрагментов внутри него",
        "citationId": "c2"
      },
      "datasets": {
        "value": "FinDER, 1 500 запросов",
        "citationId": "c9"
      },
      "metrics": {
        "value": "Средний балл, доля провалов",
        "citationId": "c2"
      },
      "result": {
        "value": "Провалов на 71,6% меньше, чем у поиска по фрагментам",
        "citationId": "c2"
      }
    }
  },
  {
    "paperId": "p3",
    "cells": {
      "task": {
        "value": "Оценка цитат в отчётах deep research",
        "citationId": "c10"
      },
      "method": {
        "value": "AST-парсер цитат и проверка источников",
        "citationId": "c10"
      },
      "datasets": {
        "value": "Отчёты LLM-агентов",
        "unverified": true
      },
      "metrics": {
        "value": "Доля успешных отчётов с цитатами",
        "citationId": "c3"
      },
      "result": {
        "value": "У открытых моделей 17–40% успеха, у закрытых 83–100%",
        "citationId": "c3"
      }
    }
  },
  {
    "paperId": "p4",
    "cells": {
      "task": {
        "value": "Выдуманные URL в цитатах",
        "citationId": "c11"
      },
      "method": {
        "value": "Проверка по Wayback Machine",
        "unverified": true
      },
      "datasets": {
        "value": "DRBench, ExpertQA",
        "citationId": "c12"
      },
      "metrics": {
        "value": "Доля выдуманных URL: 3,0–13,3%",
        "citationId": "c4"
      },
      "result": {
        "value": "3–13% URL выдуманы, 5–18% не открываются",
        "citationId": "c11"
      }
    }
  },
  {
    "paperId": "p5",
    "cells": {
      "task": {
        "value": "Выявление галлюцинаций в финансовых ответах",
        "citationId": "c13"
      },
      "method": {
        "value": "Проверка по отдельным утверждениям",
        "citationId": "c13"
      },
      "datasets": {
        "value": "FinHalu",
        "unverified": true
      },
      "metrics": {
        "value": "F1 91,4%",
        "citationId": "c5"
      },
      "result": {
        "value": "Сохраняет 96,2% качества модели-учителя при меньшей задержке",
        "citationId": "c5"
      }
    }
  },
  {
    "paperId": "p6",
    "cells": {
      "task": {
        "value": "Память агента или длинный контекст",
        "citationId": "c14"
      },
      "method": {
        "value": "Система памяти на Mem0 против длинного контекста",
        "citationId": "c14"
      },
      "datasets": {
        "value": "LongMemEval, LoCoMo, PersonaMem v2",
        "citationId": "c14"
      },
      "metrics": {
        "value": "Точность и стоимость запросов",
        "citationId": "c14"
      },
      "result": {
        "value": "Длинный контекст точнее на LoCoMo и LongMemEval",
        "citationId": "c6"
      }
    }
  }
];

export const SUGGESTED_QUERIES = [
  "Какие подходы к RAG появились за последний год?",
  "Как проверяют цитаты в ответах LLM по статьям?",
  "Сравни методы поиска фрагментов для научных QA",
];

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  from: "2025-11-01",
  to: "2026-10-31",
  categories: ["cs.CL", "cs.AI", "cs.IR", "cs.LG"],
};

export function paperById(id: string): Paper | undefined {
  return DEMO_PAPERS.find((paper) => paper.id === id);
}

export function citationById(id: string): Citation | undefined {
  return DEMO_CITATIONS.find((citation) => citation.id === id);
}

export function filterPapers(filters: SearchFilters): Paper[] {
  const from = new Date(filters.from).getTime();
  const to = new Date(filters.to).getTime();
  const q = filters.query.trim().toLowerCase();
  const isSuggested = SUGGESTED_QUERIES.some(
    (item) => item.toLowerCase() === q,
  );
  const isCyrillic = /[а-яё]/i.test(q);

  return DEMO_PAPERS.filter((paper) => {
    const published = new Date(paper.published).getTime();
    if (published < from || published > to) return false;
    if (!paper.categories.some((c) => filters.categories.includes(c))) {
      return false;
    }
    if (!q || isSuggested || isCyrillic) return true;
    const haystack = [
      paper.title,
      paper.tldr,
      paper.abstract,
      paper.authors.join(" "),
      paper.arxivId,
    ]
      .join(" ")
      .toLowerCase();
    return q
      .split(/\s+/)
      .some((token) => token.length > 2 && haystack.includes(token));
  }).sort((a, b) => b.relevance - a.relevance);
}
