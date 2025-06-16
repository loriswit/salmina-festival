<script setup lang="ts">
const { session } = useUserSession()
</script>

<template>
  <RegistrationConfirmation v-if="session?.registered"/>
  <RegistrationForm v-else/>
</template>
