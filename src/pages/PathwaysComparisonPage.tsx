import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  AlertCircle, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Flame,
  Award
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { PathwayType } from '../types';
import { soundFX } from '../utils/audio';

interface PathwaysComparisonPageProps {
  onNavigate: (page: string) => void;
}

export const PathwaysComparisonPage: React.FC<PathwaysComparisonPageProps> = ({ onNavigate }) => {
  const { pathway, setPathway, activeMission } = useLearning();

  const handleSelect = (selectedPathway: PathwayType) => {
    setPathway(selectedPathway);
    soundFX.success();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STRATEGIC DUAL-PATHWAY ARCHITECTURE</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Choose Your Strategic Learning Route
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Every learner faces a fundamental tradeoff between time and depth. SkillNova gives you two distinct, highly-engineered pathways. Select the one that matches your timeline and ambition.
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
        
        {/* PATH A: THE SMART ROUTE */}
        <div 
          className={`glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
            pathway === 'smart' 
              ? 'border-2 border-cyber-cyan shadow-[0_0_35px_rgba(0,240,255,0.25)] bg-space-850/90' 
              : 'border border-white/10 hover:border-cyber-cyan/40 bg-space-900/60'
          }`}
        >
          {pathway === 'smart' && (
            <div className="absolute -top-3.5 left-8 px-3 py-0.5 rounded-full bg-cyber-cyan text-space-950 font-mono text-[10px] font-extrabold tracking-widest uppercase">
              CURRENTLY ACTIVE ROUTE
            </div>
          )}

          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyber-cyan font-bold uppercase tracking-wider">
                  PATH A // THE SMART ROUTE
                </span>
                <span className="px-2 py-0.5 rounded bg-space-950 border border-cyber-cyan/20 text-slate-300">
                  Label: &quot;Learn efficiently&quot;
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                High-Yield Time Efficiency
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Practical, time-conscious strategy prioritizing 80/20 high-frequency exam concepts, spaced repetition flashcards, and structured memory checklists.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-space-950/70 border border-white/5 text-center">
              <div>
                <div className="text-[10px] font-mono text-slate-400">DAILY TIME</div>
                <div className="font-display font-bold text-sm text-cyber-cyan">30–60 mins</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">COMPLETION</div>
                <div className="font-display font-bold text-sm text-white">2–4 Weeks</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">PACE</div>
                <div className="font-display font-bold text-sm text-cyber-lime">Accelerated</div>
              </div>
            </div>

            {/* Core Pedagogical Pillars */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                CORE PEDAGOGICAL PILLARS:
              </span>
              <ul className="space-y-2 text-xs text-slate-200">
                {[
                  'High-priority, high-frequency concepts tackled first',
                  'Clear, simplified intuitive explanations without esoteric math',
                  'Active recall drills and spaced repetition for fast retention',
                  'Concise topic summaries and memory mnemonics',
                  'Targeted exam-style practice questions',
                  'Daily revision checklists and rapid flash-quizzes'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyber-cyan mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits vs Tradeoffs */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  KEY ADVANTAGES:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fastest path to passing an upcoming exam, clearing an interview round, or grasping working vocabulary under tight deadlines.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  HONEST TRADEOFFS:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focuses less on foundational edge cases, proof derivations, or complex portfolio development. Knowledge may degrade faster without periodic review.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950/80 border border-white/5 text-xs text-slate-300">
                <span className="text-white font-bold font-display">Who should choose this:</span> Working professionals or students with limited daily hours (&lt;1 hr/day) or an urgent deadline within 30 days.
              </div>
            </div>

          </div>

          {/* Selection Action Button */}
          <div className="pt-6">
            <button
              onClick={() => handleSelect('smart')}
              disabled={pathway === 'smart'}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                pathway === 'smart'
                  ? 'bg-space-950 border border-cyber-cyan text-cyber-cyan cursor-default'
                  : 'bg-cyber-cyan hover:bg-white text-space-950 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              }`}
            >
              {pathway === 'smart' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Active Learning Strategy</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Switch to The Smart Route</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* PATH B: THE DEEP MASTERY ROUTE */}
        <div 
          className={`glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
            pathway === 'deep' 
              ? 'border-2 border-cyber-lime shadow-[0_0_35px_rgba(204,255,0,0.25)] bg-space-850/90' 
              : 'border border-white/10 hover:border-cyber-lime/40 bg-space-900/60'
          }`}
        >
          {pathway === 'deep' && (
            <div className="absolute -top-3.5 left-8 px-3 py-0.5 rounded-full bg-cyber-lime text-space-950 font-mono text-[10px] font-extrabold tracking-widest uppercase">
              CURRENTLY ACTIVE ROUTE
            </div>
          )}

          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyber-lime font-bold uppercase tracking-wider">
                  PATH B // DEEP MASTERY ROUTE
                </span>
                <span className="px-2 py-0.5 rounded bg-space-950 border border-cyber-lime/20 text-slate-300">
                  Label: &quot;Build an unfair advantage&quot;
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                First-Principles Rigor
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Demanding, comprehensive immersion designed to create durable conceptual mastery, problem-solving adaptability, real portfolio projects, and career readiness.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-space-950/70 border border-white/5 text-center">
              <div>
                <div className="text-[10px] font-mono text-slate-400">DAILY TIME</div>
                <div className="font-display font-bold text-sm text-cyber-lime">1.5–3+ hrs</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">COMPLETION</div>
                <div className="font-display font-bold text-sm text-white">4–8 Weeks</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">RETENTION</div>
                <div className="font-display font-bold text-sm text-cyber-cyan">Multi-Year</div>
              </div>
            </div>

            {/* Core Pedagogical Pillars */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                CORE PEDAGOGICAL PILLARS:
              </span>
              <ul className="space-y-2 text-xs text-slate-200">
                {[
                  'Deeper first-principles conceptual proofs and derivations',
                  'Challenging novel practice problems with hidden traps',
                  'Real-world implementation projects and architecture case studies',
                  'Teaching concepts back (Feynman Technique) to verify mental models',
                  'Full-length timed mock examinations with diagnostic error analysis',
                  'Transfer of knowledge to completely unfamiliar real-world problems'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyber-lime mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits vs Tradeoffs */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  KEY ADVANTAGES:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlocks intuitive problem-solving ability. You can diagnose unscripted production issues and tackle problems you have never seen before.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  HONEST TRADEOFFS:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Requires 2x to 3x more time and mental focus. Frustration is part of the process when grappling with novel open-ended challenges.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-space-950/80 border border-white/5 text-xs text-slate-300">
                <span className="text-white font-bold font-display">Who should choose this:</span> Ambitious builders targeting top 5% mastery, career pivots, thesis preparation, or senior technical leadership roles.
              </div>
            </div>

          </div>

          {/* Selection Action Button */}
          <div className="pt-6">
            <button
              onClick={() => handleSelect('deep')}
              disabled={pathway === 'deep'}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                pathway === 'deep'
                  ? 'bg-space-950 border border-cyber-lime text-cyber-lime cursor-default'
                  : 'bg-cyber-lime hover:bg-white text-space-950 shadow-[0_0_20px_rgba(204,255,0,0.3)]'
              }`}
            >
              {pathway === 'deep' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Active Learning Strategy</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Switch to Deep Mastery</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Honest Disclaimer Banner as required by prompt */}
      <div className="p-4 rounded-xl bg-space-900 border border-white/10 text-center max-w-2xl mx-auto">
        <p className="text-xs font-mono text-slate-400">
          ⚠️ <strong>Honest Disclosure</strong>: Neither pathway promises or guarantees a specific exam score, job offer, or salary outcome. They are designed to scientifically maximize retention and cognitive capability.
        </p>
      </div>

      {/* Action Next Step */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => onNavigate('roadmap')}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-lime text-space-950 font-display font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <span>Continue to Customized Study Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
