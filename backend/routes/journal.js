const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

// Obtenir l'historique des actions
router.get("/", auth, authorize("admin", "dpo", "super admin"), async (req, res) => {
  try {
    const [actions] = await db.query(`
      SELECT ja.*, u.nom as nom_utilisateur, t.nom as nom_traitement
      FROM JournalAction ja
      LEFT JOIN Utilisateur u ON ja.utilisateur_id = u.id
      LEFT JOIN Traitement t ON ja.traitement_id = t.id
      ORDER BY ja.date_action DESC
      LIMIT 100
    `)
    res.json(actions)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
