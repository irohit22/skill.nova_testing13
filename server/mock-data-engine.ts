import { 
  KnowledgeAnalysisReport, 
  StudyRoadmap, 
  MockQuestion, 
  FutureSignal, 
  PathwayType, 
  KnowledgeLevel 
} from '../src/types';

// Curated domain knowledge packs for instant rich offline simulation
interface DomainPack {
  keywords: {
    keyword: string;
    category: string;
    priority: 'critical' | 'high' | 'medium';
    simpleMeaning: string;
    practicalExample: string;
    memoryTrick: string;
    whyItMatters: string;
  }[];
  knownConcepts: string[];
  gaps: string[];
  priorityTopics: { name: string; priority: 'CRITICAL' | 'HIGH' | 'CORE'; reason: string; estimatedHours: number }[];
  misconceptions: { misconception: string; correction: string; whyItConfuses: string }[];
  learningOrder: string[];
  mockQuestions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
    difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery';
  }[];
  futureSignal: {
    roles: { title: string; demandTrend: string; salaryRange: string; sourceNote: string }[];
    applications: { industry: string; application: string; impact: string }[];
    aiImpact: { automated: string[]; human: string[] };
    complementary: { skill: string; whyPair: string; synergyRating: number }[];
    projects: { title: string; brief: string; deliverables: string[]; difficulty: string }[];
    milestones: { level: string; timeline: string; capability: string; signatureProject: string }[];
  };
}

const DOMAIN_PACKS: Record<string, DomainPack> = {
  ai: {
    keywords: [
      {
        keyword: "Attention Mechanism",
        category: "Deep Learning Architecture",
        priority: "critical",
        simpleMeaning: "A mathematical way for an AI model to dynamically focus on the most relevant words in a sentence, instead of treating all words equally.",
        practicalExample: "In the sentence 'The bank of the river', attention connects 'bank' to 'river' rather than a financial institution.",
        memoryTrick: "Think of a spotlight in a theatre: it shines brightest on whoever is speaking right now.",
        whyItMatters: "It forms the computational foundation of modern Transformers (GPT, Claude, Gemini)."
      },
      {
        keyword: "RAG (Retrieval-Augmented Generation)",
        category: "Applied LLMs",
        priority: "critical",
        simpleMeaning: "Connecting a language model to a live external database or document library so it answers based on verified facts rather than memory alone.",
        practicalExample: "An internal HR bot querying your company's latest PDF policy handbook before answering your vacation day inquiry.",
        memoryTrick: "Open-book exam: RAG lets the AI look up the textbook before writing the answer.",
        whyItMatters: "Drastically reduces hallucinations and keeps AI answers grounded in proprietary or real-time data."
      },
      {
        keyword: "Temperature",
        category: "Model Hyperparameters",
        priority: "high",
        simpleMeaning: "A setting that controls how 'random' or 'creative' an AI's word choices will be.",
        practicalExample: "Temperature 0.1 for financial calculations (strict, deterministic); Temperature 0.8 for brainstorm marketing hooks (creative, diverse).",
        memoryTrick: "Hot = spontaneous and chaotic; Cold = rigid and predictable.",
        whyItMatters: "Directly determines whether your application behaves reliably or generates wild variations."
      },
      {
        keyword: "Vector Embeddings",
        category: "Data Representation",
        priority: "high",
        simpleMeaning: "Translating words, paragraphs, or images into arrays of numbers where semantic similarity equals geometric proximity.",
        practicalExample: "'King' minus 'Man' plus 'Woman' yields a vector very close to 'Queen'.",
        memoryTrick: "GPS coordinates for concepts: related ideas live in the same numerical neighborhood.",
        whyItMatters: "Enables semantic search, recommendation engines, and modern vector database queries."
      },
      {
        keyword: "Context Window",
        category: "Model Constraints",
        priority: "medium",
        simpleMeaning: "The maximum amount of text (tokens) a model can remember and process in a single request.",
        practicalExample: "A 1M-token context window can ingest 700 pages of legal contracts in one prompt.",
        memoryTrick: "Short-term working desk space: once it overflows, older papers fall off the edge.",
        whyItMatters: "Governs system architecture for document analysis and multi-turn conversational agents."
      }
    ],
    knownConcepts: ["Basic prompt writing", "High-level understanding of chatbots", "Concept of training data"],
    gaps: ["Vector math and similarity metrics (Cosine vs Dot Product)", "Latency vs accuracy tradeoffs in agentic tool loops", "Context caching and token economics"],
    priorityTopics: [
      { name: "Transformer Self-Attention Foundations", priority: "CRITICAL", reason: "Without understanding Q, K, V matrices, model debugging remains guesswork.", estimatedHours: 8 },
      { name: "Vector Databases & Hybrid Search", priority: "HIGH", reason: "Standard keyword search fails in enterprise AI; vector retrieval is industry standard.", estimatedHours: 6 },
      { name: "Agentic Tool Calling & Structured Outputs", priority: "HIGH", reason: "Modern systems act autonomously rather than just chatting in raw markdown.", estimatedHours: 7 },
      { name: "Evaluation & Guardrails (RAG Triad)", priority: "CORE", reason: "Shipping unmonitored AI into production risks critical hallucination and liability.", estimatedHours: 5 }
    ],
    misconceptions: [
      {
        misconception: "LLMs search the web live by default.",
        correction: "Base LLMs are static neural network weight matrices with frozen knowledge. Web search is an external tool call triggered explicitly.",
        whyItConfuses: "Conversational UIs blur the line between generative memory and retrieval pipelines."
      },
      {
        misconception: "More parameters always mean better performance for any task.",
        correction: "Smaller, fine-tuned or distillation models (e.g. 8B parameter models) frequently beat 70B+ models on specific narrow workflows with 10x lower latency and cost.",
        whyItConfuses: "Benchmarking hype focuses primarily on raw flagship parameter sizes."
      }
    ],
    learningOrder: [
      "1. Vector Embeddings & Similarity Search",
      "2. RAG Pipelines & Chunking Strategies",
      "3. Transformer Architecture & Attention Math",
      "4. Tool Calling & Agentic Loops",
      "5. Production Eval & Cost Optimization"
    ],
    mockQuestions: [
      {
        question: "In a Retrieval-Augmented Generation (RAG) system, why is semantic chunking preferred over arbitrary character-length chunking?",
        options: [
          "It minimizes the total file size on disk",
          "It preserves complete logical thoughts and context boundaries within individual vector chunks",
          "It completely eliminates the need for an embedding model",
          "It forces the LLM to run at lower temperatures"
        ],
        correctAnswer: "It preserves complete logical thoughts and context boundaries within individual vector chunks",
        explanation: "Arbitrary chunking cuts sentences and concepts in half across boundaries, polluting embeddings with fractured meaning. Semantic chunking aligns chunks with grammatical headings, paragraphs, or topical shifts.",
        topic: "RAG Architecture",
        difficulty: "Intermediate"
      },
      {
        question: "When calculating Self-Attention in Transformers, what role does the Softmax function play on the Query-Key dot products?",
        options: [
          "It converts raw dot product scores into a probability distribution summing to 1",
          "It downsamples the hidden dimension size",
          "It prevents gradient explosion during inference",
          "It encrypts the tokens for federated learning"
        ],
        correctAnswer: "It converts raw dot product scores into a probability distribution summing to 1",
        explanation: "Softmax normalizes the scaled dot products (Q · K^T / √d_k) so they represent attention weights between 0 and 1 that sum to 1, determining how much focus each token gives to others.",
        topic: "Transformer Foundations",
        difficulty: "Advanced"
      },
      {
        question: "What is the primary danger of setting an LLM temperature to 0.0 in a customer-facing support bot?",
        options: [
          "The bot will fail to execute any API tool calls",
          "Responses will be completely non-deterministic and hallucinated",
          "Responses become greedy and repetitive, occasionally looping on edge-case prompts",
          "Token latency increases exponentially"
        ],
        correctAnswer: "Responses become greedy and repetitive, occasionally looping on edge-case prompts",
        explanation: "Temperature 0.0 (argmax greedy decoding) always picks the single token with highest probability. While deterministic, it lacks diversity and can get stuck in repetitive token loops when encountering ambiguous phrasing.",
        topic: "Model Hyperparameters",
        difficulty: "Foundational"
      }
    ],
    futureSignal: {
      roles: [
        { title: "AI Systems Architect", demandTrend: "+34% YoY growth (WEF Future of Jobs 2025-2026)", salaryRange: "$160k - $240k", sourceNote: "Verified aggregate from Comprehensive Tech Hiring Index & Levels.fyi" },
        { title: "AI Evaluation & Safety Engineer", demandTrend: "+42% demand increase following EU AI Act enforcement", salaryRange: "$145k - $210k", sourceNote: "Industry survey on regulated AI compliance roles" },
        { title: "Applied Generative AI Engineer", demandTrend: "High sustained demand across FinTech, HealthTech, and SaaS", salaryRange: "$135k - $195k", sourceNote: "Glassdoor & LinkedIn Economic Graph" }
      ],
      applications: [
        { industry: "Healthcare & Diagnostics", application: "Synthesizing clinical trial records with multi-modal medical imaging", impact: "Cuts clinical cohort matching from 3 weeks to 4 hours." },
        { industry: "Software Engineering", application: "Autonomous refactoring pipelines with test-driven feedback loops", impact: "Accelerates legacy code modernization by up to 60%." },
        { industry: "Supply Chain", application: "Predictive contract dispute resolution and multi-tier supplier risk radar", impact: "Prevents supply halts through proactive mitigation." }
      ],
      aiImpact: {
        automated: ["Boilerplate prompt drafting", "Basic unit test writing", "Standard CRUD API scaffolding", "Raw text summarization"],
        human: ["Architectural boundary decisions", "Ethical and safety governance", "Cross-disciplinary stakeholder translation", "Root-cause reasoning under ambiguous conditions"]
      },
      complementary: [
        { skill: "Distributed Systems & Kubernetes", whyPair: "AI models must be served at scale with sub-second latency and cost orchestration.", synergyRating: 94 },
        { skill: "Data Engineering (DuckDB / Kafka)", whyPair: "Clean, low-latency streaming data pipelines are the lifeline of reliable RAG systems.", synergyRating: 91 },
        { skill: "Product Sense & User Psychology", whyPair: "Most AI products fail not on model accuracy, but on confusing UX and unpredictable feedback loops.", synergyRating: 88 }
      ],
      projects: [
        {
          title: "Production Multi-Agent Research Copilot",
          brief: "Build an autonomous research agent that orchestrates web scraping, fact verification, and markdown report drafting with citation graphs.",
          deliverables: ["FastAPI or Node.js tool backend", "Vector store integration with hybrid search", "Automated hallucination scoring harness"],
          difficulty: "Advanced"
        },
        {
          title: "Enterprise Codebase Semantic Search Engine",
          brief: "Index an open-source repository into vector chunks, with AST parsing for function signatures and docstrings.",
          deliverables: ["AST chunking parser", "Embeddings cache", "CLI interface for natural language code queries"],
          difficulty: "Intermediate"
        }
      ],
      milestones: [
        { level: "Level 1: Foundation", timeline: "Weeks 1-2", capability: "Fluent with vector math, prompt mechanics, and basic RAG pipelines.", signatureProject: "Document Q&A engine with source citations." },
        { level: "Level 2: Systems Builder", timeline: "Weeks 3-4", capability: "Builds multi-step agentic workflows with schema-validated tool calling.", signatureProject: "Automated Jira issue triage & code patch generator." },
        { level: "Level 3: Production Master", timeline: "Weeks 5-8", capability: "Designs cost-optimized, low-latency AI architectures with rigorous eval suites.", signatureProject: "Enterprise AI Gateway with rate-limiting, caching, and safety guardrails." }
      ]
    }
  },
  programming: {
    keywords: [
      {
        keyword: "Time & Space Complexity (Big-O)",
        category: "Algorithms",
        priority: "critical",
        simpleMeaning: "A standardized mathematical way to describe how the execution time or memory of a program scales as input size grows.",
        practicalExample: "Searching an unsorted phonebook takes O(N) time; using a binary search on a sorted phonebook takes O(log N) time.",
        memoryTrick: "Big-O is like shipping costs: does cost stay flat, grow with weight, or explode exponentially?",
        whyItMatters: "The difference between an application responding in 5 milliseconds or freezing your server."
      },
      {
        keyword: "Idempotence",
        category: "System Design & APIs",
        priority: "high",
        simpleMeaning: "An operation that can be executed multiple times without changing the result beyond the initial execution.",
        practicalExample: "Pressing the 'Pay Now' button twice shouldn't charge the user's credit card twice.",
        memoryTrick: "The elevator call button: pressing it 10 times doesn't summon 10 elevators.",
        whyItMatters: "Essential for robust network APIs, payment gateways, and resilient distributed systems."
      },
      {
        keyword: "Race Condition",
        category: "Concurrency & Multi-threading",
        priority: "critical",
        simpleMeaning: "A bug occurring when two processes access shared data at the same time and the outcome depends on who arrives first.",
        practicalExample: "Two users buying the last ticket at the exact same millisecond resulting in overbooking.",
        memoryTrick: "Two runners lunging for the same baton: whoever grabs it by a millisecond changes the race outcome.",
        whyItMatters: "Among the hardest bugs to reproduce and debug in modern high-throughput backends."
      },
      {
        keyword: "Memoization",
        category: "Dynamic Programming",
        priority: "high",
        simpleMeaning: "An optimization technique that stores the results of expensive function calls and returns the cached result when identical inputs occur.",
        practicalExample: "Calculating Fibonacci(50) by remembering Fibonacci(49) and Fibonacci(48) rather than recalculating from scratch.",
        memoryTrick: "Writing down math notes in your notebook instead of recalculating 87 × 64 every time.",
        whyItMatters: "Turns exponential time algorithms O(2^N) into linear time O(N)."
      }
    ],
    knownConcepts: ["Basic variables and loops", "Conditional statements", "Simple functions"],
    gaps: ["Pointer manipulation / memory management", "Graph traversal algorithms (BFS vs DFS)", "Asynchronous event loops & microtasks"],
    priorityTopics: [
      { name: "Data Structures (Trees, Heaps, Hash Tables)", priority: "CRITICAL", reason: "Data layout in memory dictates algorithmic speed and system scalability.", estimatedHours: 9 },
      { name: "Concurrency & Thread Safety", priority: "HIGH", reason: "Modern CPUs rely on multicore parallelism; single-threaded thinking creates bottlenecks.", estimatedHours: 7 },
      { name: "System Design & Database Indexing (B-Trees vs LSM)", priority: "HIGH", reason: "Writing queries without understanding disk I/O causes catastrophic latency.", estimatedHours: 8 }
    ],
    misconceptions: [
      {
        misconception: "Premature optimization is the root of all evil, so algorithms don't matter in modern web development.",
        correction: "Algorithmic mistakes (e.g. O(N^2) loops inside request handlers) multiply rapidly under user load and cannot be solved simply by adding RAM.",
        whyItConfuses: "Knuth's famous quote was about micro-optimizing assembly instructions, not choosing poor algorithmic data structures."
      }
    ],
    learningOrder: [
      "1. Memory & Big-O Foundations",
      "2. Linear vs Non-Linear Data Structures",
      "3. Search, Sorting & Graph Traversals",
      "4. Concurrency & Async Architecture",
      "5. Distributed Systems & High-Availability Design"
    ],
    mockQuestions: [
      {
        question: "Which data structure provides O(1) amortized insertion, deletion, and lookup time, but can degrade to O(N) in the worst case?",
        options: ["Red-Black Tree", "Hash Table", "Binary Search Tree", "Linked List"],
        correctAnswer: "Hash Table",
        explanation: "Hash tables achieve O(1) average lookup using hash functions, but if many keys hash to the same bucket (hash collision), performance degrades to O(N) without tree-based bucketing.",
        topic: "Data Structures",
        difficulty: "Foundational"
      },
      {
        question: "Why does an LSM-Tree (Log-Structured Merge-tree) provide faster write throughput than a traditional B-Tree?",
        options: [
          "It writes sequentially to an append-only commit log and in-memory MemTable before flushing, avoiding random disk seeks",
          "It uses zero disk storage by keeping everything permanently in CPU L1 cache",
          "It bypasses operating system file system locks completely",
          "It compresses all strings into 1-bit flags"
        ],
        correctAnswer: "It writes sequentially to an append-only commit log and in-memory MemTable before flushing, avoiding random disk seeks",
        explanation: "Sequential disk I/O is orders of magnitude faster than random disk I/O. LSM-trees convert random updates into sequential log appends and sorted batches.",
        topic: "Database Architecture",
        difficulty: "Advanced"
      }
    ],
    futureSignal: {
      roles: [
        { title: "Staff Systems Engineer", demandTrend: "+28% demand for distributed systems veterans", salaryRange: "$180k - $275k", sourceNote: "Tech Talent Monitor 2026" },
        { title: "Full Stack Infrastructure Engineer", demandTrend: "High cross-functional demand", salaryRange: "$140k - $200k", sourceNote: "Levels.fyi & Hired.com" }
      ],
      applications: [
        { industry: "FinTech & Low-Latency Trading", application: "Sub-microsecond order matching engines in Rust/C++", impact: "Eliminates slippage during market volatility." },
        { industry: "Global Logistics", application: "Real-time fleet route optimization using dynamic graph theory", impact: "Reduces fuel consumption by millions of gallons." }
      ],
      aiImpact: {
        automated: ["Routine unit test writing", "Standard boilerplate API endpoints", "Syntax translations"],
        human: ["Subtle concurrency bug diagnosis", "Mission-critical reliability architecture", "Zero-downtime database migration strategies"]
      },
      complementary: [
        { skill: "Rust & Memory Safety", whyPair: "High-performance systems are migrating to Rust for zero-cost abstractions without garbage collection pauses.", synergyRating: 95 },
        { skill: "Observability & OpenTelemetry", whyPair: "You cannot optimize or debug what you cannot measure in production.", synergyRating: 89 }
      ],
      projects: [
        {
          title: "High-Throughput In-Memory Key-Value Cache",
          brief: "Build a thread-safe Redis-like cache with LRU eviction and asynchronous write-behind persistence.",
          deliverables: ["Custom hash table implementation", "TCP socket server", "Benchmarking harness demonstrating 50k+ req/sec"],
          difficulty: "Advanced"
        }
      ],
      milestones: [
        { level: "Level 1: Core Craftsman", timeline: "Weeks 1-2", capability: "Flawless grasp of Big-O, core data structures, and defensive coding.", signatureProject: "Custom memory-efficient cache." },
        { level: "Level 2: Systems Architect", timeline: "Weeks 3-4", capability: "Designs resilient, fault-tolerant distributed services with clean concurrency.", signatureProject: "Distributed rate limiter using Redis and sliding window." }
      ]
    }
  }
};

// Universal fallback generator for any custom topic
function generateGenericPack(topic: string, currentLevel: KnowledgeLevel): DomainPack {
  return {
    keywords: [
      {
        keyword: `${topic} Core First-Principles`,
        category: "Foundations",
        priority: "critical",
        simpleMeaning: `The foundational bedrock laws and building blocks that govern how ${topic} functions in practice.`,
        practicalExample: `Applying the underlying principles of ${topic} to diagnose unexpected bottlenecks in a live project.`,
        memoryTrick: "Build from the ground up: a skyscraper cannot stand on muddy assumptions.",
        whyItMatters: "Mastering the fundamentals ensures you can solve problems you have never seen before."
      },
      {
        keyword: `${topic} Architectural Patterns`,
        category: "System Design",
        priority: "high",
        simpleMeaning: `Proven reusable solutions to recurring structural challenges within ${topic}.`,
        practicalExample: `Structuring your approach in ${topic} using modular, decoupled components instead of a fragile monolith.`,
        memoryTrick: "Patterns are blueprints: don't reinvent the wheel when master craftsmen have solved it.",
        whyItMatters: "Separates chaotic beginner hacks from professional, maintainable, scalable solutions."
      },
      {
        keyword: `${topic} Feedback Loops & Metric Tracing`,
        category: "Optimization",
        priority: "high",
        simpleMeaning: `The measurable signals that indicate whether your execution in ${topic} is succeeding or drifting off target.`,
        practicalExample: `Tracking exact latency, accuracy, or retention metrics before and after an overhaul.`,
        memoryTrick: "What gets measured gets managed; blind navigation leads to crashes.",
        whyItMatters: "Eliminates subjective guesswork and anchors your progress in quantifiable reality."
      },
      {
        keyword: `${topic} Edge-Case Resilience`,
        category: "Mastery",
        priority: "medium",
        simpleMeaning: `Designing processes or systems in ${topic} that gracefully recover when unexpected failures occur.`,
        practicalExample: `Handling intermittent network disconnects, noisy user data, or sudden load spikes without crashes.`,
        memoryTrick: "Hope for the best, engineer for the storm.",
        whyItMatters: "True expertise is proven by how smoothly your work behaves when things go wrong."
      }
    ],
    knownConcepts: [
      `High-level terminology in ${topic}`,
      "Standard everyday use cases and introductory concepts",
      "Basic workflow understanding"
    ],
    gaps: [
      `Deep architectural nuances and performance edge-cases in ${topic}`,
      "Production-grade failure recovery strategies",
      "Quantitative benchmarking and optimization tradeoffs"
    ],
    priorityTopics: [
      { name: `${topic} Foundational First-Principles`, priority: "CRITICAL", reason: "Solidifies core mental models before tackling advanced intricacies.", estimatedHours: 7 },
      { name: `${topic} Structural Patterns & Best Practices`, priority: "HIGH", reason: "Prevents technical debt and accelerates real-world output quality.", estimatedHours: 8 },
      { name: `${topic} Rigorous Testing & Error Diagnosis`, priority: "HIGH", reason: "Builds confidence in handling production-grade edge cases.", estimatedHours: 6 },
      { name: `${topic} Advanced Optimization & Scalability`, priority: "CORE", reason: "Separates intermediate practitioners from top-tier domain masters.", estimatedHours: 5 }
    ],
    misconceptions: [
      {
        misconception: `Mastering ${topic} simply requires memorizing rules without practicing application.`,
        correction: `True mastery in ${topic} comes from iterative hands-on application, error correction, and active recall feedback loops.`,
        whyItConfuses: "Passive reading creates an illusion of competence that breaks down when confronted with real-world problems."
      }
    ],
    learningOrder: [
      `1. First-Principles & Core Grammar of ${topic}`,
      `2. Hands-on Modular Practice Projects`,
      `3. Diagnostic Error Analysis & Misconception Busting`,
      `4. Advanced Edge-Case Handling in ${topic}`,
      `5. Capstone Synthesis & Portfolio Demonstration`
    ],
    mockQuestions: [
      {
        question: `When applying ${topic} to real-world scenarios, which consideration has the greatest impact on long-term maintainability?`,
        options: [
          "Optimizing solely for immediate superficial speed while neglecting modular design",
          "Building clear abstraction boundaries, comprehensive documentation, and observable feedback loops",
          "Relying entirely on intuition without tracking verified metrics",
          "Avoiding all automated testing tools"
        ],
        correctAnswer: "Building clear abstraction boundaries, comprehensive documentation, and observable feedback loops",
        explanation: `In ${topic}, scalable maintainability demands clear interfaces, observable metrics, and decoupled components that can evolve without breaking adjacent systems.`,
        topic: "Architecture & Maintenance",
        difficulty: "Intermediate"
      },
      {
        question: `What is the most effective way to validate whether your mental model of ${topic} is free of hidden misconceptions?`,
        options: [
          "Feynman Technique: Explain and teach the core concepts back in simple language, solving novel diagnostic problems",
          "Re-reading the exact same introductory slides multiple times",
          "Skipping all mock tests and practical challenges",
          "Assuming high initial confidence is sufficient"
        ],
        correctAnswer: "Feynman Technique: Explain and teach the core concepts back in simple language, solving novel diagnostic problems",
        explanation: "Teaching a concept in plain terms without jargon and testing yourself against unfamiliar problems immediately reveals where your knowledge has gaps.",
        topic: "Diagnostic Mastery",
        difficulty: "Foundational"
      }
    ],
    futureSignal: {
      roles: [
        { title: `${topic} Specialist & Lead`, demandTrend: "+29% sustained industry growth", salaryRange: "$130k - $210k", sourceNote: "Global Tech & Professional Skills Horizon 2026" },
        { title: `Principal Consultant — ${topic}`, demandTrend: "High enterprise demand for strategic advisory", salaryRange: "$155k - $250k", sourceNote: "Industry Consulting Benchmark" }
      ],
      applications: [
        { industry: "Enterprise Transformation", application: `Modernizing legacy systems using state-of-the-art ${topic} paradigms`, impact: "Delivers measurable efficiency gains and reduced cycle times." },
        { industry: "Next-Gen Product Development", application: `Integrating intelligent workflows and ${topic} automation`, impact: "Unlocks breakthrough user experience and product differentiation." }
      ],
      aiImpact: {
        automated: [`Routine administrative scaffolding related to ${topic}`, "Initial surface-level drafting", "Generic template generation"],
        human: [`Strategic judgment and high-stakes decision making in ${topic}`, "Cross-functional stakeholder empathy", "Ethical oversight and creative synthesis"]
      },
      complementary: [
        { skill: "Data-Driven Decision Making", whyPair: `Pairs with ${topic} to validate every iteration against business outcomes.`, synergyRating: 92 },
        { skill: "Strategic Communication & Storytelling", whyPair: `Being able to clearly articulate the value of ${topic} to non-technical stakeholders is a massive career multiplier.`, synergyRating: 90 }
      ],
      projects: [
        {
          title: `End-to-End ${topic} Capstone Architecture`,
          brief: `Design, implement, and benchmark a complete real-world system utilizing best-practice principles of ${topic}.`,
          deliverables: ["Architecture specification document", "Interactive functional prototype", "Diagnostic performance report"],
          difficulty: "Intermediate to Advanced"
        }
      ],
      milestones: [
        { level: "Level 1: Groundwork", timeline: "Weeks 1-2", capability: `Strong working fluency with core fundamentals and common tooling in ${topic}.`, signatureProject: `Baseline hands-on project.` },
        { level: "Level 2: Autonomous Practitioner", timeline: "Weeks 3-4", capability: `Solves complex multi-step challenges in ${topic} with minimal supervision.`, signatureProject: `Comprehensive case study & prototype.` },
        { level: "Level 3: Strategic Lead", timeline: "Weeks 5+", capability: `Architects high-leverage initiatives, guides teams, and innovates within ${topic}.`, signatureProject: `Production-ready portfolio capstone.` }
      ]
    }
  };
}

export function generateKnowledgeAnalysis(
  topic: string, 
  priorKnowledge: string, 
  currentLevel: KnowledgeLevel
): KnowledgeAnalysisReport {
  const lower = topic.toLowerCase();
  let pack: DomainPack;

  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('llm') || lower.includes('gpt') || lower.includes('generative')) {
    pack = DOMAIN_PACKS.ai;
  } else if (lower.includes('programming') || lower.includes('code') || lower.includes('software') || lower.includes('system design') || lower.includes('algorithm')) {
    pack = DOMAIN_PACKS.programming;
  } else {
    pack = generateGenericPack(topic, currentLevel);
  }

  // Adjust initial confidence based on prior knowledge length and level
  let confidence = 55;
  if (priorKnowledge.trim().length > 60) confidence += 15;
  if (currentLevel === 'intermediate') confidence += 5;
  if (currentLevel === 'advanced') confidence += 8;

  return {
    topic,
    initialEstimatedLevel: currentLevel,
    confidenceRating: Math.min(confidence, 82), // Capped honestly until diagnostic test is completed!
    confidenceNote: "Initial estimate based on self-reported profile. Complete the Diagnostic Quiz in the Mock Test Lab to earn a Certified Verification score.",
    knownConcepts: pack.knownConcepts,
    knowledgeGaps: pack.gaps,
    priorityTopics: pack.priorityTopics,
    commonMisconceptions: pack.misconceptions,
    recommendedOrder: pack.learningOrder,
    importantKeywords: pack.keywords.map(k => ({ ...k, mastered: false }))
  };
}

export function generateStudyRoadmap(
  topic: string,
  pathway: PathwayType,
  currentLevel: KnowledgeLevel,
  dailyTime: string,
  deadline: string
): StudyRoadmap {
  const isDeep = pathway === 'deep';
  const totalDays = isDeep ? 28 : 14;
  const hoursPerDay = dailyTime.includes('2') ? 2 : dailyTime.includes('3') || dailyTime.includes('4') ? 3.5 : 1;
  const totalHours = Math.round(totalDays * hoursPerDay);

  const tasks = [];
  const taskCount = isDeep ? 20 : 12;

  const prefixes = isDeep 
    ? [
        { title: "First-Principles Conceptual Breakdown", cat: "Theory" as const, pri: "CRITICAL" as const, min: 60 },
        { title: "Deep Architectural Deep-Dive & Derivation", cat: "Theory" as const, pri: "HIGH" as const, min: 75 },
        { title: "Rigorous Hands-On Code / Case Study Implementation", cat: "Practice" as const, pri: "CRITICAL" as const, min: 90 },
        { title: "Active Recall & Socratic Self-Interrogation", cat: "Active Recall" as const, pri: "HIGH" as const, min: 45 },
        { title: "Diagnostic Benchmark & Edge-Case Stress Test", cat: "Mock Test" as const, pri: "CRITICAL" as const, min: 60 },
        { title: "Production-Grade Capstone Architecture", cat: "Project" as const, pri: "HIGH" as const, min: 120 },
      ]
    : [
        { title: "High-Yield Summary & Essential Concepts", cat: "Theory" as const, pri: "CRITICAL" as const, min: 30 },
        { title: "Targeted Flashcard Drill & Spaced Repetition", cat: "Active Recall" as const, pri: "HIGH" as const, min: 25 },
        { title: "Essential Practical Problem Solving", cat: "Practice" as const, pri: "HIGH" as const, min: 45 },
        { title: "Rapid Diagnostic Quiz & Mistake Log Review", cat: "Mock Test" as const, pri: "CRITICAL" as const, min: 35 },
        { title: "Consolidation & Quick Revision Checklist", cat: "Active Recall" as const, pri: "MEDIUM" as const, min: 30 },
      ];

  for (let i = 0; i < taskCount; i++) {
    const template = prefixes[i % prefixes.length];
    const day = Math.floor((i / taskCount) * totalDays) + 1;
    const week = Math.ceil(day / 7);

    tasks.push({
      id: `task-${i + 1}`,
      dayNumber: day,
      weekNumber: week,
      title: `${template.title} #${Math.floor(i / prefixes.length) + 1}: ${topic}`,
      description: isDeep
        ? `Execute a deep conceptual mastery sprint on ${topic}. Focus on underlying mechanics, edge cases, and architectural tradeoffs.`
        : `Streamlined session targeting high-frequency test patterns and essential operational knowledge in ${topic}.`,
      category: template.cat,
      estimatedMinutes: template.min,
      priority: template.pri,
      completed: i === 0 // Default first task as ready or started
    });
  }

  const weeklyMilestones = [];
  const totalWeeks = Math.ceil(totalDays / 7);
  for (let w = 1; w <= totalWeeks; w++) {
    weeklyMilestones.push({
      week: w,
      title: `Week ${w} Milestone: ${w === 1 ? 'Foundational Mental Model' : w === 2 ? 'Core Operational Competence' : w === 3 ? 'Advanced Problem Synthesis' : 'Mastery & Capstone Polish'}`,
      goalDescription: isDeep
        ? `Demonstrate ability to explain, debug, and implement complex scenarios in ${topic} from scratch.`
        : `Achieve 85%+ accuracy on high-frequency questions and maintain daily revision streak.`,
      completed: false,
      projectDeliverable: isDeep 
        ? `Deliverable: Functional mini-project with documentation and error post-mortem.`
        : `Deliverable: Completed revision checklist and topic summary cheat-sheet.`
    });
  }

  return {
    missionId: `mission-${Date.now()}`,
    totalDays,
    totalHours,
    tasks,
    weeklyMilestones,
    nextRecommendedTaskId: tasks[0].id
  };
}

export function generateMockQuestions(
  topic: string,
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery',
  count: number,
  questionType: 'multiple_choice' | 'short_answer' | 'mixed'
): MockQuestion[] {
  const lower = topic.toLowerCase();
  let baseQuestions = DOMAIN_PACKS.ai.mockQuestions;

  if (lower.includes('program') || lower.includes('code') || lower.includes('algorithm') || lower.includes('data structure')) {
    baseQuestions = DOMAIN_PACKS.programming.mockQuestions;
  } else if (!lower.includes('ai') && !lower.includes('learning')) {
    baseQuestions = generateGenericPack(topic, 'intermediate').mockQuestions;
  }

  const generated: MockQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const base = baseQuestions[i % baseQuestions.length];
    const isShortAnswer = questionType === 'short_answer' || (questionType === 'mixed' && i % 2 === 1);

    generated.push({
      id: `q-${Date.now()}-${i}`,
      question: i < baseQuestions.length 
        ? base.question 
        : `[Question ${i + 1}] Regarding ${topic} at ${difficulty} level: How do you address critical performance bottlenecks while maintaining accuracy and reliability?`,
      options: isShortAnswer ? undefined : base.options,
      correctAnswer: isShortAnswer ? "Decouple operations, measure telemetry, and implement caching layers." : base.correctAnswer,
      type: isShortAnswer ? 'short_answer' : 'multiple_choice',
      explanation: base.explanation,
      topic: `${topic} - ${base.topic}`,
      difficulty
    });
  }

  return generated;
}

export function generateFutureSignalData(topic: string): FutureSignal {
  const lower = topic.toLowerCase();
  let pack: DomainPack;

  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('llm')) {
    pack = DOMAIN_PACKS.ai;
  } else if (lower.includes('program') || lower.includes('software') || lower.includes('code')) {
    pack = DOMAIN_PACKS.programming;
  } else {
    pack = generateGenericPack(topic, 'intermediate');
  }

  return {
    topic,
    careerRoles: pack.futureSignal.roles,
    realWorldApplications: pack.futureSignal.applications,
    aiImpactAnalysis: {
      automatedAspects: pack.futureSignal.aiImpact.automated,
      humanSuperpowers: pack.futureSignal.aiImpact.human
    },
    complementarySkills: pack.futureSignal.complementary,
    portfolioProjects: pack.futureSignal.projects,
    careerMilestones: pack.futureSignal.milestones
  };
}

export function generateSocraticTutorReply(
  prompt: string,
  topic: string,
  currentLevel: string = 'beginner',
  pathway: string = 'smart'
): { text: string; suggestedPrompts: string[] } {
  const lower = prompt.toLowerCase();

  if (lower.includes('beginner') || lower.includes('explain like')) {
    return {
      text: `### 🌟 Understanding "${topic}" from the Ground Up\n\nImagine you are building a house. Before choosing paint colors or furniture, you must pour solid concrete footings. In **${topic}**, the core principle is simple:\n\n1. **The Core Job**: Everything exists to solve one specific problem with predictable inputs and outputs.\n2. **The Analogy**: Think of it like a smart postal routing system—every parcel (data or instruction) is tagged, sorted, and routed through the most efficient highway.\n3. **Why it matters right now**: Understanding this fundamental foundation makes all advanced terminology feel natural rather than overwhelming.\n\n> **Check your understanding**: Can you name one real-world process in your daily life that functions like a routing pipeline?`,
      suggestedPrompts: [
        "Give me an intuitive real-world example",
        "Ask me a Socratic challenge question",
        "Explain where this skill is used in real jobs"
      ]
    };
  }

  if (lower.includes('example') || lower.includes('real-world')) {
    return {
      text: `### 🚀 Real-World Application in Practice\n\nHere is how **${topic}** is deployed inside high-scale modern engineering teams:\n\n- **Scenario**: A global logistics platform processes 10,000 requests per second with fluctuating peak loads.\n- **The Problem**: Without applying first-principles in **${topic}**, latency spikes and crashes occur under sudden load.\n- **The Solution**: Engineers introduce caching boundaries, decouple async queues, and apply rate-limiting algorithms.\n- **The Measurable Impact**: 99.9th percentile latency drops from 2,400ms down to 42ms!\n\n> **Question for you**: If your system suddenly received 5x the traffic tomorrow, which component of ${topic} would fail first?`,
      suggestedPrompts: [
        "Ask me a harder question",
        "Find gaps in my mental model",
        "Create 3 rapid-fire flashcards"
      ]
    };
  }

  if (lower.includes('gap') || lower.includes('harder') || lower.includes('test me') || lower.includes('challenge')) {
    return {
      text: `### 🧠 Socratic Diagnostic Challenge\n\nLet's test the depth of your conceptual model in **${topic}**:\n\n**The Scenario**: You are asked to optimize a critical pipeline in ${topic}. You notice that while raw throughput is acceptable, the system experiences unpredictable 5-second freezes every few minutes.\n\n**Three Possible Hypotheses**:\n1. Stop-the-world Garbage Collection pauses or memory reallocation thrashing.\n2. Inefficient unindexed database scans or lock contention on a shared row.\n3. Network socket starvation from unpooled HTTP connections.\n\n👉 **How would you definitively prove which hypothesis is true without guessing or deploying risky code to production?**`,
      suggestedPrompts: [
        "I would check memory allocation telemetry first",
        "I would inspect database lock wait times",
        "Give me the architectural diagnosis"
      ]
    };
  }

  if (lower.includes('flashcard') || lower.includes('practice question') || lower.includes('quiz')) {
    return {
      text: `### ⚡ 3 Rapid-Fire Flashcards for "${topic}"\n\n**Card 1: First Principles**\n- *Front*: What is the primary metric used to evaluate efficiency in this domain?\n- *Back*: Time complexity vs Space complexity, bounded by resource ceilings.\n\n**Card 2: Common Trap**\n- *Front*: What mistake do beginners make when scaling this concept?\n- *Back*: Premature optimization before profiling where the actual 80% bottleneck lies.\n\n**Card 3: Real-World Edge Case**\n- *Front*: What happens when an external dependency times out?\n- *Back*: Requires circuit-breakers and fallback degrades rather than cascading failure.`,
      suggestedPrompts: [
        "Explain circuit-breakers with an example",
        "Ask me another question",
        "Help me revise today's concepts"
      ]
    };
  }

  // Default intelligent tutor response
  return {
    text: `### 🎓 SkillNova AI Companion: Deep Reasoning on ${topic}\n\nI am analyzing your learning path (**${pathway === 'deep' ? 'Deep Mastery Route' : 'The Smart Route'}** at **${currentLevel}** level).\n\nRegarding your query about *"${prompt}"*:\n\n1. **Core Concept**: In ${topic}, every advanced technique is a composition of simpler first-principles.\n2. **Strategic Advice**: Focus on understanding *why* tradeoffs exist rather than simply memorizing answers. If you choose speed, what do you sacrifice in consistency or memory?\n3. **Actionable Next Step**: Try writing out the problem in pseudocode or plain English before writing syntax.\n\nWhere should we direct our focus right now?`,
    suggestedPrompts: [
      "Explain this like I'm a beginner",
      "Give me an intuitive real-world example",
      "Find gaps in my mental model",
      "Explain where this skill is used in real jobs"
    ]
  };
}
