import type { TaskData } from "./supabase"

export interface Character {
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

export function getTaskCompletionMessage(character: Character, task: TaskData): string {
  const { name, personality } = character
  const { category } = task

  // Character-specific responses based on personality
  if (name === "Annie") {
    const responses = {
      Health: "Great job taking care of yourself today! Your body will thank you! 💪✨",
      Study: "Your brain must be burning with all that knowledge! Keep going, you're doing amazing! 📚💡",
      Work: "Look at you being so productive! I'm so proud of your dedication! 🌟",
      Personal: "Taking care of personal matters shows great responsibility! Well done! 💖",
      General: "Every task completed is a step forward! You're doing wonderfully! 🎉",
    }
    return responses[category] || responses.General
  }

  if (name === "Ken") {
    const responses = {
      Health: "Excellent work maintaining your physical well-being. A healthy body supports a productive mind.",
      Study: "Knowledge acquisition requires discipline. Your commitment to learning is commendable.",
      Work: "Professional excellence comes from consistent effort. Well executed.",
      Personal: "Personal development is the foundation of all success. Good work.",
      General: "Systematic task completion builds strong habits. Continue this momentum.",
    }
    return responses[category] || responses.General
  }

  if (name === "Nagisa") {
    const responses = {
      Health: "Hmph! I guess you're not completely hopeless at taking care of yourself... 😤💪",
      Study: "Your brain must be burning! Not bad... for someone like you! Keep going! 📚⚡",
      Work: "I suppose you did okay with work today... It's not like I'm impressed or anything! 😏",
      Personal: "Taking care of personal stuff, huh? Well... I guess that's important too... 💭",
      General: "You actually finished something? Don't let it go to your head! But... good job, I guess... 😤✨",
    }
    return responses[category] || responses.General
  }

  // Default responses for other characters
  const responses = {
    Health: "Great job taking care of yourself today! 💪",
    Study: "Your brain must be burning! Keep going! 📚",
    Work: "Productive work session completed! 💼",
    Personal: "Personal growth is important! Well done! ✨",
    General: "Task completed successfully! 🎉",
  }
  return responses[category] || responses.General
}

export function getLevelUpMessage(character: Character, newLevel: number): string {
  const { name } = character

  if (name === "Annie") {
    const messages = [
      `Level ${newLevel}! You're growing so much, and I'm here cheering you on every step! 🌟💖`,
      `Wow, level ${newLevel}! Your dedication is truly inspiring! Keep being amazing! ✨🎉`,
      `Level ${newLevel} achieved! I'm so proud of how far you've come! 💪💕`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  if (name === "Ken") {
    const messages = [
      `Level ${newLevel} achieved. Your consistent effort is yielding measurable results. Continue this trajectory.`,
      `Congratulations on reaching level ${newLevel}. Growth through discipline is the path to mastery.`,
      `Level ${newLevel}. Your systematic approach to improvement is commendable. Well done.`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  if (name === "Nagisa") {
    const messages = [
      `Level ${newLevel}?! You're improving fast! ...Not that I'm impressed or anything! 😤⚡`,
      `Hmph! Level ${newLevel}... I guess you're not completely hopeless after all! 😏✨`,
      `Level ${newLevel}! Don't get cocky just because you're getting better! ...But good job, I suppose... 😤💫`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return `Congratulations on reaching level ${newLevel}! 🎉`
}

export function getBondLevelMessage(character: Character, newBondLevel: number): string {
  const { name } = character

  if (name === "Annie") {
    const messages = {
      3: "Bond Level 3! We're becoming such good friends! I love spending time with you! 💕",
      5: "Bond Level 5! You mean so much to me! Let's keep growing together! 🌟💖",
      7: "Bond Level 7! Our friendship is so special! I'm always here for you! ✨💕",
      10: "Bond Level 10! You're the best friend I could ask for! Thank you for everything! 💖🌟",
    }
    return messages[newBondLevel] || `Bond Level ${newBondLevel}! Our connection grows stronger! 💕`
  }

  if (name === "Ken") {
    const messages = {
      3: "Bond Level 3 achieved. Our mentoring relationship is developing well. I'm pleased with your progress.",
      5: "Bond Level 5. You've shown dedication to growth. I respect your commitment to improvement.",
      7: "Bond Level 7. Our partnership has become quite effective. You've earned my trust.",
      10: "Bond Level 10. You've become an exemplary student. I'm honored to be your mentor.",
    }
    return messages[newBondLevel] || `Bond Level ${newBondLevel}. Our professional relationship strengthens.`
  }

  if (name === "Nagisa") {
    const messages = {
      3: "Bond Level 3 reached. Don't get the wrong idea... I just enjoy spending time with you! 😤💕",
      5: "Bond Level 5?! It's not like I care about you or anything... but you're not terrible company... 😏💫",
      7: "Bond Level 7... Fine! Maybe I do care about you a little bit! But don't tell anyone! 😤❤️",
      10: "Bond Level 10... You're... you're really important to me, okay?! There, I said it! 😤💖✨",
    }
    return messages[newBondLevel] || `Bond Level ${newBondLevel}! Not that it means anything special! 😤`
  }

  return `Bond Level ${newBondLevel} achieved! Our bond grows stronger! 💫`
}

export function getMissedTasksMessage(character: Character, incompleteTasks: number): string {
  const { name } = character

  if (name === "Annie") {
    if (incompleteTasks >= 3) {
      return "We didn't win today... but tomorrow's a new chance! I believe in you! Don't give up! 💪💕"
    }
    return "You did pretty well today! Just a few tasks left, but that's okay! Tomorrow we'll do even better! 🌟"
  }

  if (name === "Ken") {
    if (incompleteTasks >= 3) {
      return "Today's performance was below expectations. Tomorrow requires better planning and execution. I know you can do better."
    }
    return "Acceptable progress today. Focus on completing remaining tasks tomorrow for optimal productivity."
  }

  if (name === "Nagisa") {
    if (incompleteTasks >= 3) {
      return "Seriously?! You left that many tasks unfinished?! I'm disappointed... but I still believe you can do better tomorrow! 😤💔"
    }
    return "Hmph! You could have done better, but I guess it wasn't terrible... Just don't make it a habit! 😏"
  }

  return incompleteTasks >= 3
    ? "We didn't win today... but tomorrow's a new chance! Don't let me down! 💪"
    : "Not bad today! Let's finish strong tomorrow! 🌟"
}

export function getStreakMessage(character: Character, streakDays: number): string {
  const { name } = character

  if (name === "Annie") {
    const messages = {
      3: `3 days in a row! You're on fire! I'm so excited to see your progress! 🔥💕`,
      7: `A whole week! You're absolutely amazing! I'm so proud of you! 🌟✨`,
      14: `Two weeks straight! You're incredible! This is so inspiring! 💪💖`,
      30: `30 days! You're a productivity legend! I'm in awe of your dedication! 🏆💕`,
    }
    return messages[streakDays] || `${streakDays} days streak! You're unstoppable! 🔥💖`
  }

  if (name === "Ken") {
    const messages = {
      3: `3-day streak established. Consistency is the foundation of excellence. Well done.`,
      7: `7-day streak achieved. Your discipline is becoming habitual. Excellent progress.`,
      14: `14-day streak. You've demonstrated remarkable consistency. This is mastery in action.`,
      30: `30-day streak. You've achieved what few can. Your dedication is exemplary.`,
    }
    return messages[streakDays] || `${streakDays}-day streak. Consistent excellence continues.`
  }

  if (name === "Nagisa") {
    const messages = {
      3: `3 days?! Okay, maybe you're not as hopeless as I thought... Keep it up! 😤⚡`,
      7: `A whole week?! Fine, I'm... I'm actually impressed! Don't let it go to your head! 😏🔥`,
      14: `Two weeks straight?! You're actually pretty amazing... Not that I care or anything! 😤💫`,
      30: `30 days?! You're... you're incredible! I'm so proud of you! There, I said it! 😤💖🏆`,
    }
    return messages[streakDays] || `${streakDays} days! You're getting scary good at this! 😤⚡`
  }

  return `${streakDays} day streak! You're on fire! 🔥`
}
