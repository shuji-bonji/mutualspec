# ADR-0001: 命名: プロジェクト名 SpecLoop、概念名 Specs of Domain Loops

- 状態: Accepted（会話で合意済み）
- 日付: 2026-11-19

## 状況

会話の第 6〜11 回で名前を検討した。候補は LoopSpec、SharedSpec Loop、SpecLoop、DomainLoop、MutualSpec、DomainLoopSpec など。英語の複合名詞は末尾が中心語になる（LoopSpec = 仕様が中心、SpecLoop = ループが中心）。概念名として最初に挙がった「Domain Loop Specs」は名詞が 3 つ並ぶだけで関係が曖昧（何の Specs か読み取れない）と評価された。

## 決定

- プロジェクト名・フレームワーク名・リポジトリ名・CLI 名: **SpecLoop**（CLI は `specloop`）
- 概念名: **Specs of Domain Loops**（前置詞 of で「ドメインループに関する仕様」と読める）
- 冒頭の説明文: 「SpecLoop は、Specs of Domain Loops の考え方に基づくフレームワークです。ドメインの境界を明示したうえで、仕様・検証・フィードバックをループとして回し、人と LLM が同じ構造と語彙を共有できるようにします。」
- 名前は単数形（複数形は不要）。

## 検討した代替案

| 案 | 評価 | 不採用の理由 |
|---|---|---|
| LoopSpec | 会話で一度は第一候補 | 最終的に利用者が SpecLoop を選択（仕様がループする流れが自然、口頭で言いやすい） |
| DomainLoopSpec | 意味は正確 | 長く、概念を全部詰めた印象 |
| Domain Loop Specs（概念名） | — | 前置詞がなく関係が曖昧 |
| Domain-Loop Specs | 短い | Specs of Domain Loops の方が誤解が少ない |
| Loop Specs for Domains / Specs as Domain Loops | 意味は通る | 会話の結論に合わせた |

## 結果

- 「Domain」は名前に入らないため、README 冒頭・概念名・ディレクトリ構成（コンテキスト = ディレクトリ）で補う。
- GitHub 上に同名（specloop）の別プロジェクトが複数ある。パッケージの名前空間とスキーマ URL は未決（Q-08）。
