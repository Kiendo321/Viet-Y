FROM node:22-bookworm-slim AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund
COPY . .
RUN npm run lint && npm test && npm run build && node scripts/smoke-production.mjs && npm prune --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=build /workspace/package.json ./
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/server.js ./server.js
COPY --from=build /workspace/dist ./dist
COPY --from=build /workspace/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
