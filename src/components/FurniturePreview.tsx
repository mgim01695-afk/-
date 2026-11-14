import React, { useEffect, useRef } from 'react';
import { drawRealisticMughalFurniture } from '../systems/furnitureRenderer';
import { FurnitureDef } from '../types/game';

interface FurniturePreviewProps {
  item: FurnitureDef;
  size?: number;
}

export const FurniturePreview: React.FC<FurniturePreviewProps> = ({ item, size = 56 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const maxDim = Math.max(item.w, item.h);
    const scale = Math.min(1, (size * 0.78) / maxDim);

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale(scale, scale);
    drawRealisticMughalFurniture(ctx, item.id, item.w, item.h, item.color, item.accentColor, true, true);
    ctx.restore();
  }, [item, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="block shrink-0"
    />
  );
};
