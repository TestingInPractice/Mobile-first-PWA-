# SPEC-p4: Dashboard — Phase Viewer

## Scope
Дашборд для визуализации фаз из .build-loop/phases.json. Рендер карточек с статус-бейджами и ссылками на SPEC/AC.

## Files
- js/dashboard.js — DASHBOARD module: load, render, error handling

## Data Source
- GET .build-loop/phases.json → parse JSON → render cards

## Acceptance Criteria
- AC-007: Дашборд читает phases.json и отображает карточки
- AC-012: Каждая фаза имеет SPEC, AC и контракт

## Dependencies
- p1 (PWA skeleton — dashboard panel)
- p3 (GitHub API — getFile)
