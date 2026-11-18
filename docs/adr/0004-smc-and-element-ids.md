# ADR-0004: 識別子: SMC（DMC に倣う）と要素 ID

- 状態: Accepted
- 日付: 2026-11-19

## 状況

S1000D の DMC は、モジュールを独立に識別・参照・版管理するための階層的な識別子であり、会話第 2 回で DM を集約、BREX をビジネスルールに対応づけた。SpecLoop にも同等の安定した識別子が必要。

## 決定

- モジュール: `SMC-{project}-{context}-{subject}-{kindCode}{variant}`。種別コードのうち 022（rules）と 040（description）は S1000D の BREX / 記述 DM の info code に揃え、他は独自。
- 要素: `{PREFIX}-{context}-{local}`（REQ, TERM, AGG, ENT, VO, INV, CMD, EVT, POL, BHV, DEC, JDG, PRC, SCN, IFC, REL, SLR）。プロジェクト内で一意。再利用しない。
- 版: `issue.number` / `issue.inWork`（S1000D の issueNumber / inWork に倣う）。

## 検討した代替案

- UUID: 一意だが人と LLM が読めない。
- ファイルパスを ID にする: 移動で壊れる。
- S1000D の DMC をそのまま使う: SNS 等の S1000D 固有の構造に縛られ、ソフトウェア仕様に合わない。

## 結果

- ID に context が入るため、要素を別コンテキストに移すと ID が変わる。移動は「新 ID で作成 + 旧 ID を deprecated + supersedes」で扱う。
