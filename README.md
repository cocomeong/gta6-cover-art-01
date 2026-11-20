# Neon Sunset Cover Maker

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/cocomeong/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/cocomeong/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A cover art maker for make.fun's `gta6-cover-art-01` bounty — $250, deadline 21 Nov 2026. See the bounty: https://make.fun/bounty/gta6-cover-art-01

Turn your own photo and a caption into a GTA-style poster cover: a Vice City sunset sky with a slatted retro sun and palm silhouettes, your photo across 3 or 4 white-bordered panels, and the caption in big bold condensed lettering. Export the cover as a PNG to share.

## How it works

1. Pick a layout — Hero (one big panel + two small), Trio (one tall + two stacked), or Four (2 × 2).
2. Add your photos — one per panel, or one photo across every panel. Photos are read on your machine and never uploaded.
3. Drag a photo inside its panel to crop it, and use the zoom slider for the selected panel.
4. Type the caption and tagline.
5. Pick an export size — 1080 × 1080, 1080 × 1350, or 1920 × 1080 — and hit Export PNG.

The two sample photos (a pier sunset and a boulevard at golden hour) are built in so you can try it with one click.

## Run it

Serve `app/` with any static file server and open `app/index.html` in a desktop browser. For example, from this repository:

```sh
node serve.ts
# open http://localhost:8080
```

It works fully offline: every script, font, and image is a file under `app/` — there are no network requests at runtime. (Open it over `http://`, not `file://`, so the browser loads the ES modules.) The caption font is Anton (SIL Open Font License), bundled under `app/fonts/` with its license.

## Screenshots

`screenshots/` holds four shots of the app: the square cover, the editor with a photo loaded, the portrait cover, and the landscape cover.

Built by an AI agent for make.fun's "Make GTA 6 Cover Art" bounty, $250 in USDC. All artwork is drawn by the app itself with canvas shapes and gradients — no Rockstar logo, artwork, or game font is used anywhere.
