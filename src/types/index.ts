export type GoalCategory = 
  | 'college' 
  | 'exam' 
  | 'programming' 
  | 'ai-ml' 
  | 'communication' 
  | 'interview' 
  | 'future-work' 
  | 'custom';

export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

export type PathwayType = 'smart' | 'deep';

export interface ConceptKeyword {
  keyword: string;
  category: string;
  priority: 'critical' | 'high' | 'medium';
  simpleMeaning: string;
  practicalExample: string;
  memoryTrick: string;
  whyItMatters: string;
  mastered: boolean;
}

export interface KnowledgeAnalysisReport {
  topic: string;
  initialEstimatedLevel: KnowledgeLevel;
  confidenceRating: number; // 0-100
  confidenceNote: string;
  knownConcepts: string[];
  knowledgeGaps: string[];
  priorityTopics: { 
    name: string; 
    priority: 'CRITICAL' | 'HIGH' | 'CORE'; 
    reason: string; 
    estimatedHours: number 
  }[];
  commonMisconceptions: { 
    misconception: string; 
    correction: string; 
    whyItConfuses: string 
  }[];
  recommendedOrder: string[];
  importantKeywords: ConceptKeyword[];
}

export interface PathwayDetails {
  id: PathwayType;
  name: string;
  label: string;
  tagline: string;
  badge: string;
  principles: string[];
  dailyCommitment: string;
  benefits: string[];
  tradeoffs: string[];
  bestSuitedFor: string;
  estimatedWeeks: number;
}

export interface StudyTask {
  id: string;
  dayNumber: number;
  weekNumber: number;
  title: string;
  description: string;
  category: 'Theory' | 'Practice' | 'Project' | 'Active Recall' | 'Mock Test';
  estimatedMinutes: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  completed: boolean;
  completedAt?: string;
}

export interface WeeklyMilestone {
  week: number;
  title: string;
  goalDescription: string;
  completed: boolean;
  projectDeliverable?: string;
}

export interface StudyRoadmap {
  missionId: string;
  totalDays: number;
  totalHours: number;
  tasks: StudyTask[];
  weeklyMilestones: WeeklyMilestone[];
  nextRecommendedTaskId: string;
}

export interface MockQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  type: 'multiple_choice' | 'short_answer' | 'conceptual';
  explanation: string;
  topic: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery';
}

export interface MockTestConfig {
  topic: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery';
  questionCount: number;
  questionType: 'multiple_choice' | 'short_answer' | 'mixed';
  durationMinutes: number;
  feedbackMode: 'instant' | 'summary';
}

export interface MockTestAttempt {
  id: string;
  config: MockTestConfig;
  questions: MockQuestion[];
  userAnswers: Record<string, string>;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeSpentSeconds: number;
  topicBreakdown: { 
    topic: string; 
    correct: number; 
    total: number; 
    percentage: number 
  }[];
  recommendedFocus: string[];
  isDemoSample?: boolean;
}

export interface FutureSignal {
  topic: string;
  careerRoles: { 
    title: string; 
    demandTrend: string; 
    salaryRange: string; 
    sourceNote: string 
  }[];
  realWorldApplications: { 
    industry: string; 
    application: string; 
    impact: string 
  }[];
  aiImpactAnalysis: { 
    automatedAspects: string[]; 
    humanSuperpowers: string[] 
  };
  complementarySkills: { 
    skill: string; 
    whyPair: string; 
    synergyRating: number 
  }[];
  portfolioProjects: { 
    title: string; 
    brief: string; 
    deliverables: string[]; 
    difficulty: string 
  }[];
  careerMilestones: { 
    level: string; 
    timeline: string; 
    capability: string; 
    signatureProject: string 
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  lastActiveDate: string;
  completedTasksCount: number;
  completedTestsCount: number;
  badges: Badge[];
  topicMastery: Record<string, number>;
}

export interface UserMission {
  id: string;
  topic: string;
  category: GoalCategory;
  priorKnowledge: string;
  currentLevel: KnowledgeLevel;
  targetScore: string;
  dailyTime: string;
  deadline: string;
  deadlineDate: string;
  preferredPathway: PathwayType;
  createdAt: string;
  verifiedScore?: number;
  verifiedLevel?: KnowledgeLevel;
  analysis?: KnowledgeAnalysisReport;
  roadmap?: StudyRoadmap;
}

export interface StudyActivityEntry {
  id: string;
  timeSlot: string; // e.g. "09:30 - 10:15"
  timestamp: string;
  title: string;
  durationMinutes: number;
  category: 'Theory' | 'Practice' | 'Mock Test' | 'AI Studio' | 'Notes';
}

export interface StudyNoteDoc {
  id: string;
  title: string;
  topic: string;
  summary: string;
  keyTakeaways: string[];
  codeSnippet?: string;
  memoryMnemonic: string;
  reviewQuestion: string;
  createdAt: string;
}

export interface VisualDiagram {
  id: string;
  title: string;
  svgXml?: string;
  diagramType: 'architecture' | 'flow' | 'memory-map' | 'infographic';
  description: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: string[];
  suggestedPrompts?: string[];
  isStreaming?: boolean;
  generatedNote?: StudyNoteDoc;
  generatedDiagram?: VisualDiagram;
  imageUrl?: string;
}

