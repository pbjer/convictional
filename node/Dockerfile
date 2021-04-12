# Install with dev dependencies and run checks.
FROM node:14.16.1-alpine3.12
RUN mkdir -p /usr/src/node \
    && chown -R node:node /usr/src/node
WORKDIR /usr/src/node
COPY package*.json ./
USER node
RUN npm ci
COPY --chown=node:node . .
RUN npx prettier --check ./src
RUN npx jest

# Install and build for production.
FROM node:14.16.1-alpine3.12
ENV NODE_ENV=production
RUN mkdir -p /usr/src/node \
    && chown -R node:node /usr/src/node
WORKDIR /usr/src/node
COPY --from=0 /usr/src/node package*.json ./
USER node
RUN npm ci --only=production
COPY --from=0 --chown=node:node /usr/src/node/src ./src
CMD ["node", "src/app.js"]