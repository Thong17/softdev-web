FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm uninstall react-hook-form

RUN npm install react-hook-form@7.30.0

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
