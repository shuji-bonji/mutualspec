---
specloop: "0.1"
smc: SMC-UAVM-DOC-CHARTER-000A
kind: charter
title: 技術文書コンテキスト憲章
summary: 整備手順書（S1000D 手順 DM に書き出せる形）を扱う支援コンテキスト。
context: DOC
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@techpub-owner"
---

# 技術文書コンテキスト憲章

```yaml specloop:charter
charter:
  context: DOC
  name: 技術文書
  subdomainType: supporting
  purpose: 整備作業の手順を、人が読む手順書・LLM が読む構造・S1000D 手順 DM の 3 形式で一貫して提供する。
  inScope:
    - 手順の文面・ステップ構成・安全情報
    - 工具と交換部品の事前準備
    - S1000D 手順 DM への書き出し
  outOfScope:
    - 処置の判断ロジック（MNT の判断表を参照する）
    - 作業指示の状態管理
  answerableQuestions:
    - プロペラ交換はどの順序で行うか
    - 作業前にどの安全情報を確認するか
```
