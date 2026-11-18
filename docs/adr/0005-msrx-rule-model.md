# ADR-0005: ルールモデル: MSRX（BREX の構造を Spec Graph に写す）

- 状態: Accepted
- 日付: 2026-11-19

## 状況

BREX は objectPath（XPath）、allowedObjectFlag、objectValue、objectUse で「許されるモデルの形」を宣言し、BREX 自体が DM として版管理され、階層化される。S1000D 利用者にとって馴染みがあり、人と LLM の両方が読める規則文（objectUse）を持つ。

## 決定

- ルールは kind: rules（022）のモジュールに書く（ルールも仕様）。
- structure ルールは BREX と同じ概念: `select`（JSONPath, RFC 9535）+ `path` + `flag`（0/1/2）+ `values`（single / range / pattern）+ `use`。
- BREX にない検査（語彙・参照・境界・意味・29148 品質）は組込み `check` として同じ書式で宣言する。
- 階層は core → organization → project → context。下位は狭めるだけ。core / organization の error は緩められない。
- ルールの評価対象はファイルではなく Spec Graph。

## 検討した代替案

- Spectral のルールセットをそのまま使う: 単一ドキュメント指向で、複数ファイル統合・境界・語彙の検査を持たない（interface の外部契約には併用）。
- XPath + XML 中間表現: S1000D 利用者には馴染むが、仕様の正本が YAML であり変換が増える。
- コードでルールを書く（プラグインのみ）: ルールが仕様として読めなくなる。

## 結果

- S1000D 利用者は「objectPath が XPath ではなく JSONPath」である点に慣れる必要がある（A-03）。
- ルールモデルの名前は当初 SLRX（SpecLoop Rules eXchange）だった。2026-11-19 のフレームワーク改名に合わせて **MSRX（MutualSpec Rules eXchange）** に変えた（[ADR-0015](0015-rename-to-mutualspec.md)）。BREX（Business Rules EXchange）に倣う「◯◯ Rules eXchange」の形は維持した。中身・書式に変更はない。
