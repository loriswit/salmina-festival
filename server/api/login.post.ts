import { parseBasicAuth } from "~/utils/helpers"

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, "Authorization")
  if (!auth) throw createError({ statusCode: 401 })

  const password = parseBasicAuth(auth)?.password
  if (!password) throw createError({ statusCode: 401 })

  const session = await getUserSession(event)

  if (password === process.env.ADMIN_PASSWORD)
    await setUserSession(event, {
      registered: session.registered,
      registration: session.registration,
      user: { role: "admin" },
    })

  else {
    const [registration] = await sql`select id, has_paid
                                     from registrations
                                     where hash = ${password}`
    if (registration === undefined)
      throw createError({ statusCode: 401 })

    await setUserSession(event, {
      user: session.user,
      registered: registration.has_paid,
      registration: registration.id,
    })
  }
})
