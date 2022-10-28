FROM node:18.12 AS base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --location=global npm
RUN npm install
RUN npm install --location=global rimraf
RUN rm -f package.json


FROM node:18.12-alpine AS prod
RUN npm install --location=global npm
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i --omit=dev
RUN rm -f package**.json


FROM base AS build
COPY . .
RUN npm run build

FROM prod AS library-api-app
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
RUN chown node:node -R /usr/src
USER node
CMD [ "node", "dist/main" ]