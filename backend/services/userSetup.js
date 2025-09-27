const db = require("../config/db")

const REQUIRED_ROLE_VALUES = [
  "dpo",
  "admin",
  "responsable du traitement",
  "super admin",
  "sous traitant",
]

function extractEnumValues(typeDefinition) {
  if (!typeDefinition) {
    return []
  }

  const matches = [...typeDefinition.matchAll(/'([^']+)'/g)]
  return matches.map((match) => match[1])
}

async function ensureRoleEnumValues() {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM Utilisateur LIKE 'role'")

    if (!rows || rows.length === 0) {
      return
    }

    const columnType = rows[0].Type
    const existingValues = extractEnumValues(columnType)

    const missingValues = REQUIRED_ROLE_VALUES.filter((role) => !existingValues.includes(role))

    if (missingValues.length === 0) {
      return
    }

    const mergedValues = Array.from(new Set([...existingValues, ...REQUIRED_ROLE_VALUES]))
    const enumDefinition = mergedValues.map((role) => db.escape(role)).join(", ")

    await db.query(`ALTER TABLE Utilisateur MODIFY role ENUM(${enumDefinition}) NOT NULL`)

    console.log(
      `Mise à jour du champ Utilisateur.role pour inclure les rôles manquants: ${missingValues.join(", ")}`,
    )
  } catch (error) {
    console.error("Erreur lors de la vérification des rôles autorisés:", error)
  }
}

module.exports = {
  ensureRoleEnumValues,
}
