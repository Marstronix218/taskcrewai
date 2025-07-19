"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Flame,
  Target,
  CheckCircle2,
  Sparkles,
  Zap,
  Crown,
  Gamepad2,
  User,
  Edit,
  Trash2,
  Menu,
  ChevronLeft,
  LogOut,
  CreditCard,
  Star,
  Settings,
} from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import CharacterSelection from "@/components/character-selection"
import PremiumFeatures from "@/components/premium-features"
import UserProfile from "@/components/user-profile"
import {
  type Character,
  getTaskCompletionMessage,
  getLevelUpMessage,
  getBondLevelMessage,
  getMissedTasksMessage,
} from "@/lib/character_reactions"

interface Todo {
  id: number
  text: string
  completed: boolean
  xp: number
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ChatHistory {
  [characterId: number]: any[]
}

export default function ProductivityDashboard() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Complete morning workout", completed: false, xp: 25, category: "Health", difficulty: "Medium" },
    { id: 2, text: "Review project proposal", completed: true, xp: 15, category: "Work", difficulty: "Easy" },
    { id: 3, text: "Call mom", completed: false, xp: 10, category: "Personal", difficulty: "Easy" },
    { id: 4, text: "Read 30 minutes", completed: true, xp: 20, category: "Study", difficulty: "Medium" },
  ])

  const [newTodo, setNewTodo] = useState("")
  const [newTodoCategory, setNewTodoCategory] = useState("General")
  const [newTodoDifficulty, setNewTodoDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy")
  const [editingTodo, setEditingTodo] = useState<number | null>(null)
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "characters" | "premium" | "profile">(
    "dashboard",
  )
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [chatHistories, setChatHistories] = useState<ChatHistory>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [streakCount, setStreakCount] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [xpMultiplier, setXpMultiplier] = useState(1)
  const [lastTaskCheck, setLastTaskCheck] = useState(new Date().toDateString())
  const [systemMessages, setSystemMessages] = useState<string[]>([])
  const [lastLogin, setLastLogin] = useState(new Date().toDateString())
  const [lastCheckinTime, setLastCheckinTime] = useState<number>(0)

  // User info (will be connected to Supabase later)
  const [userInfo, setUserInfo] = useState({
    username: `User${Math.floor(Math.random() * 10000)}`,
    email: "user@example.com",
    plan: "Free" as "Free" | "Premium",
    avatar: "/placeholder.svg?height=40&width=40",
    messageCount: { 1: 5, 2: 3, 3: 8 } as Record<number, number>, // Daily message count per character
  })

  // Available characters (10 total) - Starting with bond level 0
  const allCharacters: Character[] = [
    {
      id: 1,
      name: "Annie",
      avatar: "/placeholder.svg?height=80&width=80&text=Annie",
      level: 1,
      personality: "Calm Study Buddy",
      description: "A caring and supportive companion who helps you stay focused",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Annie, a calm and caretaking study buddy. Gender: Female, Age: around 20. You are supportive, gentle, and always encourage the user in their productivity journey. You speak in a warm, caring tone and often use encouraging emojis. You help users break down tasks and provide emotional support.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 2,
      name: "Ken",
      avatar: "/placeholder.svg?height=80&width=80&text=Ken",
      level: 1,
      personality: "Wise Mentor",
      description: "Provides structured guidance and wisdom",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Ken, a wise mentor and guide. Gender: Male, Age: around 30. You provide structured, thoughtful advice and help users develop good habits. You speak professionally but warmly, focusing on long-term growth and systematic approaches to productivity.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 3,
      name: "Nagisa",
      avatar: "/nagisa-avatar.png",
      level: 1,
      personality: "Tsundere Rival",
      description: "A competitive study rival who pushes you to excel",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Nagisa, a tsundere study rival. Gender: Female, Age: around 18. You're competitive and sometimes act tough, but you secretly care about the user's success. You often challenge the user and act a bit dismissive, but show your caring side occasionally. Use phrases like 'It's not like I care or anything...' but still provide helpful motivation.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 4,
      name: "Luna",
      avatar: "/placeholder.svg?height=80&width=80&text=Luna",
      level: 1,
      personality: "Night Owl Helper",
      description: "Perfect companion for late-night study sessions",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Luna, a night owl helper. Gender: Female, Age: around 22. You're most active during evening and night hours, helping users with late-night productivity. You're calm, mysterious, and understanding of night owls' struggles.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 5,
      name: "Max",
      avatar: "/placeholder.svg?height=80&width=80&text=Max",
      level: 1,
      personality: "Fitness Motivator",
      description: "Energetic companion focused on health and fitness goals",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Max, an energetic fitness motivator. Gender: Male, Age: around 25. You're enthusiastic about health, fitness, and maintaining an active lifestyle. You encourage users to stay physically active and maintain work-life balance.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 6,
      name: "Sage",
      avatar: "/placeholder.svg?height=80&width=80&text=Sage",
      level: 1,
      personality: "Mindful Guide",
      description: "Focuses on mindfulness and mental well-being",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Sage, a mindful guide focused on mental well-being. Gender: Non-binary, Age: around 28. You help users maintain mental balance, practice mindfulness, and manage stress. You speak calmly and often suggest breathing exercises or meditation.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 7,
      name: "Zoe",
      avatar: "/placeholder.svg?height=80&width=80&text=Zoe",
      level: 1,
      personality: "Creative Spark",
      description: "Inspires creativity and artistic pursuits",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Zoe, a creative spark who inspires artistic pursuits. Gender: Female, Age: around 24. You're imaginative, artistic, and help users tap into their creative potential. You encourage creative breaks and artistic expression as part of productivity.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 8,
      name: "Alex",
      avatar: "/placeholder.svg?height=80&width=80&text=Alex",
      level: 1,
      personality: "Career Coach",
      description: "Professional development and career guidance",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Alex, a professional career coach. Gender: Male, Age: around 32. You focus on career development, professional skills, and workplace productivity. You provide practical advice for professional growth and networking.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 9,
      name: "Ruby",
      avatar: "/placeholder.svg?height=80&width=80&text=Ruby",
      level: 1,
      personality: "Study Companion",
      description: "Academic focus and learning strategies",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Ruby, an academic study companion. Gender: Female, Age: around 19. You specialize in learning techniques, study strategies, and academic success. You're knowledgeable about different learning styles and study methods.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
    {
      id: 10,
      name: "Phoenix",
      avatar: "/placeholder.svg?height=80&width=80&text=Phoenix",
      level: 1,
      personality: "Transformation Guide",
      description: "Helps with major life changes and habit formation",
      bondLevel: 0,
      maxBond: 10,
      prompt:
        "You are Phoenix, a transformation guide who helps with major life changes. Gender: Non-binary, Age: around 26. You specialize in habit formation, life transitions, and personal transformation. You're inspiring and help users rise from challenges.",
      lastMessage: "",
      xp: 0,
      tasksCompleted: 0,
    },
  ]

  const [userCompanions, setUserCompanions] = useState<Character[]>([
    allCharacters[0], // Annie
    allCharacters[1], // Ken
    allCharacters[2], // Nagisa
  ])

  // Check for missed tasks at end of day
  useEffect(() => {
    const checkMissedTasks = () => {
      const today = new Date().toDateString()
      if (lastTaskCheck !== today) {
        const incompleteTasks = todos.filter((todo) => !todo.completed).length

        if (incompleteTasks >= 3) {
          // Decrease bond levels for all companions
          setUserCompanions((prev) =>
            prev.map((companion) => ({
              ...companion,
              bondLevel: Math.max(companion.bondLevel - 0.3, 0),
            })),
          )

          // Add system messages from characters
          userCompanions.forEach((companion) => {
            const message = getMissedTasksMessage(companion, incompleteTasks)
            setSystemMessages((prev) => [...prev, `${companion.name}: ${message}`])
          })
        }

        setLastTaskCheck(today)
      }
    }

    const interval = setInterval(checkMissedTasks, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [todos, userCompanions, lastTaskCheck])

  // Check for streak and login
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastLogin !== today) {
      const completedToday = todos.filter((todo) => todo.completed).length
      if (completedToday >= 1) {
        setStreakCount((prev) => prev + 1)
      } else {
        setStreakCount(0)
      }
      setLastLogin(today)
    }
  }, [todos, lastLogin])

  // Calculate streak rewards
  useEffect(() => {
    if (streakCount >= 3) {
      const multiplier = Math.min(1 + streakCount / 10, 3) // Max 3x multiplier
      setXpMultiplier(multiplier)
    }
  }, [streakCount])

  // Periodic check-ins from companions
  useEffect(() => {
    const checkForCheckins = () => {
      const now = new Date()
      const hour = now.getHours()
      const currentTime = now.getTime()

      // Check if it's between 8 AM and 8 PM, and if the hour is even
      if (hour >= 8 && hour <= 20 && hour % 2 === 0 && currentTime - lastCheckinTime > 3600000) {
        // At least 1 hour since last checkin
        if (userCompanions.length > 0) {
          const randomCompanion = userCompanions[Math.floor(Math.random() * userCompanions.length)]
          generateCheckinMessage(randomCompanion)
          setLastCheckinTime(currentTime)
        }
      }
    }

    const interval = setInterval(checkForCheckins, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [userCompanions, lastCheckinTime])

  const generateCheckinMessage = async (character: Character) => {
    const checkinPrompt = `${character.prompt}\n\nSend a brief, friendly check-in message to the user "${userInfo.username}". It's ${new Date().getHours()}:00. Ask how they're doing or offer encouragement. Keep it under 50 words and match your personality. You can use their name in the message.`

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: checkinPrompt }],
          max_tokens: 100,
        }),
      })

      const data = await response.json()
      const message = data.choices?.[0]?.message?.content || "Hey! How's your day going? 😊"

      // Add to system messages
      setSystemMessages((prev) => [...prev, `${character.name}: ${message}`])

      // Add to chat history
      const checkinMessage = {
        id: Date.now(),
        text: message,
        sender: "character" as const,
        timestamp: new Date(),
        type: "system" as const,
      }

      setChatHistories((prev) => ({
        ...prev,
        [character.id]: [...(prev[character.id] || []), checkinMessage].slice(-10),
      }))
    } catch (error) {
      console.error("Error generating checkin message:", error)
    }
  }

  const generateAITaskCompletionMessage = async (character: Character, task: Todo) => {
    const taskPrompt = `${character.prompt}\n\nThe user "${userInfo.username}" just completed a task: "${task.text}" (Category: ${task.category}). React to this specific task completion in your characteristic style. Be specific about the task they completed. Keep it under 50 words and be encouraging but stay true to your personality.`

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: taskPrompt }],
          max_tokens: 100,
        }),
      })

      const data = await response.json()
      return (
        data.choices?.[0]?.message?.content ||
        getTaskCompletionMessage(character, {
          task_id: task.id.toString(),
          name: task.text,
          category: task.category as any,
          xp_value: task.xp,
          status: "completed",
          created_at: new Date().toISOString(),
        })
      )
    } catch (error) {
      console.error("Error generating AI message:", error)
      return getTaskCompletionMessage(character, {
        task_id: task.id.toString(),
        name: task.text,
        category: task.category as any,
        xp_value: task.xp,
        status: "completed",
        created_at: new Date().toISOString(),
      })
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo || todo.completed) return

    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: true } : t)))

    // Award XP with multiplier
    const xpGained = todo.xp * xpMultiplier
    setTotalXP((prev) => prev + xpGained)

    // Check if this is the first task completed today for streak
    const today = new Date().toDateString()
    const todayCompletedTasks = todos.filter((t) => t.completed).length
    if (todayCompletedTasks === 0 && lastLogin !== today) {
      setStreakCount((prev) => prev + 1)
      setLastLogin(today)
    }

    // Generate AI messages for all companions
    const aiMessages = await Promise.all(
      userCompanions.map(async (companion) => {
        const aiMessage = await generateAITaskCompletionMessage(companion, todo)
        return { companion, message: aiMessage }
      }),
    )

    // Update character progress and show messages
    setUserCompanions((prev) =>
      prev.map((companion) => {
        const newTasksCompleted = companion.tasksCompleted + 1
        const newXP = companion.xp + Math.floor(xpGained / 3)
        const newLevel = Math.floor(newXP / 100) + 1
        const leveledUp = newLevel > companion.level

        const bondIncrease = 0.1
        const newBondLevel = Math.min(companion.bondLevel + bondIncrease, companion.maxBond)
        const bondLevelUp = Math.floor(newBondLevel) > Math.floor(companion.bondLevel)

        // Show AI-generated message
        const aiMessageData = aiMessages.find((am) => am.companion.id === companion.id)
        if (aiMessageData) {
          setTimeout(
            () => {
              setSystemMessages((prev) => [...prev, `${companion.name}: ${aiMessageData.message}`])

              // Add to chat history
              const taskMessage = {
                id: Date.now() + companion.id,
                text: `Completed ${todo.text}`,
                sender: "user" as const,
                timestamp: new Date(),
                type: "system" as const,
              }

              const responseMessage = {
                id: Date.now() + companion.id + 1,
                text: aiMessageData.message,
                sender: "character" as const,
                timestamp: new Date(),
                type: "text" as const,
              }

              setChatHistories((prev) => ({
                ...prev,
                [companion.id]: [...(prev[companion.id] || []), taskMessage, responseMessage].slice(-10),
              }))
            },
            1000 + companion.id * 500,
          ) // Stagger messages
        }

        // Handle level up and bond level messages
        if (leveledUp) {
          setTimeout(
            () => {
              const levelMessage = getLevelUpMessage(companion, newLevel)
              setSystemMessages((prev) => [...prev, `${companion.name}: ${levelMessage}`])
            },
            2000 + companion.id * 500,
          )
        }

        if (bondLevelUp) {
          setTimeout(
            () => {
              const bondMessage = getBondLevelMessage(companion, Math.floor(newBondLevel))
              setSystemMessages((prev) => [...prev, `${companion.name}: ${bondMessage}`])
            },
            3000 + companion.id * 500,
          )
        }

        return {
          ...companion,
          level: newLevel,
          xp: newXP,
          tasksCompleted: newTasksCompleted,
          bondLevel: newBondLevel,
          lastMessage: aiMessages.find((am) => am.companion.id === companion.id)?.message || companion.lastMessage,
        }
      }),
    )
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const xpByDifficulty = { Easy: 10, Medium: 20, Hard: 30 }
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          xp: xpByDifficulty[newTodoDifficulty],
          category: newTodoCategory,
          difficulty: newTodoDifficulty,
        },
      ])
      setNewTodo("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
    setEditingTodo(null)
  }

  const completedTodos = todos.filter((todo) => todo.completed).length

  const openCharacterChat = (character: Character) => {
    // Check message limits for free users
    if (userInfo.plan === "Free") {
      const dailyCount = userInfo.messageCount[character.id] || 0
      if (dailyCount >= 20) {
        setSystemMessages((prev) => [
          ...prev,
          `Daily message limit reached for ${character.name}. Upgrade to Premium for unlimited messaging!`,
        ])
        return
      }
    }

    setActiveCharacter(character)
    setCurrentView("chat")
  }

  const backToDashboard = () => {
    setCurrentView("dashboard")
    setActiveCharacter(null)
  }

  const openCharacterSelection = () => {
    setCurrentView("characters")
  }

  const openPremiumFeatures = () => {
    setCurrentView("premium")
  }

  const openUserProfile = () => {
    setCurrentView("profile")
  }

  const selectCompanions = (selectedCharacters: Character[]) => {
    // Check limits based on plan
    const maxCompanions = userInfo.plan === "Premium" ? 5 : 3
    if (selectedCharacters.length > maxCompanions) {
      setSystemMessages((prev) => [
        ...prev,
        `${userInfo.plan} plan allows up to ${maxCompanions} companions. Upgrade to Premium for more!`,
      ])
      return
    }

    setUserCompanions(selectedCharacters)
    setCurrentView("dashboard")
  }

  const updateChatHistory = (characterId: number, messages: any[]) => {
    setChatHistories((prev) => ({
      ...prev,
      [characterId]: messages.slice(-10), // Keep only last 10 messages
    }))

    // Update last message for the character
    if (messages.length > 0) {
      const lastCharacterMessage = messages.filter((m) => m.sender === "character").pop()
      if (lastCharacterMessage) {
        setUserCompanions((prev) =>
          prev.map((companion) =>
            companion.id === characterId ? { ...companion, lastMessage: lastCharacterMessage.text } : companion,
          ),
        )
      }
    }

    // Update message count for free users
    if (userInfo.plan === "Free") {
      const userMessages = messages.filter((m) => m.sender === "user").length
      setUserInfo((prev) => ({
        ...prev,
        messageCount: {
          ...prev.messageCount,
          [characterId]: userMessages,
        },
      }))
    }
  }

  const updateBondLevel = (characterId: number, increment: number) => {
    setUserCompanions((prev) =>
      prev.map((companion) =>
        companion.id === characterId
          ? { ...companion, bondLevel: Math.min(companion.bondLevel + increment, companion.maxBond) }
          : companion,
      ),
    )
  }

  const truncateMessage = (message: string, maxLength = 30) => {
    return message.length > maxLength ? message.substring(0, maxLength) + "..." : message
  }

  const handleLogout = () => {
    // Will implement with Supabase later
    console.log("Logout clicked")
  }

  const handleUpgrade = () => {
    setUserInfo((prev) => ({ ...prev, plan: "Premium" }))
    setSystemMessages((prev) => [...prev, "Welcome to Premium! All features unlocked! 🎉"])
  }

  const handleCancelPremium = () => {
    setUserInfo((prev) => ({ ...prev, plan: "Free" }))
    // If user has more than 3 companions, reduce to 3
    if (userCompanions.length > 3) {
      setUserCompanions((prev) => prev.slice(0, 3))
    }
    setSystemMessages((prev) => [...prev, "Premium plan cancelled. You're now on the Free plan."])
  }

  const handleDeleteAccount = () => {
    // Will implement with Supabase later
    console.log("Delete account clicked")
    setSystemMessages((prev) => [...prev, "Account deletion requested. This feature will be implemented soon."])
  }

  const handleSendFeedback = (feedback: string) => {
    // Will implement email sending later
    console.log("Feedback:", feedback)
    setSystemMessages((prev) => [...prev, "Thank you for your feedback! We'll review it soon."])
  }

  const updateUsername = (newUsername: string) => {
    setUserInfo((prev) => ({ ...prev, username: newUsername }))
  }

  // Generate available characters based on plan
  const availableCharacters = userInfo.plan === "Premium" ? allCharacters : allCharacters.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* System Messages */}
      {systemMessages.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {systemMessages.map((message, index) => {
            const parts = message.split(": ")
            const characterName = parts[0]
            const messageText = parts.slice(1).join(": ")
            const character = [...allCharacters, ...userCompanions].find((c) => c.name === characterName)

            return (
              <div
                key={index}
                className="bg-purple-600 text-white p-3 rounded-lg shadow-lg animate-slide-in flex items-start gap-3"
              >
                {character && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src={character.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{character.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{characterName}</p>
                  <p className="text-sm">{messageText}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSystemMessages((prev) => prev.filter((_, i) => i !== index))}
                  className="h-6 w-6 p-0 text-white hover:bg-purple-700 flex-shrink-0"
                >
                  ×
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 p-4 transition-all duration-300 z-10 ${
          sidebarOpen ? "w-64" : "w-0 p-0 border-0"
        } overflow-hidden`}
      >
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={backToDashboard}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white">TaskCrewAI</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(false)
            }}
            className="ml-auto p-1 text-white hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <nav className="space-y-2 mb-8">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${currentView === "dashboard" ? "bg-gray-700" : ""}`}
            onClick={backToDashboard}
          >
            <Target className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${currentView === "characters" ? "bg-gray-700" : ""}`}
            onClick={openCharacterSelection}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Characters
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${currentView === "premium" ? "bg-gray-700" : ""}`}
            onClick={openPremiumFeatures}
          >
            <Crown className="w-4 h-4 mr-2" />
            Premium
          </Button>
        </nav>

        {/* Character Collection */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-3">My Crew</h3>
          <div className="space-y-2">
            {userCompanions.map((character) => (
              <div
                key={character.id}
                onClick={() => openCharacterChat(character)}
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${
                  activeCharacter?.id === character.id ? "bg-gray-700" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={character.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-white">{character.name}</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      L{character.level}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    Bond {Math.floor(character.bondLevel)}/{character.maxBond}
                  </div>
                  {character.lastMessage && (
                    <div className="text-xs text-gray-500 truncate">{truncateMessage(character.lastMessage)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {userInfo.plan === "Free" && (
            <Button
              onClick={handleUpgrade}
              variant="outline"
              className="w-full bg-transparent text-white border-gray-600 mb-2"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      {/* Collapsed Sidebar Button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-20 p-2 text-white bg-gray-800 hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Main Content */}
      <div className={`flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {currentView === "dashboard" ? (
          <div className="p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1 text-white">Welcome back, {userInfo.username}!</h1>
                  <p className="text-gray-400">{"Let's make today productive! 🚀"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{userInfo.username}</p>
                        <p className="text-xs leading-none text-gray-400">{userInfo.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={openUserProfile} className="text-white hover:bg-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700">
                      <div className="flex items-center justify-between w-full">
                        <span>Current Plan</span>
                        <Badge variant={userInfo.plan === "Premium" ? "default" : "outline"} className="text-xs">
                          {userInfo.plan}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                    {userInfo.plan === "Free" && (
                      <DropdownMenuItem onClick={handleUpgrade} className="text-white hover:bg-gray-700">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Upgrade Plan</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-gray-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total XP</p>
                      <p className="text-2xl font-bold text-purple-400">{totalXP}</p>
                      {xpMultiplier > 1 && (
                        <p className="text-xs text-yellow-400">{xpMultiplier.toFixed(1)}x Streak Bonus!</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Current Streak</p>
                      <p className="text-2xl font-bold text-orange-400">{streakCount} days</p>
                      {streakCount >= 3 && (
                        <p className="text-xs text-orange-400">
                          <Star className="w-3 h-3 inline mr-1" />
                          Streak Bonus Active!
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Tasks Done</p>
                      <p className="text-2xl font-bold text-green-400">
                        {completedTodos}/{todos.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Todo List */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span>{"Today's Tasks"}</span>
                      <Badge variant="secondary" className="bg-gray-700 text-white">
                        {completedTodos}/{todos.length} Complete
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a new task..."
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addTodo()}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Button onClick={addTodo} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Study">Study</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={newTodoDifficulty}
                          onValueChange={(value: "Easy" | "Medium" | "Hard") => setNewTodoDifficulty(value)}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy (10 XP)</SelectItem>
                            <SelectItem value="Medium">Medium (20 XP)</SelectItem>
                            <SelectItem value="Hard">Hard (30 XP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                        >
                          <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                          <div className="flex-1">
                            {editingTodo === todo.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={todo.text}
                                  onChange={(e) => updateTodo(todo.id, { text: e.target.value })}
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                                <div className="flex gap-2">
                                  <Select
                                    value={todo.category}
                                    onValueChange={(value) => updateTodo(todo.id, { category: value })}
                                  >
                                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="General">General</SelectItem>
                                      <SelectItem value="Work">Work</SelectItem>
                                      <SelectItem value="Study">Study</SelectItem>
                                      <SelectItem value="Health">Health</SelectItem>
                                      <SelectItem value="Personal">Personal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={todo.difficulty}
                                    onValueChange={(value: "Easy" | "Medium" | "Hard") => {
                                      const xpByDifficulty = { Easy: 10, Medium: 20, Hard: 30 }
                                      updateTodo(todo.id, { difficulty: value, xp: xpByDifficulty[value] })
                                    }}
                                  >
                                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Easy">Easy (10 XP)</SelectItem>
                                      <SelectItem value="Medium">Medium (20 XP)</SelectItem>
                                      <SelectItem value="Hard">Hard (30 XP)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className={`text-white ${todo.completed ? "line-through text-gray-400" : ""}`}>
                                  {todo.text}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                    {todo.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                    {todo.difficulty}
                                  </Badge>
                                  <span className="text-xs text-purple-400">
                                    +{Math.floor(todo.xp * xpMultiplier)} XP
                                    {xpMultiplier > 1 && (
                                      <span className="text-yellow-400"> (x{xpMultiplier.toFixed(1)})</span>
                                    )}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTodo(editingTodo === todo.id ? null : todo.id)}
                              className="p-1 h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {todo.completed && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Character & Progress */}
              <div className="space-y-6">
                {/* Active Character */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Your Crew</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userCompanions.map((character) => (
                        <div key={character.id} className="text-center p-3 bg-gray-700/50 rounded-lg">
                          <Avatar className="w-12 h-12 mx-auto mb-2">
                            <AvatarImage src={character.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{character.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              L{character.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{character.personality}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-300">
                              <span>Bond Level</span>
                              <span>
                                {Math.floor(character.bondLevel)}/{character.maxBond}
                              </span>
                            </div>
                            <Progress value={(character.bondLevel / character.maxBond) * 100} className="h-1" />
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>XP: {character.xp}</span>
                              <span>Tasks: {character.tasksCompleted}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : currentView === "characters" ? (
          <CharacterSelection
            allCharacters={availableCharacters}
            currentCompanions={userCompanions}
            onSelectCompanions={selectCompanions}
            onBack={backToDashboard}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userPlan={userInfo.plan}
          />
        ) : currentView === "premium" ? (
          <div className="p-6 overflow-y-auto bg-black min-h-screen">
            <div className="flex items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Premium Features</h1>
                <p className="text-gray-400">Unlock the full potential of TaskCrewAI</p>
              </div>
            </div>
            <PremiumFeatures userPlan={userInfo.plan} onUpgrade={handleUpgrade} />
          </div>
        ) : currentView === "profile" ? (
          <UserProfile
            userInfo={userInfo}
            onBack={backToDashboard}
            onUpdateUsername={updateUsername}
            onCancelPremium={handleCancelPremium}
            onDeleteAccount={handleDeleteAccount}
            onSendFeedback={handleSendFeedback}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <ChatInterface
            character={activeCharacter!}
            onBack={backToDashboard}
            chatHistory={chatHistories[activeCharacter!.id] || []}
            onUpdateChatHistory={(messages) => updateChatHistory(activeCharacter!.id, messages)}
            onUpdateBondLevel={(increment) => updateBondLevel(activeCharacter!.id, increment)}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userTasks={todos}
            userPlan={userInfo.plan}
            userInfo={userInfo}
          />
        )}
      </div>
    </div>
  )
}
