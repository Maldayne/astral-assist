import { useAppStore } from "@/store/appStore"
import { computed, defineComponent, watch } from "vue"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

export default defineComponent({
  name: "ChatArea",
  setup() {
    const appStore = useAppStore()

    const currentChatMessages = computed(() => {
      if (
        appStore.activeAssistant &&
        typeof appStore.activeAssistant.id === "string"
      ) {
        return appStore.chatMessages[appStore.activeAssistant.id] || []
      }
      return []
    })

    const assistantBackgroundColor = computed(() => {
      return appStore.activeAssistant?.backgroundColor || ""
    })

    const sendMessage = (message: string) => {
      console.log("ChatArea - sendMessage:", message)
      appStore.sendMessage(message)
    }

    watch(
      () => appStore.activeAssistantId,
      () => {
        console.log("Active assistant changed, updating chat history")
      }
    )

    return () => (
      <div class="flex flex-col h-full">
        <ChatHistory
          messages={currentChatMessages.value}
          assistantBackgroundColor={assistantBackgroundColor.value}
          isLoading={appStore.isLoading}
        />
        <ChatInput
          onSendMessage={sendMessage}
          disabled={appStore.isLoading}
          currentAssistant={appStore.activeAssistant}
        />
      </div>
    )
  },
})
