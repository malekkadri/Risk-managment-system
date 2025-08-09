const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const db = require("../config/db")
const auth = require("../middleware/auth")

// Obtenir tous les utilisateurs
router.get("/", auth, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, nom, role, email, actif, cree_le FROM Utilisateur ORDER BY nom")
    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Créer un utilisateur
router.post("/", auth, async (req, res) => {
  const { nom, role, email, mot_de_passe } = req.body

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existing] = await db.query("SELECT id FROM Utilisateur WHERE email = ?", [email])
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Cet email est déjà utilisé" })
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt)

    const [result] = await db.query("INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES (?, ?, ?, ?)", [
      nom,
      role,
      email,
      hashedPassword,
    ])

    const [newUser] = await db.query("SELECT id, nom, role, email, actif, cree_le FROM Utilisateur WHERE id = ?", [
      result.insertId,
    ])

    res.status(201).json(newUser[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Mettre à jour un utilisateur
router.put("/:id", auth, async (req, res) => {
  const { nom, role, email, actif } = req.body

  try {
    await db.query("UPDATE Utilisateur SET nom = ?, role = ?, email = ?, actif = ? WHERE id = ?", [
      nom,
      role,
      email,
      actif,
      req.params.id,
    ])

    const [updatedUser] = await db.query("SELECT id, nom, role, email, actif, cree_le FROM Utilisateur WHERE id = ?", [
      req.params.id,
    ])

    res.json(updatedUser[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
