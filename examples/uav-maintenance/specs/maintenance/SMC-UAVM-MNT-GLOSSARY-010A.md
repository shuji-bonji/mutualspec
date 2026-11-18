---
mutualspec: "0.1"
smc: SMC-UAVM-MNT-GLOSSARY-010A
kind: glossary
title: 整備実施 用語集（ユビキタス言語）
summary: MNT コンテキストで有効な用語・コード名・禁止語。
context: MNT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@maintenance-owner"
---

# 整備実施 用語集（ユビキタス言語）

この用語集は MNT コンテキストの中でだけ有効です。`code` はそのままクラス名・プロパティ名・状態名として使います。
`visibility: published` の語だけが、コンテキストマップの経路を通じて他コンテキストから参照できます。

```yaml mutualspec:glossary
terms:
  - id: TERM-MNT-WORK-ORDER
    term: 作業指示
    translations: { en: work order }
    code: WorkOrder
    category: entity
    definition: 1 機体に対して実施する整備作業を指示し、その実施結果を記録する単位。
    aliases: [WO]
    forbidden:
      - { text: 作業依頼, reason: 依頼は承認前の口頭依頼を指し、作業指示と区別する }
      - { text: ワークオーダー, reason: カタカナ表記は使わない }
  - id: TERM-MNT-AIRFRAME
    term: 機体
    translations: { en: airframe }
    code: airframeSerial
    category: value
    definition: 作業対象の UAV。シリアル番号で識別する。
    forbidden:
      - { text: 本体, reason: 機体と部品のどちらか曖昧になる }
  - id: TERM-MNT-PROPELLER
    term: プロペラ
    translations: { en: propeller }
    code: Propeller
    category: entity
    visibility: published
    definition: モーター軸に取り付ける回転翼 1 枚。取付位置（1〜4 または 1〜6）で区別する。
    forbidden:
      - { text: ペラ, reason: 俗称 }
      - { text: プロペラー, reason: 表記ゆれ }
      - { text: ブレード, reason: DOC/PRT では別の意味で使われうる }
  - id: TERM-MNT-PROPELLER-INSPECTION
    term: プロペラ点検結果
    translations: { en: propeller inspection }
    code: PropellerInspection
    category: value
    definition: 1 枚のプロペラについての亀裂の有無・欠け深さ・処置の記録。
  - id: TERM-MNT-CRACK
    term: 亀裂
    translations: { en: crack }
    code: crackFound
    category: concept
    visibility: published
    definition: 目視で確認できる、プロペラ表面から内部へ達する割れ。
    forbidden:
      - { text: クラック, reason: 表記を亀裂に統一 }
  - id: TERM-MNT-CHIP-DEPTH
    term: 欠け深さ
    translations: { en: chip depth }
    code: chipDepthMm
    category: unit
    unit: mm
    visibility: published
    definition: プロペラ前縁の欠けの最大深さ。ミリメートルで記録する。
  - id: TERM-MNT-PROPELLER-DISPOSITION
    term: プロペラ処置
    translations: { en: propeller disposition }
    code: disposition
    category: value
    visibility: published
    definition: 点検結果に基づくプロペラの扱い。reuse（再使用）・replace（交換）・escalate（検査員判断）のいずれか。
  - { id: TERM-MNT-STATE-DRAFT, term: 起票, code: Draft, category: state, definition: 作業指示が作成され、承認を待っている状態。 }
  - { id: TERM-MNT-STATE-APPROVED, term: 承認済み, code: Approved, category: state, definition: 整備管理者が承認し、着手できる状態。 }
  - { id: TERM-MNT-STATE-IN-PROGRESS, term: 作業中, code: InProgress, category: state, definition: 整備士が作業に着手した状態。 }
  - { id: TERM-MNT-STATE-COMPLETED, term: 完了, code: Completed, category: state, definition: すべての点検結果が記録され、作業が終わった状態。 }
  - { id: TERM-MNT-STATE-CANCELLED, term: 取消, code: Cancelled, category: state, definition: 着手前に作業指示を取り消した状態。 }
  - { id: TERM-MNT-CMD-RAISE, term: 起票する, code: raise, category: command, definition: 作業指示を新規に作成する。 }
  - { id: TERM-MNT-CMD-APPROVE, term: 承認する, code: approve, category: command, definition: 整備管理者が作業指示の着手を許可する。 }
  - { id: TERM-MNT-CMD-START, term: 着手する, code: start, category: command, definition: 整備士が作業を開始する。 }
  - { id: TERM-MNT-CMD-RECORD-INSPECTION, term: 点検結果を記録する, code: recordInspection, category: command, definition: 1 枚のプロペラの点検結果を作業指示に追加する。 }
  - { id: TERM-MNT-CMD-COMPLETE, term: 完了する, code: complete, category: command, definition: 作業を終え、作業指示を閉じる。 }
  - { id: TERM-MNT-CMD-CANCEL, term: 取り消す, code: cancel, category: command, definition: 着手前の作業指示を無効にする。 }
  - { id: TERM-MNT-EVT-APPROVED, term: 作業指示承認, code: WorkOrderApproved, category: event, definition: 作業指示が承認された出来事。 }
  - { id: TERM-MNT-EVT-STARTED, term: 作業着手, code: WorkOrderStarted, category: event, definition: 作業に着手した出来事。 }
  - { id: TERM-MNT-EVT-COMPLETED, term: 作業完了, code: WorkOrderCompleted, category: event, definition: 作業指示が完了した出来事。 }
  - { id: TERM-MNT-EVT-CANCELLED, term: 作業指示取消, code: WorkOrderCancelled, category: event, definition: 作業指示が取り消された出来事。 }
  - { id: TERM-MNT-EVT-REPLACEMENT-REQUIRED, term: プロペラ交換要, code: PropellerReplacementRequired, category: event, definition: 処置が replace と決まった出来事。部品引当のきっかけになる。 }
```
