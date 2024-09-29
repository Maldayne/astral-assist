import { aiService } from "@/modules/query/aiService"
import { STTFactory, STTProviderType } from "@/services/stt/STTFactory"
import { STTProvider } from "@/services/stt/STTProvider"
import { Assistant, AssistantGroup } from "@/types/assistant"
import { defineStore } from "pinia"
import { computed, ref, shallowRef } from "vue"

interface ChatMessage {
  role: "user" | "assistant" | "error" | "system"
  content: string
}

export const useAppStore = defineStore("app", () => {
  // Assistant and Group Management
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
          backgroundColor: "blue",
        },
        {
          id: "2",
          name: "Bravo",
          avatar: "/path/to/avatar2.png",
          type: "command",
          backgroundColor: "green",
        },
        {
          id: "3",
          name: "Charlie",
          avatar: "/path/to/avatar3.png",
          type: "query",
          backgroundColor: "yellow",
        },
        {
          id: "4",
          name: "Delta",
          avatar: "/path/to/avatar4.png",
          type: "command",
          backgroundColor: "red",
        },
        {
          id: "5",
          name: "Echo",
          avatar: "/path/to/avatar5.png",
          type: "query",
          backgroundColor: "orange",
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
      backgroundColor: "#E6FFE6",
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

  // Chat Management
  const chatMessages = ref<Record<string, ChatMessage[]>>({})
  const selectedAssistantFilter = ref<string | null>(null)
  const isLoading = ref(false)

  const filteredChatMessages = computed(() => {
    if (selectedAssistantFilter.value === null) {
      return chatMessages.value
    }
    const filteredMessages: Record<string, ChatMessage[]> = {}
    if (selectedAssistantFilter.value in chatMessages.value) {
      filteredMessages[selectedAssistantFilter.value] =
        chatMessages.value[selectedAssistantFilter.value]
    }
    return filteredMessages
  })

  // STT Management
  const sttPreference = ref<STTProviderType>("windows")
  const isContinuousListening = ref(false)
  const transcribedWords = shallowRef<string[]>([])
  const detectedAssistantName = ref<string | null>(null)
  const silenceDuration = ref(1000)
  const nameMatchConfidence = ref(100)
  const killSwitchWords = ref(["cancel", "stop"])
  const continuousListeningTimeout = ref(1800000)

  let sttProvider: STTProvider | null = null

  // Functions
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

  const DEFAULT_ASSISTANT_COLOR = "#E8EEF4"

  function addAssistantToGroup(groupId: string, assistant: Partial<Assistant>) {
    const group = assistantGroups.value.find((g) => g.id === groupId)
    if (group) {
      group.assistants.push({
        id: Date.now().toString(),
        name: assistant.name || "New Assistant",
        avatar: assistant.avatar || null,
        type: assistant.type || "query",
        backgroundColor: assistant.backgroundColor || DEFAULT_ASSISTANT_COLOR,
      })
    }
  }

  function addIndividualAssistant(assistant: Partial<Assistant>) {
    individualAssistants.value.push({
      id: Date.now().toString(),
      name: assistant.name || "New Assistant",
      avatar: assistant.avatar || null,
      type: assistant.type || "query",
      backgroundColor: assistant.backgroundColor || DEFAULT_ASSISTANT_COLOR,
    })
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

  function addMessage(assistantId: string, message: ChatMessage) {
    if (!chatMessages.value[assistantId]) {
      chatMessages.value[assistantId] = []
    }
    chatMessages.value[assistantId].push(message)
  }

  function setAssistantFilter(assistantId: string | null) {
    selectedAssistantFilter.value = assistantId
  }

  async function sendMessage(message: string) {
    if (!activeAssistant.value || typeof activeAssistant.value.id !== "string")
      return

    const assistantId = activeAssistant.value.id
    addMessage(assistantId, { role: "user", content: message })
    isLoading.value = true

    try {
      let response: string
      console.log(`Sending message to ${activeAssistant.value.name}`)
      if (activeAssistant.value.type === "query") {
        const systemPrompt = `You are a helpful AI assistant named ${activeAssistant.value.name}.`
        console.log(`System prompt: ${systemPrompt}`)
        response = await aiService.queryClaude(message, systemPrompt)
      } else {
        response = `I'm ${activeAssistant.value.name}, a command assistant, and I'm not fully implemented yet.`
      }
      addMessage(assistantId, { role: "assistant", content: response })
    } catch (error) {
      console.error("Error querying AI:", error)
      addMessage(assistantId, {
        role: "error",
        content: "An error occurred. Please try again later.",
      })
    } finally {
      isLoading.value = false
    }
  }

  function setSttPreference(preference: STTProviderType) {
    sttPreference.value = preference
  }

  function toggleContinuousListening() {
    isContinuousListening.value = !isContinuousListening.value
    if (isContinuousListening.value) {
      startContinuousListening()
    } else {
      stopContinuousListening()
    }
  }

  async function startContinuousListening() {
    if (!sttProvider) {
      sttProvider = STTFactory.createProvider(sttPreference.value)
      sttProvider.onResult((result) => {
        if (result.isFinal) {
          const words = result.transcript.split(" ")
          updateTranscribedWords(words)
        }
      })
      sttProvider.onError((error) => {
        console.error("STT Error:", error)
        stopContinuousListening()
      })
    }
    await sttProvider.start()
  }

  async function stopContinuousListening() {
    if (sttProvider) {
      await sttProvider.stop()
    }
    transcribedWords.value = []
    detectedAssistantName.value = null
  }

  function updateTranscribedWords(words: string[]) {
    transcribedWords.value = words.slice(-5)
    processNewWords(words)
  }

  function processNewWords(words: string[]) {
    const spokenAssistantName = findSpokenAssistantName(words)
    if (spokenAssistantName) {
      const assistant = findAssistantByName(spokenAssistantName)
      if (assistant) {
        setActiveAssistant(assistant.id)
        const messageIndex = words.indexOf(spokenAssistantName) + 1
        const message = words.slice(messageIndex).join(" ")
        if (message.trim()) {
          sendMessage(message.trim())
        }
      }
    }
  }

  function findSpokenAssistantName(words: string[]): string | null {
    const lowerCaseWords = words.map((w) => w.toLowerCase())
    return (
      allAssistants.value.find((assistant) =>
        lowerCaseWords.includes(assistant.name.toLowerCase())
      )?.name || null
    )
  }

  function findAssistantByName(name: string): Assistant | undefined {
    return allAssistants.value.find(
      (assistant) => assistant.name.toLowerCase() === name.toLowerCase()
    )
  }

  // Dark Mode Management
  const isDarkMode = ref(true)

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    updateDarkMode(isDarkMode.value)
  }

  function updateDarkMode(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Initialize dark mode on app start
  updateDarkMode(isDarkMode.value)

  return {
    // Assistant and Group Management
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

    // Chat Management
    chatMessages,
    filteredChatMessages,
    isLoading,
    selectedAssistantFilter,
    addMessage,
    setAssistantFilter,
    sendMessage,

    // STT Management
    sttPreference,
    isContinuousListening,
    transcribedWords,
    detectedAssistantName,
    silenceDuration,
    nameMatchConfidence,
    killSwitchWords,
    continuousListeningTimeout,
    setSttPreference,
    toggleContinuousListening,
    updateTranscribedWords,

    // Dark Mode Management
    isDarkMode,
    toggleDarkMode,
  }
})
