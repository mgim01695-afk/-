import { OutfitStyleId, PlayerAppearance } from '../types/game';

export const OUTFIT_COLORS: Record<OutfitStyleId, { main: string; trim: string; pants: string; label: string }> = {
  kurta_teal: { main: '#257068', trim: '#E6B24A', pants: '#F0E6D2', label: '청록 쿠르타' },
  kurta_saffron: { main: '#D4832A', trim: '#78350F', pants: '#F4EAD5', label: '사프란 쿠르타' },
  jamah_crimson: { main: '#A8384B', trim: '#F0C05A', pants: '#EFE6D8', label: '진홍 궁정복' },
  jamah_indigo: { main: '#2F4D7D', trim: '#E5B454', pants: '#E7E1D4', label: '남빛 궁정복' },
  tunic_emerald: { main: '#3D7A52', trim: '#E3B857', pants: '#E8DEC8', label: '비취 튜닉' },
  scholar_cream: { main: '#EAE0CD', trim: '#8F5834', pants: '#CBB89D', label: '학자 예복' }
};

export interface DrawCharOptions {
  scale?: number;
  facing?: 'down' | 'up' | 'left' | 'right';
  walkPhase?: number;
  isWalking?: boolean;
  isSleeping?: boolean;
  label?: string;
  badgeEmoji?: string;
  isHighlighted?: boolean;
}

export function drawMughalCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  appearance: PlayerAppearance,
  opts: DrawCharOptions = {}
) {
  const {
    scale = 1,
    facing = 'down',
    walkPhase = 0,
    isWalking = false,
    isSleeping = false,
    label,
    badgeEmoji,
    isHighlighted = false
  } = opts;

  const outfit = OUTFIT_COLORS[appearance.outfitStyle] || OUTFIT_COLORS.kurta_teal;
  const bob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 3.5 : Math.sin(walkPhase) * 0.8;
  const legSwing = isWalking ? Math.sin(walkPhase * 2) * 4 : 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  if (isSleeping) {
    ctx.rotate(-Math.PI / 2);
  }

  // Highlight ring for featured NPC or interactive target
  if (isHighlighted && !isSleeping) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 4, 22, 10, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.fill();
    ctx.restore();
  }

  // Ground shadow
  if (!isSleeping) {
    ctx.beginPath();
    ctx.ellipse(0, 4, 15, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(42, 33, 24, 0.22)';
    ctx.fill();
  }

  ctx.translate(0, -bob);

  // Feet / Shoes
  ctx.fillStyle = '#5C3A21';
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.6;
  // Left leg
  ctx.beginPath();
  ctx.roundRect(-8, -6 + legSwing * 0.5, 6, 8, 3);
  ctx.fill();
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.roundRect(2, -6 - legSwing * 0.5, 6, 8, 3);
  ctx.fill();
  ctx.stroke();

  // Trousers peeking out
  ctx.fillStyle = outfit.pants;
  ctx.fillRect(-7, -10, 5, 5);
  ctx.fillRect(2, -10, 5, 5);

  // Tunic / Kurta body (flared Mughal silhouette)
  ctx.beginPath();
  ctx.moveTo(-10, -28);
  ctx.lineTo(10, -28);
  ctx.lineTo(14, -7);
  ctx.quadraticCurveTo(0, -4, -14, -7);
  ctx.closePath();
  ctx.fillStyle = outfit.main;
  ctx.fill();
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Gold embroidered hem & collar trim
  ctx.strokeStyle = outfit.trim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.quadraticCurveTo(0, -8, 12, -10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -27);
  ctx.lineTo(0, -18);
  ctx.stroke();

  // Arms
  const armSwing = isWalking ? Math.sin(walkPhase * 2) * 3 : 0;
  ctx.fillStyle = outfit.main;
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.6;
  // Left arm
  ctx.beginPath();
  ctx.roundRect(-15, -27 + armSwing * 0.4, 5, 13, 3);
  ctx.fill();
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.roundRect(10, -27 - armSwing * 0.4, 5, 13, 3);
  ctx.fill();
  ctx.stroke();

  // Hands
  ctx.fillStyle = appearance.skinColor;
  ctx.beginPath();
  ctx.arc(-12.5, -13 + armSwing * 0.4, 2.8, 0, Math.PI * 2);
  ctx.arc(12.5, -13 - armSwing * 0.4, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Accessories on torso
  if (appearance.accessory === 'scarf') {
    ctx.beginPath();
    ctx.moveTo(-10, -27);
    ctx.quadraticCurveTo(0, -21, 10, -27);
    ctx.lineTo(12, -12);
    ctx.lineTo(7, -12);
    ctx.lineTo(5, -22);
    ctx.lineTo(-9, -24);
    ctx.closePath();
    ctx.fillStyle = '#E09F3E';
    ctx.fill();
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  } else if (appearance.accessory === 'pendant') {
    ctx.beginPath();
    ctx.arc(0, -21, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#F5B82E';
    ctx.fill();
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else if (appearance.accessory === 'satchel') {
    ctx.strokeStyle = '#5B3921';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-8, -28);
    ctx.lineTo(9, -13);
    ctx.stroke();
    ctx.fillStyle = '#8B5A2B';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(6, -16, 8, 8, 2);
    ctx.fill();
    ctx.stroke();
  }

  // Back hair (behind head for long/bob/braid)
  if (appearance.hairStyle === 'long' || appearance.hairStyle === 'braid') {
    ctx.fillStyle = appearance.hairColor;
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.6;
    if (appearance.hairStyle === 'long') {
      ctx.beginPath();
      ctx.roundRect(-14, -46, 28, 24, 10);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(-5, -34, 10, 18, 5);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Head
  ctx.beginPath();
  ctx.arc(0, -40, 14, 0, Math.PI * 2);
  ctx.fillStyle = appearance.skinColor;
  ctx.fill();
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Face details (unless facing up)
  if (facing !== 'up') {
    const eyeOffsetX = facing === 'left' ? -3 : facing === 'right' ? 3 : 0;

    // Rosy cheeks
    ctx.fillStyle = 'rgba(220, 100, 95, 0.28)';
    ctx.beginPath();
    ctx.ellipse(-6.5 + eyeOffsetX, -37, 3, 1.8, 0, 0, Math.PI * 2);
    ctx.ellipse(6.5 + eyeOffsetX, -37, 3, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (isSleeping) {
      ctx.strokeStyle = '#2C2119';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-4.5 + eyeOffsetX, -40, 2.2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4.5 + eyeOffsetX, -40, 2.2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#241A14';
      ctx.beginPath();
      ctx.arc(-4.5 + eyeOffsetX, -40, 2, 0, Math.PI * 2);
      ctx.arc(4.5 + eyeOffsetX, -40, 2, 0, Math.PI * 2);
      ctx.fill();
      // Eye sparkle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5 + eyeOffsetX, -40.8, 0.7, 0, Math.PI * 2);
      ctx.arc(4 + eyeOffsetX, -40.8, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Smile
    ctx.strokeStyle = '#5D3628';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -36.5, 2.8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Glasses accessory
    if (appearance.accessory === 'glasses') {
      ctx.strokeStyle = '#3B2F27';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(-4.5 + eyeOffsetX, -40, 3.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4.5 + eyeOffsetX, -40, 3.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.7 + eyeOffsetX, -40);
      ctx.lineTo(0.7 + eyeOffsetX, -40);
      ctx.stroke();
    }
  }

  // Hair styles on top
  ctx.fillStyle = appearance.hairColor;
  ctx.strokeStyle = '#2C2119';
  ctx.lineWidth = 1.5;
  if (appearance.hairStyle === 'short' || appearance.hairStyle === 'long' || appearance.hairStyle === 'braid') {
    ctx.beginPath();
    ctx.arc(0, -43, 14.2, Math.PI * 0.98, Math.PI * 2.02);
    ctx.quadraticCurveTo(5, -45, 0, -48);
    ctx.quadraticCurveTo(-5, -45, -14.2, -43);
    ctx.fill();
    ctx.stroke();
  } else if (appearance.hairStyle === 'bob') {
    ctx.beginPath();
    ctx.arc(0, -42, 15, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(14, -33);
    ctx.quadraticCurveTo(10, -43, 0, -46);
    ctx.quadraticCurveTo(-10, -43, -14, -33);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (appearance.hairStyle === 'bun') {
    ctx.beginPath();
    ctx.arc(0, -56, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -43, 14.2, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (appearance.hairStyle === 'curly') {
    const puffs = [-11, -5, 1, 7, 12];
    for (const px of puffs) {
      ctx.beginPath();
      ctx.arc(px, -50 + Math.abs(px) * 0.25, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Hats & Turbans
  if (appearance.hatStyle === 'cap') {
    ctx.fillStyle = '#C94C4C';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-12, -55, 24, 10, [8, 8, 2, 2]);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#E6B349';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-11, -47);
    ctx.lineTo(11, -47);
    ctx.stroke();
  } else if (appearance.hatStyle === 'turban') {
    ctx.fillStyle = '#E59A38';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.ellipse(0, -52, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Wrap fold
    ctx.beginPath();
    ctx.moveTo(-12, -54);
    ctx.quadraticCurveTo(0, -47, 13, -53);
    ctx.stroke();
  } else if (appearance.hatStyle === 'royal_turban') {
    ctx.fillStyle = '#9E2A3B';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.ellipse(0, -53, 17, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Gold band & jewel crest
    ctx.strokeStyle = '#F5C451';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -54);
    ctx.quadraticCurveTo(0, -48, 14, -54);
    ctx.stroke();
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(0, -58, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Kalgi plume
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.ellipse(3, -64, 2.5, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (appearance.hatStyle === 'floral') {
    ctx.fillStyle = '#EC4899';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.2;
    for (const fx of [-8, 0, 8]) {
      ctx.beginPath();
      ctx.arc(fx, -52, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(fx, -52, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EC4899';
    }
  }

  // Feather accessory
  if (appearance.accessory === 'feather') {
    ctx.save();
    ctx.translate(11, -55);
    ctx.rotate(0.4);
    ctx.fillStyle = '#14B8A6';
    ctx.strokeStyle = '#2C2119';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, -6, 3, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Floating badge or quest marker above head
  if (badgeEmoji && !isSleeping) {
    const floatY = -72 + Math.sin(walkPhase * 1.5) * 2.5;
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-13, floatY - 11, 26, 20, 8);
    ctx.fill();
    ctx.stroke();
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2A2118';
    ctx.fillText(badgeEmoji, 0, floatY - 0.5);
  }

  // Name label underneath
  if (label && !isSleeping) {
    ctx.font = '600 11px "Gowun Dodum", sans-serif';
    const textW = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(255, 250, 240, 0.9)';
    ctx.strokeStyle = 'rgba(130, 95, 55, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-textW / 2 - 7, 10, textW + 14, 18, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2A2118';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 19.5);
  }

  ctx.restore();
}
