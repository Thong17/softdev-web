FROM node:14-alpine

WORKDIR /app

# Build arg
ARG ENV_FILE=.env.production

COPY package.json .
COPY package-lock.json .

RUN npm install

RUN npm i -g serve

COPY . .

# Replace .env with selected env file
COPY ${ENV_FILE} .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]