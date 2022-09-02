FROM node:alpine

COPY . /www
WORKDIR /www
RUN cd lib/backFrontCommon/ && npm install
RUN cd lib/pong/ && npm install
RUN cd back/ && npm install && npm run build

CMD tail -f
# CMD cd back && npm run start:prod
