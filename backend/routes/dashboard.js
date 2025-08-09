const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")

// Statistiques générales du tableau de bord
router.get("/stats", auth, async (req, res) => {
  try {
    // Nombre total de traitements
    const [totalTraitements] = await db.query("SELECT COUNT(*) as total FROM Traitement")

    // Répartition par statut de conformité
    const [conformite] = await db.query(`
      SELECT statut_conformite, COUNT(*) as count 
      FROM Traitement 
      GROUP BY statut_conformite
    `)

    // Nombre de risques par criticité
    const [risques] = await db.query(`
      SELECT 
        CASE 
          WHEN score_risque >= 80 THEN 'Critique'
          WHEN score_risque >= 60 THEN 'Élevé'
          WHEN score_risque >= 40 THEN 'Moyen'
          ELSE 'Faible'
        END as niveau,
        COUNT(*) as count
      FROM Risque 
      GROUP BY niveau
    `)

    // Mesures correctives par statut
    const [mesures] = await db.query(`
      SELECT statut, COUNT(*) as count 
      FROM MesureCorrective 
      GROUP BY statut
    `)

    // Alertes non lues
    const [alertes] = await db.query("SELECT COUNT(*) as total FROM Alerte WHERE lu = FALSE")

    // Répartition par pôle
    const [poles] = await db.query(`
      SELECT pole, COUNT(*) as count 
      FROM Traitement 
      WHERE pole IS NOT NULL 
      GROUP BY pole
    `)

    res.json({
      totalTraitements: totalTraitements[0].total,
      conformite,
      risques,
      mesures,
      alertesNonLues: alertes[0].total,
      poles,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Évolution temporelle
router.get("/evolution", auth, async (req, res) => {
  try {
    const [evolution] = await db.query(`
      SELECT 
        DATE_FORMAT(cree_le, '%Y-%m') as mois,
        COUNT(*) as nouveaux_traitements
      FROM Traitement 
      WHERE cree_le >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(cree_le, '%Y-%m')
      ORDER BY mois
    `)

    res.json(evolution)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
