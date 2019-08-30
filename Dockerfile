FROM node:9.8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN yarn install

EXPOSE 8888

CMD ["npm", "start"]