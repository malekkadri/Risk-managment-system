const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const PDFDocument = require("pdfkit")
const XLSX = require("xlsx")

// Générer un rapport de conformité
router.get("/conformite", auth, authorize("Admin", "DPO", "SuperAdmin"), async (req, res) => {
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

// Exporter en PDF
router.get("/conformite/pdf", auth, authorize("Admin", "DPO", "SuperAdmin"), async (req, res) => {
  try {
    const [traitements] = await db.query(`
      SELECT t.*, COUNT(r.id) as nombre_risques
      FROM Traitement t
      LEFT JOIN Risque r ON t.id = r.traitement_id
      GROUP BY t.id
      ORDER BY t.statut_conformite, t.nom
    `)

    const doc = new PDFDocument()
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=rapport-conformite.pdf")

    doc.pipe(res)

    doc.fontSize(20).text("Rapport de Conformité RGPD", 100, 100)
    doc.fontSize(12).text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 100, 130)

    let y = 160
    traitements.forEach((traitement) => {
      doc.text(`${traitement.nom} - ${traitement.statut_conformite}`, 100, y)
      y += 20
    })

    doc.end()
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Exporter en Excel
router.get("/conformite/excel", auth, authorize("Admin", "DPO", "SuperAdmin"), async (req, res) => {
  try {
    const [traitements] = await db.query(`
      SELECT t.nom, t.pole, t.base_legale, t.statut_conformite, t.duree_conservation,
             COUNT(r.id) as nombre_risques, AVG(r.score_risque) as score_moyen
      FROM Traitement t
      LEFT JOIN Risque r ON t.id = r.traitement_id
      GROUP BY t.id
    `)

    const ws = XLSX.utils.json_to_sheet(traitements)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Conformité RGPD")

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=rapport-conformite.xlsx")
    res.send(buffer)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
