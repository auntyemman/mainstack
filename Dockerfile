# build
FROM node:20-alpine AS build

WORKDIR /src/app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

# Stage
FROM node:20-alpine

WORKDIR /src/app

COPY --from=build /src/app/dist ./dist
COPY --from=build /src/app/node_modules ./node_modules
COPY --from=build /src/app/package*.json ./
COPY --from=build /src/app/yarn.lock ./
COPY --from=build /src/app/.env ./.env

EXPOSE 5500

CMD ["yarn", "start"]