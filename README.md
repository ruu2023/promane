# Promane | TaskForestApp

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

## 📖 概要

このアプリケーションは、**Next.js 15** (フロントエンド) と **Laravel 11** (バックエンド API) によって構築されたプロジェクト管理ツールです。

フロントエンドは `front` ディレクトリ内の Next.js プロジェクトとして管理されており、バックエンドは API として動作します。

主な機能:

- プロジェクト管理
- タスク管理
- ユーザー管理
- プロジェクトの残り日数にフォーカスした森モード
- プロジェクトから今日やることにフォーカスした木モード

## ✨ 機能

- フロントエンド：Next.js によるインタラクティブな UI
- バックエンド：Laravel による堅牢な API

![プロジェクト作成](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/1.webp)

![タスク作成](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/2.webp)

![木モードへの移動](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/3.webp)

![タスクの完了](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/4.webp)

![森モードへの移動とタスクの完了](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/5.webp)

![alt text](https://pub-fe9124e9c12542c486765d4b468909a4.r2.dev/2025-10/dbschema.webp)

---

## 🛠 技術スタック

### フロントエンド (`front` ディレクトリ)

- React 18
- Next.js 15
- Tailwind CSS
- Node.js & npm

### バックエンド (ルートディレクトリ)

- PHP \>= 8.1
- Laravel 11
- Composer
- MySQL

---

## 🌐 コーディング規約 & フォーマット

### PHP (バックエンド)

- **PHP-CS-Fixer**
- 規約: **PSR-12** (リポジトリ内の `.php-cs-fixer.dist.php` に基づく)
- 適用コマンド (ルートで実行):
      `bash     composer fix     `

### JavaScript / React / CSS (フロントエンド)

- **Prettier**
- 適用コマンド ( `front` ディレクトリで実行):
      `bash     npm run format      # (package.json にスクリプトがある場合)     `

### VSCode 推奨拡張

`.vscode/extensions.json` に定義済みです。
プロジェクト開封時に自動でインストール候補が表示されます。

- **PHP / Laravel**
    - `bmewburn.vscode-intelephense-client` (PHP Intelephense)
    - `shufo.vscode-blade-formatter` (Blade Formatter)
- **CSS**
    - `bradlc.vscode-tailwindcss` (Tailwind CSS IntelliSense)
- **共通**
    - `EditorConfig.EditorConfig` (EditorConfig for VS Code)
    - `esbenp.prettier-vscode` (Prettier - Code formatter)

---

## ⚙️ セットアップ手順

このプロジェクトは、バックエンド (Laravel Sail) とフロントエンド (Next.js) を別々にセットアップし、起動します。

### 1\. リポジトリのクローンと移動

```bash
git clone https://github.com/ruu2023/promane.git
cd promane
```

### フロントエンド

1.  `front` ディレクトリに移動します。
    ```bash
    cd front
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

1.  `back` ディレクトリに移動します。
    ```bash
    cd back
    ```
2.  Docker コンテナをビルドして起動します。
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

---

### 4\. アクセス確認

ブラウザで各サービスにアクセスして動作確認してください。

- **フロントエンド (Next.js)**: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) (Next.js のデフォルト)
- **バックエンド (Laravel)**: [http://localhost](https://www.google.com/search?q=http://localhost) (Sail のデフォルト)

---

## 🧪 テスト (Testing)

バックエンド (Laravel) のテストは、`docker-compose exec` を通じて実行します。
**`back` ディレクトリで実行**してください。

```bash
# 全てのテストを実行 (サービス名: app の場合)
docker-compose exec app php artisan test

# 特定のファイルを実行
# docker-compose exec app php artisan test tests/Feature/YourTest.php
```

---

## 🐳 Docker 操作補足

バックエンド (Laravel API) の操作です。**`back` ディレクトリで実行**してください。

```bash
# 起動 (ビルドなし)
docker-compose up -d

# 停止
docker-compose down

# 再ビルドして起動
docker-compose up -d --build

# ログ確認
docker-compose logs -f app

# Artisan コマンド実行 (サービス名: app の場合)
docker-compose exec app php artisan <command>

# Composer コマンド実行 (サービス名: app の場合)
docker-compose exec app composer <command>
```

---

## 🤝 Contributing

プルリクエストや Issue の報告を歓迎します。
開発に参加する際は、本 README のセットアップ手順およびコーディング規約に従ってください。

---

## 📜 License

This project is licensed under the **MIT License**.
(See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.)

---

## 更新履歴

2025-10-27

v0.9.0 プレビュー公開

2025-09-30

v0.0.2 コーディング規約＆自動整形対応
2025-09-30

v0.0.1 初回コミット
