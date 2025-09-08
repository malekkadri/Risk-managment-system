"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Bot, X, Send, Minus, Copy, Check, Loader2, Info } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

type Role = "user" | "assistant"
interface Message {
  role: Role
  content: string
  ts?: number
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const unread = useMemo(
    () => (!open ? messages.filter(m => m.role === "assistant").length : 0),
    [messages, open]
  )
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const systemMessage = {
    role: "system" as const,
    content:
      "Tu es l'assistant du projet SBA Compta RGPD. Réponds uniquement en français, aide les utilisateurs à comprendre le fonctionnement du site et fournis des informations sur les flux et statistiques quand c'est possible.",
  }

  // Auto-scroll on new message
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading, open, minimized])

  // Helpers
  const pretty = (val: string) => {
    // Pretty-print JSON if possible
    try {
      const parsed = JSON.parse(val)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return val
    }
  }

  const sendQuick = (cmd: string) => {
    setInput(cmd)
    setTimeout(() => handleSend(), 0)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const token = localStorage.getItem("token") || ""
    const base = [...messages, { role: "user" as Role, content: text, ts: Date.now() }]
    setMessages(base)
    setInput("")
    setLoading(true)

    const lower = text.toLowerCase()

    // Local shortcuts
    if (lower === "/stats") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        setMessages(prev => [...prev, { role: "assistant", content: JSON.stringify(data), ts: Date.now() }])
      } catch {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Impossible de récupérer les statistiques.", ts: Date.now() },
        ])
      } finally {
        setLoading(false)
      }
      return
    }

    if (lower === "/flow") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard/evolution`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        setMessages(prev => [...prev, { role: "assistant", content: JSON.stringify(data), ts: Date.now() }])
      } catch {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Impossible de récupérer le flux du site.", ts: Date.now() },
        ])
      } finally {
        setLoading(false)
      }
      return
    }

    // Chat via server proxy (no API key in browser)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [systemMessage, ...base],
        }),
      })
      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content || "Une erreur est survenue."
      setMessages(prev => [...prev, { role: "assistant", content: reply, ts: Date.now() }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Erreur lors de l'appel au chatbot.", ts: Date.now() },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMsg = async (idx: number, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1000)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Panel */}
      {open && (
        <div
          className={`bg-white dark:bg-neutral-900 shadow-xl rounded-2xl w-[360px] ${
            minimized ? "h-14" : "h-[520px]"
          } flex flex-col mb-2 border border-black/5 dark:border-white/10 transition-all`}
        >
          {/* Header */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white grid place-items-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">Assistant RGPD</div>
                <div className="text-xs text-neutral-500">
                  {loading ? "Rédaction en cours…" : "En ligne"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(v => !v)}
                className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={minimized ? "Agrandir" : "Minimiser"}
                title={minimized ? "Agrandir" : "Minimiser"}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Fermer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              {/* Tips / shortcuts */}
              {messages.length === 0 && (
                <div className="px-3 py-2 text-xs text-neutral-500 flex items-center gap-2 border-b border-black/5 dark:border-white/10">
                  <Info className="w-3.5 h-3.5" />
                  Essayez <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">/stats</span>{" "}
                  ou <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">/flow</span>
                </div>
              )}

              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-3 space-y-2"
                aria-live="polite"
                aria-busy={loading}
              >
                {messages.map((m, i) => {
                  const isUser = m.role === "user"
                  const ts = m.ts ? new Date(m.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""
                  const content = pretty(m.content)
                  const isJson = (() => { try { JSON.parse(m.content); return true } catch { return false } })()
                  return (
                    <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] group`}>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                            isUser
                              ? "bg-purple-600 text-white"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          }`}
                        >
                          {isJson ? <pre className="text-xs overflow-x-auto">{content}</pre> : content}
                        </div>
                        <div className="flex items-center gap-1 mt-1 opacity-70">
                          <span className="text-[10px] text-neutral-500">{ts}</span>
                          {!isUser && (
                            <button
                              onClick={() => copyMsg(i, m.content)}
                              className="invisible group-hover:visible text-[10px] px-1 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                              title="Copier"
                            >
                              {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {loading && (
                  <div className="flex items-center gap-2 text-neutral-500 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    L’assistant rédige…
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-black/5 dark:border-white/10 p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      rows={1}
                      placeholder="Écrivez un message… (Entrée pour envoyer, Shift+Entrée = ligne)"
                      className="w-full resize-none rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                    {/* Quick chips */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => sendQuick("/stats")}
                        className="text-xs px-2 py-1 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Voir les stats
                      </button>
                      <button
                        onClick={() => sendQuick("/flow")}
                        className="text-xs px-2 py-1 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Flux du site
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="shrink-0 h-9 px-3 rounded-xl bg-purple-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition"
                  >
                    <span className="flex items-center gap-1">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Envoyer
                    </span>
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-neutral-500">
                  Réponses en français • Respect RGPD • Aide produit
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => {
          setOpen(v => !v)
          setMinimized(false)
        }}
        className="relative bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        aria-label="Chatbot"
        title="Ouvrir l’assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] leading-none px-1.5 py-1 rounded-full">
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}
