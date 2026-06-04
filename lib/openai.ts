export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content: string
    }
  }>
  error?: string
}

// Companions should read like a real person texting, not a formatted AI answer.
// Strip markdown asterisks (*bold*, *actions*) and dash-based bullets/separators,
// while preserving hyphens inside words (e.g. "well-done", "9-to-5").
export function humanizeReply(text: string): string {
  if (!text) return text
  let out = text
  // Remove all asterisks (bold/italic/roleplay markers).
  out = out.replace(/\*/g, "")
  // Remove leading bullet markers at the start of any line.
  out = out.replace(/^[ \t]*[-•]\s+/gm, "")
  // Em/en dashes are a dead giveaway of AI text — turn them into commas (keep line breaks).
  out = out.replace(/[ \t]*[—–][ \t]*/g, ", ")
  // A hyphen used as a separator between spaces becomes a comma; intra-word hyphens stay.
  out = out.replace(/ +-+ +/g, ", ")
  // Collapse any doubled commas the substitutions may have created.
  out = out.replace(/ *,(?: *,)+/g, ",")
  // Tidy up whitespace left behind.
  out = out.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim()
  return out
}

// Plain-text + persona instructions shared by every companion prompt.
const STYLE_INSTRUCTION =
  "Write like a real person sending a casual text message. Do NOT use any markdown formatting: no asterisks, no bold, no italics, no bullet points, and no dashes for lists. Never use em dashes (—) or en dashes (–); use commas or separate sentences instead. Use plain sentences and emojis only."

export async function callOpenAI(
  messages: ChatMessage[],
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        // Only forward a model when the caller explicitly asks for one; otherwise let the
        // server route apply the OPENAI_MODEL env default.
        ...(options.model ? { model: options.model } : {}),
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.8,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: OpenAIResponse = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return humanizeReply(data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.')
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw error
  }
}

// Helper function for character-specific prompts
export function createCharacterPrompt(
  characterPrompt: string,
  username: string,
  taskContext?: string,
  personaHint?: string
): ChatMessage[] {
  const personaLine = personaHint ? `\n\n${personaHint}` : ""
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `${characterPrompt}\n\nThe user's name is "${username}". You can use their name in conversation when appropriate.${personaLine}\n\n${STYLE_INSTRUCTION}`,
    }
  ]

  if (taskContext) {
    messages.push({
      role: 'system',
      content: taskContext
    })
  }

  return messages
}

// Helper function for task completion messages
export function createTaskCompletionPrompt(
  character: any,
  task: any,
  username: string
): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `${character.prompt}\n\nThe user's name is "${username}". You are celebrating their task completion.`,
    },
    {
      role: 'user',
      content: `I just completed the task: "${task.text}" (${task.category}, ${task.difficulty} difficulty). Please give me a brief, encouraging response celebrating this achievement!`
    }
  ]
} 