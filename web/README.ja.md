## Wikijump Web（廃止予定）

このドキュメントは廃止予定であり、最終的に`framerail`に移動される予定です。すべてが移動された後、`web/`ディレクトリは削除されます。

### 関連ドキュメント

- [Docker Compose](https://docs.docker.com/compose/)
- [Laravel](https://laravel.com/docs/8.x/)
- [Blade templates](https://laravel.com/docs/8.x/blade)
- [PNPM](https://pnpm.io/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://github.com/vitest-dev/vitest)

### はじめに

[`development.md`](../docs/development.md) を参照してください。

### 開発

開発用のCLIを実行するには：
```
$ pnpm dev
```

提供できる追加の引数があります：
```
sudo  : `docker-compose`のコマンドを`sudo`で実行します。
build : コンテナをビルドしますが、何も起動しません。
serve : サーバーを起動しますが、Viteは起動しません。
clean : 実行中のサービスをすべてクリーンアップします。
```

`serve`モードやデフォルトモードの場合、スクリプトが実行されている間にいくつかのコマンドを実行できます。利用可能なコマンドを見るには`help`を入力してください。それらはかなり自己説明的です。

### モジュール

モジュールは[`modules`](./modules) フォルダにあります。[`modules.md`](../docs/modules.md) を参照してください。

#### ftmlの更新

[ftml](../ftml/README.md) が更新されると、`ftml-wasm`モジュールにビルドされたアーティファクトをコピーして最新の状態にする必要があります。バージョンが一致していない場合、テストで失敗するようになっています。

以下を使用して、ftml wasmアーティファクトを更新できます：

```
$ cd modules/ftml-wasm
$ pnpm compile
```

### テスト

テストの実行は簡単です：

```
$ pnpm test        # テストを実行
$ pnpm test:watch  # ファイルが変更されるたびにテストを再実行
$ pnpm test:ui     # Vitest UIを開く
$ pnpm cover       # テストを実行し、カバレッジレポートを取得
```

テストはNode上のVitestで実行されます。Viteのファイルインポート機能、たとえばインポートのglob、を積極的に使用することが推奨されます。

コードカバレッジテストの終了時にレポートが出力されます。このカバレッジレポートには、ソースTypeScriptおよびSvelteファイルのみが含まれる必要があります。それらの2つのどちらも含まれていないものについてカバレッジが報告される場合、何かが間違っています。何も報告されない場合も、何かが間違っていることを意味します。

> #### **重要：**
>
> c8コードカバレッジのコメント、例：
>
> ```js
> /* c8 ignore next */
> ```
>
> が必要な場合、単純に使用できません。これはVitestの現在の制限のためです。

### リント、検証

モノレポ全体をリントするには、単純に以下を実行します：

```
$ pnpm lint

または、自動修正を適用したい場合：
$ pnpm lint:fix
```

これにより、ESLint、Prettier、およびStylelintが実行されます。リンターの名前を`lint`（または`lint:fix`）に追加することで、リンターを個別に実行できます。例：`lint:eslint`。

`tsc` (TypeScript) で型チェックを行うには：

```
$ pnpm typecheck
```

リンティングと型チェックを同時に実行し、すべてを並行して行いたい場合は：

```
$ pnpm validate
```

### 依存関係

依存関係が更新が必要かどうかを確認するコマンドを実行できます：
```
$ pnpm taze
```

コマンド名は使用されている依存関係チェックユーティリティの名前である`taze`です。

更新が必要な依存関係を確認した後（それらを更新しても何も壊れないことを確認してください）、各`package.json`に書き込むことができます：
```
$ pnpm taze:write

ロックファイルも更新を忘れないでください：
$ pnpm install
```

これにより、すべての依存関係が最新バージョンに更新されます。

`.tazerc.json`ファイルを使用して、確認および更新から依存関係を除外できます。特に依存関係を固定している場合、これは特に役立ちます。

### コマンド

コマンドは、`nabs.yml`で定義されたNPMスクリプトであり、`pnpm nabs`で`package.json`にコンパイルされます。