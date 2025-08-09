"use client"

import { useEffect } from "react"

const variables = [
  "--background",
  "--foreground",
  "--primary",
  "--secondary",
  "--accent",
]

export default function ThemeLogger() {
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const logged: Record<string, string> = {}

    for (const variable of variables) {
      logged[variable] = styles.getPropertyValue(variable).trim()
    }

    console.log("[ThemeLogger] CSS variables:", logged)
  }, [])

  return null
}

