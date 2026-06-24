FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine

ENV PORT=8080
ENV API_BASE_URL=http://localhost:8000/api/v1

COPY docker/nginx/default.conf.template /templates/default.conf.template
COPY docker/env.js.template /templates/env.js.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=builder /app/dist/pergamo/browser /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]
