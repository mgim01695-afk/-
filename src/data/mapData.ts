import { BuildingDef, LocationZone, ObstacleRect } from '../types/game';

export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1800;

export const LOCATION_ZONES: LocationZone[] = [
  { id: 'central_plaza', name: '중앙 광장', subtitle: '마을 사람들이 모이는 활기찬 중심 광장', x: 980, y: 740, w: 440, h: 300, category: 'plaza' },
  { id: 'market', name: '시장', subtitle: '아시아와 유럽 상인들이 오가는 바자르', x: 1020, y: 1180, w: 360, h: 200, category: 'market' },
  { id: 'textile_shop', name: '면직물 상점', subtitle: '세계적으로 인기 높은 인도 면직물 가게', x: 640, y: 1200, w: 280, h: 220, category: 'market' },
  { id: 'spice_shop', name: '향신료 상점', subtitle: '후추와 계피, 카다멈 향기가 가득한 상점', x: 1480, y: 1200, w: 280, h: 220, category: 'market' },
  { id: 'pottery_workshop', name: '도자기 작업장', subtitle: '푸른 문양의 도자기를 빚는 공방', x: 780, y: 1450, w: 290, h: 230, category: 'craft' },
  { id: 'artisan_workshop', name: '장인 작업장', subtitle: '금속과 나무에 섬세한 문양을 새기는 공방', x: 1330, y: 1450, w: 290, h: 230, category: 'craft' },
  { id: 'farmer_house', name: '농부의 집', subtitle: '목화와 곡식을 기르는 평화로운 농가', x: 140, y: 380, w: 380, h: 420, category: 'home' },
  { id: 'merchant_street', name: '상인 거리', subtitle: '각지 상인들이 물건을 나르는 돌길 거리', x: 620, y: 1050, w: 1160, h: 130, category: 'market' },
  { id: 'residential_area', name: '주민 주거 지역', subtitle: '서로 다른 배경의 이웃들이 어우러져 사는 마을', x: 140, y: 1020, w: 450, h: 380, category: 'home' },
  { id: 'palace', name: '궁전', subtitle: '붉은 사암과 하얀 대리석 돔이 빛나는 무굴 궁전', x: 960, y: 80, w: 480, h: 280, category: 'palace' },
  { id: 'religion_plaza', name: '종교와 문화의 광장', subtitle: '다양한 신앙과 사상이 어우러져 대화하는 광장', x: 960, y: 380, w: 480, h: 310, category: 'palace' },
  { id: 'military_camp', name: '무굴 군영', subtitle: '기마대와 궁수들이 훈련하는 제국의 군영', x: 1740, y: 140, w: 480, h: 320, category: 'military' },
  { id: 'furniture_shop', name: '가구 상점', subtitle: '카펫과 등불, 궁정 가구를 파는 상점', x: 1500, y: 740, w: 280, h: 240, category: 'market' },
  { id: 'garden', name: '정원', subtitle: '수로와 꽃나무가 대칭을 이루는 차르바그 정원', x: 1740, y: 500, w: 480, h: 320, category: 'nature' },
  { id: 'well', name: '우물', subtitle: '마을 주민들이 모여 이야기를 나누는 시원한 우물가', x: 580, y: 420, w: 200, h: 190, category: 'plaza' },
  { id: 'village_gate', name: '마을 입구', subtitle: '먼 길을 온 여행자들이 처음 발을 딛는 성문', x: 140, y: 100, w: 360, h: 240, category: 'plaza' },
  { id: 'player_house', name: '플레이어의 집', subtitle: '나만의 가구로 꾸미고 잠을 자는 아늑한 집', x: 600, y: 740, w: 280, h: 240, category: 'home' }
];

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'b_palace',
    locationId: 'palace',
    name: '무굴 궁전',
    x: 1000,
    y: 100,
    w: 400,
    h: 190,
    wallColor: '#C25E4C',
    roofColor: '#F3ECE0',
    trimColor: '#E3B34C',
    style: 'palace',
    doorX: 1200,
    doorY: 295
  },
  {
    id: 'b_player_house',
    locationId: 'player_house',
    name: '플레이어의 집',
    x: 640,
    y: 760,
    w: 200,
    h: 145,
    wallColor: '#E8D5B7',
    roofColor: '#B85D3B',
    trimColor: '#D69E3E',
    style: 'cottage',
    doorX: 740,
    doorY: 912,
    interactionType: 'enter_house',
    interactionLabel: '집 안으로 들어가기'
  },
  {
    id: 'b_furniture_shop',
    locationId: 'furniture_shop',
    name: '가구 상점',
    x: 1540,
    y: 760,
    w: 200,
    h: 145,
    wallColor: '#DFC7A7',
    roofColor: '#2B6E68',
    trimColor: '#E6B349',
    style: 'shop',
    doorX: 1640,
    doorY: 912,
    interactionType: 'furniture_shop',
    interactionLabel: '가구 상점 둘러보기'
  },
  {
    id: 'b_farmer_house',
    locationId: 'farmer_house',
    name: '농부의 집',
    x: 200,
    y: 410,
    w: 190,
    h: 130,
    wallColor: '#DFC7A0',
    roofColor: '#9C6B43',
    trimColor: '#7A5230',
    style: 'cottage',
    doorX: 295,
    doorY: 548
  },
  {
    id: 'b_res_house_1',
    locationId: 'residential_area',
    name: '이웃의 집',
    x: 190,
    y: 1060,
    w: 170,
    h: 125,
    wallColor: '#E5D3B8',
    roofColor: '#C57B57',
    trimColor: '#8C583A',
    style: 'cottage',
    doorX: 275,
    doorY: 1192
  },
  {
    id: 'b_res_house_2',
    locationId: 'residential_area',
    name: '펀자브 가옥',
    x: 390,
    y: 1080,
    w: 170,
    h: 125,
    wallColor: '#EFE4D0',
    roofColor: '#2D6A74',
    trimColor: '#D6A146',
    style: 'cottage',
    doorX: 475,
    doorY: 1212
  },
  {
    id: 'b_textile_shop',
    locationId: 'textile_shop',
    name: '면직물 상점',
    x: 680,
    y: 1230,
    w: 200,
    h: 135,
    wallColor: '#EBD9BE',
    roofColor: '#B5445A',
    trimColor: '#E5B24C',
    style: 'shop',
    doorX: 780,
    doorY: 1372
  },
  {
    id: 'b_spice_shop',
    locationId: 'spice_shop',
    name: '향신료 상점',
    x: 1520,
    y: 1230,
    w: 200,
    h: 135,
    wallColor: '#EAD4B2',
    roofColor: '#C76D28',
    trimColor: '#E5B24C',
    style: 'shop',
    doorX: 1620,
    doorY: 1372
  },
  {
    id: 'b_pottery_workshop',
    locationId: 'pottery_workshop',
    name: '도자기 작업장',
    x: 820,
    y: 1480,
    w: 210,
    h: 135,
    wallColor: '#DEC6A4',
    roofColor: '#2D6B8E',
    trimColor: '#D6A24B',
    style: 'workshop',
    doorX: 925,
    doorY: 1622
  },
  {
    id: 'b_artisan_workshop',
    locationId: 'artisan_workshop',
    name: '장인 작업장',
    x: 1370,
    y: 1480,
    w: 210,
    h: 135,
    wallColor: '#D9BFA0',
    roofColor: '#7C4D3A',
    trimColor: '#E3B24C',
    style: 'workshop',
    doorX: 1475,
    doorY: 1622
  },
  {
    id: 'b_military_tent',
    locationId: 'military_camp',
    name: '무굴 군영 지휘소',
    x: 1850,
    y: 170,
    w: 240,
    h: 145,
    wallColor: '#B83B3B',
    roofColor: '#8A2424',
    trimColor: '#E8B84B',
    style: 'tent',
    doorX: 1970,
    doorY: 325,
    interactionType: 'aurangzeb_exp',
    interactionLabel: '무굴 군영 특별 체험 시작'
  },
  {
    id: 'b_religion_pavilion',
    locationId: 'religion_plaza',
    name: '화합의 정자',
    x: 1110,
    y: 440,
    w: 180,
    h: 120,
    wallColor: '#F3EAD8',
    roofColor: '#D49A3A',
    trimColor: '#2B6E68',
    style: 'pavilion',
    doorX: 1200,
    doorY: 572,
    interactionType: 'akbar_exp',
    interactionLabel: '종교와 문화의 광장 체험'
  },
  {
    id: 'b_gate',
    locationId: 'village_gate',
    name: '마을 입구 성문',
    x: 200,
    y: 120,
    w: 210,
    h: 115,
    wallColor: '#B8694C',
    roofColor: '#8B4530',
    trimColor: '#E2B24E',
    style: 'gate',
    doorX: 305,
    doorY: 245
  }
];

export interface TreeDef {
  x: number;
  y: number;
  radius: number;
  variant: 'mango' | 'palm' | 'cypress';
}

export const TREES: TreeDef[] = [
  { x: 120, y: 260, radius: 28, variant: 'mango' },
  { x: 480, y: 180, radius: 26, variant: 'palm' },
  { x: 520, y: 310, radius: 26, variant: 'mango' },
  { x: 860, y: 180, radius: 24, variant: 'cypress' },
  { x: 1520, y: 180, radius: 24, variant: 'cypress' },
  { x: 1640, y: 260, radius: 28, variant: 'mango' },
  { x: 2260, y: 220, radius: 28, variant: 'palm' },
  { x: 2240, y: 460, radius: 26, variant: 'mango' },
  { x: 1800, y: 540, radius: 22, variant: 'cypress' },
  { x: 2160, y: 540, radius: 22, variant: 'cypress' },
  { x: 1800, y: 760, radius: 22, variant: 'cypress' },
  { x: 2160, y: 760, radius: 22, variant: 'cypress' },
  { x: 130, y: 880, radius: 28, variant: 'mango' },
  { x: 540, y: 820, radius: 26, variant: 'palm' },
  { x: 920, y: 760, radius: 24, variant: 'cypress' },
  { x: 1460, y: 760, radius: 24, variant: 'cypress' },
  { x: 1960, y: 1050, radius: 30, variant: 'mango' },
  { x: 2120, y: 1240, radius: 28, variant: 'palm' },
  { x: 1920, y: 1480, radius: 28, variant: 'mango' },
  { x: 210, y: 1520, radius: 28, variant: 'mango' },
  { x: 510, y: 1560, radius: 26, variant: 'palm' },
  { x: 1180, y: 1660, radius: 26, variant: 'mango' },
  { x: 1720, y: 1600, radius: 28, variant: 'palm' }
];

export const PATH_RECTS = [
  // Main North-South Grand Avenue
  { x: 1140, y: 280, w: 120, h: 1180 },
  // Plaza loop
  { x: 1020, y: 760, w: 360, h: 250 },
  // Religion plaza pavement
  { x: 1010, y: 410, w: 380, h: 240 },
  // East-West Upper Avenue (Gate -> Well -> Religion Plaza -> Garden)
  { x: 240, y: 260, w: 780, h: 90 },
  { x: 1380, y: 280, w: 580, h: 90 },
  // East-West Middle Avenue (Residential -> Player House -> Plaza -> Furniture -> Garden)
  { x: 260, y: 920, w: 1580, h: 95 },
  // Merchant Street
  { x: 600, y: 1080, w: 1200, h: 110 },
  // Lower Workshop Connector
  { x: 860, y: 1370, w: 680, h: 90 },
  // Vertical connectors
  { x: 260, y: 260, w: 90, h: 720 },
  { x: 640, y: 520, w: 80, h: 420 },
  { x: 1840, y: 320, w: 90, h: 660 }
];

export const STATIC_OBSTACLES: ObstacleRect[] = [
  // Buildings (leave lower doorway lip open for visual depth)
  ...BUILDINGS.map((b) => ({
    x: b.x + 8,
    y: b.y + 18,
    w: b.w - 16,
    h: b.h - 22,
    kind: 'building' as const
  })),
  // Central Plaza Fountain
  { x: 1152, y: 842, w: 96, h: 96, kind: 'water' },
  // Village Well
  { x: 645, y: 480, w: 70, h: 70, kind: 'water' },
  // Charbagh Garden central pool
  { x: 1935, y: 605, w: 90, h: 90, kind: 'water' },
  // Trees (small trunk hitbox)
  ...TREES.map((t) => ({
    x: t.x - 14,
    y: t.y - 8,
    w: 28,
    h: 22,
    kind: 'tree' as const
  }))
];
