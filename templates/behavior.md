---
mutualspec: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-300A
kind: behavior
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

```yaml mutualspec:behavior
stateMachines:
  - id: "BHV-{{CONTEXT}}-{{SLUG}}"
    subject: "AGG-{{CONTEXT}}-{{SLUG}}"
    initial: "{{Initial}}"
    states:
      - { name: "{{Initial}}", term: "TERM-{{CONTEXT}}-{{STATE}}" }
      - { name: "{{Done}}", term: "TERM-{{CONTEXT}}-{{STATE2}}", final: true }
    transitions:
      - { from: "{{Initial}}", to: "{{Done}}", on: "CMD-{{CONTEXT}}-{{SLUG}}" }
```
