// Panel layouts for the cover: where each photo panel sits inside the
// poster, and which panel a point on the canvas belongs to.
//
// The poster is split into three bands: a sky strip at the top (the sun
// and palms live there), the panel area in the middle, and a caption band
// at the foot. Every layout fills the same panel area with 3 or 4 panels
// separated by white gutters.

export const LAYOUTS = {
  hero: { label: 'Hero', panels: 3 },
  trio: { label: 'Trio', panels: 3 },
  four: { label: 'Four', panels: 4 },
};

/** The three bands of a cover of size w x h. */
export function coverBands(w, h) {
  return {
    sky: { x: 0, y: 0, w, h: Math.round(h * 0.115) },
    area: {
      x: Math.round(w * 0.035),
      y: Math.round(h * 0.115),
      w: w - 2 * Math.round(w * 0.035),
      h: Math.round(h * 0.80) - Math.round(h * 0.115),
    },
    caption: { x: 0, y: Math.round(h * 0.80), w, h: h - Math.round(h * 0.80) },
  };
}

/** The panel rectangles for `layout` on a cover of size w x h. */
export function panelRects(layout, w, h) {
  const { area } = coverBands(w, h);
  const g = Math.max(6, Math.round(w * 0.008));
  const halfW = (area.w - g) / 2;
  const halfH = (area.h - g) / 2;
  if (layout === 'trio') {
    const leftW = Math.round(area.w * 0.58) - Math.round(g / 2);
    const rightX = area.x + leftW + g;
    const rightW = area.x + area.w - rightX;
    return [
      { x: area.x, y: area.y, w: leftW, h: area.h },
      { x: rightX, y: area.y, w: rightW, h: halfH },
      { x: rightX, y: area.y + halfH + g, w: rightW, h: halfH },
    ];
  }
  if (layout === 'four') {
    return [
      { x: area.x, y: area.y, w: halfW, h: halfH },
      { x: area.x + halfW + g, y: area.y, w: halfW, h: halfH },
      { x: area.x, y: area.y + halfH + g, w: halfW, h: halfH },
      { x: area.x + halfW + g, y: area.y + halfH + g, w: halfW, h: halfH },
    ];
  }
  // hero: one big panel on top, two small ones below.
  const bigH = Math.round(area.h * 0.60) - Math.round(g / 2);
  return [
    { x: area.x, y: area.y, w: area.w, h: bigH },
    { x: area.x, y: area.y + bigH + g, w: halfW, h: area.h - bigH - g },
    { x: area.x + halfW + g, y: area.y + bigH + g, w: halfW, h: area.h - bigH - g },
  ];
}

/** Index of the panel containing point (x, y), or -1 when it is none. */
export function panelAt(layout, w, h, x, y) {
  return panelRects(layout, w, h).findIndex(
    (r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h,
  );
}

/** A fresh panel state: no photo yet, centred, at natural zoom. */
export function blankPanel() {
  return { img: null, name: '', ox: 0, oy: 0, zoom: 1 };
}

/** Panels for a layout, each filled with `img` (or left empty). */
export function panelsFor(layout, img, name) {
  const count = LAYOUTS[layout].panels;
  return Array.from({ length: count }, () => {
    const p = blankPanel();
    p.img = img ?? null;
    p.name = name ?? '';
    return p;
  });
}
