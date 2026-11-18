---
specloop: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-010A
kind: glossary
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

```yaml specloop:glossary
terms:
  - id: "TERM-{{CONTEXT}}-{{SLUG}}"
    term: "{{正式表記}}"
    translations: { en: "{{english}}" }
    code: "{{CodeName}}"
    category: entity
    definition: "{{定義（1〜2 文）}}"
    aliases: []
    forbidden:
      - { text: "{{禁止語}}", reason: "{{理由}}" }
    visibility: internal
```
