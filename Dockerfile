FROM node:22-alpine AS nodejs

WORKDIR /app

FROM nodejs AS installer

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nodejs AS pruner

COPY package*.json ./

RUN npm install --only=prod

FROM nodejs

COPY --from=installer /app/dist ./dist
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["node", "dist/src/main.js" ]