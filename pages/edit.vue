<script setup lang="ts">
import { FetchError } from "ofetch"

defineRouteRules({ ssr: false })
const { fetch: refreshSession } = useUserSession()

const { query } = useRoute()

if (typeof query.token === "string") {
  try {
    await $fetch("/api/login", { method: "post", headers: { "Authorization": generateBasicAuth("", query.token) } })
    await refreshSession()
    await navigateTo("/inscription", { replace: true })
  } catch (e) {
    if (e instanceof FetchError && e.status === 401)
      throw createError({ statusCode: 401 })
    else
      throw e
  }
} else {
  throw createError({ statusCode: 401 })
}
</script>
