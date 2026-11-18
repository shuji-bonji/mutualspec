# ADR（Architecture Decision Records）

SpecLoop の主要な決定の記録です。形式: 状況 → 決定 → 検討した代替案 → 結果。日付はすべて 2026-11-19（設計完結時点）。

| ADR | タイトル | 状態 |
|---|---|---|
| [0001](0001-naming.md) | 命名: プロジェクト名 SpecLoop、概念名 Specs of Domain Loops | Accepted（会話で合意済み） |
| [0002](0002-compose-existing-standards.md) | 既存の標準・OSS の組み合わせで構成し、自作は継ぎ目に限る | Accepted |
| [0003](0003-single-source-module.md) | 正本: 1 ファイルに YAML front matter + 型付き YAML ブロック + Markdown 本文 | Accepted |
| [0004](0004-smc-and-element-ids.md) | 識別子: SMC（DMC に倣う）と要素 ID | Accepted |
| [0005](0005-slrx-rule-model.md) | ルールモデル: SLRX（BREX の構造を Spec Graph に写す） | Accepted |
| [0006](0006-domain-semantics-layer.md) | BREX を超える意味モデル層を独立させる | Accepted |
| [0007](0007-bounded-context-as-directory.md) | 境界: コンテキスト = ディレクトリ + コード、越境は宣言した経路だけ | Accepted |
| [0008](0008-deterministic-judgement.md) | 判定は決定的なツール、LLM は提案、LLM レビューは助言 | Accepted |
| [0009](0009-gates-and-human-approval.md) | ゲートと人の承認: 機械条件は必要条件、G1 / G4 の人の承認は必須 | Accepted |
| [0010](0010-git-as-loop-ledger.md) | Git をループの台帳にする: 1 ループ = 1 ブランチ + 1 PR + ループ記録 | Accepted |
| [0011](0011-implementation-stack.md) | 実装スタック: TypeScript / Node.js（npm 配布） | Proposed（仮定 A-02） |
| [0012](0012-s1000d-as-profile.md) | S1000D はコアではなくプロファイル | Accepted |
| [0013](0013-sarif-reporting.md) | 検証結果の形式: finding（JSON）と SARIF 2.1.0 | Accepted |
| [0014](0014-quality-by-29148.md) | 要求品質の基準は ISO/IEC/IEEE 29148、文型は EARS を任意で | Accepted |
