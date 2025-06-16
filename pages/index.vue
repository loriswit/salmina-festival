<template>
  <div class="about">
    <p>Le <strong>Salmina Festival</strong> est un petit festival entre potes avec musique, pétanque et grillades.
    </p>

    <p>
      <NuxtLink class="button" to="/inscription">Prendre des billets</NuxtLink>
    </p>

    <p class="large"><strong>Les places sont limitées&nbsp;!</strong></p>

    <h2>Quand</h2>
    <p>Du <strong>vendredi 19 au samedi 20 juillet 2024</strong>, ainsi que le dimanche 21 durant la journée pour
      les motivés.</p>

    <h2>Où</h2>
    <p>Dans une cabane dans la forêt, entre Cheyres et Murist. Le lieu exact sera donné peu de temps avant le début
      de l'évènement.</p>

    <h2>Quoi</h2>
    <p><strong>Durant la journée</strong>&nbsp;: tournois de pétanque, ping-pong, grillades, musique, baignade (le
      lac est à 10 min en voiture, 1 heure à pied).</p>

    <p><strong>Durant la nuit</strong>&nbsp;: système son et table de mixage à disposition pour DJs de tous les
      horizons. Tous les
      styles de musique sont autorisés&nbsp;!
      Faites-nous savoir si vous êtes intéressés à mixer.</p>

    <img src="~/assets/images/petanque.webp" alt="pétanque">

    <h2>Manger</h2>
    <p>Plusieurs repas proposés par notre super chef cuisto tout au long du weekend. Tous les repas sont <strong>végétariens</strong>
      et chacun
      coute CHF 5.</p>
    <p>Pour ceux qui le souhaitent, un <strong>grand grill</strong> avec broches motorisées est à disposition.
      Chacun amène sa propre bidoche (possibilité de se coordonner à plusieurs).</p>

    <img src="~/assets/images/manger.webp" alt="manger">

    <h2>Boire</h2>
    <p>Bières, Pastis et autres jus seront proposés à des prix abordables.</p>

    <h2>Dormir</h2>
    <p>Le dortoir est assez petit et est donc <strong>réservé en priorité aux organisateurs et aux
      collaborateurs</strong> (cuisine, artistes, etc.).
      Il est possible d'y installer une tente dans le gazon. Il est évidemment possible de dormir dans une
      voiture, sur une table, sous un arbre, ne pas dormir, etc.</p>
    <p>Plus de détails sur les places disponibles seront donnés peu avant l'évènement, en fonction du nombre de
      personnes inscrites.</p>

    <h2>Alain Berset</h2>
    <p>Il est invité.</p>

    <p>
      <NuxtLink class="button" to="/inscription">Prendre des billets</NuxtLink>
    </p>

    <video autoplay loop muted>
      <source src="~/assets/videos/boumboum.mp4" type="video/mp4">
    </video>
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
  color: #ec7d9e;
}

button, .button {
  margin: 2em auto;
}
</style>
