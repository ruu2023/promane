# promane

### フォーマット

このリポジトリは backend (Laravel) と frontend (Next.js) を同一リポジトリ管理します。
それぞれコーディング規約と自動整形の仕組みを整備しています。

- PHP: friendsofphp/php-cs-fixer
  - 設定: backend/.php-cs-fixer.php
- JS/TS: Prettier + ESLint
  - 設定: frontend/.prettierrc, frontend/.eslintrc.js
- Husky + lint-staged: コミット時自動整形
- VSCode ワークスペース設定: .vscode/settings.json
- CI: GitHub Actions で push/PR 時にチェック

## 更新履歴

2025-09-30

- v0.0.2 コーディング規約＆自動整形対応

2025-09-30

- v0.0.1 初回コミット
