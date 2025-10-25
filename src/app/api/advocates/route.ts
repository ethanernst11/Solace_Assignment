import { AwsDataApiPreparedQuery } from "drizzle-orm/aws-data-api/pg";
import { db } from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, or, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("searchTerm") || "";

  if (!searchTerm) {
    const all = await db.select().from(advocates);
    return Response.json({ data: all });
  }

  const term = `%${searchTerm}%`

  
  const filtered = await db
    .select()
    .from(advocates)
    .where(
      or(
        ilike(advocates.firstName, term),
        ilike(advocates.lastName, term),
        ilike(advocates.city, term),
        ilike(advocates.degree, term),
        sql`${advocates.specialties}::text ILIKE ${term}`
      )
    )
  




  return Response.json({ data: filtered });
}
