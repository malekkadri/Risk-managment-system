const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")

// Obtenir toutes les mesures correctives
router.get("/", auth, async (req, res) => {
  try {
    const [mesures] = await db.query(`
      SELECT mc.*, r.traitement_id, t.nom as nom_traitement, u.nom as nom_responsable
      FROM MesureCorrective mc
      JOIN Risque r ON mc.risque_id = r.id
      JOIN Traitement t ON r.traitement_id = t.id
      LEFT JOIN Utilisateur u ON mc.responsable_id = u.id
      ORDER BY mc.priorite DESC, mc.date_echeance ASC
    `)
    res.json(mesures)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Créer une mesure corrective
router.post("/", auth, async (req, res) => {
  const { risque_id, description, type_mesure, priorite, responsable_id, date_echeance, cout_estime } = req.body

  try {
    const [result] = await db.query(
      `
      INSERT INTO MesureCorrective (risque_id, description, type_mesure, priorite, responsable_id, date_echeance, cout_estime)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [risque_id, description, type_mesure, priorite, responsable_id, date_echeance, cout_estime],
    )

    // Journal de l'action
    const [risque] = await db.query("SELECT traitement_id FROM Risque WHERE id = ?", [risque_id])
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, traitement_id, risque_id, action, details)
      VALUES (?, ?, ?, 'Création mesure', 'Nouvelle mesure corrective ajoutée')
    `,
      [req.user.id, risque[0].traitement_id, risque_id],
    )

    const [newMesure] = await db.query("SELECT * FROM MesureCorrective WHERE id = ?", [result.insertId])
    res.status(201).json(newMesure[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Mettre à jour une mesure corrective
router.put("/:id", auth, async (req, res) => {
  const { description, type_mesure, priorite, statut, responsable_id, date_echeance, cout_estime } = req.body

  try {
    await db.query(
      `
      UPDATE MesureCorrective SET 
      description = ?, type_mesure = ?, priorite = ?, statut = ?, responsable_id = ?, date_echeance = ?, cout_estime = ?
      WHERE id = ?
    `,
      [description, type_mesure, priorite, statut, responsable_id, date_echeance, cout_estime, req.params.id],
    )

    const [updatedMesure] = await db.query("SELECT * FROM MesureCorrective WHERE id = ?", [req.params.id])
    res.json(updatedMesure[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
