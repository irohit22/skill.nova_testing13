import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck2, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Flag, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Send,
  Loader2,
  Play
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { MockQuestion, MockTestConfig, MockTestAttempt } from '../types';
import { api } from '../services/api';
import { soundFX } from '../utils/audio';

interface MockTestLabPageProps {
  onNavigate: (page: string, params?: any) => void;
  onTestComplete: (attempt: MockTestAttempt) => void;
}

export const MockTestLabPage: React.FC<MockTestLabPageProps> = ({ onNavigate, onTestComplete }) => {
  const { activeMission } = useLearning();

  // Mode: 'configure' | 'testing' | 'generating'
  const [testState, setTestState] = useState<'configure' | 'generating' | 'testing'>('configure');

  // Configurator state
  const [topic, setTopic] = useState<string>(activeMission?.topic || 'Generative AI & LLM Systems');
  const [difficulty, setDifficulty] = useState<'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'short_answer' | 'mixed'>('multiple_choice');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [feedbackMode, setFeedbackMode] = useState<'instant' | 'summary'>('instant');

  // Test Runner state
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(false);

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsRemaining]);

  const handleStartTest = async () => {
    soundFX.click();
    setTestState('generating');

    try {
      const response = await api.generateMockTest(topic, difficulty, questionCount, questionType);
      setQuestions(response.questions);
      setIsSampleMode(!response.isAIGenerated);
      setCurrentIndex(0);
      setUserAnswers({});
      setFlaggedQuestions({});
      setSecondsRemaining(durationMinutes * 60);
      setStartTime(Date.now());
      setIsTimerRunning(durationMinutes > 0);
      setTestState('testing');
      soundFX.success();
    } catch (e) {
      setTestState('configure');
    }
  };

  const handleSelectOption = (option: string) => {
    const q = questions[currentIndex];
    setUserAnswers(prev => ({ ...prev, [q.id]: option }));
    soundFX.click();
  };

  const handleToggleFlag = () => {
    const q = questions[currentIndex];
    setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }));
    soundFX.click();
  };

  const handleSubmitTest = () => {
    setIsTimerRunning(false);
    setShowSubmitModal(false);

    // Compute score
    let score = 0;
    const topicStats: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = q.correctAnswer.trim().toLowerCase();
      const isCorrect = uAns.length > 0 && (uAns === cAns || cAns.includes(uAns) || uAns.includes(cAns));

      if (isCorrect) score += 1;

      const tName = q.topic.split(' - ')[1] || q.topic;
      if (!topicStats[tName]) topicStats[tName] = { correct: 0, total: 0 };
      topicStats[tName].total += 1;
      if (isCorrect) topicStats[tName].correct += 1;
    });

    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const attempt: MockTestAttempt = {
      id: `attempt-${Date.now()}`,
      config: { topic, difficulty, questionCount, questionType, durationMinutes, feedbackMode },
      questions,
      userAnswers,
      score,
      maxScore: questions.length,
      percentage,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      topicBreakdown,
      recommendedFocus: topicBreakdown.filter(t => t.percentage < 70).map(t => t.topic),
      isDemoSample: isSampleMode
    };

    onTestComplete(attempt);
    onNavigate('test-results', { attempt });
  };

  const currentQ = questions[currentIndex];
  const isAnswered = currentQ && !!userAnswers[currentQ.id];
  const isFlagged = currentQ && !!flaggedQuestions[currentQ.id];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* 1. CONFIGURATION VIEW */}
      {testState === 'configure' && (
        <div className="glass-panel-glow p-6 sm:p-10 rounded-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-luxury-gold/30 text-luxury-goldLight text-xs font-mono mb-2">
              <FileCheck2 className="w-3.5 h-3.5 text-luxury-gold" />
              <span>DIAGNOSTIC LAB // BENCHMARK GENERATOR</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Configure Your Diagnostic Challenge
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Select difficulty, timing, and question types to benchmark your active retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Topic Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Evaluation Subject / Skill:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. LLM Systems, System Design, Data Structures..."
                className="w-full px-4 py-3 rounded-xl bg-space-950 border border-white/10 text-white font-display text-sm focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Difficulty Tier:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Foundational', 'Intermediate', 'Advanced', 'Mastery'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setDifficulty(tier);
                      soundFX.click();
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono uppercase transition-colors ${
                      difficulty === tier
                        ? 'bg-space-850 border-luxury-azure text-white font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                        : 'bg-space-950 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Question Count:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setQuestionCount(num);
                      soundFX.click();
                    }}
                    className={`py-2 rounded-lg border text-xs font-mono transition-colors ${
                      questionCount === num
                        ? 'bg-space-850 border-cyber-lime text-cyber-lime font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                        : 'bg-space-950 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Timer */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
                Time Limit:
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-space-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyber-cyan"
              >
                <option value={5}>5 Minutes (Sprint drill)</option>
                <option value={10}>10 Minutes (Standard)</option>
                <option value={15}>15 Minutes (Comprehensive)</option>
                <option value={30}>30 Minutes (Deep simulation)</option>
              </select>
            </div>

            {/* Feedback Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Explanation Feedback Timing:
              </label>
              <select
                value={feedbackMode}
                onChange={(e: any) => setFeedbackMode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-space-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyber-cyan"
              >
                <option value="instant">Instant (Show explanation right after answer)</option>
                <option value="summary">Summary (Reveal all solutions at final results)</option>
              </select>
            </div>

          </div>

          {/* Action Launch Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleStartTest}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-space-950" />
              <span>Generate & Begin Diagnostic Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. GENERATING VIEW */}
      {testState === 'generating' && (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan/20 animate-spin-slow" />
            <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin absolute inset-0 m-auto" />
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            Synthesizing Diagnostic Questions...
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Formulating challenging, original scenario questions for &quot;{topic}&quot; ({difficulty}).
          </p>
        </div>
      )}

      {/* 3. ACTIVE TEST RUNNER */}
      {testState === 'testing' && currentQ && (
        <div className="space-y-6">
          
          {/* Top Bar: Progress, Timer, Flag */}
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-cyber-cyan font-bold">
                QUESTION {currentIndex + 1} OF {questions.length}
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                [{currentQ.difficulty} • {currentQ.topic}]
              </span>
              {isSampleMode && (
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  SAMPLE BENCHMARK
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Timer Pill */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                secondsRemaining < 60 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                  : 'bg-space-900 border-white/10 text-white'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              {/* Flag Toggle */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isFlagged 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-space-900 text-slate-400 border-white/10 hover:text-white'
                }`}
                title="Flag question for later review"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Navigator Palette */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-space-950/70 border border-white/10">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const answered = !!userAnswers[q.id];
              const flagged = !!flaggedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    soundFX.click();
                  }}
                  className={`w-8 h-8 rounded-lg font-mono text-xs flex items-center justify-center transition-all relative ${
                    isCurrent
                      ? 'border-2 border-cyber-cyan bg-space-850 text-white font-bold'
                      : answered
                        ? 'bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan'
                        : 'bg-space-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {flagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="font-display font-semibold text-lg sm:text-xl text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-space-850 border-cyber-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-space-950/70 border-white/10 hover:border-cyber-cyan/30 text-slate-300 hover:bg-space-900'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5 border ${
                        isSelected ? 'border-cyber-cyan bg-cyber-cyan text-space-950 font-bold' : 'border-white/20 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Short Answer input */
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">Your Answer / Reasoning:</label>
                <textarea
                  rows={3}
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  placeholder="Type your concise technical answer..."
                  className="w-full px-4 py-3 rounded-xl bg-space-950 border border-cyber-cyan/30 text-white font-body text-xs focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            )}

            {/* Instant Feedback if configured and question answered */}
            {feedbackMode === 'instant' && isAnswered && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-space-950 border border-cyber-cyan/30 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyber-cyan font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXPLANATION REVEAL</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}

            {/* Question Navigation Controls */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex(prev => prev - 1);
                  soundFX.click();
                }}
                className="px-4 py-2 rounded-xl bg-space-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(prev => prev + 1);
                      soundFX.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-cyber-cyan/40 text-xs font-mono text-white flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-cyber-lime hover:bg-white text-space-950 font-display font-bold text-xs shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Score Test</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-md w-full p-6 rounded-2xl space-y-4 text-center">
            <ShieldCheck className="w-12 h-12 text-cyber-lime mx-auto" />
            <h3 className="font-display font-bold text-xl text-white">
              Ready to submit your examination?
            </h3>
            <p className="text-xs text-slate-300">
              You answered <span className="text-white font-bold">{Object.keys(userAnswers).length}</span> of <span className="text-white font-bold">{questions.length}</span> questions. 
              {Object.keys(userAnswers).length < questions.length && (
                <span className="block text-amber-400 mt-1">⚠️ You have unanswered questions remaining!</span>
              )}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-space-900 border border-white/10 text-xs text-slate-300 hover:text-white"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="px-6 py-2 rounded-xl bg-cyber-lime hover:bg-white text-space-950 font-display font-bold text-xs"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
