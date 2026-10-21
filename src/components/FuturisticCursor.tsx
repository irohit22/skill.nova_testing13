import React, { useEffect, useRef, useState } from 'react';

interface TrailNode {
  x: number;
  y: number;
}

interface JellyfishOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
  tentacles: { angleOffset: number; length: number; waveOffset: number }[];
  color: 'cyan' | 'azure' | 'purple';
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const FuturisticCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch / coarse pointer
    const checkTouch = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsTouchDevice(isCoarse);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    // Accessibility: check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    window.addEventListener('resize', handleResize);

    // Mouse tracking state
    const mouse = {
      x: -500,
      y: -500,
      targetX: -500,
      targetY: -500,
      isHovering: false,
      isMouseDown: false,
      active: false
    };

    // Spotlight coordinates (smoothed)
    let spotlightX = -500;
    let spotlightY = -500;

    // Liquid trail nodes
    const TRAIL_LENGTH = 18;
    const trail: TrailNode[] = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: -500,
      y: -500
    }));

    // Floating bioluminescent jellyfish-like blobs
    const JELLYFISH_COUNT = 7;
    const jellyfishBlobs: JellyfishOrb[] = Array.from({ length: JELLYFISH_COUNT }, (_, i) => {
      const colors: ('cyan' | 'azure' | 'purple')[] = ['cyan', 'azure', 'purple', 'cyan', 'azure', 'purple', 'cyan'];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 8 + 12, // 12px to 20px
        pulseSpeed: Math.random() * 1.5 + 1.2,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        tentacles: [
          { angleOffset: -0.3, length: Math.random() * 12 + 14, waveOffset: 0 },
          { angleOffset: 0, length: Math.random() * 16 + 18, waveOffset: 1.2 },
          { angleOffset: 0.3, length: Math.random() * 12 + 14, waveOffset: 2.4 }
        ]
      };
    });

    // Ripples array
    let ripples: ClickRipple[] = [];

    // Pointer event listeners
    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, .interactive') !== null;
        mouse.isHovering = isInteractive;

        // Subtle Magnetic Pull on Interactive Buttons
        const button = target.closest('button, [role="button"]') as HTMLElement | null;
        if (button) {
          const rect = button.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.15;
          const deltaY = (e.clientY - centerY) * 0.15;
          button.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
          button.style.transition = 'transform 0.1s ease-out';
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      mouse.isMouseDown = true;
      
      // Spawn luminous click ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: mouse.isHovering ? 95 : 75,
        alpha: 0.85,
        color: mouse.isHovering ? '#38bdf8' : '#00f0ff'
      });
    };

    const handlePointerUp = () => {
      mouse.isMouseDown = false;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      setIsVisible(false);

      // Reset any magnetically transformed buttons
      document.querySelectorAll('button, [role="button"]').forEach((el) => {
        (el as HTMLElement).style.transform = '';
        (el as HTMLElement).style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    // Reset button magnetic transforms when mouse moves away from them
    const handleMouseOver = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related && related.tagName === 'BUTTON') {
        related.style.transform = '';
      }
    };
    document.addEventListener('mouseout', handleMouseOver);

    // Animation loop variables
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;
      const elapsedSeconds = time * 0.001;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.35;
      mouse.y += (mouse.targetY - mouse.y) * 0.35;

      // Update background spotlight position
      if (spotlightRef.current && mouse.active) {
        spotlightX += (mouse.targetX - spotlightX) * 0.15;
        spotlightY += (mouse.targetY - spotlightY) * 0.15;
        spotlightRef.current.style.transform = `translate3d(${spotlightX}px, ${spotlightY}px, 0)`;
      }

      // Update liquid trail nodes
      if (trail[0]) {
        trail[0].x += (mouse.x - trail[0].x) * 0.5;
        trail[0].y += (mouse.y - trail[0].y) * 0.5;

        for (let i = 1; i < TRAIL_LENGTH; i++) {
          const prev = trail[i - 1];
          const curr = trail[i];
          curr.x += (prev.x - curr.x) * 0.45;
          curr.y += (prev.y - curr.y) * 0.45;
        }
      }

      // 1. RENDER FLOATING BIOLUMINESCENT JELLYFISH BLOBS
      if (!prefersReducedMotion) {
        for (let i = 0; i < jellyfishBlobs.length; i++) {
          const blob = jellyfishBlobs[i];

          // Natural undulating drift
          blob.x += blob.vx * 60 * dt;
          blob.y += blob.vy * 60 * dt;

          // Wrap around viewport boundaries smoothly
          if (blob.x < -40) blob.x = width + 40;
          else if (blob.x > width + 40) blob.x = -40;
          if (blob.y < -40) blob.y = height + 40;
          else if (blob.y > height + 40) blob.y = -40;

          // React dynamically to mouse proximity (fluid deflection & swimming impulse)
          if (mouse.active) {
            const dx = blob.x - mouse.x;
            const dy = blob.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            const repelRadius = 175;

            if (dist < repelRadius && dist > 1) {
              const force = (1 - dist / repelRadius) * 2.2;
              const angle = Math.atan2(dy, dx);
              blob.vx += Math.cos(angle) * force * 0.22;
              blob.vy += Math.sin(angle) * force * 0.22;
            }
          }

          // Damping to return to serene floating speed
          blob.vx *= 0.96;
          blob.vy *= 0.96;
          const minDrift = 0.25;
          if (Math.abs(blob.vx) < 0.05) blob.vx += (Math.random() - 0.5) * minDrift;
          if (Math.abs(blob.vy) < 0.05) blob.vy += (Math.random() - 0.5) * minDrift;

          // Organic pulsation (breathing jellyfish bell)
          const pulse = Math.sin(elapsedSeconds * blob.pulseSpeed + blob.pulsePhase);
          const currentRadius = blob.baseRadius * (1 + pulse * 0.22);

          // Color palette selection
          let coreColor = 'rgba(255, 255, 255, 0.85)';
          let mantleColor = 'rgba(56, 189, 248, 0.35)';
          let outerGlow = 'rgba(0, 240, 255, 0.12)';

          if (blob.color === 'purple') {
            mantleColor = 'rgba(168, 85, 247, 0.35)';
            outerGlow = 'rgba(192, 132, 252, 0.12)';
          } else if (blob.color === 'azure') {
            mantleColor = 'rgba(14, 165, 233, 0.35)';
            outerGlow = 'rgba(56, 189, 248, 0.12)';
          }

          // Draw Outer Bioluminescent Halo
          const glowGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, currentRadius * 3.2);
          glowGrad.addColorStop(0, mantleColor);
          glowGrad.addColorStop(0.5, outerGlow);
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, currentRadius * 3.2, 0, Math.PI * 2);
          ctx.fill();

          // Draw Translucent Bell Mantle
          ctx.fillStyle = mantleColor;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw Luminous Core
          ctx.fillStyle = coreColor;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, currentRadius * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Draw undulating flowing trailing tendrils
          const moveAngle = Math.atan2(blob.vy, blob.vx) + Math.PI; // trail behind motion
          ctx.lineWidth = 1;
          for (let t = 0; t < blob.tentacles.length; t++) {
            const ten = blob.tentacles[t];
            const startAngle = moveAngle + ten.angleOffset;
            const sx = blob.x + Math.cos(startAngle) * (currentRadius * 0.7);
            const sy = blob.y + Math.sin(startAngle) * (currentRadius * 0.7);

            const wave = Math.sin(elapsedSeconds * 3.5 + ten.waveOffset) * 6;
            const midX = sx + Math.cos(startAngle) * (ten.length * 0.5) + Math.sin(startAngle) * wave;
            const midY = sy + Math.sin(startAngle) * (ten.length * 0.5) - Math.cos(startAngle) * wave;

            const endX = sx + Math.cos(startAngle) * ten.length;
            const endY = sy + Math.sin(startAngle) * ten.length;

            ctx.strokeStyle = mantleColor;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(midX, midY, endX, endY);
            ctx.stroke();
          }
        }
      }

      // 2. RENDER EXPANDING CLICK RIPPLES
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.18 + 1.2;
        r.alpha *= 0.92;

        if (r.alpha < 0.02 || r.radius >= r.maxRadius - 2) {
          ripples.splice(i, 1);
          continue;
        }

        // Outer expanding shockwave ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Inner bright accent ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 3), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(r.alpha * 1.2).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 3. RENDER SMOOTH LIQUID-GLOW MOUSE TRAIL (Desktop Only)
      if (mouse.active && !prefersReducedMotion && !isTouchDevice) {
        for (let i = 0; i < trail.length - 1; i++) {
          const pt = trail[i];
          const progress = 1 - i / trail.length; // 1 at head, 0 at tail
          const widthTaper = progress * 6.5 + 0.8;
          const alphaTaper = progress * 0.55;

          // Draw liquid glowing segment
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, widthTaper, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alphaTaper.toFixed(3)})`;
          ctx.fill();

          // Connect nodes with smooth ribbon stroke
          const nextPt = trail[i + 1];
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(alphaTaper * 0.85).toFixed(3)})`;
          ctx.lineWidth = widthTaper * 1.4;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // 4. RENDER CUSTOM GLOWING BLUE-WHITE CURSOR (Desktop Only)
      if (mouse.active && !isTouchDevice) {
        const isHover = mouse.isHovering;
        const isDown = mouse.isMouseDown;

        // Target sizes
        const targetRingRadius = isDown ? 14 : isHover ? 26 : 18;
        const targetCoreRadius = isDown ? 3 : isHover ? 5 : 3.5;

        // Soft Radial Aura Glow
        const auraRadius = isHover ? 48 : 32;
        const auraGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, auraRadius);
        auraGrad.addColorStop(0, isHover ? 'rgba(56, 189, 248, 0.45)' : 'rgba(0, 240, 255, 0.35)');
        auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Outer Spring Ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, targetRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isHover ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = isHover ? 1.8 : 1.2;
        ctx.stroke();

        // Central Pure Blue-White Luminous Core
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, targetCoreRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Inner glowing border on core
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, targetCoreRadius + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', checkTouch);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseout', handleMouseOver);
    };
  }, [isTouchDevice]);

  return (
    <>
      {/* 1. Subtle Radial Spotlight Following Cursor Across Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden transition-opacity duration-300 select-none"
        style={{ opacity: isVisible && !isTouchDevice ? 1 : 0 }}
      >
        <div
          ref={spotlightRef}
          className="absolute -top-[350px] -left-[350px] w-[700px] h-[700px] rounded-full pointer-events-none will-change-transform"
          style={{
            background: 'radial-gradient(circle 350px at center, rgba(56, 189, 248, 0.08) 0%, rgba(0, 240, 255, 0.03) 45%, transparent 75%)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* 2. Interactive Full-Screen Canvas for Trail, Jellyfish Blobs, Cursor & Ripples */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999] select-none"
        aria-hidden="true"
      />
    </>
  );
};
