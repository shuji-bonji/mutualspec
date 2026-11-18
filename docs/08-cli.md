# 08. CLI 設計（`mutualspec`）

## 1. 一覧

| グループ | コマンド | 目的 | フェーズ |
|---|---|---|---|
| 初期化 | `mutualspec init` | `mutualspec.yaml`・`specs/_project/`（charter / context-map / rules）を作る | — |
| | `mutualspec context add <CODE> --name <名> --type core\|supporting\|generic --path <dir>` | コンテキストのディレクトリ・charter・glossary を作り、context-map に追記 | Frame |
| モジュール | `mutualspec new <kind> --context <CODE> --subject <SUBJ> [--variant A]` | テンプレートから Spec Module を作る（SMC を採番） | Specify |
| | `mutualspec id next <PREFIX> --context <CODE>` | 次の要素 ID を返す | Specify |
| | `mutualspec fmt [paths]` | front matter とブロックの正規化（キー順・インデント。コメント保持） | Specify |
| 構築・検証 | `mutualspec build` | Spec Graph を `.mutualspec/build/graph.json` に出力 | Validate |
| | `mutualspec validate [paths] [--layer L0..L4] [--changed] [--advisory] [--format text,json,sarif,md] [--out dir]` | 検証 | Validate |
| | `mutualspec fix [--rule <id>] [--dry-run]` | `autoApplicable` な修正だけを適用 | Validate |
| | `mutualspec rules list [--module <SMC>]` / `mutualspec rules explain <MSR-ID>` | 有効なルールの一覧、ルールの規則文・理由・適用元 | Validate |
| ビュー | `mutualspec render [--check] [--site out/]` | 生成ビュー（Mermaid）を更新／差分検査、閲覧用サイト | Validate |
| | `mutualspec show <ID>` | 要素の定義と、参照元・参照先（Graph の双方向） | 全般 |
| | `mutualspec impact <ID>` | 変更時の影響範囲（逆引き、越境を強調） | Frame |
| LLM | `mutualspec pack --purpose specify\|review\|implement\|answer --context <CODE> [--focus <ID>...] [--budget <tokens>]` | Context Pack を作る（[09](09-llm-integration.md)） | Specify / Realize |
| | `mutualspec apply <proposal.json> [--dry-run]` | Change Proposal を検証して適用 | Specify |
| | `mutualspec mcp [--stdio]` | MCP サーバーを起動 | 全般 |
| | `mutualspec agents-md [--write]` | AGENTS.md の MutualSpec 節を生成 | — |
| 実現 | `mutualspec generate ts [--aggregate <AGG>] [--decision <DEC>] [--check]` | スケルトン・判断表コード・シナリオのテスト雛形を生成 | Realize |
| | `mutualspec export s1000d [--module <SMC>] [--check]` | S1000D DM へ書き出し、s1kd-tools で検証（[10](10-s1000d-profile.md)） | Realize |
| 検証（実装） | `mutualspec trace [--format md\|csv\|json]` | トレース行列（要求 → 実現 → シナリオ → テスト → 合否） | Verify |
| | `mutualspec verify` | `trace` + JUnit 取り込み + G3 条件の評価 | Verify |
| ループ | `mutualspec loop start --title <…> --context <CODE>... [--from-feedback FB-xxxx]` | ループ記録・ブランチを作り、対象モジュールを inWork+1 | Frame |
| | `mutualspec loop status [LP-xxxx]` / `mutualspec loop current` | 現在のフェーズ・ゲート・未解決の指摘 | 全般 |
| | `mutualspec gate <G0..G4> [--loop LP-xxxx] [--approve --by <who>] [--waive --reason <…>]` | ゲート条件の判定と記録 | 各ゲート |
| | `mutualspec loop close` | G4 を判定し、ループ記録を closed にする | Learn |
| フィードバック | `mutualspec feedback add --source <…> --context <CODE> --summary <…> [--affects <ID>...]` | FB を作る | Learn |
| | `mutualspec feedback add --from-judgements <JDG-ID> [--since <date>]` | 判断記録から FB の下書きを作る（集計付き） | Learn |
| | `mutualspec feedback triage <FB-ID> --accept\|--reject\|--defer [--loop LP-xxxx] --reason <…>` | トリアージ | Learn |
| 保守 | `mutualspec doctor` | 環境診断（Node 版、外部コマンド、スキーマ版） | — |
| | `mutualspec migrate --to <ver>` | フォーマット版の移行 | — |

## 2. 主要コマンドの詳細

### 2.1 `mutualspec validate`

```text
mutualspec validate [paths...]
  --layer <L0,L1,...>       実行する層（既定: L0-L4）
  --changed                 Git の変更と、その依存先だけを検査
  --advisory                L5（LLM レビュー）を実行（設定 llm.advisoryReview が true の場合も実行）
  --format <list>           text,json,sarif,md（既定: text）
  --out <dir>               レポートの出力先（既定: .mutualspec/reports）
  --gate <G0..G4>           そのゲートの severity 調整を適用して評価
  --max-warnings <n>        warning 上限（超えたら exit 1）
```

出力（text）の 1 件:

```text
ERROR   MSR-CORE-00205  specs/maintenance/SMC-UAVM-MNT-PROPDISP-310A.md:35  DEC-MNT-PROP-DISPOSITION: 入力 [false, 1] に 2 行一致（R03, R04）
        なぜ: hitPolicy が unique の判断表は、入力のどの組み合わせにもちょうど 1 行だけ一致しなければならない。
        修正: R03 の上限を開区間にする（"[0.5..1.0)"）／R04 の下限を開区間にする（"> 1.0"）
```

### 2.2 `mutualspec pack`

```text
mutualspec pack --purpose specify --context MNT --focus REQ-MNT-0003 --budget 24000 --out .mutualspec/packs/
→ .mutualspec/packs/LP-0002-specify-MNT.md      人も読める Markdown
→ .mutualspec/packs/LP-0002-specify-MNT.json    同内容の構造化データ
→ sha256: 7d1e…（ループ記録 packs[] に追記）
```

### 2.3 `mutualspec apply`

1. Change Proposal を [schemas/llm/change-proposal.schema.json](../schemas/llm/change-proposal.schema.json) で検証。
2. `inScope: false` なら何も書かずに終了（範囲外の理由を表示）。
3. 各 operation の対象（SMC・ブロック・要素 ID）を解決し、値をブロックスキーマで検証。
4. 一時的な作業ツリーに適用し、`validate --changed` を実行。
5. `--dry-run` でなければ書き込み、提案ファイルを `loops/LP-xxxx/proposal-<n>.json` に保存（採否の記録）。
6. 結果（適用した操作・新たな指摘）を JSON で返す（内側ループで LLM に返す）。

### 2.4 `mutualspec gate`

```text
$ mutualspec gate G1 --loop LP-0001
G1 仕様承認  LP-0001
  ✔ error = 0
  ✔ warning = 1 (≤ 5)
  ✔ 生成ビュー最新
  ✔ 未解決参照 0
  ✖ 人の承認: 未（--approve --by <who> で記録）
result: pending
```

## 3. 設定（`mutualspec.yaml`）

スキーマ: [schemas/mutualspec.config.schema.json](../schemas/mutualspec.config.schema.json)。例: [examples/uav-maintenance/mutualspec.yaml](../examples/uav-maintenance/mutualspec.yaml)。

| キー | 内容 |
|---|---|
| `project` | コード・名前・主言語・併記言語 |
| `specRoot` | 正本ディレクトリ（既定 `specs`） |
| `rules` | `core: builtin`、組織ルール、プロジェクトルールの SMC、追加レキシコン |
| `loop` | ディレクトリ、内側ループ上限、ブランチ接頭辞、ゲート条件 |
| `trace` | コードのルート、注釈キーワード、JUnit XML のパス |
| `llm` | Pack の予算、出力契約（change-proposal / direct-edit）、L5 の有効化 |
| `profiles.s1000d` | modelIdentCode、対象 Issue、BREX、CSDB ディレクトリ、検証器 |
| `output` | 既定の出力形式・ディレクトリ |

## 4. 終了コード

| コード | 意味 |
|---|---|
| 0 | 成功（error なし） |
| 1 | 指摘あり（error、または warning 上限超過、ゲート不通過） |
| 2 | 使い方・設定の誤り |
| 3 | 内部エラー |
| 4 | 外部依存の不足（s1kd-tools 未導入など。`--allow-missing` で skipped 扱い） |

## 5. 規約

- すべてのコマンドは `--json` で機械可読な出力を返す（LLM エージェントがそのまま読める）。
- 書き込みを伴うコマンドは `--dry-run` を持つ。
- 時刻はタイムゾーン付き ISO 8601 で記録する。
- メッセージは `project.language` に従う（ja / en）。ルール ID と要素 ID は翻訳しない。
