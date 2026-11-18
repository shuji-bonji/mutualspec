---
specloop: "0.1"
smc: SMC-UAVM-PRJ-CHARTER-000A
kind: charter
title: 小型UAV整備サンプル プロジェクト憲章
summary: サンプルドメイン全体の目的・範囲・コンテキスト構成を宣言する。
context: PRJ
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@domain-owner"
---

# 小型UAV整備サンプル プロジェクト憲章

> [!CAUTION]
> このプロジェクトは SpecLoop の設計検証用の**架空のサンプル**です。数値（閾値・トルク値）はすべて説明用であり、実機の整備に使ってはなりません。

## 目的

小型 UAV（マルチコプター）のプロペラ点検・交換作業を、作業指示から技術文書、部品引当まで一貫した仕様で扱う。
人（整備士・検査員・整備管理者）と LLM が同じ語彙と境界で仕様を読み書きできることを示す。

```yaml specloop:charter
charter:
  context: PRJ
  name: 小型UAV整備サンプル
  subdomainType: project
  purpose: プロペラ点検・交換作業を、作業指示・技術文書・部品の 3 コンテキストに分けて仕様化する。
  inScope:
    - プロペラの点検・処置判断・交換作業
    - 作業指示のライフサイクル
    - 交換手順書（S1000D 手順 DM へ書き出し可能な形）
    - 交換部品の在庫照会
  outOfScope:
    - 飛行運用・飛行計画
    - モーター・バッテリー・機体構造の整備
    - 部品の発注・購買
  answerableQuestions:
    - プロペラを再使用するか交換するかの判断基準
    - 作業指示がどの状態のときに何ができるか
    - プロペラ交換の手順と必要な工具
  properties:
    - name: model
      description: 機体型式
      values: [QX-4, QX-6]
  roles:
    - name: Technician
      description: 整備士
    - name: Inspector
      description: 検査員
    - name: MaintenanceManager
      description: 整備管理者
```
