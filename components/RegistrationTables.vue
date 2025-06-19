<script setup lang="ts">
import type { Event } from "~/composables/use-fetch-data"
import { formatMealDate } from "~/utils/helpers"

const { event } = defineProps<{ event: Event }>()
defineEmits(["updateRegistration"])

const currentEvent = useState<Event>("currentEvent")
const isCurrentEvent = computed(() => currentEvent.value.id === event.id)

const eventYear = computed(() => currentEvent.value.start_date.getFullYear())

const paidRegistrations = computed(() => event.registrations
  .filter(registration => registration.has_paid)
  .toSorted((a, b) => (b.paid_on ?? new Date(0)).getTime() - (a.paid_on ?? new Date(0)).getTime()))

const unpaidRegistrations = computed(() => event.registrations
  .filter(registration => !registration.has_paid)
  .toSorted((a, b) => b.created_on.getTime() - a.created_on.getTime()))

const allRegistrations = computed(() => [
  { title: "Inscriptions payées", registrations: paidRegistrations.value, paid: true, key: "paid" },
  { title: "Inscriptions non-payées", registrations: unpaidRegistrations.value, paid: false, key: "unpaid" },
])

const computedPrices = computed(() => [paidRegistrations, unpaidRegistrations].map(
  registrations => registrations.value.map(
    registration => {
      let totalTicketPrice = registration.tickets.reduce(
        (acc, ticket) => acc + ticket.price,
        registration.tickets.length > 1 ? event.ticket_discount : 0)

      let totalMealPrice = registration.meals.reduce(
        (acc, meal) => acc + meal.price, 0)

      totalMealPrice += Math.min(totalTicketPrice + registration.discount, 0)
      totalTicketPrice = Math.max(totalTicketPrice + registration.discount, 0)

      return {
        tickets: totalTicketPrice,
        meals: totalMealPrice,
        discount: registration.discount,
        total: totalTicketPrice + totalMealPrice,
      }
    })))

const tickets = computed(() => event.tickets.map(ticket => ({
  ...ticket,
  paidCount: paidRegistrations.value.filter(
    r => r.tickets.some(t => t.id === ticket.id)).length,
  unpaidCount: unpaidRegistrations.value.filter(
    r => r.tickets.some(t => t.id === ticket.id)).length,
})))

const meals = computed(() => event.meals.map(meal => ({
  ...meal,
  paidCount: paidRegistrations.value.filter(
    r => r.meals.some(m => m.id === meal.id)).length,
  unpaidCount: unpaidRegistrations.value.filter(
    r => r.meals.some(m => m.id === meal.id)).length,
})))

const totalIncome = computed(() => computedPrices.value[0].reduce((acc, r) => acc + r.total, 0))
const unpaidTotalIncome = computed(() => computedPrices.value[1].reduce((acc, r) => acc + r.total, 0))
const ticketsIncome = computed(() => computedPrices.value[0].reduce((acc, r) => acc + r.tickets, 0))
const unpaidTicketsIncome = computed(() => computedPrices.value[1].reduce((acc, r) => acc + r.tickets, 0))
const mealsIncome = computed(() => computedPrices.value[0].reduce((acc, r) => acc + r.meals, 0))
const unpaidMealsIncome = computed(() => computedPrices.value[1].reduce((acc, r) => acc + r.meals, 0))

function formatDate(date: Date | null): string {
  if (!date) return ""
  return date.toISOString().substring(0, 16).replace("T", " ")
}
</script>

<template>
  <div class="first-row">
    <div>
      <h2>Billets</h2>
      <table>
        <thead>
        <tr>
          <td/>
          <th>Payé</th>
          <th>Potentiel</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <th>{{ ticket.name }}</th>
          <td>{{ ticket.paidCount }} / 40</td>
          <td>{{ ticket.paidCount + ticket.unpaidCount }} / 40</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>Repas</h2>
      <table>
        <thead>
        <tr>
          <td/>
          <th>Payé</th>
          <th>Potentiel</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="meal in meals" :key="meal.id">
          <th>
            {{ formatMealDate(meal) }}&nbsp;:
            {{ meal.name }}
          </th>
          <td>{{ meal.paidCount }} / 40</td>
          <td>{{ meal.paidCount + meal.unpaidCount }} / 40</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>Recette</h2>
      <table>
        <thead>
        <tr>
          <td/>
          <th>Actuelle</th>
          <th>Potentielle</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>Billets</th>
          <td>CHF {{ ticketsIncome }}</td>
          <td>CHF {{ ticketsIncome + unpaidTicketsIncome }}</td>
        </tr>
        <tr>
          <th>Repas</th>
          <td>CHF {{ mealsIncome }}</td>
          <td>CHF {{ mealsIncome + unpaidMealsIncome }}</td>
        </tr>
        <tr>
          <td/>
          <td/>
          <td/>
        </tr>
        <tr>
          <th>Total</th>
          <td>CHF {{ totalIncome }}</td>
          <td>CHF {{ totalIncome + unpaidTotalIncome }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <template v-for="{title, registrations, paid, key} in allRegistrations" :key="key">
    <h2>{{ title }} ({{ registrations.length }})</h2>

    <table v-if="registrations.length">
      <thead>
      <tr>
        <th>Nom</th>
        <th>Billets</th>
        <th>Repas</th>
        <th v-if="eventYear === 2024" colspan="2">Conditions acceptées / lues</th>
        <th>Message</th>
        <th v-if="paid">Payé le</th>
        <th v-else>Inscrit le</th>
        <th>Prix</th>
        <th v-if="isCurrentEvent">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(registration, index) in registrations" :key="registration.id">
        <td>{{ registration.name }}</td>
        <td>{{ registration.tickets.map(ticket => ticket.id).join(", ") }}</td>
        <td>{{ registration.meals.map(meal => meal.id).join(", ") }}</td>
        <td v-if="eventYear === 2024">{{ registration.conditions_accepted ? "oui" : "" }}</td>
        <td v-if="eventYear === 2024">{{ registration.conditions_read ? "oui" : "" }}</td>
        <td class="message">
          <div>{{ registration.message }}</div>
        </td>
        <td>{{ formatDate(registration[paid ? "paid_on" : "created_on"]) }}</td>
        <td :class="{discount : registration.discount !== 0}">
          CHF {{ computedPrices[paid ? 0 : 1][index].total }}
        </td>
        <td v-if="isCurrentEvent">
          <div class="actions">
            <button v-if="paid" @click.prevent="$emit('updateRegistration', registration.id, { hasPaid: false })">
              Marquer comme non payé
            </button>
            <template v-else>
              <button @click.prevent="$emit('updateRegistration', registration.id, { hasPaid: true })">
                Marquer comme payé
              </button>
              <NuxtLink class="button" :to="{name: 'edit', query: {token: registration.hash} }">Modifier</NuxtLink>
            </template>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </template>
</template>

<style scoped>

.first-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
}

table {
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
}

td, th {
  border: 1px solid white;
  min-width: 1em;
  padding: 0.4em;
}

td:not(.message) {
  white-space: nowrap;
}

td.discount {
  color: mediumspringgreen;
  font-style: italic;
}

.message > div {
  max-height: 4lh;
  overflow-y: auto;
}

.actions {
  display: flex;
  gap: 0.5em;
}
</style>
