import { useAppStore } from "@/store/appStore"
import { computed, defineComponent } from "vue"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

export default defineComponent({
  name: "ChatArea",
  setup() {
    const appStore = useAppStore()

    const currentAssistant = computed(() => appStore.activeAssistant)

    const currentGroupAssistants = computed(() =>
      appStore.activeAssistantProfile
        ? appStore.activeAssistantProfile.assistants
        : []
    )

    const sendMessage = (message: string) => {
      appStore.sendMessage(message)
    }

    return () => (
      <div class="flex flex-col h-full">
        <ChatHistory
          messages={appStore.filteredChatMessages}
          currentGroupAssistants={currentGroupAssistants.value}
          selectedAssistantFilter={appStore.selectedAssistantFilter}
          onUpdateFilter={appStore.setAssistantFilter}
          isLoading={appStore.isLoading}
        />
        <ChatInput
          onSendMessage={sendMessage}
          disabled={appStore.isLoading}
          currentAssistant={currentAssistant.value}
        />
      </div>
    )
  },
})
