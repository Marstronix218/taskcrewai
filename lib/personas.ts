// User personas — picked during onboarding and editable in profile settings.
// The `promptHint` is injected into companion system prompts so advice/examples
// fit the user's life context (a student vs. a parent, etc.).

export type PersonaId =
  | "student"
  | "professional"
  | "entrepreneur"
  | "creative"
  | "parent"
  | "athlete"

export interface Persona {
  id: PersonaId
  label: string
  emoji: string
  description: string
  /** Injected into the companion system prompt to tailor tone, examples, and advice. */
  promptHint: string
}

export const PERSONAS: Persona[] = [
  {
    id: "student",
    label: "Student",
    emoji: "🎓",
    description: "Juggling classes, assignments, and exams.",
    promptHint:
      "The user is a student balancing classes, assignments, deadlines, and exams. Frame productivity advice and examples around studying, coursework, and exam prep.",
  },
  {
    id: "professional",
    label: "Professional",
    emoji: "💼",
    description: "Navigating a 9-to-5 with meetings and deliverables.",
    promptHint:
      "The user is a working professional balancing meetings, deliverables, and a 9-to-5 schedule. Frame productivity advice around work tasks, focus blocks, and avoiding burnout.",
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    emoji: "🚀",
    description: "Running their own projects, clients, or business.",
    promptHint:
      "The user is an entrepreneur or freelancer managing their own projects, clients, and priorities. Frame advice around self-direction, prioritization, and shipping.",
  },
  {
    id: "creative",
    label: "Creative",
    emoji: "🎨",
    description: "Working on artistic, writing, or content projects.",
    promptHint:
      "The user is a creative working on artistic, writing, or content projects. Frame advice around beating creative blocks, building momentum, and consistent output.",
  },
  {
    id: "parent",
    label: "Parent / Caregiver",
    emoji: "🏡",
    description: "Balancing family life with personal goals.",
    promptHint:
      "The user is a parent or caregiver balancing family responsibilities with their own goals. Be understanding of limited time and frame advice around small, realistic wins.",
  },
  {
    id: "athlete",
    label: "Athlete",
    emoji: "🏃",
    description: "Focused on fitness and athletic training.",
    promptHint:
      "The user is focused on fitness and athletic training. Frame advice around training consistency, recovery, and discipline.",
  },
]

export function getPersona(id: string | null | undefined): Persona | undefined {
  if (!id) return undefined
  return PERSONAS.find((p) => p.id === id)
}

export function getPersonaPromptHint(id: string | null | undefined): string {
  return getPersona(id)?.promptHint ?? ""
}
