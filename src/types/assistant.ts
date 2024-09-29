export interface AssistantType {
  id: string
  name: string
  avatar: string | null
  type: "query" | "command"
  backgroundColor: string
}

export interface AssistantCardPropsType extends AssistantType {
  isActive: boolean
}

export interface AssistantProfileType {
  id: string
  name: string
  assistants: AssistantType[]
}

export interface ChatMessageType {
  id: string
  assistantId: string
  role: "user" | "assistant" | "error" | "system"
  content: string
  timestamp: number
}

export type AssistantFilterValueType = string | null
