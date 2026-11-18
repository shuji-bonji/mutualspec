---
mutualspec: "0.1"
smc: SMC-UAVM-DOC-PROPREPL-500A
kind: procedure
title: プロペラの点検と交換
summary: プロペラを点検し、判断表に従って交換する手順。S1000D 手順 DM（info code 920）へ書き出す。
context: DOC
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@techpub-owner"
refs: [SMC-UAVM-DOC-GLOSSARY-010A, SMC-UAVM-MNT-PROPDISP-310A]
applicability: { prop: model, in: [QX-4, QX-6] }
---

# プロペラの点検と交換

> [!NOTE]
> トルク値はサンプル用の架空値です。

```yaml mutualspec:procedure
procedure:
  id: PRC-DOC-PROPELLER-REPLACE
  title: プロペラの点検と交換
  applicability: { prop: model, in: [QX-4, QX-6] }
  preliminary:
    personnel: [Technician, Inspector]
    tools:
      - { name: トルクレンチ（0.2〜2.0 N·m）, term: TERM-DOC-TORQUE-WRENCH }
      - { name: デプスゲージ（0.05 mm 目盛） }
    parts:
      - { term: TERM-MNT-PROPELLER, qty: 1 }
    safety:
      - { type: warning, text: バッテリーを取り外すまでプロペラに触れてはならない。モーターが不意に回転し、負傷するおそれがある。 }
      - { type: caution, text: 回転方向（CW / CCW）の異なるプロペラを取り違えて取り付けてはならない。 }
    conditions: [作業指示が作業中であること]
  steps:
    - id: S010
      text: 機体からバッテリーを取り外す。
      expected: 機体の電源 LED が消灯している。
    - id: S020
      text: 取付位置ごとにプロペラを点検し、亀裂の有無と欠け深さを記録する。
      record: [crackFound, chipDepthMm]
      decision: DEC-MNT-PROP-DISPOSITION
      satisfies: [REQ-MNT-0003]
    - id: S030
      text: プロペラ処置が replace の取付位置について、プロペラを取り外す。
    - id: S040
      text: 新しいプロペラを取り付け、トルクレンチで 0.6 N·m に締め付ける。
      safety:
        - { type: caution, text: 回転方向の刻印がモーターの刻印と一致していることを確認する。 }
      expected: トルクレンチが設定値で作動した。
  closeout:
    - id: S900
      text: バッテリーを取り付け、プロペラを手で回して引っ掛かりがないことを確認する。
      expected: 全取付位置のプロペラが引っ掛かりなく回転する。
  s1000d:
    infoCode: "920"
    itemLocationCode: A
    systemCode: "61"
```

<!-- mutualspec:generated begin source=SMC-UAVM-DOC-PROPREPL-500A view=procedure-flow -->
```mermaid
flowchart TD
  S010["S010 バッテリーを取り外す"] --> S020["S020 点検・記録"]
  S020 --> D{"DEC-MNT-PROP-DISPOSITION"}
  D -->|reuse| S900["S900 バッテリー取付・回転確認"]
  D -->|replace| S030["S030 取り外し"]
  D -->|escalate| J["JDG-MNT-0001 検査員判断"]
  J -->|reuse| S900
  J -->|replace| S030
  S030 --> S040["S040 取付・0.6 N·m 締付"]
  S040 --> S900
```
<!-- mutualspec:generated end -->
