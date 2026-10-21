import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Code, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Zap,
  Target,
  Loader2,
  Layers,
  Shield,
  HelpCircle
} from 'lucide-react';
import { GoalCategory, KnowledgeLevel, PathwayType, UserMission } from '../types';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import { soundFX } from '../utils/audio';

interface OnboardingWizardProps {
  onNavigate: (page: string) => void;
}

// Strictly the 2 Best High-Leverage Domains
const PREMIER_DOMAINS = [
  {
    id: 'ai-ml' as GoalCategory,
    title: 'Generative AI & LLM Systems Engineering',
    tagline: 'The Frontier of Autonomous Intelligence',
    description: 'Master Large Language Models, RAG pipelines, fine-tuning, vector databases, multi-agent frameworks, and high-performance inference architecture.',
    icon: Cpu,
    defaultTopic: 'Generative AI & LLM Systems Engineering',
    highlights: ['RAG & Vector Retrieval', 'Multi-Agent Networks', 'LoRA & Quantization', 'vLLM & Inference Latency']
  },
  {
    id: 'programming' as GoalCategory,
    title: 'High-Scale Distributed Systems & Cloud',
    tagline: 'The Backbone of Global Infrastructure',
    description: 'Master fault-tolerant microservices, Kafka event streaming, distributed consensus (Raft), multi-region databases, and zero-downtime scalability.',
    icon: Code,
    defaultTopic: 'High-Scale Distributed Systems & Cloud Architecture',
    highlights: ['Distributed Consensus (Raft)', 'Event Streaming (Kafka)', 'Saga Consistency Patterns', 'Sub-10ms Latency at Scale']
  }
];

// Level-Calibrating Diagnostic Questions tailored to domain and baseline
const LEVEL_QUESTIONS = {
  'ai-ml': {
    beginner: {
      question: "Which milestone best describes where you are currently starting?",
      options: [
        { label: "AI Prompting Only", detail: "I use ChatGPT/Claude for everyday tasks, but haven't written API integration code yet." },
        { label: "Basic API Integration", detail: "I have called OpenAI/Anthropic APIs in Python/JS and understand tokens & temperature." },
        { label: "Initial Experimentation", detail: "I've tried building a simple toy script with LangChain or basic vector search." }
      ]
    },
    intermediate: {
      question: "Which high-leverage challenge do you want to solve first?",
      options: [
        { label: "Production-Grade RAG", detail: "Semantic chunking, hybrid keyword+vector search, rerankers, and citation attribution." },
        { label: "Multi-Agent Orchestration", detail: "Autonomous agents with tool-calling, state graphs, memory persistence, and guardrails." },
        { label: "Model Adaptation & Tuning", detail: "Parameter-efficient fine-tuning (LoRA/QLoRA), dataset prep, and eval benchmarks." }
      ]
    },
    advanced: {
      question: "What is your primary elite engineering objective?",
      options: [
        { label: "High-Throughput Inference", detail: "Kernel optimizations, continuous batching, vLLM, speculative decoding, and latency SLAs." },
        { label: "Billion-Scale Retrieval", detail: "HNSW graphs at enterprise scale, sparse-dense hybrid retrieval, and sub-15ms p99." },
        { label: "Enterprise Safety & Self-Correction", detail: "Deterministic evaluation harnesses, hallucination detection, and real-time guardrails." }
      ]
    }
  },
  'programming': {
    beginner: {
      question: "What best represents your current systems foundation?",
      options: [
        { label: "Monolithic Web Services", detail: "I write backend endpoints and understand HTTP/REST, but want to step into distributed architecture." },
        { label: "Database & CRUD Level", detail: "I know relational SQL and basic indexing, but want to master concurrency and scale." },
        { label: "Single-Container Deployments", detail: "I've used Docker locally, but need to understand cluster orchestration and service discovery." }
      ]
    },
    intermediate: {
      question: "Which distributed bottleneck do you want to tackle immediately?",
      options: [
        { label: "Data Consistency Across Services", detail: "Implementing Saga transactions, two-phase commits, outbox patterns, and idempotency." },
        { label: "Event-Driven Message Streams", detail: "Partitioning, consumer groups, exactly-once semantics, and handling dead-letter queues in Kafka." },
        { label: "Distributed Caching & Reliability", detail: "Cache invalidation stampedes, circuit breakers, rate limiters, and bulkhead patterns." }
      ]
    },
    advanced: {
      question: "What is your target elite systems design benchmark?",
      options: [
        { label: "Consensus & State Machine Replication", detail: "Raft/Paxos implementations, leader elections, log replication, and split-brain resolution." },
        { label: "Multi-Region Active-Active Storage", detail: "Conflict-free replicated data types (CRDTs), quorum reads/writes, and zero-data-loss failover." },
        { label: "Extreme Scale (1M+ RPS)", detail: "Lock-free algorithms, epoll network loops, zero-copy I/O, and sub-5ms tail latency." }
      ]
    }
  }
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onNavigate }) => {
  const { setActiveMission, addXP } = useLearning();

  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('ai-ml');
  const [customTopic, setCustomTopic] = useState<string>('Generative AI & LLM Systems Engineering');
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('intermediate');
  const [selectedDiagnosticAnswer, setSelectedDiagnosticAnswer] = useState<string>('');
  const [priorKnowledgeNotes, setPriorKnowledgeNotes] = useState<string>('');
  const [dailyTime, setDailyTime] = useState<string>('1.5 hours');
  const [deadline, setDeadline] = useState<string>('4 weeks');
  const [preferredPathway, setPreferredPathway] = useState<PathwayType>('deep');

  // AI Synthesis screen state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisPhase, setAnalysisPhase] = useState<number>(0);

  const PHASES = [
    'Synthesizing curriculum benchmarks & domain ontology...',
    'Deconstructing foundational first-principles and axioms...',
    'Detecting high-leverage blind spots from your baseline...',
    'Calibrating Dual Strategic Pathways (Smart Route vs Deep Mastery)...',
    'Generating personalized daily roadmap and diagnostic milestones...'
  ];

  // Active diagnostic question based on domain & level
  const activeDomainKey = selectedCategory === 'programming' ? 'programming' : 'ai-ml';
  const currentDiagnostic = useMemo(() => {
    return LEVEL_QUESTIONS[activeDomainKey][knowledgeLevel];
  }, [activeDomainKey, knowledgeLevel]);

  const handleNext = () => {
    soundFX.click();
    if (step === 1) {
      // Set default diagnostic answer if empty
      if (!selectedDiagnosticAnswer && currentDiagnostic.options.length > 0) {
        setSelectedDiagnosticAnswer(currentDiagnostic.options[0].label + ': ' + currentDiagnostic.options[0].detail);
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
      runAIAnalysis();
    }
  };

  const handleBack = () => {
    soundFX.click();
    if (step > 1 && !isAnalyzing) {
      setStep(step - 1);
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisPhase(0);

    const combinedPriorKnowledge = `Level: ${knowledgeLevel}. Baseline Diagnostic: ${selectedDiagnosticAnswer || 'Self-assessed'}. Notes: ${priorKnowledgeNotes || 'Ready for guided progression'}`;

    const interval = setInterval(() => {
      setAnalysisPhase(prev => {
        if (prev < PHASES.length - 1) return prev + 1;
        return prev;
      });
    }, 850);

    try {
      const [analysisResult, planResult] = await Promise.all([
        api.analyzeKnowledge(customTopic, combinedPriorKnowledge, knowledgeLevel, 'Top 1% Mastery (90%+)', dailyTime, deadline),
        api.generatePlan(customTopic, preferredPathway, knowledgeLevel, dailyTime, deadline, combinedPriorKnowledge)
      ]);

      setTimeout(() => {
        clearInterval(interval);
        setIsAnalyzing(false);

        const newMission: UserMission = {
          id: `mission-${Date.now()}`,
          topic: customTopic,
          category: selectedCategory,
          priorKnowledge: combinedPriorKnowledge,
          currentLevel: knowledgeLevel,
          targetScore: 'Top 1% Mastery (90%+)',
          dailyTime,
          deadline,
          deadlineDate: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
          preferredPathway,
          createdAt: new Date().toISOString(),
          analysis: analysisResult,
          roadmap: planResult
        };

        setActiveMission(newMission);
        addXP(120, 'Configured Learning Mission');
        soundFX.success();
        onNavigate('dashboard');
      }, 4200);

    } catch (e) {
      clearInterval(interval);
      setIsAnalyzing(false);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
      
      {/* Sleek Step Navigation Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5">
          <span className="text-white font-medium uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
            EXECUTIVE MISSION CONFIGURATOR
          </span>
          <span className="font-semibold text-luxury-goldLight">STEP {step} OF 3</span>
        </div>
        
        <div className="h-1 w-full bg-space-900 rounded-full overflow-hidden border border-white/[0.06]">
          <motion.div 
            className="h-full bg-gradient-to-r from-luxury-azure via-white to-luxury-gold"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Main Luxury Configurator Card */}
      <div className="glass-panel-glow p-7 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl border border-white/[0.08]">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT FROM 2 PREMIER DOMAINS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
                  STEP 01 // SELECT SPECIALIZATION
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">
                  Choose Your Premier Focus Domain
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  We specialize exclusively in the two highest-leverage technological domains shaping the future of computing and career leadership.
                </p>
              </div>

              {/* 2 Premier Domains Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {PREMIER_DOMAINS.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = selectedCategory === domain.id;
                  return (
                    <div
                      key={domain.id}
                      onClick={() => {
                        setSelectedCategory(domain.id);
                        setCustomTopic(domain.defaultTopic);
                        setSelectedDiagnosticAnswer('');
                        soundFX.click();
                      }}
                      className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-space-850 to-space-900 border-luxury-gold shadow-[0_0_25px_rgba(212,175,55,0.18)] scale-[1.01]'
                          : 'bg-space-900/60 border-white/[0.08] hover:border-white/20 hover:bg-space-900/80 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            isSelected 
                              ? 'bg-luxury-gold/15 border-luxury-gold/40 text-luxury-gold' 
                              : 'bg-space-800 border-white/10 text-slate-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-luxury-gold uppercase font-bold px-2 py-0.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/30">
                              <CheckCircle2 className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-display font-bold text-lg text-white leading-snug">
                            {domain.title}
                          </h3>
                          <p className="text-[11px] font-mono text-luxury-azure mt-0.5">
                            {domain.tagline}
                          </p>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {domain.description}
                        </p>
                      </div>

                      {/* Feature Pills */}
                      <div className="pt-4 border-t border-white/[0.06] mt-4 flex flex-wrap gap-1.5">
                        {domain.highlights.map((h, i) => (
                          <span 
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-space-950/80 border border-white/[0.06] text-slate-300"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Custom Topic Specification */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Topic Focus Specification (Edit if desired):
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Editable</span>
                </div>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-space-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-luxury-gold text-sm font-display"
                  placeholder="e.g. LLM Systems & RAG Architecture"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>Continue: Level Calibration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LEVEL CALIBRATION & DIRECT DIAGNOSTIC QUESTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-azure font-bold">
                  STEP 02 // LEVEL & DIAGNOSTIC CALIBRATION
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">
                  Calibrate Your Level & Knowledge Baseline
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Select your current tier. We immediately adjust our curriculum depth so you never waste time on redundant material.
                </p>
              </div>

              {/* Tier Selection - 3 Simple Options */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Select Your Base Level:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'beginner' as const, title: 'Beginner', badge: 'Core Foundations', desc: 'Starting orientation, syntax & fundamentals' },
                    { id: 'intermediate' as const, title: 'Intermediate', badge: 'Applied Systems', desc: 'Working with APIs, architecture patterns & bridging gaps' },
                    { id: 'advanced' as const, title: 'Advanced', badge: 'Elite Mastery', desc: 'High-scale production, deep theory & edge cases' }
                  ].map((lvl) => {
                    const isSelected = knowledgeLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          setKnowledgeLevel(lvl.id);
                          setSelectedDiagnosticAnswer('');
                          soundFX.click();
                        }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-space-850 border-luxury-azure text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                            : 'bg-space-900 border-white/[0.08] text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-bold text-sm text-white">{lvl.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-luxury-azure" />}
                        </div>
                        <span className="text-[10px] font-mono text-luxury-azure font-medium block mb-1">
                          {lvl.badge}
                        </span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {lvl.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic Question Tailored to User Level */}
              <div className="space-y-3 pt-2 bg-space-950/70 p-5 rounded-2xl border border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono text-luxury-gold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="uppercase font-bold tracking-wider">Level Diagnostic Question:</span>
                </div>
                <div className="font-display font-semibold text-sm sm:text-base text-white">
                  {currentDiagnostic.question}
                </div>

                <div className="space-y-2 pt-1">
                  {currentDiagnostic.options.map((opt, idx) => {
                    const optValue = `${opt.label}: ${opt.detail}`;
                    const isSelected = selectedDiagnosticAnswer === optValue || (!selectedDiagnosticAnswer && idx === 0);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedDiagnosticAnswer(optValue);
                          soundFX.click();
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-space-850 border-luxury-gold text-white shadow-sm'
                            : 'bg-space-900/80 border-white/[0.06] hover:border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-luxury-gold bg-luxury-gold/20' : 'border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-display font-bold text-xs text-white">
                            {opt.label}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {opt.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Specific topics or exam/interview goals you want to focus on (Optional):
                </label>
                <textarea
                  rows={2}
                  value={priorKnowledgeNotes}
                  onChange={(e) => setPriorKnowledgeNotes(e.target.value)}
                  placeholder="e.g. Preparing for Staff Engineer system design interviews or building an autonomous agent framework..."
                  className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-luxury-azure text-xs font-body leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-full bg-space-900 border border-white/10 text-slate-300 text-xs font-display flex items-center gap-1.5 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-luxury-azure hover:text-space-950 text-space-950 font-display font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Continue: Cadence & Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CADENCE & STRATEGY (LESS OPTIONS, SIMPLE CHOICE) */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
                  STEP 03 // CADENCE & STRATEGY
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">
                  Select Your Execution Cadence & Strategy
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Choose your learning philosophy and daily investment.
                </p>
              </div>

              {/* Pathway Choices - 2 Clear Routes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* The Smart Route */}
                <div 
                  onClick={() => {
                    setPreferredPathway('smart');
                    soundFX.click();
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    preferredPathway === 'smart'
                      ? 'bg-space-850 border-luxury-azure shadow-[0_0_20px_rgba(56,189,248,0.18)]'
                      : 'bg-space-900/60 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-luxury-azure uppercase font-bold tracking-wider">
                      PATH A: THE SMART ROUTE
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">High Yield</span>
                  </div>
                  <div className="font-display font-bold text-base text-white">
                    80/20 High-Yield Mastery
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Designed for maximum efficiency. Focuses on high-frequency patterns, active recall flashcards, and rapid conceptual synthesis.
                  </p>
                </div>

                {/* Deep Mastery */}
                <div 
                  onClick={() => {
                    setPreferredPathway('deep');
                    soundFX.click();
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    preferredPathway === 'deep'
                      ? 'bg-space-850 border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                      : 'bg-space-900/60 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-luxury-gold uppercase font-bold tracking-wider">
                      PATH B: DEEP MASTERY
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Unfair Advantage</span>
                  </div>
                  <div className="font-display font-bold text-base text-white">
                    First-Principles Rigor
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Demands rigorous understanding. Real-world architecture case studies, Feynman concept-teaching, edge case analysis, and portfolio proof.
                  </p>
                </div>

              </div>

              {/* Simplified Cadence - Minimal Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase text-slate-400">Daily Study Dedication:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1 hour', '1.5 hours', '2+ hours'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => { setDailyTime(time); soundFX.click(); }}
                        className={`py-2 px-2 rounded-xl text-xs font-mono border transition-all ${
                          dailyTime === time
                            ? 'bg-white text-space-950 font-bold border-white'
                            : 'bg-space-950 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase text-slate-400">Target Timeline:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['3 weeks', '6 weeks', '10 weeks'].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => { setDeadline(dur); soundFX.click(); }}
                        className={`py-2 px-2 rounded-xl text-xs font-mono border transition-all ${
                          deadline === dur
                            ? 'bg-white text-space-950 font-bold border-white'
                            : 'bg-space-950 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-full bg-space-900 border border-white/10 text-slate-300 text-xs font-display flex items-center gap-1.5 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-luxury-azure via-white to-luxury-gold hover:opacity-95 text-space-950 font-display font-extrabold text-xs transition-all flex items-center gap-2 shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Personalized Mission</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ELEGANT AI SYNTHESIS FEEDBACK */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-luxury-gold/30 animate-spin-slow" />
                <div className="w-14 h-14 rounded-full border border-luxury-azure/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
                <Loader2 className="w-7 h-7 text-luxury-gold animate-spin absolute" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold font-bold">
                  NEURAL COMPILATION IN PROGRESS
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  Synthesizing &quot;{customTopic}&quot;
                </h3>
              </div>

              <div className="max-w-md w-full bg-space-950/90 rounded-2xl p-5 border border-white/[0.08] text-left space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>PROGRESS STATUS:</span>
                  <span className="text-luxury-goldLight font-bold">PHASE {analysisPhase + 1} OF 5</span>
                </div>
                <div className="font-mono text-xs text-slate-200 min-h-[2.5rem] flex items-center">
                  {PHASES[analysisPhase]}
                </div>
                <div className="h-1 w-full bg-space-900 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-luxury-azure to-luxury-gold"
                    animate={{ width: `${((analysisPhase + 1) / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Calibrating your customized roadmap, diagnostic checkpoints & AI studio...
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
