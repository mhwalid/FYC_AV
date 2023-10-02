import { Client } from "https://deno.land/x/mysql/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const client = await new Client().connect({
    hostname: Deno.env.get("DATABASE_HOST"),
    username: Deno.env.get("DATABASE_USER"),
    password: Deno.env.get("DATABASE_PASSWORD"),
    db: Deno.env.get("DATABASE_NAME"),
});

export default client;