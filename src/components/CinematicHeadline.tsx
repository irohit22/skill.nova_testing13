import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CinematicHeadlineProps {
  kicker?: string;
  lines: string[];
  accentWord?: string;
  className?: string;
  align?: 'left' | 'center';
  showReplayButton?: boolean;
  onComplete?: () => void;
}

export const CinematicHeadline: React.FC<CinematicHeadlineProps> = ({
  kicker,
  lines,
  accentWord = 'ACCIDENT.',
  className = '',
  align = 'left',
  showReplayButton = true,
  onComplete
}) => {
  const [animationKey, setAnimationKey] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const handleReplay = () => {
    soundFX.click();
    setAnimationKey((prev) => prev + 1);
  };

  // Custom motion bezier easing from requirements: cubic-bezier(0.22, 1, 0.36, 1)
  const customEase = [0.22, 1, 0.36, 1] as const;

  useEffect(() => {
    if (onComplete) {
      // Calculate total duration: last line delay + reveal time (~900ms)
      const totalTime = (lines.length * 180 + 750);
      const timer = setTimeout(() => {
        onComplete();
      }, totalTime);
      return () => clearTimeout(timer);
    }
  }, [animationKey, lines.length, onComplete]);

  if (shouldReduceMotion) {
    return (
      <div className={`space-y-3 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
        {kicker && (
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#ef4444] font-bold">
            <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-[1px]" />
            <span>{kicker}</span>
          </div>
        )}
        <h1 className="font-display font-extrabold uppercase text-white tracking-tight leading-[1.06]">
          {lines.map((line, idx) => (
            <div key={idx} className="block mb-1">
              {line.split(' ').map((word, wIdx) => {
                const isAccent = accentWord && word.toUpperCase().includes(accentWord.replace('.', '').toUpperCase());
                return (
                  <span key={wIdx} className="inline-block mr-[0.28em]">
                    {isAccent ? (
                      <span className="bg-[#ef4444] text-white px-2.5 py-0.5 rounded-sm inline-block shadow-sm">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </h1>
      </div>
    );
  }

  return (
    <div key={animationKey} className={`relative space-y-3 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      
      {/* Editorial Kicker with Vivid Red Geometric Square Marker */}
      {kicker && (
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: customEase }}
          className={`flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.25em] font-bold ${
            align === 'center' ? 'justify-center' : 'justify-start'
          }`}
        >
          {/* Vivid Red Geometric Marker (300-400ms entrance) */}
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.35, ease: customEase }}
            className="w-2.5 h-2.5 bg-[#ef4444] shadow-[0_0_14px_rgba(239,68,68,0.7)] rounded-[1px] inline-block"
          />
          <span className="text-slate-300">
            {kicker}
          </span>
          {showReplayButton && (
            <button
              onClick={handleReplay}
              className="ml-2 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors group"
              title="Replay cinematic headline animation"
              aria-label="Replay text animation"
            >
              <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}
        </motion.div>
      )}

      {/* Headline Block Wipe & Sequential Masked Text Container */}
      <h1 className="font-display font-extrabold uppercase text-white tracking-tight leading-[1.06] select-text">
        {lines.map((line, lineIdx) => {
          const lineDelay = lineIdx * 0.16; // 160ms stagger between lines (100-180ms req)

          return (
            <div key={lineIdx} className="relative inline-block w-full overflow-visible mb-1">
              
              {/* Secondary Dark Charcoal Offset Backdrop Block for contrast */}
              <motion.div
                initial={{ clipPath: 'inset(0% 50% 0% 50%)', opacity: 0 }}
                animate={{
                  clipPath: [
                    'inset(0% 50% 0% 50%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(0% 0% 0% 100%)'
                  ],
                  opacity: [0, 0.95, 0.95, 0]
                }}
                transition={{
                  duration: 0.88,
                  delay: lineDelay + 0.04,
                  times: [0, 0.44, 0.54, 1],
                  ease: customEase
                }}
                className="absolute -inset-1 bg-[#0b0f19] border border-white/[0.04] translate-x-1.5 translate-y-1.5 z-10 pointer-events-none rounded-[1px]"
              />

              {/* Primary Vivid Red Rectangular Shape:
                  Starts in center, quick horizontal expansion (300-500ms), sharp editorial transition */}
              <motion.div
                initial={{ clipPath: 'inset(0% 50% 0% 50%)', opacity: 0 }}
                animate={{
                  clipPath: [
                    'inset(0% 50% 0% 50%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(0% 0% 0% 100%)'
                  ],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 0.82,
                  delay: lineDelay,
                  times: [0, 0.42, 0.52, 1],
                  ease: customEase
                }}
                className="absolute inset-0 bg-[#ef4444] shadow-[0_0_35px_rgba(239,68,68,0.55)] z-20 pointer-events-none rounded-[1px]"
              />

              {/* Masked Text Reveal (Overflow-hidden clipping container + vertical translation) */}
              <div className="overflow-hidden py-1">
                <motion.div
                  initial={{ y: '115%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.68,
                    delay: lineDelay + 0.32,
                    ease: customEase
                  }}
                  className="flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1"
                >
                  {line.split(' ').map((word, wordIdx) => {
                    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                    const cleanAccent = accentWord.replace(/[^a-zA-Z]/g, '');
                    const isAccent = cleanWord.toUpperCase() === cleanAccent.toUpperCase();
                    const wordDelay = lineDelay + 0.32 + wordIdx * 0.055; // 55ms subtle word stagger

                    return (
                      <motion.span
                        key={wordIdx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.52,
                          delay: wordDelay,
                          ease: customEase
                        }}
                        className="inline-block relative"
                      >
                        {isAccent ? (
                          <span className="relative inline-block ml-0.5">
                            {/* Dark Charcoal Offset Shadow */}
                            <span className="absolute -inset-1 bg-[#090d16] translate-x-1 translate-y-1 rounded-sm -z-10" />
                            {/* Vivid Red Editorial Geometric Accent Box */}
                            <span className="bg-[#ef4444] text-white px-3 py-0.5 rounded-sm inline-block shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400/40">
                              {word}
                            </span>
                          </span>
                        ) : (
                          <span className="text-white hover:text-slate-100 transition-colors">
                            {word}
                          </span>
                        )}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </div>

            </div>
          );
        })}
      </h1>

    </div>
  );
};
