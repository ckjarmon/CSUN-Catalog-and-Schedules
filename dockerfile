FROM node:20-slim as builder


# Set the working directory
WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json .
COPY . .

RUN npm install -g pnpm
WORKDIR /app/main/
RUN pnpm install

WORKDIR /app

COPY entry.sh /
RUN chmod +x /entry.sh
ENTRYPOINT ["/entry.sh"]



