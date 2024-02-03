# Utilisez l'image de Deno
FROM denoland/deno:1.39.4
# Créez le répertoire de travail dans le conteneur
WORKDIR /app
USER deno
# Copiez le fichier des de dépendances
COPY deps.ts .
# Installes les dépendances dans le cache Deno du container
RUN deno cache deps.ts
# Copiez les fichiers dans le conteneur
COPY . .
# Exposez le port sur lequel Deno écoute
EXPOSE 8080
# Spécifiez la commande pour exécuter Deno
CMD ["run", "--allow-all", "server.ts"]
