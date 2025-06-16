import { sql } from "~/server/utils/db"

export default defineEventHandler(async () => {
  const [event] = await sql`select *
                            from events
                            order by start_date desc
                            limit 1`

  if (event === undefined)
    throw createError({
      statusCode: 404,
      statusMessage: "not found",
    })

  return event
})
