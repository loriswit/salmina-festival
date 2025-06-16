import { sql } from "~/server/utils/db"

export default defineEventHandler(() => {
  return sql`select id, name
             from events
             order by start_date desc`
})
