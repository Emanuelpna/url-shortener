FROM node:16

WORKDIR /home/node/app

COPY . .

RUN npm i

USER node

CMD ["npm", "run", "dev"]