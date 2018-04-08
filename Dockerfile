FROM node:8.11.1

WORKDIR /usr/container

COPY . /usr/container

RUN npm install -g forever
RUN yarn install

EXPOSE 5000
