import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .default(3333),
    HOST: z.string().default("0.0.0.0"),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres."),
    CORS_ORIGIN: z
        .string()
        .default("http://localhost:5173"),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    const errors = result.error.issues
        .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
    throw new Error(`Erro nas variáveis de ambiente:\n${errors}`);
}
export const env = result.data;
export const corsOrigins = env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
//# sourceMappingURL=env.js.map