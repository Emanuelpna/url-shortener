FROM node:16

USER node

WORKDIR /app

RUN chown node:node /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]