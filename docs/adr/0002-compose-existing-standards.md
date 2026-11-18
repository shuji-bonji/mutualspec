# ADR-0002: 既存の標準・OSS の組み合わせで構成し、自作は継ぎ目に限る

- 状態: Accepted
- 日付: 2026-11-19

## 状況

会話第 5 回で「既存のオープンソースと標準を組み合わせれば最小限のフレームワークは成立し、新規に大きな基盤を作る必要はない」と結論した。

## 決定

- 標準（ISO/IEC/IEEE 29148、S1000D の考え方、JSON Schema、CommonMark、Mermaid、SARIF、JSONPath、MCP）と OSS（Ajv、remark、yaml、mermaid-cli、s1kd-tools など）を再利用する。
- 自作は Spec Graph、MSRX ルールエンジンと組込みチェック、Context Pack、Change Proposal の適用器、ビュー・スケルトン生成器、CLI、S1000D 写像に限る。

## 検討した代替案

- 要求管理ツール（Doorstop、StrictDoc、Sphinx-needs など）を土台にする: トレースは強いが、境界（DDD）・BREX 型ルール・意味モデル層を一次構造にしにくい。データの取り込み・書き出しでの連携は将来検討。
- OpenSpec / Spec Kit の拡張として作る: 変更提案の流れは近いが、境界とルールの検証が中心にない。併用可能な設計にとどめた（[07](../07-toolchain-architecture.md) §7）。

## 結果

- 依存の更新に追随する必要がある。外部コマンド（s1kd-tools）はプロファイルに限定する（のちに ADR-0016 で既定の検証器を s1000d-stack に変え、s1kd-tools は選択肢になった）。
- 上の「自作」は作る範囲の上限である。中核に残すものとプラグインに出すものの線引きは [ADR-0017](0017-core-and-plugins.md)。
