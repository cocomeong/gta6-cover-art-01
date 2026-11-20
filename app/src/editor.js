// The editor: layout and size pickers, per-panel photo inputs, sample
// photos, drag-to-crop on the preview, zoom for the selected panel, and
// the PNG export. Photos are read on the user's own machine and never
// uploaded anywhere.

import { drawCover } from './cover.js';
import { LAYOUTS, panelAt, panelsFor } from './panels.js';

export const SIZES = {
  square: { label: 'Square 1080 x 1080', w: 1080, h: 1080 },
  tall: { label: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  wide: { label: 'Landscape 1920 x 1080', w: 1920, h: 1080 },
};

export const SAMPLES = [
  { id: 'pier', label: 'Pier sunset' },
  { id: 'boulevard', label: 'Boulevard' },
];

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

/** Builds the editor around the page's controls and preview canvas. */
export function createEditor(ids) {
  const canvas = document.getElementById(ids.canvas);
  const state = {
    w: 1080,
    h: 1080,
    layout: 'hero',
    panels: panelsFor('hero', null, ''),
    caption: 'Sunset Heist',
    tagline: 'Palm nights · Neon skies',
  };
  let selected = 0;
  let drag = null;

  const el = (id) => document.getElementById(id);
  const status = el(ids.status);

  function redraw() {
    drawCover(canvas, state);
    el(ids.zoomLabel).textContent = `Panel ${selected + 1} zoom`;
    el(ids.zoom).value = state.panels[selected].zoom;
    el(ids.selectedLabel).textContent =
      state.panels[selected].img
        ? `Panel ${selected + 1}: ${state.panels[selected].name || 'photo'}`
        : `Panel ${selected + 1}: empty — pick a photo`;
  }

  function setLayout(layout) {
    const old = state.panels;
    state.layout = layout;
    state.panels = panelsFor(layout, null, '');
    // Carry photos across: same index keeps its photo where one exists.
    state.panels.forEach((p, i) => {
      if (old[i] && old[i].img) {
        p.img = old[i].img;
        p.name = old[i].name;
        p.ox = old[i].ox;
        p.oy = old[i].oy;
        p.zoom = old[i].zoom;
      }
    });
    selected = 0;
    buildPanelInputs();
    document.querySelectorAll('[data-layout]').forEach((b) =>
      b.classList.toggle('active', b.dataset.layout === layout),
    );
    redraw();
  }

  function setSize(key) {
    state.w = SIZES[key].w;
    state.h = SIZES[key].h;
    document.querySelectorAll('[data-size]').forEach((b) =>
      b.classList.toggle('active', b.dataset.size === key),
    );
    redraw();
  }

  function buildPanelInputs() {
    const box = el(ids.panelInputs);
    box.innerHTML = '';
    state.panels.forEach((panel, i) => {
      const label = document.createElement('label');
      label.className = 'panel-input';
      label.textContent = `Panel ${i + 1} photo`;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        panel.img = await loadImage(URL.createObjectURL(file));
        panel.name = file.name;
        panel.ox = 0;
        panel.oy = 0;
        panel.zoom = 1;
        selected = i;
        redraw();
      });
      label.appendChild(input);
      box.appendChild(label);
    });
  }

  async function useSample(sampleId, onlyPanel) {
    const img = await loadImage(`samples/${sampleId}.jpg`);
    const targets = onlyPanel === undefined
      ? state.panels.map((_, i) => i)
      : [onlyPanel];
    targets.forEach((i) => {
      state.panels[i].img = img;
      state.panels[i].name = `${sampleId}.jpg`;
      state.panels[i].ox = 0;
      state.panels[i].oy = 0;
      state.panels[i].zoom = 1;
    });
    redraw();
  }

  function exportPng() {
    canvas.toBlob((blob) => {
      if (!blob) {
        status.textContent = 'Export failed — try again.';
        return;
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `cover-${state.w}x${state.h}.png`;
      a.click();
      status.textContent = `Saved cover-${state.w}x${state.h}.png`;
    }, 'image/png');
  }

  // Layout and size buttons.
  document.querySelectorAll('[data-layout]').forEach((b) =>
    b.addEventListener('click', () => setLayout(b.dataset.layout)),
  );
  document.querySelectorAll('[data-size]').forEach((b) =>
    b.addEventListener('click', () => setSize(b.dataset.size)),
  );
  // Sample photos: one fills every panel, the other fills panel 1 only.
  el(ids.sampleAll).addEventListener('click', () => useSample('pier'));
  el(ids.sampleOne).addEventListener('click', () => useSample('boulevard', 0));
  // Caption and tagline.
  el(ids.caption).addEventListener('input', (e) => {
    state.caption = e.target.value;
    redraw();
  });
  el(ids.tagline).addEventListener('input', (e) => {
    state.tagline = e.target.value;
    redraw();
  });
  // Zoom for the selected panel.
  el(ids.zoom).addEventListener('input', (e) => {
    state.panels[selected].zoom = Number(e.target.value);
    redraw();
  });
  el(ids.center).addEventListener('click', () => {
    const p = state.panels[selected];
    p.ox = 0;
    p.oy = 0;
    p.zoom = 1;
    redraw();
  });
  el(ids.export).addEventListener('click', exportPng);

  // Drag on the preview: pick a panel and move its photo inside it.
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * state.w;
    const y = ((e.clientY - rect.top) / rect.height) * state.h;
    const i = panelAt(state.layout, state.w, state.h, x, y);
    if (i < 0) return;
    selected = i;
    drag = { x: e.clientX, y: e.clientY, ox: state.panels[i].ox, oy: state.panels[i].oy };
    canvas.setPointerCapture(e.pointerId);
    redraw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    const p = state.panels[selected];
    p.ox = drag.ox + ((e.clientX - drag.x) / rect.width) * state.w;
    p.oy = drag.oy + ((e.clientY - drag.y) / rect.height) * state.h;
    redraw();
  });
  const endDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  buildPanelInputs();
  redraw();
  return {
    state,
    redraw,
    useSample,
    setLayout,
    setSize,
    setCaption(text) {
      state.caption = text;
      el(ids.caption).value = text;
      redraw();
    },
    setTagline(text) {
      state.tagline = text;
      el(ids.tagline).value = text;
      redraw();
    },
  };
}
