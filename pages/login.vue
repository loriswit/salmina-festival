<script setup lang="ts">
import { FetchError } from "ofetch"

const { fetch: refreshSession } = useUserSession()
const { query } = useRoute()

const password = ref("")
const error = ref<string | null>(null)

async function login() {
  try {
    await $fetch("/api/login", { method: "post", headers: { "Authorization": generateBasicAuth("", password.value) } })
    await refreshSession()

    const targetPage = typeof query.next === "string" ? query.next : "/"
    await navigateTo(targetPage)

  } catch (e) {
    if (e instanceof FetchError && e.status === 401)
      error.value = "Mauvais mot de passe"
    else
      throw e
  }
}
</script>

<template>
  <form @submit.prevent="login()">
    <input v-model="password" type="password" placeholder="Mot de passe" required autofocus>
    <button type="submit">Login</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<style scoped>
form {
  max-width: 300px;
  margin: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

button, input {
  padding: 0.5em 1em;
  margin: 1em auto;
}

p {
  color: palevioletred;
  text-align: center;
}
</style>
