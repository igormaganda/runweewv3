const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "runweekv3",
  user: "runweekv3_user",
  password: "rwv3_secret_2024\!"
});

const editorials = [
  {
    title: "Entraînement par Intervalles : Maximisez Votre Performance",
    slug: 'entrainement-par-intervalles-maximisez-votre-performance',
    category: 'entrainement',
    content: 'L\'entraînement par intervalles, souvent appelé HIIT, est une méthode éprouvée pour améliorer significativement vos performances en course à pied. Cette technique alterne entre des périodes d\'effort intense et des phases de récupération active, permettant à votre corps de s\'adapter à des intensités croissantes. Les bases physiologiques de l\'entraînement par intervalles reposent sur l\'amélioration de la VO2 max et du seuil anaérobie. En travaillant régulièrement par intervalles, vous pouvez augmenter ces indicateurs de 10 à 15% en seulement 8 à 12 semaines. Pour intégrer les intervalles dans votre programme, commencez progressivement. Une séance type pour un coureur intermédiaire pourrait consister en un échauffement de 15 minutes, suivi de 6 à 8 intervalles de 3 minutes à 85-90% de votre fréquence cardiaque maximale, entrecoupés de 2 minutes de récupération active. Terminez par 10 minutes de retour au calme. Les intervalles courts de 30 secondes à 1 minute améliorent la puissance et la vitesse pure, tandis que les intervalles longs de 3 à 5 minutes développent l\'endurance à allure spécifique. Attention cependant à ne pas abuser de cette méthode. L\'entraînement par intervalles est très exigeant pour le système nerveux central et les muscles. Deux à trois séances par semaine maximum suffisent amplement. Écoutez votre corps et respectez les jours de récupération. Gardez un journal d\'entraînement pour noter vos temps, vos sensations et votre progression. Vous serez surpris de voir à quelle vitesse votre corps s\'adapte. L\'entraînement par intervalles n\'est pas facile, mais les résultats en valent largement la peine. Continuez à vous pousser, restez constant, et vous verrez des transformations remarquables dans vos capacités athlétiques.',
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200',
    intensity_level: 7
  },
