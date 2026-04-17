import { z } from "zod/v4";
const envVars = z.object({
    GEMINI_API_KEY: z.string(),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION: z.string(),
    JWT_COOKIE_EXPIRES: z.string(),
    PORT: z.number()
});
envVars.parse(process.env);
