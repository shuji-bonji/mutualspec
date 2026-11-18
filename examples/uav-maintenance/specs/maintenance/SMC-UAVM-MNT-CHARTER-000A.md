---
specloop: "0.1"
smc: SMC-UAVM-MNT-CHARTER-000A
kind: charter
title: 整備実施コンテキスト憲章
summary: 作業指示とプロペラ処置判断を扱うコアコンテキストの範囲を宣言する。
context: MNT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@maintenance-owner"
---

# 整備実施コンテキスト憲章

```yaml specloop:charter
charter:
  context: MNT
  name: 整備実施
  subdomainType: core
  purpose: 作業指示のライフサイクルと、プロペラの点検結果から処置を決める業務ルールを扱う。
  inScope:
    - 作業指示の起票・承認・着手・完了・取消
    - プロペラ点検結果の記録
    - プロペラ処置（再使用・交換・検査員判断）の決定
  outOfScope:
    - 手順書の文面と構成（DOC が扱う）
    - 部品の在庫数・発注（PRT が扱う）
  answerableQuestions:
    - この作業指示は今どの状態で、次に何ができるか
    - この点検結果ならプロペラを再使用できるか
  codeModule: src/contexts/maintenance
```
