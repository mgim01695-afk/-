export type EraType = 'akbar' | 'aurangzeb';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export type HairStyleId = 'short' | 'bob' | 'long' | 'bun' | 'curly' | 'braid';
export type HatStyleId = 'none' | 'cap' | 'turban' | 'royal_turban' | 'floral';
export type OutfitStyleId = 'kurta_teal' | 'kurta_saffron' | 'jamah_crimson' | 'jamah_indigo' | 'tunic_emerald' | 'scholar_cream';
export type AccessoryId = 'none' | 'scarf' | 'glasses' | 'pendant' | 'satchel' | 'feather';

export interface PlayerAppearance {
  hairStyle: HairStyleId;
  hairColor: string;
  skinColor: string;
  outfitStyle: OutfitStyleId;
  hatStyle: HatStyleId;
  accessory: AccessoryId;
}

export interface QuizQuestion {
  id: number;
  category: string;
  npc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  reward: number;
  hint?: string;
  xp?: number;
  isAdvanced?: boolean;
  unlocksNoteIds?: string[];
}

export interface NpcDialogueLine {
  speaker: string;
  text: string;
  mood?: 'happy' | 'curious' | 'proud' | 'thoughtful';
}

export interface NpcQuestionAnswer {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  unlocksNoteId?: string;
}

export interface NpcDefinition {
  id: string;
  name: string;
  role: string;
  emoji: string;
  x: number;
  y: number;
  locationId: string;
  appearance: PlayerAppearance;
  personality: string;
  dialoguesByEra?: {
    akbar?: NpcDialogueLine[];
    aurangzeb?: NpcDialogueLine[];
  };
  defaultDialogues: NpcDialogueLine[];
  askableQuestions?: NpcQuestionAnswer[];
  quizNpcKeys: string[];
  unlocksNoteIds: string[];
  featuredDayOrder?: number;
}

export interface LocationZone {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  w: number;
  h: number;
  category: 'plaza' | 'market' | 'craft' | 'palace' | 'military' | 'home' | 'nature';
}

export interface BuildingDef {
  id: string;
  locationId: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  wallColor: string;
  roofColor: string;
  trimColor: string;
  style: 'cottage' | 'shop' | 'palace' | 'workshop' | 'tent' | 'gate' | 'pavilion';
  doorX?: number;
  doorY?: number;
  interactionType?: 'enter_house' | 'furniture_shop' | 'akbar_exp' | 'aurangzeb_exp' | 'info';
  interactionLabel?: string;
}

export interface ObstacleRect {
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: 'building' | 'wall' | 'water' | 'tree';
}

export interface FurnitureDef {
  id: string;
  name: string;
  category: 'floor' | 'table' | 'seating' | 'bed' | 'light' | 'decor' | 'special';
  price: number;
  unlockHouseLevel: number;
  charmPoints: number;
  w: number;
  h: number;
  description: string;
  isSpecial?: boolean;
  color: string;
  accentColor: string;
}

export interface PlacedFurniture {
  instanceId: string;
  furnitureId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'souvenir' | 'special' | 'material';
  description: string;
  acquiredAtDay: number;
}

export interface HistoryNoteEntry {
  id: string;
  section: '정치' | '경제' | '문화';
  subGroup: string;
  title: string;
  summary: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
}

export interface DailyRecord {
  day: number;
  featuredNpcName: string;
  featuredNpcEmoji: string;
  learnedTopic: string;
  quizSolved: boolean;
  coinsEarned: number;
  xpEarned: number;
}

export interface GameSaveData {
  playerName: string;
  era: EraType;
  appearance: PlayerAppearance;
  currentDay: number;
  timeOfDay: TimeOfDay;
  health: number;
  maxHealth: number;
  coins: number;
  experience: number;
  level: number;
  historyNotes: string[];
  inventory: InventoryItem[];
  completedQuizIds: number[];
  unlockedNPCs: string[];
  unlockedLocations: string[];
  achievements: string[];
  furniture: Record<string, number>;
  houseLayout: PlacedFurniture[];
  houseLevel: number;
  akbarProgress: {
    completed: boolean;
    heardResidents: string[];
    stage: number;
  };
  aurangzebProgress: {
    completed: boolean;
    highestStage: number;
  };
  todayTaskCompleted: boolean;
  todayRecord: DailyRecord;
  playerPos: { x: number; y: number };
}
