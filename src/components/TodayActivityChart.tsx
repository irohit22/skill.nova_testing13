import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Flame, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Code, 
  FileCheck2, 
  Bot, 
  FileText,
  Target,
  RefreshCw,
  Plus,
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useLearning } from '../context/LearningContext';
import { soundFX } from '../utils/audio';

export const TodayActivityChart: React.FC = () => {
  const {
    todayStudyMinutes,
    todayGoalMinutes,
    setTodayGoalMinutes,
    todayActivityLog,
    isTimerRunning,
    timerSeconds,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    saveTimerSession,
    currentMotivationalQuote,
    rotateMotivationalQuote,
    activeMission
  } = useLearning();

  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionCategory, setSessionCategory] = useState<'Theory' | 'Practice' | 'Mock Test' | 'AI Studio' | 'Notes'>('Practice');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualCat, setManualCat] = useState<'Theory' | 'Practice' | 'Mock Test' | 'AI Studio' | 'Notes'>('Theory');

  const goalPercent = Math.min(100, Math.round((todayStudyMinutes / todayGoalMinutes) * 100));

  // Format timer seconds into MM:SS or HH:MM:SS
  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Prepare chart data from activity log
  const chartData = [...todayActivityLog].reverse().map((entry, idx) => ({
    time: entry.timestamp || `Slot ${idx + 1}`,
    minutes: entry.durationMinutes,
    title: entry.title.length > 20 ? entry.title.substring(0, 18) + '...' : entry.title,
    category: entry.category
  }));

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    saveTimerSession(manualTitle, manualCat);
    setManualTitle('');
    setShowManualAdd(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Theory': return BookOpen;
      case 'Practice': return Code;
      case 'Mock Test': return FileCheck2;
      case 'AI Studio': return Bot;
      case 'Notes': return FileText;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Motivational Line Banner with Luxury Gold Accents */}
      <div className="relative p-6 sm:p-7 rounded-2xl glass-panel-glow border border-luxury-gold/30 shadow-luxury overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              <span>EXECUTIVE MOTIVATION & MINDSET</span>
            </div>
            <p className="font-display font-medium text-base sm:text-lg text-white leading-relaxed italic max-w-3xl">
              &ldquo;{currentMotivationalQuote}&rdquo;
            </p>
          </div>

          <button
            onClick={rotateMotivationalQuote}
            className="px-4 py-2 rounded-full bg-space-900/80 hover:bg-space-850 border border-white/10 hover:border-luxury-gold/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-center whitespace-nowrap"
            title="Next inspirational line"
          >
            <RefreshCw className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Next Insight</span>
          </button>
        </div>
      </div>

      {/* 2. Today's Study Analytics Header & Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Time Studied Card */}
        <div className="glass-panel p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TODAY&apos;S TIME STUDIED</span>
            <span className="text-luxury-gold font-bold">{goalPercent}% OF GOAL</span>
          </div>

          <div className="my-3">
            <div className="font-display font-bold text-4xl text-white flex items-baseline gap-2">
              <span>{Math.floor(todayStudyMinutes / 60)}h {todayStudyMinutes % 60}m</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target Goal: {Math.floor(todayGoalMinutes / 60)}h {todayGoalMinutes % 60}m daily
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-space-950 rounded-full overflow-hidden border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-luxury-azure via-white to-luxury-gold rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sessions Completed Today */}
        <div className="glass-panel p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SESSIONS LOGGED</span>
            <span className="text-luxury-azure font-bold">{todayActivityLog.length} SESSIONS</span>
          </div>

          <div className="my-3">
            <div className="font-display font-bold text-4xl text-white">
              {todayActivityLog.length} <span className="text-xs font-normal text-slate-400">deep sessions</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Across theory, tests, practice & notes
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-luxury-azure" />
            <span>Avg: {todayActivityLog.length > 0 ? Math.round(todayStudyMinutes / todayActivityLog.length) : 0} mins / session</span>
          </div>
        </div>

        {/* Live Focus Session Stopwatch Card */}
        <div className="glass-panel-glow p-6 rounded-2xl border-luxury-gold/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-luxury-goldLight font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-luxury-gold animate-ping' : 'bg-slate-500'}`} />
              LIVE FOCUS TIMER
            </span>
            <span className="text-[11px] text-slate-400">Stopwatch</span>
          </div>

          {/* Large Digital Clock Face */}
          <div className="my-2 text-center">
            <div className="font-mono font-bold text-4xl sm:text-5xl text-white tracking-widest">
              {formatTimer(timerSeconds)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {!isTimerRunning ? (
              <button
                onClick={startFocusTimer}
                className="px-5 py-2 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-space-950" />
                <span>Start Focus</span>
              </button>
            ) : (
              <button
                onClick={pauseFocusTimer}
                className="px-5 py-2 rounded-full bg-space-900 border border-luxury-gold text-luxury-gold hover:bg-space-850 font-display font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}

            {timerSeconds > 0 && (
              <>
                <button
                  onClick={() => saveTimerSession(sessionTopic || `${activeMission?.topic || 'Focus'} Study Sprint`, sessionCategory)}
                  className="px-4 py-2 rounded-full bg-luxury-emerald/20 hover:bg-luxury-emerald/30 border border-luxury-emerald/40 text-luxury-emerald font-display font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Log and save this session to today's timeline"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Log Time</span>
                </button>

                <button
                  onClick={resetFocusTimer}
                  className="p-2 rounded-full bg-space-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* 3. Hourly Activity Area Chart (Visual Timeline) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-azure font-bold">
              STUDY DENSITY OVER TIME
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-0.5">
              Today&apos;s Focus Curve & Minutes Logged
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Set Daily Target:</span>
            {[60, 90, 120, 180].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setTodayGoalMinutes(mins);
                  soundFX.click();
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                  todayGoalMinutes === mins
                    ? 'bg-luxury-azure text-space-950 font-bold'
                    : 'bg-space-900 text-slate-400 hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-60 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b0d13', borderColor: 'rgba(212,175,55,0.3)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#f3db9d' }}
                  formatter={(val: any) => [`${val} minutes studied`, 'Duration']}
                  labelFormatter={(lbl: any, payload: any) => {
                    const item = payload?.[0]?.payload;
                    return item ? `${item.time} — ${item.title}` : lbl;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#d4af37" 
                  strokeWidth={2.5} 
                  fill="url(#activityGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
              No study sessions logged today yet. Start the Focus Timer or check off study tasks!
            </div>
          )}
        </div>
      </div>

      {/* 4. "What I Do In What Time" — Chronological Hourly Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
              HOURLY BREAKDOWN
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-0.5">
              What I Did In What Time Today
            </h3>
          </div>

          <button
            onClick={() => setShowManualAdd(!showManualAdd)}
            className="px-3.5 py-1.5 rounded-full bg-space-900 hover:bg-space-850 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Log Past Session</span>
          </button>
        </div>

        {/* Manual Log Drawer if toggled */}
        <AnimatePresence>
          {showManualAdd && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleManualAdd}
              className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Session Title (e.g. Code Review on RAG Pipeline)"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-space-900 border border-white/10 text-white text-xs font-display focus:outline-none focus:border-luxury-gold sm:col-span-1"
                />
                <input
                  type="number"
                  min="5"
                  max="300"
                  placeholder="Minutes (e.g. 45)"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number(e.target.value))}
                  className="px-3.5 py-2 rounded-xl bg-space-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={manualCat}
                  onChange={(e: any) => setManualCat(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-space-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-luxury-gold"
                >
                  <option value="Theory">Theory</option>
                  <option value="Practice">Practice</option>
                  <option value="Mock Test">Mock Test</option>
                  <option value="AI Studio">AI Studio</option>
                  <option value="Notes">Notes</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualAdd(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-white text-space-950 font-display font-bold text-xs"
                >
                  Save to Log
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
          {todayActivityLog.map((entry) => {
            const Icon = getCategoryIcon(entry.category);
            return (
              <div key={entry.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-space-950 border-2 border-luxury-gold group-hover:scale-125 transition-transform" />

                <div className="p-4 sm:p-5 rounded-xl bg-space-950/70 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-luxury-goldLight font-bold">
                        {entry.timeSlot}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 rounded-full bg-space-900 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Icon className="w-3 h-3 text-luxury-azure" />
                        {entry.category}
                      </span>
                    </div>

                    <h4 className="font-display font-semibold text-sm sm:text-base text-white">
                      {entry.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="px-3 py-1 rounded-full bg-space-900 border border-white/10 text-xs font-mono text-slate-200">
                      {entry.durationMinutes} mins
                    </span>
                    <span className="text-luxury-emerald text-xs font-mono">
                      +{Math.round(entry.durationMinutes * 1.5)} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
