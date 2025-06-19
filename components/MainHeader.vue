<script setup lang="ts">
const currentEvent = useState("currentEvent")

const startDate = currentEvent.value.start_date
const endDate = currentEvent.value.end_date

const startDateStr = startDate.toLocaleDateString("fr-CH", {
  day: "numeric",
  month: startDate.getMonth() !== endDate.getMonth() ? "long" : undefined,
})
const endDateStr = endDate.toLocaleDateString("fr-CH", {
  day: "numeric",
  month: "long",
})

const year = startDate.getFullYear()
</script>

<template>
  <div class="main-header"><h1>
    <span>Vounaise</span>
    <span>Festival</span>
    <span>{{ year }}</span>
  </h1>
    <div class="info">
      <p>{{ startDateStr }} &ndash; {{ endDateStr }}</p>
    </div>
  </div>
</template>

<style scoped>
.main-header {
  text-shadow: 0 0 1em #fff6;
  text-align: center;
  max-width: 80%;
  margin: auto;
}

h1 {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 3em;
  letter-spacing: 0.1em;
  margin-right: -0.1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1em;
  transform: skew(-5deg);

  > span:first-child {
    font-size: 0.96em;
    letter-spacing: 0.04em;
    line-height: 0.6em;
  }

  > span:last-child {
    font-size: 1.7em;
    letter-spacing: 0.15em;
    margin-right: -0.15em;
  }
}

.info {
  text-align: center;
  font-size: 1.8em;
  max-width: 620px;
  margin: auto;
}

.info p, form p {
  transform: skew(-5deg);
}
</style>
