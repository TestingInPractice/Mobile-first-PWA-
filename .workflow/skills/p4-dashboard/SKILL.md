# Skill: p4-dashboard

## Role
Sub-agent: Phase Dashboard

## Task
Создать дашборд фаз:
- `js/dashboard.js` — DASHBOARD module: load phases.json, render cards
- GET .build-loop/phases.json → parse → render
- Карточки: ID, название, статус-бейдж, описание, ссылки на SPEC/AC
- Статусы: ✅ completed, 🔄 in-progress, ⏳ planned

## Output
`js/dashboard.js`. Summary в `/tmp/p4-summary.txt`.

## Judge
После реализации запустить: `scripts/build-loop/run-loop.sh --judge --phase p4`
