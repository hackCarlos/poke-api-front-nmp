# Usa una imagen base oficial de Node.js
FROM node:16-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación React
RUN npm run build

# Instala un servidor HTTP simple para servir la aplicación
RUN npm install -g serve

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "build"]