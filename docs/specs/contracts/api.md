# API Contracts — GitHub REST API v3

## Authentication
Все запросы: заголовок `Authorization: Bearer <PAT>`

## Endpoints

### GET /user
Проверка токена.

### GET /repos/{owner}/{repo}/contents/{path}
Чтение файла.
- Response: `{ name, path, sha, content (base64), encoding }`

### PUT /repos/{owner}/{repo}/contents/{path}
Создание или обновление файла.
- Body: `{ message, content (base64), sha (если обновление) }`
- Response: `{ commit: { sha }, content: { sha } }`

### POST /repos/{owner}/{repo}/issues
Создание Issue.
- Body: `{ title, body, labels: [string] }`
- Response: `{ number, html_url, state }`

### GET /search/issues?q=repo:{owner}/{repo}+label:{label}
Поиск Issues.
- Response: `{ items: [{ number, title, labels }] }`

## Owner/Repo Config
- Owner: TestingInPractice
- Repo: Mobile-first-PWA-
