<script setup lang="ts">
import type { Event } from "~/composables/use-fetch-data"

const currentEvent = useState<Event>("currentEvent")

const startDate = currentEvent.value.start_date
const endDate = currentEvent.value.end_date

const startDateStr = startDate.toLocaleDateString("fr-CH", {
  weekday: "long",
  day: "numeric",
  month: startDate.getMonth() !== endDate.getMonth() ? "long" : undefined,
}).replace(",", "")

const endDateStr = endDate.toLocaleDateString("fr-CH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).replace(",", "")

const extraDay = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
const extraDayStr = extraDay.toLocaleDateString("fr-CH", {
  weekday: "long",
  day: "numeric",
}).replace(",", "")

const video = ref<HTMLVideoElement>()
onMounted(() => {
  if (video.value)
    video.value.playbackRate = 1.5
})
</script>

<template>
  <div class="about">
    <p>Le <strong>Vounaise Festival</strong> est un petit festival entre potes avec musique, pétanque et grillades.</p>

    <p>
      <NuxtLink class="button" to="/inscription">Prendre des billets</NuxtLink>
    </p>

    <p class="large"><strong>Les places sont limitées&nbsp;!</strong></p>

    <h2>Quand</h2>
    <p>Du <strong>{{ startDateStr }}</strong> au <strong>{{ endDateStr }}</strong>, ainsi que le {{ extraDayStr }}
      durant la journée pour les motivé·e·x·s.</p>

    <h2>Où</h2>
    <p>Dans une cabane dans la forêt, entre Cheyres et Murist. Le lieu exact sera communiqué peu de temps avant le début
      de l'évènement.</p>

    <img src="~/assets/images/molkky.webp" alt="Mölkky">

    <h2>Quoi</h2>
    <p><strong>Durant la journée</strong>&nbsp;: tournois de pétanque, ping-pong, cartes, grillades, musique, baignade
      (le lac est à 10 min en voiture, 1 heure à pied).</p>

    <img src="~/assets/images/ping.webp" alt="ping-pong">

    <p><strong>Durant la nuit</strong>&nbsp;: système son et table de mixage à disposition pour DJs de tous les
      horizons. Tous les styles de musique sont autorisés&nbsp;! Faites-nous savoir si vous êtes intéressé·e·x·s à
      mixer.</p>

    <video ref="video" autoplay loop muted>
      <source src="~/assets/videos/fiesta.mp4" type="video/mp4">
    </video>

    <h2>Manger</h2>

    <p><strong>Vendredi soir et samedi soir</strong>&nbsp;: un <strong>grand grill</strong> est à disposition.
      Chacun amène ses <strong>propres trucs à griller</strong>. Le samedi soir, il y aura quelques salades en guise
      d'accompagnement.</p>

    <p><strong>Samedi midi et dimanche midi</strong>&nbsp;: deux repas sont proposés par notre super cheffe cuisto.
      Ces deux repas sont <strong>végans</strong> et coutent chacun CHF 5.</p>

    <img src="~/assets/images/manger.webp" alt="manger">

    <h2>Boire</h2>
    <p>Bières, Pastis et autres jus seront proposés à des prix abordables.</p>

    <h2>Dormir</h2>
    <p>Le dortoir est assez petit et est donc <strong>réservé en priorité aux organisateur·rice·x·s</strong>.
      Il est possible d'y installer une tente dans le gazon. Il est évidemment possible de dormir dans une
      voiture, sur une table, sous un arbre, ne pas dormir, etc.</p>
    <p>Plus de détails sur les places disponibles seront donnés peu avant l'évènement, en fonction du nombre de
      personnes inscrit·e·x·s.</p>

    <h2>Alain Berset</h2>
    <p>Il est invité.</p>

    <p>
      <NuxtLink class="button" to="/inscription">Prendre des billets</NuxtLink>
    </p>

    <img src="~/assets/images/sieste.webp" alt="sieste">
  </div>
</template>

<style scoped>
.about {
  text-align: center;
}

.about > *:not(img, video) {
  transform: skew(-5deg);
}

img, video {
  max-width: min(600px, 100%);
  transform: skew(-3deg);
}

h2 {
  font-weight: normal;
  text-transform: uppercase;
}

p {
  text-align: justify;
  max-width: 600px;
  margin: 1em auto;

  &:first-child {
    margin-top: 0;
  }

  &:has(a) {
    text-align: center;
  }

  &.large {
    margin-top: -1em;
    margin-bottom: 2em;
    font-size: 1.2em;
    text-align: center;
  }
}

strong {
  font-weight: normal;
  color: #dd7df3;
}

button, .button {
  margin: 2em auto;
}
</style>
