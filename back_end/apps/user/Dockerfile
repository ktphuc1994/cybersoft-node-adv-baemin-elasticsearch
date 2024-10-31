FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./libs/shared/src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build user

CMD [ "node", "dist/apps/user/main" ]

# docker build . --file apps/user/Dockerfile -t baemin-backend-user-nestjs-img
# docker run -d --name baemin-backend-user-nestjs-container --network node_network baemin-backend-user-nestjs-img