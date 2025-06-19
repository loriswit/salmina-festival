<script setup lang="ts">
import { type Event, useFetchEvent } from "~/composables/use-fetch-data"
import { formatMealDate } from "~/utils/helpers"
import "~/assets/styles/spinner.css"

const { session, fetch: refreshSession } = useUserSession()

const currentEvent = useState<Event>("currentEvent")
useHead({ title: "Inscription - " + currentEvent.value.name })

const event = await useFetchEvent(currentEvent.value.id, { load: ["tickets", "meals"] })
const registration: Partial<Registration> = session.value?.registration ?
  await useFetchRegistration(session.value.registration as number) : {}

const nameInput = ref(registration.name ?? "")
const ticketInputs = ref(event.tickets.map(ticket =>
  ({ checked: registration.tickets?.some(t => t.id === ticket.id) ?? false, item: ticket })))
const mealInputs = ref(event.meals.map(meal =>
  ({ checked: registration.meals?.some(m => m.id === meal.id) ?? false, item: meal })))
const messageInput = ref(registration.message ?? "")

const hasSomeTicket = computed(() => ticketInputs.value.some(ticket => ticket.checked))

function hasDiscount(ticket: Ticket) {
  const checkedTickets = ticketInputs.value.filter(ticket => ticket.checked)
  if (checkedTickets.length === 0) return false
  if (checkedTickets.length === 1) return !checkedTickets.map(input => input.item).includes(ticket)
  else return checkedTickets[1].item.id === ticket.id
}

const totalPrice = computed(() =>
  [...ticketInputs.value, ...mealInputs.value]
    .filter(input => input.checked)
    .reduce((sum, { item }) => sum + item.price, 0) +
  (ticketInputs.value.filter(ticket => ticket.checked).length >= 2 ? event.ticket_discount : 0))

const loading = ref(false)

async function register() {
  if (!hasSomeTicket.value)
    return

  loading.value = true
  const payload = {
    name: nameInput.value,
    message: messageInput.value,
    tickets: ticketInputs.value.filter(input => input.checked).map(input => input.item.id),
    meals: mealInputs.value.filter(input => input.checked).map(input => input.item.id),
  }
  try {
    if (session.value?.registration)
      await $fetch(`/api/registrations/${registration.id}`, { method: "patch", body: payload })
    else
      await $fetch(`/api/events/${event.id}/registrations`, { method: "post", body: payload })
    await refreshSession()

  } catch (e) {
    alert(e instanceof Error ? e.message : e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="register()">
    <div class="required" title="Champ obligatoire">
      <input v-model="nameInput" type="text" placeholder="Prénom, nom" required minlength="2" autofocus>
    </div>

    <p>Billets</p>

    <label v-for="ticketInput in ticketInputs" :key="ticketInput.item.id" class="field">
      <input v-model="ticketInput.checked" type="checkbox">
      <span class="name">{{ ticketInput.item.name }}</span>
      <span class="price">
        {{ hasSomeTicket && !ticketInput.checked ? "+ CHF" : "CHF" }}
        {{ ticketInput.item.price + (hasDiscount(ticketInput.item) ? event.ticket_discount : 0) }}
      </span>
    </label>

    <template v-if="hasSomeTicket">
      <p>Repas</p>
      <p class="disclaimer">🌿 Tous les repas sont végétariens&nbsp;! 🌿</p>

      <div class="meals">
        <label v-for="mealInput in mealInputs" :key="mealInput.item.id" class="field">
          <input v-model="mealInput.checked" type="checkbox">
          <span class="name meal-info">
                    <span>{{ formatMealDate(mealInput.item) }}</span>
                    <span>{{ mealInput.item.name }}</span>
                </span>
          <span class="price">+ CHF {{ mealInput.item.price }}</span>
        </label>
      </div>

      <p/>
      <textarea v-model="messageInput" rows="5" placeholder="Petit message pour les organisateurs"/>

      <p>Prix total&nbsp;: CHF {{ totalPrice }}</p>

      <button type="submit" :disabled="loading">
        <span v-if="!loading">{{ session?.registration ? "Enregistrer" : "S'inscrire" }}</span>
        <span v-else class="spinner"/>
      </button>
    </template>
  </form>
</template>

<style scoped>
form {
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);

  p {
    margin-bottom: 0;
    font-size: 1.2em;
  }
}

.meals {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap)
}

.disclaimer {
  font-size: 0.9em;
  margin-top: 0;
  color: #a0f5a0;
}

.required {
  position: relative
}

.required:after {
  content: "*";
  position: absolute;
  bottom: -.1em;
  right: .3em;
  font-size: 2em;
  color: #f38
}

input:not([type=checkbox]), button, a.button {
  width: 100%;
  height: 50px;
  margin: 0;
}

textarea {
  resize: none;
}

input[type=checkbox] {
  margin-right: 1em;
  transform: scale(1.5);
}

input:not([type=checkbox]), button, a.button, textarea, .field {
  padding: var(--small-gap);
  border: none;
  transform: skew(-5deg);
  font-size: .9em;
  color: white;
}

input, textarea, .field {
  background-color: #c8c8ff26
}

.field {
  display: flex;
  align-items: center;
}

.field .name {
  flex-grow: 1;
}

.field .price {
  white-space: nowrap;
  padding-left: 1em;
}

.field:hover {
  cursor: pointer;
  background-color: #c8c8ff40
}

.field:has(input:checked) {
  cursor: pointer;
  background-color: rgba(139, 217, 128, 0.35)
}

.meal-info {
  display: flex;
  flex-direction: column;
}

.meal-info span:first-child {
  font-size: 0.9em;

}

.meal-info span:nth-child(2) {
  color: #a0f5a0;
}

input:focus-visible, textarea:focus-visible {
  background-color: #c8c8ff40;
  outline: 2px solid #59cbff
}

input::placeholder, textarea::placeholder {
  color: #ffffff80
}

input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0
}

input[type=number] {
  -moz-appearance: textfield
}

label {
  display: block;
  padding: 6px;
  text-align: left;
  font-size: .85em;

  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

label:has(input[type=checkbox]) {
  cursor: pointer;
}
</style>
