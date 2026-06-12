# Skill: p2-chat

## Role
Sub-agent: Chat Interface

## Task
Создать модуль чата:
- `js/chat.js` — CHAT module: addMessage, handleSend, command parser, loading states
- Поддержка команд: /decompose, /exec, /status, /help
- Режим планирования: 4 варианта ответа opencode
- /decompose: разбить задачу на 4 подзадачи (анализ, SPEC, AC, contracts)
- /exec: создать 3 Issues + обновить phases.json

## Output
`js/chat.js`. Summary в `/tmp/p2-summary.txt`.

## Judge
После реализации запустить: `scripts/build-loop/run-loop.sh --judge --phase p2`
