import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: ["./src/db/schema.ts", "./auth-schema.ts"],
    dialect: "postgresql",
    dbCredentials: {
        // url: process.env.DATABASE_URL!,
        url: "postgresql://neondb_owner:npg_C8YxGU7ryRdJ@ep-bold-firefly-a58z6c2a-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    },
});
