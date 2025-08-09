const db = require("../config/db")

// Évaluation automatique des risques basée sur les critères RGPD
async function evaluateRisk(traitementId) {
  try {
    const [traitement] = await db.query("SELECT * FROM Traitement WHERE id = ?", [traitementId])

    if (!traitement.length) return null

    const t = traitement[0]
    let criticite = 1
    let probabilite = 1
    let impact = 1

    // Évaluation basée sur le type de données
    if (t.type_dcp && t.type_dcp.toLowerCase().includes("sensible")) {
      criticite += 2
      impact += 2
    }
    if (t.type_dcp && t.type_dcp.toLowerCase().includes("santé")) {
      criticite += 3
      impact += 3
    }

    // Évaluation basée sur le nombre de personnes concernées
    if (t.nombre_personnes_concernees > 1000) {
      impact += 2
      probabilite += 1
    } else if (t.nombre_personnes_concernees > 100) {
      impact += 1
    }

    // Évaluation basée sur la durée de conservation
    if (t.duree_conservation > 5) {
      criticite += 1
      probabilite += 1
    }

    // Évaluation basée sur les transferts hors UE
    if (t.transfert_hors_ue) {
      criticite += 2
      impact += 1
    }

    // Évaluation basée sur la base légale
    if (t.base_legale === "Consentement") {
      probabilite += 1 // Plus de risque de retrait
    }

    // Limiter les valeurs entre 1 et 5
    criticite = Math.min(Math.max(criticite, 1), 5)
    probabilite = Math.min(Math.max(probabilite, 1), 5)
    impact = Math.min(Math.max(impact, 1), 5)

    return { criticite, probabilite, impact }
  } catch (error) {
    console.error("Erreur lors de l'évaluation du risque:", error)
    return null
  }
}

module.exports = { evaluateRisk }
