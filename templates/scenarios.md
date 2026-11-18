---
mutualspec: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-600A
kind: scenarios
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

```yaml mutualspec:scenarios
scenarios:
  - id: "SCN-{{CONTEXT}}-0001"
    title: "{{シナリオ名}}"
    verifies: ["REQ-{{CONTEXT}}-0001"]
    given: ["{{前提}}"]
    when: ["{{操作}}"]
    then: ["{{結果}}"]
    automation: { test: "{{tests/path.spec.ts#SCN-ID}}" }
```
