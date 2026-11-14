import { STARTER_HOUSE_LAYOUT } from '../data/itemFurnitureData';
import { getFeaturedNpcForDay } from '../data/npcData';
import { EraType, GameSaveData, PlayerAppearance } from '../types/game';

const STORAGE_PREFIX = 'mughal_life_';
const MAIN_SAVE_KEY = 'mughal_life_save_v1';

export const DEFAULT_APPEARANCE: PlayerAppearance = {
  hairStyle: 'short',
  hairColor: '#2B2118',
  skinColor: '#DDA77E',
  outfitStyle: 'kurta_teal',
  hatStyle: 'turban',
  accessory: 'none'
};

export function createInitialSave(
  playerName: string,
  era: EraType,
  appearance: PlayerAppearance
): GameSaveData {
  const featured = getFeaturedNpcForDay(1);
  return {
    playerName: playerName.trim() || '여행자',
    era,
    appearance,
    currentDay: 1,
    timeOfDay: 'day',
    health: 100,
    maxHealth: 100,
    coins: 50,
    experience: 0,
    level: 1,
    historyNotes: [],
    inventory: [
      {
        id: 'item_journal',
        name: '무굴 여행 수첩',
        category: 'souvenir',
        description: '마을에서 배운 역사 이야기를 기록하는 소중한 수첩이에요.',
        acquiredAtDay: 1
      }
    ],
    completedQuizIds: [],
    unlockedNPCs: [],
    unlockedLocations: ['player_house', 'central_plaza'],
    achievements: [],
    furniture: {
      bed: 1,
      lantern: 1,
      carpet: 1,
      low_table: 1
    },
    houseLayout: STARTER_HOUSE_LAYOUT,
    houseLevel: 1,
    akbarProgress: {
      completed: false,
      heardResidents: [],
      stage: 1
    },
    aurangzebProgress: {
      completed: false,
      highestStage: 1
    },
    todayTaskCompleted: false,
    todayRecord: {
      day: 1,
      featuredNpcName: featured.name,
      featuredNpcEmoji: featured.emoji,
      learnedTopic: '아직 오늘의 주요 주민을 만나지 않았어요.',
      quizSolved: false,
      coinsEarned: 0,
      xpEarned: 0
    },
    playerPos: { x: 740, y: 955 }
  };
}

export function saveGameState(state: GameSaveData): void {
  try {
    localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(state));

    // Mirror exact keys specified in Section 32 for transparent inspection & persistence
    const keyMap: Record<string, unknown> = {
      playerName: state.playerName,
      currentDay: state.currentDay,
      coins: state.coins,
      experience: state.experience,
      level: state.level,
      historyNotes: state.historyNotes,
      inventory: state.inventory,
      completedQuizIds: state.completedQuizIds,
      unlockedNPCs: state.unlockedNPCs,
      unlockedLocations: state.unlockedLocations,
      achievements: state.achievements,
      furniture: state.furniture,
      houseLayout: state.houseLayout,
      houseLevel: state.houseLevel,
      akbarProgress: state.akbarProgress,
      aurangzebProgress: state.aurangzebProgress
    };
    for (const [k, v] of Object.entries(keyMap)) {
      localStorage.setItem(`${STORAGE_PREFIX}${k}`, JSON.stringify(v));
    }
  } catch {
    // Ignore quota errors in restricted sandboxes
  }
}

export function loadGameState(): GameSaveData | null {
  try {
    const raw = localStorage.getItem(MAIN_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameSaveData>;
    if (!parsed || !parsed.playerName) return null;
    const base = createInitialSave(
      parsed.playerName,
      parsed.era || 'akbar',
      parsed.appearance || DEFAULT_APPEARANCE
    );
    return {
      ...base,
      ...parsed,
      akbarProgress: { ...base.akbarProgress, ...(parsed.akbarProgress || {}) },
      aurangzebProgress: { ...base.aurangzebProgress, ...(parsed.aurangzebProgress || {}) },
      todayRecord: { ...base.todayRecord, ...(parsed.todayRecord || {}) },
      playerPos: parsed.playerPos || base.playerPos
    };
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(MAIN_SAVE_KEY);
    const keys = [
      'playerName', 'currentDay', 'coins', 'experience', 'level',
      'historyNotes', 'inventory', 'completedQuizIds', 'unlockedNPCs',
      'unlockedLocations', 'achievements', 'furniture', 'houseLayout',
      'houseLevel', 'akbarProgress', 'aurangzebProgress'
    ];
    for (const k of keys) {
      localStorage.removeItem(`${STORAGE_PREFIX}${k}`);
    }
  } catch {
    // Ignore storage errors
  }
}
