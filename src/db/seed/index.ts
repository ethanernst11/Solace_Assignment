import { advocateData } from "./advocates";
import { advocates } from "../..//db/schema";
import { db } from "../../db";

const seedAdvocates = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  
    await db.insert(advocates).values(advocateData);
    console.log(`Seeded ${advocateData.length} advocates.`);
};

void seedAdvocates()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Failed to seed advocates.");
    console.error(error);
    process.exit(1);
  });
