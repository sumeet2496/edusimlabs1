FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY dev-proxy.js ./

EXPOSE 8080

CMD ["node", "dev-proxy.js"]