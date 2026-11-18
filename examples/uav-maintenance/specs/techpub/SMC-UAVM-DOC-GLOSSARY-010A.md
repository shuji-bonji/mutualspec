---
specloop: "0.1"
smc: SMC-UAVM-DOC-GLOSSARY-010A
kind: glossary
title: 技術文書 用語集
summary: DOC コンテキストの用語。プロペラ等は MNT の published 用語を使う。
context: DOC
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@techpub-owner"
---

# 技術文書 用語集

```yaml specloop:glossary
terms:
  - id: TERM-DOC-PROCEDURE
    term: 手順
    translations: { en: procedure }
    code: Procedure
    category: document
    definition: 作業をステップの順序として記述した文書単位。S1000D の手順 DM に対応する。
    s1000d: { element: procedure, note: "content/procedure" }
    forbidden:
      - { text: マニュアル手順, reason: 手順に統一 }
  - id: TERM-DOC-STEP
    term: ステップ
    translations: { en: step }
    code: Step
    category: document
    definition: 手順の中の 1 つの作業単位。
    s1000d: { element: proceduralStep }
  - id: TERM-DOC-TORQUE-WRENCH
    term: トルクレンチ
    translations: { en: torque wrench }
    code: torqueWrench
    category: artifact
    definition: 締め付けトルクを設定値で管理できる工具。
  - id: TERM-DOC-WARNING
    term: 警告
    translations: { en: warning }
    code: Warning
    category: document
    definition: 人の負傷につながる危険を知らせる安全情報。
    s1000d: { element: warning }
```
