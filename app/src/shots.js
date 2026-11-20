// Fixed scenes for screenshots: ?shot=editor shows the page with a
// sample photo loaded; ?shot=cover shows the cover alone, full-bleed.
// `photo` picks the sample for every panel (samples/<photo>.jpg),
// `photo2` a different sample for panel 2, `caption` and `tagline` the
// words, `layout` the panel layout, `size` the export size (WxH).
// window.__shotReady is set once painted, after the font is ready.
export async function runShot(shot, query, editor) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const size = (query.get('size') || '1080x1080').split('x');
  const w = Number(size[0]) || 1080;
  const h = Number(size[1]) || 1080;
  editor.state.w = w;
  editor.state.h = h;
  if (query.get('layout')) editor.setLayout(query.get('layout'));
  editor.setCaption(query.get('caption') ?? 'Sunset Heist');
  editor.setTagline(query.get('tagline') ?? 'Palm nights · Neon skies');
  await editor.useSample(query.get('photo') ?? 'pier');
  const second = query.get('photo2');
  if (second) await editor.useSample(second, 1);
  const third = query.get('photo3');
  if (third) await editor.useSample(third, 2);
  const fourth = query.get('photo4');
  if (fourth) await editor.useSample(fourth, 3);
  editor.redraw();
  try { await document.fonts.ready; } catch (e) { /* font already usable */ }
  editor.redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
