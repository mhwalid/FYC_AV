FROM denoland/deno:1.39.4
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["run", "--allow-all", "server.ts"] 
