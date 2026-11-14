import React from 'react';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';
import { GameSaveData } from '../types/game';

interface StartScreenProps {
  existingSave: GameSaveData | null;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onResetSave: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  existingSave,
  onStartNewGame,
  onContinueGame,
  onResetSave
}) => {
  return (
    <div className="relative h-screen w-screen overflow-y-auto bg-[#F6EFE2] flex items-center justify-center p-4 sm:p-8">
      <div
        className="pointer-events-none fixed inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgba(217,155,56,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(37,112,104,0.20), transparent 48%)'
        }}
      />

      <div className="relative z-10 w-full max-w-3xl bg-[#FFFDF8] border border-[#DFD2BC] rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#1F5E57] text-[#FDF8EE] px-6 py-8 sm:px-10 sm:py-10 text-center border-b border-[#D8A54B]/40">
          <p className="text-sm text-[#F6D58E] tracking-wide mb-2">
            생활형 역사 탐험 게임 · 사람과 문화, 집 꾸미기
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-3">
            무굴 제국에서 살아보기
          </h1>
          <p className="text-base sm:text-lg text-[#E6ECE9] max-w-xl mx-auto">
            사람을 만나고, 역사를 배우고, 나만의 집을 꾸며보자!
          </p>
          <div className="mt-4 inline-block px-4 py-1.5 bg-[#15453F] border border-[#D8A54B]/40 rounded-lg text-sm text-[#FCEBC4]">
            「무굴 제국의 마을에서 직접 살아보세요!」
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          {existingSave && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#FAF3E4] border border-[#E2CFA8] rounded-xl">
              <div>
                <div className="text-xs text-[#8C6432] font-semibold">저장된 여정 발견</div>
                <div className="text-lg font-bold text-[#2A2118] mt-0.5">
                  {existingSave.playerName} · 무굴 제국 {existingSave.currentDay}일째
                </div>
                <div className="text-sm text-[#6B5742] tabular-nums">
                  코인 {existingSave.coins} · Lv.{existingSave.level} · 집 Lv.{existingSave.houseLevel}
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onContinueGame}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  이어하기
                </button>
                <button
                  onClick={onResetSave}
                  title="새로 시작하기 (기존 저장 초기화)"
                  className="px-3 py-2.5 bg-white hover:bg-[#F3E9D7] text-[#6B5742] border border-[#D8C6A8] rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#FAF5EB] border border-[#E5D6BC] rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#9C571B]">
              <Compass className="w-4 h-4" />
              <span>무굴 제국 마을 생활 안내</span>
            </div>
            <p className="text-sm text-[#4A3A2A] leading-relaxed max-w-xl mx-auto">
              매일 마을을 자유롭게 돌아다니며 이웃들과 이야기를 나누고, 오늘의 주요 주민이 내는 역사 퀴즈를 풀어보세요.
              7일차가 되면 <b>아크바르(종교와 문화의 광장)</b>와 <b>아우랑제브(무굴 군영)</b>의 특별 체험도 함께 열립니다!
            </p>

            <button
              onClick={onStartNewGame}
              className="px-8 py-3.5 bg-[#1F5E57] hover:bg-[#174842] text-white text-base font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              캐릭터 만들고 마을로 출발하기 →
            </button>
          </div>

          <div className="pt-3 border-t border-[#EDE3D2] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B5742]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C88A2E]" />
              <span>이동: WASD / 방향키 / 모바일 조이스틱 · 대화 및 상호작용: Space / 클릭</span>
            </div>
            <span>오답 시 체력 -10 · 0이 되면 게임 종료</span>
          </div>
        </div>
      </div>
    </div>
  );
};
