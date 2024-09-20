import { useAppStore } from "@/store/appStore"
import { computed, defineComponent } from "vue"
import ChatArea from "../chat/ChatArea"
import AssistantHeader from "./AssistantHeader"
import NoAssistantSelected from "./NoAssistantSelected"

export default defineComponent({
  name: "ActiveAssistantDisplay",
  setup() {
    const appStore = useAppStore()
    const activeAssistant = computed(() => appStore.activeAssistant)

    return () => (
      <div class="w-full h-full p-4">
        {activeAssistant.value ? (
          <div class="h-full flex flex-col">
            <AssistantHeader assistant={activeAssistant.value} />
            <ChatArea
              assistantId={activeAssistant.value.id}
              class="flex-grow overflow-y-auto mb-4"
            />
          </div>
        ) : (
          <NoAssistantSelected />
        )}
      </div>
    )
  },
})
