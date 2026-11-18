---
mutualspec: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-020A
kind: context-map
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

```yaml mutualspec:context-map
contexts:
  - { code: "{{CTX}}", name: "{{名前}}", type: core, path: "{{dir}}" }
relations:
  - id: "REL-PRJ-{{UP}}-{{DOWN}}"
    upstream: "{{UP}}"
    downstream: "{{DOWN}}"
    patterns: [customer-supplier]
    via: []
```
