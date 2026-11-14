import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Shield, Sparkles, Wind, X } from 'lucide-react';
import { audioSystem } from '../systems/audioSystem';

interface AurangzebExperienceModalProps {
  alreadyCompleted: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const AurangzebExperienceModal: React.FC<AurangzebExperienceModalProps> = ({
  alreadyCompleted,
  onClose,
  onComplete
}) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  return (
    <div className="fixed inset-0 z-40 bg-[#1A130C]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#FFFDF8] border-2 border-[#8A2424] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 bg-[#8A2424] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#F5C451]" />
            <div>
              <h2 className="text-base font-bold">
                ⚔️ 무굴 군영 · 아우랑제브 시대 특별 체험
              </h2>
              <p className="text-xs text-[#FDE68A]">
                {stage <= 4 ? `${stage}단계 / 4단계 군사 훈련` : '모든 훈련 완수!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          {stage === 1 && <ArcheryStage onSuccess={() => setStage(2)} />}
          {stage === 2 && <CavalryStage onSuccess={() => setStage(3)} />}
          {stage === 3 && <SupplyStage onSuccess={() => setStage(4)} />}
          {stage === 4 && (
            <StrategyMapStage
              onSuccess={() => {
                setStage(5);
                onComplete();
              }}
            />
          )}
          {stage === 5 && (
            <div className="text-center space-y-4 py-3">
              <CheckCircle2 className="w-14 h-14 text-[#16A34A] mx-auto" />
              <h3 className="text-2xl font-bold text-[#2A2118]">
                무굴 군영 4단계 훈련 완수!
              </h3>
              <p className="text-sm text-[#5E4B37] max-w-md mx-auto leading-relaxed">
                아우랑제브 시기 무굴 제국은 활발한 군사 원정으로 남인도까지 영토를 크게 확장했습니다. 동시에 이슬람 제일주의와 인두세 부활 등 앞선 시대와는 다른 통치 정책을 펼쳤습니다.
              </p>
              {!alreadyCompleted ? (
                <div className="p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#92400E]">
                    <Sparkles className="w-4 h-4" />
                    <span>특별 보상 획득</span>
                  </div>
                  <div className="text-base font-bold text-[#78350F] tabular-nums">
                    🪙 +250 무굴 코인 · ⭐ +200 XP
                  </div>
                  <div className="text-xs font-semibold text-[#1F5E57]">
                    특별 아이템 & 가구 해금: 무굴 군영 깃발
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#6B5742]">
                  이미 보상을 획득한 특별 체험이에요. 훈련 복습 완료!
                </div>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl cursor-pointer"
              >
                마을로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Stage 1: Moving Target Archery ---------------- */
const ArcheryStage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [wind, setWind] = useState(1);
  const [failed, setFailed] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const stateRef = useRef({
    targetX: 240,
    targetY: 90,
    dir: 1,
    hits: 0,
    wind: 1,
    ended: false
  });

  const reset = () => {
    stateRef.current = { targetX: 240, targetY: 90, dir: 1, hits: 0, wind: 1, ended: false };
    setHits(0);
    setTimeLeft(25);
    setWind(1);
    setFailed(false);
  };

  useEffect(() => {
    if (failed) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (stateRef.current.hits < 5) {
            stateRef.current.ended = true;
            setFailed(true);
            audioSystem.playWrong();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [failed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const loop = () => {
      const s = stateRef.current;
      if (!s.ended) {
        const speed = 2.4 + s.hits * 0.7;
        s.targetX += s.dir * speed;
        if (s.targetX > 440 || s.targetX < 60) {
          s.dir *= -1;
        }
      }

      const radius = Math.max(16, 30 - s.hits * 2.5);
      ctx.clearRect(0, 0, 500, 220);

      // Range backdrop
      ctx.fillStyle = '#EFE3C8';
      ctx.fillRect(0, 0, 500, 220);
      ctx.fillStyle = '#88B465';
      ctx.fillRect(0, 150, 500, 70);

      // Moving target
      ctx.fillStyle = '#FFFDF8';
      ctx.strokeStyle = '#2C2119';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(s.targetX, s.targetY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(s.targetX, s.targetY, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(s.targetX, s.targetY, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleShoot = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (failed || stateRef.current.ended) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) * 500) / rect.width;
    const clickY = ((e.clientY - rect.top) * 220) / rect.height;

    // Apply slight wind deflection
    const hitX = clickX + stateRef.current.wind * 9;
    const radius = Math.max(16, 30 - stateRef.current.hits * 2.5);
    const dist = Math.hypot(hitX - stateRef.current.targetX, clickY - stateRef.current.targetY);

    audioSystem.playBow();

    if (dist <= radius + 4) {
      const nextHits = stateRef.current.hits + 1;
      stateRef.current.hits = nextHits;
      setHits(nextHits);
      const nextWind = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
      stateRef.current.wind = nextWind;
      setWind(nextWind);
      audioSystem.playCoin();
      if (nextHits >= 5) {
        stateRef.current.ended = true;
        audioSystem.playSuccess();
        setTimeout(() => onSuccessRef.current(), 450);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[#2A2118]">1단계: 이동 표적 활쏘기</h3>
          <p className="text-xs text-[#6B5742]">
            바람 방향을 고려해 움직이는 표적을 클릭하여 5번 명중시키세요!
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold tabular-nums">
          <span className="flex items-center gap-1 text-[#1F5E57]">
            <Wind className="w-4 h-4" />
            바람 {wind > 0 ? `→ +${wind}` : wind < 0 ? `← ${wind}` : '없음'}
          </span>
          <span className="text-[#B45309]">명중 {hits} / 5</span>
          <span className="text-[#991B1B]">남은 시간 {timeLeft}초</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={220}
        onClick={handleShoot}
        className="w-full rounded-xl border-2 border-[#C4A676] cursor-crosshair"
      />

      {failed && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-center space-y-2">
          <div className="text-sm font-bold text-[#991B1B]">
            아쉽습니다! 시간이 다 되었어요. 다시 도전해보세요.
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#8A2424] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            다시 도전
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- Stage 2: Cavalry Obstacle Course ---------------- */
const CavalryStage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lane, setLane] = useState(1);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const laneRef = useRef(1);
  const elapsedRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const obstaclesRef = useRef<{ x: number; lane: number; kind: string }[]>([]);
  const endedRef = useRef(false);

  const moveLane = (delta: number) => {
    if (endedRef.current) return;
    const next = Math.max(0, Math.min(2, laneRef.current + delta));
    if (next === laneRef.current) return;
    laneRef.current = next;
    setLane(next);
    audioSystem.playClick();
  };

  const setExactLane = (targetLane: number) => {
    if (endedRef.current) return;
    const clamped = Math.max(0, Math.min(2, targetLane));
    if (clamped === laneRef.current) return;
    laneRef.current = clamped;
    setLane(clamped);
    audioSystem.playClick();
  };

  const reset = () => {
    laneRef.current = 1;
    elapsedRef.current = 0;
    spawnTimerRef.current = 0;
    setLane(1);
    setProgress(0);
    setFailed(false);
    endedRef.current = false;
    obstaclesRef.current = [];
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        moveLane(-1);
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        moveLane(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DURATION_MS = 8000;
    let rafId = 0;
    let lastTime = performance.now();
    let lastReportedPct = -1;
    const kinds = ['🌳', '🪨', '🪵', '🚧'];

    const loop = (now: number) => {
      const dt = Math.min(50, Math.max(0, now - lastTime));
      lastTime = now;

      if (!endedRef.current) {
        elapsedRef.current += dt;
        spawnTimerRef.current += dt;

        const pct = Math.min(100, Math.round((elapsedRef.current / DURATION_MS) * 100));
        if (pct !== lastReportedPct) {
          lastReportedPct = pct;
          setProgress(pct);
        }

        if (spawnTimerRef.current >= 760 && elapsedRef.current < DURATION_MS - 1200) {
          spawnTimerRef.current = 0;
          obstaclesRef.current.push({
            x: 520,
            lane: Math.floor(Math.random() * 3),
            kind: kinds[Math.floor(Math.random() * kinds.length)]
          });
        }

        const movePx = (dt / 16.67) * 4.4;
        for (const o of obstaclesRef.current) {
          o.x -= movePx;
          if (o.x > 58 && o.x < 96 && o.lane === laneRef.current) {
            endedRef.current = true;
            setFailed(true);
            audioSystem.playWrong();
          }
        }
        obstaclesRef.current = obstaclesRef.current.filter((o) => o.x > -30);

        if (elapsedRef.current >= DURATION_MS && !endedRef.current) {
          endedRef.current = true;
          setProgress(100);
          audioSystem.playSuccess();
          setTimeout(() => onSuccessRef.current(), 450);
        }
      }

      // Draw 3-lane track
      ctx.fillStyle = '#D9BE91';
      ctx.fillRect(0, 0, 500, 210);
      for (let l = 0; l < 3; l++) {
        ctx.strokeStyle = 'rgba(110, 75, 40, 0.3)';
        ctx.setLineDash([10, 8]);
        if (l > 0) {
          ctx.beginPath();
          ctx.moveTo(0, l * 70);
          ctx.lineTo(500, l * 70);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // Highlight active lane subtly
      ctx.fillStyle = 'rgba(255, 253, 248, 0.2)';
      ctx.fillRect(0, laneRef.current * 70, 500, 70);

      // Draw Finish Line when near end
      if (elapsedRef.current >= DURATION_MS - 1400) {
        const finishX = 78 + ((DURATION_MS - elapsedRef.current) / 1400) * 420;
        ctx.fillStyle = '#1F5E57';
        ctx.fillRect(finishX, 0, 8, 210);
      }

      // Draw Player Horse
      const py = laneRef.current * 70 + 35;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.save();
      ctx.translate(78, py);
      ctx.scale(-1, 1);
      ctx.fillText('🐎', 0, 0);
      ctx.restore();

      // Draw Obstacles
      ctx.font = '28px sans-serif';
      for (const o of obstaclesRef.current) {
        ctx.fillText(o.kind, o.x, o.lane * 70 + 35);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[#2A2118]">2단계: 기마 장애물 돌파</h3>
          <p className="text-xs text-[#6B5742]">
            W/S, ↑/↓ 키, 트랙 클릭 또는 위·아래 버튼으로 장애물을 피해 결승선까지 달리세요!
          </p>
        </div>
        <span className="text-xs font-bold text-[#1F5E57] tabular-nums">진행률 {progress}%</span>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={210}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = ((e.clientY - rect.top) * 210) / rect.height;
          setExactLane(Math.floor(y / 70));
        }}
        className="w-full rounded-xl border-2 border-[#C4A676] cursor-pointer"
      />

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => moveLane(-1)}
          disabled={lane === 0}
          className="px-5 py-2.5 bg-[#FAF2E3] hover:bg-[#EFE1C6] border border-[#D4C2A3] rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <ArrowUp className="w-4 h-4" />
          <span>위로 이동</span>
        </button>
        <button
          onClick={() => moveLane(1)}
          disabled={lane === 2}
          className="px-5 py-2.5 bg-[#FAF2E3] hover:bg-[#EFE1C6] border border-[#D4C2A3] rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <ArrowDown className="w-4 h-4" />
          <span>아래로 이동</span>
        </button>
      </div>

      {failed && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-center space-y-2">
          <div className="text-sm font-bold text-[#991B1B]">
            아쉽습니다! 장애물에 부딪혔어요. 다시 도전해보세요.
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#8A2424] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            다시 도전
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- Stage 3: Supply Wagon Packing ---------------- */
const SupplyStage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const MAX_SPACE = 18;
  const ITEMS = [
    { key: 'food', name: '식량', emoji: '🍞', weight: 2, min: 3 },
    { key: 'water', name: '물', emoji: '💧', weight: 1, min: 3 },
    { key: 'fodder', name: '말 먹이', emoji: '🌾', weight: 2, min: 2 },
    { key: 'weapon', name: '무기', emoji: '⚔️', weight: 2, min: 2 }
  ] as const;

  const [counts, setCounts] = useState<Record<string, number>>({
    food: 1,
    water: 1,
    fodder: 1,
    weapon: 1
  });
  const [error, setError] = useState<string | null>(null);

  const usedSpace = ITEMS.reduce((acc, it) => acc + counts[it.key] * it.weight, 0);

  const adjust = (key: string, delta: number, weight: number) => {
    const nextVal = counts[key] + delta;
    if (nextVal < 0) return;
    if (delta > 0 && usedSpace + weight > MAX_SPACE) {
      setError('수레 공간이 가득 찼어요! 균형 있게 조절해보세요.');
      return;
    }
    setError(null);
    audioSystem.playClick();
    setCounts((prev) => ({ ...prev, [key]: nextVal }));
  };

  const handleConfirm = () => {
    const lacking = ITEMS.filter((it) => counts[it.key] < it.min);
    if (lacking.length > 0) {
      audioSystem.playWrong();
      setError(
        `아쉽습니다! 원정에 꼭 필요한 ${lacking.map((l) => `${l.name}(최소 ${l.min}개)`).join(', ')}이 부족해요. 다시 조절해보세요.`
      );
      return;
    }
    audioSystem.playSuccess();
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[#2A2118]">3단계: 군량 수송 수레 꾸리기</h3>
          <p className="text-xs text-[#6B5742]">
            제한된 수레 공간({MAX_SPACE}칸) 안에 병사와 말을 위한 필수 물자를 빠짐없이 실어주세요!
          </p>
        </div>
        <span className="text-sm font-bold text-[#1F5E57] tabular-nums">
          공간 {usedSpace} / {MAX_SPACE}칸
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ITEMS.map((it) => (
          <div
            key={it.key}
            className="p-3.5 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-[#2A2118]">
                {it.emoji} {it.name}
              </div>
              <div className="text-[11px] text-[#6B5742] tabular-nums">
                개당 {it.weight}칸 · 최소 {it.min}개 필요
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjust(it.key, -1, it.weight)}
                className="w-8 h-8 rounded-lg bg-white border border-[#D4C2A3] font-bold cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center font-bold tabular-nums">{counts[it.key]}</span>
              <button
                onClick={() => adjust(it.key, 1, it.weight)}
                className="w-8 h-8 rounded-lg bg-white border border-[#D4C2A3] font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleConfirm}
          className="px-5 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-sm font-semibold rounded-xl cursor-pointer"
        >
          수레 출발시키기
        </button>
      </div>
    </div>
  );
};

/* ---------------- Stage 4: Strategic Campaign Map ---------------- */
const StrategyMapStage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [selectedRoute, setSelectedRoute] = useState<'mountain' | 'river' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChoose = () => {
    if (!selectedRoute) return;
    if (selectedRoute === 'river') {
      audioSystem.playSuccess();
      onSuccess();
    } else {
      audioSystem.playWrong();
      setFeedback(
        '아쉽습니다! 험준한 산악 지름길은 시간은 빠르지만 강과 보급로가 끊겨 대군이 식량과 물을 조달하기 매우 어렵습니다. 안전한 보급로를 다시 선택해보세요!'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#2A2118]">4단계: 남인도 원정 전략 지도</h3>
        <p className="text-xs text-[#6B5742]">
          강과 산, 마을, 도로, 보급로를 살펴보고 대규모 군대가 안전하게 남인도 거점까지 이동할 경로를 선택하세요.
        </p>
      </div>

      {/* Illustrated SVG Strategic Map */}
      <div className="bg-[#EFE3C8] border-2 border-[#C4A676] rounded-xl p-3">
        <svg viewBox="0 0 500 200" className="w-full h-44 block">
          {/* River */}
          <path d="M 40 165 Q 170 120 290 155 T 465 130" fill="none" stroke="#3B8EA5" strokeWidth="14" strokeLinecap="round" opacity="0.7" />
          {/* Mountains */}
          <polygon points="180,65 215,20 250,65" fill="#8C6D4F" />
          <polygon points="225,70 265,18 305,70" fill="#73573D" />
          {/* Route A: Mountain Shortcut */}
          <path
            d="M 55 95 Q 245 35 445 95"
            fill="none"
            stroke={selectedRoute === 'mountain' ? '#DC2626' : '#9A3412'}
            strokeWidth={selectedRoute === 'mountain' ? 5 : 3}
            strokeDasharray="7 5"
          />
          {/* Route B: River Supply Road */}
          <path
            d="M 55 95 Q 180 155 290 140 T 445 95"
            fill="none"
            stroke={selectedRoute === 'river' ? '#047857' : '#1F5E57'}
            strokeWidth={selectedRoute === 'river' ? 5 : 3}
          />
          {/* Villages & Nodes */}
          <circle cx="55" cy="95" r="10" fill="#1F5E57" />
          <text x="55" y="122" fontSize="11" textAnchor="middle" fill="#2A2118" fontWeight="700">무굴 본영</text>
          <circle cx="190" cy="140" r="7" fill="#D97706" />
          <text x="190" y="162" fontSize="10" textAnchor="middle" fill="#2A2118">마을 · 보급로</text>
          <circle cx="320" cy="136" r="7" fill="#D97706" />
          <text x="320" y="158" fontSize="10" textAnchor="middle" fill="#2A2118">강변 도로</text>
          <circle cx="445" cy="95" r="10" fill="#991B1B" />
          <text x="445" y="122" fontSize="11" textAnchor="middle" fill="#2A2118" fontWeight="700">남인도 거점</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            audioSystem.playClick();
            setSelectedRoute('mountain');
            setFeedback(null);
          }}
          className={`p-3.5 rounded-xl border text-left cursor-pointer ${
            selectedRoute === 'mountain'
              ? 'bg-[#FEF2F2] border-[#DC2626]'
              : 'bg-[#FAF4E8] border-[#E2CFA8] hover:bg-[#F3E9D7]'
          }`}
        >
          <div className="text-sm font-bold text-[#991B1B]">⛰️ 산악 지름길</div>
          <div className="text-xs text-[#5E4B37] mt-1">
            거리가 짧아 빠르지만, 산세가 험해 보급로 연결이 어렵습니다.
          </div>
        </button>

        <button
          onClick={() => {
            audioSystem.playClick();
            setSelectedRoute('river');
            setFeedback(null);
          }}
          className={`p-3.5 rounded-xl border text-left cursor-pointer ${
            selectedRoute === 'river'
              ? 'bg-[#ECFDF5] border-[#047857]'
              : 'bg-[#FAF4E8] border-[#E2CFA8] hover:bg-[#F3E9D7]'
          }`}
        >
          <div className="text-sm font-bold text-[#065F46]">🌊 강변 보급 도로</div>
          <div className="text-xs text-[#5E4B37] mt-1">
            시간은 조금 더 걸리지만 마을과 강이 이어져 안전하게 군량을 보급할 수 있습니다.
          </div>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-xl">
          {feedback}
        </div>
      )}

      <div className="flex justify-end">
        <button
          disabled={!selectedRoute}
          onClick={handleChoose}
          className="px-5 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50"
        >
          이동 경로 확정
        </button>
      </div>
    </div>
  );
};
