import { aiService, LowCreditError } from "@/modules/query/aiService"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

interface Assistant {
  id: string
  name: string
  avatar: string | null
  type: "query" | "command"
}

interface AssistantGroup {
  id: string
  name: string
  assistants: Assistant[]
}

interface ChatMessage {
  role: "user" | "assistant" | "error"
  content: string
}

export const useAppStore = defineStore("app", () => {
  const assistantGroups = ref<AssistantGroup[]>([
    {
      id: "1",
      name: "Default Group",
      assistants: [
        {
          id: "1",
          name: "Alpha",
          avatar: "/path/to/avatar1.png",
          type: "query",
        },
        {
          id: "2",
          name: "Bravo",
          avatar: "/path/to/avatar2.png",
          type: "command",
        },
        {
          id: "3",
          name: "Charlie",
          avatar: "/path/to/avatar3.png",
          type: "query",
        },
        {
          id: "4",
          name: "Delta",
          avatar: "/path/to/avatar4.png",
          type: "command",
        },
        {
          id: "5",
          name: "Echo",
          avatar: "/path/to/avatar5.png",
          type: "query",
        },
      ],
    },
    {
      id: "2",
      name: "Small Group",
      assistants: [
        {
          id: "6",
          name: "Apollo",
          avatar: "/path/to/avatar6.png",
          type: "query",
        },
        {
          id: "7",
          name: "Artemis",
          avatar: "/path/to/avatar7.png",
          type: "command",
        },
      ],
    },
    {
      id: "3",
      name: "Single Assistant Group",
      assistants: [
        {
          id: "8",
          name: "OnlyOneAssistantInThisGroup",
          avatar: "/path/to/avatar8.png",
          type: "query",
        },
      ],
    },
    {
      id: "4",
      name: "Large Group",
      assistants: [
        {
          id: "10",
          name: "ten",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "11",
          name: "eleven",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "12",
          name: "twelve",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "13",
          name: "thirteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "14",
          name: "fourteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "15",
          name: "fifteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "16",
          name: "sixteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "17",
          name: "seventeen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "18",
          name: "eighteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "19",
          name: "nineteen",
          avatar: "/path/to/avatar10.png",
          type: "query",
        },
        {
          id: "20",
          name: "twenty",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "21",
          name: "twenty one",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "22",
          name: "twenty two",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "23",
          name: "twenty three",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "24",
          name: "twenty four",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "25",
          name: "twenty five",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "26",
          name: "twenty six",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "27",
          name: "twenty seven",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "28",
          name: "twenty eight",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "29",
          name: "twenty nine",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
        {
          id: "30",
          name: "thirty",
          avatar: "/path/to/avatar20.png",
          type: "query",
        },
      ],
    },
  ])

  const individualAssistants = ref<Assistant[]>([
    {
      id: "9",
      name: "Solo Assistant",
      avatar: "/path/to/avatar9.png",
      type: "command",
    },
  ])

  const activeGroupId = ref<string | null>(assistantGroups.value[0].id)
  const activeAssistantId = ref<string>(
    assistantGroups.value[0].assistants[0].id
  )

  const allAssistants = computed((): Assistant[] => {
    return [
      ...assistantGroups.value.flatMap((group) => group.assistants),
      ...individualAssistants.value,
    ]
  })

  const activeGroup = computed(() =>
    activeGroupId.value
      ? assistantGroups.value.find((group) => group.id === activeGroupId.value)
      : null
  )

  const activeAssistant = computed(() =>
    allAssistants.value.find(
      (assistant) => assistant.id === activeAssistantId.value
    )
  )

  const currentAssistants = computed((): Assistant[] => {
    if (activeGroupId.value) {
      return activeGroup.value?.assistants || []
    } else {
      return individualAssistants.value
    }
  })

  const isTransparencyEnabled = ref(false)

  function setActiveAssistantOrGroup(id: string) {
    const group = assistantGroups.value.find((g) => g.id === id)
    if (group) {
      activeGroupId.value = id
      activeAssistantId.value = group.assistants[0].id
    } else {
      const assistant = individualAssistants.value.find((a) => a.id === id)
      if (assistant) {
        activeGroupId.value = null
        activeAssistantId.value = id
      }
    }
  }

  function setActiveAssistant(assistantId: string) {
    const assistant = allAssistants.value.find((a) => a.id === assistantId)
    if (assistant) {
      activeAssistantId.value = assistantId
      const group = assistantGroups.value.find((g) =>
        g.assistants.includes(assistant)
      )
      activeGroupId.value = group ? group.id : null
    }
  }

  function addAssistantGroup(name: string) {
    const newId = (
      parseInt(assistantGroups.value[assistantGroups.value.length - 1].id) + 1
    ).toString()
    assistantGroups.value.push({
      id: newId,
      name,
      assistants: [],
    })
  }

  function addAssistantToGroup(groupId: string, assistant: Assistant) {
    const group = assistantGroups.value.find((g) => g.id === groupId)
    if (group) {
      group.assistants.push(assistant)
    }
  }

  function addIndividualAssistant(assistant: Assistant) {
    individualAssistants.value.push(assistant)
  }

  function updateAssistantAvatar(
    assistantId: string,
    avatarUrl: string | null
  ) {
    const updateAssistant = (assistant: Assistant) => {
      if (assistant.id === assistantId) {
        assistant.avatar = avatarUrl
      }
    }

    assistantGroups.value.forEach((group) =>
      group.assistants.forEach(updateAssistant)
    )
    individualAssistants.value.forEach(updateAssistant)
  }

  function toggleTransparency() {
    isTransparencyEnabled.value = !isTransparencyEnabled.value
  }

  const chatMessages = ref<Record<string, ChatMessage[]>>({})
  const isLoading = ref(false)

  const currentChatMessages = computed(() => {
    return chatMessages.value[activeAssistantId.value] || []
  })

  async function sendMessage(message: string) {
    if (!activeAssistant.value) return

    const assistantId = activeAssistant.value.id
    if (!chatMessages.value[assistantId]) {
      chatMessages.value[assistantId] = []
    }

    chatMessages.value[assistantId].push({ role: "user", content: message })
    isLoading.value = true

    try {
      let response: string
      if (activeAssistant.value.name === "Alpha") {
        const systemPrompt = "You are a helpful AI assistant named Alpha."
        console.log(
          "Sending message to Alpha with system prompt:",
          systemPrompt
        )
        response = await aiService.queryClaude(message, systemPrompt)
      } else {
        response = "I'm sorry, I'm not implemented yet."
      }
      chatMessages.value[assistantId].push({
        role: "assistant",
        content: response,
      })
    } catch (error) {
      console.error("Error querying AI:", error)
      let errorMessage =
        "I'm sorry, I encountered an error while processing your request. Please try again later."

      if (error instanceof LowCreditError) {
        errorMessage =
          "I apologize, but the AI service is currently unavailable due to insufficient credit balance. Please contact the administrator to resolve this issue."
      } else if (error instanceof Error) {
        console.error("Error details:", error.message)
        console.error("Error stack:", error.stack)
      }

      chatMessages.value[assistantId].push({
        role: "error",
        content: errorMessage,
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isTransparencyEnabled,
    toggleTransparency,
    assistantGroups,
    individualAssistants,
    activeGroupId,
    activeAssistantId,
    allAssistants,
    activeGroup,
    activeAssistant,
    currentAssistants,
    setActiveAssistantOrGroup,
    setActiveAssistant,
    addAssistantGroup,
    addAssistantToGroup,
    addIndividualAssistant,
    updateAssistantAvatar,
    sendMessage,
    chatMessages,
    currentChatMessages: computed(
      () => chatMessages.value[activeAssistantId.value] || []
    ),
    isLoading,
  }
})
