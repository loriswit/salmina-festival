import { sql } from "~/server/utils/db"
import { RegistrationSchema } from "~/server/utils/validation"

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, "id"))
  const body = await readBody(event)

  const [currentEvent] = await sql`select id
                                   from events
                                   order by start_date desc
                                   limit 1`

  if (currentEvent.id !== id)
    throw createError({ statusCode: 400, statusMessage: "Cannot register to past events" })

  const result = RegistrationSchema.safeParse(body)
  if (!result.success)
    throw createError({ statusCode: 400, statusMessage: result.error.message })

  const [registration] = await sql`insert into registrations (event_id, name, conditions_read, conditions_accepted, message)
                                   values (${id}, ${body.name}, ${body.conditionsRead}, ${body.conditionsAccepted},
                                           ${body.message})
                                   returning id`

  await sql.query("insert into registrations_tickets (registration_id, ticket_id) values " +
    body.tickets.map((ticket: number) => `(${registration.id}, ${ticket})`).join(","))

  if (body.meals.length > 0)
    await sql.query("insert into registrations_meals (registration_id, meal_id) values " +
      body.meals.map((meal: number) => `(${registration.id}, ${meal})`).join(","))

  await setUserSession(event, {
    registered: true,
    registration: registration.id,
  })
})
