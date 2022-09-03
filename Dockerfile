 FROM node:alpine

RUN mkdir /www
WORKDIR /www
RUN mkdir front
RUN mkdir back
RUN mkdir -p lib/pong
RUN mkdir lib/backFrontCommon
COPY lib/backFrontCommon/package*.json lib/backFrontCommon/
COPY lib/pong/package*.json lib/pong/
COPY back/package*.json back/
COPY front/package*.json front/
RUN cd lib/backFrontCommon/ && npm install
RUN cd lib/pong/ && npm install
RUN cd back/ && npm install
RUN cd front/ && npm install
COPY . ./
RUN cd back/ && npm run build
RUN cd front/ && npm run build

CMD (cd back && npm run start:prod) & (cd front && npm run serve)
