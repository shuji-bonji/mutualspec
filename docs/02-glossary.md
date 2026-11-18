# 02. SpecLoop 用語集（フレームワーク自身のユビキタス言語）

SpecLoop の文書・CLI・スキーマ・ログはこの用語集の語だけを使います。左列が正式表記、`code` はスキーマやコード上の識別子です。
（この用語集自体も、将来 SpecLoop の `glossary` モジュールとして管理する前提です — [12](12-roadmap.md) の M0「ドッグフーディング」。）

## 概念・構造

| 用語 | code | 定義 | 使わない表現 |
|---|---|---|---|
| Specs of Domain Loops | — | SpecLoop の基礎概念。コンテキストごとの Domain Loop と、それが読み書きする仕様群 | Domain Loop Specs（前置詞がなく関係が曖昧） |
| Domain Loop | `loop` | 1 つ以上のコンテキストを対象に、仕様 → 検証 → 実現 → 検証 → 学習を 1 周回す単位。ID は `LP-0001` | イテレーション、スプリント（別概念） |
| コンテキスト | `context` | 境界づけられたコンテキスト（Bounded Context）。コード（例 `MNT`）とディレクトリを持つ。`PRJ` はプロジェクト全体用に予約 | ドメイン（サブドメインと区別するため単独では使わない） |
| サブドメイン種別 | `subdomainType` | core / supporting / generic（DDD の分類）。プロジェクト憲章は project | — |
| コンテキストマップ | `context-map` | コンテキスト間の関係（上流・下流・パターン）と、境界を越える経路（via）の宣言 | — |
| 経路（via） | `via` | 関係ごとに、境界を越えて参照してよい要素の一覧 | — |
| published | `visibility: published` | 他コンテキストから参照できる状態。published 用語・interface・`via` に列挙された要素 | 公開 API（範囲が狭い） |
| Spec Module | `module` | 仕様の最小管理単位。1 ファイル。S1000D の Data Module に相当 | 仕様書（複数モジュールの集合を指す場合と混同する） |
| SMC | `smc` | Spec Module Code。`SMC-{project}-{context}-{subject}-{kindCode}{variant}` | DMC（S1000D の識別子にのみ使う） |
| kind | `kind` | モジュールの種別（charter, glossary, context-map, rules, description, requirements, model, behavior, decision, interface, procedure, scenarios）。3 桁の種別コードを持つ | type（要素の種別と区別） |
| 規範ブロック | `block` | ```` ```yaml specloop:<kind> ```` で囲んだ YAML。仕様の規範（normative）部分 | — |
| 説明 | `prose` | 規範ブロック以外の Markdown 本文。informative | — |
| 生成ビュー | `generated view` | `specloop render` が規範ブロックから生成する Mermaid 図など。手で編集しない | — |
| 要素 | `element` | 規範ブロック内の ID を持つもの（REQ, TERM, AGG, ...）。型は `type` | オブジェクト |
| 要素 ID | `id` | `{PREFIX}-{context}-{local}` 形式（例 `REQ-MNT-0001`）。プロジェクト内で一意 | — |
| issue | `issue` | モジュールの版。`number`（承認版番号）と `inWork`（作業中番号）。表示は `001-02`。S1000D の issueNumber / inWork に倣う | version（パッケージ版と区別） |
| status | `status` | draft / proposed / approved / deprecated / retired | — |
| 適用性 | `applicability` | 要素が有効になる製品・運用条件の式。charter で宣言した property だけを使う。S1000D の applicability に倣う | 条件分岐 |
| Spec Graph | `graph` | 全モジュールを正規化した中間表現（JSON）。ルールはここに対して評価される | AST |

## 意味モデル層

| 用語 | code | 定義 |
|---|---|---|
| 意味モデル層 | `semantics layer` | BREX（構造ルール）では表せない業務の意味を明示する層。不変条件・状態遷移・判断表・理由・判断点・適用性 |
| 不変条件 | `invariant` (INV) | 集約が常に満たす条件。理由と enforcedBy を持つ |
| 状態遷移 | `stateMachine` (BHV) | 集約の状態・遷移・トリガー（コマンド）・ガード |
| 判断表 | `decision` (DEC) | 入力の組み合わせから出力を決める表。hitPolicy は unique / first |
| 判断点 | `judgement` (JDG) | 機械が判定せず、指定ロールの人が判断する点。暗黙知の境界。判断結果は記録され、フィードバックの源泉になる |
| 理由 | `rationale` | 要求・不変条件・ルールが「なぜあるか」。BREX が持てない情報 |

## ルール・検証

| 用語 | code | 定義 |
|---|---|---|
| SLRX | `rules` | SpecLoop Rules eXchange。kind: rules のモジュールに書くルールセット。S1000D BREX の構造（objectPath / allowedObjectFlag / objectValue / objectUse）を Spec Graph に写したもの |
| ルールセット層 | `ruleset.layer` | core / organization / project / context。下位は上位を狭めるだけ |
| ルール | `rule` (SLR) | ID `SLR-{context}-{5 桁}`。kind は structure / vocabulary / reference / semantic / quality / narrative / llm-review |
| 規則文 | `use` | ルールの内容を人と LLM が読める 1 文で書いたもの。違反時のメッセージにも使う（BREX の objectUse に相当） |
| 検証層 | `layer` | L0 スキーマ / L1 構造 / L2 語彙 / L3 参照・境界・意味 / L4 品質（29148）/ L5 LLM 助言 |
| 指摘 | `finding` | 検証が返す 1 件の結果。severity は error / warning / info / advisory |
| advisory | `advisory` | LLM レビューによる助言。単独ではゲートを失敗させない |

## ループ・運用

| 用語 | code | 定義 |
|---|---|---|
| フェーズ | `phase` | frame / specify / validate / realize / verify / learn |
| ゲート | `gate` | G0（範囲合意）〜 G4（ループ終了）。合否条件と人の承認の要否を設定で持つ |
| 内側ループ | `inner loop` | 1 フェーズ内の「起草 → 検証 → 修正」の自動反復。上限回数を持つ |
| 外側ループ | `outer loop` | Domain Loop そのもの。運用・テスト結果を仕様に戻す |
| ループ記録 | `loop record` | `loops/LP-xxxx/loop.yaml`。フェーズ・ゲート・証跡・Context Pack のハッシュ・変更モジュールを記録 |
| フィードバック | `feedback` (FB) | 現場・実装・テスト・レビュー・判断記録から得た、仕様に戻すべき知見。`feedback/FB-xxxx.yaml` |
| トリアージ | `triage` | フィードバックの採否（accepted / rejected / deferred）と、対応するループの決定 |

## LLM 連携

| 用語 | code | 定義 |
|---|---|---|
| Context Pack | `pack` | 特定の目的（起草・レビュー・実装）のために、1 コンテキストの範囲で必要な仕様だけを決定的な順序で束ねたもの。Markdown + JSON。ハッシュで同定する |
| 出力契約 | `output contract` | LLM が返すべき構造（Change Proposal の JSON Schema） |
| Change Proposal | `proposal` | LLM の構造化出力。モジュールへの操作列・使用用語・未決の問い・範囲外フラグを持つ |
| ロール | `role` | 人のロール（Domain Owner, Spec Author, Reviewer, Implementer）と LLM のロール（drafter, reviewer, implementer）。[05](05-the-loop.md) §5 |
