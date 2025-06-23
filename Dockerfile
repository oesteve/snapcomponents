FROM alpine:edge AS base

# Add community repository first
RUN echo "@community http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories


RUN apk --no-cache --update \
        add apache2 \
        apache2-ssl \
        curl \
        php84-apache2 \
        php84-bcmath \
        php84-bz2 \
        php84-calendar \
        php84-common \
        php84-ctype \
        php84-curl \
        php84-dom \
        php84-gd \
        php84-iconv \
        php84-mbstring \
        php84-mysqli \
        php84-mysqlnd \
        php84-openssl \
        php84-pdo_mysql \
        php84-pdo_pgsql \
        php84-pdo_sqlite \
        php84-phar \
        php84-session \
        php84-xml \
        php84-xmlreader \
        php84-xmlwriter \
        php84-simplexml \
        php84-tokenizer \
        php84-intl \
        php84-xdebug \
        php84-fileinfo \
        php84-pecl-imagick \
        php84-opcache \
        php84-pecl-apcu \
        php84-zip \
        nodejs \
        ghostscript \
        poppler-utils \
        npm
# Add php alias
RUN ln -s /usr/bin/php84 /usr/bin/php

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

EXPOSE 80 443

ADD docker/docker-entrypoint /

ENTRYPOINT ["/docker-entrypoint"]

WORKDIR /htdocs

ENV PHP_IDE_CONFIG='serverName=app'

FROM base

RUN mkdir -p /htdocs && \
    chown -Rf apache:apache /htdocs && \
    mkdir -p /var/www/.npm && \
    chown -Rf apache:apache /var/www/.npm

USER apache

# Install composer dependencies
ADD --chown=apache:apache composer.json composer.lock /htdocs/
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Install npm dependencies
ADD --chown=apache:apache package.json package-lock.json /htdocs/
RUN npm ci

# Add the rest of the files
ADD --chown=apache:apache src /htdocs

# Build the assets
RUN composer dump-autoload --optimize && \
    APP_ENV=prod composer run build

HEALTHCHECK CMD wget -q --no-cache --spider localhost

ENV APP_ENV=prod

# Switch back to root
USER root
