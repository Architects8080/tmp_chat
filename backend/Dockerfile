FROM node:lts-alpine3.13
WORKDIR /usr/src/backend

COPY . .
RUN npm install
RUN npm run build
CMD npm run start