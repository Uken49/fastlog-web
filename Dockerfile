FROM node:22.11

WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js ./
COPY html/ ./html/

RUN npm install

ENV RASTREAMENTO=http://localhost:8000/rastreamento

CMD ["npm", "start"]

EXPOSE 80