# SPEC-p1: PWA Skeleton & Manifest

## Scope
Создать PWA-фундамент: Service Worker, manifest.json, iOS meta tags, иконки, тёмная тема CSS, базовый HTML-скелет.

## Files
- index.html — entry point with 3 panels (chat, dashboard, settings)
- manifest.json — PWA manifest (standalone, portrait, icons)
- sw.js — Service Worker with precache + networkFirst for API
- css/style.css — mobile-first, iOS safe-areas, dark theme, phase cards
- icon-192.svg, icon-512.svg
- .nojekyll — GitHub Pages compatibility

## Acceptance Criteria
- AC-008: PWA устанавливается на Home Screen (iOS)
- AC-009: Service Worker кэширует статику и работает offline

## Dependencies
- None (foundation phase)
