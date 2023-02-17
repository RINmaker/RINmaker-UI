FROM node:16
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
EXPOSE 8001
CMD ["npm", "start"]
