import ChatInterface, { Message } from "@/components/chat/ChatInterface"
import { useAppStore } from "@/store/appStore"
import { defineComponent, ref } from "vue"
import { aiService } from "./aiService"

export default defineComponent({
  name: "QueryModule",
  setup() {
    const appStore = useAppStore()
    const messages = ref<Message[]>([])
    const isLoading = ref(false)

    const sendMessage = async (message: string) => {
      if (!appStore.activeAssistant) return

      messages.value.push({ role: "user", content: message })
      isLoading.value = true

      try {
        let response: string
        if (appStore.activeAssistant.name === "Alpha") {
          const systemPrompt = "You are a helpful AI assistant named Alpha."
          response = await aiService.queryClaude(message, systemPrompt)
        } else {
          response = "I'm sorry, I'm not implemented yet."
        }
        messages.value.push({ role: "assistant", content: response })
      } catch (error) {
        console.error("Error querying AI:", error)
        messages.value.push({
          role: "error",
          content:
            "An error occurred while processing your request. Please try again later.",
        })
      } finally {
        isLoading.value = false
      }
    }

    return () => (
      <ChatInterface
        messages={messages.value}
        isLoading={isLoading.value}
        onSendMessage={sendMessage}
      />
    )
  },
})
