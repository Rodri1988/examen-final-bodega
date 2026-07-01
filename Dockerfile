FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Copiar el código del servidor y el frontend visual
COPY server.js .
COPY index.html .

EXPOSE 3000
CMD ["npm", "start"]