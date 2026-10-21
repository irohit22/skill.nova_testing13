import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  colorType: 'white' | 'cyan' | 'purple' | 'ice';
  hasGlow: boolean;
  glowRadius: number;
}

interface DistantStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastTime = performance.now();

    // Mouse & Touch interaction state
    const pointer = {
      x: -1000,
      y: -1000,
      active: false,
      radius: 130
    };

    // Accessibility: check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        renderStaticFrame();
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);

    // Particle pools
    let particles: Particle[] = [];
    let distantStars: DistantStar[] = [];

    // Helper to determine particle count responsibly
    const getParticleCount = (w: number, h: number) => {
      const area = w * h;
      if (w < 640) return Math.min(75, Math.floor(area / 11000) + 40); // Mobile
      if (w < 1024) return Math.min(125, Math.floor(area / 9500) + 60); // Tablet
      return Math.min(185, Math.floor(area / 8500) + 80); // Desktop: ~160-185 particles
    };

    const getDistantStarCount = (w: number, h: number) => {
      if (w < 640) return 60;
      if (w < 1024) return 90;
      return 140; // Desktop micro-stars for cosmic depth
    };

    // Color definitions
    const getColorRgba = (type: Particle['colorType'], alpha: number): string => {
      switch (type) {
        case 'cyan':
          return `rgba(0, 240, 255, ${alpha.toFixed(3)})`;
        case 'purple':
          return `rgba(192, 132, 252, ${alpha.toFixed(3)})`;
        case 'ice':
          return `rgba(125, 211, 252, ${alpha.toFixed(3)})`;
        case 'white':
        default:
          return `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      }
    };

    const initParticles = () => {
      const count = getParticleCount(width, height);
      const starCount = getDistantStarCount(width, height);

      // Distant micro-stars layer
      distantStars = Array.from({ length: starCount }, () => {
        const rand = Math.random();
        let color = 'rgba(255, 255, 255, ';
        if (rand < 0.25) color = 'rgba(56, 189, 248, ';
        else if (rand < 0.38) color = 'rgba(168, 85, 247, ';

        const baseAlpha = Math.random() * 0.35 + 0.12;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.9 + 0.4,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 1.8 + 0.6,
          phase: Math.random() * Math.PI * 2,
          color
        };
      });

      // Interactive constellation particles
      particles = Array.from({ length: count }, () => {
        const rand = Math.random();
        let colorType: Particle['colorType'] = 'white';
        if (rand < 0.38) colorType = 'cyan';
        else if (rand < 0.58) colorType = 'purple';
        else if (rand < 0.72) colorType = 'ice';

        const isHero = Math.random() < 0.18; // ~18% brighter accent stars with glow
        const baseRadius = isHero ? Math.random() * 0.9 + 1.8 : Math.random() * 0.8 + 0.9;
        const baseAlpha = isHero ? Math.random() * 0.3 + 0.65 : Math.random() * 0.35 + 0.35;

        // Gentle cosmic drift speed
        const speedMultiplier = isHero ? 0.14 : 0.22;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.18 + 0.06) * speedMultiplier;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          baseRadius,
          radius: baseRadius,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 2.2 + 0.8,
          twinklePhase: Math.random() * Math.PI * 2,
          colorType,
          hasGlow: isHero,
          glowRadius: baseRadius * 3.4
        };
      });
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      pointer.radius = width < 640 ? 90 : 130;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();

      if (prefersReducedMotion) {
        renderStaticFrame();
      }
    };

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handleMouseLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    };

    const handleTouchEnd = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    resizeCanvas();

    // Render connecting constellation lines between nearby particles
    const drawConstellationLines = () => {
      const pCount = particles.length;
      const maxDist = width < 640 ? 75 : 105;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < pCount; i++) {
        const p1 = particles[i];

        // Lines to other particles
        for (let j = i + 1; j < pCount; j++) {
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          if (Math.abs(dx) > maxDist) continue;
          const dy = p1.y - p2.y;
          if (Math.abs(dy) > maxDist) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq > maxDistSq) continue;

          const dist = Math.sqrt(distSq);
          const ratio = 1 - dist / maxDist;
          // Very faint, elegant digital lines
          const lineAlpha = ratio * 0.13 * Math.min(p1.alpha, p2.alpha);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = ratio > 0.6 ? 0.75 : 0.55;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Interactive subtle connection to cursor / touch position
        if (pointer.active) {
          const mdx = p1.x - pointer.x;
          const mdy = p1.y - pointer.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const mRadiusSq = pointer.radius * pointer.radius;

          if (mDistSq < mRadiusSq) {
            const mDist = Math.sqrt(mDistSq);
            const mRatio = 1 - mDist / pointer.radius;
            const mAlpha = mRatio * 0.22;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${mAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();

            // Subtle gentle magnetic repulsion away from cursor
            const force = (1 - mDist / pointer.radius) * 0.45;
            p1.x += (mdx / (mDist || 1)) * force;
            p1.y += (mdy / (mDist || 1)) * force;
          }
        }
      }
    };

    // Render single static frame for reduced motion preference
    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Distant micro-stars
      for (let i = 0; i < distantStars.length; i++) {
        const s = distantStars[i];
        ctx.fillStyle = `${s.color}${s.baseAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellations
      drawConstellationLines();

      // Main particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.hasGlow) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
          glowGrad.addColorStop(0, getColorRgba(p.colorType, p.alpha * 0.35));
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = getColorRgba(p.colorType, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Continuous dynamic animation loop
    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;
      const elapsedSeconds = time * 0.001;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw distant twinkling micro-stars
      for (let i = 0; i < distantStars.length; i++) {
        const s = distantStars[i];
        const twinkle = Math.sin(elapsedSeconds * s.twinkleSpeed + s.phase);
        s.alpha = Math.max(0.08, s.baseAlpha + twinkle * 0.12);

        ctx.fillStyle = `${s.color}${s.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update interactive particles position & twinkle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth physical drift
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        // Wrap around boundaries seamlessly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Gentle brightness & breathing twinkle
        const osc = Math.sin(elapsedSeconds * p.twinkleSpeed + p.twinklePhase);
        p.alpha = Math.max(0.18, Math.min(0.95, p.baseAlpha + osc * 0.22));
        p.radius = p.baseRadius * (1 + osc * 0.12);
      }

      // 3. Draw constellation lines
      drawConstellationLines();

      // 4. Draw interactive particles & radiant glows
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft halo glow around brighter particles
        if (p.hasGlow) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
          glowGrad.addColorStop(0, getColorRgba(p.colorType, p.alpha * 0.38));
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp central glowing point
        ctx.fillStyle = getColorRgba(p.colorType, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      renderStaticFrame();
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep black & cosmic navy foundation gradient */}
      <div className="absolute inset-0 bg-[#030508]" />

      {/* Atmospheric dark navy & midnight celestial gradients */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% -10%, rgba(14, 28, 54, 0.55), transparent 70%),
            radial-gradient(circle 800px at 85% 45%, rgba(18, 25, 48, 0.4), transparent 65%),
            radial-gradient(circle 700px at 15% 85%, rgba(15, 22, 42, 0.45), transparent 65%)
          `
        }}
      />

      {/* Subtle fine futuristic cyber grid pattern */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-20" />

      {/* High-performance canvas for glowing stars, particles & constellation network */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
      />
    </div>
  );
};
