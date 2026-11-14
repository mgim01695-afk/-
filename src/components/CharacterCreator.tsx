import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { OUTFIT_COLORS } from '../systems/characterRenderer';
import { DEFAULT_APPEARANCE } from '../systems/saveSystem';
import {
  AccessoryId,
  HairStyleId,
  HatStyleId,
  OutfitStyleId,
  PlayerAppearance
} from '../types/game';
import { CharacterPreview } from './CharacterPreview';

interface CharacterCreatorProps {
  onBack: () => void;
  onConfirm: (name: string, appearance: PlayerAppearance) => void;
}

const HAIR_STYLES: { id: HairStyleId; label: string }[] = [
  { id: 'short', label: '단정 짧은 머리' },
  { id: 'bob', label: '둥근 단발' },
  { id: 'long', label: '긴 생머리' },
  { id: 'bun', label: '올림 머리' },
  { id: 'curly', label: '곱슬 머리' },
  { id: 'braid', label: '땋은 머리' }
];

const HAIR_COLORS = [
  { hex: '#1E1815', label: '검정' },
  { hex: '#3B281E', label: '짙은 갈색' },
  { hex: '#6F4A2D', label: '밤색' },
  { hex: '#A96B35', label: '황갈색' },
  { hex: '#544B46', label: '은빛 회색' },
  { hex: '#7B2D3B', label: '적갈색' }
];

const SKIN_COLORS = [
  { hex: '#F3D2B8', label: '밝은 살구' },
  { hex: '#E4B48C', label: '따뜻한 베이지' },
  { hex: '#D69D73', label: '황토빛' },
  { hex: '#C08156', label: '구릿빛' },
  { hex: '#9B603C', label: '짙은 갈색' }
];

const HAT_STYLES: { id: HatStyleId; label: string }[] = [
  { id: 'none', label: '쓰지 않음' },
  { id: 'cap', label: '비단 모자' },
  { id: 'turban', label: '무굴 터번' },
  { id: 'royal_turban', label: '보석 터번' },
  { id: 'floral', label: '꽃 화관' }
];

const ACCESSORIES: { id: AccessoryId; label: string }[] = [
  { id: 'none', label: '없음' },
  { id: 'scarf', label: '비단 스카프' },
  { id: 'glasses', label: '둥근 안경' },
  { id: 'pendant', label: '황금 목걸이' },
  { id: 'satchel', label: '여행 가방' },
  { id: 'feather', label: '터번 깃털' }
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  onBack,
  onConfirm
}) => {
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState<PlayerAppearance>(DEFAULT_APPEARANCE);

  const update = <K extends keyof PlayerAppearance>(key: K, val: PlayerAppearance[K]) => {
    setAppearance((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim() || '아린', appearance);
  };

  return (
    <div className="h-screen w-screen overflow-y-auto bg-[#F6EFE2] flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-[#FFFDF8] border border-[#DFD2BC] rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 bg-[#FAF2E3] border-b border-[#E5D6BC] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5E4B37] hover:text-[#2A2118] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>시작 화면으로</span>
          </button>
          <div className="text-sm font-semibold text-[#1F5E57]">
            무굴 마을 여행자 · 캐릭터 만들기
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Preview & Name */}
          <div className="md:col-span-4 bg-[#FAF4E8] border border-[#E6D7BC] rounded-xl p-5 flex flex-col items-center">
            <div className="w-full rounded-xl bg-gradient-to-b from-[#DCEFE9] via-[#F2E9D3] to-[#C8D8A8] border border-[#D8C9AA] py-4 mb-4">
              <CharacterPreview
                appearance={appearance}
                size={170}
                scale={2}
                label={name.trim() || '내 캐릭터'}
              />
            </div>

            <div className="w-full space-y-1.5">
              <label htmlFor="player-name" className="block text-sm font-semibold text-[#2A2118]">
                캐릭터 이름
              </label>
              <input
                id="player-name"
                type="text"
                maxLength={12}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 아린, 지호, 미나"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D4C2A3] rounded-lg text-sm text-[#2A2118] focus:outline-none focus:border-[#1F5E57]"
              />
            </div>

            <button
              type="submit"
              className="mt-5 w-full py-3 px-4 bg-[#1F5E57] hover:bg-[#174842] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>무굴 마을로 출발하기</span>
            </button>
          </div>

          {/* Right: Customization Options */}
          <div className="md:col-span-8 space-y-5">
            {/* Hair Style */}
            <div>
              <h3 className="text-sm font-bold text-[#2A2118] mb-2">머리 모양</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {HAIR_STYLES.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => update('hairStyle', h.id)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      appearance.hairStyle === h.id
                        ? 'bg-[#1F5E57] text-white border-[#1F5E57]'
                        : 'bg-white text-[#4A3A2A] border-[#DED0B8] hover:bg-[#FAF2E3]'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color & Skin Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#2A2118] mb-2">머리 색</h3>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.label}
                      onClick={() => update('hairColor', c.hex)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        appearance.hairColor === c.hex
                          ? 'border-[#1F5E57] scale-110 ring-2 ring-[#1F5E57]/30'
                          : 'border-[#D4C2A3]'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#2A2118] mb-2">피부색</h3>
                <div className="flex flex-wrap gap-2">
                  {SKIN_COLORS.map((s) => (
                    <button
                      key={s.hex}
                      type="button"
                      title={s.label}
                      onClick={() => update('skinColor', s.hex)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        appearance.skinColor === s.hex
                          ? 'border-[#1F5E57] scale-110 ring-2 ring-[#1F5E57]/30'
                          : 'border-[#D4C2A3]'
                      }`}
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Outfit */}
            <div>
              <h3 className="text-sm font-bold text-[#2A2118] mb-2">전통 의상 (옷)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(OUTFIT_COLORS) as OutfitStyleId[]).map((key) => {
                  const info = OUTFIT_COLORS[key];
                  const active = appearance.outfitStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => update('outfitStyle', key)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1F5E57] text-white border-[#1F5E57]'
                          : 'bg-white text-[#4A3A2A] border-[#DED0B8] hover:bg-[#FAF2E3]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: info.main }}
                      />
                      <span className="truncate">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hat / Turban */}
            <div>
              <h3 className="text-sm font-bold text-[#2A2118] mb-2">모자 · 터번</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {HAT_STYLES.map((hat) => (
                  <button
                    key={hat.id}
                    type="button"
                    onClick={() => update('hatStyle', hat.id)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      appearance.hatStyle === hat.id
                        ? 'bg-[#B46924] text-white border-[#B46924]'
                        : 'bg-white text-[#4A3A2A] border-[#DED0B8] hover:bg-[#FAF2E3]'
                    }`}
                  >
                    {hat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div>
              <h3 className="text-sm font-bold text-[#2A2118] mb-2">액세서리</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => update('accessory', acc.id)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      appearance.accessory === acc.id
                        ? 'bg-[#B46924] text-white border-[#B46924]'
                        : 'bg-white text-[#4A3A2A] border-[#DED0B8] hover:bg-[#FAF2E3]'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
