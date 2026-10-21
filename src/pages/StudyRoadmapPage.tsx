import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Code, 
  Zap, 
  Check,
  FolderGit2,
  FileCheck2
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { StudyTask, PathwayType } from '../types';
import { soundFX } from '../utils/audio';

interface StudyRoadmapPageProps {
  onNavigate: (page: string) => void;
}

export const StudyRoadmapPage: React.FC<StudyRoadmapPageProps> = ({ onNavigate }) => {
  const { 
    roadmap, 
    toggleTaskCompletion, 
    addTask, 
    activeMission, 
    pathway,
    setPathway 
  } = useLearning();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<'Theory' | 'Practice' | 'Project' | 'Active Recall' | 'Mock Test'>('Practice');
  const [newMin, setNewMin] = useState(45);
  const [newPri, setNewPri] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');

  const tasks = roadmap?.tasks || [];
  const milestones = roadmap?.weeklyMilestones || [];

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'pending' && t.completed) return false;
    if (activeFilter === 'completed' && !t.completed) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const remainingMinutes = tasks.filter(t => !t.completed).reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  const remainingHours = (remainingMinutes / 60).toFixed(1);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      description: newDesc || 'Custom self-directed study task.',
      category: newCat,
      estimatedMinutes: Number(newMin),
      priority: newPri
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-white/10 text-slate-300 text-xs font-mono mb-2">
            <MapPin className="w-3.5 h-3.5 text-luxury-azure" />
            <span>AI CURRICULUM // DYNAMIC ROADMAP</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Personalized Study Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Focus: <span className="text-white font-medium">{activeMission?.topic}</span> • Daily allocation: <span className="text-luxury-goldLight">{activeMission?.dailyTime}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-space-900 hover:bg-space-850 border border-white/10 text-xs font-display text-white transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-luxury-azure" />
            <span>Add Custom Task</span>
          </button>

          <button
            onClick={() => onNavigate('mock-test')}
            className="px-5 py-2 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diagnostic Quiz</span>
          </button>
        </div>
      </div>

      {/* Integrated Strategy Selector (Smart Route vs Deep Mastery) */}
      <div className="p-6 rounded-2xl glass-panel border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
            STRATEGIC LEARNING PATHWAY
          </span>
          <span className="text-xs text-slate-400">
            Switching recalculates curriculum milestones and daily depth.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Path A */}
          <div 
            onClick={() => setPathway('smart')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
              pathway === 'smart' 
                ? 'bg-space-850 border-luxury-azure shadow-[0_0_15px_rgba(56,189,248,0.15)] text-white' 
                : 'bg-space-900/60 border-white/[0.08] text-slate-400 hover:border-white/20'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono text-luxury-azure uppercase font-bold">Path A: The Smart Route</div>
              <div className="font-display font-bold text-sm text-white mt-0.5">High-Yield Efficiency</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Prioritizes 80/20 high-frequency exam concepts, spaced repetition drills, and structured summaries.
              </p>
            </div>
            {pathway === 'smart' && <Check className="w-4 h-4 text-luxury-azure flex-shrink-0 mt-1" />}
          </div>

          {/* Path B */}
          <div 
            onClick={() => setPathway('deep')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
              pathway === 'deep' 
                ? 'bg-space-850 border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white' 
                : 'bg-space-900/60 border-white/[0.08] text-slate-400 hover:border-white/20'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono text-luxury-gold uppercase font-bold">Path B: Deep Mastery</div>
              <div className="font-display font-bold text-sm text-white mt-0.5">First-Principles Rigor</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Demanding approach with edge cases, architecture proofs, real-world projects, and Feynman teaching.
              </p>
            </div>
            {pathway === 'deep' && <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-1" />}
          </div>

        </div>
      </div>

      {/* Progress Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-white/[0.08]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">COMPLETION</div>
          <div className="font-display font-bold text-2xl text-white mt-1">{progressPercent}%</div>
          <div className="text-xs text-slate-400">{completedCount} of {tasks.length} tasks</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/[0.08]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">REMAINING TIME</div>
          <div className="font-display font-bold text-2xl text-luxury-azure mt-1">{remainingHours} hrs</div>
          <div className="text-xs text-slate-400">across pending sessions</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/[0.08]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">MILESTONES</div>
          <div className="font-display font-bold text-2xl text-luxury-gold mt-1">{milestones.length} Checkpoints</div>
          <div className="text-xs text-slate-400">Weekly deliverables</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/[0.08]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">XP VALUE</div>
          <div className="font-display font-bold text-2xl text-luxury-emerald mt-1">+60 XP</div>
          <div className="text-xs text-slate-400">per completed study task</div>
        </div>
      </div>

      {/* Weekly Checkpoints */}
      <div className="glass-panel p-6 rounded-2xl border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
            WEEKLY PROGRESS CHECKPOINTS
          </span>
          <span className="text-xs font-mono text-slate-400">
            {milestones.length} Sprints
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div key={m.week} className="p-4 rounded-xl bg-space-950/70 border border-white/[0.08] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-luxury-gold font-bold">WEEK {m.week}</span>
                <span className="text-slate-500">{m.completed ? 'COMPLETED' : 'IN PROGRESS'}</span>
              </div>
              <div className="font-display font-semibold text-sm text-white">
                {m.title}
              </div>
              <p className="text-xs text-slate-400">
                {m.goalDescription}
              </p>
              {m.projectDeliverable && (
                <div className="text-[11px] font-mono text-luxury-azure pt-1 border-t border-white/[0.06]">
                  {m.projectDeliverable}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar & Task Checklist */}
      <div className="space-y-4">
        
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-space-900/60 p-3 rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            {(['all', 'pending', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  soundFX.click();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase transition-colors ${
                  activeFilter === filter
                    ? 'bg-white text-space-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-space-850'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-space-950 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-luxury-gold"
            >
              <option value="all">All Categories</option>
              <option value="Theory">Theory & Concepts</option>
              <option value="Practice">Practice Problems</option>
              <option value="Active Recall">Active Recall</option>
              <option value="Mock Test">Mock Tests</option>
              <option value="Project">Projects</option>
            </select>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filteredTasks.map((task: StudyTask) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-4 ${
                task.completed
                  ? 'bg-space-950/40 border-white/5 opacity-60'
                  : 'bg-space-950/80 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTaskCompletion(task.id)}
                className="mt-1 text-slate-500 hover:text-white transition-colors flex-shrink-0"
                aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
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
                  <span className="text-[11px] font-mono text-slate-400">
                    {task.category} • Day {task.dayNumber}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {task.description}
                </p>

                {task.completed && task.completedAt && (
                  <div className="text-[10px] font-mono text-luxury-gold pt-0.5">
                    Completed on {new Date(task.completedAt).toLocaleDateString()} (+60 XP awarded)
                  </div>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400 whitespace-nowrap bg-space-900 px-3 py-1.5 rounded-lg border border-white/5">
                ~{task.estimatedMinutes}m
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-lg w-full p-6 sm:p-8 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">
              Add Custom Study Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Transformer Self-Attention from Scratch"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-white/10 text-white text-xs font-display focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Objective Description:
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specify what you want to achieve..."
                  className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-white/10 text-white text-xs font-body focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Category:</label>
                  <select
                    value={newCat}
                    onChange={(e: any) => setNewCat(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-space-950 border border-white/10 text-xs text-white"
                  >
                    <option value="Practice">Practice</option>
                    <option value="Theory">Theory</option>
                    <option value="Active Recall">Active Recall</option>
                    <option value="Project">Project</option>
                    <option value="Mock Test">Mock Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Minutes:</label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-space-950 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Priority:</label>
                  <select
                    value={newPri}
                    onChange={(e: any) => setNewPri(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-space-950 border border-white/10 text-xs text-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-space-900 border border-white/10 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-white text-space-950 font-display font-bold text-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
