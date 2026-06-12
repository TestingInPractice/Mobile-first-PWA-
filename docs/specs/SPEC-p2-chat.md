# SPEC-p2: Chat Interface

## Scope
Чат с поддержкой команд Build Loop: /decompose, /exec, /status, /help. Режим планирования.

## Files
- js/chat.js — CHAT module: addMessage, command handler, send, loading states

## Commands
| Command | Action |
|---------|--------|
| /decompose <task> | Разбить на 4 подзадачи |
| /exec <phase-id> | Создать 3 Issues + обновить phases.json |
| /status | Показать статус всех фаз из phases.json |
| /help | Справка |

## Acceptance Criteria
- AC-001: Чат принимает prompt и отвечает в режиме планирования
- AC-002: Команда /decompose генерирует 4 подзадачи
- AC-004: Команда /status показывает все фазы и их статусы

## Dependencies
- p1 (PWA skeleton)
