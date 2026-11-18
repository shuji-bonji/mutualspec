# LP-0001 検証レポート（G1 前・内側ループ 1 回目）

- 対象: `iter1-draft.patch` を当てた状態（LLM ドラフト＋人の初回修正）
- 実行: `mutualspec validate --loop LP-0001 --format text,sarif,md`
- 下の「実出力」は、設計パッケージ同梱の参照チェッカー `scripts/check-design.mjs` をこのドラフトに対して実行した結果そのものです。

## サマリ

| severity | 件数 |
|---|---|
| error | 9 |
| warning | 1 |

ゲート G1（`maxErrors: 0`）は **不通過**。違反を Context Pack に添えて LLM に修正案（Change Proposal）を求め、人が採否を判断する（内側ループ 2 回目へ）。

## 実出力

```text
[uav-maintenance] modules=16 elements=72
ERROR   MSR-CORE-00202  specs/techpub/SMC-UAVM-DOC-PROPREPL-500A.md  ENT-MNT-WORK-ORDER は MNT の非公開要素（block procedure line 35）
ERROR   MSR-CORE-00101  specs/maintenance/SMC-UAVM-MNT-WORKORDER-100A.md  禁止語「作業依頼」→「作業指示」(TERM-MNT-WORK-ORDER): 作業依頼は、整備管理者が適切に承認するまで作業中に移行してはならない。
ERROR   MSR-CORE-00101  specs/techpub/SMC-UAVM-DOC-PROPREPL-500A.md  禁止語「ペラ」→「プロペラ」(TERM-MNT-PROPELLER): 新しいペラを取り付け、トルクレンチで 0.6 Nm に締め付ける。
ERROR   MSR-CORE-00301  specs/maintenance/SMC-UAVM-MNT-WORKORDER-100A.md  REQ-MNT-0001: 曖昧語「適切に」: 作業依頼は、整備管理者が適切に承認するまで作業中に移行してはならない。
WARNING MSR-CORE-00207  specs/maintenance/SMC-UAVM-MNT-WORKORDER-100A.md  REQ-MNT-0002 に verifiedBy がない
ERROR   MSR-CORE-00305  specs/maintenance/SMC-UAVM-MNT-WORKORDER-100A.md  REQ-MNT-0004: プレースホルダ「TBD」
ERROR   MSR-CORE-00203  specs/maintenance/SMC-UAVM-MNT-WORKORDER-300A.md  BHV-MNT-WORK-ORDER-LIFECYCLE: InProgress から出られない
ERROR   MSR-CORE-00203  specs/maintenance/SMC-UAVM-MNT-WORKORDER-300A.md  BHV-MNT-WORK-ORDER-LIFECYCLE: Completed に到達できない
ERROR   MSR-CORE-00205  specs/maintenance/SMC-UAVM-MNT-PROPDISP-310A.md  DEC-MNT-PROP-DISPOSITION: 入力 [false,1] に 2 行一致
ERROR   MSR-PRJ-00004   specs/techpub/SMC-UAVM-DOC-PROPREPL-500A.md  PRC-DOC-PROPELLER-REPLACE#S040: 「Nm(?![a-z])」 → N·m と書く
schemas=19 findings: error=9 warning=1
```

## 違反ごとの「なぜ問題か」と修正

| # | ルール | 層 | なぜ問題か（ルールの use） | 修正 |
|---|---|---|---|---|
| 1 | MSR-CORE-00202 | L3 境界 | DOC が MNT の非公開要素（エンティティ）を直接参照した。境界を越える意味の漏れ | 手順の前提条件を「作業指示が作業中であること」と用語で書く |
| 2 | MSR-CORE-00101 | L2 語彙 | 「作業依頼」は承認前の口頭依頼を指す禁止語 | 「作業指示」に置換 |
| 3 | MSR-CORE-00101 | L2 語彙 | 「ペラ」は俗称（published 用語の禁止語は下流 DOC にも適用） | 「プロペラ」に置換 |
| 4 | MSR-CORE-00301 | L4 品質（unambiguous） | 「適切に」は解釈が 1 つに定まらない | 承認の主体と状態で書き直し、曖昧語を削除 |
| 5 | MSR-CORE-00207 | L3 意味 | must 要求に検証シナリオがない（G3 ではエラー） | SCN-MNT-0003 を追加し verifiedBy に登録 |
| 6 | MSR-CORE-00305 | L4 品質（complete） | 検証基準が TBD | 欠け深さ 0.7 mm の具体例で基準を記述 |
| 7–8 | MSR-CORE-00203 | L3 意味 | 作業中から出る遷移がなく、完了に到達できない | `InProgress → Completed (complete)` を追加 |
| 9 | MSR-CORE-00205 | L3 意味 | 欠け深さ 1.0 で R03 と R04 の 2 行が一致（unique 違反） | R03 を `[0.5..1.0)`（右開区間）に修正 |
| 10 | MSR-PRJ-00004 | L2 語彙（プロジェクト） | トルク単位の表記ゆれ | `N·m` に統一 |

## SARIF 抜粋（GitHub code scanning 用）

```json
{
  "version": "2.1.0",
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "runs": [{
    "tool": { "driver": { "name": "mutualspec", "version": "0.1.0", "informationUri": "https://example.invalid/mutualspec",
      "rules": [{ "id": "MSR-CORE-00301", "shortDescription": { "text": "要求・不変条件・手順文に曖昧語を使ってはならない（29148 unambiguous）。" },
                  "properties": { "layer": "L4", "characteristic": "unambiguous" } }] } },
    "results": [{
      "ruleId": "MSR-CORE-00301",
      "level": "error",
      "message": { "text": "REQ-MNT-0001: 曖昧語「適切に」" },
      "locations": [{ "physicalLocation": { "artifactLocation": { "uri": "specs/maintenance/SMC-UAVM-MNT-WORKORDER-100A.md" }, "region": { "startLine": 31 } },
                      "logicalLocations": [{ "fullyQualifiedName": "SMC-UAVM-MNT-WORKORDER-100A/REQ-MNT-0001/statement" }] }],
      "properties": { "elementId": "REQ-MNT-0001", "smc": "SMC-UAVM-MNT-WORKORDER-100A", "loop": "LP-0001" }
    }]
  }]
}
```
