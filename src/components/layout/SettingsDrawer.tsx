import DarkModeToggle from "@/features/theme/DarkModeToggle"
import { STTProviderType } from "@/services/stt/STTFactory"
import { useAppStore } from "@/store/appStore"
import { Plus, XIcon } from "lucide-vue-next"
import { defineComponent, PropType, ref } from "vue"
import ButtonItem from "../ui/ButtonItem"
import InputItem from "../ui/InputItem"
import SelectItem from "../ui/SelectItem"

export default defineComponent({
  name: "SettingsDrawer",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore()
    const newGroupName = ref("")
    const newAssistantName = ref("")
    const newAssistantType = ref<"query" | "command">("query")

    const sttOptions = [
      { value: "windows", label: "Windows STT" },
      { value: "vosk", label: "Vosk STT (Not implemented)" },
      { value: "whisper", label: "Whisper STT (Not implemented)" },
    ]

    const assistantTypeOptions = [
      { value: "query", label: "Query Assistant" },
      { value: "command", label: "Command Assistant" },
    ]

    const addNewGroup = () => {
      if (newGroupName.value.trim()) {
        appStore.addAssistantGroup(newGroupName.value.trim())
        newGroupName.value = ""
      }
    }

    const addNewAssistant = () => {
      if (newAssistantName.value.trim() && appStore.activeGroup) {
        appStore.addAssistantToGroup(appStore.activeGroup.id, {
          id: Date.now().toString(),
          name: newAssistantName.value.trim(),
          avatar: "/placeholder-avatar.png",
          type: newAssistantType.value,
          backgroundColor: newAssistantType.value,
        })
        newAssistantName.value = ""
        newAssistantType.value = "query"
      }
    }

    return () => (
      <aside
        class={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform ${
          props.isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        aria-label="Settings"
      >
        <div class="h-full flex flex-col">
          <header class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Astral Assist
            </h1>
            <button
              onClick={props.onClose}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              aria-label="Close settings"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </header>
          <nav class="flex-1 overflow-y-auto">
            <div class="p-4 space-y-6">
              <section aria-label="Theme settings">
                <h2 class="text-lg font-semibold mb-2">Theme</h2>
                <DarkModeToggle />
              </section>
              <section aria-label="Create new group">
                <h2 class="text-lg font-semibold mb-2">Create New Group</h2>
                <div class="space-y-2">
                  <InputItem
                    modelValue={newGroupName.value}
                    onUpdate:modelValue={(value: string) =>
                      (newGroupName.value = value)
                    }
                    placeholder="New group name"
                    class="w-full"
                    aria-label="New group name"
                  />
                  <ButtonItem
                    onClick={addNewGroup}
                    class="w-full justify-center"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add Group
                  </ButtonItem>
                </div>
              </section>
              <section aria-label="Create new assistant">
                <h2 class="text-lg font-semibold mb-2">Create New Assistant</h2>
                <div class="space-y-2">
                  <InputItem
                    modelValue={newAssistantName.value}
                    onUpdate:modelValue={(value: string) =>
                      (newAssistantName.value = value)
                    }
                    placeholder="New assistant name"
                    class="w-full"
                    aria-label="New assistant name"
                  />
                  <SelectItem
                    modelValue={newAssistantType.value}
                    onUpdate:modelValue={(value: "query" | "command") =>
                      (newAssistantType.value = value)
                    }
                    options={assistantTypeOptions}
                    placeholder="Select assistant type"
                    class="w-full"
                  />
                  <ButtonItem
                    onClick={addNewAssistant}
                    class="w-full justify-center"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add Assistant
                  </ButtonItem>
                </div>
              </section>
              <section aria-label="Speech-to-Text settings">
                <h2 class="text-lg font-semibold mb-2">Speech-to-Text</h2>
                <SelectItem
                  modelValue={appStore.sttPreference}
                  onUpdate:modelValue={(value: STTProviderType) =>
                    appStore.setSttPreference(value)
                  }
                  options={sttOptions}
                  placeholder="Select STT provider"
                />
              </section>
              <section aria-label="Continuous Listening Settings">
                <h2 class="text-lg font-semibold mb-2">
                  Continuous Listening Settings
                </h2>
                <div class="space-y-2">
                  <InputItem
                    modelValue={appStore.silenceDuration}
                    onUpdate:modelValue={(value: string | number) =>
                      (appStore.silenceDuration = Number(value))
                    }
                    type="number"
                    placeholder="Silence Duration (ms)"
                    class="w-full"
                    aria-label="Silence Duration in milliseconds"
                  />
                  <InputItem
                    modelValue={appStore.nameMatchConfidence}
                    onUpdate:modelValue={(value: string | number) =>
                      (appStore.nameMatchConfidence = Number(value))
                    }
                    type="number"
                    placeholder="Name Match Confidence (%)"
                    class="w-full"
                    aria-label="Name Match Confidence percentage"
                  />
                  <InputItem
                    modelValue={appStore.killSwitchWords.join(", ")}
                    onUpdate:modelValue={(value: string) =>
                      (appStore.killSwitchWords = value
                        .split(",")
                        .map((word) => word.trim()))
                    }
                    placeholder="Kill-switch Words (comma-separated)"
                    class="w-full"
                    aria-label="Kill-switch Words"
                  />
                  <InputItem
                    modelValue={appStore.continuousListeningTimeout}
                    onUpdate:modelValue={(value: string | number) =>
                      (appStore.continuousListeningTimeout = Number(value))
                    }
                    type="number"
                    placeholder="Continuous Listening Timeout (ms)"
                    class="w-full"
                    aria-label="Continuous Listening Timeout in milliseconds"
                  />
                </div>
              </section>
            </div>
          </nav>
        </div>
      </aside>
    )
  },
})
