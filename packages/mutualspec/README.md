# mutualspec

> [!WARNING]
> This is a placeholder release. The `mutualspec` CLI is **not implemented yet**; this package contains no executable code.
> この版は名前を確保するための仮公開です。`mutualspec` CLI は**まだ実装されていません**。実行できるコードは入っていません。

MutualSpec is a framework based on the idea of *Specs of Domain Loops*. It makes the boundary of each domain explicit, runs specification, validation and feedback as a loop, and lets people and LLMs share the same structure and vocabulary.

MutualSpec は、Specs of Domain Loops の考え方に基づくフレームワークです。ドメインの境界を明示したうえで、仕様・検証・フィードバックをループとして回し、人と LLM が同じ構造と語彙を共有できるようにします。

## Status / 状態

| | |
|---|---|
| Design | 0.1 (design package: documents, JSON Schemas, default rule set, templates, a worked example) |
| Implementation | Not started |
| This package | `0.0.x` are placeholders. The first usable release will be announced in the repository |

設計文書、JSON Schema、既定ルールセット、テンプレート、サンプルはリポジトリにあります。この npm パッケージは、CLI を実装した時点で同じ名前のまま中身を入れ替えます。

- Repository / リポジトリ: https://github.com/shuji-bonji/mutualspec

## Planned usage / 予定している使い方

```bash
npx mutualspec validate
```

The command above does not work yet. / 上のコマンドはまだ動きません。

## License

MIT
