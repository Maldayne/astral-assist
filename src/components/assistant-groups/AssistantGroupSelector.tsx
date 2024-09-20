import ButtonItem from "@/components/ui/ButtonItem"
import { useAppStore } from "@/store/appStore"
import { ChevronDown, Search, User, Users } from "lucide-vue-next"
import { computed, defineComponent, ref } from "vue"

export default defineComponent({
  name: "AssistantGroupSelector",
  setup() {
    const appStore = useAppStore()
    const isDropdownOpen = ref(false)
    const searchQuery = ref("")

    const filteredItems = computed(() => {
      const query = searchQuery.value.toLowerCase()
      const filteredGroups = appStore.assistantGroups.filter((group) =>
        group.name.toLowerCase().includes(query)
      )
      const filteredIndividuals = appStore.individualAssistants.filter(
        (assistant) => assistant.name.toLowerCase().includes(query)
      )
      return [...filteredGroups, ...filteredIndividuals]
    })

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const selectItem = (id: string) => {
      appStore.setActiveAssistantOrGroup(id)
      isDropdownOpen.value = false
    }

    const activeItemName = computed(() => {
      if (appStore.activeGroupId) {
        return appStore.activeGroup?.name || "Select a group or assistant"
      } else {
        return appStore.activeAssistant?.name || "Select a group or assistant"
      }
    })

    return () => (
      <div class="relative">
        <ButtonItem onClick={toggleDropdown} class="flex items-center">
          {activeItemName.value}
          <ChevronDown class="ml-2 h-4 w-4" />
        </ButtonItem>

        {isDropdownOpen.value && (
          <div class="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div class="p-2">
              <div class="relative">
                <Search class="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  class="w-full pl-8 pr-2 py-1 border rounded text-sm"
                  placeholder="Search groups or assistants..."
                  v-model={searchQuery.value}
                />
              </div>
            </div>
            <div class="py-1" role="menu" aria-orientation="vertical">
              {filteredItems.value.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectItem(item.id)}
                  class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  {"assistants" in item ? (
                    <Users class="mr-2 h-4 w-4" />
                  ) : (
                    <User class="mr-2 h-4 w-4" />
                  )}
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
})
