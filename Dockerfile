# Dockerfile
FROM php:8.2-apache

# Cài extension mysqli để kết nối MySQL
RUN docker-php-ext-install mysqli

# Copy toàn bộ mã nguồn vào web server của Apache
COPY . /var/www/html/

# Mở cổng 80
EXPOSE 80