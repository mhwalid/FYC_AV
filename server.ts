import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
// import todoRouter from "./routes/todo.ts";
import authRouter from "./routes/auth.ts";
import roleRouter from "./routes/role.ts";
import sharePriceRouter from "./routes/shareprice.ts";
const app = new Application();
const port: number = 8080;


// app.use(todoRouter.routes());
// app.use(todoRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(roleRouter.routes());
app.use(roleRouter.allowedMethods());
app.use(sharePriceRouter.routes());
app.use(sharePriceRouter.allowedMethods());

app.use(oakCors({ origin: "*" }));

app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://";
    const url = `${protocol}${hostname ?? "localhost"}:${port}`;
    console.log(`Listening on: ${port}`);
});

await app.listen({ port });
export default app;