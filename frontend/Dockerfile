FROM nginx

WORKDIR /app

COPY default.conf.template /etc/nginx/templates/

# Copy application source
RUN mkdir /app/static
RUN mkdir /app/static/RINmaker
RUN mkdir /app/static/XRmol
RUN chown -R www-data:www-data /app/static

COPY RINmaker /app/static/RINmaker/
COPY XRmol /app/static/XRmol/
COPY ./env.js /app/static/
