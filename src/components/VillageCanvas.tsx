import React, { useEffect, useRef, useState } from 'react';
import { Compass, MessageCircle, Sparkles } from 'lucide-react';
import {
  BUILDINGS,
  LOCATION_ZONES,
  PATH_RECTS,
  STATIC_OBSTACLES,
  TREES,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from '../data/mapData';
import { NPC_DATA, getFeaturedNpcForDay } from '../data/npcData';
import { drawMughalCharacter } from '../systems/characterRenderer';
import { hasUnsolvedQuizForNpc } from '../systems/gameLogic';
import { BuildingDef, GameSaveData, NpcDefinition } from '../types/game';

interface VillageCanvasProps {
  gameState: GameSaveData;
  isModalOpen: boolean;
  onUpdatePosition: (pos: { x: number; y: number }, locationId: string | null) => void;
  onInteractNpc: (npc: NpcDefinition) => void;
  onInteractBuilding: (building: BuildingDef) => void;
}

type NearTarget =
  | { type: 'npc'; npc: NpcDefinition; dist: number }
  | { type: 'building'; building: BuildingDef; dist: number };

function collidesWithObstacles(nx: number, ny: number): boolean {
  const halfW = 14;
  const halfH = 10;
  if (nx < 40 || nx > WORLD_WIDTH - 40 || ny < 60 || ny > WORLD_HEIGHT - 30) {
    return true;
  }
  for (const obs of STATIC_OBSTACLES) {
    if (
      nx + halfW > obs.x &&
      nx - halfW < obs.x + obs.w &&
      ny + halfH > obs.y &&
      ny - halfH < obs.y + obs.h
    ) {
      return true;
    }
  }
  return false;
}

export const VillageCanvas: React.FC<VillageCanvasProps> = ({
  gameState,
  isModalOpen,
  onUpdatePosition,
  onInteractNpc,
  onInteractBuilding
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posRef = useRef({ x: gameState.playerPos.x, y: gameState.playerPos.y });
  const facingRef = useRef<'down' | 'up' | 'left' | 'right'>('down');
  const keysRef = useRef<Record<string, boolean>>({});
  const joystickVecRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0, active: false });
  const [nearTarget, setNearTarget] = useState<NearTarget | null>(null);
  const [currentZoneName, setCurrentZoneName] = useState('플레이어의 집');

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  // Sync external teleport (e.g., returning from house or starting new day)
  useEffect(() => {
    posRef.current = { x: gameState.playerPos.x, y: gameState.playerPos.y };
  }, [gameState.playerPos.x, gameState.playerPos.y]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpenRef.current) return;
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      if (key === ' ' || key === 'e' || key === 'enter') {
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
          e.preventDefault();
        }
        // Trigger closest target
        const target = findClosestTarget(posRef.current.x, posRef.current.y);
        if (target?.type === 'npc') {
          onInteractNpc(target.npc);
        } else if (target?.type === 'building') {
          onInteractBuilding(target.building);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const clearKeys = () => {
      keysRef.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [onInteractNpc, onInteractBuilding]);

  const findClosestTarget = (px: number, py: number): NearTarget | null => {
    let best: NearTarget | null = null;
    for (const npc of NPC_DATA) {
      const dist = Math.hypot(px - npc.x, py - npc.y);
      if (dist < 76 && (!best || dist < best.dist)) {
        best = { type: 'npc', npc, dist };
      }
    }
    for (const b of BUILDINGS) {
      if (!b.interactionType || b.doorX === undefined || b.doorY === undefined) continue;
      const dist = Math.hypot(px - b.doorX, py - b.doorY);
      if (dist < 72 && (!best || dist < best.dist)) {
        best = { type: 'building', building: b, dist };
      }
    }
    return best;
  };

  // Main Animation & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let walkPhase = 0;
    let lastReportTime = 0;
    let lastZoneId: string | null = null;

    const loop = (time: number) => {
      const parent = canvas.parentElement;
      const viewW = parent ? parent.clientWidth : window.innerWidth;
      const viewH = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== Math.floor(viewW * dpr) || canvas.height !== Math.floor(viewH * dpr)) {
        canvas.width = Math.floor(viewW * dpr);
        canvas.height = Math.floor(viewH * dpr);
      }

      // Movement update when no modal is open
      let isWalking = false;
      if (!isModalOpenRef.current) {
        let dx = joystickVecRef.current.dx;
        let dy = joystickVecRef.current.dy;
        const k = keysRef.current;
        if (k['w'] || k['arrowup']) dy -= 1;
        if (k['s'] || k['arrowdown']) dy += 1;
        if (k['a'] || k['arrowleft']) dx -= 1;
        if (k['d'] || k['arrowright']) dx += 1;

        const mag = Math.hypot(dx, dy);
        if (mag > 0.05) {
          isWalking = true;
          const speed = 3.8;
          const vx = (dx / Math.max(mag, 1)) * speed;
          const vy = (dy / Math.max(mag, 1)) * speed;

          if (Math.abs(vx) > Math.abs(vy)) {
            facingRef.current = vx < 0 ? 'left' : 'right';
          } else {
            facingRef.current = vy < 0 ? 'up' : 'down';
          }

          const nextX = posRef.current.x + vx;
          const nextY = posRef.current.y + vy;
          if (!collidesWithObstacles(nextX, posRef.current.y)) {
            posRef.current.x = nextX;
          }
          if (!collidesWithObstacles(posRef.current.x, nextY)) {
            posRef.current.y = nextY;
          }
        }
      }

      walkPhase += isWalking ? 0.18 : 0.03;

      // Zone detection & periodic state sync
      const px = posRef.current.x;
      const py = posRef.current.y;
      const zone = LOCATION_ZONES.find(
        (z) => px >= z.x && px <= z.x + z.w && py >= z.y && py <= z.y + z.h
      );
      if (zone && zone.name !== currentZoneName) {
        setCurrentZoneName(zone.name);
      }
      if (time - lastReportTime > 260 || (zone && zone.id !== lastZoneId)) {
        lastReportTime = time;
        lastZoneId = zone ? zone.id : null;
        onUpdatePosition({ x: Math.round(px), y: Math.round(py) }, lastZoneId);
      }

      const closest = findClosestTarget(px, py);
      setNearTarget((prev) => {
        if (!prev && !closest) return prev;
        if (
          prev &&
          closest &&
          prev.type === closest.type &&
          ((prev.type === 'npc' && closest.type === 'npc' && prev.npc.id === closest.npc.id) ||
            (prev.type === 'building' && closest.type === 'building' && prev.building.id === closest.building.id))
        ) {
          return prev;
        }
        return closest;
      });

      // Camera positioning clamped to world bounds
      const camX = Math.max(0, Math.min(WORLD_WIDTH - viewW, px - viewW / 2));
      const camY = Math.max(0, Math.min(WORLD_HEIGHT - viewH, py - viewH / 2));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);

      ctx.save();
      ctx.translate(-camX, -camY);

      drawWorldGround(ctx, camX, camY, viewW, viewH);

      // Collect Y-sorted renderables (buildings, trees, NPCs, player)
      const featuredNpc = getFeaturedNpcForDay(gameStateRef.current.currentDay);
      type RenderItem = { sortY: number; draw: () => void };
      const renderables: RenderItem[] = [];

      for (const b of BUILDINGS) {
        if (b.x + b.w < camX - 100 || b.x > camX + viewW + 100 || b.y + b.h < camY - 140 || b.y > camY + viewH + 100) {
          continue;
        }
        renderables.push({
          sortY: b.y + b.h,
          draw: () => drawBuilding(ctx, b)
        });
      }

      for (const t of TREES) {
        if (t.x < camX - 80 || t.x > camX + viewW + 80 || t.y < camY - 120 || t.y > camY + viewH + 80) {
          continue;
        }
        renderables.push({
          sortY: t.y + 8,
          draw: () => drawTree(ctx, t.x, t.y, t.variant)
        });
      }

      const s = gameStateRef.current;
      const isDay7 = s.currentDay === 7;
      const isFreeMode = s.currentDay > 7;

      for (const npc of NPC_DATA) {
        const isFeatured =
          !isDay7 && !isFreeMode && !s.todayTaskCompleted && npc.id === featuredNpc.id;
        const hasNewQuiz = isFreeMode && hasUnsolvedQuizForNpc(npc, s.completedQuizIds);
        const isClosest = closest?.type === 'npc' && closest.npc.id === npc.id;
        renderables.push({
          sortY: npc.y,
          draw: () =>
            drawMughalCharacter(ctx, npc.x, npc.y, npc.appearance, {
              scale: 1,
              walkPhase: walkPhase + npc.x * 0.01,
              label: isFeatured ? `★ ${npc.name}` : npc.name,
              badgeEmoji: isFeatured ? '❗' : hasNewQuiz ? '❓' : npc.emoji,
              isHighlighted: isFeatured || isClosest || hasNewQuiz
            })
        });
      }

      renderables.push({
        sortY: py,
        draw: () =>
          drawMughalCharacter(ctx, px, py, s.appearance, {
            scale: 1.05,
            facing: facingRef.current,
            walkPhase,
            isWalking,
            label: s.playerName
          })
      });

      renderables.sort((a, b) => a.sortY - b.sortY);
      for (const item of renderables) {
        item.draw();
      }

      // Draw directional guidance arrow around player (Days 1-6: Featured NPC / House, Day 7: Special Exps / House, Day 8+: Free mode)
      const guideTarget = isFreeMode
        ? null
        : s.todayTaskCompleted
        ? { x: 740, y: 912, color: '#10B981' }
        : isDay7
        ? !s.akbarProgress.completed
          ? { x: 1200, y: 572, color: '#D97706' }
          : !s.aurangzebProgress.completed
          ? { x: 1970, y: 325, color: '#DC2626' }
          : { x: 740, y: 912, color: '#10B981' }
        : { x: featuredNpc.x, y: featuredNpc.y, color: '#F59E0B' };
      const gDist = guideTarget ? Math.hypot(guideTarget.x - px, guideTarget.y - py) : 0;
      if (guideTarget && gDist > 130) {
        const angle = Math.atan2(guideTarget.y - py, guideTarget.x - px);
        const ax = px + Math.cos(angle) * 52;
        const ay = py - 18 + Math.sin(angle) * 40;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle);
        ctx.fillStyle = guideTarget.color;
        ctx.strokeStyle = '#2A2118';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // Atmospheric Evening / Night overlay
      if (gameStateRef.current.timeOfDay === 'evening') {
        ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
        ctx.fillRect(0, 0, viewW, viewH);
      } else if (gameStateRef.current.timeOfDay === 'night') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
        ctx.fillRect(0, 0, viewW, viewH);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [onUpdatePosition]);

  // Virtual Joystick Touch/Pointer Handlers
  const joyBaseRef = useRef<HTMLDivElement | null>(null);
  const handleJoyMove = (clientX: number, clientY: number) => {
    const base = joyBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = 38;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    setJoyKnob({ x: dx, y: dy, active: true });
    joystickVecRef.current = { dx: dx / maxR, dy: dy / maxR };
  };

  const resetJoy = () => {
    setJoyKnob({ x: 0, y: 0, active: false });
    joystickVecRef.current = { dx: 0, dy: 0 };
  };

  const featuredNpc = getFeaturedNpcForDay(gameState.currentDay);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#9FC07A]">
      <canvas
        ref={canvasRef}
        onClick={(e) => {
          if (isModalOpen) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const viewW = rect.width;
          const viewH = rect.height;
          const camX = Math.max(0, Math.min(WORLD_WIDTH - viewW, posRef.current.x - viewW / 2));
          const camY = Math.max(0, Math.min(WORLD_HEIGHT - viewH, posRef.current.y - viewH / 2));
          const worldX = e.clientX - rect.left + camX;
          const worldY = e.clientY - rect.top + camY;

          // Allow clicking directly on nearby NPC or building
          for (const npc of NPC_DATA) {
            if (Math.hypot(worldX - npc.x, worldY - (npc.y - 25)) < 42) {
              if (Math.hypot(posRef.current.x - npc.x, posRef.current.y - npc.y) < 120) {
                onInteractNpc(npc);
                return;
              }
            }
          }
          for (const b of BUILDINGS) {
            if (
              b.interactionType &&
              worldX >= b.x &&
              worldX <= b.x + b.w &&
              worldY >= b.y &&
              worldY <= b.y + b.h + 30
            ) {
              if (b.doorX && b.doorY && Math.hypot(posRef.current.x - b.doorX, posRef.current.y - b.doorY) < 120) {
                onInteractBuilding(b);
                return;
              }
            }
          }
        }}
        className="block w-full h-full cursor-pointer"
      />

      {/* Top-left floating Location & Quest Guide Banner */}
      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-2 max-w-xs sm:max-w-sm">
        <div className="bg-[#FFFDF8]/92 backdrop-blur-sm border border-[#D8C7A8] rounded-xl px-3.5 py-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-[#8C6432] font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>현재 위치</span>
          </div>
          <div className="text-sm font-bold text-[#2A2118]">{currentZoneName}</div>
        </div>

        <div className="bg-[#FFFDF8]/92 backdrop-blur-sm border border-[#D8C7A8] rounded-xl px-3.5 py-2 shadow-sm">
          {gameState.currentDay === 7 && !gameState.todayTaskCompleted ? (
            <div className="text-xs text-[#4A3A2A] space-y-1">
              <div className="font-bold text-[#9C571B]">🎉 7일차 특별 체험의 날</div>
              <div className="text-[11px]">
                {gameState.akbarProgress.completed ? '✅' : '⬜'} 1. 아크바르 특별 체험 (🕌 종교와 문화의 광장)
              </div>
              <div className="text-[11px]">
                {gameState.aurangzebProgress.completed ? '✅' : '⬜'} 2. 아우랑제브 특별 체험 (⚔️ 무굴 군영)
              </div>
            </div>
          ) : gameState.currentDay > 7 ? (
            <div className="text-xs text-[#1F5E57]">
              <span className="font-bold">✨ 자유 탐험 기간</span>
              <div className="text-[11px] text-[#45635E] mt-0.5">
                원하는 주민과 자유롭게 대화하고 퀴즈를 풀어보세요! (❓ 표시는 새 퀴즈)
              </div>
            </div>
          ) : !gameState.todayTaskCompleted ? (
            <div className="text-xs text-[#4A3A2A]">
              <span className="font-bold text-[#B46924]">오늘의 주요 주민:</span>{' '}
              {featuredNpc.emoji} {featuredNpc.name}
              <div className="text-[11px] text-[#7A6650] mt-0.5">
                노란 화살표를 따라가 대화하고 퀴즈를 풀어보세요!
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#1F5E57]">
              <span className="font-bold">오늘의 활동 완료!</span>
              <div className="text-[11px] text-[#45635E] mt-0.5">
                초록 화살표를 따라 플레이어의 집으로 돌아가 잠자리에 들어보세요.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center-bottom Interaction Action Prompt */}
      {nearTarget && !isModalOpen && (
        <div className="absolute bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
          {(() => {
            const isLockedSpecial =
              nearTarget.type === 'building' &&
              (nearTarget.building.interactionType === 'akbar_exp' ||
                nearTarget.building.interactionType === 'aurangzeb_exp') &&
              gameState.currentDay < 7;
            return (
              <button
                onClick={() => {
                  if (nearTarget.type === 'npc') onInteractNpc(nearTarget.npc);
                  else onInteractBuilding(nearTarget.building);
                }}
                className={`flex items-center gap-2.5 px-5 py-3 font-semibold rounded-xl shadow-lg border transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
                  isLockedSpecial
                    ? 'bg-[#4B5563] hover:bg-[#374151] text-[#F3F4F6] border-[#9CA3AF]/50'
                    : 'bg-[#1F5E57] hover:bg-[#174842] text-white border-[#E6B349]/50'
                }`}
              >
                {nearTarget.type === 'npc' ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-[#F5C451]" />
                    <span>
                      {nearTarget.npc.emoji} {nearTarget.npc.name}과(와) 대화하기 (Space)
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F5C451]" />
                    <span>
                      {isLockedSpecial
                        ? `🔒 ${nearTarget.building.interactionLabel} (7일째 해금)`
                        : `${nearTarget.building.interactionLabel} (Space)`}
                    </span>
                  </>
                )}
              </button>
            );
          })()}
        </div>
      )}

      {/* Mobile / Touch Virtual Joystick (bottom-left, visible on touch or small screens, usable anytime) */}
      <div
        ref={joyBaseRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleJoyMove(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (joyKnob.active) handleJoyMove(e.clientX, e.clientY);
        }}
        onPointerUp={resetJoy}
        onPointerCancel={resetJoy}
        className="absolute bottom-5 left-5 w-24 h-24 rounded-full bg-[#2A2118]/25 border-2 border-[#FFFDF8]/50 backdrop-blur-xs flex items-center justify-center touch-none select-none md:opacity-65 hover:opacity-100 transition-opacity"
        aria-label="이동 조이스틱"
      >
        <div
          className="w-10 h-10 rounded-full bg-[#FFFDF8]/90 border border-[#B46924] shadow-md pointer-events-none"
          style={{
            transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)`
          }}
        />
      </div>
    </div>
  );
};

function drawWorldGround(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number
) {
  // Base meadow grass
  ctx.fillStyle = '#9BC275';
  ctx.fillRect(camX, camY, viewW, viewH);

  // Decorative meadow grass tufts (deterministic grid)
  ctx.fillStyle = '#89B264';
  const startGx = Math.floor(camX / 90) * 90;
  const startGy = Math.floor(camY / 90) * 90;
  for (let gx = startGx; gx < camX + viewW + 90; gx += 90) {
    for (let gy = startGy; gy < camY + viewH + 90; gy += 90) {
      if (((gx * 7 + gy * 13) % 5) === 0) {
        ctx.beginPath();
        ctx.ellipse(gx + 22, gy + 24, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Farmer fields (cotton & wheat)
  ctx.fillStyle = '#85623E';
  ctx.beginPath();
  ctx.roundRect(160, 590, 320, 170, 12);
  ctx.fill();
  for (let row = 0; row < 4; row++) {
    ctx.fillStyle = row % 2 === 0 ? '#D9C87E' : '#F4F1EA';
    for (let col = 0; col < 9; col++) {
      ctx.beginPath();
      ctx.arc(185 + col * 34, 618 + row * 38, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cobblestone & sandstone paths
  for (const p of PATH_RECTS) {
    ctx.fillStyle = '#E5D3B3';
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 18);
    ctx.fill();
    ctx.strokeStyle = '#CCB48D';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Religion & Culture Plaza ornate floor pattern
  ctx.fillStyle = '#EFE3CA';
  ctx.beginPath();
  ctx.roundRect(1010, 410, 380, 240, 22);
  ctx.fill();
  ctx.strokeStyle = '#C99A49';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Central Plaza circular stone inlay
  ctx.fillStyle = '#EAE0C9';
  ctx.beginPath();
  ctx.ellipse(1200, 890, 155, 105, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C49A5B';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Central Plaza Fountain
  ctx.fillStyle = '#D6C6AE';
  ctx.strokeStyle = '#5D4A36';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(1152, 842, 96, 96, 20);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#4CA6B8';
  ctx.beginPath();
  ctx.roundRect(1164, 854, 72, 72, 14);
  ctx.fill();
  ctx.fillStyle = '#BCE6EE';
  ctx.beginPath();
  ctx.arc(1200, 890, 14, 0, Math.PI * 2);
  ctx.fill();

  // Village Well
  ctx.fillStyle = '#A8896C';
  ctx.strokeStyle = '#4A3929';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(680, 515, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3B8EA5';
  ctx.beginPath();
  ctx.arc(680, 515, 22, 0, Math.PI * 2);
  ctx.fill();

  // Charbagh Mughal Garden (4-part symmetrical water channels & flowers)
  ctx.fillStyle = '#8BB96B';
  ctx.beginPath();
  ctx.roundRect(1780, 520, 400, 260, 16);
  ctx.fill();
  ctx.strokeStyle = '#D4B98C';
  ctx.lineWidth = 4;
  ctx.stroke();
  // Cross water channels
  ctx.fillStyle = '#4EA8BE';
  ctx.fillRect(1785, 638, 390, 24);
  ctx.fillRect(1968, 525, 24, 250);
  // Central pool
  ctx.fillStyle = '#EFE3CB';
  ctx.fillRect(1935, 605, 90, 90);
  ctx.fillStyle = '#3C93AA';
  ctx.fillRect(1945, 615, 70, 70);
  // Flower beds
  const flowerColors = ['#E11D48', '#F59E0B', '#EC4899', '#FACC15'];
  for (let i = 0; i < 4; i++) {
    const fx = i % 2 === 0 ? 1860 : 2070;
    const fy = i < 2 ? 575 : 720;
    ctx.fillStyle = '#6D9E50';
    ctx.beginPath();
    ctx.roundRect(fx - 45, fy - 24, 90, 48, 10);
    ctx.fill();
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = flowerColors[(i + k) % flowerColors.length];
      ctx.beginPath();
      ctx.arc(fx - 30 + k * 15, fy + (k % 2 === 0 ? -6 : 6), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Market Bazaar stalls (colorful canopies)
  const stallColors = ['#C84B31', '#2B6E68', '#D48B28', '#8B3A62'];
  for (let i = 0; i < 4; i++) {
    const sx = 1045 + i * 82;
    const sy = 1235;
    ctx.fillStyle = '#6B4426';
    ctx.fillRect(sx, sy + 28, 66, 22);
    ctx.fillStyle = stallColors[i];
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(sx - 4, sy, 74, 30, 6);
    ctx.fill();
    ctx.stroke();
  }

  // Military Camp training arena markings
  ctx.strokeStyle = '#A67C52';
  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2.5;
  ctx.strokeRect(1780, 155, 390, 260);
  ctx.setLineDash([]);
}

function drawBuilding(ctx: CanvasRenderingContext2D, b: BuildingDef) {
  ctx.save();
  // Drop shadow
  ctx.fillStyle = 'rgba(42, 33, 24, 0.2)';
  ctx.beginPath();
  ctx.roundRect(b.x + 6, b.y + 12, b.w, b.h, 10);
  ctx.fill();

  // Main front wall
  ctx.fillStyle = b.wallColor;
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(b.x, b.y + 28, b.w, b.h - 28, 8);
  ctx.fill();
  ctx.stroke();

  // Roof / Dome styles
  if (b.style === 'palace') {
    // Grand Mughal roof + 3 onion domes
    ctx.fillStyle = b.roofColor;
    ctx.beginPath();
    ctx.roundRect(b.x - 6, b.y + 16, b.w + 12, 34, 8);
    ctx.fill();
    ctx.stroke();

    const domes = [
      { cx: b.x + 85, cy: b.y + 18, r: 28 },
      { cx: b.x + b.w / 2, cy: b.y + 14, r: 44 },
      { cx: b.x + b.w - 85, cy: b.y + 18, r: 28 }
    ];
    for (const d of domes) {
      ctx.fillStyle = '#FAF6EE';
      ctx.beginPath();
      ctx.arc(d.cx, d.cy, d.r, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Gold finial
      ctx.strokeStyle = b.trimColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(d.cx, d.cy - d.r);
      ctx.lineTo(d.cx, d.cy - d.r - 14);
      ctx.stroke();
      ctx.strokeStyle = '#2C2119';
      ctx.lineWidth = 2.2;
    }
  } else if (b.style === 'pavilion') {
    ctx.fillStyle = b.roofColor;
    ctx.beginPath();
    ctx.moveTo(b.x - 10, b.y + 38);
    ctx.lineTo(b.x + b.w / 2, b.y - 6);
    ctx.lineTo(b.x + b.w + 10, b.y + 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (b.style === 'tent') {
    ctx.fillStyle = b.roofColor;
    ctx.beginPath();
    ctx.moveTo(b.x - 8, b.y + 42);
    ctx.lineTo(b.x + b.w / 2, b.y);
    ctx.lineTo(b.x + b.w + 8, b.y + 42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Pennant flag
    ctx.fillStyle = b.trimColor;
    ctx.fillRect(b.x + b.w / 2 - 2, b.y - 18, 4, 20);
    ctx.beginPath();
    ctx.moveTo(b.x + b.w / 2 + 2, b.y - 18);
    ctx.lineTo(b.x + b.w / 2 + 26, b.y - 11);
    ctx.lineTo(b.x + b.w / 2 + 2, b.y - 4);
    ctx.fill();
  } else {
    // 2.5D pitched roof
    ctx.fillStyle = b.roofColor;
    ctx.beginPath();
    ctx.moveTo(b.x - 8, b.y + 40);
    ctx.lineTo(b.x + 18, b.y + 4);
    ctx.lineTo(b.x + b.w - 18, b.y + 4);
    ctx.lineTo(b.x + b.w + 8, b.y + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Trim stripe
    ctx.strokeStyle = b.trimColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x + 6, b.y + 42);
    ctx.lineTo(b.x + b.w - 6, b.y + 42);
    ctx.stroke();
  }

  // Mughal Arch Doorway
  const doorW = b.style === 'palace' || b.style === 'gate' ? 54 : 36;
  const doorH = 44;
  const doorLeft = b.x + b.w / 2 - doorW / 2;
  const doorTop = b.y + b.h - doorH;
  ctx.fillStyle = '#4A2E1B';
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(doorLeft, b.y + b.h);
  ctx.lineTo(doorLeft, doorTop + 14);
  ctx.quadraticCurveTo(b.x + b.w / 2, doorTop - 6, doorLeft + doorW, doorTop + 14);
  ctx.lineTo(doorLeft + doorW, b.y + b.h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arched Windows
  if (b.w >= 170) {
    const winXs = [b.x + 26, b.x + b.w - 48];
    for (const wx of winXs) {
      ctx.fillStyle = '#7AA8B8';
      ctx.beginPath();
      ctx.roundRect(wx, b.y + 62, 22, 26, [10, 10, 2, 2]);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Building Nameplate Sign
  ctx.font = '700 12px "Gowun Dodum", sans-serif';
  const tw = ctx.measureText(b.name).width;
  ctx.fillStyle = 'rgba(255, 251, 242, 0.94)';
  ctx.strokeStyle = '#A67C4E';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(b.x + b.w / 2 - tw / 2 - 10, b.y - 16, tw + 20, 22, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2A2118';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b.name, b.x + b.w / 2, b.y - 5);

  ctx.restore();
}

function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  variant: 'mango' | 'palm' | 'cypress'
) {
  ctx.save();
  // Shadow
  ctx.fillStyle = 'rgba(42, 33, 24, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Trunk
  ctx.fillStyle = '#734B2D';
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(x - 6, y - 24, 12, 30, 3);
  ctx.fill();
  ctx.stroke();

  if (variant === 'cypress') {
    ctx.fillStyle = '#2E6B46';
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 16);
    ctx.quadraticCurveTo(x, y - 78, x + 16, y - 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (variant === 'palm') {
    ctx.fillStyle = '#4B8E4D';
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      ctx.save();
      ctx.translate(x, y - 26);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(15, 0, 17, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.fillStyle = '#4C8B48';
    ctx.beginPath();
    ctx.arc(x - 10, y - 34, 17, 0, Math.PI * 2);
    ctx.arc(x + 11, y - 33, 16, 0, Math.PI * 2);
    ctx.arc(x, y - 46, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Little mango highlights
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(x - 8, y - 32, 3, 0, Math.PI * 2);
    ctx.arc(x + 9, y - 40, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
