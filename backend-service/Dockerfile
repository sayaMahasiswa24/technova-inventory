# Stage 1: Base Image Node.js Alpine (Sangat Ringan)
FROM node:20-alpine

# Set direktori kerja di dalam kontainer
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install seluruh dependensi
RUN npm install

# Salin seluruh source code backend ke dalam kontainer
COPY . .

# Build aplikasi AdonisJS (mengubah TypeScript menjadi JavaScript di folder /build)
RUN npm run build

# Buka port 3333 untuk komunikasi eksternal
EXPOSE 3333

# Jalankan server dalam mode production / development
CMD ["npm", "run", "dev"]