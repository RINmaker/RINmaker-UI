FROM node:19 as builder
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
CMD ["npm", "run", "start_prod"]
