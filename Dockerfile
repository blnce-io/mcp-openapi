ARG node_version=22.13.0
ARG alpine_version=3.20
ARG docker_images_registry=docker.io

FROM ${docker_images_registry}/node:${node_version}-alpine${alpine_version} As cache

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest-10

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm --prod install
RUN cp -R node_modules prod_node_modules

FROM ${docker_images_registry}/node:${node_version}-alpine${alpine_version} as development

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest-10

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

COPY . .

RUN pnpm build

RUN addgroup -S node && adduser -S node -G node
RUN chown --recursive node:node ./
USER node:node

# Build Prod docker
FROM ${docker_images_registry}/node:${node_version}-alpine${alpine_version} AS production

ARG BUILD_VERSION

ENV NODE_ENV=production
ENV BUILD_VERSION=${BUILD_VERSION}

RUN addgroup -S node && adduser -S node -G node

WORKDIR /usr/src/app

COPY --from=cache --chown=node:node /usr/src/app/prod_node_modules ./node_modules

COPY --from=development --chown=node:node /usr/src/app/package.json .
COPY --from=development --chown=node:node /usr/src/app/pnpm-lock.yaml .

COPY --from=development --chown=node:node /usr/src/app/dist ./dist

USER node:node
CMD ["node", "dist/http-server.mjs"]
