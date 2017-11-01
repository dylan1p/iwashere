FROM node:8.8.1-alpine

WORKDIR /usr/app

RUN npm install --quiet

COPY . .