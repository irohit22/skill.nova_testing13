import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Clock, 
  ArrowRight,
  Trophy,
  Star,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLearning } from '../context/LearningContext';
import { soundFX } from '../utils/audio';

interface AchievementsPageProps {
  onNavigate: (page: string) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ onNavigate }) => {
  const { gamification, activeMission, roadmap } = useLearning();

  const nextLevelXP = gamification.level * 300;
  const currentLevelBaseXP = (gamification.level - 1) * 300;
  const xpInCurrentLevel = gamification.xp - currentLevelBaseXP;
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  const radarData = Object.entries(gamification.topicMastery).map(([subject, val]) => ({
    subject,
    mastery: val,
    fullMark: 100
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-luxury-gold/30 text-luxury-goldLight text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5 text-luxury-gold" />
            <span>EXECUTIVE MASTERY & TELEMETRY</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Achievements & Progress History
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Transparent XP tracking and mastery milestones earned through verified learning actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-space-900 border border-luxury-gold/30 flex items-center gap-2 text-luxury-goldLight font-mono text-xs">
            <Flame className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
            <span>{gamification.streakDays} DAY STREAK</span>
          </div>
        </div>
      </div>

      {/* Level & XP Hero Card */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border-luxury-gold/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-luxury-gold uppercase font-bold tracking-wider">
              CURRENT COGNITIVE RANK
            </span>
            <h2 className="font-display font-bold text-3xl text-white flex items-center gap-3">
              <span>Level {gamification.level}:</span>
              <span className="text-luxury-azure">{gamification.levelTitle}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Total earned: <strong className="text-white">{gamification.xp} XP</strong> across tasks and diagnostic quizzes.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">XP TO NEXT LEVEL</span>
              <span className="font-display font-bold text-lg text-white">
                {Math.max(0, nextLevelXP - gamification.xp)} XP needed
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-space-850 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold font-display font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              {gamification.level}
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Progress to Level {gamification.level + 1}</span>
            <span className="text-luxury-goldLight font-bold">{levelProgress}%</span>
          </div>
          <div className="h-2 w-full bg-space-950 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-aqua to-cyber-lime rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
            COGNITIVE BADGES
          </span>
          <h2 className="font-display font-bold text-xl text-white mt-1">
            Earned Accolades
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Badges are unlocked through verified study discipline, testing speed, and diagnostic accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamification.badges.map((b) => {
            const isUnlocked = !!b.unlockedAt;
            return (
              <div 
                key={b.id}
                className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-space-950/90 border-cyber-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'bg-space-950/40 border-white/5 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isUnlocked ? 'bg-space-900 border border-cyber-cyan/40' : 'bg-space-900/40 border border-white/5'
                }`}>
                  {b.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-white">
                      {b.name}
                    </h3>
                    {isUnlocked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-lime" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {b.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    {isUnlocked ? `Unlocked: ${new Date(b.unlockedAt!).toLocaleDateString()}` : 'Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery Radar & Learning History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Topic Mastery Radar */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-bold">
              KNOWLEDGE CONSTELLATION
            </span>
            <span className="text-xs font-mono text-slate-400">Mastery Index</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2f59" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#334155" fontSize={10} />
                  <Radar name="Mastery" dataKey="mastery" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs font-mono text-slate-400 text-center">
                Complete mock tests to populate topic mastery radar.
              </div>
            )}
          </div>
        </div>

        {/* Milestone Activity Timeline */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber-lime font-bold">
                ACTIVITY TELEMETRY
              </span>
              <Activity className="w-4 h-4 text-cyber-lime" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Recent Verifiable Accomplishments
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-space-950 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyber-lime" />
                  <span className="text-slate-200">Study Tasks Completed</span>
                </div>
                <span className="font-mono text-white font-bold">{gamification.completedTasksCount} Tasks</span>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-slate-200">Mock Examinations Passed</span>
                </div>
                <span className="font-mono text-white font-bold">{gamification.completedTestsCount} Tests</span>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-cyber-orange" />
                  <span className="text-slate-200">Daily Study Streak</span>
                </div>
                <span className="font-mono text-white font-bold">{gamification.streakDays} Consecutive Days</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3 rounded-xl bg-space-900 hover:bg-space-850 border border-cyber-cyan/30 text-cyber-cyan font-display font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <span>Back to Mission Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
