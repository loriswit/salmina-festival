import { sql } from "~/server/utils/db"

export default defineEventHandler(async event => {
  const id = getRouterParam(event, "id")

  const [eventData] = await sql`select *
                                from events
                                where id = ${id}`

  if (eventData === undefined)
    throw createError({
      statusCode: 404,
      statusMessage: "not found",
    })

  return eventData
})
