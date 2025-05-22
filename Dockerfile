FROM  node:20-slim AS base

# Dependencies install stage
FROM base AS target 
WORKDIR /app
COPY package.json ./
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install

# Build stage
FROM base AS build 
WORKDIR /app
COPY --from=target /app ./  
COPY . .                    
RUN npm run build

# Server stage
FROM base AS server
WORKDIR /app
COPY --from=target /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

CMD ["node", "dist/server.js"]