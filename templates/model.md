---
specloop: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-200A
kind: model
title: "{{タイトル}}"
summary: "{{1 行要約（Context Pack の目次に使う）}}"
context: "{{CONTEXT}}"
issue: { number: 0, inWork: 1 }
status: draft
language: ja
owner: "{{@owner}}"
---

# {{タイトル}}

## 背景（informative）

{{このモジュールが必要になった背景。規範はここに書かず、下のブロックに書く。}}

## 規範（normative）

```yaml specloop:model
aggregates:
  - id: "AGG-{{CONTEXT}}-{{SLUG}}"
    name: "{{AggregateName}}"
    term: "TERM-{{CONTEXT}}-{{SLUG}}"
    root:
      id: "ENT-{{CONTEXT}}-{{SLUG}}"
      identity: "{{idName}}"
      attributes:
        - { name: "{{idName}}", type: string }
    invariants: []
    commands: []
    events: []
```
