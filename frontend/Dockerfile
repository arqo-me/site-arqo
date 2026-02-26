FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_STRAPI_API_URL
ENV NEXT_PUBLIC_STRAPI_API_URL=$NEXT_PUBLIC_STRAPI_API_URL
EXPOSE 3000
CMD ["sh", "-c", "sleep 15 && npm run build && npm run start"]
