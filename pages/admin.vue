<script setup lang="ts">
import type { Event } from "~/composables/use-fetch-data"
import "~/assets/styles/spinner.css"

defineRouteRules({ ssr: false })

const { user } = useUserSession()
if (!user || user.value?.role !== "admin")
  await navigateTo("/login?next=/admin")

const currentEvent = useState<Event>("currentEvent")
useHead({ title: "Gestion des inscriptions - " + currentEvent.value.name })

const { data: eventList } = await useFetch<Event[]>("/api/events")
const eventId = ref(currentEvent.value.id)

const isCurrentEvent = computed(() => eventList.value?.[0].id === eventId.value)

const event = ref<Event | null>()
await updateEvent()

async function updateEvent(): Promise<void> {
  event.value = null
  event.value = await useFetchEvent(eventId.value, { load: ["tickets", "meals", "registrations"] })
}

async function updateRegistration(id: number, payload: Partial<Registration>): Promise<void> {
  if (payload.hasPaid === false && !confirm("Confirmer la désinscription ?"))
    return

  await $fetch(`/api/registrations/${id}`, { method: "patch", body: payload })
  await updateEvent()
}

const registrationCode = ref("")

async function validateRegistration(): Promise<void> {
  if (!event.value || !registrationCode.value)
    return

  const hash = registrationCode.value.split(" ").pop()
  const registration = event.value.registrations
    .find(registration => !registration.has_paid && registration.hash.slice(0, 10) === hash)
  if (registration === undefined) {
    alert("Code non valide")
    return
  }

  await updateRegistration(registration.id, { hasPaid: true })
  registrationCode.value = ""
  setTimeout(() => alert("Inscription confirmée: " + registration.name), 100)
}
</script>

<template>
  <div class="registrations">
    <header>
      <h1>Inscriptions</h1>
      <form v-if="isCurrentEvent" @submit.prevent="validateRegistration()">
        <input v-model="registrationCode" type="text" placeholder="Code d'inscription" required>
        <button type="submit" :disabled="!event">a payé</button>
      </form>
      <div>
        <select v-model="eventId" @change="updateEvent">
          <option v-for="eventItem in eventList" :key="eventItem.id" :value="eventItem.id">{{ eventItem.name }}</option>
        </select>
      </div>
    </header>

    <RegistrationTables v-if="event" :event="event" @update-registration="updateRegistration"/>
    <div v-else>
      <span class="spinner"/>
    </div>
  </div>
</template>

<style scoped>
.registrations {
  background-color: #fff2;
  margin: 1em;
  padding: var(--small-gap);
  font-size: 14px;
  text-align: left;
  font-family: system-ui, sans-serif;
}

h1 {
  margin-top: 0;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  form {
    margin-bottom: var(--small-gap);
  }
}

div:has(>.spinner) {
  width: 100%;
  text-align: center;
  opacity: 50%;
  font-size: 3em;
  margin: 1em 0;
}

:deep(button), :deep(.button) {
  margin: 0;
  padding: 3px 6px;
  text-transform: none;
  transform: none;
  font-weight: bold;
}

@media (max-width: 600px) {
  .registrations {
    margin: -1rem;
  }
}
</style>
