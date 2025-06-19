<script setup lang="ts">
import type { Event } from "~/composables/use-fetch-data"

const { session, clear: clearSession, fetch: refreshSession } = useUserSession()

const currentEvent = useState<Event>("currentEvent")
const registration = await useFetchRegistration(session.value?.registration as number)

const hasDiscount = registration.tickets.length >= 2

const total = registration.tickets.reduce((acc, ticket) => acc + ticket.price, 0) +
  registration.meals.reduce((acc, ticket) => acc + ticket.price, 0) +
  (hasDiscount ? currentEvent.value.ticket_discount : 0) +
  registration.discount

const twintCode = `vounaise${currentEvent.value.start_date.getFullYear()} ${registration.hash.slice(0, 10)}`

async function editRegistration() {
  await $fetch("/api/login", { method: "post", headers: { "Authorization": generateBasicAuth("", registration.hash) } })
  await refreshSession()
}
</script>

<template>
  <p>Tu es inscrit·e·x au festival&nbsp;! 🎉</p>

  <p>Afin de pouvoir se coordonner, nous te recommander de rejoindre notre groupe WhatsApp.</p>

  <p><a class="button whatsapp" :href="currentEvent.chat_group">groupe WhatsApp</a></p>

  <p v-if="!registration.has_paid">Pour confirmer ton inscription et réserver ta place, il ne te reste
    plus qu'à payer le montant ci-dessous à un organisateur·rice·x.</p>

  <p v-else>Tu as déjà payé et ton inscription est confirmée.</p>

  <table>
    <tbody>
    <tr v-for="ticket in registration.tickets" :key="ticket.id">
      <th>Billet {{ ticket.name }}</th>
      <td>{{ ticket.price.toFixed(2) }}</td>
    </tr>
    <tr v-for="meal in registration.meals" :key="meal.id">
      <th>{{ meal.name }}</th>
      <td>{{ meal.price.toFixed(2) }}</td>
    </tr>
    <tr v-if="hasDiscount">
      <th>Rabais deux jours</th>
      <td>{{ currentEvent.ticket_discount.toFixed(2) }}</td>
    </tr>
    <tr v-if="registration.discount !== 0" class="special-discount">
      <th>Rabais spécial</th>
      <td>{{ registration.discount.toFixed(2) }}</td>
    </tr>
    <tr class="total">
      <th>Total</th>
      <td>CHF {{ total.toFixed(2) }}</td>
    </tr>
    </tbody>
  </table>

  <template v-if="!registration.has_paid">
    <p>Tu peux payer immédiatemment via TWINT avec les coordonnées suivantes&nbsp;:</p>

    <table>
      <tbody>
      <tr>
        <th>Montant</th>
        <td>CHF {{ total.toFixed(2) }}</td>
      </tr>
      <tr>
        <th>Numéro</th>
        <td>{{ currentEvent.twint_number }}</td>
      </tr>
      <tr>
        <th>Prénom, nom</th>
        <td>{{ currentEvent.twint_name }}</td>
      </tr>
      <tr>
        <th>Message</th>
        <td>{{ twintCode }}</td>
      </tr>
      </tbody>
    </table>
  </template>

  <div class="buttons">
    <button v-if="!registration.has_paid" @click="editRegistration()">Modifier mon inscription</button>
    <button @click="clearSession()">Recommencer une inscription</button>
  </div>
</template>

<style scoped>
p {
  text-align: center;
}

table {
  margin: auto;
  border-collapse: collapse;
  background-color: #fff2;
}

th, td {
  text-align: left;
  padding: 0.4em 0.7em;
}

th {
  color: #bdfa
}

td:last-child {
  min-width: 4em;
  text-align: right;
}

tr.total td, tr.total th {
  border-top: 1px solid #bdfa;
}

.whatsapp {
  margin: 1em auto;
  background-color: #00a884;

  &::before {
    --icon-size: 1em;
    content: "";
    height: var(--icon-size);
    width: var(--icon-size);
    margin-right: 0.5em;
    background-image: url("~/assets/images/whatsapp.svg");
    background-size: var(--icon-size) var(--icon-size);
  }

  &:hover:not(:disabled) {
    background-color: #36d1ae;
  }
}

.buttons {
  margin: 2em auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.special-discount :is(th, td) {
  color: mediumspringgreen;
}
</style>
