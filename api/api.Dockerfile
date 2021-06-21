FROM node:16.3.0-slim as BUILD_TS

COPY ./ singlelink/

WORKDIR /singlelink

RUN npm i -g modclean && npm i -g typescript && npm i && npm run build
RUN npm prune --production
RUN modclean

FROM node:16.3.0-slim as FINAL

WORKDIR /singlelink

COPY --from=BUILD_TS /singlelink/dist ./dist
COPY --from=BUILD_TS /singlelink/node_modules ./node_modules
COPY --from=BUILD_TS /singlelink/package.json ./package.json

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD npm run start
