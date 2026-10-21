import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useLearning } from '../context/LearningContext';
import { MockTestAttempt } from '../types';
import { soundFX } from '../utils/audio';

interface TestResultsPageProps {
  attempt?: MockTestAttempt;
  onNavigate: (page: string) => void;
}

export const TestResultsPage: React.FC<TestResultsPageProps> = ({ attempt, onNavigate }) => {
  const { testAttempts, addTask, activeMission } = useLearning();

  const currentAttempt = attempt || testAttempts[0];

  if (!currentAttempt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <FileCheck2 className="w-12 h-12 text-cyber-cyan mx-auto" />
        <h2 className="font-display font-bold text-2xl text-white">No Test Results Found</h2>
        <p className="text-sm text-slate-400">Complete a mock examination to view your diagnostic breakdown.</p>
        <button
          onClick={() => onNavigate('mock-test')}
          className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-display font-bold text-sm"
        >
          Go to Mock Test Lab
        </button>
      </div>
    );
  }

  const { score, maxScore, percentage, timeSpentSeconds, topicBreakdown, questions, userAnswers, isDemoSample } = currentAttempt;

  const handleInjectWeakAreas = () => {
    soundFX.success();
    const weak = topicBreakdown.filter(t => t.percentage < 70);
    if (weak.length === 0) {
      addTask({
        title: `Comprehensive Mastery Consolidation: ${currentAttempt.config.topic}`,
        description: 'Review high-scoring test results and push towards advanced edge cases.',
        category: 'Active Recall',
        estimatedMinutes: 30,
        priority: 'HIGH'
      });
    } else {
      weak.forEach(w => {
        addTask({
          title: `Diagnostic Weakness Repair: ${w.topic}`,
          description: `Targeted sprint focusing on errors identified during Mock Test (${w.percentage}% score). Review first-principles and active recall drills.`,
          category: 'Practice',
          estimatedMinutes: 45,
          priority: 'CRITICAL'
        });
      });
    }
    onNavigate('roadmap');
  };

  const chartData = topicBreakdown.map(t => ({
    name: t.topic.length > 18 ? t.topic.substring(0, 16) + '...' : t.topic,
    score: t.percentage
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-luxury-gold/30 text-luxury-goldLight text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
            <span>DIAGNOSTIC TEST REPORT // EVALUATION SUMMARY</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Performance & Gap Analysis
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Subject: <span className="text-white font-semibold">{currentAttempt.config.topic}</span> • Tier: <span className="text-luxury-goldLight">{currentAttempt.config.difficulty}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('mock-test')}
            className="px-4 py-2 rounded-full bg-space-900 hover:bg-space-850 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake / New Test</span>
          </button>
        </div>
      </div>

      {/* Hero Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Score & Grade */}
        <div className="glass-panel p-6 rounded-2xl border-luxury-gold/30 flex flex-col justify-between md:col-span-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>OVERALL SCORE</span>
            <span className="text-luxury-goldLight font-bold">
              {percentage >= 80 ? 'GRADE: DISTINCTION' : percentage >= 60 ? 'GRADE: PROFICIENT' : 'GRADE: NEEDS REVIEW'}
            </span>
          </div>
          
          <div className="flex items-baseline gap-3 my-2">
            <span className="font-display font-extrabold text-5xl sm:text-6xl text-white">{percentage}%</span>
            <span className="text-lg font-mono text-slate-400">({score} / {maxScore} correct)</span>
          </div>

          <div className="text-xs text-slate-300 border-t border-white/10 pt-3">
            {percentage >= 80 
              ? '✨ Excellent conceptual retention! You have demonstrated strong cognitive mental models across key topics.' 
              : 'Targeted revision recommended. Check the topic breakdown below to focus your daily study sprints.'}
          </div>
        </div>

        {/* Time Spent */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400 uppercase">TIME SPENT</div>
          <div className="font-display font-extrabold text-3xl text-white my-2 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyber-cyan" />
            <span>{Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s</span>
          </div>
          <div className="text-xs text-slate-400">
            Average: {(timeSpentSeconds / maxScore).toFixed(0)}s per question
          </div>
        </div>

        {/* Verification Status */}
        <div className="glass-panel p-6 rounded-2xl border-cyber-cyan/30 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400 uppercase">PROFILE STATUS</div>
          <div className="font-display font-extrabold text-2xl text-cyber-cyan my-2 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyber-lime" />
            <span>Verified Score</span>
          </div>
          <div className="text-xs text-slate-300">
            Updated your active mission profile to <strong className="text-white">{percentage}%</strong>.
          </div>
        </div>

      </div>

      {/* Topic Breakdown Chart & Weakness Injector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
              TOPIC-WISE PROFICIENCY
            </span>
            <span className="text-xs font-mono text-slate-400">% Accuracy</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080d1e', borderColor: 'rgba(0,240,255,0.3)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score >= 70 ? '#00f0ff' : entry.score >= 50 ? '#ccff00' : '#f43f5e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action: Inject Weak Areas into Study Plan */}
        <div className="lg:col-span-5 glass-panel-glow p-6 rounded-2xl border-cyber-cyan/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>DYNAMIC REPAIR ENGINE</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Turn Mistakes Into Long-Term Retention
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              SkillNova AI can automatically analyze which questions you missed and generate targeted remedial practice sessions into your Study Plan.
            </p>
          </div>

          <button
            onClick={handleInjectWeakAreas}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-lime hover:from-white hover:to-cyber-cyan text-space-950 font-display font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Repair Tasks to Study Plan</span>
          </button>
        </div>

      </div>

      {/* Question-by-Question Deep Review */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
            STEP-BY-STEP REVIEW
          </span>
          <h2 className="font-display font-bold text-xl text-white">
            Explanations & Solution Key
          </h2>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const uAns = (userAnswers[q.id] || '').trim();
            const cAns = q.correctAnswer.trim();
            const isCorrect = uAns.toLowerCase() === cAns.toLowerCase() || cAns.toLowerCase().includes(uAns.toLowerCase());

            return (
              <div 
                key={q.id}
                className={`p-5 rounded-xl border space-y-3 ${
                  isCorrect 
                    ? 'bg-space-950/70 border-emerald-500/30' 
                    : 'bg-space-950/90 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Q{idx + 1}.
                    </span>
                    <span className="font-display font-semibold text-sm text-white">
                      {q.question}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 flex-shrink-0 ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-space-900 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Your Submitted Answer:</span>
                    <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400 font-medium'}>
                      {uAns || '(No answer provided)'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-space-900 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Correct Answer:</span>
                    <span className="text-cyber-lime font-medium">
                      {cAns}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-space-900/60 border border-cyber-cyan/15 text-xs text-slate-300">
                  <span className="text-cyber-cyan font-mono font-bold block mb-0.5">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-mono text-slate-400 hover:text-white"
        >
          ← Return to Mission Hub
        </button>

        <button
          onClick={() => onNavigate('companion')}
          className="px-6 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-space-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <span>Ask AI Tutor to Clarify Missed Questions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
