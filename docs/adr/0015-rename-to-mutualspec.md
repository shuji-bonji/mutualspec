# ADR-0015: フレームワーク名を SpecLoop から MutualSpec に変更し、名前空間を揃える

- 状態: Accepted（コアパッケージの中身は [ADR-0017](0017-core-and-plugins.md) で改訂）
- 日付: 2026-11-19
- 改訂対象: [ADR-0001](0001-naming.md)（フレームワーク名の部分）、[ADR-0005](0005-msrx-rule-model.md)（ルールモデルの名前）、[ADR-0011](0011-implementation-stack.md)（パッケージ名・CLI 名）

## 状況

会話で決めたフレームワーク名「SpecLoop」は、同じ領域（仕様駆動・AI コーディング支援）で既に使われていた（[13](../13-open-questions-and-risks.md) §1.1 の調査）。

- `https://specloop.dev/` と npm [`@specloop/cli`](https://www.npmjs.com/package/@specloop/cli)（AI コーディングエージェント向け CLI + MCP。bin `specloop`）
- `https://specloop.ai/`（仕様からサイト・アプリを作る商用 SaaS）
- `https://www.specloop.io/en/`（「From requirement to code」を掲げる別の商用 SaaS）
- npm で bin `specloop` を持つパッケージが 7 件以上、crates.io に `specloop-*` 7 件、GitHub に同名リポジトリ 24 件

npm 名・CLI 名・スキーマ `$id` のどれも衝突なしには取れず、総合リスクは「高」だった。そのため 43 個の候補を同じ方法（npm / PyPI / `.com` `.io` `.dev` / GitHub / ウェブ上の同名製品）で調べ、上位 8 案から利用者が選んだ。

## 決定

### 名前

- フレームワーク名・製品名: **MutualSpec**（旧称 SpecLoop）。
- 概念名: **Specs of Domain Loops**（変更なし）。
- 冒頭の説明文: 「MutualSpec は、Specs of Domain Loops の考え方に基づくフレームワークです。ドメインの境界を明示したうえで、仕様・検証・フィードバックをループとして回し、人と LLM が同じ構造と語彙を共有できるようにします。」
- GitHub リポジトリも `shuji-bonji/specloop` から **`shuji-bonji/mutualspec`** に改名した（`https://github.com/shuji-bonji/mutualspec`。旧 URL は GitHub がリダイレクトする）。

### npm パッケージと CLI

| 役割 | npm 名 | 備考 |
|---|---|---|
| CLI（入口） | `mutualspec`（スコープなし） | bin も `mutualspec`。`npx mutualspec …` で呼ぶ |
| コア | `@shuji-bonji/mutualspec-core` | Parser・Graph・Rule Engine・識別子・ゲート。Pack・Apply・Render はプラグイン（[ADR-0017](0017-core-and-plugins.md)） |
| MCP サーバー | `@shuji-bonji/mutualspec-mcp` | |
| スキーマ | `@shuji-bonji/mutualspec-schemas` | |
| 既定ルール | `@shuji-bonji/mutualspec-rules-core` | |
| 生成器 | `@shuji-bonji/mutualspec-generator-ts` | |
| S1000D プロファイル | `@shuji-bonji/mutualspec-profile-s1000d` | |

- 利用者が覚えるのは `mutualspec` だけにし、ライブラリは個人スコープ `@shuji-bonji` の下に `mutualspec-` 接頭辞で並べる。スコープ `@mutualspec` の組織を npm で作れるなら、1.0 までに移すことは選択肢として残す。
- 短い別名 `mspec` は作らない。npm の既存パッケージ `mspec` が bin `mspec` を持つため（2026-11-19 05:51 JST に `npm view mspec bin` で確認）。

確認結果（2026-11-19 05:51 JST）:

- `npm view mutualspec` → E404（未公開）。`mutual-spec`、`mutualspec-cli`、`@mutualspec/cli`、`@shuji-bonji/mutualspec-core` も E404。
- `https://registry.npmjs.org/-/v1/search?text=mutualspec` → 0 件。bin `mutualspec` を持つ既存パッケージは見つからなかった。
- PyPI `https://pypi.org/pypi/mutualspec/json` → 404。GitHub `https://api.github.com/users/mutualspec` → 404。

### スキーマ `$id`

- `https://shuji-bonji.github.io/mutualspec/schemas/0.1/…`（所有者が管理できる、リポジトリ `shuji-bonji/mutualspec` の GitHub Pages）。Pages では `schemas/` を `schemas/0.1/` として公開する。
- `$id` はリポジトリ名に依存する。GitHub はリポジトリ改名時に github.com の URL をリダイレクトするが、GitHub Pages（`*.github.io/<repo>/`）の旧パスはリダイレクトしない。今後リポジトリ名を変える場合は、版を上げて新しい URL に移し、旧 URL には旧版の静的コピーを残す。独自ドメインを取得した場合も同じ手順で移す。

### 旧名から派生した識別子

| 旧 | 新 | 判断 |
|---|---|---|
| `specloop.yaml`、スキーマ `specloop.config.schema.json`、トップレベルキー `specloop:` | `mutualspec.yaml`、`mutualspec.config.schema.json`、`mutualspec:` | 名前をそのまま置換 |
| ブロックタグ ```` ```yaml specloop:<kind> ````、`<!-- specloop:generated -->` | ```` ```yaml mutualspec:<kind> ````、`<!-- mutualspec:generated -->` | 同上 |
| `.specloop/`（作業ディレクトリ）、`.specloopignore`、`x-specloop-private` | `.mutualspec/`、`.mutualspecignore`、`x-mutualspec-private` | 同上 |
| コード注釈 `// @specloop <ID>`、MCP リソース `specloop://…`、AGENTS.md の節 | `// @mutualspec <ID>`、`mutualspec://…`、同じ節を MutualSpec 名で生成 | 同上 |
| ルールモデル SLRX（SpecLoop Rules eXchange） | **MSRX**（MutualSpec Rules eXchange） | BREX に倣った「◯◯ Rules eXchange」の形を残すため、中立名ではなく製品名の頭字語にした。中身は不変 |
| ルール要素の接頭辞 `SLR-` | `MSR-` | MSRX と揃える |
| 既定ルールセット `SMC-SPECLOOP-CORE-RULES-022A` | `SMC-MSPEC-CORE-RULES-022A` | SMC の project コードは 8 文字以内のため `MUTUALSPEC`（10 文字）は使えない。`MSPEC` を使う |
| SMC（Spec Module Code）、要素 ID の体系 | 変更なし | 旧名を含まない |
| CI ワークフロー `specloop.yml` | `mutualspec.yml` | |

## 検討した代替案

| 案 | 評価 | 不採用の理由 |
|---|---|---|
| SpecLoop のまま（npm は `@shuji-bonji/specloop`、CLI は別名） | 会話の結論を保てる | 同じ領域に商用 SaaS が 2 つ・同名 CLI が多数あり、検索性と混同の問題が残る |
| LexiSpec | 衝突なし。語彙（ユビキタス言語）の面が伝わる | ループ・検証の要素が見えにくい |
| DomainSpecs | 概念名とのつながりが最もわかりやすい | 普通名詞で検索に埋もれやすい。npm 名・CLI 名として印象に残りにくい |
| GyreSpec / GlosSpec | 衝突なし | 意味が伝わりにくい |
| CircSpec / HelixSpec / OrbiSpec | — | GitHub の近似名、似た名前のツール、`.com` のパーキングがあった |
| SODL（頭字語） | 短い | AI 仕様駆動の分野に同名の言語（`https://sodl.space/`）がある |
| LoopSpec / SpecLoom / SpecWeave | — | 同じ分野の既存ツールと衝突 |

MutualSpec を選んだ理由: 一番の売りである「人と LLM の相互理解」を直接表し、元の会話にも候補として出ていた。調べた範囲（npm / PyPI / `.com` `.io` `.dev` / GitHub / 同名製品）で衝突が最も少なかった。

## 結果

- 文書・スキーマ・ルール・テンプレート・サンプル・スクリプト・リポジトリ URL の現在名はすべて MutualSpec 系にした。SpecLoop は経緯（[00](../00-origin.md)、[ADR-0001](0001-naming.md)、[ADR-0004](0004-smc-and-element-ids.md)、[ADR-0005](0005-msrx-rule-model.md)、本 ADR、[13](../13-open-questions-and-risks.md) §1.1）にだけ残る。
- 商標（USPTO / EUIPO / J-PlatPat）は MutualSpec についても未確認。公開・配布の前に弁理士に確認する（[13](../13-open-questions-and-risks.md) R-08）。
- npm 名はまだ予約していない。公開の準備ができた時点で `mutualspec` を最初に公開して確保する。
