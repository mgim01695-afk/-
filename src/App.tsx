import { useCallback, useEffect, useState } from 'react';
import { HeartCrack, Home, RotateCcw } from 'lucide-react';
import { AkbarExperienceModal } from './components/AkbarExperienceModal';
import { AurangzebExperienceModal } from './components/AurangzebExperienceModal';
import { CharacterCreator } from './components/CharacterCreator';
import { DialogueQuizModal } from './components/DialogueQuizModal';
import { FurnitureShopModal } from './components/FurnitureShopModal';
import { HouseCanvas } from './components/HouseCanvas';
import { ActivePanel, InfoPanelsModal, TopHud } from './components/HudAndModals';
import { StartScreen } from './components/StartScreen';
import { VillageCanvas } from './components/VillageCanvas';
import { ACHIEVEMENTS_DATA, HISTORY_NOTES_DATA } from './data/historyAchievementData';
import { HOUSE_LEVELS } from './data/itemFurnitureData';
import { LOCATION_ZONES } from './data/mapData';
import { getFeaturedNpcForDay } from './data/npcData';
import { audioSystem } from './systems/audioSystem';
import {
  advanceToNextDay,
  applyXpAndCoins,
  calculateHouseLevel,
  evaluateAchievements,
  selectQuizForNpc
} from './systems/gameLogic';
import {
  clearGameState,
  createInitialSave,
  loadGameState,
  saveGameState
} from './systems/saveSystem';
import {
  BuildingDef,
  FurnitureDef,
  GameSaveData,
  NpcDefinition,
  PlacedFurniture,
  PlayerAppearance,
  QuizQuestion
} from './types/game';

type AppScreen = 'start' | 'creator' | 'playing';

export default function App() {
  const [existingSave, setExistingSave] = useState<GameSaveData | null>(() => loadGameState());
  const [screen, setScreen] = useState<AppScreen>('start');
  const [gameState, setGameState] = useState<GameSaveData | null>(null);
  const [scene, setScene] = useState<'village' | 'house'>('village');

  const [activeNpc, setActiveNpc] = useState<NpcDefinition | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [activeIsFeatured, setActiveIsFeatured] = useState(false);

  const [showShop, setShowShop] = useState(false);
  const [showAkbarExp, setShowAkbarExp] = useState(false);
  const [showAurangzebExp, setShowAurangzebExp] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [muted, setMuted] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  const pushToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const commitState = useCallback(
    (updater: (prev: GameSaveData) => GameSaveData) => {
      setGameState((prev) => {
        if (!prev) return prev;
        const updated = updater(prev);
        const { nextState, newlyUnlocked } = evaluateAchievements(updated);
        if (newlyUnlocked.length > 0) {
          audioSystem.playSuccess();
          for (const achId of newlyUnlocked) {
            const def = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
            if (def) pushToast(`🏆 업적 달성: ${def.title} (+${def.rewardCoins}코인)`);
          }
        }
        saveGameState(nextState);
        setExistingSave(nextState);
        return nextState;
      });
    },
    [pushToast]
  );

  // Sync audio mute state
  useEffect(() => {
    audioSystem.muted = muted;
  }, [muted]);

  const handleStartNewGame = () => {
    audioSystem.playClick();
    setScreen('creator');
  };

  const handleContinueGame = () => {
    if (!existingSave) return;
    audioSystem.playClick();
    setGameState(existingSave);
    setScene('village');
    setScreen('playing');
  };

  const handleResetSave = () => {
    audioSystem.playClick();
    clearGameState();
    setExistingSave(null);
  };

  const handleConfirmCharacter = (name: string, appearance: PlayerAppearance) => {
    audioSystem.playSuccess();
    const fresh = createInitialSave(name, 'akbar', appearance);
    saveGameState(fresh);
    setExistingSave(fresh);
    setGameState(fresh);
    setScene('village');
    setScreen('playing');
    const featured = getFeaturedNpcForDay(1);
    pushToast(`☀️ 무굴 제국 1일째! 오늘의 주요 주민: ${featured.emoji} ${featured.name}`);
  };

  const handleUpdatePosition = useCallback(
    (pos: { x: number; y: number }, locationId: string | null) => {
      setGameState((prev) => {
        if (!prev) return prev;
        let nextLocations = prev.unlockedLocations;
        if (locationId && !prev.unlockedLocations.includes(locationId)) {
          nextLocations = [...prev.unlockedLocations, locationId];
          const zone = LOCATION_ZONES.find((z) => z.id === locationId);
          if (zone) {
            pushToast(`📍 새로운 장소 발견: ${zone.name}`);
          }
        }
        const updated: GameSaveData = {
          ...prev,
          playerPos: pos,
          unlockedLocations: nextLocations
        };
        const { nextState, newlyUnlocked } = evaluateAchievements(updated);
        if (newlyUnlocked.length > 0) {
          for (const achId of newlyUnlocked) {
            const def = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
            if (def) pushToast(`🏆 업적 달성: ${def.title}`);
          }
        }
        saveGameState(nextState);
        return nextState;
      });
    },
    [pushToast]
  );

  const handleInteractNpc = useCallback(
    (npc: NpcDefinition) => {
      if (!gameState) return;
      audioSystem.playDialogue();
      const isDay7 = gameState.currentDay === 7;
      const isFreeMode = gameState.currentDay > 7;
      const featured = getFeaturedNpcForDay(gameState.currentDay);
      const isFeatured = !isDay7 && !isFreeMode && !gameState.todayTaskCompleted && npc.id === featured.id;
      const allowQuiz = isDay7 ? false : isFreeMode ? true : isFeatured;
      const quiz = allowQuiz
        ? selectQuizForNpc(npc, gameState.completedQuizIds, true, isFreeMode)
        : null;
      setActiveNpc(npc);
      setActiveQuiz(quiz);
      setActiveIsFeatured(isFeatured);
    },
    [gameState]
  );

  const handleInteractBuilding = useCallback(
    (building: BuildingDef) => {
      if (building.interactionType === 'enter_house') {
        audioSystem.playClick();
        setScene('house');
      } else if (building.interactionType === 'furniture_shop') {
        audioSystem.playClick();
        setShowShop(true);
      } else if (building.interactionType === 'akbar_exp') {
        if (gameState && gameState.currentDay < 7) {
          audioSystem.playWrong();
          pushToast(`🔒 아크바르 특별 체험은 7일째에 열립니다! (현재 ${gameState.currentDay}일째)`);
          return;
        }
        audioSystem.playClick();
        setShowAkbarExp(true);
      } else if (building.interactionType === 'aurangzeb_exp') {
        if (gameState && gameState.currentDay < 7) {
          audioSystem.playWrong();
          pushToast(`🔒 아우랑제브 특별 체험은 7일째에 열립니다! (현재 ${gameState.currentDay}일째)`);
          return;
        }
        audioSystem.playClick();
        setShowAurangzebExp(true);
      }
    },
    [gameState, pushToast]
  );

  const handleDialogueComplete = (npc: NpcDefinition) => {
    commitState((prev) => {
      const unlockedNPCs = prev.unlockedNPCs.includes(npc.id)
        ? prev.unlockedNPCs
        : [...prev.unlockedNPCs, npc.id];

      const newNotes = [...prev.historyNotes];
      for (const noteId of npc.unlocksNoteIds) {
        if (!newNotes.includes(noteId)) {
          newNotes.push(noteId);
          const entry = HISTORY_NOTES_DATA.find((n) => n.id === noteId);
          if (entry) pushToast(`📜 역사 노트 기록: ${entry.title}`);
        }
      }

      return {
        ...prev,
        unlockedNPCs,
        historyNotes: newNotes
      };
    });
  };

  const handleQuizSolved = (quiz: QuizQuestion, isFeaturedToday: boolean) => {
    commitState((prev) => {
      const completedQuizIds = prev.completedQuizIds.includes(quiz.id)
        ? prev.completedQuizIds
        : [...prev.completedQuizIds, quiz.id];

      const newNotes = [...prev.historyNotes];
      for (const noteId of quiz.unlocksNoteIds || []) {
        if (!newNotes.includes(noteId)) {
          newNotes.push(noteId);
          const entry = HISTORY_NOTES_DATA.find((n) => n.id === noteId);
          if (entry) pushToast(`📜 역사 노트 기록: ${entry.title}`);
        }
      }

      const xpReward =
        quiz.xp ?? (quiz.difficulty === 'hard' ? 40 : quiz.difficulty === 'medium' ? 30 : 20);
      const { nextState, leveledUp } = applyXpAndCoins(prev, quiz.reward, xpReward);
      if (leveledUp) {
        pushToast(`⭐ 레벨 업! Lv.${nextState.level}이 되었습니다!`);
      }

      const isFreeMode = nextState.currentDay > 7;
      const completedForToday = isFreeMode
        ? true
        : isFeaturedToday
        ? true
        : nextState.todayTaskCompleted;

      return {
        ...nextState,
        completedQuizIds,
        historyNotes: newNotes,
        timeOfDay: !isFreeMode && completedForToday ? 'evening' : nextState.timeOfDay,
        todayTaskCompleted: completedForToday,
        todayRecord:
          isFeaturedToday || isFreeMode
            ? {
                ...nextState.todayRecord,
                learnedTopic: `${quiz.category} — ${quiz.explanation}`,
                quizSolved: true
              }
            : nextState.todayRecord
      };
    });
  };

  const handleUnlockNote = (noteId: string) => {
    commitState((prev) => {
      if (prev.historyNotes.includes(noteId)) return prev;
      const entry = HISTORY_NOTES_DATA.find((n) => n.id === noteId);
      if (entry) pushToast(`📜 역사 노트 기록: ${entry.title}`);
      return {
        ...prev,
        historyNotes: [...prev.historyNotes, noteId]
      };
    });
  };

  const handleQuizWrong = () => {
    let hitZero = false;
    commitState((prev) => {
      const nextHealth = Math.max(0, prev.health - 10);
      if (nextHealth === 0) hitZero = true;
      return {
        ...prev,
        health: nextHealth
      };
    });
    if (hitZero) {
      setActiveNpc(null);
      setActiveQuiz(null);
      pushToast('💔 체력이 0이 되어 게임이 종료되었습니다.');
    } else {
      pushToast('❤️ 오답으로 체력이 10 감소했습니다.');
    }
  };

  const handleUpdateHouseLayout = (layout: PlacedFurniture[]) => {
    commitState((prev) => {
      const nextHouseLevel = calculateHouseLevel(layout);
      if (nextHouseLevel > prev.houseLevel) {
        const meta = HOUSE_LEVELS.find((h) => h.level === nextHouseLevel);
        audioSystem.playSuccess();
        pushToast(`🏠 집 레벨 업! Lv.${nextHouseLevel} (${meta?.name || ''})`);
      }
      return {
        ...prev,
        houseLayout: layout,
        houseLevel: Math.max(prev.houseLevel, nextHouseLevel)
      };
    });
  };

  const handleBuyFurniture = (item: FurnitureDef) => {
    commitState((prev) => {
      if (prev.coins < item.price) return prev;
      pushToast(`🛋️ ${item.name}을(를) 구매했어요! 집 보관함에서 배치해보세요.`);
      return {
        ...prev,
        coins: prev.coins - item.price,
        furniture: {
          ...prev.furniture,
          [item.id]: (prev.furniture[item.id] || 0) + 1
        }
      };
    });
  };

  const handleAkbarComplete = () => {
    commitState((prev) => {
      if (prev.akbarProgress.completed) return prev;
      const { nextState, leveledUp } = applyXpAndCoins(prev, 150, 100);
      if (leveledUp) pushToast(`⭐ 레벨 업! Lv.${nextState.level}`);
      const notes = new Set([
        ...nextState.historyNotes,
        'pol_akbar_central',
        'pol_akbar_jizya',
        'pol_akbar_hindu'
      ]);
      const day7Done =
        nextState.currentDay === 7 && nextState.aurangzebProgress.completed;
      pushToast(
        day7Done
          ? '🕌 아크바르 특별 체험 완료! 7일차 특별 체험을 모두 마쳤으니 집으로 돌아가세요!'
          : nextState.currentDay === 7
          ? '🕌 아크바르 특별 체험 완료! 이제 ⚔️ 무굴 군영(아우랑제브 특별 체험)도 체험해보세요!'
          : '🕌 아크바르 특별 체험 완료! 아크바르 시대 장식 깃발 해금!'
      );
      return {
        ...nextState,
        historyNotes: Array.from(notes),
        furniture: {
          ...nextState.furniture,
          akbar_banner: (nextState.furniture.akbar_banner || 0) + 1
        },
        akbarProgress: {
          ...nextState.akbarProgress,
          completed: true,
          stage: 3
        },
        todayTaskCompleted: day7Done ? true : nextState.todayTaskCompleted,
        timeOfDay: day7Done ? 'evening' : nextState.timeOfDay,
        todayRecord:
          nextState.currentDay === 7
            ? {
                ...nextState.todayRecord,
                learnedTopic: day7Done
                  ? '아크바르(종교와 문화의 광장) · 아우랑제브(무굴 군영) 특별 체험 완료'
                  : '아크바르 특별 체험(종교와 문화의 광장) 완료'
              }
            : nextState.todayRecord
      };
    });
  };

  const handleAurangzebComplete = () => {
    commitState((prev) => {
      if (prev.aurangzebProgress.completed) return prev;
      const { nextState, leveledUp } = applyXpAndCoins(prev, 250, 200);
      if (leveledUp) pushToast(`⭐ 레벨 업! Lv.${nextState.level}`);
      const notes = new Set([
        ...nextState.historyNotes,
        'pol_aurangzeb_south',
        'pol_aurangzeb_islam',
        'pol_aurangzeb_jizya'
      ]);
      const hasFlagItem = nextState.inventory.some((i) => i.id === 'item_aurangzeb_flag');
      const day7Done =
        nextState.currentDay === 7 && nextState.akbarProgress.completed;
      pushToast(
        day7Done
          ? '⚔️ 아우랑제브 특별 체험 완료! 7일차 특별 체험을 모두 마쳤으니 집으로 돌아가세요!'
          : nextState.currentDay === 7
          ? '⚔️ 아우랑제브 특별 체험 완료! 이제 🕌 종교와 문화의 광장(아크바르 특별 체험)도 체험해보세요!'
          : '⚔️ 아우랑제브 특별 체험 완료! 무굴 군영 깃발 획득!'
      );
      return {
        ...nextState,
        historyNotes: Array.from(notes),
        inventory: hasFlagItem
          ? nextState.inventory
          : [
              ...nextState.inventory,
              {
                id: 'item_aurangzeb_flag',
                name: '무굴 군영 깃발',
                category: 'special',
                description: '무굴 군영 4단계 훈련을 완수하여 받은 명예로운 군영 깃발이에요.',
                acquiredAtDay: nextState.currentDay
              }
            ],
        furniture: {
          ...nextState.furniture,
          aurangzeb_banner: (nextState.furniture.aurangzeb_banner || 0) + 1
        },
        aurangzebProgress: {
          completed: true,
          highestStage: 4
        },
        todayTaskCompleted: day7Done ? true : nextState.todayTaskCompleted,
        timeOfDay: day7Done ? 'evening' : nextState.timeOfDay,
        todayRecord:
          nextState.currentDay === 7
            ? {
                ...nextState.todayRecord,
                learnedTopic: day7Done
                  ? '아크바르(종교와 문화의 광장) · 아우랑제브(무굴 군영) 특별 체험 완료'
                  : '아우랑제브 특별 체험(무굴 군영) 완료'
              }
            : nextState.todayRecord
      };
    });
  };

  const handleCompleteSleep = () => {
    commitState((prev) => {
      const next = advanceToNextDay(prev);
      const featured = getFeaturedNpcForDay(next.currentDay);
      if (next.currentDay === 7) {
        pushToast(
          '🎉 7일째! 오늘은 🕌 종교와 문화의 광장(아크바르)과 ⚔️ 무굴 군영(아우랑제브) 특별 체험이 열리는 날이에요!'
        );
      } else if (next.currentDay > 7) {
        pushToast(
          `☀️ 무굴 제국 ${next.currentDay}일째! 자유 탐험 기간이에요. 원하는 주민과 대화하고 퀴즈를 풀어보세요!`
        );
      } else {
        pushToast(
          `☀️ 무굴 제국 ${next.currentDay}일째! 오늘의 주요 주민: ${featured.emoji} ${featured.name}`
        );
      }
      return {
        ...next,
        playerPos: { x: 740, y: 955 }
      };
    });
    setScene('village');
  };

  if (screen === 'start') {
    return (
      <StartScreen
        existingSave={existingSave}
        onStartNewGame={handleStartNewGame}
        onContinueGame={handleContinueGame}
        onResetSave={handleResetSave}
      />
    );
  }

  if (screen === 'creator') {
    return (
      <CharacterCreator
        onBack={() => setScreen('start')}
        onConfirm={handleConfirmCharacter}
      />
    );
  }

  if (!gameState) return null;

  const isModalOpen =
    Boolean(activeNpc) ||
    showShop ||
    showAkbarExp ||
    showAurangzebExp ||
    activePanel !== 'none';

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F6EFE2]">
      <TopHud
        gameState={gameState}
        scene={scene}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onOpenPanel={(panel) => {
          audioSystem.playClick();
          setActivePanel(panel);
        }}
        onToggleHouse={() => {
          audioSystem.playClick();
          setScene((s) => (s === 'village' ? 'house' : 'village'));
        }}
        onReturnTitle={() => {
          audioSystem.playClick();
          setScreen('start');
        }}
      />

      <main className="relative flex-1 min-h-0">
        {scene === 'village' ? (
          <VillageCanvas
            gameState={gameState}
            isModalOpen={isModalOpen}
            onUpdatePosition={handleUpdatePosition}
            onInteractNpc={handleInteractNpc}
            onInteractBuilding={handleInteractBuilding}
          />
        ) : (
          <HouseCanvas
            gameState={gameState}
            onUpdateLayout={handleUpdateHouseLayout}
            onOpenShop={() => setShowShop(true)}
            onOpenRecord={() => setActivePanel('record')}
            onExitHouse={() => {
              audioSystem.playClick();
              setScene('village');
            }}
            onCompleteSleep={handleCompleteSleep}
          />
        )}

        {/* Discovery / Achievement Toasts */}
        <div className="pointer-events-none absolute top-3 right-3 z-30 flex flex-col gap-2 max-w-xs">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-[#1F5E57] text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg border border-[#E6B349]/50"
            >
              {t.text}
            </div>
          ))}
        </div>
      </main>

      {/* NPC Dialogue & In-Game Quiz Modal */}
      {activeNpc && gameState.health > 0 && (
        <DialogueQuizModal
          npc={activeNpc}
          era={gameState.era}
          currentDay={gameState.currentDay}
          isFreeMode={gameState.currentDay > 7}
          day7SpecialDone={
            gameState.akbarProgress.completed && gameState.aurangzebProgress.completed
          }
          isFeaturedToday={activeIsFeatured}
          todayFeaturedNpc={getFeaturedNpcForDay(gameState.currentDay)}
          quiz={activeQuiz}
          currentHealth={gameState.health}
          maxHealth={gameState.maxHealth}
          onClose={() => {
            setActiveNpc(null);
            setActiveQuiz(null);
          }}
          onDialogueComplete={handleDialogueComplete}
          onUnlockNote={handleUnlockNote}
          onQuizSolved={handleQuizSolved}
          onQuizWrong={handleQuizWrong}
          onOpenFurnitureShop={() => {
            setActiveNpc(null);
            setActiveQuiz(null);
            setShowShop(true);
          }}
          onReturnHome={() => {
            setActiveNpc(null);
            setActiveQuiz(null);
            setScene('house');
          }}
        />
      )}

      {/* Furniture Shop Modal */}
      {showShop && (
        <FurnitureShopModal
          coins={gameState.coins}
          houseLevel={gameState.houseLevel}
          ownedFurniture={gameState.furniture}
          onBuy={handleBuyFurniture}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Akbar Special Experience Modal */}
      {showAkbarExp && (
        <AkbarExperienceModal
          alreadyCompleted={gameState.akbarProgress.completed}
          onClose={() => setShowAkbarExp(false)}
          onComplete={handleAkbarComplete}
        />
      )}

      {/* Aurangzeb Special Experience Modal */}
      {showAurangzebExp && (
        <AurangzebExperienceModal
          alreadyCompleted={gameState.aurangzebProgress.completed}
          onClose={() => setShowAurangzebExp(false)}
          onComplete={handleAurangzebComplete}
        />
      )}

      {/* Info Panels (History Notes, Bag, Achievements, Daily Record, World Map) */}
      <InfoPanelsModal
        activePanel={activePanel}
        gameState={gameState}
        onClose={() => setActivePanel('none')}
        onTriggerSleepFromRecord={() => {
          setActivePanel('none');
          setScene('house');
        }}
      />

      {/* Game Over Overlay when Health reaches 0 */}
      {gameState.health <= 0 && (
        <div className="fixed inset-0 z-50 bg-[#1A130C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFDF8] border-2 border-[#DC2626] rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FEE2E2] border border-[#FCA5A5] mx-auto flex items-center justify-center">
              <HeartCrack className="w-8 h-8 text-[#DC2626]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-[#7F1D1D]">게임 종료</h2>
              <p className="text-sm text-[#5E4B37]">
                체력이 0이 되어 무굴 제국에서의 여정이 끝났습니다.
              </p>
            </div>

            <div className="p-4 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl text-sm space-y-1.5 tabular-nums text-[#2A2118]">
              <div>도달한 날짜: 무굴 제국 {gameState.currentDay}일째</div>
              <div>해결한 퀴즈: {gameState.completedQuizIds.length}개</div>
              <div>모은 코인: 🪙 {gameState.coins} · 역사 노트: 📜 {gameState.historyNotes.length}개</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={() => {
                  audioSystem.playClick();
                  const fresh = createInitialSave(
                    gameState.playerName,
                    gameState.era,
                    gameState.appearance
                  );
                  saveGameState(fresh);
                  setExistingSave(fresh);
                  setGameState(fresh);
                  setScene('village');
                }}
                className="flex-1 px-4 py-3 bg-[#1F5E57] hover:bg-[#174842] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>처음부터 다시 하기</span>
              </button>
              <button
                onClick={() => {
                  audioSystem.playClick();
                  clearGameState();
                  setExistingSave(null);
                  setGameState(null);
                  setScreen('start');
                }}
                className="flex-1 px-4 py-3 bg-white hover:bg-[#F6EFE2] text-[#2A2118] border border-[#D4C2A3] text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>시작 화면으로</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
