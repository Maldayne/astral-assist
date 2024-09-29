import MultiSelectItem from "@/components/ui/MultiSelectItem"
import { AssistantType, ChatMessageType } from "@/types/assistant"
import { computed, defineComponent, PropType } from "vue"
import ChatMessage from "./ChatMessage"

export default defineComponent({
  name: "ChatHistory",
  props: {
    messages: {
      type: Array as PropType<ChatMessageType[]>,
      required: true,
    },
    currentGroupAssistants: {
      type: Array as PropType<AssistantType[]>,
      required: true,
    },
    selectedAssistantFilter: {
      type: Array as PropType<string[]>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    updateFilter: (value: string[]) => true,
  },
  setup(props, { emit }) {
    const assistantOptions = computed(() => [
      { value: "all", label: "All Assistants" },
      ...props.currentGroupAssistants.map((assistant) => ({
        value: assistant.id,
        label: assistant.name,
      })),
    ])

    const filteredMessages = computed(() => {
      if (
        props.selectedAssistantFilter.includes("all") ||
        props.selectedAssistantFilter.length === 0
      ) {
        return props.messages
      }
      return props.messages.filter((message) =>
        props.selectedAssistantFilter.includes(message.assistantId)
      )
    })

    const getAssistantName = (assistantId: string) => {
      return (
        props.currentGroupAssistants.find((a) => a.id === assistantId)?.name ||
        "Unknown"
      )
    }

    const getAssistantColor = (assistantId: string) => {
      return (
        props.currentGroupAssistants.find((a) => a.id === assistantId)
          ?.backgroundColor || ""
      )
    }

    return () => (
      <div class="flex-1 overflow-y-auto py-4 w-full">
        <div class="mb-4">
          <MultiSelectItem
            modelValue={props.selectedAssistantFilter}
            options={assistantOptions.value}
            onUpdate:modelValue={(value: string[]) =>
              emit("updateFilter", value)
            }
            placeholder="Select assistants"
            class="w-full"
          />
        </div>

        <div class="space-y-4">
          {filteredMessages.value.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              assistantName={getAssistantName(message.assistantId)}
              backgroundColor={getAssistantColor(message.assistantId)}
            />
          ))}
          {props.isLoading && (
            <div class="text-center">
              <span class="loading loading-dots loading-md"></span>
            </div>
          )}
        </div>
      </div>
    )
  },
})
