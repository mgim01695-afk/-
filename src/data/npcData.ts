import { EraType, NpcDefinition } from '../types/game';

export const NPC_DATA: NpcDefinition[] = [
  {
    id: 'npc_textile',
    name: '면직물 상인',
    role: '시장 직물 상인',
    emoji: '🧵',
    x: 780,
    y: 1395,
    locationId: 'textile_shop',
    personality: '활기차고 자부심이 넘치는 상인',
    featuredDayOrder: 1,
    quizNpcKeys: ['면직물 상인'],
    unlocksNoteIds: ['eco_cotton', 'eco_trade'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#2B2118',
      skinColor: '#D69D73',
      outfitStyle: 'kurta_teal',
      hatStyle: 'turban',
      accessory: 'scarf'
    },
    defaultDialogues: [
      { speaker: '면직물 상인', text: '어서 오세요! 요즘 우리 가게 면직물이 정말 잘 팔려요.', mood: 'happy' },
      { speaker: '면직물 상인', text: '가볍고 튼튼하면서도 색감이 고와서 아시아뿐 아니라 유럽에서도 찾는 사람이 아주 많답니다.', mood: 'proud' },
      { speaker: '면직물 상인', text: '우리 마을 사람들도 목화를 기르거나 실을 뽑고 천을 짜면서 면직물과 관련된 일을 많이 하고 있어요!', mood: 'happy' }
    ],
    askableQuestions: [
      {
        id: 'tex_q1',
        question: '왜 아시아와 유럽에서 무굴 면직물을 그렇게 많이 찾나요?',
        answer: '인도 면직물은 더운 날씨에도 통풍이 잘되고, 천연 염색으로 낸 꽃무늬와 색감이 물에 빨아도 잘 바래지 않기 때문이에요!',
        keywords: ['면직물', '인기', '유럽', '아시아', '천', '직물'],
        unlocksNoteId: 'eco_cotton'
      },
      {
        id: 'tex_q2',
        question: '면직물을 팔면 마을 경제에 어떤 도움이 되나요?',
        answer: '농부는 목화를 기르고, 장인은 실과 천을 짜고, 상인은 바닷길로 수출하면서 온 마을에 은화와 일자리가 돌게 된답니다.',
        keywords: ['마을', '경제', '목화', '무역', '수출', '팔'],
        unlocksNoteId: 'eco_trade'
      }
    ]
  },
  {
    id: 'npc_spice',
    name: '향신료 상인',
    role: '바자르 향신료 상인',
    emoji: '🌶️',
    x: 1620,
    y: 1395,
    locationId: 'spice_shop',
    personality: '세상 물정에 밝고 수완이 좋은 상인',
    featuredDayOrder: 2,
    quizNpcKeys: ['향신료 상인', '상인'],
    unlocksNoteIds: ['eco_trade', 'eco_currency'],
    appearance: {
      hairStyle: 'curly',
      hairColor: '#3B281E',
      skinColor: '#C5875E',
      outfitStyle: 'kurta_saffron',
      hatStyle: 'cap',
      accessory: 'satchel'
    },
    defaultDialogues: [
      { speaker: '향신료 상인', text: '후추, 계피, 카다멈 향기 좀 맡아보세요! 먼 바다 건너 상인들도 이 향신료를 사러 오지요.', mood: 'happy' },
      { speaker: '향신료 상인', text: '대외 무역이 크게 활발해지면서 세계 각국에서 반짝이는 은이 우리 제국으로 많이 들어왔어요.', mood: 'curious' },
      { speaker: '향신료 상인', text: '덕분에 시장에서는 물건 값을 돈으로 주고받는 화폐 경제가 더욱 크게 발달했답니다.', mood: 'proud' }
    ],
    askableQuestions: [
      {
        id: 'spi_q1',
        question: '외국 상인들이 은을 많이 가져오면 무엇이 달라지나요?',
        answer: '유입된 은으로 루피아 같은 은화를 넉넉히 주조할 수 있어서, 물물교환 대신 돈으로 세금과 물건 값을 내는 화폐 경제가 크게 발달했어요!',
        keywords: ['은', '은화', '화폐', '경제', '돈', '무역'],
        unlocksNoteId: 'eco_currency'
      },
      {
        id: 'spi_q2',
        question: '여기 시장에서는 주로 어떤 향신료가 거래되나요?',
        answer: '후추, 카다멈, 계피, 정향 같은 귀한 향신료들이 인도양 무역선을 타고 멀리까지 팔려 나간답니다.',
        keywords: ['향신료', '후추', '계피', '시장', '거래'],
        unlocksNoteId: 'eco_trade'
      }
    ]
  },
  {
    id: 'npc_potter',
    name: '도자기 장인',
    role: '공방 도공',
    emoji: '🏺',
    x: 925,
    y: 1645,
    locationId: 'pottery_workshop',
    personality: '차분하고 손재주가 뛰어난 장인',
    featuredDayOrder: 3,
    quizNpcKeys: ['도자기 장인'],
    unlocksNoteIds: ['eco_currency', 'cul_painting'],
    appearance: {
      hairStyle: 'bun',
      hairColor: '#251D17',
      skinColor: '#DDA77E',
      outfitStyle: 'tunic_emerald',
      hatStyle: 'none',
      accessory: 'scarf'
    },
    defaultDialogues: [
      { speaker: '도자기 장인', text: '물레가 돌아가는 소리를 들으면 마음이 편안해져요. 오늘도 푸른 꽃무늬 항아리를 빚고 있답니다.', mood: 'happy' },
      { speaker: '도자기 장인', text: '바자르에 장사를 하러 온 사람도 늘고 은화가 잘 돌다 보니 우리 공방 그릇을 찾는 집도 많아졌어요.', mood: 'thoughtful' },
      { speaker: '도자기 장인', text: '이곳 공예품에는 인도의 전통 문양과 페르시아의 정교한 장식이 자연스럽게 어우러져 있답니다.', mood: 'proud' }
    ],
    askableQuestions: [
      {
        id: 'pot_q1',
        question: '무굴 도자기의 푸른 무늬는 어디서 영향을 받았나요?',
        answer: '페르시아에서 전해진 청화 유약 기술과 인도의 연꽃·덩굴 문양이 어우러져 이렇게 맑은 푸른빛 도자기(수라히)가 태어났어요.',
        keywords: ['도자기', '무늬', '페르시아', '인도', '항아리', '공예'],
        unlocksNoteId: 'cul_painting'
      },
      {
        id: 'pot_q2',
        question: '상업이 발달하면 장인들의 생활도 달라지나요?',
        answer: '네! 화폐 경제가 퍼지고 도시에 사람이 모이면서 그릇, 등불, 가구 같은 생활 공예품 주문이 훨씬 많아졌어요.',
        keywords: ['상업', '화폐', '장인', '생활', '주문'],
        unlocksNoteId: 'eco_currency'
      }
    ]
  },
  {
    id: 'npc_painter',
    name: '화가',
    role: '궁정 세밀화가',
    emoji: '🎨',
    x: 1850,
    y: 660,
    locationId: 'garden',
    personality: '섬세하고 색채를 사랑하는 예술가',
    featuredDayOrder: 4,
    quizNpcKeys: ['화가'],
    unlocksNoteIds: ['cul_painting'],
    appearance: {
      hairStyle: 'bob',
      hairColor: '#231B15',
      skinColor: '#E1B089',
      outfitStyle: 'jamah_indigo',
      hatStyle: 'cap',
      accessory: 'feather'
    },
    defaultDialogues: [
      { speaker: '화가', text: '정원의 꽃잎에 스민 햇빛을 보세요. 이 아름다운 빛깔을 종이 위에 옮겨 그리고 있어요.', mood: 'happy' },
      { speaker: '화가', text: '황제의 후원을 받으며 발전한 무굴 회화는 페르시아의 섬세한 회화 기법과 생동감 넘치는 인도 미술이 결합한 예술이랍니다.', mood: 'proud' },
      { speaker: '화가', text: '궁전의 기록이나 자연, 사람들의 모습을 작은 그림 속에 꼼꼼하게 담아내고 있어요.', mood: 'curious' }
    ],
    askableQuestions: [
      {
        id: 'pai_q1',
        question: '무굴 회화만의 특별한 특징은 무엇인가요?',
        answer: '페르시아 회화의 가늘고 정교한 선에 인도 전통 미술의 생동감 있는 인물 표정과 화사한 색채가 결합된 세밀화예요!',
        keywords: ['회화', '그림', '특징', '페르시아', '인도', '세밀화'],
        unlocksNoteId: 'cul_painting'
      },
      {
        id: 'pai_q2',
        question: '화가들은 누구의 도움을 받아 그림을 그렸나요?',
        answer: '무굴 황제들이 궁정 안에 화방(키타브하나)을 두고 화가들을 적극 후원해 주셔서 많은 걸작이 남을 수 있었어요.',
        keywords: ['후원', '황제', '궁정', '도움'],
        unlocksNoteId: 'cul_painting'
      }
    ]
  },
  {
    id: 'npc_architect',
    name: '건축가',
    role: '제국 수석 건축가',
    emoji: '🏛️',
    x: 1200,
    y: 330,
    locationId: 'palace',
    personality: '균형과 조화를 중시하는 꼼꼼한 설계자',
    featuredDayOrder: 5,
    quizNpcKeys: ['건축가'],
    unlocksNoteIds: ['cul_tajmahal'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#524943',
      skinColor: '#CF976F',
      outfitStyle: 'scholar_cream',
      hatStyle: 'royal_turban',
      accessory: 'pendant'
    },
    defaultDialogues: [
      { speaker: '건축가', text: '자, 이 궁전의 둥근 돔과 뾰족한 아치가 이루는 비례를 한번 살펴보세요.', mood: 'proud' },
      { speaker: '건축가', text: '샤자한 황제께서 사랑하는 아내 뭄타즈 마할을 기리며 세운 타지마할은 무굴 건축의 정수로 꼽히지요.', mood: 'thoughtful' },
      { speaker: '건축가', text: '타지마할에는 이슬람 양식의 돔과 뾰족한 아치뿐 아니라 인도의 전통적인 연꽃 문양이 한데 어우러져 있답니다.', mood: 'happy' }
    ],
    askableQuestions: [
      {
        id: 'arc_q1',
        question: '타지마할에서 인도·이슬람 문화 융합을 어디서 볼 수 있나요?',
        answer: '커다란 양파형 돔과 뾰족한 아치는 이슬람 건축 양식이고, 돔 꼭대기와 벽을 수놓은 연꽃 문양은 인도 전통 양식이에요!',
        keywords: ['타지마할', '융합', '돔', '아치', '연꽃', '건축'],
        unlocksNoteId: 'cul_tajmahal'
      },
      {
        id: 'arc_q2',
        question: '샤자한 황제는 왜 타지마할을 지었나요?',
        answer: '사랑하는 왕비 뭄타즈 마할이 세상을 떠난 뒤 그녀를 영원히 기리기 위해 하얀 대리석으로 지은 아름다운 무덤이에요.',
        keywords: ['샤자한', '뭄타즈', '이유', '왜', '대리석'],
        unlocksNoteId: 'cul_tajmahal'
      }
    ]
  },
  {
    id: 'npc_scholar',
    name: '학자',
    role: '역사와 언어 학자',
    emoji: '📚',
    x: 1280,
    y: 590,
    locationId: 'religion_plaza',
    personality: '지혜롭고 질문을 좋아하는 학자',
    featuredDayOrder: 6,
    quizNpcKeys: ['학자'],
    unlocksNoteIds: ['cul_urdu', 'cul_tajmahal'],
    appearance: {
      hairStyle: 'long',
      hairColor: '#4A433E',
      skinColor: '#DDA882',
      outfitStyle: 'scholar_cream',
      hatStyle: 'turban',
      accessory: 'glasses'
    },
    defaultDialogues: [
      { speaker: '학자', text: '반갑소! 궁전 문서실에서는 페르시아어로 공문서를 쓰지만, 저잣거리에서는 우르두어가 널리 들리지요.', mood: 'curious' },
      { speaker: '학자', text: '여러 배경을 가진 사람들이 함께 모여 살다 보니 인도의 문화와 이슬람 문화가 만나 새로운 인도·이슬람 문화를 빚어냈답니다.', mood: 'thoughtful' },
      { speaker: '학자', text: '언어부터 건축, 그림까지 서로 다른 전통이 만나 조화를 이루는 모습이 참 흥미롭지 않나요?', mood: 'happy' }
    ],
    askableQuestions: [
      {
        id: 'sch_q1',
        question: '우르두어는 어떻게 만들어진 언어인가요?',
        answer: '군영과 시장에서 다양한 사람들이 소통하면서 인도의 문법에 페르시아어와 아랍어 어휘가 자연스럽게 합쳐져 우르두어가 되었답니다.',
        keywords: ['우르두어', '언어', '페르시아어', '일상'],
        unlocksNoteId: 'cul_urdu'
      },
      {
        id: 'sch_q2',
        question: '인도·이슬람 문화가 발전한 배경은 무엇인가요?',
        answer: '무굴 제국 안에서 인도의 오랜 전통과 이슬람·페르시아 문화가 서로 배척하지 않고 만나 결합하면서 새롭고 풍부한 문화가 꽃피었어요.',
        keywords: ['인도', '이슬람', '문화', '배경', '결합'],
        unlocksNoteId: 'cul_tajmahal'
      }
    ]
  },
  {
    id: 'npc_soldier',
    name: '병사',
    role: '무굴 군영 장교',
    emoji: '⚔️',
    x: 1970,
    y: 355,
    locationId: 'military_camp',
    personality: '절도 있고 책임감이 강한 군인',
    featuredDayOrder: 7,
    quizNpcKeys: ['병사'],
    unlocksNoteIds: ['pol_aurangzeb_south', 'pol_aurangzeb_islam', 'pol_aurangzeb_jizya'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#1E1815',
      skinColor: '#BC7E58',
      outfitStyle: 'jamah_crimson',
      hatStyle: 'royal_turban',
      accessory: 'satchel'
    },
    defaultDialogues: [
      { speaker: '병사', text: '무굴 군영에 오신 것을 환영합니다! 먼 원정에는 활쏘기와 말 타기, 그리고 보급 전략이 필수랍니다.', mood: 'proud' },
      { speaker: '병사', text: '아크바르 시기에는 다양한 출신 병사들이 함께 복무했고, 아우랑제브 시기에는 남인도까지 영토를 넓히며 이슬람 제일주의와 인두세 부활이 시행되었지요.', mood: 'thoughtful' }
    ],
    askableQuestions: [
      {
        id: 'sol_q1',
        question: '아우랑제브 황제는 어떤 정책을 펼쳤나요?',
        answer: '남인도까지 영토를 넓혀 최대 판도를 이루었지만, 이슬람 제일주의를 내세우며 비이슬람교도에 대한 인두세를 다시 부활시켰습니다.',
        keywords: ['아우랑제브', '정책', '인두세', '이슬람', '남인도'],
        unlocksNoteId: 'pol_aurangzeb_islam'
      },
      {
        id: 'sol_q2',
        question: '무굴 군영에서는 어떤 훈련을 체험할 수 있나요?',
        answer: '군영 지휘소 문 앞으로 가시면 이동 표적 활쏘기, 기마 장애물, 군량 수송, 전략 지도까지 4단계 훈련에 직접 참여해 보실 수 있습니다!',
        keywords: ['군영', '훈련', '체험', '활', '말', '전략'],
        unlocksNoteId: 'pol_aurangzeb_south'
      }
    ]
  },
  {
    id: 'npc_official',
    name: '궁정 관리',
    role: '제국 행정 관리',
    emoji: '📜',
    x: 1090,
    y: 330,
    locationId: 'palace',
    personality: '조목조목 설명을 잘해주는 행정가',
    featuredDayOrder: 8,
    quizNpcKeys: ['궁정 관리'],
    unlocksNoteIds: ['pol_akbar_central', 'pol_akbar_jizya', 'pol_akbar_hindu', 'pol_aurangzeb_jizya'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#2C231D',
      skinColor: '#D49A71',
      outfitStyle: 'jamah_indigo',
      hatStyle: 'royal_turban',
      accessory: 'pendant'
    },
    defaultDialogues: [
      { speaker: '궁정 관리', text: '아크바르 황제께서는 중앙 집권 체제를 다지며 인두세를 폐지하고 힌두교인을 관료로 등용하는 관용 정책을 펼치셨소.', mood: 'thoughtful' },
      { speaker: '궁정 관리', text: '반면 아우랑제브 황제는 남인도까지 영토를 넓히고 이슬람 제일주의와 인두세 부활을 추진했지요. 두 황제의 정책을 비교해 보면 무굴의 변화를 잘 알 수 있소.', mood: 'curious' }
    ],
    askableQuestions: [
      {
        id: 'off_q1',
        question: '아크바르 황제의 관용 정책은 구체적으로 무엇인가요?',
        answer: '비이슬람교도에게 부과하던 인두세(지즈야)를 폐지하고, 힌두교인도 능력에 따라 군인과 관료로 등용해 제국의 안정을 꾀한 정책이오.',
        keywords: ['아크바르', '관용', '인두세', '힌두교', '등용'],
        unlocksNoteId: 'pol_akbar_jizya'
      },
      {
        id: 'off_q2',
        question: '아크바르와 아우랑제브의 가장 큰 차이는 무엇인가요?',
        answer: '아크바르는 종교적 관용으로 통합과 중앙 집권을 다졌고, 아우랑제브는 이슬람 제일주의와 인두세 부활, 남인도 영토 확장을 추진했소.',
        keywords: ['차이', '비교', '아크바르', '아우랑제브', '중앙'],
        unlocksNoteId: 'pol_akbar_central'
      }
    ]
  },
  {
    id: 'npc_punjab',
    name: '펀자브 주민',
    role: '이웃 마을 주민',
    emoji: '🕊️',
    x: 475,
    y: 1245,
    locationId: 'residential_area',
    personality: '따뜻하고 공동체 정신이 강한 이웃',
    featuredDayOrder: 9,
    quizNpcKeys: ['펀자브 주민'],
    unlocksNoteIds: ['cul_sikh'],
    appearance: {
      hairStyle: 'bun',
      hairColor: '#201915',
      skinColor: '#CE946C',
      outfitStyle: 'tunic_emerald',
      hatStyle: 'turban',
      accessory: 'none'
    },
    defaultDialogues: [
      { speaker: '펀자브 주민', text: '안녕하세요, 새 이웃님! 저는 다섯 강이 흐르는 북서부 펀자브 지방에서 왔어요.', mood: 'happy' },
      { speaker: '펀자브 주민', text: '우리 펀자브 지역에서는 시크교가 발전했는데, 공동 식사를 나누며 서로 돕는 따뜻한 전통이 있답니다.', mood: 'proud' },
      { speaker: '펀자브 주민', text: '시크교의 상징인 칸다를 보면 가운데에 검이 놓여 있는데, 이는 신의 권능을 상징해요.', mood: 'curious' }
    ],
    askableQuestions: [
      {
        id: 'pun_q1',
        question: '시크교는 어느 지역에서 발전했고 어떤 특징이 있나요?',
        answer: '인도 북서부 펀자브 지방을 중심으로 발전했어요. 유일신을 믿고 신분 차별을 반대하며 사원(구르드와라)에서 누구나 함께 음식을 나누는 전통이 있죠.',
        keywords: ['시크교', '펀자브', '지역', '특징', '구르드와라'],
        unlocksNoteId: 'cul_sikh'
      },
      {
        id: 'pun_q2',
        question: '시크교의 상징인 칸다 가운데 검은 무엇을 뜻하나요?',
        answer: '양날이 있는 가운데 검은 유일신의 권능과 진리를 상징한답니다.',
        keywords: ['칸다', '검', '상징', '신의 권능'],
        unlocksNoteId: 'cul_sikh'
      }
    ]
  },
  {
    id: 'npc_artisan',
    name: '장인',
    role: '세공 장인',
    emoji: '🔨',
    x: 1475,
    y: 1645,
    locationId: 'artisan_workshop',
    personality: '성실하고 꼼꼼한 공방 주인',
    quizNpcKeys: [],
    unlocksNoteIds: ['eco_cotton', 'eco_currency'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#362B23',
      skinColor: '#C98E66',
      outfitStyle: 'kurta_saffron',
      hatStyle: 'none',
      accessory: 'satchel'
    },
    defaultDialogues: [
      { speaker: '장인', text: '망치 소리가 경쾌하죠? 황동 등불과 상자에 아라베스크 문양을 새기고 있어요.', mood: 'happy' },
      { speaker: '장인', text: '도시와 상업이 발달하면서 집을 꾸미려는 사람들도 부쩍 늘었답니다. 가구 상점의 등불도 우리 공방에서 만들지요!', mood: 'proud' }
    ],
    askableQuestions: [
      {
        id: 'art_q1',
        question: '장인 작업장에서는 주로 어떤 공예품을 만드나요?',
        answer: '색유리 황동 등불(파누스), 은상감 비드리 다기, 나전 보물 함처럼 집을 아름답게 꾸미는 무굴 공예품을 정성껏 만듭니다.',
        keywords: ['공예', '등불', '상자', '비드리', '가구']
      },
      {
        id: 'art_q2',
        question: '아라베스크 문양은 무엇인가요?',
        answer: '덩굴식물과 기하학 도형이 끝없이 이어지는 이슬람·페르시아풍 장식 문양이에요. 무굴 건축과 공예품 곳곳에 쓰이죠.',
        keywords: ['아라베스크', '문양', '장식']
      }
    ]
  },
  {
    id: 'npc_farmer',
    name: '농부',
    role: '목화와 밀 농부',
    emoji: '🌾',
    x: 295,
    y: 575,
    locationId: 'farmer_house',
    personality: '부지런하고 인심이 넉넉한 농부',
    quizNpcKeys: [],
    unlocksNoteIds: ['eco_cotton'],
    appearance: {
      hairStyle: 'short',
      hairColor: '#3F342D',
      skinColor: '#B87C56',
      outfitStyle: 'scholar_cream',
      hatStyle: 'turban',
      accessory: 'none'
    },
    defaultDialogues: [
      { speaker: '농부', text: '올해는 물길이 잘 닿아서 밭에 목화가 하얗게 아주 잘 자랐어요!', mood: 'happy' },
      { speaker: '농부', text: '우리가 기른 목화가 면직물 상점 장인들의 손을 거쳐 먼 나라까지 팔려 나간다고 생각하면 뿌듯하답니다.', mood: 'proud' }
    ],
    askableQuestions: [
      {
        id: 'far_q1',
        question: '목화 농사가 마을에서 왜 그렇게 중요한가요?',
        answer: '목화에서 뽑은 실이 무굴 제국 최고의 수출품인 면직물의 원료가 되기 때문이에요. 농부와 상인이 모두 연결되어 있죠!',
        keywords: ['목화', '면직물', '농사', '중요'],
        unlocksNoteId: 'eco_cotton'
      },
      {
        id: 'far_q2',
        question: '이웃 마을 사람들은 사이좋게 지내나요?',
        answer: '네! 농사일이나 추수 때면 종교가 달라도 서로 품앗이를 도우며 사이좋게 지낸답니다.',
        keywords: ['이웃', '마을', '사람', '화합']
      }
    ]
  },
  {
    id: 'npc_traveler',
    name: '여행자',
    role: '실크로드 여행자',
    emoji: '🧭',
    x: 310,
    y: 280,
    locationId: 'village_gate',
    personality: '호기심 많고 모험을 즐기는 나그네',
    quizNpcKeys: [],
    unlocksNoteIds: ['eco_trade', 'cul_urdu'],
    appearance: {
      hairStyle: 'long',
      hairColor: '#4A3728',
      skinColor: '#E0B28B',
      outfitStyle: 'kurta_teal',
      hatStyle: 'cap',
      accessory: 'satchel'
    },
    defaultDialogues: [
      { speaker: '여행자', text: '먼 사막과 산을 넘어 드디어 무굴 마을에 도착했어요! 성문 너머로 시장 소리가 활기차네요.', mood: 'happy' },
      { speaker: '여행자', text: '페르시아, 아라비아, 인도 여러 곳에서 온 사람들이 시장에서 우르두어로 흥정하는 모습이 정말 인상 깊었어요.', mood: 'curious' }
    ],
    askableQuestions: [
      {
        id: 'tra_q1',
        question: '먼 나라 상인들은 무엇을 사러 무굴 제국에 오나요?',
        answer: '가볍고 아름다운 인도 면직물과 귀한 향신료를 사기 위해 육로와 바닷길로 은화를 잔뜩 싣고 찾아온답니다!',
        keywords: ['상인', '무역', '면직물', '향신료', '은'],
        unlocksNoteId: 'eco_trade'
      },
      {
        id: 'tra_q2',
        question: '여행하면서 가장 신기했던 문화는 무엇인가요?',
        answer: '궁전에서는 페르시아어를 쓰는데 거리에서는 누구나 우르두어로 정겹게 대화하는 모습이 정말 인상적이었어요.',
        keywords: ['문화', '우르두어', '페르시아어', '언어'],
        unlocksNoteId: 'cul_urdu'
      }
    ]
  },
  {
    id: 'npc_child',
    name: '어린이',
    role: '마을 꼬마',
    emoji: '🪁',
    x: 685,
    y: 580,
    locationId: 'well',
    personality: '호기심 많고 발랄한 아이',
    quizNpcKeys: [],
    unlocksNoteIds: ['pol_akbar_hindu'],
    appearance: {
      hairStyle: 'bob',
      hairColor: '#1E1713',
      skinColor: '#D69D73',
      outfitStyle: 'kurta_saffron',
      hatStyle: 'floral',
      accessory: 'none'
    },
    defaultDialogues: [
      { speaker: '어린이', text: '우물가에 모이면 어른들이 재밌는 이야기를 많이 해줘요! 저쪽 종교와 문화의 광장에 가보셨어요?', mood: 'happy' },
      { speaker: '어린이', text: '우리 동네에는 힌두교 친구도 있고 이슬람 친구도, 시크교 친구도 있어서 명절마다 맛있는 음식을 나눠 먹어요!', mood: 'happy' }
    ],
    askableQuestions: [
      {
        id: 'chi_q1',
        question: '종교와 문화의 광장에서는 무엇을 할 수 있나요?',
        answer: '중앙 광장 위쪽 정자로 가면 여러 주민들의 이야기를 듣고 갈등을 줄이는 지혜를 고르는 아크바르 시대 특별 체험을 할 수 있어요!',
        keywords: ['광장', '아크바르', '체험', '종교'],
        unlocksNoteId: 'pol_akbar_hindu'
      },
      {
        id: 'chi_q2',
        question: '마을에서 제일 맛있는 간식은 뭐예요?',
        answer: '향신료 상점 옆 시장에서 파는 달콤한 사프란 우유 과자랑 망고가 최고예요!',
        keywords: ['간식', '음식', '시장', '망고']
      }
    ]
  },
  {
    id: 'npc_furniture',
    name: '가구 상인',
    role: '집 꾸미기 안내원',
    emoji: '🛋️',
    x: 1640,
    y: 938,
    locationId: 'furniture_shop',
    personality: '취향이 세련되고 친절한 상점 주인',
    quizNpcKeys: [],
    unlocksNoteIds: [],
    appearance: {
      hairStyle: 'curly',
      hairColor: '#2B2118',
      skinColor: '#DEAB84',
      outfitStyle: 'jamah_crimson',
      hatStyle: 'turban',
      accessory: 'glasses'
    },
    defaultDialogues: [
      { speaker: '가구 상인', text: '멋진 집을 꾸미고 싶으신가요? 페르시아풍 카펫부터 황동 등불, 타지마할 모형까지 준비해 두었답니다!', mood: 'happy' },
      { speaker: '가구 상인', text: '퀴즈를 풀어 모은 무굴 코인으로 가구를 사서 집에 배치해 보세요. 집이 화려해질수록 집 레벨도 올라가요!', mood: 'proud' }
    ],
    askableQuestions: [
      {
        id: 'fur_q1',
        question: '집 레벨을 올리려면 어떻게 해야 하나요?',
        answer: '가구를 사서 집 안에 많이 배치할수록 매력 점수가 올라가고, 집 레벨이 Lv.1부터 Lv.5 나만의 무굴 궁전까지 성장해요!',
        keywords: ['집', '레벨', '매력', '가구', '배치']
      },
      {
        id: 'fur_q2',
        question: '특별한 기념 깃발 가구도 있나요?',
        answer: '네! 종교와 문화의 광장 체험을 마치면 아크바르 시대 장식 깃발을, 무굴 군영 체험을 마치면 무굴 군영 깃발을 얻을 수 있답니다.',
        keywords: ['깃발', '특별', '해금', '체험']
      }
    ]
  }
];

export const FEATURED_NPC_CYCLE: string[] = [
  'npc_textile',     // Day 1: 면직물 상인
  'npc_spice',       // Day 2: 향신료 상인
  'npc_potter',      // Day 3: 도자기 장인
  'npc_painter',     // Day 4: 화가
  'npc_architect',   // Day 5: 건축가
  'npc_scholar',     // Day 6: 학자
  'npc_soldier',     // Day 7: 병사
  'npc_official',    // Day 8: 궁정 관리
  'npc_punjab'       // Day 9: 펀자브 주민
];

export function getFeaturedNpcForDay(day: number): NpcDefinition {
  const idx = (day - 1) % FEATURED_NPC_CYCLE.length;
  const npcId = FEATURED_NPC_CYCLE[idx];
  return NPC_DATA.find((n) => n.id === npcId) || NPC_DATA[0];
}

export function answerPlayerQuestion(
  npc: NpcDefinition,
  questionText: string,
  _era: EraType,
  todayFeaturedNpc: NpcDefinition,
  currentDay = 1
): { answer: string; unlocksNoteId?: string } {
  const q = questionText.trim().toLowerCase();

  // 1. Check NPC's own askableQuestions by keyword match
  if (npc.askableQuestions) {
    for (const item of npc.askableQuestions) {
      if (item.question.toLowerCase() === q) {
        return { answer: item.answer, unlocksNoteId: item.unlocksNoteId };
      }
      if (item.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
        return { answer: item.answer, unlocksNoteId: item.unlocksNoteId };
      }
    }
  }

  // 2. Check general village topics (featured resident, sleep, coins, era)
  if (q.includes('오늘') || q.includes('누구') || q.includes('주요') || q.includes('퀴즈')) {
    if (currentDay === 7) {
      return {
        answer:
          '오늘은 7일차 특별 체험의 날이에요! 🕌 종교와 문화의 광장(아크바르)과 ⚔️ 무굴 군영(아우랑제브)에서 두 특별 체험을 모두 완료하면 하루를 마칠 수 있답니다.'
      };
    }
    if (currentDay > 7) {
      return {
        answer:
          '7일차 이후에는 자유 탐험 기간이에요! 마을의 원하는 주민과 마음껏 대화하고, 풀고 싶은 퀴즈를 골라 풀어보세요.'
      };
    }
    return {
      answer: `오늘은 ${todayFeaturedNpc.emoji} ${todayFeaturedNpc.name}님이 마을의 주요 주민이에요! 그분과 이야기하고 퀴즈를 풀어야 하루를 마무리할 수 있답니다.`
    };
  }
  if (q.includes('잠') || q.includes('집') || q.includes('체력')) {
    return {
      answer: '하루 활동을 마친 뒤 플레이어의 집 침대에서 잠을 자면 체력이 모두 회복되고 다음 날 아침이 밝아온답니다.'
    };
  }
  if (q.includes('아크바르') || q.includes('인두세') || q.includes('관용')) {
    return {
      answer: '아크바르 황제는 비이슬람교도의 인두세를 폐지하고 힌두교인을 관료와 군인으로 등용해 제국 통합과 안정을 꾀했어요.',
      unlocksNoteId: 'pol_akbar_jizya'
    };
  }
  if (q.includes('아우랑제브') || q.includes('남인도')) {
    return {
      answer: '아우랑제브 황제는 남인도까지 영토를 넓히고 이슬람 제일주의를 펼치며 인두세를 부활시켰답니다.',
      unlocksNoteId: 'pol_aurangzeb_islam'
    };
  }
  if (q.includes('타지마할') || q.includes('샤자한')) {
    return {
      answer: '샤자한 황제가 아내 뭄타즈 마할을 기려 지은 타지마할에는 이슬람 돔·뾰족한 아치와 인도 연꽃 문양이 함께 어우러져 있어요.',
      unlocksNoteId: 'cul_tajmahal'
    };
  }

  // 3. Fallback in-character response using NPC's personality
  return {
    answer: `좋은 질문이네요! 저는 ${npc.role}이라서 ${npc.askableQuestions?.[0]?.question || '우리 마을 일'}에 대해 가장 잘 알고 있어요. 궁금한 주제가 있다면 아래 질문 버튼도 눌러보세요!`
  };
}
