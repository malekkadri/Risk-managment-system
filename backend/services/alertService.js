const db = require("../config/db")

async function checkAlerts() {
  try {
    // Vérifier les traitements sans base légale claire
    const [traitementsSansBase] = await db.query(`
      SELECT * FROM Traitement 
      WHERE base_legale IS NULL OR base_legale = '' 
      OR statut_conformite = 'Non conforme'
    `)

    for (const traitement of traitementsSansBase) {
      await createAlert(
        "Traitement non conforme détecté",
        `Le traitement "${traitement.nom}" nécessite une attention immédiate`,
        "Critique",
        traitement.id,
        null,
        traitement.utilisateur_id,
      )
    }

    // Vérifier les mesures correctives en retard
    const [mesuresEnRetard] = await db.query(`
      SELECT mc.*, r.traitement_id 
      FROM MesureCorrective mc
      JOIN Risque r ON mc.risque_id = r.id
      WHERE mc.date_echeance < CURDATE() 
      AND mc.statut != 'Terminée'
    `)

    for (const mesure of mesuresEnRetard) {
      await createAlert(
        "Mesure corrective en retard",
        `La mesure "${mesure.description}" est en retard`,
        "Attention",
        mesure.traitement_id,
        mesure.risque_id,
        mesure.responsable_id,
      )
    }

    // Vérifier les risques critiques non traités
    const [risquesCritiques] = await db.query(`
      SELECT * FROM Risque 
      WHERE score_risque >= 60 
      AND statut = 'Identifié'
    `)

    for (const risque of risquesCritiques) {
      await createAlert(
        "Risque critique non traité",
        `Un risque critique a été identifié et nécessite une action immédiate`,
        "Critique",
        risque.traitement_id,
        risque.id,
        null,
      )
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des alertes:", error)
  }
}

async function createAlert(titre, message, type, traitementId, risqueId, utilisateurId) {
  try {
    // Vérifier si l'alerte existe déjà
    const [existing] = await db.query(
      `
      SELECT id FROM Alerte 
      WHERE titre = ? AND traitement_id = ? AND risque_id = ?
      AND cree_le > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `,
      [titre, traitementId, risqueId],
    )

    if (existing.length === 0) {
      await db.query(
        `
        INSERT INTO Alerte (titre, message, type_alerte, traitement_id, risque_id, utilisateur_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [titre, message, type, traitementId, risqueId, utilisateurId],
      )
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'alerte:", error)
  }
}

module.exports = { checkAlerts, createAlert }
