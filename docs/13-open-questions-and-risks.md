# 13. 未決事項・リスク・仮定

## 1. 未決事項（Open Questions）

| ID | 問い | 現在の扱い | 決める時期 |
|---|---|---|---|
| Q-02 | 正本の主言語を日本語にするか英語にするか（OSS として公開する場合） | 日本語を一級に扱い、英語を併記可能にした（localizedText、translations）。公開時のドキュメント言語は別途 | M0〜M1 |
| Q-03 | 分岐を含む手順を S1000D の process DM / fault isolation DM に写すか | 既定は「判断表を記述 DM の表にして参照」。分岐の写像は M6 以降に検討 | M6 |
| Q-04 | 判断表の形式を DMN と互換にするか | DMN の unary tests を簡略化したサブセット。完全互換は 1.0 以降 | 1.0 以降 |
| Q-05 | 日本語の語彙検査を形態素解析ベースにするか | 最長一致マスキング（[06](06-rules-and-validation.md) §5.2）。誤検出・見逃しの実績を見て判断 | M2 |
| Q-06 | JSONPath ライブラリの選定（RFC 9535 準拠度） | 候補 jsonpath-plus。準拠テストで評価 | M1 |
| Q-07 | 1 ループの主対象を 1 コンテキストに制限するか | 推奨にとどめた（パートナーシップは複数可） | M3 |
| Q-09 | ライセンス | 未定。依存（Ajv: MIT、Mermaid: MIT、remark: MIT、s1000d-core など）を踏まえて決める。s1kd-tools（GPL-3.0）は既定の検証器ではなくなり、`validator: s1kd-tools` のときだけ外部コマンドとして呼ぶ（ADR-0016） | M0 |
| Q-10 | 要求の `priority` を must / should / could の 3 値で足りるか | 3 値。組織ルールで追加の区分が必要なら拡張 | M1 |
| Q-11 | s1000d-stack との連携の深さ | 検証は s1000d-core をライブラリとして直接使う（既定の検証器。ADR-0016）。書き出しに s1000d-core の `buildDataModule` を使うかは M6 で判断 | M6 |
| Q-12 | 用語集をコンテキストをまたいで共有する（shared kernel）場合の運用 | 共有部分を専用コンテキストに切り出す方針のみ決定 | M3 |
| Q-13 | 顧客の様式を変えず、取り込み（入口）と投影（出口）で正本と顧客文書を分ける拡張を採用するか。するならいつか | 将来の拡張候補として [14](14-future-ingest-and-projection.md) に記録しただけ。MVP と v1.0 には入れない。採ると決めるまでスキーマ・CLI・マイルストーンは変えない | 未定（v1.0 より後。採用するかどうか自体が未決） |
| Q-14 | agentchattr、LangChain、LangGraph、LangSmith で、誰がいつ走るかと実行記録だけを編成する拡張を採用するか。するならいつか | 将来の拡張候補として [15](15-future-agent-orchestration.md) に記録しただけ。正本と判定は MutualSpec のまま。コアはこれらのツールに依存しない。MVP と v1.0 には入れない | M4 以降（LLM 連携のあと。採用するかどうか自体が未決） |

### 1.1 Q-08 名前衝突調査（2026-11-19、Asia/Tokyo）— 旧称 SpecLoop の調査記録

> [!NOTE]
> Q-08 は解決済みです（[§1.3](#13-解決済みの問い)）。フレームワーク名を **MutualSpec** に変更しました（[ADR-0015](adr/0015-rename-to-mutualspec.md)）。この節は改名の根拠として、旧称 SpecLoop の調査結果をそのまま残しています。

調査対象は「SpecLoop」「Spec Loop」「spec-loop」「specloop」。実測できた事実だけを記す。商標の公式データベースは後述のとおり検証できていない。

総合リスク（当時の SpecLoop）: **高**。同名・近似名が、仕様駆動・AI コーディング支援という同じ領域の商用 SaaS・npm パッケージ・CLI バイナリに既に使われている。当時のリポジトリ名 `shuji-bonji/specloop` と概念名「Specs of Domain Loops」は維持できるが、パッケージスコープ・起動コマンド・スキーマ URL は衝突を避ける必要がある。

**当時の提案（改名により不要になった）:** npm は `@shuji-bonji/specloop`、CLI は `specloop` 以外（例: `sodl`）、スキーマ `$id` は `https://specloop.dev/schema/…` を使わず自前で管理できる URL にする、という案だった。利用者はこの調査を受けて、名前そのものを変えることを選んだ（§1.2）。

#### npm registry

確認方法: `npm view`、`npm search specloop`、`https://registry.npmjs.org/-/v1/search?text=specloop&size=50`。

| パッケージ | 版（確認時点） | 内容 | 出典 |
|---|---|---|---|
| `specloop`（スコープなし） | — | `npm view specloop` は 404。未公開 | `https://registry.npmjs.org/specloop` |
| `spec_loop` | — | 同様に 404 | `https://registry.npmjs.org/spec_loop` |
| `@specloop/cli` | 0.1.6（2026-06-04 公開） | 「human-in-the-loop guidance for AI coding agents。CLI + MCP server。」homepage は `https://specloop.dev`。bin は `specloop`。メンテナ `specloopuser`。`@specloop/core` など他の `@specloop/*` は 404 | `https://www.npmjs.com/package/@specloop/cli` |
| `spec-loop` | 1.0.1 | 「The Spec-Loop Method: Spec-driven planning + autonomous iteration loops」。bin は `spec-loop` | `https://www.npmjs.com/package/spec-loop`、`https://github.com/greenteasamurai/spec-loop` |
| `@fushinn/specloop` | 0.1.2 | SpecLoop skills installer。bin は `specloop` | `https://www.npmjs.com/package/@fushinn/specloop` |
| `specloop-cli` | 0.5.1 | 同系統の CLI。bin は `specloop-cli` | `https://www.npmjs.com/package/specloop-cli` |
| `@k0d3r/specloop` | 0.1.1 | Claude Code 向け spec-driven framework。bin は `specloop` | `https://www.npmjs.com/package/@k0d3r/specloop`、`https://github.com/schussler/specloop` |
| `@khangtoh/specloop` | 0.9.0 | Spec-driven loop engineering。bin は `specloop` | `https://www.npmjs.com/package/@khangtoh/specloop`、`https://github.com/khangtoh/specloop` |
| `@sergetouvoly/specloop` | 0.4.0 | spec-driven workflow。bin は `specloop` | `https://www.npmjs.com/package/@sergetouvoly/specloop` |
| `@prodipdatta7/specloop` | 0.1.0 | Spec-driven development with independent agent review。bin は `specloop` | `https://www.npmjs.com/package/@prodipdatta7/specloop`、`https://github.com/prodipdatta7/spec-loop` |
| `@kerryu/specloop` | 0.4.1 | AI 協働向け CLI。bin に `specloop` | `https://www.npmjs.com/package/@kerryu/specloop` |
| `specloop-ralph` | 0.8.1 | OpenSpec planning for Claude Code。bin は `specloop` | `https://www.npmjs.com/package/specloop-ralph`、`https://github.com/felipeblini/specloop` |

npm ユーザー `shuji-bonji` は、`https://registry.npmjs.org/-/user/shuji-bonji` が 404 だった（スコープ作成はこれから）。

#### PyPI

`https://pypi.org/pypi/specloop/json`、`spec-loop`、`spec_loop`、`specloop-cli` はいずれも HTTP 404。`https://pypi.org/simple/specloop/` も 404。Python パッケージ名としての正確一致は見つからなかった。

#### crates.io

`https://crates.io/api/v1/crates/specloop` と `spec-loop` は 404。検索 `q=specloop` では次の 7 件（いずれも 0.1.0、リポジトリ `https://github.com/Andersonlimahw/spec-loop`、説明は "Spec-driven QA loops for AI-native teams"）: `specloop-schemas`、`specloop-safety`、`specloop-config`、`specloop-reporter`、`specloop-templates`、`specloop-core`、`specloop-cli`。当該リポジトリの README は `cargo install` でコマンド `specloop` を入れると案内している（`https://github.com/Andersonlimahw/spec-loop`）。

#### GitHub

`https://api.github.com/users/specloop` と `users/spec-loop` は 404（同名の user / org はなし）。ログイン検索では `specloop-bot`、`specloops-org`、`specloops` が見つかった。

`specloop in:name` のリポジトリ検索は **24 件**（本リポジトリの当時の名前 `https://github.com/shuji-bonji/specloop` を含む。現在は `shuji-bonji/mutualspec`）。仕様駆動・AI 開発に近い例:

- `https://github.com/satyaborg/specloop` — Spec-driven development on autopilot with Claude Code
- `https://github.com/alexpineda/specloop` — o1 pro spec + app builder
- `https://github.com/khangtoh/specloop` — Spec-driven loop engineering
- `https://github.com/ba3a/specloop` — plan → implement → review loop for Claude Code
- `https://github.com/FabricatiDiem/SpecLoop` — higher-level loop for agentic SDLC using SpecKit
- `https://github.com/KVTaniguchi/specloop` — iOS app の spec / code / tests を同期
- `https://github.com/greenteasamurai/specLoop` — looping framework requiring dev specs
- `https://github.com/AMSSwanglab/SpecLoop` — 2023 年、細胞種特異的クロマチンループ予測（生物情報。領域は異なる）

`spec-loop in:name` は **176 件**（部分一致を含む）。近い例: `https://github.com/Andersonlimahw/spec-loop`、`https://github.com/ng-galien/spec-loop`、`https://github.com/prodipdatta7/spec-loop`。

#### ドメイン（RDAP と HTTP。whois コマンドは環境に無く未使用）

時刻は RDAP の UTC を Asia/Tokyo（UTC+9）に換算して書く。

| ドメイン | 登録（RDAP） | HTTP | 内容 |
|---|---|---|---|
| `specloop.dev` | 登録 2026-01-06 08:52 JST、満了 2027-01-06 08:52 JST。レジストラ Cloudflare, Inc。NS は Cloudflare | `https://specloop.dev/` は 200。「specloop — human-expert guidance for AI coding agents」。`@specloop/cli` の homepage と一致 | 他者の製品サイト。スキーマ `$id` に使ってはならない |
| `specloop.ai` | 登録 2025-11-17 09:29 JST、満了 2027-11-17 09:29 JST。レジストラ Cloudflare, Inc | `https://specloop.ai/` は 200。商用 SaaS「Update your website or app in minutes」。仕様からビルドし、ホスティング・変更依頼ポータルを提供（例: サイトあたり月 99 USD と表示） | 商用ブランド |
| `specloop.io` | 登録 2026-05-29 17:23 JST、満了 2027-05-29 17:23 JST。レジストラ IONOS SE（IANA 83）。登録組織名 Social2Wifi Technology S.L.（RDAP） | `https://www.specloop.io/en/` は 200。商用「SpecLoop \| From requirement to code. Without friction。」要件→技術仕様→コード→テストのトレーサビリティを謳う SaaS | 上記 `.ai` とは別の商用製品に見える |
| `specloop.com` | 登録 2026-03-28 03:01 JST、満了 2027-03-28 03:01 JST。レジストラ DropCatch.com 1010 LLC。NS は NameBright | `https://specloop.com/` は `https://www.hugedomains.com/domain_profile.cfm?d=specloop.com` へ 302。販売中と推定（HugeDomains のプロフィール。本体は Cloudflare の challenge で 403 になり、販売ページの本文までは確認できず） | 取得済み・転売目的と推定 |
| `specloop.app` | 登録 2026-04-04 16:25 JST、満了 2027-04-04 16:25 JST。レジストラ Name.com, Inc。NS は Vercel | `https://specloop.app/` は 404（Vercel `DEPLOYMENT_NOT_FOUND`） | ドメインは登録済み、デプロイなし |
| `specloop.org` | `https://rdap.publicinterestregistry.org/rdap/domain/specloop.org` はオブジェクトなし（未登録と読める）。HTTPS は TLS エラーでページ未取得 | 未確認 | 登録の有無は RDAP 上「なし」。HTTP は確認できず |

#### ウェブ上の製品・企業

- `https://specloop.ai/` および `/platform`、`/pricing`、`/agencies` — 仕様からサイト / アプリを構築・運用する商用プラットフォーム。
- `https://www.specloop.io/en/` — 要件から仕様・コード・テストを生成する商用プラットフォーム（登録組織 Social2Wifi Technology S.L.）。
- `https://specloop.dev/` — AI コーディングエージェント向けの人間エキスパート案内。npm `@specloop/cli` と対応。

#### 商標（USPTO / EUIPO / J-PlatPat）

公式レジストリでの登録の有無は**検証できていない**。試みたが、次の理由で結果を確定できなかった。

- USPTO: 検索 UI（`https://tmsearch.uspto.gov/`）はある。公開 API（`https://api.uspto.gov/api/v1/trademark/trademarks/search`）は認証が必要で 403。「SPECLOOP」のシリアル番号・登録番号を示す公開ページは、ウェブ検索では見つからなかった。
- EUIPO / TMview: `https://www.tmdn.org/tmview/` 系の検索・API はリクエスト拒否または TLS エラー。
- J-PlatPat: `https://www.j-platpat.inpit.go.jp/` の検索結果は取得していない。ウェブ検索でも日本語「スペックループ」や SpecLoop の登録情報は見つからなかった。

したがって「登録がない」とは言えない。商用利用が確認できた以上、コモンローや不正競争の論点は残る。商標のクリアランスは弁理士への確認が必要。

### 1.2 改名後の名前の確認（MutualSpec、2026-11-19 05:51 JST）

43 個の候補を §1.1 と同じ方法で調べ、衝突の少ない 8 案（MutualSpec、GyreSpec、LexiSpec、GlosSpec、DomainSpecs、CircSpec、HelixSpec、OrbiSpec）から利用者が MutualSpec を選んだ。採用後に次を再確認した。

| 対象 | 結果 | 出典 |
|---|---|---|
| npm `mutualspec` | E404（未公開） | `npm view mutualspec`、`https://registry.npmjs.org/mutualspec` |
| npm 検索 `mutualspec` | 0 件。bin `mutualspec` を持つ既存パッケージなし | `https://registry.npmjs.org/-/v1/search?text=mutualspec` |
| npm `mutual-spec`、`mutualspec-cli`、`@mutualspec/cli`、`@shuji-bonji/mutualspec-core` | いずれも E404 | `npm view` |
| npm `mspec`（短い別名の候補） | **既存**。bin `mspec` を持つ | `https://www.npmjs.com/package/mspec`。別名は設けない |
| PyPI `mutualspec` | 404 | `https://pypi.org/pypi/mutualspec/json` |
| GitHub user / org `mutualspec` | 404 | `https://api.github.com/users/mutualspec` |
| 商標（USPTO / EUIPO / J-PlatPat） | **未確認**。§1.1 と同じ理由で公式データベースを検索できていない | — |

## 1.3 解決済みの問い

| ID | 問い | 結論 | 解決日 |
|---|---|---|---|
| Q-08 | パッケージ名・CLI 名・スキーマ `$id` のドメイン（SpecLoop の名前衝突） | **フレームワーク名を MutualSpec に変更**（[ADR-0015](adr/0015-rename-to-mutualspec.md)）。npm は `mutualspec`（CLI、bin `mutualspec`）と `@shuji-bonji/mutualspec-*`（ライブラリ）。短い別名 `mspec` は既存 npm パッケージと衝突するため設けない。`$id` は `https://shuji-bonji.github.io/mutualspec/schemas/0.1/…`（リポジトリの GitHub Pages）。概念名 Specs of Domain Loops は維持。リポジトリも `shuji-bonji/mutualspec` に改名済み（旧 URL は GitHub がリダイレクト）。商標は未確認（R-08）。調査は §1.1・§1.2 | 2026-11-19 |
| Q-01 | 会話中の「XML（**XDL** や S1000D）」の **XDL** は何を指すか | **XSD（XML Schema Definition）の誤記**。別の XML 語彙ではなかった。会話では機械可読な構造として JSON / YAML / XML Schema が挙げられており、本設計の正本は JSON Schema と YAML、S1000D プロファイル側で XML / XSD を扱う。XDL を理由にした 2 つ目のプロファイルは追加しない。[00](00-origin.md) §4 | 2026-11-19 |

## 2. リスク

| ID | リスク | 影響 | 対策 |
|---|---|---|---|
| R-01 | **書く量が増えて使われない**（YAML ブロック・ID・トレースの負担） | 高 | テンプレート・`new`・`id next`・LLM の起草（Proposal）で負担を下げる。最小構成（charter + glossary + requirements）から始められるようにし、意味モデル層は必要な所だけに使う |
| R-02 | **ルールが厳しすぎて回らない**（誤検出で信頼を失う） | 高 | severity の段階（draft では warning）、`rules explain`、上書きの理由記録。誤検出の報告を FB として扱いコアルールを改善 |
| R-03 | 日本語の語彙検査の誤検出・見逃し | 中 | 最長一致マスキング、`match: word / regex`、将来は形態素解析（Q-05） |
| R-04 | LLM が出力契約を守らない・範囲外を推測で埋める | 中 | スキーマ検証、`inScope`、内側ループの上限、評価指標の計測 |
| R-05 | 生成ビューと正本の乖離 | 低 | `render --check` を CI 必須に |
| R-06 | S1000D 仕様・スキーマの再配布制限 | 中 | 同梱しない。利用者が入手してパスを設定（s1000d-stack と同じ方針） |
| R-07 | S1000D の Issue 差（4.2 / 5.0 / 6 / 7） | 中 | 書き出しは Issue ごとのアダプタ。最初は Issue 7（s1000d-stack が前提にしている版）を対象にし、実例の多い 4 系は後から。4 系を s1000d-core で検証できるかは M6 で確かめ、できなければ 4 系は s1kd-tools を使う |
| R-08 | 名前の衝突。旧称 SpecLoop は高リスク（商用 SaaS・npm スコープ `@specloop`・CLI バイナリ `specloop`・多数の GitHub リポジトリ）だったため MutualSpec に改名した。残るのは、MutualSpec の商標が未確認であること、npm 名を公開前に他者に取られうること、旧称 SpecLoop で書かれた外部の言及（会話・旧 URL）との混同 | **低〜中**（改名前は高） | 公開・配布の前に商標を弁理士に確認する。公開準備ができたら npm `mutualspec` を最初に公開して確保する。README と ADR-0015 に旧称を明記。リポジトリは `mutualspec` に改名済み。今後さらに改名する場合は `$id` の移行手順（ADR-0015）に従う |
| R-09 | 「判定はツール」の原則が、ツールのバグで誤った安心感を生む | 中 | ルールごとのテスト（正例・負例）、参照チェッカーとの照合、ゲートの人の承認を外さない |
| R-10 | ID の採番衝突（並行ブランチ） | 低 | CI の一意性検査。採番はブランチ接頭辞付きの一時 ID → マージ時に確定、も選択肢 |

## 3. この設計で置いた仮定（見直してよい点）

| ID | 仮定 | 根拠 | 見直すなら |
|---|---|---|---|
| A-01 | 正本は「1 ファイルに YAML front matter + 型付き YAML ブロック + Markdown 本文」 | 会話で未決だった「どれを正とするか」を、同期コストが最小になる形で決めた | 純 YAML（Markdown は生成）にする案、Markdown の見出し構造から抽出する案（[ADR-0003](adr/0003-single-source-module.md) の却下案） |
| A-02 | 実装の本体は TypeScript / Node.js。必要なら一部の役割だけを後から別言語へ置き換える | [ADR-0011](adr/0011-implementation-stack.md) で Accepted。ガードレールは、スキーマ／ルールをファイルから読むこと、サンプルのエラー件数と SARIF をゴールデンにすること、CLI コマンドと終了コードを [08](08-cli.md) で固定すること | 検証エンジンや大規模グラフ処理などを Go / Rust / Python に切り出す。全面置換は前提にしない |
| A-03 | ルールのパス言語は JSONPath（XPath ではない） | 対象が XML ではなく Spec Graph（JSON）だから | S1000D 利用者向けに XPath 風の別名を用意する案 |
| A-04 | 開発体制は 1 人〜少人数 | ロードマップの目安 | — |
| A-05 | 種別コード: 022 = rules、040 = description は S1000D に合わせ、他は独自 | BREX = 022 の対応が直感的 | すべて独自にする / より多くを S1000D に合わせる |
| A-06 | G1 と G4 の人の承認は外せない | 会話第 5 回「終了条件を人が確認するか」に対し、相互理解の最終責任を人に置いた | 低リスクのコンテキストで G1 を自動化する例外規定 |
| A-07 | サンプルドメインは架空の小型 UAV 整備（S1000D の手順 DM に馴染む題材） | 利用者の背景（S1000D / IETM） | 実プロジェクトの題材に差し替え |
| A-08 | 「Loop Engineering」は確立した規格名ではないとして、会話での定義を採用 | — | 参照すべき特定の文献・手法があれば合わせる |
