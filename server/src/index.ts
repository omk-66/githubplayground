import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { auth } from "./lib/auth";
import { logger } from "hono/logger";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// app.use(logger());

// app.use("*", async (c, next) => {
//   console.log("Request origin:", c.req.header("Origin"));
//   await next();
// });
app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "http://localhost:5173", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);


app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const schma = z.object({
  id: z.number(),
  name: z.string(),
  markes: z.number(),
});

export type stateScham = z.infer<typeof schma>;

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  // console.log("Request received at /api/auth/*");

  return auth.handler(c.req.raw);
});

app.get("/", (c) => {
  return c.json({ name: "om", age: 20, markes: 50 });
});

app.get("/me", (c) => {
  return c.text("HELLOE");
});

app.post("/", zValidator("json", schma), async (c) => {
  const data = c.req.valid("json");
  return c.json(data);
});

app.get("/session", async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

export default app;
