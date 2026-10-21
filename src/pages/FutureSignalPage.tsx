import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Cpu, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  FolderGit2,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { FutureSignal } from '../types';
import { api } from '../services/api';
import { soundFX } from '../utils/audio';

interface FutureSignalPageProps {
  onNavigate: (page: string) => void;
}

export const FutureSignalPage: React.FC<FutureSignalPageProps> = ({ onNavigate }) => {
  const { activeMission } = useLearning();
  const topic = activeMission?.topic || 'Generative AI & LLM Systems';

  const [futureData, setFutureData] = useState<FutureSignal | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  useEffect(() => {
    api.getFutureSignal(topic, activeMission?.currentLevel || 'beginner').then(data => {
      setFutureData(data);
    });
  }, [topic, activeMission]);

  if (!futureData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Radio className="w-12 h-12 text-cyber-cyan animate-pulse mx-auto" />
        <h2 className="font-display font-bold text-xl text-white">Scanning Future Signals...</h2>
      </div>
    );
  }

  const { careerRoles, realWorldApplications, aiImpactAnalysis, complementarySkills, portfolioProjects, careerMilestones } = futureData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-luxury-gold/30 text-luxury-goldLight text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-luxury-gold" />
            <span>THE FUTURE SIGNAL // EXECUTIVE HORIZON</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Future of Work Intelligence
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Connecting what you are learning in <span className="text-white font-semibold">{topic}</span> to structural industry shifts, AI automation dynamics, and high-leverage career opportunities.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-space-900 border border-white/10 text-xs font-mono text-slate-400">
          <span className="text-luxury-emerald font-bold">SIGNAL FIDELITY:</span> High Precision
        </div>
      </div>

      {/* AI Disruption Radar: What AI Automates vs Human Superpowers */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border-cyber-cyan/30 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
            AUTOMATION RESILIENCE MATRIX
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            How AI Transforms Work in {topic}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Don&apos;t compete with automated scripts. Lean heavily into the human superpowers that machines cannot replicate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: What AI is Automating */}
          <div className="p-6 rounded-xl bg-space-950/80 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-base">
              <Cpu className="w-5 h-5" />
              <span>What AI Automates Rapidly</span>
            </div>
            <p className="text-xs text-slate-400">
              Commoditized tasks where speed exceeds accuracy requirements:
            </p>
            <ul className="space-y-2.5">
              {aiImpactAnalysis.automatedAspects.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Irreplaceable Human Superpowers */}
          <div className="p-6 rounded-xl bg-space-950/80 border border-cyber-lime/40 space-y-4 shadow-[0_0_20px_rgba(204,255,0,0.08)]">
            <div className="flex items-center gap-2 text-cyber-lime font-display font-bold text-base">
              <Sparkles className="w-5 h-5" />
              <span>Irreplaceable Human Superpowers</span>
            </div>
            <p className="text-xs text-slate-400">
              High-stakes decision points requiring ethical oversight, taste, and empathy:
            </p>
            <ul className="space-y-2.5">
              {aiImpactAnalysis.humanSuperpowers.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-lime mt-1.5 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Interactive "Imagine Your Future" Career Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-orange font-bold">
            CAREER TRAJECTORY SIMULATOR
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            Imagine Your Future Career Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click through progressive milestone tiers to preview how mastering {topic} elevates your project scope and organizational impact.
          </p>
        </div>

        {/* Milestone Steps Bar */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {careerMilestones.map((m, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedMilestone(idx);
                soundFX.click();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                selectedMilestone === idx
                  ? 'bg-space-850 border border-cyber-orange text-cyber-orange font-bold shadow-[0_0_15px_rgba(255,107,53,0.3)]'
                  : 'bg-space-900 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{m.level}</span>
              <span className="text-[10px] text-slate-500">({m.timeline})</span>
            </button>
          ))}
        </div>

        {/* Active Milestone Card */}
        {careerMilestones[selectedMilestone] && (
          <motion.div
            key={selectedMilestone}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-space-950 border border-white/10 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-mono text-cyber-lime uppercase font-bold">
                  {careerMilestones[selectedMilestone].timeline} SPRINT
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  {careerMilestones[selectedMilestone].level}
                </h3>
              </div>
              <span className="px-3 py-1 rounded bg-space-900 border border-white/10 text-xs font-mono text-slate-300">
                Capability Tier {selectedMilestone + 1} of {careerMilestones.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-space-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Demonstrated Capability:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {careerMilestones[selectedMilestone].capability}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-space-900/60 border border-cyber-cyan/20">
                <span className="text-[10px] font-mono text-cyber-cyan uppercase block mb-1">Signature Deliverable:</span>
                <p className="text-xs sm:text-sm text-white font-medium">
                  {careerMilestones[selectedMilestone].signatureProject}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Career Roles & Verified Salary Ranges */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
            INDUSTRY COMPENSATION & DEMAND
          </span>
          <h2 className="font-display font-bold text-xl text-white">
            High-Impact Roles Linked to This Domain
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compensation ranges reflect senior market data from verified engineering indices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {careerRoles.map((role, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-space-950 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyber-cyan font-bold">
                  {role.salaryRange}
                </span>
                <h3 className="font-display font-bold text-lg text-white mt-1">
                  {role.title}
                </h3>
                <div className="text-xs font-mono text-cyber-lime mt-1">
                  {role.demandTrend}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-white/5">
                Source: {role.sourceNote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Leverage Complementary Skills */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-lime font-bold">
            SKILL SYNERGY RADAR
          </span>
          <h2 className="font-display font-bold text-xl text-white">
            High-Leverage Complementary Skills to Pair Next
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pairing skills creates rare, defensible capability combinations that 10x your problem-solving impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {complementarySkills.map((c, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-space-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyber-lime font-bold">
                  {c.synergyRating}% SYNERGY
                </span>
                <span className="w-2 h-2 rounded-full bg-cyber-lime" />
              </div>

              <h3 className="font-display font-bold text-base text-white">
                {c.skill}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {c.whyPair}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Portfolio Projects */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyber-cyan/30 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
            PROOF OF WORK
          </span>
          <h2 className="font-display font-bold text-xl text-white">
            Distinguished Portfolio Capstones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Don&apos;t just claim skills on a resume. Build verifiable, open-source projects that prove competency.
          </p>
        </div>

        <div className="space-y-4">
          {portfolioProjects.map((p, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-space-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-[10px] font-mono text-cyber-cyan uppercase font-bold">
                  {p.difficulty} CAPSTONE
                </span>
                <FolderGit2 className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="font-display font-bold text-lg text-white">
                {p.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {p.brief}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Key Deliverables:</span>
                <div className="flex flex-wrap gap-2">
                  {p.deliverables.map((d, dIdx) => (
                    <span key={dIdx} className="px-2.5 py-1 rounded-md bg-space-900 border border-white/10 text-xs font-mono text-slate-200">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Credibility Note */}
      <div className="p-4 rounded-xl bg-space-900 border border-white/10 text-center max-w-2xl mx-auto">
        <p className="text-xs font-mono text-slate-400">
          🔍 <strong>Credibility Transparency</strong>: Market data references industry hiring indices (WEF Future of Jobs, Levels.fyi aggregate, Tech Talent Index 2026). Forecasts represent structural trends, not guarantees of employment.
        </p>
      </div>

    </div>
  );
};
