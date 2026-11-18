# ADR-0016: S1000D の既定の検証器を s1000d-stack にし、s1kd-tools を選択肢として残す

- 状態: Accepted
- 日付: 2026-11-19
- 改訂対象: [ADR-0012](0012-s1000d-as-profile.md)（検証の委ね先）

## 状況

S1000D プロファイル（[10](../10-s1000d-profile.md)）は、書き出した DM の検証に s1kd-tools の 2 つのコマンドを使う設計だった。

- `s1kd-validate`: XSD による検証
- `s1kd-brexcheck`: BREX による検証（`-l` で階層の BREX も照合する）

s1kd-tools は GPL-3.0 なので、MutualSpec はリンクせず外部コマンドとして呼ぶ必要があり、ライセンスの検討（[13](../13-open-questions-and-risks.md) Q-09）の制約になっていた。また、利用者が s1kd-tools を別途導入しなければ G2 の S1000D 検査が `skipped` になる。

一方、同じ作者の s1000d-stack は、同じ検証を npm のライブラリ `@shuji-bonji/s1000d-core` として提供している。

| MutualSpec が使う機能 | s1kd-tools | s1000d-core |
|---|---|---|
| XSD による検証 | `s1kd-validate` | `schema-validator`（libxml2-wasm） |
| BREX による検証（階層を含む） | `s1kd-brexcheck -l` | `checkAgainstBrexChain`（DM の `brexDmRef` から上位の BREX へたどり、すべての層と照合する。`extraLayers` で DM が参照していない BREX とも照合できる） |
| 参照切れの検出 | 使っていない | `refs` |

MutualSpec は TypeScript / Node.js（[ADR-0011](0011-implementation-stack.md)）なので、s1000d-core は子プロセスも MCP も介さずに呼べる。

## 決定

- `profiles.s1000d.validator` の既定値を `s1000d-stack` にする。s1000d-core をライブラリとして呼び、XSD・BREX の連鎖・参照切れを検証する。
- `s1kd-tools` は選択肢として残す。既に s1kd-tools で運用している利用者と、s1000d-core で検証できない Issue（4 系など。未確認）のためである。GPL-3.0 の外部コマンドとして呼ぶ扱いは変えない。
- 以前の値 `s1000d-stack-mcp`（verify-mcp を呼ぶ）は廃止する。CLI から MCP を介する理由が無いため。LLM から S1000D を読み書きする用途では、引き続き s1000d-stack の MCP 群を併用できる。
- 配布物（XSD・default BREX）の場所を `profiles.s1000d.specDir` で指定できるようにする。省略時は s1000d-stack と同じ環境変数 `S1000D_SPEC_DIR` を使う。同梱しない方針（ADR-0012）は変えない。
- M6 の完了条件に、同じ DM を両方の検証器で検証して結果が一致することを含める。

## 検討した代替案

- s1kd-tools を既定のまま、s1000d-stack を選択肢にする: 導入の手間と GPL-3.0 の制約が既定の経路に残る。
- s1kd-tools を外す: 既存の利用者と、s1000d-core が未対応の Issue に対応できなくなる。両方の検証器を突き合わせる手段も失う。

## 結果

- 既定の経路では外部コマンドが不要になり、npm の依存だけで G2 の S1000D 検査が動く。
- s1kd-tools（GPL-3.0）は既定の依存ではなくなり、Q-09 の制約が軽くなる。
- 違反を finding（`S1000D-XSD` / `S1000D-BREX:<brDecisionIdentNumber>`）に写すとき、コマンドの出力を解析せずにオブジェクトのまま受け取れる。
- s1000d-core の版の更新に追随する必要がある。s1000d-core が対象としている Issue の範囲が、プロファイルの既定の対象範囲になる（R-07）。
