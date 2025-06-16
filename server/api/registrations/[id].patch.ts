import { sql } from "~/server/utils/db"
import { RegistrationSchema } from "~/server/utils/validation"

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, "id"))
  const session = await getUserSession(event)

  if (session.user?.role !== "admin" && session?.registration !== id)
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })

  const body = await readBody(event)

  // mark as paid (admin only)
  if ("hasPaid" in body) {
    if (session.user?.role !== "admin")
      throw createError({ statusCode: 403, statusMessage: "Forbidden" })

    await sql`update registrations
              set has_paid = ${body.hasPaid},
                  paid_on  = case when ${body.hasPaid} then current_timestamp end
              where id = ${id}`

  } else {
    const [{ has_paid }] = await sql`select has_paid
                                     from registrations
                                     where id = ${id}`
    if (has_paid)
      throw createError({ statusCode: 400, statusMessage: "Inscription déjà payée" })
  }

  const result = RegistrationSchema.partial().safeParse(body)
  if (!result.success)
    throw createError({ statusCode: 400, statusMessage: result.error.message })

  const values = [
    { row: "name", value: body.name },
    { row: "conditions_read", value: body.conditionsRead },
    { row: "conditions_accepted", value: body.conditionsAccepted },
    { row: "message", value: body.message },
  ].filter(({ value }) => value !== undefined)
    .map(({ row, value }) => ({ row, value: typeof value === "string" ? `'${value}'` : value }))

  if (values.length > 0)
    await sql.query(`update registrations
                     set ${values.map(({ row, value }) => `${row} = ${value}`).join(",")}
                     where id = ${id}`)

  if ("tickets" in body) {
    await sql`delete
              from registrations_tickets
              where registration_id = ${id}`
    await sql.query("insert into registrations_tickets (registration_id, ticket_id) values " +
      body.tickets.map((ticket: number) => `(${id}, ${ticket})`).join(","))
  }

  if ("meals" in body) {
    await sql`delete
              from registrations_meals
              where registration_id = ${id}`
    if (body.meals.length > 0)
      await sql.query("insert into registrations_meals (registration_id, meal_id) values " +
        body.meals.map((meal: number) => `(${id}, ${meal})`).join(","))
  }

  await setUserSession(event, {
    registered: true,
    registration: id,
  })

  setResponseStatus(event, 204)
})
