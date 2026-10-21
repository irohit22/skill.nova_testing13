import dotenv from 'dotenv';
import { 
  generateKnowledgeAnalysis as mockAnalyze,
  generateStudyRoadmap as mockRoadmap,
  generateMockQuestions as mockQuestions,
  generateFutureSignalData as mockFutureSignal,
  generateSocraticTutorReply as mockTutor
} from './mock-data-engine.js';
import { KnowledgeLevel, PathwayType } from '../src/types/index.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface AIServiceStatus {
  isConfigured: boolean;
  provider: 'gemini' | 'openai' | 'none';
  model: string;
  demoMode: boolean;
  message: string;
}

export function getAIServiceStatus(): AIServiceStatus {
  if (GEMINI_API_KEY) {
    return {
      isConfigured: true,
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      demoMode: false,
      message: 'Connected to live Gemini Generative AI API'
    };
  }
  if (OPENAI_API_KEY) {
    return {
      isConfigured: true,
      provider: 'openai',
      model: 'gpt-4o-mini',
      demoMode: false,
      message: 'Connected to live OpenAI API'
    };
  }
  return {
    isConfigured: false,
    provider: 'none',
    model: 'skillnova-deterministic-engine',
    demoMode: true,
    message: 'Demo Mode: Running high-fidelity offline educational engine with full interactivity'
  };
}

/**
 * Calls Gemini REST API or falls back safely to mock engine
 */
async function callGemini(systemPrompt: string, userPrompt: string, temperature = 0.3): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER PROMPT:\n${userPrompt}` }] }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: 2500,
        }
      })
    });

    if (!response.ok) {
      console.warn(`[AI Service] Gemini API returned status ${response.status}: ${await response.text()}`);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.warn('[AI Service] Error calling Gemini API:', err);
    return null;
  }
}

export async function analyzeKnowledgeService(
  topic: string, 
  priorKnowledge: string, 
  currentLevel: KnowledgeLevel
) {
  const status = getAIServiceStatus();
  
  if (status.isConfigured && status.provider === 'gemini') {
    const systemPrompt = `You are the lead AI Knowledge Architect of SkillNova AI. Analyze the user's topic and prior self-description. Return ONLY a valid JSON object matching this schema with no markdown code blocks:
    {
      "topic": "${topic}",
      "initialEstimatedLevel": "${currentLevel}",
      "confidenceRating": number (between 50 and 85),
      "confidenceNote": "string explaining this is an initial estimate until verified by diagnostic quiz",
      "knownConcepts": ["array of 3-4 likely understood concepts"],
      "knowledgeGaps": ["array of 3-4 high-leverage blind spots"],
      "priorityTopics": [{"name": "string", "priority": "CRITICAL" | "HIGH" | "CORE", "reason": "string", "estimatedHours": number}],
      "commonMisconceptions": [{"misconception": "string", "correction": "string", "whyItConfuses": "string"}],
      "recommendedOrder": ["ordered string list of topics"],
      "importantKeywords": [{"keyword": "string", "category": "string", "priority": "critical"|"high"|"medium", "simpleMeaning": "plain language definition", "practicalExample": "concrete example", "memoryTrick": "clever mnemonic", "whyItMatters": "string", "mastered": false}]
    }`;

    const raw = await callGemini(systemPrompt, `Topic: ${topic}\nCurrent self-assessed level: ${currentLevel}\nWhat user already knows: ${priorKnowledge || 'None provided'}`);
    if (raw) {
      try {
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          ...parsed,
          isAIGenerated: true,
          provider: 'Gemini Generative Engine'
        };
      } catch (e) {
        console.warn('[AI Service] Failed to parse model output as JSON, falling back safely:', e);
      }
    }
  }

  // Fallback to high-fidelity domain engine
  const fallback = mockAnalyze(topic, priorKnowledge, currentLevel);
  return {
    ...fallback,
    isAIGenerated: false,
    provider: 'SkillNova Offline Core (Demo Mode)'
  };
}

export async function generatePlanService(
  topic: string,
  pathway: PathwayType,
  currentLevel: KnowledgeLevel,
  dailyTime: string,
  deadline: string,
  priorKnowledge: string = ''
) {
  // We can use the mock engine or Gemini to create custom structured tasks
  const fallback = mockRoadmap(topic, pathway, currentLevel, dailyTime, deadline);
  return {
    ...fallback,
    isAIGenerated: false,
    provider: 'SkillNova Dynamic Roadmap Engine'
  };
}

export async function generateMockTestService(
  topic: string,
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery',
  questionCount: number,
  questionType: 'multiple_choice' | 'short_answer' | 'mixed'
) {
  const status = getAIServiceStatus();

  if (status.isConfigured && status.provider === 'gemini') {
    const systemPrompt = `You are the lead examination designer for SkillNova AI. Generate ${questionCount} original, high-quality, practical exam questions on "${topic}" at "${difficulty}" difficulty.
    Question type is ${questionType}.
    Return ONLY a valid JSON array of objects with no markdown fences:
    [
      {
        "id": "q-1",
        "question": "string",
        "options": ["Option A", "Option B", "Option C", "Option D"] (omit if short_answer),
        "correctAnswer": "exact matching text of correct option or model answer",
        "type": "${questionType === 'mixed' ? 'multiple_choice' : questionType}",
        "explanation": "concise, insightful explanation of why this answer is correct and why other options fail",
        "topic": "${topic}",
        "difficulty": "${difficulty}"
      }
    ]`;

    const raw = await callGemini(systemPrompt, `Topic: ${topic}, Difficulty: ${difficulty}, Count: ${questionCount}`);
    if (raw) {
      try {
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            questions: parsed,
            isAIGenerated: true,
            provider: 'Gemini Exam Simulator'
          };
        }
      } catch (e) {
        console.warn('[AI Service] Failed to parse generated mock questions, falling back:', e);
      }
    }
  }

  const fallbackQuestions = mockQuestions(topic, difficulty, questionCount, questionType);
  return {
    questions: fallbackQuestions,
    isAIGenerated: false,
    provider: 'SkillNova Curated Lab Benchmark (Sample Mode)'
  };
}

export async function chatTutorService(
  message: string,
  topic: string,
  currentLevel: string = 'beginner',
  pathway: string = 'smart',
  conversationHistory: { sender: string; text: string }[] = []
) {
  const status = getAIServiceStatus();

  if (status.isConfigured && status.provider === 'gemini') {
    const historyText = conversationHistory.slice(-4).map(h => `${h.sender.toUpperCase()}: ${h.text}`).join('\n');
    const systemPrompt = `You are SkillNova AI Companion, an elite, encouraging, futuristic Socratic learning tutor.
    Topic being studied: ${topic}.
    Learner level: ${currentLevel}.
    Pathway: ${pathway === 'deep' ? 'Deep Mastery Route' : 'The Smart Route'}.
    
    Pedagogical principles:
    - Never just dump raw answers; guide the student to reason through concepts.
    - Use vivid analogies, concrete engineering examples, and memory tricks.
    - Keep responses concise, well-structured with markdown headings and bullet points.
    - End with a short check-for-understanding question or prompt.`;

    const raw = await callGemini(systemPrompt, `${historyText}\nUSER: ${message}\nASSISTANT:`);
    if (raw) {
      return {
        text: raw,
        suggestedPrompts: [
          "Explain with another example",
          "Ask me a diagnostic challenge",
          "How does this apply in industry?"
        ],
        isAIGenerated: true,
        provider: 'Gemini Neural Tutor'
      };
    }
  }

  const fallback = mockTutor(message, topic, currentLevel, pathway);
  return {
    ...fallback,
    isAIGenerated: false,
    provider: 'SkillNova Socratic Engine (Demo Mode)'
  };
}

export async function futureSignalService(topic: string, currentLevel: string = 'beginner') {
  const fallback = mockFutureSignal(topic);
  return {
    ...fallback,
    isAIGenerated: false,
    provider: 'SkillNova Future-of-Work Intelligence Engine'
  };
}
