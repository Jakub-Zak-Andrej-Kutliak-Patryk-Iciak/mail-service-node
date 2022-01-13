FROM node:14.18-alpine as base
WORKDIR /src
#COPY package*.json ./
COPY package.json ./
COPY yarn.lock ./

FROM base as production
ENV NODE_ENV=production
#RUN npm ci
RUN yarn install --frozen-lockfile
COPY ./*.js ./
COPY ./.env ./
CMD ["node", "consumer.js"]

FROM base as dev
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

ENV NODE_ENV=development
#RUN npm install
RUN yarn install
COPY ./*.js ./
COPY ./.env ./
CMD ["node", "consumer.js"]