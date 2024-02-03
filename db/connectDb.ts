import { Client, ClientConfig, load } from "../deps.ts";

const envVars = await load();

const config: ClientConfig = {
  hostname: envVars.DATABASE_HOST || "127.0.0.1",
  username: envVars.DATABASE_USER || "root",
  password: envVars.DATABASE_PASSWORD || "",
  db: envVars.DATABASE_NAME || "",
  port: parseInt(envVars.DATABASE_PORT) || 3306,
};

const dbClient = new Client();

try {
  await dbClient.connect(config);
  console.log("Database connected!");
} catch (e) {
  console.error("Erreur de connexion à la BDD : " + e.message);
}

export default dbClient;
