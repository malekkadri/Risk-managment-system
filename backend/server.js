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
app.get("/", (req, res) => {
  res.send("Smart DPO API is running...")
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
