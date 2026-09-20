FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production
RUN apk add --no-cache netcat-openbsd
COPY . .
RUN chmod +x api/entrypoint.sh
EXPOSE 3000
CMD ["sh", "-c", "api/entrypoint.sh"]
