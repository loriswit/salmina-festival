export interface FetchOptions {
  load: string[]
}

export async function useFetchEvent(id: number | "latest" = "latest", option: FetchOptions = { load: [] }): Promise<Event> {
  const event = await $fetch<Event>(`/api/events/${id}`)

  instantiateDates(event, "start_date", "end_date", "created_on", "update_on")
  event.tickets = []
  event.meals = []
  event.registrations = []

  if (option.load.includes("tickets")) {
    event.tickets = await $fetch<Ticket[]>(`/api/events/${id}/tickets`)
    instantiateDates(event.meals, "date", "created_on", "update_on")
  }

  if (option.load.includes("meals")) {
    event.meals = await $fetch<Meal[]>(`/api/events/${id}/meals`)
    instantiateDates(event.meals, "date", "created_on", "update_on")
  }

  if (option.load.includes("registrations")) {
    event.registrations = await $fetch<Registration[]>(`/api/events/${id}/registrations`)
    instantiateDates(event.registrations, "paid_on", "created_on", "update_on")
  }

  return event
}

export async function useFetchRegistration(id: number): Promise<Registration> {
  const registration = await $fetch<Registration>(`/api/registrations/${id}`, {
    headers: useRequestHeaders(["cookie"]),
  })

  instantiateDates(registration, "paid_on", "created_on", "update_on")
  return registration
}

export function instantiateDates(objects: Record<string, unknown> | Record<string, unknown>[], ...properties: string[]): void {
  if (!Array.isArray(objects))
    objects = [objects]

  for (const object of objects)
    for (const property of properties)
      if (typeof object[property] === "string")
        object[property] = new Date(object[property])
}


export interface Timestamp extends Record<string, unknown> {
  created_on: Date
  update_on: Date
}

export interface Event extends Timestamp {
  id: number
  name: string
  start_date: Date
  end_date: Date
  ticket_discount: number
  twint_number: string
  twint_name: string
  chat_group: string
  tickets: Ticket[]
  meals: Meal[]
  registrations: Registration[]
}

export interface Ticket extends Timestamp {
  id: number
  name: string
  date?: Date
  price: number
}

export interface Meal extends Timestamp {
  id: number
  name: string
  date: Date
  evening: boolean
  price: number
}

export interface Registration extends Timestamp {
  id: number
  name: string
  conditions_read: boolean
  conditions_accepted: boolean
  message?: string
  hash: string
  discount: number
  has_paid: boolean
  paid_on?: Date
  tickets: Ticket[]
  meals: Meal[]
  registrations: Registration[]
}
