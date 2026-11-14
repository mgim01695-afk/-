import React from 'react';
import { Lock, ShoppingBag, X } from 'lucide-react';
import { FURNITURE_CATALOG } from '../data/itemFurnitureData';
import { audioSystem } from '../systems/audioSystem';
import { FurnitureDef } from '../types/game';
import { FurniturePreview } from './FurniturePreview';

interface FurnitureShopModalProps {
  coins: number;
  houseLevel: number;
  ownedFurniture: Record<string, number>;
  onBuy: (item: FurnitureDef) => void;
  onClose: () => void;
}

export const FurnitureShopModal: React.FC<FurnitureShopModalProps> = ({
  coins,
  houseLevel,
  ownedFurniture,
  onBuy,
  onClose
}) => {
  const shopItems = FURNITURE_CATALOG.filter((f) => !f.isSpecial);

  return (
    <div className="fixed inset-0 z-40 bg-[#1A130C]/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#FFFDF8] border-2 border-[#D4B98C] rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 bg-[#FAF1E0] border-b border-[#E5D4B3] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#B46924]" />
            <div>
              <h2 className="text-base font-bold text-[#2A2118]">🛋️ 무굴 공예 가구 상점</h2>
              <p className="text-xs text-[#6B5742]">
                무굴 제국의 건축과 공예를 담은 가구로 집을 꾸며보세요! (현재 집 Lv.{houseLevel})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#9C571B] tabular-nums">
              🪙 {coins} 코인
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6B5742] hover:bg-[#EFE2CA] rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shopItems.map((item) => {
            const unlocked = houseLevel >= item.unlockHouseLevel;
            const canAfford = coins >= item.price;
            const owned = ownedFurniture[item.id] || 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  unlocked
                    ? 'bg-[#FAF6EE] border-[#E2D3B8]'
                    : 'bg-[#F3EFE8] border-[#DED8CE] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#EFE4CE] border border-[#D4C2A3] shrink-0 flex items-center justify-center">
                      <FurniturePreview item={item} size={56} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#2A2118]">
                        {item.name}
                        {owned > 0 && (
                          <span className="ml-1.5 text-xs font-normal text-[#1F5E57]">
                            (보유 {owned})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5E4B37] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E6DAC4]">
                  <span className="text-xs font-semibold text-[#7A6650] tabular-nums">
                    매력 +{item.charmPoints} · 해금 집 Lv.{item.unlockHouseLevel}
                  </span>

                  {!unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A7060]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>집 Lv.{item.unlockHouseLevel} 필요</span>
                    </span>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        audioSystem.playCoin();
                        onBuy(item);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                        canAfford
                          ? 'bg-[#1F5E57] hover:bg-[#174842] text-white'
                          : 'bg-[#D6CCB9] text-[#7A7060] cursor-not-allowed'
                      }`}
                    >
                      🪙 {item.price} 구매
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
