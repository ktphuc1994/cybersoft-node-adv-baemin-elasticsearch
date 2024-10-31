FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build food

CMD [ "node", "dist/apps/food/main" ]

# docker build . --file apps/food/Dockerfile -t baemin-backend-food-nestjs-img
# docker run -d -p 8080:8080 --name baemin-backend-food-nestjs-container --network node_network baemin-backend-food-nestjs-img