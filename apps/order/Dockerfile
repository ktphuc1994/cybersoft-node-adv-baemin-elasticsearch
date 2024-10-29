FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build order

CMD [ "node", "dist/apps/order/main" ]

# docker build . --file apps/order/Dockerfile -t baemin-backend-order-nestjs-img
# docker run -d --name baemin-backend-order-nestjs-container --network node_network baemin-backend-order-nestjs-img