---
mutualspec: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-500A
kind: procedure
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

```yaml mutualspec:procedure
procedure:
  id: "PRC-{{CONTEXT}}-{{SLUG}}"
  title: "{{手順名}}"
  preliminary:
    tools: []
    parts: []
    safety:
      - { type: warning, text: "{{警告文}}" }
  steps:
    - id: S010
      text: "{{作業文（1 ステップ 1 動作）}}"
      expected: "{{確認できる期待結果}}" 
```
