import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  user_id: string
  username: string
  email: string
  plan: "Free" | "Premium"
  total_xp: number
  streak_count: number
  message_count?: { [characterId: number]: number }
  crew: CharacterData[]
  bond_levels: { [characterId: number]: number }
  chat_history: { [characterId: number]: Message[] }
  custom_character?: CustomCharacter
  tasks: TaskData[]
  last_task_check: string
  last_login?: string
  last_checkin_time?: number
}

export interface CharacterData {
  id: number
  level: number
  xp: number
  tasks_completed: number
}

export interface TaskData {
  task_id: string
  name: string
  category: "Health" | "Work" | "Study" | "Personal" | "General"
  xp_value: number
  status: "completed" | "pending"
  created_at: string
  completed_at?: string
}

export interface CustomCharacter {
  name: string
  avatar: string
  personality: string
  description: string
  prompt: string
}

export interface Message {
  id: number
  text: string
  sender: "user" | "character"
  timestamp: Date
  type?: "text" | "reward" | "system"
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { error } = await supabase.from("user_profiles").update(updates).eq("user_id", userId)

  if (error) {
    console.error("Error updating user profile:", error)
    return false
  }

  return true
}

export async function createUserProfile(profile: UserProfile) {
  const { error } = await supabase.from("user_profiles").insert([profile])

  if (error) {
    console.error("Error creating user profile:", error)
    return false
  }

  return true
}

export async function upsertUserProfile(profile: UserProfile) {
  const { error } = await supabase.from("user_profiles").upsert(profile, { onConflict: "user_id" })

  if (error) {
    console.error("Error upserting user profile:", error)
    return false
  }

  return true
}

export async function deleteUserProfile(userId: string) {
  const { error } = await supabase.from("user_profiles").delete().eq("user_id", userId)

  if (error) {
    console.error("Error deleting user profile:", error)
    return false
  }

  return true
}
