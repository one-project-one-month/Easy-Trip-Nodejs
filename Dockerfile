FROM  node:18-slim as base

# Dependencies install stage
FROM base as target 
WORKDIR /app
COPY package.json ./
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install

# Build stage
FROM base as build 
WORKDIR /app
COPY --from=target /app ./  
COPY . .                    
RUN npm run build

# Server stage
FROM base as server
WORKDIR /app
COPY --from=target /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

CMD ["node", "dist/server.js"]