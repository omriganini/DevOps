FROM node:20-alpine
WORKDIR /usr/local/app

COPY package*.json ./
RUN npm cache clean --force && npm install --verbose

COPY . . 
COPY .env ./
EXPOSE 3000

CMD ["node" , "server.js"]
