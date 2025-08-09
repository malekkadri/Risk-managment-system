const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")

// Obtenir tous les risques
router.get("/", auth, async (req, res) => {
  try {
    const [risques] = await db.query(`
      SELECT r.*, t.nom as nom_traitement, t.pole
      FROM Risque r
      JOIN Traitement t ON r.traitement_id = t.id
      ORDER BY r.score_risque DESC
    `)
    res.json(risques)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Créer un risque
router.post("/", auth, async (req, res) => {
  const { traitement_id, type_risque, criticite, probabilite, impact, vulnerabilites, commentaire } = req.body

  try {
    const [result] = await db.query(
      `
      INSERT INTO Risque (traitement_id, type_risque, criticite, probabilite, impact, vulnerabilites, commentaire, date_analyse)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    `,
      [traitement_id, type_risque, criticite, probabilite, impact, vulnerabilites, commentaire],
    )

    // Journal de l'action
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, traitement_id, risque_id, action, details)
      VALUES (?, ?, ?, 'Création risque', 'Nouveau risque identifié')
    `,
      [req.user.id, traitement_id, result.insertId],
    )

    const [newRisque] = await db.query("SELECT * FROM Risque WHERE id = ?", [result.insertId])
    res.status(201).json(newRisque[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Mettre à jour un risque
router.put("/:id", auth, async (req, res) => {
  const { type_risque, criticite, probabilite, impact, statut, vulnerabilites, commentaire } = req.body

  try {
    await db.query(
      `
      UPDATE Risque SET 
      type_risque = ?, criticite = ?, probabilite = ?, impact = ?, statut = ?, vulnerabilites = ?, commentaire = ?
      WHERE id = ?
    `,
      [type_risque, criticite, probabilite, impact, statut, vulnerabilites, commentaire, req.params.id],
    )

    // Journal de l'action
    const [risque] = await db.query("SELECT traitement_id FROM Risque WHERE id = ?", [req.params.id])
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, traitement_id, risque_id, action, details)
      VALUES (?, ?, ?, 'Modification risque', 'Risque mis à jour')
    `,
      [req.user.id, risque[0].traitement_id, req.params.id],
    )

    const [updatedRisque] = await db.query("SELECT * FROM Risque WHERE id = ?", [req.params.id])
    res.json(updatedRisque[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
