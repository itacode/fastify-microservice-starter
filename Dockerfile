FROM node:16-slim

WORKDIR /app
COPY . .

RUN npm install -g npm
RUN npm ci
RUN npm run build

ENV APP_ADDRESS=0.0.0

EXPOSE 3000

CMD [ "npm", "start" ]
