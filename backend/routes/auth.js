const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../config/db")

// UC01: Se connecter à l'application
router.post("/login", async (req, res) => {
  const { email, mot_de_passe } = req.body

  if (!email || !mot_de_passe) {
    return res.status(400).json({ msg: "Veuillez entrer tous les champs" })
  }

  try {
    const [rows] = await db.query("SELECT * FROM Utilisateur WHERE email = ?", [email])
    const user = rows[0]

    if (!user) {
      return res.status(400).json({ msg: "Identifiants invalides" })
    }

    // Dans une vraie app, comparez le hash. Ici, on simule.
    // const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    // if(!isMatch) return res.status(400).json({ msg: 'Identifiants invalides' });

    // Pour ce PoC, on ne compare pas le mot de passe hashé.
    console.log("Avertissement: La vérification du mot de passe est désactivée pour la démo.")

    const payload = {
      user: {
        id: user.id,
        nom: user.nom,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err
      res.json({ token, user: payload.user })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
