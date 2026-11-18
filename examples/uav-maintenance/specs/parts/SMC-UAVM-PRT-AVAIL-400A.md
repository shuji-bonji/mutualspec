---
specloop: "0.1"
smc: SMC-UAVM-PRT-AVAIL-400A
kind: interface
title: 部品在庫照会インターフェース
summary: 機体型式と取付位置から交換用プロペラの部品番号と在庫有無を返す Open Host Service。
context: PRT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@parts-owner"
---

# 部品在庫照会インターフェース

```yaml specloop:interface
interfaces:
  - id: IFC-PRT-PARTS-AVAILABILITY
    provider: PRT
    style: open-host-service
    publishedTerms: [TERM-PRT-PART-NUMBER]
    operations:
      - name: checkPropellerAvailability
        kind: query
        input:
          - { name: model, type: "enum(QX-4,QX-6)" }
          - { name: position, type: integer }
        output:
          - { name: partNumber, type: string, term: TERM-PRT-PART-NUMBER }
          - { name: available, type: boolean }
        description: 型式と取付位置（回転方向）に対応するプロペラの部品番号と、引当可能かどうかを返す。
```
