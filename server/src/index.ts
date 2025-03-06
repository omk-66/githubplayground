import { Hono } from 'hono'
import {authRoute} from "./routes/auth"
import {cors} from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import * as z from "zod"

const app = new Hono()

export const schma = z.object({
  id: z.number(),
  name: z.string(),
  markes:z.number(),
})

export type stateScham = z.infer<typeof schma>;
app.use("*", cors({
  origin:"http://localhost:5173"
}))
// const apiRoutes = app.route("/auth", authRoute);


app.get('/', (c) => {
  return c.json({name:"om",age:20,markes: 50});
})

app.get("/me",(c) => {
  return c.text("HELLOE");
})

app.post('/',zValidator("json", schma), async (c) => {
  const data =  c.req.valid("json");
  return c.json(data);
})

export default app
