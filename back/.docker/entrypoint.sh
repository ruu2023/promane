#!/bin/sh

# PHP-FPMをバックグラウンドで起動
php-fpm &

# 2秒待機（PHP-FPMの起動を待つ）
sleep 2

# Nginxをフォアグラウンドで起動
nginx -g 'daemon off;'
