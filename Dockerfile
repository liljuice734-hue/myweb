FROM node:24-bookworm-slim
WORKDIR /app
COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev
COPY . .
ENV NODE_ENV=production PORT=3000 DB_PATH=/data/portfolio.sqlite
EXPOSE 3000
CMD ["node", "backend/server.js"]
