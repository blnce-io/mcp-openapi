ARG UID=node
ARG GID=node
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

RUN addgroup -S "${GID}" && adduser -S "${UID}" -G "${GID}"
RUN chown --recursive $UID:$GID ./
USER ${UID}:${GID}

# Build Prod docker
FROM ${docker_images_registry}/node:${node_version}-alpine${alpine_version} AS production

ARG UID=node
ARG GID=node
ARG BUILD_VERSION

ENV NODE_ENV=production
ENV BUILD_VERSION=${BUILD_VERSION}

RUN addgroup -S "${GID}" && adduser -S "${UID}" -G "${GID}"

WORKDIR /usr/src/app

COPY --from=cache --chown=${UID}:${GID} /usr/src/app/prod_node_modules ./node_modules

COPY --from=development --chown=${UID}:${GID} /usr/src/app/package.json .
COPY --from=development --chown=${UID}:${GID} /usr/src/app/pnpm-lock.yaml .

COPY --from=development --chown=${UID}:${GID} /usr/src/app/dist ./dist

USER ${UID}:${GID}
CMD ["node", "dist/http-server.mjs"]
