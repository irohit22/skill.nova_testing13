import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  MapPin, 
  FileCheck2, 
  MessageSquareCode, 
  Radio, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Play, 
  Pause,
  Flame, 
  ShieldCheck, 
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Activity,
  Layers
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TodayActivityChart } from '../components/TodayActivityChart';
import { soundFX } from '../utils/audio';

interface MissionDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MissionDashboard: React.FC<MissionDashboardProps> = ({ onNavigate }) => {
  const { 
    activeMission, 
    pathway, 
    roadmap, 
    toggleTaskCompletion, 
    gamification,
    todayStudyMinutes,
    todayGoalMinutes,
    isTimerRunning,
    startFocusTimer,
    pauseFocusTimer,
    currentMotivationalQuote
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'activity'>('curriculum');

  if (!activeMission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Target className="w-12 h-12 text-luxury-azure mx-auto" />
        <h2 className="font-display font-bold text-2xl text-white">No Active Mission</h2>
        <p className="text-sm text-slate-400">Configure your learning mission to activate your personalized executive plan.</p>
        <button
          onClick={() => onNavigate('onboarding')}
          className="px-8 py-3 rounded-full bg-white text-space-950 font-display font-bold text-sm shadow-md"
        >
          Configure Mission
        </button>
      </div>
    );
  }

  const tasks = roadmap?.tasks || [];
  const completedTasks = tasks.filter(t => t.completed);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  const nextTask = tasks.find(t => !t.completed) || tasks[0];

  const handleStartNextSession = () => {
    soundFX.click();
    onNavigate('companion');
  };

  const analysis = activeMission?.analysis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Mission Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-0.5 rounded-full bg-space-900 border border-white/10 text-[10px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
              ACTIVE MISSION
            </span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
              pathway === 'deep' 
                ? 'bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-goldLight' 
                : 'bg-luxury-azure/15 border border-luxury-azure/30 text-luxury-azure'
            }`}>
              {pathway === 'deep' ? 'Path B: Deep Mastery' : 'Path A: The Smart Route'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Target: <span className="text-white">{activeMission.targetScore}</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
            {activeMission.topic}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Self-assessed baseline: <span className="text-slate-200 capitalize">{activeMission.currentLevel}</span> • Target deadline: <span className="text-luxury-goldLight">{activeMission.deadline}</span>
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-4 py-2 rounded-full bg-space-900 hover:bg-space-850 border border-white/10 text-xs font-display text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>View Full Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onNavigate('mock-test')}
            className="px-5 py-2 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diagnostic Quiz</span>
          </button>
        </div>
      </div>

      {/* Recommended Next Move Banner */}
      {nextTask && (
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-luxury-gold/25 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-luxury-goldLight uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
              <span>RECOMMENDED NEXT MOVE</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Day {nextTask.dayNumber} Session</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-white">
              {nextTask.title}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {nextTask.description}
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-luxury-azure" />
                ~{nextTask.estimatedMinutes} mins
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-space-950 border border-white/10 text-slate-200">
                {nextTask.category}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartNextSession}
            className="px-7 py-3.5 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center justify-center gap-2 whitespace-nowrap shadow-md transition-all group"
          >
            <Play className="w-3.5 h-3.5 fill-space-950 group-hover:scale-105 transition-transform" />
            <span>Start Guided Session</span>
          </button>
        </div>
      )}

      {/* 4 Clean Luxury Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>CURRICULUM PROGRESS</span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {completedTasks.length} <span className="text-xs font-normal text-slate-400">/ {tasks.length} tasks</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-space-950 rounded-full overflow-hidden border border-white/[0.06]">
            <div 
              className="h-full bg-gradient-to-r from-luxury-azure to-luxury-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>VERIFIED SCORE</span>
            <span className="text-luxury-gold font-bold">
              {activeMission.verifiedScore ? `${activeMission.verifiedScore}%` : 'PENDING'}
            </span>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {activeMission.verifiedScore ? `${activeMission.verifiedScore}%` : '--'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            {activeMission.verifiedScore ? `Certified ${activeMission.verifiedLevel}` : 'Take diagnostic test to certify'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>STUDY STREAK</span>
            <span className="text-luxury-gold flex items-center gap-1 font-bold">
              <Flame className="w-3.5 h-3.5 fill-luxury-gold" />
              {gamification.streakDays} DAYS
            </span>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {gamification.streakDays} <span className="text-xs font-normal text-slate-400">consecutive days</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            +60 XP per task completed
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>COGNITIVE RANK</span>
            <span className="text-white font-bold">LVL {gamification.level}</span>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {gamification.xp} <span className="text-xs font-mono text-slate-400">XP</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            {gamification.levelTitle}
          </div>
        </div>

      </div>

      {/* Tab Switcher: Curriculum vs Today's Activity & Charts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-space-900/60 border border-white/[0.08]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-space-950 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setActiveTab('curriculum'); soundFX.click(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-display font-medium transition-all ${
              activeTab === 'curriculum'
                ? 'bg-space-850 text-white shadow-sm border border-white/10 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-luxury-azure" />
            <span>Curriculum & Tasks</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('activity'); soundFX.click(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-display font-medium transition-all ${
              activeTab === 'activity'
                ? 'bg-space-850 text-white shadow-sm border border-white/10 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Today&apos;s Activity &amp; Time Tracking</span>
          </button>
        </div>

        {/* Quick Study Tracker Preview */}
        <div className="flex items-center gap-3 px-3 py-1.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">TODAY:</span>
            <span className="text-luxury-gold font-bold">{todayStudyMinutes}m</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">{todayGoalMinutes}m</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isTimerRunning) {
                pauseFocusTimer();
              } else {
                startFocusTimer();
              }
              soundFX.click();
            }}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
              isTimerRunning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-luxury-gold/15 border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold/25'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Timer Active</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-luxury-gold" />
                <span>Quick Focus Timer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conditionally Render Activity Chart Tab OR Curriculum Tab */}
      {activeTab === 'activity' ? (
        <TodayActivityChart />
      ) : (
        /* Main Split: Today's Tasks + Integrated Cognitive Gap Summary */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Study Tasks Checklist */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-azure font-bold">
                DAILY STUDY SPRINT
              </span>
              <h2 className="font-display font-bold text-xl text-white mt-1">
                Active Learning Checklist
              </h2>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  task.completed
                    ? 'bg-space-950/40 border-white/5 opacity-60'
                    : 'bg-space-950/80 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-0.5 text-slate-500 hover:text-white transition-colors flex-shrink-0"
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-sm text-white">
                      {task.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      task.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-space-900 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Day {task.dayNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  ~{task.estimatedMinutes}m
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Integrated Knowledge Gap & Socratic Snapshot */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Knowledge Snapshot Card */}
          {analysis && (
            <div className="glass-panel p-6 rounded-2xl border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
                  DIAGNOSTIC SNAPSHOT
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {analysis.confidenceRating}% Confidence
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Key Blind Spots to Conquer:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.knowledgeGaps.slice(0, 2).map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Known Strengths:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.knownConcepts.slice(0, 2).map((known, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <span>{known}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Socratic AI Companion Launcher */}
          <div 
            onClick={() => onNavigate('companion')}
            className="glass-panel p-6 rounded-2xl border-white/[0.08] hover:border-luxury-gold/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-space-850 border border-white/10 flex items-center justify-center text-luxury-gold">
                <MessageSquareCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">AI TUTOR ON DEMAND</span>
            </div>
            <div className="font-display font-bold text-base text-white group-hover:text-luxury-goldLight transition-colors">
              Socratic Study Companion
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ask questions, request intuitive analogies, or practice active recall drills.
            </p>
          </div>

        </div>

      </div>
      )}

    </div>
  );
};
