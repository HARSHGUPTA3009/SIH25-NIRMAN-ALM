FROM node:20-bookworm AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ---- Runtime ----
FROM node:20-bookworm
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
