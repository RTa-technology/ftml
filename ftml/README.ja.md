## ftml

<p>
  <a href="https://github.com/scpwiki/wikijump/actions?query=workflow%3A%22%5Bftml%5D+Rust%22">
    <img src="https://github.com/scpwiki/wikijump/workflows/%5Bftml%5D%20Rust/badge.svg"
         alt="ビルド状態">
  </a>

  <a href="https://docs.rs/ftml">
    <img src="https://docs.rs/ftml/badge.svg"
         alt="docs.rsのリンク">
  </a>
</p>

### Foundation Text Markup Language

(別名、ftml: マークアップ言語)

Wikidotテキスト("Wikitext")を抽象構文木(AST)に変換するRustのライブラリです。これは、Wikidotの[Text\_Wiki](https://github.com/gabrys/wikidot/tree/master/lib/Text_Wiki/Text)の代わりを目指しています。このバージョンは、一般的なWikidot、特によく形成されていない構造のほとんど完全な互換性のあるパーサを持つことを目指しています。目標は、レクサジェネレータを利用し、カスタムパーサでトークンを消費して、緩いアプローチで通常のケースを処理することです。

Rustの速度と安全性の利点を提供するだけでなく、これによりメンテナンスが向上し、消費者にASTを公開することで、より高度な分析と変換が可能になります。

`#![forbid(unsafe_code)]`というlintが設定されているため、このクレートは安全なコードのみを持っています。ただし、依存関係には`unsafe`な内部があるかもしれません。

GNU Affero General Public Licenseの条件の下で利用できます。[LICENSE.md](LICENSE.md)を参照してください。

### コンパイル

このライブラリは最新の安定したRustをターゲットとしています。執筆時点でそれは`1.72.0`です。

```sh
$ cargo build --release
```

`Cargo.toml`に以下を追加することで、このライブラリを依存関係として使用できます：

```toml
ftml = "1"
```

このライブラリには2つの機能があります：
* `html` (デフォルトで有効) &mdash; これにより、クレートにHTMLレンダラが含まれます。
* `mathml` (デフォルトで有効) &mdash; これにより`latex2mathml`が含まれ、LaTeXをHTMLにレンダリングされるMathMLにコンパイルするために使用されます。

機能を無効にするには、機能を持たない状態でビルドします：

```
$ cargo check --no-default-features
```

ftmlのWebAssemblyターゲットをビルドする場合は、`wasm-pack`を使用します：

```
$ wasm-pack build -- --no-default-features
```

これにより最終的なWASMが最適化されますが、時間がかかることがあります。開発中でビルドが成功するだけに興味がある場合は、代わりに次のように使用する必要があります：

```
$ wasm-pack build --dev
```

何らかの理由で`cargo check`を呼び出したい場合は、`cargo check --target wasm32-unknown-unknown`を呼び出します。

### テスト

```sh
$ cargo test
```

テストの出力を表示したい場合は、`-- --nocapture`を末尾に追加します。また、`log`互換のロガーを公開することでログを検査することもできます。

### 哲学

[`Philosophy.md`](docs/Philosophy.md)を参照してください。

### スタイリング

CSSクラスは一貫して命名され、ケバブケースのみで、プレフィックスとともに命名されます：

* `wj-`プレフィックスを持つクラスは、自動的に生成されるものであり、ユーザーが直接使用することを意図していません。例としては`wj-collapsible-block`があります。
* `wiki-`プレフィックスを持つクラスは"premade"クラスです。これらは必ずしも自動的に生成されるわけではありませんが、ユーザーが標準のスタイリングを使用したい場合に直接使用することを意図しています。例としては`wiki-note`があります。

### 名称

"Foundation Text Markup Language" (ftml)は、宇宙内のSCP Foundationのフォーマットを表すファイル拡張子として名前が挙げられている[Kate McTiriss's Proposal](https://scpwiki.com/kate-mctiriss-s-proposal)にちなんで名付けられています。頭字語の拡張形式は明示的に述べられていませんが、HTMLとの名前の類似性を考慮すると、それは明らかに暗示されています。

ftmlは、「良好に形成された」とみなされるWikidotテキストのサブセットと互換性を持つことを目的としています。Wikidotの一般的な構文のドキュメントがここで関連してくるでしょうが、奇妙な構造や奇妙な機能はそうではないかもしれません。開発過程では、それらは分析され、明示的に実装されていないか、より理にかなった構文を通じて実装されます。さらに、Wikidotに存在しないいくつかの新しい機能やブロック、例えばチェックボックスなどをサポートし、折りたたみがネストされるようなバグも修正します。

ftmlがwikitextの独自のブランチに発展するにつれて、このページではWikidotとは別に構文をドキュメント化することを目的として、Wikidotのドキュメントを完全に廃止することを目指します。

- [`Blocks.md`](docs/Blocks.md) -- ftmlで利用可能なブロック（例えば`[[div]]`）と、それらが取るオプションについて。

Wikidotとは異なる、後方互換性のない方法で実装されるいくつかのあまり使用されないまたは問題のある機能もあります。例として：

* `[[include]]`は`[[include-messy]]`（レガシービヘイビア）と`[[include-elements]]`（独立した要素の挿入）に分かれています。
* Interwikiリンクは、三重ブラケットリンクで`!`を接頭辞として実装されています。したがって、`[[[!wp:Amazon.com | Amazon]]]`の代わりに`[wp:Amazon.com Amazon]`となります。

### 使用法

主にエクスポートされる関数がいくつかあり、これはwikitextプロセスの主要なステップに対応しています。

最初に`include`があり、これはすべての`[[include]]`ブロックを置換ページコンテンツで代替します。これは、使用されたすべてのページの名前とともに、置換されたwikitextを新しい文字列として返します。ページの取得と欠落しているページメッセージの生成のプロセスを処理する`Includer`を実装するオブジェクトが必要です。

次に`preprocess`があり、これはWikidotのさまざまなマイナーテキスト置換を実行します。

次に`tokenize`があり、入力文字列を取り、ラッパータイプを返します。これは、`parse`の入力として使用される`Vec<ExtractedToken<'t>>`に`.into()`される場合があります。

そして、述べられたトークンのスライスを借りて、`parse`はそれらを消費し、パースされたwikitextの完全な構造を表す`SyntaxTree`を生成します。

最後に、構文ツリーを持って、その時に必要な`Render`インスタンスで`render`します。最も可能性が高いのは`HtmlRender`です。記事の内容の検索や「プリンター対応」の表示のようなテキストのみの場合は、`TextRender`もあります。


```rust
fn include<'t, I, E>(
    input: &'t str,
    includer: I,
    settings: &WikitextSettings,
) -> Result<(String, Vec<PageRef<'t>>), E>
where
    I: Includer<'t, Error = E>;

fn preprocess(
    text: &mut String,
);

fn tokenize<'t>(
    text: &'t str,
) -> Tokenization<'t>;

fn parse<'r, 't>(
    tokenization: &'r Tokenization<'t>,
) -> ParseResult<SyntaxTree<'t>>;

trait Render {
    type Output;

    fn render(
        &self,
        info: &PageInfo,
        tree: &SyntaxTree,
    ) -> Self::Output;
}
```

パースを実行する場合、まず`preprocess()`を実行し、その後で完全に展開されたテキスト上で`parse()`を実行する必要があります。

生成されるアーティファクトのライフタイムを考慮して、`struct`に結果を保存したい場合があります。


```rust
// Get an `Includer`.
//
// See trait documentation for what this requires, but
// essentially it is some abstract handle that gets the
// contents of a page to be included.
//
// Two sample includers you could try are `NullIncluder`
// and `DebugIncluder`.
let includer = MyIncluderImpl::new();

// Get our source text
let mut input = "**some** test <<string?>>";

// Substitute page inclusions
let (mut text, included_pages) = ftml::include(input, includer, &settings);

// Perform preprocess substitutions
ftml::preprocess(&log, &mut text);

// Generate token from input text
let tokens = ftml::tokenize(&text);

// Parse the token list to produce an AST.
//
// Note that this produces a `ParseResult<SyntaxTree>`, which records the
// parsing warnings in addition to the final result.
let result = ftml::parse(&tokens, &page_info, &settings);

// Here we extract the tree separately from the warning list.
//
// Now we have the final AST, as well as all the issues that
// occurred during the parsing process.
let (tree, warnings) = result.into();

// Finally, we render with our renderer. Generally this is `HtmlRender`,
// but you could have a custom implementation here too.
//
// You must provide a `PageInfo` struct, which describes the page being rendered.
// You must also provide a handle to provide various remote sources, such as
// module content, but this is not stabilized yet.
let html_output = HtmlRender.render(&tree, &page_info, &settings);
```

### JSON シリアライゼーション

[`Serialization.md`](docs/Serialization.md)を参照してください。
