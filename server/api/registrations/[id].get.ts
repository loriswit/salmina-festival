import { sql } from "~/server/utils/db"

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, "id"))
  const session = await getUserSession(event)

  if (session.user?.role !== "admin" && session?.registration !== id)
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })

  const [registration] = await sql`select *
                                   from registrations
                                   where id = ${id} and archived = false`

  if (registration === undefined)
    throw createError({
      statusCode: 404,
      statusMessage: "not found",
    })

  const tickets = await sql`select tickets.id, name, date, price
                            from tickets
                                     inner join registrations_tickets on ticket_id = tickets.id
                            where registration_id = ${id}
                            order by date, tickets.id`

  const meals = await sql`select meals.id, name, date, price
                          from meals
                                   inner join registrations_meals on meal_id = meals.id
                          where registration_id = ${id}
                          order by date, meals.id`

  return { ...registration, tickets, meals }
})
