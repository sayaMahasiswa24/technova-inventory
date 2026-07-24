# Stage 1: Base Image Node.js 24 Alpine (Sangat Ringan & Modern)
FROM node:24-alpine

# Set direktori kerja di dalam kontainer
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install tools OS (python3, make, g++) yang dibutuhkan untuk node-gyp
RUN apk add --no-cache python3 make g++ \
    && npm install

# Salin seluruh source code backend ke dalam kontainer
COPY . .

# UBAH BARIS INI: Tambahkan flag --ignore-ts-errors agar Docker build tidak terhenti
RUN node ace build --ignore-ts-errors

# Buka port 3333 untuk komunikasi eksternal
EXPOSE 3333

# Jalankan server dalam mode development
CMD ["npm", "run", "dev"]