"use client"

import { useState } from "react"
import { Bot, X } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const systemMessage = {
    role: "system" as const,
    content:
      "Tu es l'assistant du projet SBA Compta RGPD. Réponds uniquement en français, aide les utilisateurs à comprendre le fonctionnement du site et fournis des informations sur les flux et statistiques quand c'est possible.",
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    const lower = input.trim().toLowerCase()
    const token = localStorage.getItem("token")

    if (lower === "/stats") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        setMessages([...newMessages, { role: "assistant", content: JSON.stringify(data) }])
      } catch {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Impossible de récupérer les statistiques." },
        ])
      }
      return
    }

    if (lower === "/flow") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard/evolution`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        setMessages([...newMessages, { role: "assistant", content: JSON.stringify(data) }])
      } catch {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Impossible de récupérer le flux du site." },
        ])
      }
      return
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [systemMessage, ...newMessages],
        }),
      })
      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content || "Une erreur est survenue"
      setMessages([...newMessages, { role: "assistant", content: reply }])
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Erreur lors de l'appel au chatbot" },
      ])
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="bg-white shadow-lg rounded-lg w-72 h-96 flex flex-col mb-2">
          <div className="flex-1 overflow-y-auto p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 text-sm ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    m.role === "user" ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white text-sm px-2 rounded"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        aria-label="Chatbot"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </div>
  )
}

