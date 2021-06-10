FROM node:16.3.0-buster-slim

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update

COPY ./ singlelink/

WORKDIR singlelink

RUN npm run build

CMD npm run start
