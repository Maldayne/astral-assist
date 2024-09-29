import { aiService } from "@/modules/query/aiService"
import { STTFactory, STTProviderType } from "@/services/stt/STTFactory"
import { STTProvider } from "@/services/stt/STTProvider"
import { AssistantProfileType, AssistantType } from "@/types/assistant"
import { defineStore } from "pinia"
import { computed, ref, shallowRef } from "vue"

interface ChatMessage {
  id: string
  assistantId: string
  role: "user" | "assistant" | "error" | "system"
  content: string
  timestamp: number
}

export const useAppStore = defineStore("app", () => {
  // Assistant and Profile Management
  const assistantProfiles = ref<AssistantProfileType[]>([
    {
      id: "1",
      name: "Default Profile",
      assistants: [
        {
          id: "1",
          name: "Alpha",
          avatar: "/path/to/avatar1.png",
          type: "query",
          color: "blue",
        },
        {
          id: "2",
          name: "Bravo",
          avatar: "/path/to/avatar2.png",
          type: "command",
          color: "green",
        },
        {
          id: "3",
          name: "Charlie",
          avatar: "/path/to/avatar3.png",
          type: "query",
          color: "yellow",
        },
        {
          id: "4",
          name: "Delta",
          avatar: "/path/to/avatar4.png",
          type: "command",
          color: "red",
        },
        {
          id: "5",
          name: "Echo",
          avatar: "/path/to/avatar5.png",
          type: "query",
          color: "orange",
        },
      ],
    },
  ])

  const individualAssistants = ref<AssistantType[]>([
    {
      id: "9",
      name: "Solo Assistant",
      avatar: "/path/to/avatar9.png",
      type: "command",
      color: "#E6FFE6",
    },
  ])

  const activeAssistantProfileId = ref<string | null>(
    assistantProfiles.value[0].id
  )
  const activeAssistantId = ref<string>(
    assistantProfiles.value[0].assistants[0].id
  )

  const allAssistants = computed((): AssistantType[] => {
    return [
      ...assistantProfiles.value.flatMap(
        (assistantProfile) => assistantProfile.assistants
      ),
      ...individualAssistants.value,
    ]
  })

  const activeAssistantProfile = computed(() =>
    activeAssistantProfileId.value
      ? assistantProfiles.value.find(
          (assistantProfile) =>
            assistantProfile.id === activeAssistantProfileId.value
        )
      : null
  )

  const activeAssistant = computed(() =>
    allAssistants.value.find(
      (assistant) => assistant.id === activeAssistantId.value
    )
  )

  const currentAssistants = computed((): AssistantType[] => {
    if (activeAssistantProfileId.value) {
      return activeAssistantProfile.value?.assistants || []
    } else {
      return individualAssistants.value
    }
  })

  // Chat Management
  const chatMessages = ref<ChatMessage[]>([])
  const selectedAssistantFilter = ref<string[]>(["all"])
  const isLoading = ref(false)

  const filteredChatMessages = computed(() => {
    if (
      selectedAssistantFilter.value.includes("all") ||
      selectedAssistantFilter.value.length === 0
    ) {
      return chatMessages.value
    }
    return chatMessages.value.filter((message) =>
      selectedAssistantFilter.value.includes(message.assistantId)
    )
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
  function setActiveAssistantOrProfile(id: string) {
    const profile = assistantProfiles.value.find((g) => g.id === id)
    if (profile) {
      activeAssistantProfileId.value = id
      activeAssistantId.value = profile.assistants[0].id
    } else {
      const assistant = individualAssistants.value.find((a) => a.id === id)
      if (assistant) {
        activeAssistantProfileId.value = null
        activeAssistantId.value = id
      }
    }
  }

  function setActiveAssistant(assistantId: string) {
    const assistant = allAssistants.value.find((a) => a.id === assistantId)
    if (assistant) {
      activeAssistantId.value = assistantId
      const profile = assistantProfiles.value.find((g) =>
        g.assistants.includes(assistant)
      )
      activeAssistantProfileId.value = profile ? profile.id : null
    }
  }

  function addAssistantProfile(name: string) {
    const newId = (
      parseInt(assistantProfiles.value[assistantProfiles.value.length - 1].id) +
      1
    ).toString()
    assistantProfiles.value.push({
      id: newId,
      name,
      assistants: [],
    })
  }

  const DEFAULT_ASSISTANT_COLOR = "#E8EEF4"

  function addAssistantToProfile(
    profileId: string,
    assistant: Partial<AssistantType>
  ) {
    const profile = assistantProfiles.value.find((g) => g.id === profileId)
    if (profile) {
      profile.assistants.push({
        id: Date.now().toString(),
        name: assistant.name || "New Assistant",
        avatar: assistant.avatar || null,
        type: assistant.type || "query",
        color: assistant.color || DEFAULT_ASSISTANT_COLOR,
      })
    }
  }

  function addIndividualAssistant(assistant: Partial<AssistantType>) {
    individualAssistants.value.push({
      id: Date.now().toString(),
      name: assistant.name || "New Assistant",
      avatar: assistant.avatar || null,
      type: assistant.type || "query",
      color: assistant.color || DEFAULT_ASSISTANT_COLOR,
    })
  }

  function updateAssistantAvatar(
    assistantId: string,
    avatarUrl: string | null
  ) {
    const updateAssistant = (assistant: AssistantType) => {
      if (assistant.id === assistantId) {
        assistant.avatar = avatarUrl
      }
    }

    assistantProfiles.value.forEach((assistantProfile) =>
      assistantProfile.assistants.forEach(updateAssistant)
    )
    individualAssistants.value.forEach(updateAssistant)
  }

  function addMessage(message: Omit<ChatMessage, "id" | "timestamp">) {
    chatMessages.value.push({
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    })
  }

  function setAssistantFilter(assistantIds: string[]) {
    selectedAssistantFilter.value = assistantIds
  }

  async function sendMessage(message: string) {
    if (!activeAssistant.value || typeof activeAssistant.value.id !== "string")
      return

    const assistantId = activeAssistant.value.id
    addMessage({ assistantId, role: "user", content: message })
    isLoading.value = true

    try {
      let response: string
      if (activeAssistant.value.type === "query") {
        const systemPrompt = `You are a helpful AI assistant named ${activeAssistant.value.name}.`
        response = await aiService.queryClaude(message, systemPrompt)
      } else {
        response = `I'm ${activeAssistant.value.name}, a command assistant, and I'm not fully implemented yet.`
      }
      addMessage({ assistantId, role: "assistant", content: response })
    } catch (error) {
      console.error("Error querying AI:", error)
      addMessage({
        assistantId,
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

  function findAssistantByName(name: string): AssistantType | undefined {
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
    // Assistant and Profile Management
    assistantProfiles,
    individualAssistants,
    activeAssistantProfileId,
    activeAssistantId,
    allAssistants,
    activeAssistantProfile,
    activeAssistant,
    currentAssistants,
    setActiveAssistantOrProfile,
    setActiveAssistant,
    addAssistantProfile,
    addAssistantToProfile,
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
