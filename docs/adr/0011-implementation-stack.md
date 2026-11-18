# ADR-0011: 実装スタック: TypeScript / Node.js（npm 配布）

- 状態: Proposed（仮定 A-02）
- 日付: 2026-11-19

## 状況

主要な依存（Mermaid / mermaid-cli、Ajv、MCP TypeScript SDK、remark、yaml）が同じエコシステムにある。S1000D の LLM 連携 MCP 群（s1000d-stack）も npm で配布されている。

## 決定

- TypeScript で実装し、npm で配布する（`npx specloop`）。
- モノレポ: `@specloop/core`, `cli`, `mcp`, `schemas`, `rules-core`, `generator-ts`, `profile-s1000d`（名前空間は仮）。

## 検討した代替案

- Python: Doorstop / StrictDoc / Sphinx-needs など要求管理のエコシステムと親和性が高い。Mermaid 描画と MCP SDK も利用可能だが、主要依存が分かれる。
- Go / Rust: 単一バイナリ配布が容易だが、Mermaid・remark 相当を自作またはプロセス外呼び出しにする必要がある。

## 結果

- 利用者が Node.js を必要とする。CI では問題になりにくい。
