FROM node:22.12.0-alpine AS builder

WORKDIR /app

RUN npm install -g typescript

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

RUN tsc

FROM node:22.12.0-alpine

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/.env .

EXPOSE 3020

WORKDIR /app

RUN npm install --omit=dev

CMD ["node", "dist/main.js"]
