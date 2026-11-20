// Boots the cover maker: builds the editor, then either runs a fixed
// screenshot scene (?shot=) or leaves the live editor on screen.
import { createEditor } from './editor.js';
import { runShot } from './shots.js';

const editor = createEditor({
  canvas: 'cover',
  status: 'status',
  caption: 'caption',
  tagline: 'tagline',
  zoom: 'zoom',
  zoomLabel: 'zoom-label',
  selectedLabel: 'selected-panel',
  center: 'center-photo',
  sampleAll: 'sample-all',
  sampleOne: 'sample-one',
  panelInputs: 'panel-inputs',
  export: 'export',
});

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), editor);
}
