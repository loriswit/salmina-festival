import { sql } from "~/server/utils/db"

export default defineEventHandler(event => {
  const id = getRouterParam(event, "id")

  return sql`select *
             from meals
             where event_id = ${id}`
})
