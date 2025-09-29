# ベースイメージとしてPHP 8.2のFPM版を使用
FROM php:8.2-fpm

# 必要なPHP拡張機能をインストール
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo_mysql zip

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Nginxをインストール
RUN apt-get install -y nginx

# Nginxの設定ファイルをコピー
COPY .docker/nginx.conf /etc/nginx/sites-available/default

# アプリケーションのソースコードをコピー
WORKDIR /var/www/html
COPY . .

# Composerの依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# ファイルの所有権とパーミッションを設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# エントリーポイントスクリプトをコピーして実行権限を付与
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# ポート8080を公開
EXPOSE 8080

# コンテナ起動時に実行するコマンド
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]