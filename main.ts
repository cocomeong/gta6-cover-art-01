// Neon Sunset Cover Maker — entry program for make.fun gta6-cover-art-01.
// The entry is the static web app in app/ (plain files a desktop browser
// loads offline: index.html, its ES modules, CSS, one bundled font and two
// sample photos). This program hands the app in: it copies app/ and
// screenshots/ next to this file into the output directory and writes
// dossier.json there, the summary the judge reads, built with the
// vendored make.fun library in vendor/makefun-app.ts (unchanged).
// No network, no dependencies — just file copies and one dossier build.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It runs twice in the grader and both runs must write identical bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps mirror the gate's own limits, so an entry this program accepts
// is one the scorer accepts: at most 4 screenshots of 256 KiB each, at
// most 993 files and 48 MiB under app/, no app/ path over 1000 bytes,
// and the dossier text capped at 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
