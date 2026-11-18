---
specloop: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-400A
kind: interface
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

```yaml specloop:interface
interfaces:
  - id: "IFC-{{CONTEXT}}-{{SLUG}}"
    provider: "{{CONTEXT}}"
    style: open-host-service
    publishedTerms: []
    operations:
      - { name: "{{operation}}", kind: query, input: [], output: [] }
```
