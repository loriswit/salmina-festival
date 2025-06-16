<script setup lang="ts">
import { FetchError } from "ofetch"
import { type Event, useFetchEvent } from "~/composables/use-fetch-data"
import "~/assets/styles/main.css"

const currentEvent = useState<Event>("currentEvent")

await callOnce(async () => {
  currentEvent.value = await useFetchEvent()
})

onErrorCaptured(error => {
  if (error instanceof FetchError && (error.status === 401 || error.status === 403)) {
    useUserSession().clear()
    return false
  }
})

useHead({ title: currentEvent.value.name })
</script>

<template>
  <NuxtRouteAnnouncer/>
  <header>
    <MainHeader/>
  </header>
  <main>
    <NuxtPage/>
  </main>
</template>

<style>
main {
  padding: 1em;
}
</style>
