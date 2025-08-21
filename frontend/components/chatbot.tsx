"use client"

import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: newMessages,
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
      >
        {open ? "×" : "?"}
      </button>
    </div>
  )
}

