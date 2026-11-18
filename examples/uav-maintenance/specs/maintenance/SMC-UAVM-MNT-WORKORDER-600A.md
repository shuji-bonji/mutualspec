---
specloop: "0.1"
smc: SMC-UAVM-MNT-WORKORDER-600A
kind: scenarios
title: 作業指示 受け入れシナリオ
summary: REQ-MNT-0001〜0004 を検証する Given/When/Then シナリオ。
context: MNT
issue: { number: 1, inWork: 0 }
status: approved
language: ja
owner: "@maintenance-owner"
refs: [SMC-UAVM-MNT-WORKORDER-100A]
---

# 作業指示 受け入れシナリオ

```yaml specloop:scenarios
scenarios:
  - id: SCN-MNT-0001
    title: 承認前の作業指示には着手できない
    verifies: [REQ-MNT-0001]
    given: [状態が起票の作業指示がある]
    when: [整備士が着手する]
    then: [コマンドは拒否される, 状態は起票のまま]
    automation: { test: "tests/workorder.spec.ts#SCN-MNT-0001" }
  - id: SCN-MNT-0002
    title: プロペラ処置は判断表に従う
    verifies: [REQ-MNT-0003]
    given: [状態が作業中の作業指示がある]
    when: [整備士が点検結果を記録する]
    then: [プロペラ処置は判断表の該当行の結果と一致する]
    examples:
      - { crackFound: true, chipDepthMm: 0.2, disposition: replace }
      - { crackFound: false, chipDepthMm: 0.2, disposition: reuse }
      - { crackFound: false, chipDepthMm: 0.7, disposition: escalate }
      - { crackFound: false, chipDepthMm: 1.2, disposition: replace }
    automation: { test: "tests/workorder.spec.ts#SCN-MNT-0002" }
  - id: SCN-MNT-0003
    title: 点検結果が欠けていると完了できない
    verifies: [REQ-MNT-0002]
    given: [型式 QX-4 で状態が作業中の作業指示がある, 取付位置 1〜3 の点検結果だけが記録されている]
    when: [整備士が完了する]
    then: [コマンドは拒否される, 未記録の取付位置 4 が示される]
    automation: { test: "tests/workorder.spec.ts#SCN-MNT-0003" }
  - id: SCN-MNT-0004
    title: escalate のとき検査員判断の記録を求める
    verifies: [REQ-MNT-0004]
    given: [状態が作業中の作業指示がある]
    when: [整備士が亀裂なし・欠け深さ 0.7 mm の点検結果を記録する]
    then: [プロペラ処置は escalate になる, 検査員に判断結果と理由の入力が求められる]
    automation: { manual: true }
```
