FROM node:slim

WORKDIR /app

COPY index.js /app/index.js
COPY  .env /app/.env
ADD /models /app/models
COPY package.json /app/package.json
RUN npm install

COPY routes.js /app/routes.js

EXPOSE 3000

ENTRYPOINT [ "npm","start" ];