FROM node:19 as builder
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
WORKDIR '/app'
COPY --from=builder /app/build /app
RUN chown -R www-data:www-data /app
COPY default.conf.template /etc/nginx/templates/
