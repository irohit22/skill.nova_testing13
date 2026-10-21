import { 
  KnowledgeAnalysisReport, 
  StudyRoadmap, 
  MockQuestion, 
  FutureSignal, 
  KnowledgeLevel, 
  PathwayType 
} from '../types';

export interface SystemStatusResponse {
  status: string;
  engine: string;
  timestamp: string;
  ai: {
    isConfigured: boolean;
    provider: 'gemini' | 'openai' | 'none';
    model: string;
    demoMode: boolean;
    message: string;
  };
}

export const api = {
  async getSystemStatus(): Promise<SystemStatusResponse> {
    try {
      const res = await fetch('/api/system-status');
      if (!res.ok) throw new Error('Status endpoint failed');
      return await res.json();
    } catch (e) {
      return {
        status: 'OFFLINE_LOCAL',
        engine: 'SkillNova Local Client Engine',
        timestamp: new Date().toISOString(),
        ai: {
          isConfigured: false,
          provider: 'none',
          model: 'client-offline-fallback',
          demoMode: true,
          message: 'Client-side offline mode active with full interactive simulation'
        }
      };
    }
  },

  async analyzeKnowledge(
    topic: string, 
    priorKnowledge: string, 
    currentLevel: KnowledgeLevel,
    targetScore: string = 'Mastery (90%+)',
    dailyTime: string = '1 hour',
    deadline: string = '4 weeks'
  ): Promise<KnowledgeAnalysisReport & { isAIGenerated?: boolean; provider?: string }> {
    try {
      const res = await fetch('/api/analyze-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, priorKnowledge, currentLevel, targetScore, dailyTime, deadline })
      });
      if (!res.ok) throw new Error('Analysis failed');
      return await res.json();
    } catch (e) {
      console.warn('API error, falling back locally', e);
      return {
        topic,
        initialEstimatedLevel: currentLevel,
        confidenceRating: 68,
        confidenceNote: "Initial estimate based on self-reported profile. Verify via the Diagnostic Mock Test for verified certification.",
        knownConcepts: ["Fundamental syntax & concepts", "Everyday problem framing", "Common tools"],
        knowledgeGaps: ["System performance under peak load", "Complex failure recovery patterns", "Algorithmic edge cases"],
        priorityTopics: [
          { name: `${topic} Architectural Foundations`, priority: 'CRITICAL', reason: 'Anchors core mental models before advanced workflows.', estimatedHours: 7 },
          { name: `${topic} Best Practices & Design Patterns`, priority: 'HIGH', reason: 'Improves maintainability and production durability.', estimatedHours: 6 },
          { name: `${topic} Error Handling & Diagnostics`, priority: 'HIGH', reason: 'Builds resilience against real-world anomalies.', estimatedHours: 5 }
        ],
        commonMisconceptions: [
          {
            misconception: `Passive study of ${topic} leads to true retention.`,
            correction: `Active recall, mock test testing, and spaced repetition form durable neural connections.`,
            whyItConfuses: "Reading creates an illusion of understanding that collapses during implementation."
          }
        ],
        recommendedOrder: [
          `1. First-Principles of ${topic}`,
          `2. Hands-on Modular Practice`,
          `3. Edge-Case Diagnosis`,
          `4. Capstone Synthesis`
        ],
        importantKeywords: [
          {
            keyword: "Core First-Principles",
            category: "Foundations",
            priority: "critical",
            simpleMeaning: "The fundamental truths that cannot be deduced any further.",
            practicalExample: "Deconstructing a complex bottleneck into elemental CPU and memory constraints.",
            memoryTrick: "The bedrock beneath the skyscraper.",
            whyItMatters: "Enables you to solve problems you have never encountered before.",
            mastered: false
          },
          {
            keyword: "Observability & Tracing",
            category: "Diagnostics",
            priority: "high",
            simpleMeaning: "Measuring internal states through external outputs.",
            practicalExample: "Logging distributed trace IDs to track request latency across microservices.",
            memoryTrick: "The dashboard in a cockpit.",
            whyItMatters: "You cannot optimize what you cannot observe.",
            mastered: false
          }
        ],
        isAIGenerated: false,
        provider: 'SkillNova Local Engine (Demo Mode)'
      };
    }
  },

  async generatePlan(
    topic: string,
    pathway: PathwayType,
    currentLevel: KnowledgeLevel,
    dailyTime: string,
    deadline: string,
    priorKnowledge: string = ''
  ): Promise<StudyRoadmap & { isAIGenerated?: boolean; provider?: string }> {
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, pathway, currentLevel, dailyTime, deadline, priorKnowledge })
      });
      if (!res.ok) throw new Error('Roadmap generation failed');
      return await res.json();
    } catch (e) {
      console.warn('API error, falling back locally', e);
      // Client-side fallback roadmap
      const isDeep = pathway === 'deep';
      const totalDays = isDeep ? 28 : 14;
      const tasks = [
        {
          id: 'task-1',
          dayNumber: 1,
          weekNumber: 1,
          title: `First-Principles Deep Dive: ${topic}`,
          description: `Map out the conceptual landscape and core axioms of ${topic}.`,
          category: 'Theory' as const,
          estimatedMinutes: isDeep ? 60 : 30,
          priority: 'CRITICAL' as const,
          completed: false
        },
        {
          id: 'task-2',
          dayNumber: 2,
          weekNumber: 1,
          title: `Active Recall Drill & Key Terms: ${topic}`,
          description: `Test memory retention on core keywords without looking at notes.`,
          category: 'Active Recall' as const,
          estimatedMinutes: 30,
          priority: 'HIGH' as const,
          completed: false
        },
        {
          id: 'task-3',
          dayNumber: 3,
          weekNumber: 1,
          title: `Diagnostic Hands-on Challenge: ${topic}`,
          description: `Build a small isolated scenario to verify practical competence.`,
          category: 'Practice' as const,
          estimatedMinutes: isDeep ? 90 : 45,
          priority: 'HIGH' as const,
          completed: false
        },
        {
          id: 'task-4',
          dayNumber: 5,
          weekNumber: 1,
          title: `Diagnostic Mock Test Lab Session`,
          description: `Take a 5-question timed mock test to update verified score.`,
          category: 'Mock Test' as const,
          estimatedMinutes: 20,
          priority: 'CRITICAL' as const,
          completed: false
        }
      ];

      return {
        missionId: `mission-${Date.now()}`,
        totalDays,
        totalHours: isDeep ? 36 : 16,
        tasks,
        weeklyMilestones: [
          {
            week: 1,
            title: 'Foundational Mental Model & First Diagnostic',
            goalDescription: 'Establish mental clarity and achieve 80%+ on foundational quiz.',
            completed: false,
            projectDeliverable: 'Completed core keyword glossary and first test attempt.'
          },
          {
            week: 2,
            title: 'Core Operational Fluency',
            goalDescription: 'Apply concepts to real-world edge cases.',
            completed: false,
            projectDeliverable: 'Hands-on practical deliverable.'
          }
        ],
        nextRecommendedTaskId: 'task-1',
        isAIGenerated: false,
        provider: 'SkillNova Local Engine (Demo Mode)'
      };
    }
  },

  async generateMockTest(
    topic: string,
    difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery',
    questionCount: number,
    questionType: 'multiple_choice' | 'short_answer' | 'mixed'
  ): Promise<{ questions: MockQuestion[]; isAIGenerated?: boolean; provider?: string }> {
    try {
      const res = await fetch('/api/generate-mock-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, questionCount, questionType })
      });
      if (!res.ok) throw new Error('Test generation failed');
      return await res.json();
    } catch (e) {
      console.warn('API error, falling back locally', e);
      return {
        questions: [
          {
            id: 'q-demo-1',
            question: `In ${topic}, what is the fundamental tradeoff between optimizing for rapid initial iteration versus building deep modular abstractions?`,
            options: [
              "Rapid iteration delivers immediate feedback, while modular abstractions reduce long-term maintenance overhead and technical debt",
              "Rapid iteration eliminates the need for all automated testing",
              "Modular abstractions permanently slow down runtime execution speeds",
              "There is no difference in software engineering"
            ],
            correctAnswer: "Rapid iteration delivers immediate feedback, while modular abstractions reduce long-term maintenance overhead and technical debt",
            explanation: "Short-term velocity often uses shortcuts that create technical debt. Modular design costs time upfront but protects against systemic failure as complexity grows.",
            topic: `${topic} - Architecture`,
            difficulty
          },
          {
            id: 'q-demo-2',
            question: `Which technique is proven by cognitive science to provide the highest long-term retention when mastering ${topic}?`,
            options: [
              "Active Recall and Spaced Retrieval Practice with Socratic feedback",
              "Passive re-reading of highlight passages late at night",
              "Watching videos at 2x speed without taking notes or solving problems",
              "Cramming all content 12 hours before an evaluation"
            ],
            correctAnswer: "Active Recall and Spaced Retrieval Practice with Socratic feedback",
            explanation: "Retrieval practice forces the brain to reconstruct neural pathways, strengthening synaptic connections far more than passive recognition.",
            topic: `${topic} - Learning Science`,
            difficulty
          }
        ],
        isAIGenerated: false,
        provider: 'SkillNova Local Benchmark (Sample Mode)'
      };
    }
  },

  async chatTutor(
    message: string,
    topic: string,
    currentLevel: string = 'beginner',
    pathway: string = 'smart',
    conversationHistory: { sender: 'user' | 'assistant'; text: string }[] = []
  ): Promise<{ text: string; suggestedPrompts?: string[]; isAIGenerated?: boolean; provider?: string }> {
    try {
      const res = await fetch('/api/chat-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, topic, currentLevel, pathway, conversationHistory })
      });
      if (!res.ok) throw new Error('Chat failed');
      return await res.json();
    } catch (e) {
      return {
        text: `### 🌟 Socratic Insight on ${topic}\n\nLet's break down your question: **"${message}"**.\n\nIn **${topic}**, the key to breaking through a plateau is recognizing how foundational building blocks fit together. \n\n- **Rule 1**: Understand the input, the transform, and the expected output.\n- **Rule 2**: Identify where edge-case failures typically originate.\n\n> *Challenge*: What is your intuition about why this specific step behaves this way?`,
        suggestedPrompts: [
          "Explain this like I'm a beginner",
          "Give me an intuitive real-world example",
          "Ask me a harder question"
        ],
        isAIGenerated: false,
        provider: 'SkillNova Client Tutor'
      };
    }
  },

  async getFutureSignal(topic: string, currentLevel: string = 'beginner'): Promise<FutureSignal & { isAIGenerated?: boolean; provider?: string }> {
    try {
      const res = await fetch('/api/future-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, currentLevel })
      });
      if (!res.ok) throw new Error('Future signal failed');
      return await res.json();
    } catch (e) {
      return {
        topic,
        careerRoles: [
          { title: `${topic} Systems Specialist`, demandTrend: "+31% YoY Growth in Tech Index", salaryRange: "$145k - $225k", sourceNote: "Global Tech Hiring Benchmark 2025/2026" },
          { title: `Lead Engineer — ${topic}`, demandTrend: "High cross-industry demand", salaryRange: "$165k - $250k", sourceNote: "Levels.fyi & Industry Aggregate" }
        ],
        realWorldApplications: [
          { industry: "High-Volume Tech Platforms", application: `High-availability implementation using ${topic}`, impact: "Reduces latency by 50% and improves user satisfaction." }
        ],
        aiImpactAnalysis: {
          automatedAspects: ["Routine boilerplate generation", "Syntax translation", "Standard documentation drafting"],
          humanSuperpowers: ["High-stakes architectural judgment", "Complex cross-system tradeoffs", "Stakeholder empathy and ethical boundaries"]
        },
        complementarySkills: [
          { skill: "Systems Architecture", whyPair: "Contextualizes granular decisions into overall system reliability.", synergyRating: 93 },
          { skill: "Data Observability", whyPair: "Enables real-time performance diagnostics.", synergyRating: 89 }
        ],
        portfolioProjects: [
          {
            title: `Production ${topic} Benchmark Suite`,
            brief: `Construct an end-to-end prototype validating core mechanics and error resilience.`,
            deliverables: ["Technical spec", "Interactive code repository", "Performance benchmark"],
            difficulty: "Advanced"
          }
        ],
        careerMilestones: [
          { level: "Level 1: Fundamentals", timeline: "Weeks 1-2", capability: "Solid foundational grasp of mechanics.", signatureProject: "Working prototype." },
          { level: "Level 2: Autonomous Specialist", timeline: "Weeks 3-4", capability: "Solves edge-cases independently.", signatureProject: "Production deployment." },
          { level: "Level 3: Strategic Lead", timeline: "Weeks 5+", capability: "Architects scalable solutions and guides organizations.", signatureProject: "Industry capstone." }
        ],
        isAIGenerated: false,
        provider: 'SkillNova Local Engine (Demo Mode)'
      };
    }
  }
};
