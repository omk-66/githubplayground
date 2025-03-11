import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";
import { account, session, user, verification } from "../../auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema:{
            user:user,
            session:session,
            account:account,
            verification:verification,
        }
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            // scope: ["user:email"],
        }
    },
    trustedOrigins:["http://localhost:5173"],
});