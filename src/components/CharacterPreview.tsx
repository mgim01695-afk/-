import React, { useEffect, useRef } from 'react';
import { drawMughalCharacter } from '../systems/characterRenderer';
import { PlayerAppearance } from '../types/game';

interface CharacterPreviewProps {
  appearance: PlayerAppearance;
  size?: number;
  scale?: number;
  animate?: boolean;
  label?: string;
}

export const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  appearance,
  size = 140,
  scale = 1.75,
  animate = true,
  label
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let phase = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      drawMughalCharacter(ctx, size / 2, size * 0.78, appearance, {
        scale,
        walkPhase: phase,
        isWalking: false,
        label
      });

      if (animate) {
        phase += 0.04;
        rafId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [appearance, size, scale, animate, label]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="block mx-auto"
    />
  );
};
