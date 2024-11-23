FROM node:22.11

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]
