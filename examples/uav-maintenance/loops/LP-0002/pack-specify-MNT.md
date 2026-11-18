<!--
mutualspec context pack
purpose: specify   loop: LP-0002   context: MNT   focus: DEC-MNT-PROP-DISPOSITION, FB-0001
sourceHash: (build 時の Spec Graph のハッシュ)   budget: 24000 tokens   generator: mutualspec 0.1.0
このファイルは `mutualspec pack` の出力例です（.mutualspec/packs/ に生成され、sha256 がループ記録に残る）。
-->

# Context Pack — LP-0002 / MNT 整備実施 / specify

## 0. あなたの役割と範囲

- あなたは **MNT（整備実施）コンテキストの仕様起草者（LLM drafter）**です。
- 目的: FB-0001 に基づき、判断表 DEC-MNT-PROP-DISPOSITION の改訂案を作ること。
- このコンテキストで答えられる問い:
  - この作業指示は今どの状態で、次に何ができるか
  - この点検結果ならプロペラを再使用できるか
- **範囲外**: 手順書の文面と構成（DOC が扱う）、部品の在庫数・発注（PRT が扱う）。範囲外の変更が必要な場合は operations に入れず、`openQuestions` に書くこと。依頼全体が範囲外なら `inScope: false` と理由を返すこと。
- **判断点（JDG）で機械が決めるような規則を作ってはならない**。判断点を縮める場合は、根拠（FB の件数・内容）を rationale に書くこと。
- 用語は §1 の正式表記と code だけを使うこと。新しい用語が必要なら `newTerms` で提案すること（推測で既存語を言い換えない）。
- 出力は §6 の JSON（Change Proposal）だけを返すこと。ファイルを直接書かないこと。

## 1. 用語（MNT のユビキタス言語）

| 正式表記 | code | 定義 | 使ってはならない語 |
|---|---|---|---|
| 作業指示 | WorkOrder | 1 機体に対して実施する整備作業を指示し、その実施結果を記録する単位。 | 作業依頼, ワークオーダー |
| プロペラ | Propeller | モーター軸に取り付ける回転翼 1 枚。取付位置で区別する。 | ペラ, プロペラー, ブレード |
| 亀裂 | crackFound | 目視で確認できる、プロペラ表面から内部へ達する割れ。 | クラック |
| 欠け深さ | chipDepthMm | プロペラ前縁の欠けの最大深さ（mm）。 | — |
| プロペラ処置 | disposition | reuse（再使用）・replace（交換）・escalate（検査員判断）のいずれか。 | — |
| …（この例では残り 20 語を省略。実際の Pack は全語を収録） | | | |

## 2. 境界を越えて使える要素

| 要素 | 所有 | 経路 |
|---|---|---|
| IFC-PRT-PARTS-AVAILABILITY | PRT | REL-PRJ-PRT-MNT（OHS → ACL） |
| TERM-PRT-PART-NUMBER | PRT | 同上 |
| PRC-DOC-PROPELLER-REPLACE | DOC | REL-PRJ-MNT-DOC（パートナーシップ） |

## 3. 守るべきルール（このモジュールの種類に適用されるもの）

| ルール | 規則文（use） |
|---|---|
| MSR-CORE-00205 | hitPolicy が unique の判断表は、入力のどの組み合わせにもちょうど 1 行だけ一致しなければならない（重複なし・漏れなし）。 |
| MSR-CORE-00211 | 判断表の各行の when / then に使う名前は、inputs / outputs に宣言されていなければならない。enum の値は values に含まれていなければならない。 |
| MSR-CORE-00101 | 用語集で禁止された語を使ってはならない。正式な用語に置き換える。 |
| MSR-CORE-00210 | 判断点（JDG）の by / escalateTo は charter の roles に宣言されたロールでなければならない（Technician, Inspector, MaintenanceManager）。 |
| MSR-CORE-00305 | 承認対象の要素に未決定のプレースホルダ（TBD, 未定 など）を残してはならない。 |
| MSR-CORE-00403（narrative） | 判断点として切り出した暗黙知は、判断記録をフィードバックとして回収し、判断表へ昇格できないか各ループで見直す。 |

## 4. 対象の仕様（規範部分のみ）

```yaml
# SMC-UAVM-MNT-PROPDISP-310A  issue 001-00 → 001-01（作業中）
decisions:
  - id: DEC-MNT-PROP-DISPOSITION
    question: 点検したプロペラを再使用するか、交換するか。
    hitPolicy: unique
    inputs:
      - { name: crackFound, type: boolean, term: TERM-MNT-CRACK }
      - { name: chipDepthMm, type: number, unit: mm, term: TERM-MNT-CHIP-DEPTH }
    outputs:
      - { name: disposition, type: enum, values: [reuse, replace, escalate], term: TERM-MNT-PROPELLER-DISPOSITION }
    rules:
      - { id: R01, when: { crackFound: true, chipDepthMm: "-" }, then: { disposition: replace } }
      - { id: R02, when: { crackFound: false, chipDepthMm: "< 0.5" }, then: { disposition: reuse } }
      - id: R03
        when: { crackFound: false, chipDepthMm: "[0.5..1.0)" }
        then: { disposition: escalate }
        judgement: { id: JDG-MNT-0001, by: Inspector, criteria: 欠けの位置と形状を確認し… }
      - { id: R04, when: { crackFound: false, chipDepthMm: ">= 1.0" }, then: { disposition: replace } }
    trace: { derivesFrom: [REQ-MNT-0003], verifiedBy: [SCN-MNT-0002] }
```

関連（1 ホップ）: REQ-MNT-0003（処置は判断表に従う）、REQ-MNT-0004（escalate 時は検査員判断を記録）、VO-MNT-PROPELLER-INSPECTION、PRC-DOC-PROPELLER-REPLACE#S020（この判断表を参照する手順ステップ）、SCN-MNT-0002。

## 5. 今回の入力（フィードバック）

FB-0001（field, accepted → LP-0002）: 欠け深さ 0.5〜1.0 mm の判断 7 件のうち、欠けが前縁の外側 1/3 にあった 5 件はすべて replace、それ以外の 2 件は reuse と判断された。
提案された対応: 判断表の入力に欠け位置を追加し、R03 を分割する。判断点は位置不明の場合だけに残す。

## 6. 出力契約

JSON Schema: `schemas/llm/change-proposal.schema.json`。必須: `loop`, `context`, `inScope`, `operations`, `termsUsed`, `openQuestions`。
operations の `value` は対象ブロックのスキーマ（`schemas/blocks/decision.schema.json` など）に適合すること。
