const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ msg: "Accès interdit: rôle insuffisant" })
    }

    const role = typeof req.user.role === "string" ? req.user.role.toLowerCase() : ""
    const normalizedRoles = allowedRoles.map((r) => r.toLowerCase())

    if (role === "dpo" || normalizedRoles.includes(role)) {
      return next()
    }

    return res.status(403).json({ msg: "Accès interdit: rôle insuffisant" })
  }
}

module.exports = authorize
