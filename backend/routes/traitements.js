const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const { evaluateRisk } = require("../services/riskAssessment")
const multer = require("multer")
const XLSX = require("xlsx")

const upload = multer({ storage: multer.memoryStorage() })

// Obtenir tous les traitements avec filtres
router.get(
  "/",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  try {
    const { pole, statut, base_legale, search } = req.query

    let query = `
      SELECT t.*, u.nom as nom_utilisateur,
      COUNT(r.id) as nombre_risques,
      AVG(r.score_risque) as score_moyen_risque
      FROM Traitement t
      LEFT JOIN Utilisateur u ON t.utilisateur_id = u.id
      LEFT JOIN Risque r ON t.id = r.traitement_id
      WHERE 1=1
    `
    const params = []

    if (pole) {
      query += " AND t.pole = ?"
      params.push(pole)
    }
    if (statut) {
      query += " AND t.statut_conformite = ?"
      params.push(statut)
    }
    if (base_legale) {
      query += " AND t.base_legale = ?"
      params.push(base_legale)
    }
    if (search) {
      query += " AND (t.nom LIKE ? OR t.finalite LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    query += " GROUP BY t.id ORDER BY t.cree_le DESC"

    const [traitements] = await db.query(query, params)
    res.json(traitements)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Obtenir un traitement par ID avec ses risques
router.get(
  "/:id",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  try {
    const [traitement] = await db.query(
      `
      SELECT t.*, u.nom as nom_utilisateur 
      FROM Traitement t
      LEFT JOIN Utilisateur u ON t.utilisateur_id = u.id
      WHERE t.id = ?
    `,
      [req.params.id],
    )

    if (!traitement.length) {
      return res.status(404).json({ msg: "Traitement non trouvé" })
    }

    const [risques] = await db.query(
      `
      SELECT r.*, COUNT(mc.id) as nombre_mesures
      FROM Risque r
      LEFT JOIN MesureCorrective mc ON r.id = mc.risque_id
      WHERE r.traitement_id = ?
      GROUP BY r.id
    `,
      [req.params.id],
    )

    res.json({ ...traitement[0], risques })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Créer un traitement
router.post(
  "/",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  const {
    nom,
    pole,
    base_legale,
    finalite,
    duree_conservation,
    type_dcp,
    nombre_personnes_concernees,
    transfert_hors_ue,
    mesures_securite,
  } = req.body

  try {
    const [result] = await db.query(
      `
      INSERT INTO Traitement (
        nom, pole, base_legale, finalite, duree_conservation, type_dcp,
        nombre_personnes_concernees, transfert_hors_ue, mesures_securite, utilisateur_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        nom,
        pole,
        base_legale,
        finalite,
        duree_conservation,
        type_dcp,
        nombre_personnes_concernees,
        transfert_hors_ue,
        mesures_securite,
        req.user.id,
      ],
    )

    // Évaluation automatique du risque
    const riskEvaluation = await evaluateRisk(result.insertId)
    if (riskEvaluation) {
      await db.query(
        `
        INSERT INTO Risque (traitement_id, type_risque, criticite, probabilite, impact, date_analyse)
        VALUES (?, 'Conformité', ?, ?, ?, CURDATE())
      `,
        [result.insertId, riskEvaluation.criticite, riskEvaluation.probabilite, riskEvaluation.impact],
      )
    }

    // Journal de l'action
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, traitement_id, action, details)
      VALUES (?, ?, 'Création', 'Nouveau traitement créé')
    `,
      [req.user.id, result.insertId],
    )

    const [newTraitement] = await db.query("SELECT * FROM Traitement WHERE id = ?", [result.insertId])
    res.status(201).json(newTraitement[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Mettre à jour un traitement
router.put(
  "/:id",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  const {
    nom,
    pole,
    base_legale,
    finalite,
    duree_conservation,
    type_dcp,
    nombre_personnes_concernees,
    transfert_hors_ue,
    mesures_securite,
    statut_conformite,
  } = req.body

  try {
    await db.query(
      `
      UPDATE Traitement SET 
      nom = ?, pole = ?, base_legale = ?, finalite = ?, duree_conservation = ?,
      type_dcp = ?, nombre_personnes_concernees = ?, transfert_hors_ue = ?,
      mesures_securite = ?, statut_conformite = ?
      WHERE id = ?
    `,
      [
        nom,
        pole,
        base_legale,
        finalite,
        duree_conservation,
        type_dcp,
        nombre_personnes_concernees,
        transfert_hors_ue,
        mesures_securite,
        statut_conformite,
        req.params.id,
      ],
    )

    // Journal de l'action
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, traitement_id, action, details)
      VALUES (?, ?, 'Modification', 'Traitement mis à jour')
    `,
      [req.user.id, req.params.id],
    )

    const [updatedTraitement] = await db.query("SELECT * FROM Traitement WHERE id = ?", [req.params.id])
    res.json(updatedTraitement[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Supprimer un traitement
router.delete(
  "/:id",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur"),
  async (req, res) => {
  try {
    await db.query("DELETE FROM Traitement WHERE id = ?", [req.params.id])

    // Journal de l'action
    await db.query(
      `
      INSERT INTO JournalAction (utilisateur_id, action, details)
      VALUES (?, 'Suppression', 'Traitement supprimé (ID: ${req.params.id})')
    `,
      [req.user.id],
    )

    res.json({ msg: "Traitement supprimé" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
  },
)

// Importer des traitements depuis un fichier Excel
router.post(
  "/import",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Collaborateur", "Rapport"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "Aucun fichier fourni" })
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" })

      for (const row of rows) {
        const nom = row["Nom du Traitement"]
        if (!nom) continue

        const pole = row["Nom de l'organisation"] || null
        const finalite = row["Finalité (Description)"] || null

        const baseLegaleText = (row["Base Légale"] || "").toLowerCase()
        let base_legale = null
        if (baseLegaleText.includes("obligation")) base_legale = "Obligation légale"
        else if (baseLegaleText.includes("contrat")) base_legale = "Contrat"
        else if (baseLegaleText.includes("légitime")) base_legale = "Intérêt légitime"
        else if (baseLegaleText.includes("consent")) base_legale = "Consentement"
        else if (baseLegaleText.includes("intérêt vital")) base_legale = "Intérêt vital"
        else if (baseLegaleText.includes("mission")) base_legale = "Mission publique"

        const type_dcp = row["Catégories de données personnelles collectées"] || null
        const dureeText = row["Durée de conservation"] || ""
        const dureeMatch = dureeText.match(/\d+/)
        const duree_conservation = dureeMatch ? parseInt(dureeMatch[0], 10) : null
        const transfert_hors_ue = /oui/i.test(
          row["Transfert hors UE \r\n(O/N + PAYS + GARANTIES)"] || "",
        )
        const mesures_securite = row["Mesures de sécurité (Description)"] || null
        const statut_conformite = /oui/i.test(
          row["Conformité RGPD (O/N + Explication)"] || "",
        )
          ? "Conforme"
          : "Non conforme"

        await db.query(
          `
          INSERT INTO Traitement (
            nom, pole, base_legale, finalite, duree_conservation, type_dcp,
            nombre_personnes_concernees, transfert_hors_ue, mesures_securite, statut_conformite
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            pole=VALUES(pole),
            base_legale=VALUES(base_legale),
            finalite=VALUES(finalite),
            duree_conservation=VALUES(duree_conservation),
            type_dcp=VALUES(type_dcp),
            nombre_personnes_concernees=VALUES(nombre_personnes_concernees),
            transfert_hors_ue=VALUES(transfert_hors_ue),
            mesures_securite=VALUES(mesures_securite),
            statut_conformite=VALUES(statut_conformite)
        `,
          [
            nom,
            pole,
            base_legale,
            finalite,
            duree_conservation,
            type_dcp,
            0,
            transfert_hors_ue,
            mesures_securite,
            statut_conformite,
          ],
        )
      }

      res.json({ msg: "Import terminé", count: rows.length })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Erreur serveur")
    }
  },
)

module.exports = router
