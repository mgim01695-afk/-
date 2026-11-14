/**
 * Detailed 2.5D realistic Mughal furniture sprite renderer.
 * Used both on the HouseCanvas room and in FurniturePreview thumbnails.
 */

export function drawRealisticMughalFurniture(
  ctx: CanvasRenderingContext2D,
  id: string,
  w: number,
  h: number,
  color: string,
  accent: string,
  lightsOn = true,
  isPreview = false
) {
  ctx.save();

  // Realistic soft ambient ground shadow (skip strong offset for flat floor carpets)
  if (!isPreview) {
    if (id === 'carpet') {
      ctx.fillStyle = 'rgba(38, 24, 12, 0.14)';
      ctx.fillRect(-w / 2 + 2, -h / 2 + 3, w, h);
    } else {
      ctx.fillStyle = 'rgba(34, 22, 12, 0.24)';
      ctx.beginPath();
      ctx.ellipse(3, 5, w * 0.48, h * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  switch (id) {
    case 'carpet': {
      // Woven tassels / fringe on left and right edges
      ctx.strokeStyle = '#EFE3C8';
      ctx.lineWidth = 1.4;
      for (let fy = -h / 2 + 4; fy <= h / 2 - 4; fy += 5) {
        ctx.beginPath();
        ctx.moveTo(-w / 2 - 5, fy);
        ctx.lineTo(-w / 2, fy);
        ctx.moveTo(w / 2, fy);
        ctx.lineTo(w / 2 + 5, fy);
        ctx.stroke();
      }

      // Rich deep crimson / sapphire wool base gradient
      const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      grad.addColorStop(0, '#8E2424');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, '#6E1B1B');
      ctx.fillStyle = grad;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Outer & inner ornate borders
      ctx.strokeStyle = '#2B1810';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);

      ctx.strokeStyle = '#1E4D5C';
      ctx.lineWidth = 4;
      ctx.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24);

      ctx.strokeStyle = '#F3D27A';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32);

      // Corner spandrels
      ctx.fillStyle = '#1E4D5C';
      const cSize = 11;
      for (const [cx, cy] of [
        [-w / 2 + 16, -h / 2 + 16],
        [w / 2 - 16 - cSize, -h / 2 + 16],
        [-w / 2 + 16, h / 2 - 16 - cSize],
        [w / 2 - 16 - cSize, h / 2 - 16 - cSize]
      ]) {
        ctx.fillRect(cx, cy, cSize, cSize);
      }

      // Central Mughal lotus medallion (shamsa)
      ctx.fillStyle = '#183F4B';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.24);
      ctx.quadraticCurveTo(w * 0.14, -h * 0.1, w * 0.22, 0);
      ctx.quadraticCurveTo(w * 0.14, h * 0.1, 0, h * 0.24);
      ctx.quadraticCurveTo(-w * 0.14, h * 0.1, -w * 0.22, 0);
      ctx.quadraticCurveTo(-w * 0.14, -h * 0.1, 0, -h * 0.24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner floral rosette
      ctx.fillStyle = accent;
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.ellipse(Math.cos(ang) * 7, Math.sin(ang) * 5, 3, 1.5, ang, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFF3D1';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bed': {
      // 2.5D Carved Rosewood Charpai / Masnad Bed with 4 turned posts
      const woodGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      woodGrad.addColorStop(0, '#6E3F24');
      woodGrad.addColorStop(0.5, '#542E19');
      woodGrad.addColorStop(1, '#3D2010');

      // Bed frame sides (3D thickness)
      ctx.fillStyle = '#3B1E0F';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2 + 4, w, h, 5);
      ctx.fill();

      ctx.fillStyle = woodGrad;
      ctx.strokeStyle = '#24140B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h - 3, 5);
      ctx.fill();
      ctx.stroke();

      // Mattress
      ctx.fillStyle = '#F7EFE0';
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 6, -h / 2 + 5, w - 12, h - 13, 3);
      ctx.fill();
      ctx.strokeStyle = '#B8A58B';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Embroidered Mughal silk blanket with gold paisley trim
      const silkGrad = ctx.createLinearGradient(-w / 2 + 24, -h / 2, w / 2, h / 2);
      silkGrad.addColorStop(0, '#B3353F');
      silkGrad.addColorStop(0.5, accent);
      silkGrad.addColorStop(1, '#7A1F28');
      ctx.fillStyle = silkGrad;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 24, -h / 2 + 5, w - 30, h - 13, 2);
      ctx.fill();

      // Gold zari border along blanket fold
      ctx.strokeStyle = '#F4C95D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 27, -h / 2 + 6);
      ctx.lineTo(-w / 2 + 27, h / 2 - 9);
      ctx.stroke();

      // Floral diamond embroidery on quilt
      ctx.fillStyle = 'rgba(244, 201, 93, 0.5)';
      for (const qx of [-w / 2 + 44, -w / 2 + 64]) {
        if (qx < w / 2 - 14) {
          ctx.beginPath();
          ctx.moveTo(qx, -5);
          ctx.lineTo(qx + 5, 0);
          ctx.lineTo(qx, 5);
          ctx.lineTo(qx - 5, 0);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Bolster & head pillow
      ctx.fillStyle = '#FFFDF7';
      ctx.strokeStyle = '#C9B390';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 8, -h / 2 + 10, 14, h - 24, 5);
      ctx.fill();
      ctx.stroke();

      // 4 carved brass-capped bedposts
      for (const [px, py] of [
        [-w / 2 + 2, -h / 2 + 1],
        [w / 2 - 2, -h / 2 + 1],
        [-w / 2 + 2, h / 2 - 5],
        [w / 2 - 2, h / 2 - 5]
      ]) {
        ctx.fillStyle = '#4A2814';
        ctx.strokeStyle = '#1E1109';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#E5B24C';
        ctx.beginPath();
        ctx.arc(px, py - 1, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'low_table': {
      // Pietra Dura Marble & Rosewood Mughal Low Chowki Table
      // Legs peeking underneath
      ctx.fillStyle = '#422514';
      ctx.fillRect(-w / 2 + 6, h / 2 - 10, 8, 9);
      ctx.fillRect(w / 2 - 14, h / 2 - 10, 8, 9);

      // Table apron shadow
      ctx.fillStyle = '#4F2D19';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2 + 6, w, h - 8, 6);
      ctx.fill();

      // Dark wood frame
      ctx.fillStyle = '#6B3E23';
      ctx.strokeStyle = '#24140B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h - 10, 6);
      ctx.fill();
      ctx.stroke();

      // White Makrana marble inlay top
      ctx.fillStyle = '#F7F3EA';
      ctx.strokeStyle = '#D5C7AE';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 5, -h / 2 + 4, w - 10, h - 18, 4);
      ctx.fill();
      ctx.stroke();

      // Pietra Dura floral inlay (lapis blue, carnelian red, malachite green)
      ctx.strokeStyle = '#2A6B53';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, -5, w * 0.24, h * 0.16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#B91C1C';
      ctx.beginPath();
      ctx.arc(0, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.arc(-8, -5, 2, 0, Math.PI * 2);
      ctx.arc(8, -5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Brass teapot & cup sitting on table
      ctx.fillStyle = '#D99B26';
      ctx.strokeStyle = '#5C3A0B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(10, -7, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'wood_chair': {
      // Shisham wood Mughal arched throne chair
      // Seat depth
      ctx.fillStyle = '#53301A';
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 4, -2, w - 8, h / 2, 4);
      ctx.fill();

      // Seat frame & velvet cushion
      ctx.fillStyle = '#7C4B2B';
      ctx.strokeStyle = '#28160C';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 4, -6, w - 8, h / 2 - 2, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#9E2A3B';
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 8, -3, w - 16, h / 2 - 8, 3);
      ctx.fill();

      // Ornate cusped Mughal arch backrest
      ctx.fillStyle = '#6E4023';
      ctx.strokeStyle = '#28160C';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 5, -5);
      ctx.lineTo(-w / 2 + 5, -h / 2 + 8);
      ctx.quadraticCurveTo(0, -h / 2 - 2, w / 2 - 5, -h / 2 + 8);
      ctx.lineTo(w / 2 - 5, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold carved inner arch inlay
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 10, -7);
      ctx.lineTo(-w / 2 + 10, -h / 2 + 11);
      ctx.quadraticCurveTo(0, -h / 2 + 3, w / 2 - 10, -h / 2 + 11);
      ctx.lineTo(w / 2 - 10, -7);
      ctx.stroke();
      break;
    }

    case 'lantern': {
      // Mughal Brass Fanous Stained-Glass Lantern
      if (lightsOn) {
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
        glow.addColorStop(0, 'rgba(255, 224, 120, 0.72)');
        glow.addColorStop(0.6, 'rgba(245, 158, 11, 0.22)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base pedestal
      ctx.fillStyle = '#8A5D1B';
      ctx.strokeStyle = '#2E1E09';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(0, 10, 10, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Hexagonal brass & stained glass body
      ctx.fillStyle = lightsOn ? '#FFE27A' : '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(-7, 8);
      ctx.lineTo(-9, -4);
      ctx.lineTo(0, -13);
      ctx.lineTo(9, -4);
      ctx.lineTo(7, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Colored jali glass panes (ruby & emerald hints)
      ctx.fillStyle = lightsOn ? 'rgba(220, 38, 38, 0.38)' : '#64748B';
      ctx.fillRect(-6, -3, 4, 8);
      ctx.fillStyle = lightsOn ? 'rgba(16, 185, 129, 0.38)' : '#64748B';
      ctx.fillRect(2, -3, 4, 8);

      // Onion dome cap
      ctx.fillStyle = '#C98F28';
      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.quadraticCurveTo(0, -18, 9, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Top ring
      ctx.beginPath();
      ctx.arc(0, -14, 2.2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'cushion': {
      // Kashmir Silk Gaotakiya (bolster + embroidered floor cushion)
      ctx.fillStyle = '#1E524E';
      ctx.strokeStyle = '#182A28';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 2, -h / 2 + 6, w - 4, h - 10, 8);
      ctx.fill();
      ctx.stroke();

      // Gold piping & corner tassels
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-w / 2 + 6, -h / 2 + 10, w - 12, h - 18);

      // Cylindrical bolster pillow across top
      const bolGrad = ctx.createLinearGradient(0, -h / 2 + 2, 0, -h / 2 + 14);
      bolGrad.addColorStop(0, '#D9534F');
      bolGrad.addColorStop(1, '#8F2623');
      ctx.fillStyle = bolGrad;
      ctx.strokeStyle = '#3B1110';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 4, -h / 2 + 1, w - 8, 12, 6);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'pottery_jar': {
      // Delhi Blue-and-White Long-Necked Surahi Pitcher
      // Bulbous body
      const jarGrad = ctx.createRadialGradient(-4, 0, 2, 0, 2, 16);
      jarGrad.addColorStop(0, '#F5F7FA');
      jarGrad.addColorStop(0.55, '#3E82A8');
      jarGrad.addColorStop(1, '#1A435E');
      ctx.fillStyle = jarGrad;
      ctx.strokeStyle = '#142938';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cobalt floral band
      ctx.strokeStyle = '#EBF5FF';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 4, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Slender Mughal surahi neck
      ctx.fillStyle = '#2B688C';
      ctx.beginPath();
      ctx.roundRect(-3.5, -15, 7, 13, 2);
      ctx.fill();
      ctx.stroke();
      // Flared lip
      ctx.fillStyle = '#E5B24C';
      ctx.beginPath();
      ctx.ellipse(0, -15, 5.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'plant_pot': {
      // Charbagh Terracotta Planter with Damask Roses & Jasmine
      ctx.fillStyle = '#B85D3B';
      ctx.strokeStyle = '#4A2112';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-11, -2);
      ctx.lineTo(11, -2);
      ctx.lineTo(8, 14);
      ctx.lineTo(-8, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pot rim with carved border
      ctx.fillStyle = '#C96D49';
      ctx.beginPath();
      ctx.roundRect(-13, -6, 26, 6, 2);
      ctx.fill();
      ctx.stroke();

      // Lush foliage
      ctx.fillStyle = '#2F7A46';
      for (const [lx, ly, r] of [
        [-8, -11, 7],
        [8, -11, 7],
        [0, -15, 8],
        [-3, -7, 6],
        [4, -7, 6]
      ]) {
        ctx.beginPath();
        ctx.arc(lx, ly, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#183D23';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Damask roses & white jasmine blooms
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(-5, -13, 3, 0, Math.PI * 2);
      ctx.arc(5, -11, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.arc(0, -17, 2.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'chest': {
      // Gujarat Mother-of-Pearl & Brass-Bound Treasure Chest
      ctx.fillStyle = '#4A2A15';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2 + 5, w, h - 5, 4);
      ctx.fill();

      const chestGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      chestGrad.addColorStop(0, '#784626');
      chestGrad.addColorStop(1, '#4E2B14');
      ctx.fillStyle = chestGrad;
      ctx.strokeStyle = '#231309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h - 6, 4);
      ctx.fill();
      ctx.stroke();

      // Mother-of-pearl geometric stars
      ctx.fillStyle = '#EAE6DF';
      for (const sx of [-15, 0, 15]) {
        ctx.beginPath();
        ctx.arc(sx, -2, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brass straps & clasp
      ctx.fillStyle = '#E2AF48';
      ctx.fillRect(-w / 2 + 6, -h / 2, 5, h - 6);
      ctx.fillRect(w / 2 - 11, -h / 2, 5, h - 6);
      ctx.fillStyle = '#F5C95B';
      ctx.strokeStyle = '#5C3B0B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-5, -4, 10, 9, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'bookshelf': {
      // Kitabkhana Imperial Library Shelf with Persian & Urdu Manuscripts
      ctx.fillStyle = '#4A2B18';
      ctx.strokeStyle = '#211209';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fill();
      ctx.stroke();

      // Two recessed arched shelf bays
      ctx.fillStyle = '#2C180D';
      ctx.fillRect(-w / 2 + 5, -h / 2 + 5, w - 10, h / 2 - 7);
      ctx.fillRect(-w / 2 + 5, 2, w - 10, h / 2 - 7);

      // Colored leather-bound manuscripts & rolled scrolls
      const bookColors = ['#A8384B', '#257068', '#D49A35', '#2F4D7D', '#EAE0CD', '#8C3F2D'];
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = bookColors[i % bookColors.length];
        ctx.fillRect(-w / 2 + 8 + i * 8.5, -h / 2 + 7, 6.5, h / 2 - 10);
      }
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = bookColors[(i + 2) % bookColors.length];
        ctx.fillRect(-w / 2 + 9 + i * 9, 4, 7, h / 2 - 10);
      }
      // Rolled manuscript scroll
      ctx.fillStyle = '#F7EBD3';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 20, 6, 13, 6, 2);
      ctx.fill();
      break;
    }

    case 'wall_decor': {
      // Agra Red Sandstone Jali Lattice & Calico Tapestry
      ctx.fillStyle = '#A94438';
      ctx.strokeStyle = '#4A1B15';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fill();
      ctx.stroke();

      // Inner cream sandstone jali panel
      ctx.fillStyle = '#F3E7D3';
      ctx.fillRect(-w / 2 + 6, -h / 2 + 5, w - 12, h - 10);

      // Octagonal Islamic geometric star lattice
      ctx.strokeStyle = '#9E4032';
      ctx.lineWidth = 1.2;
      for (let x = -w / 2 + 14; x <= w / 2 - 14; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, -h / 2 + 7);
        ctx.lineTo(x + 6, 0);
        ctx.lineTo(x, h / 2 - 7);
        ctx.lineTo(x - 6, 0);
        ctx.closePath();
        ctx.stroke();
      }
      break;
    }

    case 'painting': {
      // Mughal Court Miniature Painting in Gold-Inlaid Frame
      ctx.fillStyle = '#C9963B';
      ctx.strokeStyle = '#4A320C';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 3);
      ctx.fill();
      ctx.stroke();

      // Cream manuscript border
      ctx.fillStyle = '#FBF5E6';
      ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8);

      // Miniature scene: sky, cypress trees, palace dome, golden sun
      ctx.fillStyle = '#2B5B84';
      ctx.fillRect(-w / 2 + 7, -h / 2 + 6, w - 14, (h - 12) * 0.55);
      ctx.fillStyle = '#6C9A5A';
      ctx.fillRect(-w / 2 + 7, -h / 2 + 6 + (h - 12) * 0.55, w - 14, (h - 12) * 0.45);
      // White dome silhouette
      ctx.fillStyle = '#FFFDF7';
      ctx.beginPath();
      ctx.arc(0, 1, 7, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-8, 1, 16, 6);
      // Sun
      ctx.fillStyle = '#F5C451';
      ctx.beginPath();
      ctx.arc(12, -7, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'banner':
    case 'akbar_banner':
    case 'aurangzeb_banner': {
      // Ornate Mughal Standard Banner with Brass Pole, Crescent/Sun Emblem & Tassels
      // Stand base
      ctx.fillStyle = '#6E4C1E';
      ctx.strokeStyle = '#2A1B08';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-6, h / 2 - 4, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Brass pole
      ctx.fillStyle = '#D4A037';
      ctx.fillRect(-8, -h / 2 + 3, 4, h - 7);
      ctx.strokeRect(-8, -h / 2 + 3, 4, h - 7);

      // Finial spearhead
      ctx.fillStyle = '#F5C451';
      ctx.beginPath();
      ctx.moveTo(-6, -h / 2 - 2);
      ctx.lineTo(-2, -h / 2 + 4);
      ctx.lineTo(-10, -h / 2 + 4);
      ctx.closePath();
      ctx.fill();

      // Pennant cloth
      const bannerColor =
        id === 'akbar_banner' ? '#D97706' : id === 'aurangzeb_banner' ? '#1B4D43' : color;
      ctx.fillStyle = bannerColor;
      ctx.strokeStyle = '#2A1B08';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, -h / 2 + 5);
      ctx.lineTo(w / 2 - 2, -h / 2 + 12);
      ctx.lineTo(w / 2 - 9, -2);
      ctx.lineTo(w / 2 - 2, 10);
      ctx.lineTo(-4, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Emblem (Sun / Lotus / Crescent-Sword)
      ctx.fillStyle = accent;
      if (id === 'akbar_banner') {
        // Radiant Sun (Shamsa) symbolizing Akbar's enlightenment
        ctx.beginPath();
        ctx.arc(6, -3, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(6 + Math.cos(a) * 7, -3 + Math.sin(a) * 7);
          ctx.lineTo(6 + Math.cos(a) * 10, -3 + Math.sin(a) * 10);
          ctx.stroke();
        }
      } else if (id === 'aurangzeb_banner') {
        // Crescent & crossed sabers emblem
        ctx.beginPath();
        ctx.arc(7, -3, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bannerColor;
        ctx.beginPath();
        ctx.arc(9.5, -4, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(6, -3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'court_ornament': {
      // Shah Jahan Marble Lotus Pool / Court Ornament
      // Octagonal marble pedestal
      ctx.fillStyle = '#EFE9DD';
      ctx.strokeStyle = '#7D6E58';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 2, -h / 2 + 4, w - 4, h - 8, 12);
      ctx.fill();
      ctx.stroke();

      // Pietra dura gold border
      ctx.strokeStyle = '#C9963B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 8, -h / 2 + 9, w - 16, h - 18, 9);
      ctx.stroke();

      // Carved white marble lotus petals in center
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#A89882';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -10, 4.5, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'jali_screen': {
      // Carved White Marble Jali Arched Partition Screen
      ctx.fillStyle = '#F3ECE0';
      ctx.strokeStyle = '#6E5F4E';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, [14, 14, 3, 3]);
      ctx.fill();
      ctx.stroke();

      // 3 arched lattice panels
      const panelW = (w - 18) / 3;
      for (let i = 0; i < 3; i++) {
        const px = -w / 2 + 6 + i * (panelW + 3);
        ctx.fillStyle = '#B8A894';
        ctx.beginPath();
        ctx.roundRect(px, -h / 2 + 8, panelW, h - 14, [8, 8, 2, 2]);
        ctx.fill();

        // Tiny lattice holes
        ctx.fillStyle = '#F7F1E5';
        for (let ly = -h / 2 + 13; ly < h / 2 - 9; ly += 6) {
          ctx.fillRect(px + 3, ly, panelW - 6, 3);
        }
      }
      break;
    }

    case 'hookah_tea_set': {
      // Bidri Silver-Inlaid Tea Tray & Samovar Set
      // Brass octagonal tray
      ctx.fillStyle = '#C9963B';
      ctx.strokeStyle = '#52380B';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 2, w * 0.45, h * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark Bidriware (blackened zinc-silver alloy) samovar pitcher
      ctx.fillStyle = '#24292E';
      ctx.strokeStyle = '#111827';
      ctx.beginPath();
      ctx.arc(-5, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Silver inlay dots
      ctx.fillStyle = '#E5E7EB';
      ctx.beginPath();
      ctx.arc(-5, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 2 tiny porcelain tea cups
      ctx.fillStyle = '#F9FAFB';
      ctx.beginPath();
      ctx.arc(9, -3, 3.5, 0, Math.PI * 2);
      ctx.arc(8, 6, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'fountain_basin': {
      // Charbagh Octagonal Indoor Marble Water Fountain
      ctx.fillStyle = '#EAE2D3';
      ctx.strokeStyle = '#6B5B4B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 14);
      ctx.fill();
      ctx.stroke();

      // Turquoise water basin
      const waterGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, w * 0.36);
      waterGrad.addColorStop(0, '#99E2EE');
      waterGrad.addColorStop(1, '#2B879E');
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 10);
      ctx.fill();

      // Central lotus fountain nozzle & water ripples
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FFFDF8';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'taj_model': {
      // Detailed White Marble Taj Mahal Miniature Craft
      // Marble plinth platform
      ctx.fillStyle = '#E5DDD0';
      ctx.strokeStyle = '#6E6152';
      ctx.lineWidth = 1.4;
      ctx.fillRect(-w / 2 + 3, -h / 2 + 12, w - 6, h - 15);
      ctx.strokeRect(-w / 2 + 3, -h / 2 + 12, w - 6, h - 15);

      // Four corner minarets
      ctx.fillStyle = '#FAF7F2';
      for (const [mx, my] of [
        [-w / 2 + 8, -h / 2 + 10],
        [w / 2 - 8, -h / 2 + 10],
        [-w / 2 + 8, h / 2 - 8],
        [w / 2 - 8, h / 2 - 8]
      ]) {
        ctx.beginPath();
        ctx.arc(mx, my, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Central sanctuary body
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(-16, -6, 32, 20);
      ctx.strokeRect(-16, -6, 32, 20);

      // Pointed pishtaq arch
      ctx.fillStyle = '#524942';
      ctx.beginPath();
      ctx.moveTo(-6, 14);
      ctx.lineTo(-6, 2);
      ctx.quadraticCurveTo(0, -4, 6, 2);
      ctx.lineTo(6, 14);
      ctx.closePath();
      ctx.fill();

      // Iconic white onion dome + gold kalash finial
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, -8, 11, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#D4A037';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -19);
      ctx.lineTo(0, -25);
      ctx.stroke();
      break;
    }

    default: {
      ctx.fillStyle = color;
      ctx.strokeStyle = '#2C2119';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 3);
      ctx.fill();
    }
  }

  ctx.restore();
}
