import { AchievementDef, HistoryNoteEntry } from '../types/game';

export const HISTORY_NOTES_DATA: HistoryNoteEntry[] = [
  // [정치] - 아크바르
  {
    id: 'pol_akbar_central',
    section: '정치',
    subGroup: '아크바르',
    title: '중앙 집권 체제 확립',
    summary: '제국의 행정과 관료 제도를 정비하여 황제 중심의 안정된 통치 기반을 다졌어요.'
  },
  {
    id: 'pol_akbar_jizya',
    section: '정치',
    subGroup: '아크바르',
    title: '인두세 폐지',
    summary: '비이슬람교도에게 부과하던 인두세(지즈야)를 폐지해 종교에 따른 세금 차별을 줄였어요.'
  },
  {
    id: 'pol_akbar_hindu',
    section: '정치',
    subGroup: '아크바르',
    title: '힌두교인 등용',
    summary: '힌두교인을 군인과 관료로 등용하는 관용 정책을 펼쳐 제국 통합을 이끌었어요.'
  },
  // [정치] - 아우랑제브
  {
    id: 'pol_aurangzeb_south',
    section: '정치',
    subGroup: '아우랑제브',
    title: '남인도까지 영토 확대',
    summary: '적극적인 군사 원정을 통해 남인도까지 진출하며 무굴 제국 최대 영역을 이루었어요.'
  },
  {
    id: 'pol_aurangzeb_islam',
    section: '정치',
    subGroup: '아우랑제브',
    title: '이슬람 제일주의',
    summary: '이슬람교의 질서와 원칙을 최우선으로 삼는 통치 노선을 추진했어요.'
  },
  {
    id: 'pol_aurangzeb_jizya',
    section: '정치',
    subGroup: '아우랑제브',
    title: '인두세 부활',
    summary: '아크바르 때 폐지되었던 비이슬람교도 대상 인두세를 다시 시행했어요.'
  },
  // [경제]
  {
    id: 'eco_cotton',
    section: '경제',
    subGroup: '상공업과 무역',
    title: '면직물',
    summary: '가볍고 품질이 뛰어난 인도의 면직물이 아시아와 유럽 시장에서 큰 인기를 얻었어요.'
  },
  {
    id: 'eco_trade',
    section: '경제',
    subGroup: '상공업과 무역',
    title: '대외 교역',
    summary: '면직물과 향신료 등을 수출하며 아시아·유럽 상인들과 활발하게 교역했어요.'
  },
  {
    id: 'eco_currency',
    section: '경제',
    subGroup: '상공업과 무역',
    title: '화폐 경제',
    summary: '대외 무역으로 많은 은이 유입되면서 은화를 중심으로 한 화폐 경제가 발달했어요.'
  },
  // [문화]
  {
    id: 'cul_tajmahal',
    section: '문화',
    subGroup: '인도·이슬람 문화',
    title: '타지마할',
    summary: '샤자한이 아내 뭄타즈 마할을 기려 세운 건축물로, 돔·뾰족한 아치와 연꽃 문양이 조화를 이루어요.'
  },
  {
    id: 'cul_painting',
    section: '문화',
    subGroup: '인도·이슬람 문화',
    title: '무굴 회화',
    summary: '황제의 후원을 받아 페르시아 회화 기법과 인도 미술의 색채가 결합해 발전했어요.'
  },
  {
    id: 'cul_sikh',
    section: '문화',
    subGroup: '인도·이슬람 문화',
    title: '시크교',
    summary: '펀자브 지역을 중심으로 발전했으며, 상징인 칸다 가운데의 검은 신의 권능을 뜻해요.'
  },
  {
    id: 'cul_urdu',
    section: '문화',
    subGroup: '인도·이슬람 문화',
    title: '우르두어',
    summary: '공식 문서의 페르시아어와 달리 백성들의 일상 언어 속에서 어우러지며 등장한 언어예요.'
  }
];

export const ACHIEVEMENTS_DATA: AchievementDef[] = [
  {
    id: 'first_npc',
    title: '첫 주민 만나기',
    description: '무굴 마을에서 처음으로 주민과 인사를 나누었어요.',
    rewardCoins: 30,
    rewardXp: 15
  },
  {
    id: 'first_quiz',
    title: '첫 퀴즈 정답',
    description: '게임 속 역사 퀴즈를 처음으로 맞혔어요.',
    rewardCoins: 40,
    rewardXp: 20
  },
  {
    id: 'coins_100',
    title: '100코인 모으기',
    description: '무굴 코인을 100개 이상 모아보았어요.',
    rewardCoins: 30,
    rewardXp: 20
  },
  {
    id: 'notes_10',
    title: '역사 노트 10개 발견',
    description: '역사 노트에 10개 이상의 역사 지식을 기록했어요.',
    rewardCoins: 80,
    rewardXp: 50
  },
  {
    id: 'house_lv3',
    title: '집 레벨 3 달성',
    description: '가구를 꾸며 나만의 집을 상인풍 저택으로 성장시켰어요.',
    rewardCoins: 100,
    rewardXp: 60
  },
  {
    id: 'akbar_exp',
    title: '아크바르 특별 체험 완료',
    description: '종교와 문화의 광장에서 다양성과 관용의 의미를 탐구했어요.',
    rewardCoins: 50,
    rewardXp: 40
  },
  {
    id: 'aurangzeb_exp',
    title: '아우랑제브 특별 체험 완료',
    description: '무굴 군영에서 4단계 군사 훈련을 모두 완수했어요.',
    rewardCoins: 50,
    rewardXp: 40
  },
  {
    id: 'all_npcs',
    title: '모든 주민 만나기',
    description: '마을에 사는 모든 주민과 대화를 나누었어요.',
    rewardCoins: 120,
    rewardXp: 80
  },
  {
    id: 'all_quizzes',
    title: '모든 퀴즈 완료',
    description: '기본 12개 역사 퀴즈를 모두 정복했어요!',
    rewardCoins: 150,
    rewardXp: 100
  },
  {
    id: 'mughal_explorer',
    title: '무굴 제국 탐험가',
    description: '마을의 모든 주요 장소(17곳)를 발로 걸어 탐험했어요.',
    rewardCoins: 120,
    rewardXp: 80
  }
];
