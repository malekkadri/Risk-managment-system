const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const PDFDocument = require("pdfkit")
const XLSX = require("xlsx")

// Générer un rapport de conformité
router.get("/conformite", auth, authorize("Admin", "DPO", "SuperAdmin", "Rapport"), async (req, res) => {
  try {
    const [traitements] = await db.query(`
      SELECT t.*, COUNT(r.id) as nombre_risques, AVG(r.score_risque) as score_moyen
      FROM Traitement t
      LEFT JOIN Risque r ON t.id = r.traitement_id
      GROUP BY t.id
      ORDER BY t.statut_conformite, t.nom
    `)

    const rapport = {
      date_generation: new Date(),
      total_traitements: traitements.length,
      conformes: traitements.filter((t) => t.statut_conformite === "Conforme").length,
      non_conformes: traitements.filter((t) => t.statut_conformite === "Non conforme").length,
      a_verifier: traitements.filter((t) => t.statut_conformite === "À vérifier").length,
      traitements,
    }

    // Sauvegarder le rapport
    await db.query(
      `
      INSERT INTO Rapport (titre, type_rapport, contenu, genere_par)
      VALUES (?, 'Conformité', ?, ?)
    `,
      ["Rapport de Conformité RGPD", JSON.stringify(rapport), req.user.id],
    )

    res.json(rapport)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Helper to build data for a specific report type
async function buildReport(type) {
  switch (type) {
    case "conformite": {
      const [traitements] = await db.query(`
        SELECT t.nom, t.pole, t.base_legale, t.statut_conformite, t.duree_conservation,
               COUNT(r.id) as nombre_risques, AVG(r.score_risque) as score_moyen
        FROM Traitement t
        LEFT JOIN Risque r ON t.id = r.traitement_id
        GROUP BY t.id
        ORDER BY t.statut_conformite, t.nom
      `)
      return { data: traitements, title: "Rapport de Conformité RGPD" }
    }
    case "risques": {
      const [risques] = await db.query(`
        SELECT r.*, t.nom as nom_traitement, t.pole
        FROM Risque r
        JOIN Traitement t ON r.traitement_id = t.id
        ORDER BY r.score_risque DESC
      `)
      return { data: risques, title: "Analyse des Risques" }
    }
    case "activite": {
      const [actions] = await db.query(`
        SELECT ja.*, u.nom as nom_utilisateur, t.nom as nom_traitement
        FROM JournalAction ja
        LEFT JOIN Utilisateur u ON ja.utilisateur_id = u.id
        LEFT JOIN Traitement t ON ja.traitement_id = t.id
        ORDER BY ja.date_action DESC
        LIMIT 100
      `)
      return { data: actions, title: "Rapport d'Activité" }
    }
    default:
      throw new Error("Type de rapport invalide")
  }
}

// Helper to send data as PDF or Excel
function exportReport(type, format, data, title, res) {
  if (format === "pdf") {
    const doc = new PDFDocument()
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rapport-${type}.pdf`,
    )

    doc.pipe(res)

    doc.fontSize(20).text(title, 100, 100)
    doc
      .fontSize(12)
      .text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 100, 130)

    let y = 160
    if (type === "conformite") {
      data.forEach((item) => {
        doc.text(`${item.nom} - ${item.statut_conformite}`, 100, y)
        y += 20
      })
    } else if (type === "risques") {
      data.forEach((item) => {
        doc.text(
          `${item.nom_traitement} - ${item.type_risque} (${item.score_risque})`,
          100,
          y,
        )
        y += 20
      })
    } else if (type === "activite") {
      data.forEach((item) => {
        doc.text(
          `${new Date(item.date_action).toLocaleDateString("fr-FR")} - ${item.nom_utilisateur} : ${item.action}`,
          100,
          y,
        )
        y += 20
      })
    }

    doc.end()
  } else if (format === "excel") {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, title)
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rapport-${type}.xlsx`,
    )
    res.send(buffer)
  } else {
    res.status(400).send("Format non supporté")
  }
}

// Export routes for each report type
router.get(
  "/conformite/:format",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Rapport"),
  async (req, res) => {
    try {
      const { data, title } = await buildReport("conformite")
      exportReport("conformite", req.params.format, data, title, res)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Erreur serveur")
    }
  },
)

router.get(
  "/risques/:format",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Rapport"),
  async (req, res) => {
    try {
      const { data, title } = await buildReport("risques")
      exportReport("risques", req.params.format, data, title, res)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Erreur serveur")
    }
  },
)

router.get(
  "/activite/:format",
  auth,
  authorize("Admin", "DPO", "SuperAdmin", "Rapport"),
  async (req, res) => {
    try {
      const { data, title } = await buildReport("activite")
      exportReport("activite", req.params.format, data, title, res)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Erreur serveur")
    }
  },
)

module.exports = router
