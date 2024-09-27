import { STTFactory, STTProviderType } from "@/services/stt/STTFactory"
import { STTProvider } from "@/services/stt/STTProvider"
import { Assistant, AssistantGroup } from "@/types/assistant"
import { defineStore } from "pinia"
import { computed, ref, shallowRef } from "vue"

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
    // ... other groups ...
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
      console.log(`Active assistant set to: ${assistant.name}`)
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

  // Transparency Feature
  const isTransparencyEnabled = ref(false)

  function toggleTransparency() {
    isTransparencyEnabled.value = !isTransparencyEnabled.value
  }

  // Chat Management
  const chatMessages = ref<
    Record<string, { role: "user" | "assistant" | "error"; content: string }[]>
  >({})
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
      console.log(`Sending message to ${activeAssistant.value.name}`)
      if (activeAssistant.value.name === "Alpha") {
        const systemPrompt = `You are a helpful AI assistant named ${activeAssistant.value.name}.`
        console.log(`System prompt: ${systemPrompt}`)
        // Implement actual AI service call here
        response = `This is a placeholder response from ${activeAssistant.value.name}.`
      } else {
        response = `I'm ${activeAssistant.value.name}, and I'm not fully implemented yet.`
      }
      chatMessages.value[assistantId].push({
        role: "assistant",
        content: response,
      })
    } catch (error) {
      console.error("Error querying AI:", error)
      chatMessages.value[assistantId].push({
        role: "error",
        content: "An error occurred. Please try again later.",
      })
    } finally {
      isLoading.value = false
    }
  }

  // Speech-to-Text (STT) Management
  const sttPreference = ref<STTProviderType>("windows")

  function setSttPreference(preference: STTProviderType) {
    sttPreference.value = preference
  }

  // Continuous Listening Feature
  const isContinuousListening = ref(false)
  const transcribedWords = shallowRef<string[]>([])
  const lastProcessedIndex = ref(-1)
  const detectedAssistantName = ref<string | null>(null)
  const silenceDuration = ref(1500) // 1.5 seconds in milliseconds
  const nameMatchConfidence = ref(100) // 100% confidence by default
  const killSwitchWords = ref(["cancel", "stop"])
  const continuousListeningTimeout = ref(300000) // 5 minutes in milliseconds

  let sttProvider: STTProvider | null = null

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
    const newWords = words.slice(lastProcessedIndex.value + 1)
    if (newWords.length > 0) {
      processNewWords(newWords)
      lastProcessedIndex.value = words.length - 1
    }
  }

  function processNewWords(words: string[]) {
    const spokenAssistantName = findSpokenAssistantName(words)
    if (spokenAssistantName) {
      const assistant = findAssistantByName(spokenAssistantName)
      if (assistant) {
        console.log(`Detected assistant name: ${spokenAssistantName}`)
        setActiveAssistant(assistant.id)
        const messageIndex = words.indexOf(spokenAssistantName) + 1
        const message = words.slice(messageIndex).join(" ")
        if (message.trim()) {
          console.log(`Sending message to ${assistant.name}: ${message}`)
          sendMessage(message.trim())
        }
      }
    }
  }

  function processTranscribedWords(words: string[]) {
    transcribedWords.value = words.slice(-5)
    const spokenAssistantName = findSpokenAssistantName(words)
    if (spokenAssistantName) {
      const assistant = findAssistantByName(spokenAssistantName)
      if (assistant) {
        console.log(`Detected assistant name: ${spokenAssistantName}`)
        setActiveAssistant(assistant.id)
        const messageIndex = words.indexOf(spokenAssistantName) + 1
        const message = words.slice(messageIndex).join(" ")
        if (message.trim()) {
          console.log(`Sending message to ${assistant.name}: ${message}`)
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

    // Transparency Feature
    isTransparencyEnabled,
    toggleTransparency,

    // Chat Management
    chatMessages,
    currentChatMessages,
    isLoading,
    sendMessage,

    // Speech-to-Text (STT) Management
    sttPreference,
    setSttPreference,

    // Continuous Listening Feature
    isContinuousListening,
    transcribedWords,
    detectedAssistantName,
    silenceDuration,
    nameMatchConfidence,
    killSwitchWords,
    continuousListeningTimeout,
    toggleContinuousListening,
    processTranscribedWords,
    updateTranscribedWords,
  }
})
