import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BedDouble,
  BookOpen,
  Moon,
  RotateCw,
  ShoppingBag,
  Sun,
  Trash2
} from 'lucide-react';
import { FURNITURE_CATALOG, HOUSE_LEVELS } from '../data/itemFurnitureData';
import { getFeaturedNpcForDay } from '../data/npcData';
import { audioSystem } from '../systems/audioSystem';
import { drawMughalCharacter } from '../systems/characterRenderer';
import { drawRealisticMughalFurniture } from '../systems/furnitureRenderer';
import { calculateHouseCharm } from '../systems/gameLogic';
import { GameSaveData, PlacedFurniture } from '../types/game';
import { FurniturePreview } from './FurniturePreview';

interface HouseCanvasProps {
  gameState: GameSaveData;
  onUpdateLayout: (layout: PlacedFurniture[]) => void;
  onOpenShop: () => void;
  onOpenRecord: () => void;
  onExitHouse: () => void;
  onCompleteSleep: () => void;
}

type SleepPhase = 'idle' | 'walking_to_bed' | 'lights_out' | 'night_message' | 'morning_wake';

export const HouseCanvas: React.FC<HouseCanvasProps> = ({
  gameState,
  onUpdateLayout,
  onOpenShop,
  onOpenRecord,
  onExitHouse,
  onCompleteSleep
}) => {
  const houseMeta =
    HOUSE_LEVELS.find((h) => h.level === gameState.houseLevel) || HOUSE_LEVELS[0];
  const roomW = houseMeta.roomWidth;
  const roomH = houseMeta.roomHeight;
  const charmScore = calculateHouseCharm(gameState.houseLayout);
  const nextLevelMeta = HOUSE_LEVELS.find((h) => h.level === gameState.houseLevel + 1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const [sleepPhase, setSleepPhase] = useState<SleepPhase>('idle');
  const [sleepWarning, setSleepWarning] = useState<string | null>(null);

  const playerRoomPosRef = useRef({ x: roomW / 2, y: roomH - 52 });
  const isSleepingRef = useRef(false);

  // Count how many of each furniture are currently placed
  const placedCounts: Record<string, number> = {};
  for (const p of gameState.houseLayout) {
    placedCounts[p.furnitureId] = (placedCounts[p.furnitureId] || 0) + 1;
  }

  // Owned furniture available in storage to place
  const availableToPlace = FURNITURE_CATALOG.filter((f) => {
    const owned = gameState.furniture[f.id] || 0;
    const placed = placedCounts[f.id] || 0;
    return owned > placed;
  });

  const handlePlaceItem = (furnitureId: string) => {
    audioSystem.playClick();
    const newItem: PlacedFurniture = {
      instanceId: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      furnitureId,
      x: Math.round(roomW / 2 - 25),
      y: Math.round(roomH / 2 - 20),
      rotation: 0
    };
    const next = [...gameState.houseLayout, newItem];
    onUpdateLayout(next);
    setSelectedInstanceId(newItem.instanceId);
  };

  const handleRotateSelected = () => {
    if (!selectedInstanceId) return;
    audioSystem.playClick();
    const next = gameState.houseLayout.map((item) =>
      item.instanceId === selectedInstanceId
        ? { ...item, rotation: ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
        : item
    );
    onUpdateLayout(next);
  };

  const handleRemoveSelected = () => {
    if (!selectedInstanceId) return;
    const target = gameState.houseLayout.find((i) => i.instanceId === selectedInstanceId);
    // Keep at least one bed in the house so the player can always sleep
    if (
      target?.furnitureId === 'bed' &&
      gameState.houseLayout.filter((i) => i.furnitureId === 'bed').length <= 1
    ) {
      setSleepWarning('침대는 잠을 자기 위해 최소 1개가 집 안에 있어야 해요!');
      setTimeout(() => setSleepWarning(null), 2600);
      return;
    }
    audioSystem.playClick();
    onUpdateLayout(gameState.houseLayout.filter((i) => i.instanceId !== selectedInstanceId));
    setSelectedInstanceId(null);
  };

  const triggerSleepFlow = () => {
    if (sleepPhase !== 'idle') return;
    if (gameState.currentDay <= 7 && !gameState.todayTaskCompleted) {
      const featured = getFeaturedNpcForDay(gameState.currentDay);
      audioSystem.playWrong();
      if (gameState.currentDay === 7) {
        setSleepWarning(
          '7일차에는 두 특별 체험을 모두 완료해야 해요! 마을의 🕌 종교와 문화의 광장(아크바르)과 ⚔️ 무굴 군영(아우랑제브)에서 특별 체험을 모두 마친 뒤 잠자리에 들 수 있습니다.'
        );
      } else {
        setSleepWarning(
          `아직 오늘의 주요 주민(${featured.emoji} ${featured.name})과 활동을 완료하지 않았어요! 마을에서 이야기를 듣고 퀴즈를 푼 뒤에 잠자리에 들 수 있습니다.`
        );
      }
      setTimeout(() => setSleepWarning(null), 4200);
      return;
    }

    const bed = gameState.houseLayout.find((i) => i.furnitureId === 'bed');
    const bedCenterX = bed ? bed.x + 42 : 95;
    const bedCenterY = bed ? bed.y + 30 : 95;

    setSelectedInstanceId(null);
    setSleepPhase('walking_to_bed');
    audioSystem.playSleep();

    const startX = playerRoomPosRef.current.x;
    const startY = playerRoomPosRef.current.y;
    const startT = performance.now();

    const stepWalk = (now: number) => {
      const t = Math.min(1, (now - startT) / 700);
      playerRoomPosRef.current = {
        x: startX + (bedCenterX - startX) * t,
        y: startY + (bedCenterY - startY) * t
      };
      if (t < 1) {
        requestAnimationFrame(stepWalk);
      } else {
        isSleepingRef.current = true;
        setSleepPhase('lights_out');
        setTimeout(() => setSleepPhase('night_message'), 750);
        setTimeout(() => {
          setSleepPhase('morning_wake');
          audioSystem.playMorning();
        }, 2300);
        setTimeout(() => {
          isSleepingRef.current = false;
          setSleepPhase('idle');
          playerRoomPosRef.current = { x: roomW / 2, y: roomH - 52 };
          onCompleteSleep();
        }, 3700);
      }
    };
    requestAnimationFrame(stepWalk);
  };

  // Render 2.5D Room Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = roomW * dpr;
      canvas.height = roomH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Realistic Sandstone / Inlaid Marble Mughal Flooring
      const floorGrad = ctx.createLinearGradient(0, 58, 0, roomH);
      floorGrad.addColorStop(0, houseMeta.floorColor);
      floorGrad.addColorStop(1, '#D3BA93');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 58, roomW, roomH - 58);

      // Diamond & octagonal Mughal floor tile pattern
      ctx.strokeStyle = 'rgba(115, 78, 38, 0.16)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= roomW; gx += 44) {
        ctx.beginPath();
        ctx.moveTo(gx, 62);
        ctx.lineTo(gx, roomH);
        ctx.stroke();
      }
      for (let gy = 62; gy <= roomH; gy += 44) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(roomW, gy);
        ctx.stroke();
      }
      // Subtle inlaid marble diamond accents at tile intersections
      ctx.fillStyle = 'rgba(255, 250, 240, 0.25)';
      for (let gx = 44; gx < roomW; gx += 44) {
        for (let gy = 106; gy < roomH; gy += 44) {
          ctx.beginPath();
          ctx.moveTo(gx, gy - 4);
          ctx.lineTo(gx + 4, gy);
          ctx.lineTo(gx, gy + 4);
          ctx.lineTo(gx - 4, gy);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Back Mughal Sandstone / Marble Wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, 62);
      wallGrad.addColorStop(0, houseMeta.wallColor);
      wallGrad.addColorStop(1, '#9E744B');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, roomW, 62);

      // Lower dado trim & soft wall shadow onto floor
      ctx.fillStyle = '#754C29';
      ctx.fillRect(0, 56, roomW, 6);
      ctx.fillStyle = 'rgba(42, 26, 12, 0.14)';
      ctx.fillRect(0, 62, roomW, 8);

      // Cusped Mughal arches & Jali arched windows along back wall
      const archCount = Math.floor(roomW / 120);
      for (let i = 0; i < archCount; i++) {
        const ax = 42 + i * 120;
        const isWindow = i % 2 === 1;
        if (isWindow) {
          // Jali arched window looking outside
          ctx.fillStyle = gameState.timeOfDay === 'night' ? '#1E293B' : gameState.timeOfDay === 'evening' ? '#F59E0B' : '#93C5FD';
          ctx.beginPath();
          ctx.moveTo(ax + 6, 54);
          ctx.lineTo(ax + 6, 22);
          ctx.quadraticCurveTo(ax + 26, 8, ax + 46, 22);
          ctx.lineTo(ax + 46, 54);
          ctx.closePath();
          ctx.fill();
          // Jali lattice bars
          ctx.strokeStyle = 'rgba(255, 248, 232, 0.72)';
          ctx.lineWidth = 1.2;
          for (let wx = ax + 14; wx <= ax + 38; wx += 8) {
            ctx.beginPath();
            ctx.moveTo(wx, 17);
            ctx.lineTo(wx, 54);
            ctx.stroke();
          }
        }
        // Ornate carved sandstone arch frame
        ctx.strokeStyle = 'rgba(255, 244, 218, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, 55);
        ctx.lineTo(ax, 23);
        ctx.quadraticCurveTo(ax + 12, 17, ax + 26, 7);
        ctx.quadraticCurveTo(ax + 40, 17, ax + 52, 23);
        ctx.lineTo(ax + 52, 55);
        ctx.stroke();
      }

      // Rugs / floor items rendered underneath furniture
      const floorItems = gameState.houseLayout.filter((item) => {
        const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
        return def?.category === 'floor';
      });
      const upperItems = gameState.houseLayout.filter((item) => {
        const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
        return def?.category !== 'floor';
      });

      const drawItem = (item: PlacedFurniture) => {
        const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
        if (!def) return;
        const rotated = item.rotation === 90 || item.rotation === 270;
        const w = rotated ? def.h : def.w;
        const h = rotated ? def.w : def.h;

        ctx.save();
        ctx.translate(item.x + w / 2, item.y + h / 2);
        ctx.rotate((item.rotation * Math.PI) / 180);

        // Selection ring
        if (selectedInstanceId === item.instanceId) {
          ctx.strokeStyle = '#1F5E57';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 4]);
          ctx.strokeRect(-def.w / 2 - 5, -def.h / 2 - 5, def.w + 10, def.h + 10);
          ctx.setLineDash([]);
        }

        drawRealisticMughalFurniture(
          ctx,
          def.id,
          def.w,
          def.h,
          def.color,
          def.accentColor,
          sleepPhase === 'idle' || sleepPhase === 'walking_to_bed'
        );
        ctx.restore();
      };

      for (const fi of floorItems) drawItem(fi);
      for (const ui of upperItems.sort((a, b) => a.y - b.y)) drawItem(ui);

      // Draw Player inside the house
      drawMughalCharacter(ctx, playerRoomPosRef.current.x, playerRoomPosRef.current.y, gameState.appearance, {
        scale: 1,
        walkPhase: tick,
        isWalking: sleepPhase === 'walking_to_bed',
        isSleeping: isSleepingRef.current,
        label: isSleepingRef.current ? undefined : gameState.playerName
      });

      // Exit doormat at bottom center
      ctx.fillStyle = '#8C583A';
      ctx.beginPath();
      ctx.roundRect(roomW / 2 - 34, roomH - 14, 68, 12, 4);
      ctx.fill();

      // Dim room when lights go out
      if (sleepPhase === 'lights_out') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(0, 0, roomW, roomH);
      }

      tick += 0.06;
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [gameState.houseLayout, gameState.appearance, gameState.playerName, gameState.timeOfDay, houseMeta, roomW, roomH, selectedInstanceId, sleepPhase]);

  // Canvas pointer interaction for dragging furniture or clicking bed
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = roomW / rect.width;
    const scaleY = roomH / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sleepPhase !== 'idle') return;
    const { x, y } = getCanvasCoords(e);

    // Search top-most item first
    for (let i = gameState.houseLayout.length - 1; i >= 0; i--) {
      const item = gameState.houseLayout[i];
      const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
      if (!def) continue;
      const rotated = item.rotation === 90 || item.rotation === 270;
      const w = rotated ? def.h : def.w;
      const h = rotated ? def.w : def.h;

      if (x >= item.x && x <= item.x + w && y >= item.y && y <= item.y + h) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setSelectedInstanceId(item.instanceId);
        setDraggingId(item.instanceId);
        dragOffsetRef.current = { dx: x - item.x, dy: y - item.y };
        return;
      }
    }
    setSelectedInstanceId(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingId) return;
    const { x, y } = getCanvasCoords(e);
    const next = gameState.houseLayout.map((item) => {
      if (item.instanceId !== draggingId) return item;
      const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
      const rotated = item.rotation === 90 || item.rotation === 270;
      const w = def ? (rotated ? def.h : def.w) : 40;
      const h = def ? (rotated ? def.w : def.h) : 40;
      const nx = Math.max(8, Math.min(roomW - w - 8, Math.round(x - dragOffsetRef.current.dx)));
      const ny = Math.max(24, Math.min(roomH - h - 18, Math.round(y - dragOffsetRef.current.dy)));
      return { ...item, x: nx, y: ny };
    });
    onUpdateLayout(next);
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const selectedItem = gameState.houseLayout.find((i) => i.instanceId === selectedInstanceId);
  const selectedDef = selectedItem
    ? FURNITURE_CATALOG.find((f) => f.id === selectedItem.furnitureId)
    : null;

  return (
    <div className="relative w-full h-full overflow-y-auto bg-[#F1E7D5] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* House Header Bar */}
        <div className="bg-[#FFFDF8] border border-[#DFD2BC] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6432]">
              <span>🏠 {gameState.playerName}의 집</span>
              <span>·</span>
              <span>집 Lv.{gameState.houseLevel} ({houseMeta.name})</span>
              <span>·</span>
              <span className="tabular-nums">매력 점수 {charmScore}점</span>
            </div>
            <p className="text-xs text-[#6B5742] mt-0.5">
              {nextLevelMeta
                ? `다음 레벨(${nextLevelMeta.name})까지 ${Math.max(0, nextLevelMeta.minCharm - charmScore)}점 남았어요! 가구를 드래그해 자유롭게 꾸며보세요.`
                : '최고 등급의 무굴 궁전을 완성했어요!'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRecord}
              className="px-3.5 py-2 text-xs font-semibold bg-[#FAF2E3] hover:bg-[#F3E4CA] text-[#4A3A2A] border border-[#DEC9A4] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>오늘의 기록</span>
            </button>
            <button
              onClick={onOpenShop}
              className="px-3.5 py-2 text-xs font-semibold bg-[#B46924] hover:bg-[#99571B] text-white rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>가구 상점</span>
            </button>
            <button
              onClick={triggerSleepFlow}
              className="px-4 py-2 text-xs font-semibold bg-[#1F5E57] hover:bg-[#174842] text-white rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>침대에서 잠자기</span>
            </button>
            <button
              onClick={onExitHouse}
              className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-[#F6EFE2] text-[#2A2118] border border-[#D4C2A3] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>마을로 나가기</span>
            </button>
          </div>
        </div>

        {/* Warning or Arrival prompt */}
        {sleepWarning && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] px-4 py-3 rounded-xl text-sm font-medium">
            {sleepWarning}
          </div>
        )}

        {(gameState.todayTaskCompleted || gameState.currentDay > 7) && sleepPhase === 'idle' && (
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium">
              {gameState.currentDay > 7
                ? '🏠 집에 도착했습니다! 집을 꾸미거나 원할 때 침대에서 잠을 자며 다음 날로 넘어갈 수 있어요.'
                : '🏠 집에 도착했습니다! 오늘의 기록을 확인하고 침대에서 잠자리에 들어보세요.'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRecord}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#6EE7B7] rounded-lg hover:bg-[#D1FAE5] cursor-pointer"
              >
                📖 오늘의 기록
              </button>
              <button
                onClick={triggerSleepFlow}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#047857] text-white rounded-lg hover:bg-[#065F46] cursor-pointer"
              >
                🛏️ 잠자기
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace: Room Canvas + Furniture Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#DFD2BC] rounded-2xl p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 text-xs text-[#6B5742]">
              <span>가구를 마우스나 손가락으로 끌어 위치를 옮겨보세요</span>
              {selectedDef && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1F5E57]">선택됨: {selectedDef.name}</span>
                  <button
                    onClick={handleRotateSelected}
                    className="px-2.5 py-1 bg-[#FAF2E3] hover:bg-[#EFE1C6] border border-[#D4C2A3] rounded-md text-xs font-semibold text-[#2A2118] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>회전</span>
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="px-2.5 py-1 bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] rounded-md text-xs font-semibold text-[#991B1B] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>치우기</span>
                  </button>
                  {selectedDef.id === 'bed' && (
                    <button
                      onClick={triggerSleepFlow}
                      className="px-2.5 py-1 bg-[#1F5E57] text-white rounded-md text-xs font-semibold cursor-pointer"
                    >
                      🛏️ 잠자기
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="w-full overflow-x-auto flex justify-center">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ width: roomW, height: roomH, maxWidth: '100%' }}
                className="rounded-xl border-4 border-[#9C734B] shadow-inner touch-none cursor-grab active:cursor-grabbing"
              />
            </div>
          </div>

          {/* Storage / Available Furniture Drawer */}
          <div className="lg:col-span-4 bg-[#FFFDF8] border border-[#DFD2BC] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2A2118]">보유 가구 배치하기</h3>
              <span className="text-xs text-[#7A6650] tabular-nums">
                배치됨 {gameState.houseLayout.length}개
              </span>
            </div>

            {availableToPlace.length === 0 ? (
              <div className="p-4 bg-[#FAF4E8] border border-[#E6D7BC] rounded-xl text-center space-y-2">
                <p className="text-xs text-[#6B5742]">
                  보관함에 남아 있는 가구가 없어요. 가구 상점에서 새로운 가구를 구매해보세요!
                </p>
                <button
                  onClick={onOpenShop}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#B46924] text-white rounded-lg hover:bg-[#99571B] cursor-pointer"
                >
                  가구 상점 열기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {availableToPlace.map((item) => {
                  const owned = gameState.furniture[item.id] || 0;
                  const placed = placedCounts[item.id] || 0;
                  const left = owned - placed;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#FAF4E8] border border-[#E5D6BC] rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-[#EFE4CE] border border-[#D4C2A3] flex items-center justify-center shrink-0">
                          <FurniturePreview item={item} size={38} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#2A2118] truncate">
                            {item.name} <span className="text-[#8C6432]">(보유 {left})</span>
                          </div>
                          <div className="text-[11px] text-[#6B5742] tabular-nums">
                            매력 +{item.charmPoints}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlaceItem(item.id)}
                        className="px-3 py-1.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-xs font-semibold rounded-lg cursor-pointer shrink-0"
                      >
                        배치
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Night -> Morning Sleep Animation Overlay */}
      {(sleepPhase === 'night_message' || sleepPhase === 'morning_wake') && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-colors duration-700 ${
            sleepPhase === 'night_message'
              ? 'bg-[#0F172A] text-[#F8FAFC]'
              : 'bg-gradient-to-b from-[#FDE68A] via-[#FEF3C7] to-[#FFFDF8] text-[#2A2118]'
          }`}
        >
          {sleepPhase === 'night_message' ? (
            <div className="text-center space-y-4">
              <Moon className="w-16 h-16 mx-auto text-[#FDE047]" />
              <h2 className="text-2xl sm:text-3xl font-bold">「오늘도 수고했어요!」</h2>
              <p className="text-sm text-[#CBD5E1]">
                무굴 제국 {gameState.currentDay}일째 밤이 깊어가고 있습니다...
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Sun className="w-16 h-16 mx-auto text-[#D97706]" />
              <h2 className="text-2xl sm:text-3xl font-bold">「좋은 아침!」</h2>
              <p className="text-lg font-semibold text-[#B45309]">
                ☀️ 무굴 제국 {gameState.currentDay + 1}일째가 밝았습니다!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
