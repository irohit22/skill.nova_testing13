import { z } from 'zod';

export const AnalyzeKnowledgeSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters").max(120),
  category: z.string().optional().default('custom'),
  priorKnowledge: z.string().max(1000).optional().default(''),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  targetScore: z.string().optional().default('Mastery (90%+)'),
  dailyTime: z.string().optional().default('1 hour'),
  deadline: z.string().optional().default('4 weeks'),
});

export const GeneratePlanSchema = z.object({
  topic: z.string().min(2),
  category: z.string().optional().default('custom'),
  pathway: z.enum(['smart', 'deep']).default('smart'),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  dailyTime: z.string().default('1 hour'),
  deadline: z.string().default('4 weeks'),
  priorKnowledge: z.string().optional().default(''),
});

export const MockTestSchema = z.object({
  topic: z.string().min(2),
  difficulty: z.enum(['Foundational', 'Intermediate', 'Advanced', 'Mastery']).default('Intermediate'),
  questionCount: z.number().int().min(3).max(30).default(5),
  questionType: z.enum(['multiple_choice', 'short_answer', 'mixed']).default('multiple_choice'),
  durationMinutes: z.number().int().min(2).max(120).default(10),
  feedbackMode: z.enum(['instant', 'summary']).default('instant'),
});

export const ChatTutorSchema = z.object({
  message: z.string().min(1).max(2000),
  topic: z.string().default('General Learning'),
  currentLevel: z.string().optional().default('beginner'),
  pathway: z.string().optional().default('smart'),
  conversationHistory: z.array(z.object({
    sender: z.enum(['user', 'assistant']),
    text: z.string()
  })).optional().default([]),
});

export const FutureSignalSchema = z.object({
  topic: z.string().min(2),
  currentLevel: z.string().optional().default('beginner'),
});
