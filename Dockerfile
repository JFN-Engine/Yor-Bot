# Usa una imagen base de Node.js
FROM node:20-alpine

# Instala las dependencias necesarias para compilar paquetes nativos
RUN apk add --no-cache python3 make g++ ffmpeg

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y el archivo yarn.lock (si existe)
COPY package.json ./
COPY yarn.lock* ./

# Instala las dependencias de producción
RUN yarn install --production

# Instala TypeScript como una dependencia de desarrollo
RUN yarn add --dev typescript

# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación (reemplaza esto con tu comando de construcción real)
RUN yarn build

# Define el comando para ejecutar tu aplicación
CMD ["node", "dist/main.js"]
