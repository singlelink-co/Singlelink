FROM node:16.3.0-slim as BUILD_IMAGE

COPY ./ singlelink/

WORKDIR singlelink

RUN npm i -g typescript && npm i && npm run build

FROM node:16.3.0-slim

WORKDIR singlelink

COPY --from=BUILD_IMAGE /singlelink/.nuxt ./.nuxt
COPY --from=BUILD_IMAGE /singlelink/node_modules ./node_modules
COPY --from=BUILD_IMAGE /singlelink/package.json ./package.json
COPY --from=BUILD_IMAGE /singlelink/nuxt.config.js ./nuxt.config.js

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD npm run start
