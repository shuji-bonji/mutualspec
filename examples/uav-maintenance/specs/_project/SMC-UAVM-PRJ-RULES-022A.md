---
specloop: "0.1"
smc: SMC-UAVM-PRJ-RULES-022A
kind: rules
title: UAVM プロジェクトルールセット
summary: コアルールを継承し、検証方法・安全要求・表記を狭める。
context: PRJ
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@domain-owner"
---

# UAVM プロジェクトルールセット

S1000D のプロジェクト BREX がデフォルト BREX を継承して狭めるのと同様に、コアルールセットを継承して制約を追加する。

```yaml specloop:rules
ruleset:
  id: SMC-UAVM-PRJ-RULES-022A
  layer: project
  extends: [SMC-SPECLOOP-CORE-RULES-022A]
  overrides:
    - rule: SLR-CORE-00302
      severity: error
      reason: 安全に関わる作業指示の要求は 1 文 1 要求を厳守する。
  rules:
    - id: SLR-PRJ-00001
      kind: structure
      select: "$.elements[?(@.type == 'requirement' && @.context == 'MNT')]"
      path: data.verification.method
      flag: 2
      values:
        - { form: single, allowed: test, meaning: 自動テスト }
        - { form: single, allowed: demonstration, meaning: 実演 }
        - { form: single, allowed: inspection, meaning: 目視・記録確認 }
      use: MNT の要求は test / demonstration / inspection のいずれかで検証する（analysis は使わない）。
      severity: error
    - id: SLR-PRJ-00002
      kind: structure
      select: "$.elements[?(@.type == 'procedure')]"
      path: data.preliminary.safety
      flag: 1
      use: 手順は必ず事前の安全情報（warning / caution / note）を持つ。
      severity: error
    - id: SLR-PRJ-00003
      kind: structure
      select: "$.elements[?(@.type == 'requirement' && @.data.type == 'safety')]"
      path: data.priority
      flag: 2
      values:
        - { form: single, allowed: must, meaning: 安全要求は必須 }
      use: type が safety の要求の priority は must でなければならない。
      severity: error
    - id: SLR-PRJ-00004
      kind: vocabulary
      check: lexicon
      scope: { fields: [statement, text, criteria, prose] }
      patterns:
        - { match: "N・m", hint: "N·m（中黒ではなく U+00B7）と書く" }
        - { match: "Nm(?![a-z])", regex: true, hint: "N·m と書く" }
        - { match: "ニュートンメートル", hint: "N·m と書く" }
      use: トルクの単位は N·m で表記する。
      severity: error
    - id: SLR-PRJ-00005
      kind: narrative
      use: 実機の数値（閾値・トルク値）をサンプル仕様に持ち込まない。
      severity: info
```
