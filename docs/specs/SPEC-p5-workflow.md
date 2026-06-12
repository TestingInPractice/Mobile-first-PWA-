# SPEC-p5: Build Loop Workflow Integration

## Scope
Интеграция полного цикла: decompose → sub-agent delegation (Issues) → execute-phase → update phases.json.

## Workflow
1. Пользователь вводит /decompose "task"
2. Чат разбивает на 4 подзадачи (анализ, SPEC, AC, contracts)
3. Пользователь вводит /exec <phase-id>
4. Система создаёт 3 Issues (SPEC, AC, Execute) с labels
5. Система обновляет phases.json (статус → in-progress)
6. Дашборд отображает обновлённые статусы

## Files
- js/app.js — tab navigation, settings persistence, SW registration, connection test
- js/chat.js — /exec handler (createIssues + updatePhasesJson + response)
- js/github.js — createIssue, updatePhasesJson

## Acceptance Criteria
- AC-006: После /exec обновляется phases.json (статус → in-progress)
- AC-003: Команда /exec создаёт Issues через GitHub API

## Dependencies
- p2 (Chat — command parser)
- p3 (GitHub API — Issues, phases.json)
- p4 (Dashboard — status display)
