# Skill: p1-pwa-skeleton

## Role
Sub-agent: PWA Foundation

## Task
Создать PWA-фундамент:
- `index.html` — entry point, 3 панели (chat, dashboard, settings), iOS meta tags
- `manifest.json` — display: standalone, orientation: portrait, icons
- `sw.js` — Service Worker: precache статики, networkFirst для API
- `css/style.css` — mobile-first, dark theme, iOS safe-areas, phase cards
- `icon-192.svg`, `icon-512.svg` — иконки

## Output
Все файлы в корне проекта. Summary в `/tmp/p1-summary.txt`.

## Judge
После реализации запустить: `scripts/build-loop/run-loop.sh --judge --phase p1`
