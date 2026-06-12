# Mobile-first-PWA

**Валидационный проект для CodeAI Build Loop.**

PWA для iPhone — мобильный интерфейс планирования opencode.

## Функционал

- **Чат** — текстовый prompt → opencode отвечает в режиме планирования
- **GitHub API v3** — создание `.md` файлов, Issues, чтение `.build-loop/phases.json`
- **Дашборд фаз** — визуализация статуса всех фаз из phases.json
- **Build Loop workflow** — `/decompose` → `/exec` → Issues → status update

## Как использовать

1. Открой в браузере (GitHub Pages или локально)
2. В настройках введи GitHub PAT (права: `contents:write`, `issues:write`)
3. Нажми «Проверить соединение»
4. В чате:
   - `/decompose "твоя задача"` — разбить на подзадачи
   - `/status` — статус фаз
   - `/exec phase-005` — запустить фазу (создать Issues, обновить статус)

## Сценарий валидации CodeAI

| Шаг | Действие | Ожидаемый результат |
|-----|----------|---------------------|
| 1 | Указать PAT → Проверить | ✅ Connected as TestingInPractice |
| 2 | `/decompose "..."` | ✅ Список подзадач |
| 3 | `/status` | ✅ Статусы всех фаз |
| 4 | `/exec phase-005` | ✅ Issues созданы, phases.json обновлён |
| 5 | Открыть Фазы | ✅ Статус phase-005 → in-progress |
| 6 | Проверить GitHub Issues | ✅ 3 новых issue с labels |
