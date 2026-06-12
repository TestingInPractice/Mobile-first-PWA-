# Skill: p6-validation

## Role
Sub-agent: Validation & Judge

## Task
Провести валидацию полного цикла:
- Запустить judge для каждой фазы (llm-judge.py)
- Проверить AC-001–AC-012
- Собрать результаты в validation-report.md
- Отметить p6 как completed

## Output
docs/validation-report.md. Summary в /tmp/p6-summary.txt.

## Judge
После реализации запустить: scripts/build-loop/run-loop.sh --judge --phase p6
