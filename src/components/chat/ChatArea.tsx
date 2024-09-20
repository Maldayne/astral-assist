import { defineComponent, ref, watch } from "vue"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default defineComponent({
  name: "ChatArea",
  props: {
    assistantId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chatMessages = ref<ChatMessage[]>([])

    const sendMessage = (message: string) => {
      chatMessages.value.push({ role: "user", content: message })
      // Mock response - replace with actual AI integration
      setTimeout(() => {
        chatMessages.value.push({
          role: "assistant",
          content: `Assistant ${props.assistantId} says: ${message}`,
        })
      }, 1000)
    }

    // Reset chat messages when assistant changes
    watch(
      () => props.assistantId,
      () => {
        chatMessages.value = []
      }
    )

    return () => (
      <div class="flex flex-col h-full">
        <ChatHistory messages={chatMessages.value} />
        <ChatInput onSendMessage={sendMessage} />
      </div>
    )
  },
})
