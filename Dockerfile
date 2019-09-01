FROM php:7.3-fpm

WORKDIR /var/www/html/

RUN docker-php-ext-install -j$(nproc) mysqli
RUN docker-php-ext-install -j$(nproc) pdo 
RUN docker-php-ext-install -j$(nproc) pdo_mysql
RUN apt-get update && apt-get install -y zip unzip git libmcrypt-dev

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY . /var/www/html/
#RUN composer install --verbose --no-dev --optimize-autoloader

COPY /docker/start.sh /var/www/html//start.sh
RUN chmod +x /var/www/html/start.sh

#ENTRYPOINT /var/www/html/start.sh
#CMD ["php-fpm"]