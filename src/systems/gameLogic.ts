import { ACHIEVEMENTS_DATA } from '../data/historyAchievementData';
import { FURNITURE_CATALOG, HOUSE_LEVELS } from '../data/itemFurnitureData';
import { LOCATION_ZONES } from '../data/mapData';
import { NPC_DATA, getFeaturedNpcForDay } from '../data/npcData';
import { advancedQuizData, quizData } from '../data/quizData';
import { GameSaveData, NpcDefinition, PlacedFurniture, QuizQuestion } from '../types/game';

export function xpForNextLevel(level: number): number {
  return 60 + (level - 1) * 45;
}

export function applyXpAndCoins(
  state: GameSaveData,
  addCoins: number,
  addXp: number
): { nextState: GameSaveData; leveledUp: boolean } {
  let experience = state.experience + addXp;
  let level = state.level;
  let leveledUp = false;

  while (experience >= xpForNextLevel(level)) {
    experience -= xpForNextLevel(level);
    level += 1;
    leveledUp = true;
  }

  return {
    nextState: {
      ...state,
      coins: state.coins + addCoins,
      experience,
      level,
      todayRecord: {
        ...state.todayRecord,
        coinsEarned: state.todayRecord.coinsEarned + addCoins,
        xpEarned: state.todayRecord.xpEarned + addXp
      }
    },
    leveledUp
  };
}

export function calculateHouseCharm(layout: PlacedFurniture[]): number {
  let score = 0;
  for (const item of layout) {
    const def = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
    if (def) score += def.charmPoints;
  }
  return score;
}

export function calculateHouseLevel(layout: PlacedFurniture[]): number {
  const charm = calculateHouseCharm(layout);
  let level = 1;
  for (const hl of HOUSE_LEVELS) {
    if (charm >= hl.minCharm) {
      level = hl.level;
    }
  }
  return level;
}

export function hasUnsolvedQuizForNpc(
  npc: NpcDefinition,
  completedQuizIds: number[]
): boolean {
  if (npc.quizNpcKeys.length === 0) return false;
  return (
    quizData.some((q) => npc.quizNpcKeys.includes(q.npc) && !completedQuizIds.includes(q.id)) ||
    advancedQuizData.some(
      (q) => npc.quizNpcKeys.includes(q.npc) && !completedQuizIds.includes(q.id)
    )
  );
}

export function selectQuizForNpc(
  npc: NpcDefinition,
  completedQuizIds: number[],
  allowQuiz: boolean,
  isFreeMode = false
): QuizQuestion | null {
  if (!allowQuiz) {
    return null;
  }

  // 1. Check unsolved core quizData matching this NPC
  const coreMatches = quizData.filter(
    (q) => npc.quizNpcKeys.includes(q.npc) && !completedQuizIds.includes(q.id)
  );
  if (coreMatches.length > 0) {
    return coreMatches[0];
  }

  // 2. Check unsolved advancedQuizData matching this NPC
  const advMatches = advancedQuizData.filter(
    (q) => npc.quizNpcKeys.includes(q.npc) && !completedQuizIds.includes(q.id)
  );
  if (advMatches.length > 0) {
    return advMatches[0];
  }

  // In Free Mode (Day 8+), only offer quizzes belonging to this NPC
  if (isFreeMode) {
    if (npc.quizNpcKeys.length === 0) return null;
    return (
      quizData.find((q) => npc.quizNpcKeys.includes(q.npc)) ||
      advancedQuizData.find((q) => npc.quizNpcKeys.includes(q.npc)) ||
      null
    );
  }

  // 3. Guided Mode (Day 1-6) fallback to any remaining unsolved core or advanced quiz
  const anyUnsolvedCore = quizData.find((q) => !completedQuizIds.includes(q.id));
  if (anyUnsolvedCore) return anyUnsolvedCore;

  const anyUnsolvedAdv = advancedQuizData.find((q) => !completedQuizIds.includes(q.id));
  if (anyUnsolvedAdv) return anyUnsolvedAdv;

  // All core & advanced quizzes solved -> present an advanced review quiz
  return (
    advancedQuizData.find((q) => npc.quizNpcKeys.includes(q.npc)) ||
    advancedQuizData[0]
  );
}

export function evaluateAchievements(state: GameSaveData): {
  nextState: GameSaveData;
  newlyUnlocked: string[];
} {
  const unlocked = new Set(state.achievements);
  const newlyUnlocked: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      unlocked.add(id);
      newlyUnlocked.push(id);
    }
  };

  check('first_npc', state.unlockedNPCs.length >= 1);
  check('first_quiz', state.completedQuizIds.length >= 1);
  check('coins_100', state.coins >= 100);
  check('notes_10', state.historyNotes.length >= 10);
  check('house_lv3', state.houseLevel >= 3);
  check('akbar_exp', state.akbarProgress.completed);
  check('aurangzeb_exp', state.aurangzebProgress.completed);
  check('all_npcs', state.unlockedNPCs.length >= NPC_DATA.length);

  const coreQuizIds = quizData.map((q) => q.id);
  check(
    'all_quizzes',
    coreQuizIds.every((id) => state.completedQuizIds.includes(id))
  );
  check(
    'mughal_explorer',
    LOCATION_ZONES.every((loc) => state.unlockedLocations.includes(loc.id))
  );

  if (newlyUnlocked.length === 0) {
    return { nextState: state, newlyUnlocked: [] };
  }

  let updated: GameSaveData = {
    ...state,
    achievements: Array.from(unlocked)
  };

  for (const achId of newlyUnlocked) {
    const def = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
    if (def) {
      const res = applyXpAndCoins(updated, def.rewardCoins, def.rewardXp);
      updated = res.nextState;
    }
  }

  return { nextState: updated, newlyUnlocked };
}

export function advanceToNextDay(state: GameSaveData): GameSaveData {
  const nextDay = state.currentDay + 1;
  const nextFeatured = getFeaturedNpcForDay(nextDay);
  const isDay7 = nextDay === 7;
  const isFree = nextDay > 7;
  return {
    ...state,
    currentDay: nextDay,
    timeOfDay: 'day',
    health: state.maxHealth,
    todayTaskCompleted: isFree,
    todayRecord: {
      day: nextDay,
      featuredNpcName: isDay7
        ? '아크바르·아우랑제브 특별 체험'
        : isFree
        ? '자유 탐험 (모든 주민)'
        : nextFeatured.name,
      featuredNpcEmoji: isDay7 ? '✨' : isFree ? '🧭' : nextFeatured.emoji,
      learnedTopic: isDay7
        ? '아직 두 특별 체험을 완료하지 않았어요.'
        : isFree
        ? '원하는 주민과 자유롭게 대화하고 퀴즈를 풀어보세요!'
        : '아직 오늘의 주요 주민을 만나지 않았어요.',
      quizSolved: false,
      coinsEarned: 0,
      xpEarned: 0
    }
  };
}
