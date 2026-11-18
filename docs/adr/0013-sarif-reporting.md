# ADR-0013: 検証結果の形式: finding（JSON）と SARIF 2.1.0

- 状態: Accepted
- 日付: 2026-11-19

## 状況

検証結果は人（PR 上）、CI、LLM（内側ループ）の 3 者が読む。会話第 5 回で「違反箇所と、なぜ問題かを示す」ことが求められた。

## 決定

- 内部形式は finding（ruleId、layer、severity、message、use、location、fix）。
- 出力は text / json / sarif / md。SARIF は OASIS SARIF 2.1.0 で、GitHub code scanning に PR 注釈として表示できる。
- SpecLoop 固有の情報（layer、characteristic、elementId、smc、loop）は SARIF の properties に入れる。

## 検討した代替案

- 独自 JSON のみ: CI・エディタ連携を自作する必要がある。
- JUnit XML 形式で違反を出す: テスト結果と混ざり、場所の表現が弱い。

## 結果

- 行番号を正確に出すため、パーサーは YAML ブロック内の位置を元ファイルの行に写す必要がある。
