import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'
import Card from './ui/Card'
import { streamChat, type ChatMessage, getQuickSuggestions } from '../lib/ai'
import { clsx } from 'clsx'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content:
        "You are Toyota Nexus, a helpful assistant for Toyota models, trims, pricing caveats, financing vs. leasing, safety features, and ownership tips. Be concise. If unsure, say so and suggest official sources."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const quickSuggestions = getQuickSuggestions()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message?: string) => {
    const textToSend = message || input.trim()
    if (!textToSend || isLoading) return

    const userMsg: ChatMessage = { role: "user", content: textToSend }
    setInput('')

    setMessages(m => [...m, userMsg, { role: "model", content: "" }])
    setIsLoading(true)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      for await (const chunk of streamChat(
        { messages: [...messages, userMsg], model: "gemini-2.0-flash-exp", temperature: 0.5 },
        abortRef.current
      )) {
        if (chunk?.error) throw new Error(chunk.error)
        if (chunk?.delta) {
          setMessages(m => {
            const copy = [...m]
            const last = copy[copy.length - 1]
            if (last?.role === "model") last.content += chunk.delta
            return copy
          })
        }
        if (chunk?.done && chunk?.text) {
          setMessages(m => {
            const copy = [...m]
            const last = copy[copy.length - 1]
            if (last?.role === "model") last.content = chunk.text
            return copy
          })
        }
      }
    } catch (e: any) {
      setMessages(m => [...m, { role: "model", content: `⚠️ ${e.message || "Chat error"}` }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  // Filter out system messages for display
  const displayMessages = messages.filter(m => m.role !== 'system')

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-toyota-red text-white rounded-full shadow-lg flex items-center justify-center hover:bg-toyota-red-dark transition-colors focus:outline-none focus:ring-2 focus:ring-toyota-red focus:ring-offset-2"
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
          >
            <Card padding="none" className="flex flex-col h-[600px] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-toyota-red text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Toyota Nexus</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="!text-white hover:bg-white/10 !p-2"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-toyota-gray-light">
                {displayMessages.length === 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white text-toyota-black border border-gray-200">
                      <div className="text-sm">
                        Hi! I'm your Toyota Nexus assistant. Ask me anything about vehicles, comparisons, or financing!
                      </div>
                    </div>
                  </div>
                )}

                {displayMessages.map((message, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={clsx(
                        'max-w-[80%] rounded-lg px-4 py-2',
                        message.role === 'user'
                          ? 'bg-toyota-red text-white'
                          : 'bg-white text-toyota-black border border-gray-200'
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content.split('\n').map((line, i) => {
                          // Simple markdown rendering
                          const boldRegex = /\*\*(.*?)\*\*/g
                          const parts = line.split(boldRegex)

                          return (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j}>{part}</strong>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-toyota-black border border-gray-200 rounded-lg px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-toyota-red" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {displayMessages.length === 0 && !isLoading && (
                <div className="px-4 py-2 border-t border-gray-200 bg-white">
                  <div className="text-xs text-toyota-gray-dark mb-2">Quick suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 bg-toyota-gray-light hover:bg-toyota-red/10 text-toyota-black rounded-full transition-colors border border-gray-300 hover:border-toyota-red"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="!px-4"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
