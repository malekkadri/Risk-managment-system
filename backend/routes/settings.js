const express = require("express")
const router = express.Router()
const db = require("../config/db")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

// Get application name
router.get("/app-name", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT app_name FROM ApplicationSettings LIMIT 1")
    const appName = rows.length > 0 ? rows[0].app_name : "Smart DPO"
    res.json({ appName })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

// Update application name
router.put("/app-name", auth, authorize("admin", "super admin"), async (req, res) => {
  const { appName } = req.body
  try {
    await db.query(
      "INSERT INTO ApplicationSettings (id, app_name) VALUES (1, ?) ON DUPLICATE KEY UPDATE app_name = VALUES(app_name)",
      [appName]
    )
    res.json({ appName })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Erreur serveur")
  }
})

module.exports = router
