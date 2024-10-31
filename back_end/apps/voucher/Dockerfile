FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build voucher

CMD [ "node", "dist/apps/voucher/main" ]

# docker build . --file apps/voucher/Dockerfile -t baemin-backend-voucher-nestjs-img
# docker run -d --name baemin-backend-voucher-nestjs-container --network node_network baemin-backend-voucher-nestjs-img