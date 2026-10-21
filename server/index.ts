import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  AnalyzeKnowledgeSchema, 
  GeneratePlanSchema, 
  MockTestSchema, 
  ChatTutorSchema, 
  FutureSignalSchema 
} from './schemas.js';
import { 
  analyzeKnowledgeService, 
  generatePlanService, 
  generateMockTestService, 
  chatTutorService, 
  futureSignalService, 
  getAIServiceStatus 
} from './ai-service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health & System Status check
app.get('/api/system-status', (_req: Request, res: Response) => {
  const status = getAIServiceStatus();
  res.json({
    status: 'ONLINE',
    engine: 'SkillNova AI Hybrid Engine',
    timestamp: new Date().toISOString(),
    ai: status
  });
});

// 1. Analyze Knowledge API
app.post('/api/analyze-knowledge', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = AnalyzeKnowledgeSchema.parse(req.body);
    const result = await analyzeKnowledgeService(
      validated.topic, 
      validated.priorKnowledge, 
      validated.currentLevel
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// 2. Generate Plan API
app.post('/api/generate-plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = GeneratePlanSchema.parse(req.body);
    const result = await generatePlanService(
      validated.topic,
      validated.pathway,
      validated.currentLevel,
      validated.dailyTime,
      validated.deadline,
      validated.priorKnowledge
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// 3. Generate Mock Test API
app.post('/api/generate-mock-test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = MockTestSchema.parse(req.body);
    const result = await generateMockTestService(
      validated.topic,
      validated.difficulty,
      validated.questionCount,
      validated.questionType
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// 4. Chat Tutor API
app.post('/api/chat-tutor', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ChatTutorSchema.parse(req.body);
    const result = await chatTutorService(
      validated.message,
      validated.topic,
      validated.currentLevel,
      validated.pathway,
      validated.conversationHistory
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// 5. Future Signal API
app.post('/api/future-signal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = FutureSignalSchema.parse(req.body);
    const result = await futureSignalService(validated.topic, validated.currentLevel);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SkillNova Server Error]:', err);
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🌌 SkillNova AI Server active on http://localhost:${PORT}`);
});
