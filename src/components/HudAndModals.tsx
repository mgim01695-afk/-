import React from 'react';
import {
  Award,
  Backpack,
  BookText,
  Home,
  LogOut,
  Map as MapIcon,
  ScrollText,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { ACHIEVEMENTS_DATA, HISTORY_NOTES_DATA } from '../data/historyAchievementData';
import { FURNITURE_CATALOG } from '../data/itemFurnitureData';
import { LOCATION_ZONES } from '../data/mapData';
import { NPC_DATA, getFeaturedNpcForDay } from '../data/npcData';
import { xpForNextLevel } from '../systems/gameLogic';
import { GameSaveData } from '../types/game';

export type ActivePanel = 'none' | 'notes' | 'bag' | 'achievements' | 'record' | 'map';

interface TopHudProps {
  gameState: GameSaveData;
  scene: 'village' | 'house';
  muted: boolean;
  onToggleMute: () => void;
  onOpenPanel: (panel: ActivePanel) => void;
  onToggleHouse: () => void;
  onReturnTitle: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  gameState,
  scene,
  muted,
  onToggleMute,
  onOpenPanel,
  onToggleHouse,
  onReturnTitle
}) => {
  const nextXp = xpForNextLevel(gameState.level);

  return (
    <header className="w-full bg-[#FFFDF8] border-b border-[#DFD2BC] px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 z-30 shrink-0">
      {/* Left: Day & Era + Vital Stats */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2A2118] whitespace-nowrap">
          <span>{gameState.timeOfDay === 'night' ? '🌙' : gameState.timeOfDay === 'evening' ? '🌇' : '☀️'}</span>
          <span className="tabular-nums">무굴 제국 {gameState.currentDay}일째</span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold tabular-nums text-[#2A2118]">
          <span title="체력" className="whitespace-nowrap">
            ❤️ {gameState.health}/{gameState.maxHealth}
          </span>
          <span title="무굴 코인" className="text-[#9C571B] whitespace-nowrap">
            🪙 {gameState.coins}
          </span>
          <span title="레벨과 경험치" className="text-[#1F5E57] whitespace-nowrap">
            ⭐ Lv.{gameState.level} ({gameState.experience}/{nextXp})
          </span>
        </div>
      </div>

      {/* Right: Functional Game Menu Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <button
          onClick={() => onOpenPanel('notes')}
          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF3E4] hover:bg-[#F1E4C8] text-[#2A2118] border border-[#DFCCA8] rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <ScrollText className="w-3.5 h-3.5 text-[#B46924]" />
          <span>역사 노트</span>
          <span className="text-[11px] text-[#7A6650] tabular-nums">
            ({gameState.historyNotes.length}/{HISTORY_NOTES_DATA.length})
          </span>
        </button>

        <button
          onClick={() => onOpenPanel('bag')}
          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF3E4] hover:bg-[#F1E4C8] text-[#2A2118] border border-[#DFCCA8] rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Backpack className="w-3.5 h-3.5 text-[#1F5E57]" />
          <span>가방</span>
        </button>

        <button
          onClick={onToggleHouse}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            scene === 'house'
              ? 'bg-[#1F5E57] text-white border-[#1F5E57]'
              : 'bg-[#FAF3E4] hover:bg-[#F1E4C8] text-[#2A2118] border-[#DFCCA8]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{scene === 'house' ? '마을로' : `집 Lv.${gameState.houseLevel}`}</span>
        </button>

        <button
          onClick={() => onOpenPanel('map')}
          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF3E4] hover:bg-[#F1E4C8] text-[#2A2118] border border-[#DFCCA8] rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <MapIcon className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="hidden md:inline">마을 지도</span>
        </button>

        <button
          onClick={() => onOpenPanel('achievements')}
          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF3E4] hover:bg-[#F1E4C8] text-[#2A2118] border border-[#DFCCA8] rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Award className="w-3.5 h-3.5 text-[#D97706]" />
          <span className="hidden md:inline">업적</span>
          <span className="text-[11px] text-[#7A6650] tabular-nums">
            ({gameState.achievements.length}/{ACHIEVEMENTS_DATA.length})
          </span>
        </button>

        <button
          onClick={() => onOpenPanel('record')}
          title="오늘의 기록"
          className="p-1.5 text-[#5E4B37] hover:bg-[#FAF3E4] border border-transparent hover:border-[#DFCCA8] rounded-lg cursor-pointer"
        >
          <BookText className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMute}
          title={muted ? '소리 켜기' : '소리 끄기'}
          className="p-1.5 text-[#5E4B37] hover:bg-[#FAF3E4] border border-transparent hover:border-[#DFCCA8] rounded-lg cursor-pointer"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onReturnTitle}
          title="시작 화면으로"
          className="p-1.5 text-[#5E4B37] hover:bg-[#FEE2E2] hover:text-[#991B1B] rounded-lg cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

interface InfoPanelsModalProps {
  activePanel: ActivePanel;
  gameState: GameSaveData;
  onClose: () => void;
  onTriggerSleepFromRecord?: () => void;
}

export const InfoPanelsModal: React.FC<InfoPanelsModalProps> = ({
  activePanel,
  gameState,
  onClose,
  onTriggerSleepFromRecord
}) => {
  if (activePanel === 'none') return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#1A130C]/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#FFFDF8] border-2 border-[#D4B98C] rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 bg-[#FAF1E0] border-b border-[#E5D4B3] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2A2118]">
            {activePanel === 'notes' && '📜 역사 노트'}
            {activePanel === 'bag' && '🎒 가방'}
            {activePanel === 'achievements' && '🏆 업적'}
            {activePanel === 'record' && '📖 오늘의 기록'}
            {activePanel === 'map' && '🗺️ 무굴 제국 마을 지도'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B5742] hover:bg-[#EFE2CA] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* History Notes Panel */}
          {activePanel === 'notes' && (
            <div className="space-y-5">
              {(['정치', '경제', '문화'] as const).map((sec) => {
                const entries = HISTORY_NOTES_DATA.filter((n) => n.section === sec);
                const subGroups = Array.from(new Set(entries.map((e) => e.subGroup)));
                return (
                  <div key={sec} className="space-y-2.5">
                    <h3 className="text-sm font-bold text-[#1F5E57] border-b border-[#E5D6BC] pb-1">
                      [{sec}]
                    </h3>
                    {subGroups.map((sg) => (
                      <div key={sg} className="space-y-1.5">
                        <div className="text-xs font-bold text-[#8C6432]">{sg}</div>
                        <div className="grid grid-cols-1 gap-2">
                          {entries
                            .filter((e) => e.subGroup === sg)
                            .map((entry) => {
                              const unlocked = gameState.historyNotes.includes(entry.id);
                              return (
                                <div
                                  key={entry.id}
                                  className={`p-3 rounded-xl border text-xs ${
                                    unlocked
                                      ? 'bg-[#FAF5EB] border-[#E2CFA8] text-[#2A2118]'
                                      : 'bg-[#F4F1EA] border-[#E5E0D5] text-[#8B8174]'
                                  }`}
                                >
                                  <div className="font-bold">
                                    - {unlocked ? entry.title : '???'}
                                  </div>
                                  <div className="mt-0.5 leading-relaxed">
                                    {unlocked
                                      ? entry.summary
                                      : '마을 주민들과 대화하거나 퀴즈를 풀면 기록됩니다.'}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bag Panel */}
          {activePanel === 'bag' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#2A2118] mb-2">수집한 아이템</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {gameState.inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#FAF5EB] border border-[#E2CFA8] rounded-xl"
                    >
                      <div className="text-xs font-bold text-[#2A2118]">{item.name}</div>
                      <p className="text-[11px] text-[#5E4B37] mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#2A2118] mb-2">보유 중인 가구</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(gameState.furniture)
                    .filter(([, count]) => count > 0)
                    .map(([fid, count]) => {
                      const def = FURNITURE_CATALOG.find((f) => f.id === fid);
                      return (
                        <div
                          key={fid}
                          className="p-2.5 bg-[#F4F8F7] border border-[#CBE0DC] rounded-lg text-xs"
                        >
                          <div className="font-bold text-[#1F5E57]">
                            {def?.name || fid} × {count}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Panel */}
          {activePanel === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACHIEVEMENTS_DATA.map((ach) => {
                const done = gameState.achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-xl border ${
                      done
                        ? 'bg-[#FEF9EC] border-[#EAB308]'
                        : 'bg-[#F5F2EB] border-[#E2DDD3] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#2A2118]">
                        {done ? '🏆' : '🔒'} {ach.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[#9C571B] tabular-nums">
                        +{ach.rewardCoins}코인
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5E4B37] mt-1">{ach.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Daily Record Panel */}
          {activePanel === 'record' && (
            <div className="space-y-4">
              <div className="p-5 bg-[#FAF4E8] border border-[#DFCFAF] rounded-xl space-y-3 text-sm">
                <div className="font-bold text-base text-[#2A2118] border-b border-[#E5D6BC] pb-2">
                  ☀️ 무굴 제국 {gameState.currentDay}일째
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5742]">
                    {gameState.currentDay === 7
                      ? '오늘의 일정'
                      : gameState.currentDay > 7
                      ? '오늘의 탐험'
                      : '오늘 만난 주요 주민'}
                  </span>
                  <span className="font-bold text-[#2A2118]">
                    {gameState.currentDay === 7
                      ? '✨ 아크바르·아우랑제브 특별 체험'
                      : gameState.currentDay > 7
                      ? '🧭 자유 탐험 (원하는 주민과 대화)'
                      : `${gameState.todayRecord.featuredNpcEmoji} ${gameState.todayRecord.featuredNpcName}`}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B5742] shrink-0">오늘 배운 내용</span>
                  <span className="font-semibold text-[#1F5E57] text-right">
                    📜 {gameState.todayRecord.learnedTopic}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5742]">
                    {gameState.currentDay === 7 ? '특별 체험 진행' : '오늘의 퀴즈'}
                  </span>
                  <span className="font-bold">
                    {gameState.currentDay === 7
                      ? gameState.akbarProgress.completed && gameState.aurangzebProgress.completed
                        ? '⭕ 두 특별 체험 완료'
                        : `⏳ 광장(${gameState.akbarProgress.completed ? '완료' : '미완료'}) · 군영(${gameState.aurangzebProgress.completed ? '완료' : '미완료'})`
                      : gameState.todayRecord.quizSolved
                      ? '⭕ 정답 완료'
                      : gameState.currentDay > 7
                      ? '✨ 자유 선택'
                      : '⏳ 아직 진행 중'}
                  </span>
                </div>
                <div className="flex justify-between tabular-nums">
                  <span className="text-[#6B5742]">오늘 획득 코인</span>
                  <span className="font-bold text-[#9C571B]">
                    🪙 +{gameState.todayRecord.coinsEarned}
                  </span>
                </div>
                <div className="flex justify-between tabular-nums">
                  <span className="text-[#6B5742]">오늘 획득 경험치</span>
                  <span className="font-bold text-[#1F5E57]">
                    ⭐ +{gameState.todayRecord.xpEarned}
                  </span>
                </div>
              </div>

              {(gameState.todayTaskCompleted || gameState.currentDay > 7) && onTriggerSleepFromRecord && (
                <div className="flex justify-center">
                  <button
                    onClick={onTriggerSleepFromRecord}
                    className="px-6 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl cursor-pointer"
                  >
                    🛏️ 집 침대에서 잠자기
                  </button>
                </div>
              )}
            </div>
          )}

          {/* World Map Panel */}
          {activePanel === 'map' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#5E4B37]">
                  {gameState.currentDay === 7 ? (
                    <>
                      <span className="font-bold text-[#2A2118]">오늘의 특별 일정:</span> ✨ 아크바르·아우랑제브 특별 체험 ·{' '}
                    </>
                  ) : gameState.currentDay > 7 ? (
                    <>
                      <span className="font-bold text-[#2A2118]">자유 탐험 중:</span> 🧭 원하는 주민과 자유롭게 대화 & 퀴즈 ·{' '}
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[#2A2118]">오늘의 주요 주민:</span>{' '}
                      {getFeaturedNpcForDay(gameState.currentDay).emoji}{' '}
                      {getFeaturedNpcForDay(gameState.currentDay).name} ·{' '}
                    </>
                  )}
                  만난 주민 {gameState.unlockedNPCs.length}/{NPC_DATA.length}명
                </div>
                <div className="text-xs font-semibold text-[#1F5E57]">
                  {gameState.currentDay >= 7
                    ? '✨ 특별 체험 해금됨 (광장 · 군영)'
                    : `🔒 특별 체험 7일째 해금 (${gameState.currentDay}/7일)`}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LOCATION_ZONES.map((loc) => {
                  const visited = gameState.unlockedLocations.includes(loc.id);
                  return (
                    <div
                      key={loc.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        visited
                          ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                          : 'bg-[#FAF6EE] border-[#E2D3B8] text-[#4A3A2A]'
                      }`}
                    >
                      <div className="font-bold">
                        {visited ? '✅' : '📍'} {loc.name}
                      </div>
                      <div className="text-[11px] opacity-85 mt-0.5">{loc.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
