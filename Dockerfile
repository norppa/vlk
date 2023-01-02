FROM node:19-alpine

WORKDIR /app

COPY ./server/package*.json .
RUN npm install

COPY ./server/src/ ./src/
COPY ./server/client/ ./client
EXPOSE 3000

CMD ["npm", "start"]