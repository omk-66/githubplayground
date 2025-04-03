import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { zValidator } from '@hono/zod-validator'
import {playgroundFormSchema} from "../../client/src/type/playground.type"
import { z } from "zod";
import {db} from "../src/db/index"
import { playgrounds } from "../auth-schema";
import { eq } from "drizzle-orm";
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// 1. CORS Middleware
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
  exposeHeaders: ['Content-Length']
}))

// 2. Session Middleware (better-auth)
app.use('*', async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });
    c.set('user', session?.user ?? null);
    c.set('session', session?.session ?? null);
  } catch (error) {
    console.error('Session error:', error);
    c.set('user', null);
    c.set('session', null);
  }
  await next();
});

// 3. Auth Routes Handler (for better-auth specific routes)
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// 4. Your Protected Playground Endpoint
app.post(
  '/api/addPlayground',
  zValidator("json", playgroundFormSchema),
  async (c) => {
    // Authentication check
    const user = c.get('user');
    if (!user) {
      return c.json({ 
        status: 'error',
        message: 'Unauthorized - Please login first'
      }, 401);
    }

    try {
      // Get validated data
      const validatedData = c.req.valid('json');
      const [createdPlayground] = await db.insert(playgrounds).values({
        name:validatedData.playgroundName,
        description:validatedData.playgroundDescription,
        tags:validatedData.tags || [],
        visibility:validatedData.visibility,
        creatorId:user.id,
        isFeatured:validatedData.isFeatured || false
      }).returning();
      
      // Process successful request
      return c.json({
        status: 'success',
        message: 'Playground created',
        data: createdPlayground // Return the actual created object
      }, 201);

    } catch (error) {
      console.error('Playground creation error:', error);
      
      // Handle validation errors automatically caught by zValidator
      if (error instanceof z.ZodError) {
        return c.json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        }, 400);
      }
      
      // Handle other errors
      return c.json({
        status: 'error',
        message: 'Internal server error'
      }, 500);
    }
  }
);

app.get('/api/playground/:userId', async (c) => {
  try {
    const { userId } = c.req.param();
    
    // Get playgrounds where user is creator
    const createdPlaygrounds = await db
      .select()
      .from(playgrounds)
      .where(eq(playgrounds.creatorId, userId));

    // Get playgrounds where user is member
    // const memberPlaygrounds = await db
    //   .select({ playground: playgrounds })
    //   .from(playgroundMembers)
    //   .innerJoin(playgrounds, eq(playgroundMembers.playgroundId, playgrounds.id))
    //   .where(eq(playgroundMembers.userId, userId));

    // Combine results
    const allPlaygrounds = [
      ...createdPlaygrounds,
      // ...memberPlaygrounds.map(p => p.playground)
    ];

    return c.json({
      status: 'success',
      data: allPlaygrounds
    });
  } catch (error) {
    console.error(error);
    return c.json({ status: 'error', message: 'Failed to fetch playgrounds' }, 500);
  }
});
// Other routes...
app.get('/', (c) => c.json({ status: 'ok' }));
app.get('/session', (c) => c.json({ user: c.get('user') }));

export default app;