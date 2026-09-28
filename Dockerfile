# One image for all three processes (topic init, order service, notification
# worker); docker-compose.yml picks which entrypoint each container runs.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY shared ./shared
COPY order-service ./order-service
COPY notification-service ./notification-service
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
