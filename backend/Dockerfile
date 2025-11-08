# Étape 1 : construire l'image du backend Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm install --production

# Copier le reste du code
COPY . .

# Définir les variables d’environnement
ENV PORT=5000
EXPOSE 5000

# Démarrer le serveur
CMD ["npm", "start"]
