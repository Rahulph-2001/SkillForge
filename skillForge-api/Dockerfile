FROM node:20-alpine

# Install build tools for native modules (bcrypt, sharp, etc.)
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]