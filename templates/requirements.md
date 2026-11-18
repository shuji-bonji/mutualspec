---
specloop: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-100A
kind: requirements
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

```yaml specloop:requirements
requirements:
  - id: "REQ-{{CONTEXT}}-0001"
    level: system
    type: functional
    statement: "{{〜は、〜しなければならない。}}"
    pattern: ubiquitous
    rationale: "{{なぜ必要か}}"
    priority: must
    risk: medium
    difficulty: nominal
    stakeholders: []
    source: ["{{出所}}"]
    verification:
      method: test
      criteria: ["{{確認可能な基準（数値・状態名・SCN ID）}}"]
    status: draft
    trace:
      satisfiedBy: []
      verifiedBy: []
```
