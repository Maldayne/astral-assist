import ButtonItem from "@/components/ui/ButtonItem"
import { useAppStore } from "@/store/appStore"
import { Menu, Mic, MicOff } from "lucide-vue-next"
import { computed, defineComponent, PropType, ref } from "vue"
import AssistantProfileSelector from "../assistant-profile/AssistantProfileSelector"
import TranscriptDisplay from "../chat/TranscriptDisplay"

export default defineComponent({
  name: "Header",
  props: {
    onToggleDrawer: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore()
    const searchQuery = ref("")

    const filteredGroups = computed(() => {
      return appStore.assistantProfiles.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const toggleListening = () => {
      appStore.toggleContinuousListening()
    }

    return () => (
      <header class="bg-white dark:bg-gray-800 shadow w-full">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <ButtonItem
                variant="ghost"
                size="icon"
                onClick={props.onToggleDrawer}
              >
                <Menu class="h-6 w-6" />
              </ButtonItem>
              <AssistantProfileSelector
                groups={filteredGroups.value}
                searchQuery={searchQuery.value}
                onUpdateSearch={(query: string) => (searchQuery.value = query)}
              />
            </div>
            <div class="flex items-center space-x-4">
              <TranscriptDisplay />
              <ButtonItem onClick={toggleListening} class="ml-2">
                {appStore.isContinuousListening ? <Mic /> : <MicOff />}
              </ButtonItem>
            </div>
          </div>
        </div>
      </header>
    )
  },
})
