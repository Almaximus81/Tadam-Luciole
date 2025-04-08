// Default motivational messages
export const defaultMotivationalMessages = [
  "Souviens-toi : Les petits pas sont quand même des progrès. Tu peux le faire !",
  "Tes efforts d'aujourd'hui façonnent ton succès de demain.",
  "Concentre-toi sur les progrès, pas sur la perfection.",
  "Tu n'as pas besoin d'être parfait pour être génial.",
  "Chaque tâche que tu accomplis est une victoire qui mérite d'être célébrée !",
  "Commence là où tu es, utilise ce que tu as, fais ce que tu peux.",
  "La partie la plus difficile est de commencer. Fais juste ce premier pas.",
  "Tu n'es pas en retard. Tu es exactement là où tu dois être.",
  "Ne compare pas ton chapitre 1 au chapitre 20 de quelqu'un d'autre.",
  "Célèbre les petites victoires - elles s'additionnent pour former de grandes réussites !"
];

// Default easy task suggestions
export const defaultEasyTaskSuggestions = [
  "Prends 2 minutes pour dégager ton espace de travail",
  "Remplis ta bouteille d'eau",
  "Note tes 3 priorités du jour",
  "Étire-toi pendant 1 minute",
  "Envoie ce petit email que tu repousses",
  "Trie 5 papiers sur ton bureau",
  "Prends 3 respirations profondes",
  "Programme un chronomètre pour 5 minutes de concentration",
  "Organise ton bureau virtuel",
  "Envoie un message à un ami ou un membre de ta famille",
  "Lève-toi et fais 10 jumping jacks",
  "Note une chose pour laquelle tu es reconnaissant(e)"
];

// Strategy details
export const strategies = {
  break: {
    title: 'Prendre une Courte Pause',
    description: `
      <p class="mb-3">Parfois, une pause rapide est tout ce dont tu as besoin pour retrouver ta concentration. Voici comment la rendre efficace :</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Règle une minuterie pour 5 minutes</li>
        <li>Éloigne-toi de ton bureau</li>
        <li>Bois un peu d'eau</li>
        <li>Prends quelques respirations profondes</li>
        <li>Reviens avec une perspective rafraîchie</li>
      </ul>
    `,
    tip: "Les pauses courtes peuvent augmenter la productivité jusqu'à 20%. Ton cerveau a besoin de ces moments pour traiter efficacement l'information."
  },
  smaller: {
    title: 'Découper en Petites Étapes',
    description: `
      <p class="mb-3">Les grandes tâches peuvent sembler écrasantes. Essaie de les décomposer en petites étapes :</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Identifie la plus petite première action possible</li>
        <li>Règle une minuterie pour seulement 5 minutes de travail</li>
        <li>Concentre-toi uniquement sur cette petite étape</li>
        <li>Célèbre la réalisation de chaque mini-étape</li>
        <li>Continue avec le morceau suivant</li>
      </ul>
    `,
    tip: "Pour les cerveaux TDAH, commencer est souvent la partie la plus difficile. Une fois que tu débutes par une petite étape, l'élan se construit naturellement."
  },
  different: {
    title: 'Changer de Tâche',
    description: `
      <p class="mb-3">Parfois, ton cerveau a besoin de variété. C'est OK de passer temporairement à une tâche différente :</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Choisis une tâche différente de ta liste</li>
        <li>De préférence une qui utilise des compétences mentales différentes</li>
        <li>Travaille dessus pendant 15-20 minutes</li>
        <li>Utilise cet élan pour revenir à la tâche originale</li>
        <li>Ou continue avec la nouvelle tâche si tu es dans le flow</li>
      </ul>
    `,
    tip: "Le changement de tâche peut être stratégique pour les cerveaux TDAH. Ton objectif est la productivité globale, pas de te forcer à accomplir une seule tâche quand tu es bloqué·e."
  }
};

// Congratulatory messages
export const congratsMessages = [
  "Excellent travail !",
  "Super boulot !",
  "Tu l'as fait !",
  "Continue comme ça !",
  "Tâche écrasée !",
  "Bien joué !",
  "Fantastique !",
  "Bravo !",
  "Parfait !",
  "Brillant !"
];
