import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./schema";


const runMigration = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  console.log(databaseUrl);

  const sql = postgres(databaseUrl, { max: 1 });
  const db = drizzle(sql, { schema });

  await migrate(db, { migrationsFolder: "drizzle" });
  await sql.end();
};

void runMigration()
  .then(() => {
    console.log("Successfully ran migration.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Failed to run migration.");
    console.error(error);
    process.exit(1);
  });
