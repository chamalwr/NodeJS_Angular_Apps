# Library API - NestJS Implemetation

## Installation

```bash
$ npm install
```

## Before Running (Locally)

Create .env file to the sctructure given below

```bash
# DB Configs
MONGODB_ATLAS_URL="<CONECTION STRING>" #This used as the default connection string
MONGODB_LOCAL_URL=""

# App Configs
PORT=<PORT_NUMBER>

```

## Running the app - Locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the App As a Service

```bash

#Getting docker image from dockerhub
docker pull chamalwr/library-api

#Running
docker run -e PORT=<CONTAINER_PORT> -e MONGODB_ATLAS_URL="DB_URL" -p <HOST_PORT>:<CONTAINER_PORT> -d chamalwr/library-api


```

## License

Nest is [MIT licensed](LICENSE).
