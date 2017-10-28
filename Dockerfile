FROM node:8.8.1-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
RUN npm install --quiet

COPY . .