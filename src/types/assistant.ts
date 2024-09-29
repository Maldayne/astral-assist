export interface Assistant {
  id: string
  name: string
  avatar: string | null
  type: "query" | "command"
  backgroundColor: string
}

export interface AssistantCardProps extends Assistant {
  isActive: boolean
}

export interface AssistantGroup {
  id: string
  name: string
  assistants: Assistant[]
}
