import React, { useState } from 'react';
import { CheckCircle2, Landmark, Sparkles, Users, X } from 'lucide-react';
import { audioSystem } from '../systems/audioSystem';

interface AkbarExperienceModalProps {
  alreadyCompleted: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const RESIDENTS = [
  {
    id: 'hindu_merchant',
    name: '힌두교 상인 라비',
    emoji: '🪔',
    quote: '시장에서 열심히 장사하며 세금을 내고 있지만, 종교가 다르다는 이유로 인두세까지 내야 할 때는 어깨가 무겁답니다.'
  },
  {
    id: 'muslim_merchant',
    name: '무슬림 상인 알리',
    emoji: '🕌',
    quote: '이웃 힌두교 상인들과 함께 비단과 향신료를 거래해야 시장 전체가 번성해요. 서로 신뢰할 수 있는 공정한 규칙이 필요해요.'
  },
  {
    id: 'artisan',
    name: '마을 장인 카비르',
    emoji: '🎨',
    quote: '건축과 그림 작업을 할 때 여러 전통의 기술이 함께 모이면 훨씬 아름다운 작품이 탄생한답니다!'
  },
  {
    id: 'official',
    name: '지방 관리 비르발',
    emoji: '📜',
    quote: '넓은 제국을 안정적으로 다스리려면 능력 있는 사람이라면 종교를 가리지 않고 관료로 등용하는 지혜가 필요해요.'
  },
  {
    id: 'farmer',
    name: '마을 농부 모한',
    emoji: '🌾',
    quote: '우리가 평화롭게 농사를 지으려면 마을에 다툼이 없어야 해요. 서로의 축제와 문화를 존중하는 분위기가 가장 중요합니다.'
  }
];

export const AkbarExperienceModal: React.FC<AkbarExperienceModalProps> = ({
  alreadyCompleted,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [heardIds, setHeardIds] = useState<string[]>([]);
  const [selectedResident, setSelectedResident] = useState(RESIDENTS[0]);
  const [step2Choice, setStep2Choice] = useState<number | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({
    jizya: '',
    hindu: '',
    dialogue: ''
  });
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const handleHearResident = (r: (typeof RESIDENTS)[number]) => {
    audioSystem.playDialogue();
    setSelectedResident(r);
    if (!heardIds.includes(r.id)) {
      setHeardIds((prev) => [...prev, r.id]);
    }
  };

  const handleStep2Submit = () => {
    if (step2Choice === null) return;
    if (step2Choice === 1) {
      audioSystem.playSuccess();
      setStep2Error(null);
      setStep(3);
    } else {
      audioSystem.playWrong();
      setStep2Error('한쪽 집단만 우대하거나 세금 차별을 두면 마을의 갈등이 더 깊어질 수 있어요. 아쉽습니다! 다시 생각해보세요.');
    }
  };

  const handleStep3Submit = () => {
    if (
      matchAnswers.jizya === 'tax_relief' &&
      matchAnswers.hindu === 'fair_talent' &&
      matchAnswers.dialogue === 'harmony'
    ) {
      audioSystem.playSuccess();
      setStep3Error(null);
      setStep(4);
      onComplete();
    } else {
      audioSystem.playWrong();
      setStep3Error('각 정책이 어떤 문제를 해결하려 했는지 주민들의 이야기를 떠올리며 다시 연결해보세요!');
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#1A130C]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#FFFDF8] border-2 border-[#D4A037] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 bg-[#FEF3C7] border-b border-[#E5C16C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Landmark className="w-5 h-5 text-[#B45309]" />
            <div>
              <h2 className="text-base font-bold text-[#2A2118]">
                🕌 종교와 문화의 광장 · 아크바르 시대 특별 체험
              </h2>
              <p className="text-xs text-[#78350F]">
                {step <= 3 ? `${step}단계 / 3단계` : '체험 완료!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78350F] hover:bg-[#FDE68A] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {step === 1 && (
            <>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#2A2118] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#B45309]" />
                  <span>1단계: 광장에 모인 여러 주민들의 이야기 듣기</span>
                </h3>
                <p className="text-sm text-[#5E4B37]">
                  다양한 배경을 가진 5명의 주민을 모두 눌러 이야기를 들어보세요. ({heardIds.length} / 5)
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {RESIDENTS.map((r) => {
                  const heard = heardIds.includes(r.id);
                  const active = selectedResident.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleHearResident(r)}
                      className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#FEF3C7] border-[#D97706] font-bold'
                          : heard
                          ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                          : 'bg-[#FAF5EB] border-[#E2D3B8] hover:bg-[#F3E9D7]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{r.emoji}</div>
                      <div className="text-[11px] leading-tight text-[#2A2118]">{r.name}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl">
                <div className="text-xs font-bold text-[#B45309] mb-1">
                  {selectedResident.emoji} {selectedResident.name}
                </div>
                <p className="text-sm text-[#2A2118] leading-relaxed">
                  「{selectedResident.quote}」
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={heardIds.length < RESIDENTS.length}
                  onClick={() => {
                    audioSystem.playClick();
                    setStep(2);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
                    heardIds.length < RESIDENTS.length
                      ? 'bg-[#D6CCB9] text-[#7A7060] cursor-not-allowed'
                      : 'bg-[#1F5E57] hover:bg-[#174842] text-white'
                  }`}
                >
                  {heardIds.length < RESIDENTS.length
                    ? `모든 주민 이야기를 들어주세요 (${heardIds.length}/5)`
                    : '2단계로 이동 →'}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#2A2118]">
                  2단계: 갈등을 줄이는 지혜 찾기
                </h3>
                <p className="text-sm text-[#4A3A2A] bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl p-4">
                  「서로 다른 종교를 가진 사람들이 함께 살아가는 마을에서 어떤 정책이 갈등을 줄이는 데 도움이 될까요?」
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  '특정 종교만 인정하고 다른 종교를 믿는 사람에게 높은 세금을 매긴다.',
                  '종교에 따른 세금 차별을 없애고 능력에 따라 관료와 군인으로 고루 등용한다.',
                  '서로 다른 종교의 주민들이 만나 대화하지 못하도록 시장을 나눈다.'
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      audioSystem.playClick();
                      setStep2Choice(idx);
                      setStep2Error(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm cursor-pointer ${
                      step2Choice === idx
                        ? 'bg-[#E6F2F0] border-[#1F5E57] font-semibold text-[#113D38]'
                        : 'bg-white border-[#DFD2BC] hover:bg-[#FAF4E8]'
                    }`}
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>

              {step2Error && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-xl">
                  {step2Error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  disabled={step2Choice === null}
                  onClick={handleStep2Submit}
                  className="px-5 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  선택 확인
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#2A2118]">
                  3단계: 아크바르의 실제 정책과 연결하기
                </h3>
                <p className="text-sm text-[#5E4B37]">
                  아크바르 황제가 시행한 정책들이 어떤 효과를 가져왔는지 알맞게 연결해보세요.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'jizya',
                    policy: '인두세(지즈야) 폐지',
                    options: [
                      { val: 'tax_relief', label: '비이슬람교도의 세금 부담과 차별을 줄임' },
                      { val: 'fair_talent', label: '종교에 관계없이 인재를 나라에 등용함' },
                      { val: 'harmony', label: '서로 다른 신앙과 문화를 이해하고 화합함' }
                    ]
                  },
                  {
                    key: 'hindu',
                    policy: '힌두교인 관료·군인 등용',
                    options: [
                      { val: 'tax_relief', label: '비이슬람교도의 세금 부담과 차별을 줄임' },
                      { val: 'fair_talent', label: '종교에 관계없이 인재를 나라에 등용함' },
                      { val: 'harmony', label: '서로 다른 신앙과 문화를 이해하고 화합함' }
                    ]
                  },
                  {
                    key: 'dialogue',
                    policy: '종교적 관용과 대화 장려',
                    options: [
                      { val: 'tax_relief', label: '비이슬람교도의 세금 부담과 차별을 줄임' },
                      { val: 'fair_talent', label: '종교에 관계없이 인재를 나라에 등용함' },
                      { val: 'harmony', label: '서로 다른 신앙과 문화를 이해하고 화합함' }
                    ]
                  }
                ].map((row) => (
                  <div
                    key={row.key}
                    className="p-3.5 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="text-sm font-bold text-[#2A2118]">{row.policy}</span>
                    <select
                      value={matchAnswers[row.key]}
                      onChange={(e) =>
                        setMatchAnswers((prev) => ({ ...prev, [row.key]: e.target.value }))
                      }
                      className="px-3 py-2 bg-white border border-[#D4C2A3] rounded-lg text-xs text-[#2A2118]"
                    >
                      <option value="">역할을 선택하세요</option>
                      {row.options.map((o) => (
                        <option key={o.val} value={o.val}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {step3Error && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-xl">
                  {step3Error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleStep3Submit}
                  className="px-5 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-sm font-semibold rounded-xl cursor-pointer"
                >
                  체험 완료하기
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 py-2">
              <CheckCircle2 className="w-14 h-14 text-[#16A34A] mx-auto" />
              <h3 className="text-2xl font-bold text-[#2A2118]">
                아크바르 시대 특별 체험 완료!
              </h3>
              <p className="text-sm text-[#5E4B37] max-w-md mx-auto leading-relaxed">
                아크바르 황제는 다양한 종교와 문화를 포용하는 관용 정책과 중앙 집권 체제를 통해 여러 백성이 함께 살아가는 제국의 기반을 다졌습니다.
              </p>
              {!alreadyCompleted ? (
                <div className="p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#92400E]">
                    <Sparkles className="w-4 h-4" />
                    <span>특별 보상 획득</span>
                  </div>
                  <div className="text-base font-bold text-[#78350F] tabular-nums">
                    🪙 +150 무굴 코인 · ⭐ +100 XP
                  </div>
                  <div className="text-xs font-semibold text-[#1F5E57]">
                    특별 가구 해금: 아크바르 시대 장식 깃발
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#6B5742]">
                  이미 보상을 획득한 특별 체험이에요. 복습 완료!
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
