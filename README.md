# プロジェクト名

このプロジェクトは、Next.js（フロントエンド）とLaravel（バックエンド）を使用したWebアプリケーションです。

## ✨ 機能

*   フロントエンド：Next.jsによるインタラクティブなUI
*   バックエンド：Laravelによる堅牢なAPI
*   その他、プロジェクト固有の機能をここに追加

## 💻 動作環境

### フロントエンド

*   [Node.js](https://nodejs.org/)
*   [Next.js](https://nextjs.org/)

### バックエンド

*   [PHP](https://www.php.net/)
*   [Laravel](https://laravel.com/)
*   [Composer](https://getcomposer.org/)
*   [Docker](https://www.docker.com/)

## 🚀 使い方

### フロントエンド

1.  `frontend` ディレクトリに移動します。
    ```bash
    cd frontend
    ```
2.  依存関係をインストールします。
    ```bash
    npm install
    ```
3.  開発サーバーを起動します。
    ```bash
    npm run dev
    ```
    [http://localhost:3000](http://localhost:3000) で確認できます。

### バックエンド

1.  `backend` ディレクトリに移動します。
    ```bash
    cd backend
    ```
2.  Dockerコンテナをビルドして起動します。
    ```bash
    docker-compose up -d --build
    ```
3.  依存関係をインストールします。
    ```bash
    docker-compose exec app composer install
    ```
4.  `.env.example` をコピーして `.env` ファイルを作成し、設定を更新します。
    ```bash
    docker-compose exec app cp .env.example .env
    ```
5.  アプリケーションキーを生成します。
    ```bash
    docker-compose exec app php artisan key:generate
    ```

## 🤝 貢献

貢献を歓迎します。Issueを作成するか、Pull Requestを送信してください。

## 📄 ライセンス

このプロジェクトは[ライセンス名]の下で公開されています。
