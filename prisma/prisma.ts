import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";
import pg from "pg";
import { fileURLToPath } from "url";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });



console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;