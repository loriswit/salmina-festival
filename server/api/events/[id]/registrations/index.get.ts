import { sql } from "~/server/utils/db"

export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event)
  if (user.role !== "admin")
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    })

  const id = getRouterParam(event, "id")

  const registrations = await sql`select *
                                  from registrations
                                  where event_id = ${id} and archived = false
                                  order by created_on`

  const tickets = await sql`select registration_id, t.id, t.name, t.date, t.price
                            from registrations_tickets
                                     inner join registrations on registration_id = registrations.id
                                     inner join tickets as t on ticket_id = t.id
                            where registrations.event_id = ${id} and archived = false
                            order by t.date, t.id`

  const meals = await sql`select registration_id, m.id, m.name, m.date, m.evening, m.price
                          from registrations_meals
                                   inner join registrations on registration_id = registrations.id
                                   inner join meals as m on meal_id = m.id
                          where registrations.event_id = ${id} and archived = false
                          order by m.date, m.id`

  return registrations.map(registration => ({
    ...registration,
    tickets: tickets
      .filter(ticket => ticket.registration_id === registration.id),
    meals: meals
      .filter(meal => meal.registration_id === registration.id),
  }))
})
