# Skill: p5-workflow

## Role
Sub-agent: Build Loop Workflow Integration

## Task
Интегрировать полный цикл CodeAI Build Loop:
- /exec <phase-id> → создать 3 Issues (SPEC, AC, Execute) с labels
- Обновить .build-loop/phases.json (статус → in-progress)
- Записать .workflow/subagent-handoff.json с handoff protocol
- Прочитать handoff, показать статус sub-agent
- Таб "SubAgents" в PWA: handoff viewer, skill viewer, judge verdict

## Files
- js/chat.js — /exec handler (createIssues + updatePhasesJson)
- js/github.js — createIssue, updatePhasesJson
- js/subagents.js — SubAgent viewer module
- index.html — SubAgents tab

## Output
Обновлённые файлы. Summary в /tmp/p5-summary.txt.

## Judge
После реализации запустить: scripts/build-loop/run-loop.sh --judge --phase p5
