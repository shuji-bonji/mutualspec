# 11. 実例: 小型 UAV 整備で 1 周回す

サンプル: [examples/uav-maintenance/](../examples/uav-maintenance/)（架空のドメイン。数値は説明用）。
この章の検証出力は、同梱の参照チェッカー `scripts/check-design.mjs` を実際に実行した結果です。

## 1. ドメインとコンテキスト

小型 UAV（マルチコプター）のプロペラを点検し、必要なら交換する作業を、3 つのコンテキストに分けます。

| コード | コンテキスト | 種別 | 持つもの |
|---|---|---|---|
| MNT | 整備実施 | core | 作業指示（集約）、状態遷移、プロペラ処置の判断表、判断点、要求、シナリオ |
| DOC | 技術文書 | supporting | 交換手順（S1000D 手順 DM に書き出し可能） |
| PRT | 部品 | generic | 部品番号、在庫照会インターフェース（OHS） |

```mermaid
flowchart LR
  MNT["MNT 整備実施<br/>(core)"]
  DOC["DOC 技術文書<br/>(supporting)"]
  PRT["PRT 部品<br/>(generic)"]
  MNT <-->|"Partnership / Published Language<br/>via: DEC-MNT-PROP-DISPOSITION ほか"| DOC
  PRT -->|"OHS → ACL<br/>via: IFC-PRT-PARTS-AVAILABILITY"| MNT
```

ポイントは、**手順書（DOC）は判断ロジックを持たず、MNT の判断表を参照する**ことです。会話で議論した「BREX/DM は文書の構造、業務の判断は別モデル」をそのまま形にしています。

## 2. モジュール一覧（LP-0001 終了時点）

| SMC | kind | 内容 |
|---|---|---|
| SMC-UAVM-PRJ-CHARTER-000A | charter | プロジェクトの目的・範囲・プロパティ（型式 QX-4 / QX-6）・ロール |
| SMC-UAVM-PRJ-CONTEXTMAP-020A | context-map | 3 コンテキストと 2 つの関係 |
| SMC-UAVM-PRJ-RULES-022A | rules | プロジェクトルール（検証方法の制限・手順の安全情報必須・単位表記 N·m） |
| SMC-UAVM-MNT-CHARTER-000A | charter | MNT の範囲と答えられる問い |
| SMC-UAVM-MNT-GLOSSARY-010A | glossary | 23 語（禁止語つき。プロペラ・亀裂・欠け深さ・処置は published） |
| SMC-UAVM-MNT-WORKORDER-100A | requirements | REQ-MNT-0001〜0004 |
| SMC-UAVM-MNT-WORKORDER-200A | model | 作業指示集約、不変条件 3、コマンド 6、イベント 5、ポリシー 1 |
| SMC-UAVM-MNT-WORKORDER-300A | behavior | 作業指示の状態遷移 |
| SMC-UAVM-MNT-PROPDISP-310A | decision | プロペラ処置の判断表（判断点 JDG-MNT-0001 を含む） |
| SMC-UAVM-MNT-WORKORDER-600A | scenarios | SCN-MNT-0001〜0004 |
| SMC-UAVM-DOC-CHARTER-000A / GLOSSARY-010A | charter / glossary | DOC の範囲と用語 |
| SMC-UAVM-DOC-PROPREPL-500A | procedure | プロペラの点検と交換（S1000D info code 920 に書き出し） |
| SMC-UAVM-PRT-CHARTER-000A / GLOSSARY-010A | charter / glossary | PRT の範囲と用語 |
| SMC-UAVM-PRT-AVAIL-400A | interface | 部品在庫照会（OHS） |

## 3. LP-0001: プロペラ点検・交換の作業指示を仕様化する

### ① Frame（G0）

```bash
mutualspec loop start --title "プロペラ点検・交換の作業指示を仕様化する" --context MNT --context DOC --context PRT
# → loops/LP-0001/loop.yaml、ブランチ loop/LP-0001-propeller-workorder
```

トリガーは整備管理者の要望（紙の作業カードに点検結果と交換判断が分散している）。Domain Owner が charter（inScope / outOfScope / answerableQuestions）を確認して G0 を承認。

### ② Specify（内側ループ 1 回目）

```bash
mutualspec new requirements --context MNT --subject WORKORDER
mutualspec pack --purpose specify --context MNT --focus REQ-MNT-0001
# LLM drafter が Change Proposal を返す → mutualspec apply
```

LLM の下書きと人の初回修正を合わせた状態が [loops/LP-0001/iter1-draft.patch](../examples/uav-maintenance/loops/LP-0001/iter1-draft.patch) です。典型的な「ずれ」が入っています。

```diff
-    statement: 作業指示は、整備管理者が承認するまで作業中に移行してはならない。
+    statement: 作業依頼は、整備管理者が適切に承認するまで作業中に移行してはならない。
-        - 欠け深さ 0.7 mm の点検結果を記録したとき、判断結果と理由の入力を求められること（SCN-MNT-0004）
+        - TBD
-      - { id: R03 … chipDepthMm: "[0.5..1.0)" … }
+      - { id: R03 … chipDepthMm: "[0.5..1.0]" … }
-    conditions: [作業指示が作業中であること]
+    conditions: [ENT-MNT-WORK-ORDER の status が InProgress であること]
-      text: 新しいプロペラを取り付け、トルクレンチで 0.6 N·m に締め付ける。
+      text: 新しいペラを取り付け、トルクレンチで 0.6 Nm に締め付ける。
```

### ③ Validate

```bash
mutualspec validate --format text,sarif,md
```

実出力（参照チェッカー）:

```text
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

各層が何を捕まえたか:

| 層 | 捕まえたずれ | 人だけ／LLM だけでは見落としやすい理由 |
|---|---|---|
| L2 語彙 | 「作業依頼」「ペラ」「Nm」 | 意味は通じるので読み飛ばされる。LLM は同義語を混ぜやすい |
| L3 境界 | DOC が MNT の内部エンティティを直接参照 | 書いた本人には便利な近道に見える |
| L3 意味 | 状態遷移の出口なし・到達不能、判断表の境界値 1.0 での重複 | 図を眺めても見落としやすい。境界値の重複は特に気づきにくい |
| L4 品質 | 「適切に」「TBD」、検証シナリオのない must 要求 | レビューで指摘されても基準が人によって揺れる |

詳細レポート（「なぜ問題か」と修正の表、SARIF 抜粋）: [loops/LP-0001/report-iter1.md](../examples/uav-maintenance/loops/LP-0001/report-iter1.md)

### ② → ③ 内側ループ 2 回目

指摘（ruleId・場所・use・修正候補）をそのまま LLM に返して修正案を受け取り、人が採否を判断して適用。結果:

```text
[uav-maintenance] modules=16 elements=72
schemas=19 findings: error=0 warning=0
```

### G1（仕様承認）

機械条件（error 0）を満たしたうえで、Domain Owner が PR をレビューして承認。対象モジュールは `issue 001-00`・approved になる。

### ④ Realize

```bash
mutualspec pack --purpose implement --context MNT --focus AGG-MNT-WORK-ORDER
mutualspec generate ts --decision DEC-MNT-PROP-DISPOSITION   # 判断表 → 決定的なコード
mutualspec generate ts --aggregate AGG-MNT-WORK-ORDER        # 集約のスケルトン → 人 / LLM が実装
mutualspec export s1000d --module SMC-UAVM-DOC-PROPREPL-500A --check
```

- 判断表から生成したコード: [src/contexts/maintenance/PropellerDisposition.ts](../examples/uav-maintenance/src/contexts/maintenance/PropellerDisposition.ts)（行ごとに R01〜R04 のコメント。手で編集しない）
- 集約の実装: [src/contexts/maintenance/WorkOrder.ts](../examples/uav-maintenance/src/contexts/maintenance/WorkOrder.ts)（`// @mutualspec CMD-MNT-START INV-MNT-0001 REQ-MNT-0001` のような注釈でトレース）
- 判断点（escalate）では、コードは決めずに検査員判断の記録を要求する（`complete()` が未記録の判断を拒否）。

### ⑤ Verify（G2・G3）

テスト名にシナリオ ID を含め、JUnit XML を取り込みます（[reports/junit.xml](../examples/uav-maintenance/reports/junit.xml) は実際に Vitest で実行した結果）。

```bash
npx vitest run --reporter=junit --outputFile=reports/junit.xml   # 6 tests, 0 failures
mutualspec trace --format md
```

トレース行列（`mutualspec trace` の出力形式）:

| 要求 | priority | 実現 | シナリオ | テスト | 結果 |
|---|---|---|---|---|---|
| REQ-MNT-0001 | must | INV-MNT-0001, CMD-MNT-START | SCN-MNT-0001 | workorder.spec.ts（1 件） | ✅ |
| REQ-MNT-0002 | must | INV-MNT-0002, CMD-MNT-COMPLETE | SCN-MNT-0003 | workorder.spec.ts（1 件） | ✅ |
| REQ-MNT-0003 | must | DEC-MNT-PROP-DISPOSITION, CMD-MNT-RECORD-INSPECTION | SCN-MNT-0002 | workorder.spec.ts（4 件） | ✅ |
| REQ-MNT-0004 | should | JDG-MNT-0001 | SCN-MNT-0004 | 手動（demonstration） | ✅（実演記録） |

must 要求のカバレッジ 3/3 = 100% → G3 通過。

### ⑥ Learn（G4）

現場運用の 2 日間で、判断点 JDG-MNT-0001（欠け深さ 0.5〜1.0 mm）の判断が 7 件記録されました。

```bash
mutualspec feedback add --from-judgements JDG-MNT-0001 --since 2026-11-10
mutualspec feedback triage FB-0001 --accept --loop LP-0002 --reason "判断の規則性が明確"
mutualspec loop close
```

- [feedback/FB-0001.yaml](../examples/uav-maintenance/feedback/FB-0001.yaml): 欠けが前縁の外側 1/3 にあった 5 件はすべて replace、それ以外の 2 件は reuse。
- [loops/LP-0001/loop.yaml](../examples/uav-maintenance/loops/LP-0001/loop.yaml): 全フェーズ・ゲート・Pack のハッシュ・変更モジュール・作られた FB を記録して closed。

## 4. LP-0002: 判断点を判断表に昇格させる（進行中）

```bash
mutualspec loop start --title "欠け位置を判断表の入力に加える（FB-0001）" --context MNT --context DOC --from-feedback FB-0001
mutualspec pack --purpose specify --context MNT --focus DEC-MNT-PROP-DISPOSITION
```

- Context Pack: [loops/LP-0002/pack-specify-MNT.md](../examples/uav-maintenance/loops/LP-0002/pack-specify-MNT.md)
- LLM の Change Proposal: [loops/LP-0002/proposal-1.json](../examples/uav-maintenance/loops/LP-0002/proposal-1.json)（スキーマ検証済み）

提案は R03 を「位置: 外側 1/3 → replace」「それ以外 → reuse」「位置不明 → escalate（判断点）」に分割し、新しい用語「外側三分の一の欠け」を追加します。注目点:

1. **LLM が自分の提案の欠落を `openQuestions` に書いている**: 判断表の `inputs` に新しい入力を追加する操作が含まれていない。このまま `mutualspec apply --dry-run` すると MSR-CORE-00211（未宣言の入力 `chipInOuterThird`）で止まります。人は inputs の追加を指示して内側ループを回します。
2. **範囲外を範囲外として扱っている**: DOC の手順に欠け位置の記録を追加する必要があるが、MNT の Pack の範囲外なので operations に入れず `openQuestions` に書いている。→ DOC の Pack で別の提案を作る（パートナーシップなので同じループで扱える）。
3. **証拠の少なさを人に委ねている**: reuse 側は 2 件しか実績がない。判断表に昇格させるかどうかは G1 で Domain Owner が判断する。

このループが閉じると、判断点 JDG-MNT-0001 の適用範囲は「位置不明の場合」だけに縮まり、ループの健全性指標「判断点の比率」が下がります。これが Specs of Domain Loops の狙う、**暗黙知が少しずつ仕様に移っていく**流れです。

## 5. 自分で確かめる

```bash
cd mutualspec-design
npm install
npm run check                      # → error=0（サンプルは整合）
git apply -p1 --directory=examples/uav-maintenance examples/uav-maintenance/loops/LP-0001/iter1-draft.patch   # 下書き状態に戻す
npm run check                      # → 上の 9 error / 1 warning が再現する
git checkout examples/uav-maintenance/specs   # 元に戻す（Git 管理下の場合）
```
