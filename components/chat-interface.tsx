"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, MoreVertical, Heart, Zap, Menu, X } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "character"
  timestamp: Date
  type?: "text" | "reward" | "system"
  xpReward?: number
}

interface Character {
  id: number
  name: string
  avatar: string
  level: number
  personality: string
  description: string
  bondLevel: number
  maxBond: number
  prompt: string
  lastMessage?: string
  xp: number
  tasksCompleted: number
}

interface Todo {
  id: number
  text: string
  completed: boolean
  xp: number
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ChatInterfaceProps {
  character: Character
  onBack: () => void
  chatHistory: Message[]
  onUpdateChatHistory: (messages: Message[]) => void
  onUpdateBondLevel: (increment: number) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  userTasks: Todo[]
  userPlan: "Free" | "Premium"
  userInfo?: { username: string; email: string; plan: "Free" | "Premium"; avatar: string }
}

export default function ChatInterface({
  character,
  onBack,
  chatHistory,
  onUpdateChatHistory,
  onUpdateBondLevel,
  sidebarOpen,
  setSidebarOpen,
  userTasks,
  userPlan,
  userInfo,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(chatHistory)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => setMessages(chatHistory), [chatHistory])

  useEffect(() => {
    if (chatHistory.length === 0) {
      const greeting: Message = {
        id: Date.now(),
        text: `Hi there! I'm ${character.name}. ${character.description} How can I help you stay productive today? 😊`,
        sender: "character",
        timestamp: new Date(),
      }
      setMessages([greeting])
      onUpdateChatHistory([greeting])
    }
  }, [character.id, chatHistory.length, character.name, character.description, onUpdateChatHistory])

  useEffect(scrollToBottom, [messages])

  const callOpenAI = async (userText: string): Promise<string> => {
    // Include a short summary of outstanding tasks for context
    const pendingTasks = userTasks.filter((t) => !t.completed).slice(0, 5)
    const taskContext =
      pendingTasks.length > 0
        ? `Here are the user's remaining tasks:\n${pendingTasks.map((t) => `• ${t.text} [${t.category}]`).join("\n")}`
        : "The user currently has no outstanding tasks."

    const payload = {
      messages: [
        {
          role: "system",
          content: `${character.prompt}\n\nThe user's name is "${userInfo?.username || "User"}". You can use their name in conversation when appropriate.`,
        },
        { role: "system", content: taskContext },
        ...messages
          .filter((m) => m.type === "text")
          .slice(-10)
          .map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        { role: "user", content: userText },
      ],
      max_tokens: 150,
      temperature: 0.8,
    }

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        console.error("OpenAI route error:", await res.text())
        return "Sorry, something went wrong. 😅"
      }
      const data = await res.json()
      return data.choices?.[0]?.message?.content || "..."
    } catch (err) {
      console.error(err)
      return "Sorry, something went wrong. 😅"
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    if (userPlan === "Free" && messages.filter((m) => m.sender === "user").length >= 20) {
      setNewMessage("")
      return
    }

    const userMsg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    const updated = [...messages, userMsg]
    setMessages(updated)
    onUpdateChatHistory(updated)
    setNewMessage("")
    setIsTyping(true)

    const aiText = await callOpenAI(newMessage)

    const aiMsg: Message = {
      id: Date.now() + 1,
      text: aiText,
      sender: "character",
      timestamp: new Date(),
    }

    const finalMessages = [...updated, aiMsg]
    setMessages(finalMessages)
    onUpdateChatHistory(finalMessages)
    setIsTyping(false)

    if (Math.random() > 0.6) onUpdateBondLevel(0.1)
  }

  const quickActions = [
    "💪 Need motivation",
    "📝 Task help",
    "🎯 Set goals",
    "😴 Feeling tired",
    "🎉 Celebrate progress",
  ]

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white">
            {sidebarOpen ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={character.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">{character.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">{character.name}</h2>
            <p className="text-sm text-gray-400">{character.personality}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-4">
            <div className="flex items-center gap-1 text-sm text-white">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Bond L{Math.floor(character.bondLevel)}</span>
            </div>
            <Progress value={(character.bondLevel / character.maxBond) * 100} className="w-20 h-1 mt-1" />
          </div>
          <Button variant="ghost" size="sm" className="text-white">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : ""}`}>
              {m.sender === "character" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={character.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-sm">{character.name[0]}</AvatarFallback>
                </Avatar>
              )}

              <div className="space-y-1">
                <div
                  className={`p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-purple-600 text-white"
                      : m.type === "reward"
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-white"
                        : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  {m.xpReward && (
                    <div className="flex items-center gap-1 mt-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">+{m.xpReward} Bond Points</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 px-2">{formatTime(m.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src={character.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-sm">{character.name[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-gray-700 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder={`Message ${character.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Button onClick={sendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {quickActions.map((qa) => (
            <Badge
              key={qa}
              variant="outline"
              className="cursor-pointer hover:bg-gray-600 text-gray-300 border-gray-500"
              onClick={() => setNewMessage(qa.replace(/^..?\s/, ""))}
            >
              {qa}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
