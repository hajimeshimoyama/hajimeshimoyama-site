# hajimeshimoyama.com

下山肇（Hajime Shimoyama）のアーティスト・ポートフォリオサイト。Astroで構築した静的サイト。

- 公開URL: https://hajimeshimoyama.com/
- ホスティング: XServer（レンタルサーバー、静的ファイル配信）
- ドメイン・DNS・メール: XServer
- ソース管理: GitHub（このリポジトリ）

## 構成

```text
/
├── public/                 静的ファイル（画像・動画・.htaccess・contact-handler.php等）
├── src/
│   ├── content/works/       作品データ（frontmatter + 本文、1作品=1.mdファイル）
│   ├── content.config.ts    作品データのスキーマ定義
│   ├── components/
│   ├── layouts/
│   └── pages/
└── package.json
```

## 開発

```sh
npm install
npm run dev       # ローカル確認 (localhost:4321)
npm run build     # ./dist/ に本番ビルドを生成
```

## 公開の仕組み（Netlifyではない）

このサイトはGitHubへのプッシュでは自動的に公開されない。以下の手順で手動アップロードする。

1. `npm run build` で `dist/` を生成
2. `lftp` 等でXServerのFTPへ `dist/` の中身をアップロード（接続先: `hajimeshimoyama.com/public_html`）
3. 反映を本番サイトで確認

過去にNetlifyでホスティングしていたが、無料枠（ビルド回数の上限）を使い切りサイトが完全停止する障害が発生したため、追加費用のかからないXServerでの静的配信に移行した（2026-08-24）。

### お問い合わせフォーム

`public/contact-handler.php` がフォーム送信を受け取り、PHPの`mail()`で`pio@hajimeshimoyama.com`宛に送信する（Netlify Formsの代替）。

### 旧サイトからのリダイレクト

`public/.htaccess` に、旧Adobe PortfolioのURLから新URLへの301リダイレクトを設定している（各作品の`oldPath`frontmatterから生成）。
