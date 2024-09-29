import { useAppStore } from "@/store/appStore"
import { computed, defineComponent, ref, watch } from "vue"
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

    const selectedAssistantFilter = ref<string[]>([])

    watch(
      () => currentGroupAssistants.value,
      (newAssistants) => {
        selectedAssistantFilter.value = newAssistants.map(
          (assistant) => assistant.id
        )
      },
      { immediate: true }
    )

    const sendMessage = (message: string) => {
      appStore.sendMessage(message)
    }

    const updateAssistantFilter = (filter: string[]) => {
      selectedAssistantFilter.value = filter
    }

    return () => (
      <div class="flex flex-col h-full">
        <ChatHistory
          messages={appStore.filteredChatMessages}
          currentGroupAssistants={currentGroupAssistants.value}
          selectedAssistantFilter={selectedAssistantFilter.value}
          onUpdateFilter={updateAssistantFilter}
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
