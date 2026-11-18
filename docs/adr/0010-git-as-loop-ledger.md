# ADR-0010: Git をループの台帳にする: 1 ループ = 1 ブランチ + 1 PR + ループ記録

- 状態: Accepted
- 日付: 2026-11-19

## 状況

会話第 5 回: ループの各周回をコミットとして残し、Git のブランチや CI のジョブとして可視化すると追跡しやすい。

## 決定

- ループ開始でブランチ `loop/LP-xxxx-<slug>` とループ記録 `loops/LP-xxxx/loop.yaml` を作る。
- ゲートの証跡（SARIF、トレース行列、JUnit XML）、Context Pack のハッシュ、Change Proposal をループ記録に残す。
- OpenSpec の delta spec のような差分専用の形式は持たず、Git の差分と `modulesChanged` で表す。

## 検討した代替案

- delta spec（ADDED / MODIFIED / REMOVED）を持つ: 差分と正本の二重管理になる。
- 外部のワークフローツールで管理: リポジトリだけで履歴が完結しない。

## 結果

- 長期のループは main との乖離が大きくなる。ループは小さく保つ（1 コンテキスト主対象の推奨）。
