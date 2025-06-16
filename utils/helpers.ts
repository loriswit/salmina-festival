export function formatMealDate(meal: Meal): string {
  const weekday = meal.date.toLocaleString("fr-CH", { weekday: "long", day: "numeric" })
  return weekday.charAt(0).toUpperCase() + weekday.slice(1) + " – " + (meal.evening ? "soir" : "midi")
}

export function toBase64(value: string): string {
  if (import.meta.browser) return btoa(value)
  else return Buffer.from(value).toString("base64")
}

export function fromBase64(value: string): string {
  if (import.meta.server) return atob(value)
  else return Buffer.from(value, "base64").toString()
}

export function generateBasicAuth(username: string, password: string): string {
  return "Basic " + toBase64(`${encodeURIComponent(username)}:${encodeURIComponent(password)}`)
}

export function parseBasicAuth(value: string): { username: string, password: string } | null {
  if (!value.startsWith("Basic ")) return null

  const [username, password] = fromBase64(value.slice(6)).split(":", 2).map(decodeURIComponent)
  return { username, password }
}
