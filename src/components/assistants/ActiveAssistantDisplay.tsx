import CommandModule from "@/modules/command/CommandModule"
import QueryModule from "@/modules/query/QueryModule"
import { useAppStore } from "@/store/appStore"
import { computed, defineComponent } from "vue"
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
            {activeAssistant.value.type === "query" ? (
              <QueryModule />
            ) : (
              <CommandModule />
            )}
          </div>
        ) : (
          <NoAssistantSelected />
        )}
      </div>
    )
  },
})
