# ADR-0011: 実装スタック: TypeScript / Node.js（npm 配布）

- 状態: Accepted
- 日付: 2026-11-19
- 承認日: 2026-11-19（仮定 A-02 を本決定として採用）

## 状況

主要な依存（Mermaid / mermaid-cli、Ajv、MCP TypeScript SDK、remark、yaml）が同じエコシステムにある。S1000D の LLM 連携 MCP 群（s1000d-stack）も npm で配布されている。将来、検証エンジンや大規模グラフ処理などでスケールや性能が足りなくなった場合に、一部の役割だけを別言語へ置き換える余地を残したい。

## 決定

- 実装の本体は TypeScript / Node.js（現行の LTS）とし、npm で配布する。
- パッケージ名、CLI のバイナリ名、`npx` での呼び出し形は [ADR-0015](0015-rename-to-mutualspec.md) で決めた（CLI はスコープなしの `mutualspec`、ライブラリは `@shuji-bonji/mutualspec-*`、`npx mutualspec …`）。本 ADR は言語・実行環境だけを確定する。モノレポのパッケージ分割（`core`, `cli`, `mcp`, `schemas`, `rules-core`, `generator-ts`, `profile-s1000d`）は維持する。
- 将来、スケールやパフォーマンスの都合で、一部の役割（例: 検証エンジン、大規模グラフ処理）を Go / Rust / Python など別言語で書き換えてよい。その場合も次のガードレールを守る。
  1. スキーマとルールはコードに埋め込まず、`schemas/` と `rules/` のファイルを読み込む。
  2. サンプルプロジェクトの検証結果（エラー件数と SARIF 出力）をゴールデン（正解データ）として固定し、言語を替えても同じ結果になることを適合テストで確認する。
  3. CLI のコマンド名と終了コードは [08-cli.md](../08-cli.md) のとおりに固定し、中身の言語を替えても利用者が困らないようにする（起動コマンドのバイナリ名は ADR-0015 の `mutualspec`）。

## 検討した代替案

- Python: Doorstop / StrictDoc / Sphinx-needs など要求管理のエコシステムと親和性が高い。Mermaid 描画と MCP SDK も利用可能だが、主要依存が分かれる。mermaid-cli は Node 製のため、結局 Node が必要になりやすい。
- Go / Rust: 単一バイナリ配布が容易だが、Mermaid・remark 相当を自作またはプロセス外呼び出しにする必要がある。MVP の開発速度は TypeScript より遅い。核の部分を後から置き換える候補としては残す。

## 結果

- 利用者が Node.js を必要とする。CI では問題になりにくい。
- 仮定 A-02 を本 ADR の採用をもって確定した。全面的な言語変更ではなく、役割単位の置換を前提とする。
