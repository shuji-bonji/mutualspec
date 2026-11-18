---
specloop: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-000A
kind: charter
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

```yaml specloop:charter
charter:
  context: "{{CONTEXT}}"
  name: "{{コンテキスト名}}"
  subdomainType: core
  purpose: "{{このコンテキストが扱う業務の目的}}"
  inScope:
    - "{{扱うこと}}"
  outOfScope:
    - "{{扱わないこと（どのコンテキストが扱うかも書く）}}"
  answerableQuestions:
    - "{{この仕様で答えられる問い}}"
  properties: []
  roles: []
```
