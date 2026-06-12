# Skill: p3-github-api

## Role
Sub-agent: GitHub REST API v3

## Task
Создать модуль GitHub API:
- `js/github.js` — GITHUB module: createFile, getFile, createIssue, listIssues, updatePhasesJson
- Auth через PAT (localStorage)
- PUT /repos/{owner}/{repo}/contents/{path}
- POST /repos/{owner}/{repo}/issues
- GET /search/issues
- Settings UI в index.html (token, owner, repo, test connection)

## Output
`js/github.js`, обновлённый `index.html`. Summary в `/tmp/p3-summary.txt`.

## Judge
После реализации запустить: `scripts/build-loop/run-loop.sh --judge --phase p3`
