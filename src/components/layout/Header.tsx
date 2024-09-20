import ButtonItem from "@/components/ui/ButtonItem"
import { useAppStore } from "@/store/appStore"
import { Menu } from "lucide-vue-next"
import { computed, defineComponent, PropType, ref } from "vue"
import AssistantGroupSelector from "../assistant-groups/AssistantGroupSelector"

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
      return appStore.assistantGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

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
              <AssistantGroupSelector
                groups={filteredGroups.value}
                searchQuery={searchQuery.value}
                onUpdateSearch={(query: string) => (searchQuery.value = query)}
              />
            </div>
          </div>
        </div>
      </header>
    )
  },
})
