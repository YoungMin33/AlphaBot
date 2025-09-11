export type Role = 'bot' | 'user'

export interface ChatMessage {
  id: string
  role: Role
  text: string
}

