FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM deps AS development
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app
USER node
CMD ["npx", "tsx", "watch", "src/main.ts"]

FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY uploads/default-cover.png ./uploads/default-cover.png
RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
