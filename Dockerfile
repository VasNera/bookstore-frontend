# ---- build stage: Node φτιάχνει τα στατικά αρχεία ----------------------------
FROM node:24-alpine AS build
WORKDIR /app

# Πρώτα μόνο τα package files, ώστε το Docker να κάνει cache το npm ci
# και να μην ξανακατεβάζει πακέτα όταν αλλάζει μόνο ο κώδικας
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Το Vite "ψήνει" το URL του backend μέσα στο build, γι' αυτό το δίνουμε εδώ
ARG VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- runtime stage: nginx σερβίρει μόνο τα έτοιμα αρχεία ----------------------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80