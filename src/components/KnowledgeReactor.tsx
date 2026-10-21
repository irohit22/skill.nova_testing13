import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFX } from '../utils/audio';

interface NodeInfo {
  id: string;
  name: string;
  category: string;
  metric: string;
  description: string;
  color: string;
  angle: number;
  distance: number;
}

const NODES: NodeInfo[] = [
  { id: 'n1', name: 'Attention Mechanics', category: 'Deep Architecture', metric: '99.4% Verified', description: 'Dynamic focus weighting across semantic embeddings.', color: '#38bdf8', angle: 0, distance: 155 },
  { id: 'n2', name: 'Vector Space Geometry', category: 'High-D Representation', metric: '97.2% Precision', description: 'Geometric proximity clustering of concepts.', color: '#d4af37', angle: (2 * Math.PI / 5), distance: 165 },
  { id: 'n3', name: 'Active Recall Matrix', category: 'Cognitive Science', metric: '3.8x Retention', description: 'Spaced retrieval practice strengthening memory traces.', color: '#ffffff', angle: (4 * Math.PI / 5), distance: 150 },
  { id: 'n4', name: 'Idempotent Systems', category: 'Resilient Design', metric: 'Zero Drift', description: 'Deterministic state transitions under arbitrary failure.', color: '#f59e0b', angle: (6 * Math.PI / 5), distance: 170 },
  { id: 'n5', name: 'The Future Signal', category: 'Strategic Horizon', metric: '+34% Demand', description: 'High-leverage skills unbundled from AI automation.', color: '#10b981', angle: (8 * Math.PI / 5), distance: 160 },
];

export const KnowledgeReactor: React.FC<{ onNodeSelect?: (nodeName: string) => void }> = ({ onNodeSelect }) => {
  const [activeNode, setActiveNode] = useState<NodeInfo | null>(NODES[0]);
  const [rotation, setRotation] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotation(prev => (prev + 0.0015) % (2 * Math.PI));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.03;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.03;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none"
      role="region"
      aria-label="Knowledge Reactor Visualization"
    >
      {/* Soft Luxury Diffused Ambient Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-luxury-gold/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* SVG Orbital Chronometer Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-240 -240 480 480">
        {/* Subtle, Hairline Orbital Rings */}
        <circle cx="0" cy="0" r="195" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 6" />
        <circle cx="0" cy="0" r="160" fill="none" stroke="rgba(212, 175, 55, 0.12)" />
        <circle cx="0" cy="0" r="115" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="1 4" />

        {/* Dynamic Fine Connecting Lines */}
        {NODES.map((node) => {
          const currentAngle = node.angle + rotation;
          const nx = Math.cos(currentAngle) * node.distance + mousePos.x;
          const ny = Math.sin(currentAngle) * node.distance + mousePos.y;
          const isSelected = activeNode?.id === node.id;

          return (
            <line
              key={`line-${node.id}`}
              x1="0"
              y1="0"
              x2={nx}
              y2={ny}
              stroke={isSelected ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.07)'}
              strokeWidth={isSelected ? 1.5 : 0.8}
            />
          );
        })}
      </svg>

      {/* Floating Knowledge Nodes */}
      {NODES.map((node) => {
        const currentAngle = node.angle + rotation;
        const nx = Math.cos(currentAngle) * node.distance + mousePos.x;
        const ny = Math.sin(currentAngle) * node.distance + mousePos.y;
        const isSelected = activeNode?.id === node.id;

        return (
          <motion.div
            key={node.id}
            onClick={() => {
              setActiveNode(node);
              soundFX.click();
              if (onNodeSelect) onNodeSelect(node.name);
            }}
            style={{
              position: 'absolute',
              left: `calc(50% + ${nx}px)`,
              top: `calc(50% + ${ny}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            whileHover={{ scale: 1.12 }}
            className="cursor-pointer group z-20 flex items-center justify-center"
          >
            <div 
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                isSelected 
                  ? 'bg-space-850 border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-110' 
                  : 'bg-space-900 border-white/15 hover:border-white/40'
              }`}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: node.color }}
              />
            </div>

            {/* Subtle Tooltip Label on Hover */}
            <div className="absolute top-9 whitespace-nowrap px-2.5 py-1 rounded-md bg-space-950/95 border border-white/10 text-[10px] font-mono text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {node.name}
            </div>
          </motion.div>
        );
      })}

      {/* Central Chronometer / Core */}
      <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full glass-panel-glow border border-luxury-gold/30 shadow-2xl">
        <div className="absolute inset-1 rounded-full border border-dashed border-white/10 animate-spin-slow" />
        <div className="absolute inset-3 rounded-full border border-luxury-gold/20 animate-spin-reverse-slow" />
        
        {/* Core Heart Pulse */}
        <div className="w-8 h-8 rounded-full bg-luxury-gold/15 flex items-center justify-center mb-1">
          <div className="w-3.5 h-3.5 rounded-full bg-luxury-gold shadow-[0_0_15px_#d4af37]" />
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-luxury-goldLight font-bold">
          SYNCHRONIZED
        </span>
      </div>

      {/* Refined Luxury HUD Card for Selected Node */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-xl bg-space-900/90 backdrop-blur-xl border border-white/10 text-center min-w-[260px] shadow-2xl"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5 mb-1.5">
              <span className="uppercase text-luxury-azure">{activeNode.category}</span>
              <span className="text-luxury-goldLight font-bold">{activeNode.metric}</span>
            </div>
            <div className="font-display font-bold text-sm text-white">
              {activeNode.name}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              {activeNode.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
