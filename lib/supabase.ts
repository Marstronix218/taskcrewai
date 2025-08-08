import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getUserProfile(user_id) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", user_id).single()
  if (error) return null
  return data
}

export async function createUserProfile(profile) {
  const { error } = await supabase.from("user_profiles").insert([profile])
  return !error
}

export async function updateUserProfile(user_id, updates) {
  const { error } = await supabase.from("user_profiles").update(updates).eq("user_id", user_id)
  return !error
}

export async function getTasks(user_id) {
  const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user_id).order("created_at", { ascending: false })
  if (error) return []
  return data
}

export async function addTask(task) {
  const { data, error } = await supabase.from("tasks").insert([task]).select().single()
  if (error) return null
  return data
}

export async function updateTask(task_id, updates) {
  const { error } = await supabase.from("tasks").update(updates).eq("task_id", task_id)
  return !error
}

export async function deleteTask(task_id) {
  const { error } = await supabase.from("tasks").delete().eq("task_id", task_id)
  return !error
}

export interface UserProfile {
  user_id: string
  username: string
  email: string
  plan: "Free" | "Premium"
  total_xp: number
  streak_count: number
  crew: CharacterData[]
  bond_levels: { [characterId: number]: number }
  chat_history: { [characterId: number]: Message[] }
  custom_character?: CustomCharacter
  tasks: TaskData[]
  last_task_check: string
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
