# SPEC-p3: GitHub REST API v3 Integration

## Scope
Модуль для работы с GitHub API: аутентификация, CRUD файлов, Issues, phases.json.

## Files
- js/github.js — GITHUB module: createFile, getFile, createIssue, listIssues, updatePhasesJson, repoUrl
- Settings UI в index.html (token input, owner/repo config, test connection)

## API Endpoints
- GET /user — проверка токена
- GET /repos/{owner}/{repo}/contents/{path} — чтение файлов
- PUT /repos/{owner}/{repo}/contents/{path} — создание/обновление
- POST /repos/{owner}/{repo}/issues — создание Issues
- GET /search/issues — поиск Issues

## Acceptance Criteria
- AC-003: Команда /exec создаёт Issues через GitHub API
- AC-005: Issues содержат labels sub-agent, phase, phase-id
- AC-010: Настройка GitHub PAT → Проверка соединения → статус OK

## Dependencies
- p1 (PWA skeleton — settings panel)
