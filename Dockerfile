ARG node_version=22.23.4
ARG alpine_version=3.23
ARG docker_images_registry=docker.io

FROM ${docker_images_registry}/node:22.23.5-alpine3.23@sha256:6868d4695b947ee120bffaa463fecd68cde370d7bfec92955e7c8ac576b4f475 As cache

WORKDIR /usr/src/app

RUN apk upgrade --no-cache

RUN npm install -g pnpm@latest-10

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm --prod install
RUN cp -R node_modules prod_node_modules

FROM ${docker_images_registry}/node:22.23.5-alpine3.23@sha256:6868d4695b947ee120bffaa463fecd68cde370d7bfec92955e7c8ac576b4f475 as development

WORKDIR /usr/src/app

RUN apk upgrade --no-cache

RUN npm install -g pnpm@latest-10

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

COPY . .

RUN pnpm build

RUN chown --recursive node:node ./
USER 1000:1000

# Build Prod docker
FROM ${docker_images_registry}/node:22.23.5-alpine3.23@sha256:6868d4695b947ee120bffaa463fecd68cde370d7bfec92955e7c8ac576b4f475 AS production

ARG BUILD_VERSION

ENV NODE_ENV=production
ENV BUILD_VERSION=${BUILD_VERSION}

WORKDIR /usr/src/app

RUN apk upgrade --no-cache

COPY --from=cache --chown=node:node /usr/src/app/prod_node_modules ./node_modules

COPY --from=development --chown=node:node /usr/src/app/package.json .
COPY --from=development --chown=node:node /usr/src/app/pnpm-lock.yaml .

COPY --from=development --chown=node:node /usr/src/app/dist ./dist

USER 1000:1000
CMD ["node", "dist/http-server.mjs"]
