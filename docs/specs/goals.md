# Project Goals — Mobile-first PWA for opencode planning

## Meta
- **Version**: 0.1.0
- **Priority**: High
- **Status**: Draft

## Purpose
Создать PWA для iPhone — мобильный интерфейс планирования для opencode.
Проект служит валидацией CodeAI Build Loop: decompose → sub-agent delegation → Issues → execute-phase.

## Users
- Разработчики, использующие opencode / CodeAI Build Loop
- Пользователи, которым нужен мобильный доступ к планированию фаз проекта

## Tech Stack
- Vanilla HTML/CSS/JS (ES2020)
- PWA (Service Worker, manifest.json, iOS meta tags)
- GitHub REST API v3 (REST, JSON)
- GitHub Pages (хостинг)
- CodeAI Build Loop (оркестратор + sub-agent workflow)

## Architecture

### Components
1. **Chat Interface** — текстовый ввод prompt, вывод ответа opencode в режиме планирования
2. **GitHub API Module** — REST v3: createFile, createIssue, getFile, updatePhasesJson
3. **Dashboard** — чтение .build-loop/phases.json из репозитория, отображение карточек фаз
4. **Build Loop Workflow** — decompose → sub-agent delegation (Issues) → execute-phase → update status

### Data Flow
```
User Prompt → Chat → (command parser)
  ├── /decompose → разбить задачу → показать подзадачи
  ├── /exec → создать Issues → обновить phases.json → ответ
  ├── /status → прочитать phases.json → показать статус
  └── plain text → opencode ответ (режим планирования)
```

### PWA Lifecycle
```
SW Install → Cache precache assets → Fetch (networkFirst для API)
Manifest → standalone, portrait, iOS home screen
```

## Scope
### In Scope
- Чат с поддержкой команд /decompose, /exec, /status, /help
- Создание файлов .md через GitHub REST API v3
- Создание Issues с labels (sub-agent, phase)
- Чтение и обновление .build-loop/phases.json
- Дашборд со статусами фаз
- PWA: Service Worker, manifest.json, iOS safe-areas
- Тёмная тема (iOS native feel)

### Out of Scope
- Реальное выполнение кода (только планирование)
- Система аутентификации пользователей (только PAT)
- Редактор кода / IDE-функции
- Multi-user / коллаборация

## Functional Requirements

### F-001: Чат
**F-001.1**: Пользователь вводит текстовый prompt в поле ввода
**F-001.2**: При отправке текст отображается как сообщение пользователя
**F-001.3**: opencode отвечает в режиме планирования (4 варианта ответа, рандом)
**F-001.4**: Команды: /decompose, /exec <phase-id>, /status, /help
**F-001.5**: /decompose разбивает задачу на 4 подзадачи (анализ, SPEC, AC, contracts)
**F-001.6**: /exec создаёт 3 Issues (SPEC, AC, Execute) + обновляет phases.json
**F-001.7**: /status показывает все фазы с эмодзи статусов

### F-002: GitHub API
**F-002.1**: Аутентификация через Personal Access Token (fine-grained)
**F-002.2**: GET /repos/{owner}/{repo}/contents/{path} — чтение фалов
**F-002.3**: PUT /repos/{owner}/{repo}/contents/{path} — создание/обновление файлов
**F-002.4**: POST /repos/{owner}/{repo}/issues — создание Issue
**F-002.5**: GET /search/issues — поиск Issues

### F-003: Dashboard
**F-003.1**: GET .build-loop/phases.json из репозитория
**F-003.2**: Отображение карточек фаз: ID, название, статус, описание
**F-003.3**: Статус-бейджи: ✅ completed, 🔄 in-progress, ⏳ planned
**F-003.4**: Ссылки на SPEC, AC, контракты (GitHub blob URL)

### F-004: PWA
**F-004.1**: manifest.json с display: standalone, portrait orientation
**F-004.2**: Service Worker с кэшированием статики
**F-004.3**: iOS meta tags: apple-mobile-web-app-capable, viewport-fit=cover
**F-004.4**: Иконки 192x192 и 512x512 (SVG)

### F-005: Build Loop Workflow
**F-005.1**: decompose (чтение spec → разбивка на фазы)
**F-005.2**: Sub-agent delegation (каждая фаза → task() в свежий контекст)
**F-005.3**: Issues как механизм делегирования (title, body, labels)
**F-005.4**: execute-phase (создание Issues → обновление статуса → коммит)

## Acceptance Criteria

- **AC-001**: Чат принимает prompt и отвечает в режиме планирования
- **AC-002**: Команда /decompose генерирует 4 подзадачи
- **AC-003**: Команда /exec создаёт Issues через GitHub API
- **AC-004**: Команда /status показывает все фазы и их статусы
- **AC-005**: Issues содержат labels sub-agent, phase, phase-id
- **AC-006**: После /exec обновляется phases.json (статус → in-progress)
- **AC-007**: Дашборд читает phases.json и отображает карточки
- **AC-008**: PWA устанавливается на Home Screen (iOS)
- **AC-009**: Service Worker кэширует статику и работает offline
- **AC-010**: Настройка GitHub PAT → Проверка соединения → статус

## Non-functional Requirements
- Mobile-first (iPhone SE — iPhone 15 Pro Max)
- Время ответа чата < 2 сек (имитация)
- API timeout: 10 сек
- iOS safe-area-inset-bottom поддержка
