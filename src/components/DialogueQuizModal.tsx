import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Home,
  MessageSquarePlus,
  Send,
  Sparkles,
  X,
  XCircle
} from 'lucide-react';
import { answerPlayerQuestion } from '../data/npcData';
import { audioSystem } from '../systems/audioSystem';
import { EraType, NpcDefinition, QuizQuestion } from '../types/game';
import { CharacterPreview } from './CharacterPreview';

interface DialogueQuizModalProps {
  npc: NpcDefinition;
  era: EraType;
  currentDay: number;
  isFreeMode?: boolean;
  day7SpecialDone: boolean;
  isFeaturedToday: boolean;
  todayFeaturedNpc: NpcDefinition;
  quiz: QuizQuestion | null;
  currentHealth: number;
  maxHealth: number;
  onClose: () => void;
  onDialogueComplete: (npc: NpcDefinition) => void;
  onUnlockNote: (noteId: string) => void;
  onQuizSolved: (quiz: QuizQuestion, isFeaturedToday: boolean) => void;
  onQuizWrong: () => void;
  onOpenFurnitureShop: () => void;
  onReturnHome: () => void;
}

type ModalStage = 'dialogue' | 'ask' | 'quiz' | 'correct' | 'wrong' | 'go_home';

export const DialogueQuizModal: React.FC<DialogueQuizModalProps> = ({
  npc,
  era,
  currentDay,
  isFreeMode = false,
  day7SpecialDone,
  isFeaturedToday,
  todayFeaturedNpc,
  quiz,
  currentHealth,
  maxHealth,
  onClose,
  onDialogueComplete,
  onUnlockNote,
  onQuizSolved,
  onQuizWrong,
  onOpenFurnitureShop,
  onReturnHome
}) => {
  const lines =
    (era === 'akbar' ? npc.dialoguesByEra?.akbar : npc.dialoguesByEra?.aurangzeb) ||
    npc.defaultDialogues;

  const [lineIndex, setLineIndex] = useState(0);
  const [stage, setStage] = useState<ModalStage>('dialogue');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dialogueFinished, setDialogueFinished] = useState(false);

  const [questionInput, setQuestionInput] = useState('');
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);

  const currentLine = lines[lineIndex];

  const finishDialogueNotes = () => {
    if (!dialogueFinished) {
      setDialogueFinished(true);
      onDialogueComplete(npc);
    }
  };

  const handleNextLine = () => {
    audioSystem.playDialogue();
    if (lineIndex < lines.length - 1) {
      setLineIndex((i) => i + 1);
      return;
    }

    finishDialogueNotes();
    // Featured resident (Days 1-6) -> go straight to quiz; Day 7 / Free Mode / Non-featured -> Ask/Choice stage
    if (isFeaturedToday && quiz) {
      setStage('quiz');
    } else {
      setStage('ask');
    }
  };

  const handleOpenAsk = () => {
    audioSystem.playClick();
    finishDialogueNotes();
    setStage('ask');
  };

  const submitQuestion = (rawQ: string) => {
    const trimmed = rawQ.trim();
    if (!trimmed) return;
    audioSystem.playDialogue();
    const res = answerPlayerQuestion(npc, trimmed, era, todayFeaturedNpc, currentDay);
    if (res.unlocksNoteId) {
      onUnlockNote(res.unlocksNoteId);
    }
    setQaHistory((prev) => [...prev, { q: trimmed, a: res.answer }]);
    setQuestionInput('');
  };

  const handleSubmitQuiz = () => {
    if (!quiz || selectedOption === null) return;
    if (selectedOption === quiz.answer) {
      audioSystem.playSuccess();
      setStage('correct');
      onQuizSolved(quiz, isFeaturedToday);
    } else {
      audioSystem.playWrong();
      onQuizWrong();
      setStage('wrong');
    }
  };

  const handleAfterCorrect = () => {
    audioSystem.playClick();
    if (isFeaturedToday) {
      setStage('go_home');
    } else {
      onClose();
    }
  };

  const quizXp =
    quiz?.xp ?? (quiz?.difficulty === 'hard' ? 40 : quiz?.difficulty === 'medium' ? 30 : 20);

  return (
    <div className="fixed inset-0 z-40 bg-[#1A130C]/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#FFFDF8] border-2 border-[#D4B98C] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FAF1E0] border-b border-[#E5D4B3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{npc.emoji}</span>
            <div>
              <div className="text-sm font-bold text-[#2A2118]">
                {npc.name}
                {isFeaturedToday ? (
                  <span className="ml-2 text-xs font-semibold text-[#B46924]">
                    · 오늘의 주요 주민
                  </span>
                ) : isFreeMode ? (
                  <span className="ml-2 text-xs font-semibold text-[#1F5E57]">· 자유 탐험</span>
                ) : (
                  <span className="ml-2 text-xs font-medium text-[#7A6650]">· 이야기 친구</span>
                )}
              </div>
              <div className="text-[11px] text-[#7A6650]">{npc.role}</div>
            </div>
          </div>
          {stage !== 'go_home' && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#6B5742] hover:text-[#2A2118] rounded-lg hover:bg-[#EFE2CA] cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto">
          {/* Stage 1: Natural Dialogue */}
          {stage === 'dialogue' && (
            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="shrink-0 bg-[#F4EAD5] border border-[#DEC9A4] rounded-xl p-2">
                  <CharacterPreview appearance={npc.appearance} size={110} scale={1.4} />
                </div>
                <div className="flex-1 bg-[#FAF5EB] border border-[#E5D6BC] rounded-xl p-4 w-full">
                  <div className="text-xs font-bold text-[#8C6432] mb-1">
                    {currentLine.speaker}
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#2A2118]">
                    「{currentLine.text}」
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="text-xs text-[#7A6650] tabular-nums">
                  대화 {lineIndex + 1} / {lines.length}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAsk}
                    className="px-3.5 py-2 text-xs font-semibold bg-[#FAF2E3] hover:bg-[#EFE1C6] text-[#4A3A2A] border border-[#DEC9A4] rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-[#B46924]" />
                    <span>질문하기</span>
                  </button>
                  {npc.id === 'npc_furniture' && (
                    <button
                      type="button"
                      onClick={() => {
                        finishDialogueNotes();
                        onOpenFurnitureShop();
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#B46924] hover:bg-[#99571B] text-white rounded-xl cursor-pointer"
                    >
                      🛋️ 가구 상점 열기
                    </button>
                  )}
                  {isFreeMode && lineIndex === lines.length - 1 && quiz && (
                    <button
                      type="button"
                      onClick={() => {
                        audioSystem.playClick();
                        finishDialogueNotes();
                        setStage('quiz');
                      }}
                      className="px-4 py-2.5 text-sm font-semibold bg-[#B46924] hover:bg-[#99571B] text-white rounded-xl cursor-pointer"
                    >
                      📝 퀴즈 풀기 →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextLine}
                    className="px-5 py-2.5 text-sm font-semibold bg-[#1F5E57] hover:bg-[#174842] text-white rounded-xl transition-colors cursor-pointer"
                  >
                    {lineIndex < lines.length - 1
                      ? '다음 이야기 →'
                      : isFeaturedToday && quiz
                      ? '질문(퀴즈) 듣기 →'
                      : '주민에게 질문하기 →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stage 1B: Ask Questions to Resident */}
          {stage === 'ask' && (
            <div className="p-6 space-y-4">
              {!isFeaturedToday && (
                <div className="px-3.5 py-2.5 bg-[#FAF4E8] border border-[#E2CFA8] rounded-xl text-xs text-[#5E4B37]">
                  {currentDay === 7 ? (
                    <>
                      오늘은 <b>7일차 특별 체험의 날</b>이에요! 마을의 🕌 종교와 문화의 광장과 ⚔️ 무굴 군영에서 특별 체험을 즐겨보세요. {npc.name}님과는 편하게 이야기를 나눌 수 있어요!
                    </>
                  ) : isFreeMode ? (
                    <>
                      자유 탐험 기간입니다! {npc.name}님과 편하게 이야기를 나누고 질문하거나, 아래 버튼으로 퀴즈에도 도전할 수 있어요.
                    </>
                  ) : (
                    <>
                      오늘은 {todayFeaturedNpc.emoji} <b>{todayFeaturedNpc.name}</b>님이 주요 주민이에요. {npc.name}님과는 편하게 이야기를 나누고 궁금한 점을 질문할 수 있어요!
                    </>
                  )}
                </div>
              )}

              {/* Q&A Chat History */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {qaHistory.length === 0 ? (
                  <div className="p-4 bg-[#FAF5EB] border border-[#E5D6BC] rounded-xl text-sm text-[#5E4B37]">
                    {npc.emoji} {npc.name}: 「무굴 제국이나 우리 마을 생활에 대해 궁금한 점이 있으면 아래 질문을 누르거나 직접 물어보세요!」
                  </div>
                ) : (
                  qaHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-end">
                        <div className="bg-[#1F5E57] text-white text-xs sm:text-sm px-3.5 py-2 rounded-xl max-w-[85%]">
                          {item.q}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-[#FAF5EB] border border-[#E5D6BC] text-[#2A2118] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl max-w-[90%] leading-relaxed">
                          <span className="font-bold text-[#8C6432]">{npc.name}: </span>
                          「{item.a}」
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Suggested Quick Questions */}
              {npc.askableQuestions && npc.askableQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-[#7A6650]">눌러서 바로 질문하기</div>
                  <div className="flex flex-col gap-1.5">
                    {npc.askableQuestions.map((aq) => (
                      <button
                        key={aq.id}
                        type="button"
                        onClick={() => submitQuestion(aq.question)}
                        className="text-left px-3.5 py-2 bg-[#FFF9EE] hover:bg-[#FEF2DA] border border-[#E4CFA6] rounded-xl text-xs font-medium text-[#2A2118] transition-colors cursor-pointer"
                      >
                        💬 {aq.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Free-form Question Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitQuestion(questionInput);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={`${npc.name}님에게 궁금한 점을 입력해보세요...`}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#D4C2A3] rounded-xl text-xs sm:text-sm text-[#2A2118] focus:outline-none focus:border-[#1F5E57]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#B46924] hover:bg-[#99571B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>질문</span>
                </button>
              </form>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDE3D2]">
                {npc.id === 'npc_furniture' ? (
                  <button
                    type="button"
                    onClick={onOpenFurnitureShop}
                    className="px-4 py-2 text-xs font-semibold bg-[#B46924] hover:bg-[#99571B] text-white rounded-xl cursor-pointer"
                  >
                    🛋️ 가구 상점 열기
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {isFreeMode && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-sm font-semibold bg-white hover:bg-[#F6EFE2] text-[#2A2118] border border-[#D4C2A3] rounded-xl cursor-pointer"
                    >
                      인사 마치기
                    </button>
                  )}
                  {(isFeaturedToday || isFreeMode) && quiz ? (
                    <button
                      type="button"
                      onClick={() => {
                        audioSystem.playClick();
                        setStage('quiz');
                      }}
                      className="px-5 py-2.5 text-sm font-semibold bg-[#1F5E57] hover:bg-[#174842] text-white rounded-xl cursor-pointer"
                    >
                      {isFreeMode ? '📝 이 주민의 퀴즈 풀기 →' : '오늘의 퀴즈 풀기 →'}
                    </button>
                  ) : (
                    !isFreeMode && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold bg-[#1F5E57] hover:bg-[#174842] text-white rounded-xl cursor-pointer"
                      >
                        인사 마치고 돌아가기
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: In-Game Quiz Card (Only for today's featured resident) */}
          {stage === 'quiz' && quiz && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between text-xs text-[#7A6650]">
                <span className="font-bold text-[#1F5E57]">
                  {npc.emoji} {npc.name}의 질문 · {quiz.category}
                </span>
                <span className="tabular-nums">
                  보상 🪙 +{quiz.reward} · ⭐ +{quizXp} XP
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#2A2118] leading-snug">
                {quiz.question}
              </h3>

              <div className="space-y-2.5">
                {quiz.options.map((opt, idx) => {
                  const active = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        audioSystem.playClick();
                        setSelectedOption(idx);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-center gap-3 cursor-pointer ${
                        active
                          ? 'bg-[#E6F2F0] border-[#1F5E57] text-[#113D38] font-semibold'
                          : 'bg-[#FAF6EE] border-[#E2D3B8] text-[#2A2118] hover:bg-[#F3E9D7]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                          active
                            ? 'bg-[#1F5E57] border-[#1F5E57] text-white'
                            : 'border-[#B69F7D] bg-white text-[#6B5742]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playClick();
                    setStage('ask');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#FAF2E3] hover:bg-[#EFE1C6] text-[#4A3A2A] border border-[#DEC9A4] rounded-xl cursor-pointer"
                >
                  💬 먼저 질문하기
                </button>
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitQuiz}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                    selectedOption === null
                      ? 'bg-[#D6CCB9] text-[#7A7060] cursor-not-allowed'
                      : 'bg-[#1F5E57] hover:bg-[#174842] text-white'
                  }`}
                >
                  정답 제출
                </button>
              </div>
            </div>
          )}

          {/* Stage 3A: Correct */}
          {stage === 'correct' && quiz && (
            <div className="p-6 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-[#16A34A] mx-auto" />
              <h3 className="text-2xl font-bold text-[#14532D]">⭕ 정답입니다!</h3>
              <p className="text-sm text-[#3F352B] bg-[#FAF4E8] border border-[#E5D6BC] rounded-xl p-4 leading-relaxed">
                {quiz.explanation}
              </p>
              <div className="flex items-center justify-center gap-6 py-2 text-base font-bold text-[#9C571B] tabular-nums">
                <span>🪙 +{quiz.reward} 무굴 코인</span>
                <span>⭐ +{quizXp} 경험치</span>
              </div>
              {isFreeMode ? (
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl cursor-pointer"
                  >
                    계속 마을 탐험하기
                  </button>
                  <button
                    onClick={onReturnHome}
                    className="px-5 py-2.5 bg-white hover:bg-[#F6EFE2] text-[#2A2118] border border-[#D4C2A3] font-semibold rounded-xl cursor-pointer"
                  >
                    🏠 집으로 가기
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAfterCorrect}
                  className="px-7 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl cursor-pointer"
                >
                  확인
                </button>
              )}
            </div>
          )}

          {/* Stage 3B: Wrong (-10 HP, Game Over if 0) */}
          {stage === 'wrong' && quiz && (
            <div className="p-6 text-center space-y-4">
              <XCircle className="w-14 h-14 text-[#DC2626] mx-auto" />
              <h3 className="text-xl font-bold text-[#7F1D1D]">❌ 아쉽습니다!</h3>
              <div className="inline-block px-3.5 py-1.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg text-sm font-bold text-[#991B1B] tabular-nums">
                ❤️ 체력 -10 (남은 체력: {currentHealth}/{maxHealth})
              </div>
              <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4 text-sm text-[#78350F] text-left flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
                <div>
                  <div className="font-bold mb-0.5">💡 힌트</div>
                  <div>{quiz.hint || '주민이 방금 들려준 생활 이야기를 다시 떠올려 보세요!'}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setStage('quiz');
                }}
                className="px-6 py-2.5 bg-[#B46924] hover:bg-[#99571B] text-white font-semibold rounded-xl cursor-pointer"
              >
                다시 풀기
              </button>
            </div>
          )}

          {/* Stage 4: Featured Resident Completed -> Day 7 Special Exp or Return Home */}
          {stage === 'go_home' && (
            <div className="p-7 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-[#D97706] mx-auto" />
              {currentDay === 7 && !day7SpecialDone ? (
                <>
                  <h3 className="text-xl font-bold text-[#2A2118]">
                    🎉 7일차 퀴즈 완료! 이제 특별 체험을 해보세요!
                  </h3>
                  <p className="text-sm text-[#5E4B37] leading-relaxed">
                    7일째를 맞아 🕌 <b>종교와 문화의 광장(아크바르)</b>과 ⚔️ <b>무굴 군영(아우랑제브)</b> 특별 체험이 모두 열렸습니다. 마을에서 두 특별 체험을 완료한 뒤 집으로 돌아가세요!
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-[#B46924] hover:bg-[#99571B] text-white font-semibold rounded-xl cursor-pointer"
                    >
                      ✨ 7일차 특별 체험 하러 가기
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#2A2118]">
                    🌇 오늘 하루도 수고했어요!
                  </h3>
                  <p className="text-sm text-[#5E4B37]">
                    오늘의 주요 주민과 이야기를 나누고 퀴즈도 해결했어요. 이제 집으로 돌아가 쉴 시간입니다.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onReturnHome}
                      className="px-6 py-3 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Home className="w-4 h-4" />
                      <span>🏠 집으로 돌아가기</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
