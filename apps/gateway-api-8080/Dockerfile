FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build gateway-api-8080

CMD [ "node", "dist/apps/gateway-api-8080/main" ]

# docker build . --file apps/gateway-api-8080/Dockerfile -t baemin-backend-gateway-nestjs-img
# docker run -d -p 8080:8080 --name baemin-backend-gateway-nestjs-container --network node_network baemin-backend-gateway-nestjs-img