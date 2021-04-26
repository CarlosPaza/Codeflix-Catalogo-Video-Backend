#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh
cp .env.example .env
chown -R www-data:www-data .
composer install
php artisan key:generate
php artisan migrate

php-fpm
