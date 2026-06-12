# SPEC-005: Build Loop Workflow Integration

## Цель
Интегрировать полный цикл CodeAI Build Loop: decompose → sub-agent delegation → Issues → execute-phase

## Фазы цикла
1. **Decompose** — Пользователь вводит задачу. Чат анализирует её и разбивает на подзадачи (sub-tasks).
2. **Sub-agent delegation** — Каждая подзадача оформляется как Issue в GitHub.
3. **Issues** — Issues создаются через REST API v3 с label `sub-agent`, `phase`.
4. **Execute-phase** — После создания Issues, система переводит соответствующую фазу в `.build-loop/phases.json` в статус `in-progress`.

## Детали реализации
- Команда `/decompose "текст задачи"` запускает цикл.
- Каждый sub-agent issue содержит: заголовок, описание, label, assignee (опционально).
- После создания всех issues выполняется PUT `.build-loop/phases.json` с обновлённым статусом.

## Команды чата
| Команда | Действие |
|---------|----------|
| `/decompose <task>` | Разбить задачу на подзадачи |
| `/status` | Показать статус всех фаз |
| `/exec <phase-id>` | Запустить фазу (создать issues) |
