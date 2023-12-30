FROM node:20-slim

WORKDIR /app
COPY . .

RUN npm install -g npm
RUN npm ci
RUN npm run build

ENV APP_HOST=0.0.0.0

EXPOSE 3000

CMD [ "npm", "start" ]
