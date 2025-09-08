require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const db = require("./config/db")
const { checkAlerts } = require("./services/alertService")

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Test de la connexion à la base de données
db.getConnection()
  .then((connection) => {
    console.log("MySQL Connected...")
    connection.release()
  })
  .catch((err) => console.error("Error connecting to MySQL:", err))

// Tâche cron pour vérifier les alertes toutes les heures
cron.schedule("0 * * * *", () => {
  console.log("Vérification des alertes...")
  checkAlerts()
})

// Routes
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT app_name FROM ApplicationSettings LIMIT 1")
    const appName = rows.length > 0 ? rows[0].app_name : "Smart DPO"
    res.send(`${appName} API is running...`)
  } catch (err) {
    res.send("API is running...")
  }
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/traitements", require("./routes/traitements"))
app.use("/api/risques", require("./routes/risques"))
app.use("/api/mesures", require("./routes/mesures"))
app.use("/api/journal", require("./routes/journal"))
app.use("/api/alertes", require("./routes/alertes"))
app.use("/api/rapports", require("./routes/rapports"))
app.use("/api/dashboard", require("./routes/dashboard"))
app.use("/api/settings", require("./routes/settings"))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
