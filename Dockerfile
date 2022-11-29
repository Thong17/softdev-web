FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm i -g serve

EXPOSE 3000

CMD [ "npm", "run", "serve"]
