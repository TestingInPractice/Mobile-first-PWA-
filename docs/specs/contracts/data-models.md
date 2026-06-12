# Data Models

## Phase
```json
{
  "id": "phase-001",
  "title": "PWA Skeleton & Manifest",
  "status": "pending | in-progress | completed",
  "description": "Phase description",
  "spec": "docs/specs/SPEC-001-*.md",
  "acceptance_criteria": "docs/specs/AC-001-*.md",
  "contracts": ["docs/specs/contracts/*.md"]
}
```

## phases.json (Meta)
```json
{
  "$schema": "schema/phase.schema.json",
  "meta": {
    "project": "string",
    "version": "string",
    "loop_version": "string",
    "updated": "ISO8601",
    "orchestrator": "string"
  },
  "phases": [Phase]
}
```

## Chat Message
```json
{
  "role": "user | assistant | system",
  "content": "string",
  "timestamp": "ISO8601"
}
```

## GitHub Issue
```json
{
  "number": "int",
  "title": "string",
  "body": "string",
  "labels": ["sub-agent", "phase", "phase-XXX"],
  "state": "open | closed"
}
```

## Sub-agent Handoff (.workflow/subagent-handoff.json)
```json
{
  "phase": {
    "id": "string",
    "title": "string",
    "status": "string"
  },
  "skill": "skill-name",
  "spec_paths": ["string"],
  "verdict": "pending | pass | fail"
}
```
