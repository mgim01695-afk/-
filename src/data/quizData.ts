import { QuizQuestion } from '../types/game';

/**
 * Core quizData required by the specification + hints & note links.
 * All quizzes are solved completely inside the game without any external links.
 */
export const quizData: QuizQuestion[] = [
  {
    id: 1,
    category: '아크바르',
    npc: '궁정 관리',
    difficulty: 'easy',
    question: '아크바르 황제가 실시한 정책으로 옳은 것은?',
    options: [
      '비이슬람인에게 인두세를 부과하였다.',
      '인두세를 폐지하고 힌두교인을 등용하였다.',
      '힌두교사원을 적극적으로 파괴하였다.',
      '이슬람교만을 인정하였다.'
    ],
    answer: 1,
    explanation: '아크바르는 인두세를 폐지하고 힌두교인을 군인과 관료로 등용하는 관용 정책을 실시하였다.',
    reward: 50,
    xp: 25,
    hint: '아크바르는 다양한 종교를 가진 백성들이 화합할 수 있도록 세금 부담을 줄이고 인재를 고루 뽑았어요.',
    unlocksNoteIds: ['pol_akbar_jizya', 'pol_akbar_hindu']
  },
  {
    id: 2,
    category: '아우랑제브',
    npc: '병사',
    difficulty: 'easy',
    question: '아우랑제브 황제의 정책으로 옳은 것은?',
    options: [
      '인두세를 폐지하였다.',
      '힌두교인을 모두 관료로 등용하였다.',
      '인두세를 부활시켰다.',
      '종교적 차이를 없앴다.'
    ],
    answer: 2,
    explanation: '아우랑제브는 이슬람 제일주의를 실시하고 인두세를 부활시켰다.',
    reward: 50,
    xp: 25,
    hint: '아우랑제브는 이슬람 질서를 강조하며 폐지되었던 세금을 다시 거두기 시작했어요.',
    unlocksNoteIds: ['pol_aurangzeb_islam', 'pol_aurangzeb_jizya']
  },
  {
    id: 3,
    category: '경제',
    npc: '면직물 상인',
    difficulty: 'easy',
    question: '무굴 제국에서 아시아와 유럽에서 큰 인기를 얻었던 상품은?',
    options: [
      '철기',
      '면직물',
      '도자기',
      '목재'
    ],
    answer: 1,
    explanation: '무굴 제국 시기 인도의 면직물은 아시아와 유럽에서 큰 인기를 얻었다.',
    reward: 50,
    xp: 20,
    hint: '목화 솜으로 짠 가볍고 아름다운 무굴 제국의 대표적인 직물 상품이에요.',
    unlocksNoteIds: ['eco_cotton']
  },
  {
    id: 4,
    category: '경제',
    npc: '상인',
    difficulty: 'medium',
    question: '무굴 제국 시기 대외 무역이 활발해지면서 은이 유입되자 발달한 것은?',
    options: [
      '농노제',
      '봉건제',
      '신분제',
      '화폐 경제'
    ],
    answer: 3,
    explanation: '대외 무역을 통해 은이 유입되면서 화폐 경제가 발달하였다.',
    reward: 70,
    xp: 35,
    hint: '은화가 널리 유통되면서 물건 값을 돈으로 주고받는 경제가 크게 성장했어요.',
    unlocksNoteIds: ['eco_trade', 'eco_currency']
  },
  {
    id: 5,
    category: '샤자한',
    npc: '건축가',
    difficulty: 'easy',
    question: '샤자한이 아내 뭄타즈 마할을 기리기 위해 만든 건축물은?',
    options: [
      '구르드와라',
      '칸다리아 사원',
      '타지마할',
      '자금성'
    ],
    answer: 2,
    explanation: '샤자한은 아내 뭄타즈 마할을 기리기 위해 타지마할을 만들었다.',
    reward: 50,
    xp: 25,
    hint: '하얀 대리석과 아름다운 돔으로 유명한 인도 아그라의 대표 건축물이에요.',
    unlocksNoteIds: ['cul_tajmahal']
  },
  {
    id: 6,
    category: '인도·이슬람 문화',
    npc: '학자',
    difficulty: 'medium',
    question: '무굴 제국에서 인도·이슬람 문화가 형성된 배경으로 가장 적절한 것은?',
    options: [
      '인도 문화와 이슬람 문화가 결합하였다.',
      '인도 문화가 완전히 사라졌다.',
      '유럽 문화만 받아들였다.',
      '중국 문화가 인도 문화를 대신하였다.'
    ],
    answer: 0,
    explanation: '무굴 제국에서는 인도의 문화와 이슬람 문화가 결합하면서 인도·이슬람 문화가 발전하였다.',
    reward: 70,
    xp: 35,
    hint: '기존 인도의 전통과 페르시아·이슬람의 요소가 서로 어우러져 새로운 문화를 빚어냈어요.',
    unlocksNoteIds: ['cul_tajmahal', 'cul_painting']
  },
  {
    id: 7,
    category: '시크교',
    npc: '펀자브 주민',
    difficulty: 'easy',
    question: '시크교가 발전한 지역은?',
    options: [
      '벵골',
      '펀자브',
      '아라비아',
      '중앙아시아'
    ],
    answer: 1,
    explanation: '시크교는 펀자브 지방을 중심으로 발전하였다.',
    reward: 50,
    xp: 25,
    hint: '다섯 개의 강이 흐르는 인도 북서부 지역이에요.',
    unlocksNoteIds: ['cul_sikh']
  },
  {
    id: 8,
    category: '언어',
    npc: '학자',
    difficulty: 'medium',
    question: '무굴 제국에서 일상 언어로 사용되며 등장한 언어는?',
    options: [
      '라틴어',
      '그리스어',
      '우르두어',
      '영어'
    ],
    answer: 2,
    explanation: '무굴 제국에서는 공식 문서에 페르시아어를 사용했지만 일상 언어로 우르두어가 등장하였다.',
    reward: 70,
    xp: 35,
    hint: '힌디어 문법에 페르시아어와 아랍어 어휘가 어우러져 만들어진 언어예요.',
    unlocksNoteIds: ['cul_urdu']
  },
  {
    id: 9,
    category: '무굴 회화',
    npc: '화가',
    difficulty: 'medium',
    question: '무굴 회화의 특징으로 옳은 것은?',
    options: [
      '유럽의 유화만 사용하였다.',
      '황제의 후원을 받지 않았다.',
      '건축물만 그렸다.',
      '페르시아 회화와 인도 미술이 결합하였다.'
    ],
    answer: 3,
    explanation: '무굴 회화는 황제의 후원을 받으며 페르시아 회화와 인도 미술이 결합한 형태로 발전하였다.',
    reward: 70,
    xp: 35,
    hint: '섬세한 세밀화 기법에 인도의 자연과 생동감 있는 색채가 더해졌어요.',
    unlocksNoteIds: ['cul_painting']
  },
  {
    id: 10,
    category: '타지마할',
    npc: '건축가',
    difficulty: 'hard',
    question: '타지마할에서 인도·이슬람 문화의 융합을 보여주는 모습으로 가장 적절한 것은?',
    options: [
      '돔과 뾰족한 아치, 연꽃 문양 등이 함께 나타난다.',
      '유럽 고딕 양식만 나타난다.',
      '불교 양식만 사용되었다.',
      '중국식 목조건축으로 지어졌다.'
    ],
    answer: 0,
    explanation: '타지마할에는 돔과 뾰족한 아치 등의 이슬람 양식과 연꽃 문양 등의 인도 양식이 함께 나타난다.',
    reward: 100,
    xp: 50,
    hint: '이슬람 건축의 둥근 지붕(돔)과 인도 전통의 꽃 장식이 한 건물 안에 공존해요.',
    unlocksNoteIds: ['cul_tajmahal']
  },
  {
    id: 11,
    category: '정책 비교',
    npc: '궁정 관리',
    difficulty: 'hard',
    question: '아크바르와 아우랑제브의 정책을 비교한 내용으로 옳은 것은?',
    options: [
      '두 황제 모두 같은 종교 정책을 실시하였다.',
      '아크바르는 인두세를 부활시키고 아우랑제브는 폐지하였다.',
      '아크바르는 관용 정책을, 아우랑제브는 이슬람 제일주의를 실시하였다.',
      '두 황제 모두 인두세를 폐지하였다.'
    ],
    answer: 2,
    explanation: '아크바르는 관용 정책을 실시한 반면 아우랑제브는 이슬람 제일주의를 실시하였다.',
    reward: 100,
    xp: 50,
    hint: '두 황제는 비이슬람교도를 대하는 정책과 인두세 시행 여부에서 뚜렷한 차이를 보였어요.',
    unlocksNoteIds: ['pol_akbar_jizya', 'pol_aurangzeb_islam']
  },
  {
    id: 12,
    category: '시크교',
    npc: '펀자브 주민',
    difficulty: 'medium',
    question: '시크교의 상징인 칸다에서 가운데에 있는 검은 무엇을 상징하는가?',
    options: [
      '무역의 발전',
      '황제의 권력',
      '농업의 발전',
      '신의 권능'
    ],
    answer: 3,
    explanation: '칸다 가운데의 검은 신의 권능을 상징한다.',
    reward: 70,
    xp: 35,
    hint: '종교적 상징물인 만큼 세속 권력이나 경제가 아닌 절대자의 힘을 뜻해요.',
    unlocksNoteIds: ['cul_sikh']
  }
];

/**
 * Advanced / bonus questions presented when all core questions for an NPC are already solved.
 */
export const advancedQuizData: QuizQuestion[] = [
  {
    id: 101,
    category: '심화 · 정치',
    npc: '궁정 관리',
    difficulty: 'hard',
    isAdvanced: true,
    question: '[심화] 아크바르가 중앙 집권 체제를 강화하기 위해 시행한 제도와 태도로 가장 알맞은 것은?',
    options: [
      '모든 지방 관리를 세습 귀족에게만 맡기고 세금을 면제하였다.',
      '대외 교역을 전면 금지하고 수도에만 성벽을 쌓았다.',
      '관료 조직을 정비하고 다양한 집단의 인재를 등용해 제국을 통합하려 하였다.',
      '언어 사용을 아랍어로만 제한하였다.'
    ],
    answer: 2,
    explanation: '아크바르는 중앙 집권 체제를 확립하고 관용 정책을 통해 다양한 집단을 하나로 아우르고자 했습니다.',
    reward: 100,
    xp: 50,
    hint: '아크바르 시대의 핵심 키워드는 중앙 집권과 인재 등용, 그리고 관용입니다.',
    unlocksNoteIds: ['pol_akbar_central']
  },
  {
    id: 102,
    category: '심화 · 영토',
    npc: '병사',
    difficulty: 'hard',
    isAdvanced: true,
    question: '[심화] 아우랑제브 시기에 무굴 제국의 영토가 가장 크게 넓어진 방향과 그 결과로 옳은 것은?',
    options: [
      '북부 히말라야 산맥만 지배하고 남쪽으로는 내려가지 않았다.',
      '인도양 섬들만 차지하고 육지 영토는 포기하였다.',
      '전쟁 없이 모든 지방이 스스로 복속하였다.',
      '남인도까지 영토를 넓혀 최대 영역을 이루었으나, 잦은 전쟁과 갈등이 커졌다.'
    ],
    answer: 3,
    explanation: '아우랑제브는 남인도까지 영토를 확대하여 최대 판도를 이루었지만, 이슬람 제일주의와 원정으로 내부 갈등도 깊어졌습니다.',
    reward: 100,
    xp: 50,
    hint: '남쪽으로의 군사 원정으로 영토가 최대가 된 시기를 떠올려 보세요.',
    unlocksNoteIds: ['pol_aurangzeb_south']
  },
  {
    id: 103,
    category: '심화 · 공예와 교역',
    npc: '도자기 장인',
    difficulty: 'medium',
    isAdvanced: true,
    question: '[심화] 무굴 제국 시장에서 장인들의 물품과 면직물이 활발히 거래될 수 있었던 바탕은?',
    options: [
      '물물교환만 법으로 허용했기 때문이다.',
      '활발한 대외 교역과 은 유입으로 상업과 화폐 경제가 발달했기 때문이다.',
      '유럽 상인의 출입을 완전히 막았기 때문이다.',
      '모든 장인이 황제 궁전 안에서만 일했기 때문이다.'
    ],
    answer: 1,
    explanation: '대외 교역으로 은이 대거 유입되면서 화폐 경제와 도시의 상업·수공업이 함께 번성했습니다.',
    reward: 80,
    xp: 40,
    hint: '시장에서 물건이 잘 팔리려면 활발한 교역과 돈(화폐)의 흐름이 중요해요.',
    unlocksNoteIds: ['eco_trade', 'eco_currency']
  },
  {
    id: 104,
    category: '심화 · 문화 융합',
    npc: '학자',
    difficulty: 'hard',
    isAdvanced: true,
    question: '[심화] 무굴 제국의 궁정과 거리에서 페르시아어와 우르두어가 함께 쓰인 모습은 무엇을 보여주나요?',
    options: [
      '백성들이 글자를 전혀 배우지 못했음을 뜻한다.',
      '페르시아 문화가 하루아침에 사라졌음을 보여준다.',
      '모든 지역이 동일한 방언만 사용했음을 뜻한다.',
      '궁정의 공식 행정 문화와 백성들의 일상 문화 속에서 두 전통이 공존·융합되었음을 보여준다.'
    ],
    answer: 3,
    explanation: '공식 문서에는 페르시아어가, 일상에서는 우르두어가 쓰이며 인도·이슬람 문화의 다층적 융합이 이루어졌습니다.',
    reward: 100,
    xp: 50,
    hint: '공식 언어와 일상 언어가 각자의 자리에서 함께 발전한 모습에 주목해 보세요.',
    unlocksNoteIds: ['cul_urdu']
  },
  {
    id: 105,
    category: '심화 · 경제',
    npc: '향신료 상인',
    difficulty: 'medium',
    isAdvanced: true,
    question: '[심화] 무굴 제국에서 향신료와 면직물 무역이 번성할 때 상인들이 주로 거래 대금으로 받은 것은?',
    options: [
      '석탄 덩어리',
      '유럽과 아시아에서 유입된 은(은화)',
      '소금 벽돌만 사용',
      '종이 어음만 사용'
    ],
    answer: 1,
    explanation: '인도의 면직물과 향신료를 사기 위해 각국 상인들이 은을 가져오면서 무굴 제국에 은이 풍부해지고 화폐 경제가 성장했습니다.',
    reward: 70,
    xp: 35,
    hint: '세계 여러 나라 상인들이 인도의 특산물을 사 가며 건넨 귀금속을 생각해보세요.',
    unlocksNoteIds: ['eco_trade', 'eco_currency']
  }
];
