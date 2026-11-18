# ADR-0001: 命名: 概念名 Specs of Domain Loops とフレームワーク名（SpecLoop → MutualSpec）

- 状態: Accepted（会話で合意済み。フレームワーク名の部分は 2026-11-19 に [ADR-0015](0015-rename-to-mutualspec.md) で改訂）
- 日付: 2026-11-19

> [!IMPORTANT]
> 現在のフレームワーク名は **MutualSpec** です。会話で決めた「SpecLoop」は、同じ領域での名前の衝突が多かったため改名しました。以下の「状況」と「最初の決定」は経緯として残しています。

## 状況

会話の第 6〜11 回で名前を検討した。候補は LoopSpec、SharedSpec Loop、SpecLoop、DomainLoop、MutualSpec、DomainLoopSpec など。英語の複合名詞は末尾が中心語になる（LoopSpec = 仕様が中心、SpecLoop = ループが中心）。概念名として最初に挙がった「Domain Loop Specs」は名詞が 3 つ並ぶだけで関係が曖昧（何の Specs か読み取れない）と評価された。

## 最初の決定（会話での結論。フレームワーク名は改訂済み）

- プロジェクト名・フレームワーク名・リポジトリ名・CLI 名: SpecLoop（CLI は `specloop`）
- 概念名: **Specs of Domain Loops**（前置詞 of で「ドメインループに関する仕様」と読める）
- 名前は単数形（複数形は不要）。

## 最終決定（2026-11-19、ADR-0015）

- フレームワーク名・製品名: **MutualSpec**。CLI は `mutualspec`、npm は `mutualspec`（CLI）と `@shuji-bonji/mutualspec-*`（ライブラリ）。
- 概念名: **Specs of Domain Loops**（変更なし）。
- 冒頭の説明文: 「MutualSpec は、Specs of Domain Loops の考え方に基づくフレームワークです。ドメインの境界を明示したうえで、仕様・検証・フィードバックをループとして回し、人と LLM が同じ構造と語彙を共有できるようにします。」
- リポジトリも `shuji-bonji/specloop` から `shuji-bonji/mutualspec` に改名した。

改名の理由（詳細は [13](../13-open-questions-and-risks.md) §1.1）: 「SpecLoop」は仕様駆動・AI コーディング支援という同じ領域で既に使われていた。

- `https://specloop.dev/` と npm [`@specloop/cli`](https://www.npmjs.com/package/@specloop/cli)（AI コーディングエージェント向けの CLI + MCP。bin `specloop`）
- `https://specloop.ai/`（仕様からサイト・アプリを作る商用 SaaS）
- `https://www.specloop.io/en/`（「From requirement to code」を掲げる別の商用 SaaS）
- npm で bin `specloop` を持つパッケージ 7 件以上、GitHub の同名リポジトリ 24 件

MutualSpec は、人と LLM の相互理解というこのフレームワークの中心を直接表す。会話にも候補として出ていた。調べた範囲（npm / PyPI / `.com` `.io` `.dev` / GitHub / 同名製品）で衝突は見つからなかった。商標は未確認。

## 検討した代替案

| 案 | 評価 | 不採用の理由 |
|---|---|---|
| LoopSpec | 会話で一度は第一候補 | 会話では SpecLoop を選択。改名時の調査でも同じ分野の既存ツールと衝突 |
| SpecLoop | 会話での結論 | 同じ領域に商用 SaaS・同名 CLI が多数（ADR-0015） |
| LexiSpec | 衝突なし。語彙の面が伝わる | ループ・検証の要素が見えにくい |
| DomainSpecs | 概念名とのつながりが明快 | 普通名詞で検索に埋もれやすい |
| GyreSpec / GlosSpec / CircSpec / HelixSpec / OrbiSpec | 衝突は少〜中 | 意味が伝わりにくい、または近似名あり |
| DomainLoopSpec | 意味は正確 | 長く、概念を全部詰めた印象 |
| Domain Loop Specs（概念名） | — | 前置詞がなく関係が曖昧 |
| Domain-Loop Specs | 短い | Specs of Domain Loops の方が誤解が少ない |
| Loop Specs for Domains / Specs as Domain Loops | 意味は通る | 会話の結論に合わせた |

## 結果

- 「Domain」も「Loop」も名前に入らないため、README 冒頭の説明文・概念名・ディレクトリ構成（コンテキスト = ディレクトリ）で補う。
- 旧名から派生した識別子（`specloop.yaml`、ブロックタグ、SLRX、`SLR-` など）は ADR-0015 の表のとおり改名した。
- スキーマ `$id` は `https://shuji-bonji.github.io/mutualspec/schemas/0.1/…`（リポジトリの GitHub Pages。リポジトリ名に依存する）。
