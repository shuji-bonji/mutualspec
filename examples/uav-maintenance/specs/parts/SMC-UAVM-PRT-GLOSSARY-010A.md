---
specloop: "0.1"
smc: SMC-UAVM-PRT-GLOSSARY-010A
kind: glossary
title: 部品 用語集
summary: PRT コンテキストの用語。部品番号のみ published。
context: PRT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@parts-owner"
---

# 部品 用語集

```yaml specloop:glossary
terms:
  - id: TERM-PRT-PART-NUMBER
    term: 部品番号
    translations: { en: part number }
    code: PartNumber
    category: value
    visibility: published
    definition: 部品の種類を一意に識別する英数字の番号。
    forbidden:
      - { text: 品番, reason: 部品番号に統一 }
  - id: TERM-PRT-STOCK-LEVEL
    term: 在庫数
    translations: { en: stock level }
    code: stockLevel
    category: value
    definition: 引当可能な部品の数量。PRT 内部の概念で、MNT には照会結果として返す。
```
