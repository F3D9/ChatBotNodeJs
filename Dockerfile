FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
EXPOSE 3000
#CMD ["npm", "start"]
CMD ["npm","run","dev"]