# ADR-0003: 正本: 1 ファイルに YAML front matter + 型付き YAML ブロック + Markdown 本文

- 状態: Accepted
- 日付: 2026-11-19

## 状況

会話第 4・5 回で「Markdown を正にして構造化データを生成するのか、構造化データを正にして Markdown を生成するのか」を決める必要があるとされた。複数形式（Markdown、Mermaid、JSON、XML）を同期させるコストが課題。

## 決定

- 1 つの Spec Module = 1 つの Markdown ファイル。
- **規範**: YAML front matter と、```` ```yaml mutualspec:<kind> ```` の型付き YAML ブロック（JSON Schema で検証）。
- **説明**: Markdown 本文（informative）。
- **生成物**: Mermaid 図（マーカーで囲む）、Spec Graph（JSON）、Context Pack、S1000D XML。手で編集しない。

## 検討した代替案

| 案 | 不採用の理由 |
|---|---|
| Markdown を正にし、見出し・箇条書きから構造を抽出 | 抽出規則が脆く、検証の前提が崩れやすい。LLM の自然文がそのまま構造に入る |
| YAML / JSON を正にし、Markdown を完全生成 | 背景・意図などの説明を書く場所がなくなり、人のレビュー体験が悪い |
| Markdown と YAML を別ファイルに分ける | 同期が崩れる（片方だけ更新される）。同じコミットに入る保証がない |
| Mermaid を正にする | 表示のための言語で、意味の検査・差分の扱いが難しい |

## 結果

- 人は GitHub 等でそのまま読め、機械は規範ブロックだけを読む。同期の問題は「同じファイルの中」に閉じる。
- 規範を本文に書いてしまう誤用はレビューと書き方の規約で防ぐ（本文の義務表現を検出する info ルールを将来追加）。
