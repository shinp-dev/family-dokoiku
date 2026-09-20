# family-dokoiku

吉祥寺〜新宿周辺を中心に、家族で「実際に行きたくなる」期間限定のおでかけ先だけを集めるためのリポジトリです。

網羅型のイベント検索サイトではありません。常設施設や「見るだけ」のイベントを大量に並べず、親子で参加・体験できるもの、または誕生日や記念日に使いやすい家族向けプランを少数精鋭で掲載します。

## 2つのカテゴリ

### こどもと

子どもだけでなく、保護者も一緒に楽しめる単発・期間限定イベント。

工作、科学、料理、職業体験、ゲーム、スポーツ、屋台・縁日、珍しい室内体験、普段できない場所での体験などを中心に掲載します。

### 家族イベント

誕生日、記念日、家族のお祝いなど「少し特別なおでかけ」に使えるもの。

ホテルのランチビュッフェを中心に、大人1人 3,000〜7,000円程度を基本レンジとします。

## データ更新

公開データは `events.json` で管理します。

イベントの調査・選定・JSON更新は、GitHub上の管理画面を別途作るのではなく、ChatGPTとの会話からGitHubを更新する運用を前提とします。

## 仕様

掲載基準、除外条件、JSON項目、料金・滞在時間の定義などは [SPEC.md](./SPEC.md) を参照してください。

## Webサイト

React + TypeScript + Vite の静的SPAは `web/` 以下にあります。イベントデータの正本は引き続きリポジトリ直下の `events.json` です。ブラウザは実行時にGitHubの `main` ブランチからこのJSONを直接取得し、Web側にはイベントデータのコピーを持ちません。

### ローカル起動

Node.js 22を使用します。

```bash
npm --prefix web ci
npm --prefix web run dev
```

品質確認とプロダクションビルド:

```bash
npm --prefix web run lint
npm --prefix web test
npm --prefix web run build
```

### Cloudflare Pages

本番環境はCloudflare PagesのDirect Upload方式で運用します。GitHubとのGit Integrationは使用していないため、WebコードをGitHubへpushしただけではPages上のSPAは更新されません。一方、`events.json` はブラウザがGitHubから直接取得するため、`main` へデータをpushすればPagesの再デプロイなしで表示へ反映されます。

現在のPages URL:

- https://family-dokoiku.pages.dev/

予定しているCustom Domain（未有効化）:

- https://dokoiku.shinp-studio.com/

リポジトリ直下で依存関係を復元してビルドし、生成された `web/dist` をWranglerで手動デプロイします。

```bash
cd D:\dev\family-dokoiku
npm --prefix web ci
npm --prefix web run build
npx wrangler pages deploy web/dist --project-name=family-dokoiku --branch=main
```

コード変更を含む場合は、デプロイ前に `npm --prefix web run lint` と `npm --prefix web run test` も実行します。`events.json` だけの変更ではCloudflare Pagesの再ビルド・再デプロイは不要です。

`web/public/_redirects` にSPA fallbackを設定しているため、`/kodomoto`、`/family`、`/events/:id` を直接開いた場合も `index.html` が返ります。
