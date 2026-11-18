---
specloop: "0.1"
smc: SMC-UAVM-PRT-CHARTER-000A
kind: charter
title: 部品コンテキスト憲章
summary: 部品番号と在庫照会を公開する汎用コンテキスト。
context: PRT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@parts-owner"
---

# 部品コンテキスト憲章

```yaml specloop:charter
charter:
  context: PRT
  name: 部品
  subdomainType: generic
  purpose: 部品番号の体系と在庫照会を、Open Host Service として他コンテキストに提供する。
  inScope: [部品番号, 在庫照会]
  outOfScope: [発注・購買, 部品の取付判断]
```
