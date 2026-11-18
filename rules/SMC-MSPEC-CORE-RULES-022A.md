---
mutualspec: "0.1"
smc: SMC-MSPEC-CORE-RULES-022A
kind: rules
title:
  ja: MutualSpec コアルールセット（既定 MSRX）
  en: MutualSpec core rule set (default MSRX)
summary: すべての MutualSpec プロジェクトに適用される既定ルール。S1000D の default BREX に相当する。
context: CORE
issue: { number: 0, inWork: 1 }
status: draft
language: ja
owner: mutualspec-maintainers
---

# MutualSpec コアルールセット

このモジュールは MutualSpec ツールに同梱される既定ルールセットです。S1000D における default BREX と同じ位置づけで、
プロジェクトのルールセット（`kind: rules`）は `extends` でこれを継承し、**狭める方向にだけ**変更できます。

- L0（JSON Schema 検証）はルールではなくスキーマで行うため、ここには含みません。
- `narrative` ルールは機械判定できない合意事項です。レビューチェックリストと LLM の Context Pack に載ります。
- `llm-review` ルールは助言（advisory）専用で、単独ではゲートを失敗させません（ADR-0008）。

```yaml mutualspec:rules
ruleset:
  id: SMC-MSPEC-CORE-RULES-022A
  layer: core
  rules:
    # ---------- L1: structure ----------
    - id: MSR-CORE-00001
      kind: structure
      check: module.kindCodeMatchesSmc
      use: SMC の種別コード（末尾 3 桁）は front matter の kind と一致しなければならない。
      severity: error
    - id: MSR-CORE-00002
      kind: structure
      check: module.contextMatchesDirectory
      use: モジュールの context は、context-map で宣言されたそのコンテキストのディレクトリに置かなければならない。
      severity: error
    - id: MSR-CORE-00003
      kind: structure
      check: module.allowedBlocks
      params:
        charter: [charter]
        glossary: [glossary]
        context-map: [context-map]
        rules: [rules]
        description: []
        requirements: [requirements]
        model: [model]
        behavior: [behavior]
        decision: [decision]
        interface: [interface]
        procedure: [procedure]
        scenarios: [scenarios]
      use: モジュールには kind に対応する規範ブロックだけを置く。description は規範ブロックを持たない。
      severity: error
    - id: MSR-CORE-00004
      kind: structure
      check: element.idContextMatchesModule
      use: 要素 ID の第 2 セグメント（コンテキストコード）は、所属モジュールの context と一致しなければならない。
      severity: error
    - id: MSR-CORE-00005
      kind: structure
      check: element.idUnique
      use: 要素 ID と SMC はプロジェクト全体で一意でなければならない。
      severity: error
    - id: MSR-CORE-00006
      kind: structure
      select: "$.modules[?(@.status == 'approved')]"
      path: issue
      flag: 2
      values:
        - { form: pattern, allowed: "^[0-9]{3}-00$", meaning: 承認済みモジュールは inWork=00 }
      use: status が approved のモジュールは inWork が 0 でなければならない（作業中の承認は存在しない）。
      severity: error
    - id: MSR-CORE-00007
      kind: structure
      check: module.singleH1
      use: Markdown 本文は H1 を 1 つだけ持ち、title と一致させる。
      severity: warning

    # ---------- L2: vocabulary (ubiquitous language) ----------
    - id: MSR-CORE-00101
      kind: vocabulary
      check: glossary.forbiddenTerms
      scope: { fields: [statement, rationale, text, criteria, question, given, when, then, prose] }
      use: 用語集で禁止された語を使ってはならない。正式な用語に置き換える。
      severity: error
    - id: MSR-CORE-00102
      kind: vocabulary
      check: glossary.termRefsResolve
      use: model / behavior / decision / procedure が参照する term は、同一コンテキストの用語集、または上流コンテキストの published 用語でなければならない。
      severity: error
    - id: MSR-CORE-00103
      kind: vocabulary
      check: glossary.codeMatchesModelName
      use: 集約・状態・イベント・コマンドの name は、参照する用語の code と一致させる（コードとドキュメントの語彙を揃える）。
      severity: error
    - id: MSR-CORE-00104
      kind: vocabulary
      check: glossary.unusedTerms
      use: どこからも使われていない用語は、削除するか利用箇所を追加する。
      severity: info

    # ---------- L3: reference / boundary / semantic ----------
    - id: MSR-CORE-00201
      kind: reference
      check: refs.resolve
      use: すべての参照（ID、SMC、FB、テストパス）は解決できなければならない。
      severity: error
    - id: MSR-CORE-00202
      kind: reference
      check: boundary.crossContextViaPublished
      use: 他コンテキストの要素は、context-map の relation に沿って下流から上流へ、published 用語または interface を通してのみ参照できる。
      rationale: 境界づけられたコンテキストを越える意味の漏れを防ぎ、LLM が範囲外の語を推測で混ぜないようにする。
      severity: error
    - id: MSR-CORE-00203
      kind: semantic
      check: stateMachine.wellFormed
      params: { requireReachable: true, requireExitFromNonFinal: true }
      use: 状態遷移は初期状態から全状態に到達でき、終了状態以外は出口の遷移を持たなければならない。
      severity: error
    - id: MSR-CORE-00204
      kind: semantic
      check: stateMachine.commandsBelongToSubject
      use: 遷移のトリガーとなるコマンドは、状態遷移の対象集約が持つコマンドでなければならない。
      severity: error
    - id: MSR-CORE-00205
      kind: semantic
      check: decision.hitPolicy
      params: { checkOverlap: true, checkCompleteness: true }
      use: hitPolicy が unique の判断表は、入力のどの組み合わせにもちょうど 1 行だけ一致しなければならない（重複なし・漏れなし）。
      severity: error
    - id: MSR-CORE-00211
      kind: semantic
      check: decision.inputsDeclared
      use: 判断表の各行の when / then に使う名前は、inputs / outputs に宣言されていなければならない。enum の値は values に含まれていなければならない。
      severity: error
    - id: MSR-CORE-00206
      kind: semantic
      check: invariant.enforced
      use: 不変条件は enforcedBy（コマンド、ガード、判断表）を少なくとも 1 つ持つべきである。
      severity: warning
    - id: MSR-CORE-00207
      kind: semantic
      check: requirement.verifiedBy
      params: { priorities: [must] }
      use: priority が must の要求は、検証するシナリオ（SCN）を少なくとも 1 つ持たなければならない。G3 ではエラーとして扱う。
      severity: warning
    - id: MSR-CORE-00208
      kind: semantic
      check: applicability.declaredProperties
      use: 適用性式は charter で宣言されたプロパティと値だけを使う。
      severity: error
    - id: MSR-CORE-00209
      kind: semantic
      check: render.generatedUpToDate
      use: 自動生成された Mermaid 図は正本ブロックと一致していなければならない（mutualspec render で再生成）。
      severity: error
    - id: MSR-CORE-00210
      kind: semantic
      check: judgement.roleDeclared
      use: 判断点（JDG）の by / escalateTo は charter の roles に宣言されたロールでなければならない。
      severity: error

    # ---------- L4: quality (ISO/IEC/IEEE 29148) ----------
    - id: MSR-CORE-00301
      kind: quality
      characteristic: unambiguous
      scope: { elementTypes: [requirement, invariant, step, scenario], fields: [statement, text, criteria, then] }
      patterns:
        - { match: 適切に, hint: 何をもって適切とするかを数値・基準・参照で示す }
        - { match: 適宜 }
        - { match: 十分な }
        - { match: 迅速に, hint: 時間の上限を示す }
        - { match: なるべく }
        - { match: 可能な限り }
        - { match: 必要に応じて, hint: 条件を condition か判断表で明示する }
        - { match: 原則として, hint: 例外を列挙するか判断表にする }
        - { match: "など", hint: 対象を列挙する }
        - { match: "等(?![しく級価])", regex: true, hint: 対象を列挙する }
        - { match: "\\b(as appropriate|if necessary|user[- ]friendly|adequate|sufficient|etc\\.?|and/or)\\b", regex: true }
      use: 要求・不変条件・手順文に曖昧語を使ってはならない（29148 unambiguous）。
      severity: error
    - id: MSR-CORE-00302
      kind: quality
      characteristic: singular
      check: requirement.singleObligation
      params: { obligationMarkers: [しなければならない, してはならない, こと。, shall] , conjunctions: [かつ, および, ならびに, また、, " and "] }
      use: 1 つの要求文は 1 つの能力・特性・制約だけを述べる（29148 singular）。条件が複数あるのは可。
      severity: warning
    - id: MSR-CORE-00303
      kind: quality
      characteristic: verifiable
      check: requirement.measurableCriteria
      use: 検証基準は、数値・状態名・シナリオ ID のいずれかを含む確認可能な形で書く（29148 verifiable）。
      severity: warning
    - id: MSR-CORE-00304
      kind: quality
      characteristic: conforming
      check: requirement.obligationKeyword
      params: { ja: ["しなければならない", "してはならない"], en: ["shall", "shall not"] }
      use: "要求文はプロジェクトの文型（日本語は「〜しなければならない／してはならない」、英語は shall）に従う（29148 conforming）。"
      severity: warning
    - id: MSR-CORE-00305
      kind: quality
      characteristic: complete
      scope: { fields: [statement, rationale, criteria, text, definition] }
      patterns:
        - { match: TBD }
        - { match: TBC }
        - { match: 未定 }
        - { match: "要確認" }
        - { match: "\\?\\?\\?", regex: true }
      use: 承認対象の要素に未決定のプレースホルダを残してはならない（29148 complete）。draft では warning、approved では error。
      severity: error
    - id: MSR-CORE-00306
      kind: quality
      characteristic: necessary
      check: requirement.hasSource
      use: 要求は出所（source）を持つべきである。出所を説明できない要求は不要の可能性がある（29148 necessary）。
      severity: info
    - id: MSR-CORE-00307
      kind: quality
      characteristic: appropriate
      check: requirement.noDesignAtStakeholderLevel
      params: { designWords: [データベース, テーブル, API, クラス, 画面遷移, SQL, REST, JSON] }
      use: stakeholder レベルの要求に設計解を書かない（29148 appropriate）。
      severity: warning

    # ---------- narrative (人が判断) ----------
    - id: MSR-CORE-00401
      kind: narrative
      characteristic: feasible
      use: 要求がコスト・期間・技術制約の中で実現可能かを、レビューで確認する（29148 feasible）。
      severity: info
    - id: MSR-CORE-00402
      kind: narrative
      characteristic: correct
      use: 要求が元のニーズ（source）を正しく表しているかを、ドメインオーナーが確認する（29148 correct）。
      severity: info
    - id: MSR-CORE-00403
      kind: narrative
      use: 判断点（JDG）として切り出した暗黙知は、判断記録をフィードバックとして回収し、判断表へ昇格できないか各ループで見直す。
      severity: info

    # ---------- L5: llm-review (advisory only) ----------
    - id: MSR-CORE-00501
      kind: llm-review
      layer: L5
      scope: { elementTypes: [requirement] }
      prompt: 同一コンテキスト内で互いに矛盾する、または重複する要求の組を挙げよ。根拠となる ID と文言を引用し、確信が持てない場合は挙げないこと。
      use: 要求間の矛盾・重複の可能性を LLM が助言する（判定ではない）。
      severity: advisory
    - id: MSR-CORE-00502
      kind: llm-review
      layer: L5
      scope: { elementTypes: [step] }
      prompt: 各手順ステップについて、作業者が 2 通り以上に解釈し得る箇所を指摘せよ。用語集の定義を前提とすること。
      use: 手順文の解釈の揺れを LLM が助言する（判定ではない）。
      severity: advisory
```
