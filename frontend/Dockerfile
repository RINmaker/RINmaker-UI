FROM php:7-apache

COPY 000-apache.conf /etc/apache2/sites-available/000-apache.conf
COPY start-apache /usr/local/bin
RUN a2enmod rewrite

# Copy application source
RUN mkdir /var/www/RINmaker
RUN mkdir /var/www/XRmol

COPY RINmaker /var/www/RINmaker/
COPY XRmol /var/www/XRmol/
COPY ./env.js /var/www/

RUN chown -R www-data:www-data /var/www

# CMD ["apache2-foreground"]
CMD ["start-apache"]
