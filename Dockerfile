FROM php:7.3-fpm

WORKDIR /var/www/html/

RUN docker-php-ext-install -j$(nproc) mysqli &&\
    docker-php-ext-install -j$(nproc) pdo &&\
    docker-php-ext-install -j$(nproc) pdo_mysql && \
    apt-get update && apt-get install -y zip unzip git libmcrypt-dev &&\
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add user for laravel application
RUN groupadd -g 999 www
RUN useradd -u 999 -ms /bin/bash -g www www

# Copy existing application directory contents
COPY . /var/www/html/

# Copy existing application directory permissions
COPY --chown=www:www . /var/www/html/

COPY /docker/start.sh /start.sh
RUN chmod u+x /start.sh && chown www:www /start.sh

# Change current user to www
USER www

RUN cd /var/www/html/ && composer install --verbose --no-dev --optimize-autoloader

ENTRYPOINT [ "/start.sh", "docker-php-entrypoint" ]
CMD ["php-fpm"]