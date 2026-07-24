# --- Stage 1: Build React App ---
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package & install dependensi
COPY package*.json ./
RUN npm install

# Copy seluruh source code & lakukan build (menghasilkan folder /dist)
COPY . .
RUN npm run build

# --- Stage 2: Serve dengan Nginx Alpine ---
FROM nginx:alpine as production-stage

# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Salin konfigurasi custom yang sudah kita buat
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build React dari Stage 1 ke folder publik Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Buka port 80 (Port standar HTTP)
EXPOSE 80

# Nyalakan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]