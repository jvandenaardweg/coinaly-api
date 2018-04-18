FROM node:8.11.1

WORKDIR /opt/app

COPY . /opt/app

RUN npm install -g forever
RUN yarn install

EXPOSE 5000

CMD ["npm", "start"]
