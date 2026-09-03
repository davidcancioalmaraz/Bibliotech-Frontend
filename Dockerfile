# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.20.0

FROM node:${NODE_VERSION}-alpine AS dependencies

ARG PM2_VERSION=7.0.4

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npm install --global --prefix /opt/pm2 "pm2@${PM2_VERSION}"

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001 \
    HOSTNAME=0.0.0.0 \
    PM2_HOME=/home/node/.pm2 \
    PATH=/opt/pm2/bin:${PATH}

COPY --from=dependencies /opt/pm2 /opt/pm2
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3001

CMD ["pm2-runtime", "server.js", "--name", "bibliotech-frontend"]
