const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

// Obtenir toutes les alertes
router.get(
  "/",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  try {
    const [alertes] = await db.query(`
      SELECT a.*, t.nom as nom_traitement, u.nom as nom_utilisateur
      FROM Alerte a
      LEFT JOIN Traitement t ON a.traitement_id = t.id
      LEFT JOIN Utilisateur u ON a.utilisateur_id = u.id
      ORDER BY a.cree_le DESC
    `)
    res.json(alertes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Marquer une alerte comme lue
router.put(
  "/:id/read",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  try {
    await db.query("UPDATE Alerte SET lu = TRUE WHERE id = ?", [req.params.id])
    res.json({ msg: "Alerte marquée comme lue" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

module.exports = router
