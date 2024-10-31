FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build cart

CMD [ "node", "dist/apps/cart/main" ]

# docker build . --file apps/cart/Dockerfile -t baemin-backend-cart-nestjs-img
# docker run -d --name baemin-backend-cart-nestjs-container --network node_network baemin-backend-cart-nestjs-img