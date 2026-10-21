import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  BrainCircuit, 
  Bookmark, 
  Lightbulb, 
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { ConceptKeyword } from '../types';
import { soundFX } from '../utils/audio';

interface KnowledgeAnalysisPageProps {
  onNavigate: (page: string) => void;
}

export const KnowledgeAnalysisPage: React.FC<KnowledgeAnalysisPageProps> = ({ onNavigate }) => {
  const { activeMission, keywordMastery, toggleKeywordMastery } = useLearning();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const analysis = activeMission?.analysis;

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Layers className="w-12 h-12 text-cyber-cyan mx-auto" />
        <h2 className="font-display font-bold text-2xl text-white">No Active Analysis Report</h2>
        <p className="text-sm text-slate-400">Launch a learning mission to generate your custom knowledge breakdown.</p>
        <button
          onClick={() => onNavigate('onboarding')}
          className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-display font-bold text-sm"
        >
          Start Mission
        </button>
      </div>
    );
  }

  const keywords = analysis.importantKeywords || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyber-cyan/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI KNOWLEDGE PROFILER // DECONSTRUCTED REPORT</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            {analysis.topic}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            First-principles cognitive breakdown based on your self-reported background. 
          </p>
        </div>

        {/* Diagnostic Quiz Bridge CTA */}
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border-cyber-lime/30">
          <div className="text-left">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Verification Status</div>
            <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Initial Self-Estimate
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.click();
              onNavigate('mock-test');
            }}
            className="px-4 py-2 rounded-lg bg-cyber-lime hover:bg-white text-space-950 font-display font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify via Diagnostic Quiz</span>
          </button>
        </div>
      </div>

      {/* Grid: Confidence Rating & High-Level Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Estimated Knowledge Level */}
        <div className="glass-panel p-6 rounded-2xl border-cyber-cyan/30">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>CURRENT ESTIMATE</span>
            <span className="text-cyber-cyan uppercase font-bold">{analysis.initialEstimatedLevel}</span>
          </div>
          <div className="font-display font-extrabold text-2xl text-white capitalize">
            {analysis.initialEstimatedLevel} Level
          </div>
          <div className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
            {analysis.confidenceNote}
          </div>
        </div>

        {/* Card 2: Confidence Rating & Uncertainty */}
        <div className="glass-panel p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>MODEL CONFIDENCE</span>
            <span className="text-cyber-lime font-bold">{analysis.confidenceRating}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-white">{analysis.confidenceRating}%</span>
            <span className="text-xs text-slate-400">based on self-report</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full bg-space-950 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-lime rounded-full"
              style={{ width: `${analysis.confidenceRating}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            *Takes ~10 test questions to reach 95%+ confidence.
          </div>
        </div>

        {/* Card 3: Priority Hours Needed */}
        <div className="glass-panel p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>CURRICULUM WEIGHT</span>
            <span className="text-cyber-cyan font-bold">4 HIGH-YIELD MODULES</span>
          </div>
          <div className="font-display font-extrabold text-3xl text-white">
            {analysis.priorityTopics.reduce((acc, curr) => acc + curr.estimatedHours, 0)} Hours
          </div>
          <div className="text-xs text-slate-300 mt-2 leading-relaxed">
            Estimated high-intensity focus needed to reach your target performance tier.
          </div>
        </div>

      </div>

      {/* Known Concepts vs Knowledge Gaps (Two-column comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: What You Likely Already Understand */}
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-base mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Concepts You Likely Understand</span>
          </div>
          <ul className="space-y-2.5">
            {analysis.knownConcepts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: High-Leverage Blind Spots & Gaps */}
        <div className="glass-panel p-6 rounded-2xl border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
          <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-base mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>High-Leverage Blind Spots & Knowledge Gaps</span>
          </div>
          <ul className="space-y-2.5">
            {analysis.knowledgeGaps.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Priority Topics Ranked by Importance */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyber-cyan/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
              RANKED BY LEARNING ROI
            </span>
            <h2 className="font-display font-bold text-xl text-white">
              High-Priority Topics To Master
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Recommended sequence for maximum retention
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.priorityTopics.map((topic, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-space-950/70 border border-white/10 hover:border-cyber-cyan/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    topic.priority === 'CRITICAL' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  }`}>
                    {topic.priority} PRIORITY
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{topic.estimatedHours} hrs
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {topic.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {topic.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes & Misconceptions Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10">
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-orange font-bold">
            COGNITIVE TRAPS
          </span>
          <h2 className="font-display font-bold text-xl text-white">
            Common Misconceptions & Mistakes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding why these traps confuse students cuts debugging and exam errors in half.
          </p>
        </div>

        <div className="space-y-4">
          {analysis.commonMisconceptions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-space-950/80 border border-white/10 space-y-2">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono uppercase font-bold flex-shrink-0 mt-0.5">
                  TRAP
                </span>
                <span className="font-display font-semibold text-sm text-white">
                  &quot;{item.misconception}&quot;
                </span>
              </div>

              <div className="flex items-start gap-2 pl-2 border-l-2 border-cyber-lime/50">
                <span className="text-xs font-mono text-cyber-lime font-bold flex-shrink-0">
                  REALITY:
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">
                  {item.correction}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 pl-2">
                <span className="text-slate-500">Why it confuses learners:</span> {item.whyItConfuses}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Keyword Glossary & Memory Mnemonics */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyber-cyan/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
              ACTIVE VOCABULARY & INTUITION
            </span>
            <h2 className="font-display font-bold text-xl text-white">
              Critical Keywords & Memory Mnemonics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Plain language definitions, concrete examples, and memory tricks. Click checkmark to mark as mastered.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>Mastered:</span>
            <span className="text-cyber-lime font-bold">
              {keywords.filter(k => keywordMastery[k.keyword]).length} / {keywords.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {keywords.map((kw: ConceptKeyword, idx: number) => {
            const isMastered = !!keywordMastery[kw.keyword];
            return (
              <div 
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isMastered 
                    ? 'bg-space-900/90 border-cyber-lime/40' 
                    : 'bg-space-950/80 border-white/10 hover:border-cyber-cyan/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyber-cyan uppercase tracking-wider">
                      {kw.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleKeywordMastery(kw.keyword)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors ${
                        isMastered
                          ? 'bg-cyber-lime/20 text-cyber-lime border border-cyber-lime/40'
                          : 'bg-space-900 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Mastered (+25 XP)' : 'Mark Mastered'}</span>
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">
                    {kw.keyword}
                  </h3>

                  {/* Simple Meaning */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Plain Meaning:</span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {kw.simpleMeaning}
                    </p>
                  </div>

                  {/* Practical Example */}
                  <div className="p-2.5 rounded-lg bg-space-900/70 border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-cyber-cyan flex items-center gap-1 mb-0.5">
                      <Lightbulb className="w-3 h-3" />
                      Real-World Example:
                    </span>
                    <p className="text-xs text-slate-300">
                      {kw.practicalExample}
                    </p>
                  </div>

                  {/* Memory Trick */}
                  <div className="p-2.5 rounded-lg bg-space-900/70 border border-cyber-lime/10">
                    <span className="text-[10px] font-mono uppercase text-cyber-lime flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      Memory Trick:
                    </span>
                    <p className="text-xs text-slate-300 italic">
                      &quot;{kw.memoryTrick}&quot;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
                  <span className="text-slate-500">Why it matters:</span> {kw.whyItMatters}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Mission Hub
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pathways')}
            className="px-5 py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-white font-display text-sm"
          >
            Compare Dual Pathways
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-6 py-2.5 rounded-xl bg-cyber-cyan hover:bg-white text-space-950 font-display font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <span>View AI Study Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
