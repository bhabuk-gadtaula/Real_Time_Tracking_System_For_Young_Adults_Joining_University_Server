FROM node:20-bullseye-slim AS base

# Install required dependecies
FROM base as dependencies
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

# Build Application
FROM base AS builder
ENV PORT = 3001
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build



# Application runner
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE $PORT
CMD ["node", "dist/server.js"]

