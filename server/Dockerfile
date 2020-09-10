FROM node:12

WORKDIR /use/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]