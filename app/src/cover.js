// Draws the cover: a Vice City sunset sky with a slatted sun and palm
// silhouettes, the photo panels with a warm sunset grade, and the caption
// in bold condensed lettering across the foot. Everything is drawn with
// canvas shapes and gradients — no borrowed artwork, no game assets.

import { coverBands, panelRects } from './panels.js';

/** Draws the whole cover onto `canvas` from `state`. */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { w, h } = state;
  canvas.width = w;
  canvas.height = h;
  drawSky(ctx, w, h);
  drawSun(ctx, w, h);
  drawPalms(ctx, w, h);
  const rects = panelRects(state.layout, w, h);
  rects.forEach((rect, i) => drawPanel(ctx, rect, state.panels[i], w, h));
  drawCaptionBand(ctx, state, w, h);
}

/** The sunset sky: indigo at the top melting through magenta to gold. */
export function drawSky(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1b0f3b');
  sky.addColorStop(0.28, '#6b2d8f');
  sky.addColorStop(0.52, '#d63384');
  sky.addColorStop(0.74, '#ff7a3d');
  sky.addColorStop(1, '#ffc46b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
}

/** The retro sun: a gold-to-magenta disc with sky-coloured slats cut
 *  across its lower half. The slats are filled with the same sky
 *  gradient, so they read as gaps in the disc. */
export function drawSun(ctx, w, h) {
  const bands = coverBands(w, h);
  const cx = w * 0.5;
  const cy = bands.sky.h * 0.62;
  const r = Math.min(w, h) * 0.085;
  const disc = ctx.createLinearGradient(0, cy - r, 0, cy + r);
  disc.addColorStop(0, '#ffe66d');
  disc.addColorStop(0.55, '#ff9e4d');
  disc.addColorStop(1, '#ff4d8d');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = disc;
  ctx.fill();
  ctx.clip();
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1b0f3b');
  sky.addColorStop(0.28, '#6b2d8f');
  sky.addColorStop(0.52, '#d63384');
  sky.addColorStop(0.74, '#ff7a3d');
  sky.addColorStop(1, '#ffc46b');
  ctx.fillStyle = sky;
  let y = cy + r * 0.05;
  let thick = r * 0.05;
  while (y < cy + r) {
    ctx.fillRect(cx - r, y, r * 2, thick);
    y += thick + r * 0.16;
    thick *= 1.5;
  }
  ctx.restore();
}

/** One palm silhouette: a leaning trunk and six drooping fronds. */
export function drawPalm(ctx, x, y, size, lean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.strokeStyle = '#160a2b';
  ctx.fillStyle = '#160a2b';
  ctx.lineCap = 'round';
  ctx.lineWidth = size * 0.055;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.08, -size * 0.55, size * 0.28, -size * 0.95);
  ctx.stroke();
  const topX = size * 0.28;
  const topY = -size * 0.95;
  ctx.lineWidth = size * 0.035;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.08 + (i / 5) * 0.84);
    const ex = topX + Math.cos(a) * size * 0.55;
    const ey = topY + Math.sin(a) * size * 0.42 - size * 0.12;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(a) * size * 0.3,
      topY + Math.sin(a) * size * 0.3 - size * 0.22,
      ex,
      ey,
    );
    ctx.stroke();
  }
  ctx.restore();
}

/** Palms framing the sky strip, left and right, small enough to read
 *  whole inside the strip. */
export function drawPalms(ctx, w, h) {
  const bands = coverBands(w, h);
  const size = bands.sky.h * 0.95;
  drawPalm(ctx, w * 0.02, bands.sky.h * 1.04, size, 0.12);
  drawPalm(ctx, w * 0.98, bands.sky.h * 1.04, size, -0.12);
}

/** One photo panel: the photo cover-fit inside the rectangle (dragged by
 *  ox/oy and scaled by zoom), a warm sunset grade, a soft vignette, and
 *  a white poster border. */
export function drawPanel(ctx, rect, panel, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.fillStyle = '#241335';
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  if (panel && panel.img) {
    const img = panel.img;
    const base = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight);
    const scale = base * (panel.zoom || 1);
    const pw = img.naturalWidth * scale;
    const ph = img.naturalHeight * scale;
    // Default crop: centred sideways, anchored near the top of the photo
    // (faces sit high), so a wide panel keeps heads in frame.
    const dx = rect.x + (rect.w - pw) * 0.5 + (panel.ox || 0);
    const dy = rect.y + (rect.h - ph) * 0.08 + (panel.oy || 0);
    ctx.drawImage(img, dx, dy, pw, ph);
    // Warm sunset grade over the photo.
    ctx.globalCompositeOperation = 'soft-light';
    const grade = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
    grade.addColorStop(0, 'rgba(255, 140, 60, 0.9)');
    grade.addColorStop(1, 'rgba(230, 40, 140, 0.9)');
    ctx.fillStyle = grade;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalCompositeOperation = 'source-over';
    // Soft vignette so the panel reads as one poster tile.
    const vig = ctx.createRadialGradient(
      rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) * 0.35,
      rect.x + rect.w / 2, rect.y + rect.h / 2, Math.max(rect.w, rect.h) * 0.75,
    );
    vig.addColorStop(0, 'rgba(20, 5, 40, 0)');
    vig.addColorStop(1, 'rgba(20, 5, 40, 0.28)');
    ctx.fillStyle = vig;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  } else {
    // Empty panel: a faint sun-glyph so the slot reads as a photo space.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = Math.max(2, w * 0.004);
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const r = Math.min(rect.w, rect.h) * 0.16;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r, cy + r * 0.9);
    ctx.lineTo(cx + r, cy + r * 0.9);
    ctx.stroke();
  }
  ctx.restore();
  // White poster border with a soft drop shadow.
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = Math.max(6, w * 0.012);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(4, w * 0.006);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

/** The caption band: a dark legibility wash, the big caption in Anton
 *  with a black outline, a gradient underline bar, and the tagline. */
export function drawCaptionBand(ctx, state, w, h) {
  const bands = coverBands(w, h);
  const wash = ctx.createLinearGradient(0, bands.caption.y - h * 0.06, 0, h);
  wash.addColorStop(0, 'rgba(20, 4, 40, 0)');
  wash.addColorStop(1, 'rgba(20, 4, 40, 0.6)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, bands.caption.y - h * 0.06, w, h - bands.caption.y + h * 0.06);

  const text = (state.caption || '').trim().toUpperCase();
  if (text) {
    let size = h * 0.105;
    ctx.font = `${size}px Anton, 'Arial Narrow', sans-serif`;
    while (ctx.measureText(text).width > w * 0.92 && size > 12) {
      size -= 2;
      ctx.font = `${size}px Anton, 'Arial Narrow', sans-serif`;
    }
    const cx = w / 2;
    const cy = bands.caption.y + bands.caption.h * 0.44;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.026);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#14051f';
    ctx.lineWidth = Math.max(4, size * 0.16);
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 0, 0);
    ctx.restore();
    // Gradient underline bar under the caption.
    const tw = ctx.measureText(text).width;
    const bar = ctx.createLinearGradient(cx - tw * 0.45, 0, cx + tw * 0.45, 0);
    bar.addColorStop(0, '#ff4d8d');
    bar.addColorStop(0.5, '#ff9e4d');
    bar.addColorStop(1, '#ffe66d');
    ctx.fillStyle = bar;
    const bh = Math.max(4, h * 0.008);
    ctx.fillRect(cx - tw * 0.45, cy + size * 0.52, tw * 0.9, bh);
  }
  const tag = (state.tagline || '').trim().toUpperCase();
  if (tag) {
    ctx.save();
    ctx.font = `bold ${Math.max(12, h * 0.026)}px system-ui, sans-serif`;
    try { ctx.letterSpacing = `${Math.max(2, h * 0.006)}px`; } catch (e) { /* older canvas */ }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd166';
    ctx.fillText(tag, w / 2, bands.caption.y + bands.caption.h * 0.86);
    ctx.restore();
  }
}
