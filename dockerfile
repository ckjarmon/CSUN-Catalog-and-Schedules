FROM node:20-slim


# Set the working directory
WORKDIR /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY . .
RUN npm install -g pnpm
RUN pnpm install --force

WORKDIR /app/bot/
RUN pnpm install tslib
RUN tsc

WORKDIR /
COPY entry.sh entry.sh
RUN chmod +x entry.sh

ENTRYPOINT ["/entry.sh"]