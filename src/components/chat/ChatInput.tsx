import ButtonItem from "@/components/ui/ButtonItem"
import TextareaItem from "@/components/ui/TextareaItem"
import { AssistantType } from "@/types/assistant"
import { Send } from "lucide-vue-next"
import { defineComponent, PropType, ref } from "vue"

export default defineComponent({
  name: "ChatInput",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    currentAssistant: {
      type: Object as PropType<AssistantType | null>,
      default: null,
    },
  },
  emits: ["sendMessage"],
  setup(props, { emit }) {
    const inputMessage = ref("")

    const sendMessage = () => {
      if (inputMessage.value.trim()) {
        emit("sendMessage", inputMessage.value.trim())
        inputMessage.value = ""
      }
    }

    return () => (
      <div class="flex items-center space-x-2 p-4">
        <TextareaItem
          v-model={inputMessage.value}
          placeholder={`Type your message to ${props.currentAssistant?.name || "the assistant"}...`}
          disabled={props.disabled}
          onEnter={sendMessage}
          class={`border-2 ${
            props.currentAssistant
              ? `border-[${props.currentAssistant.backgroundColor}]`
              : "border-gray-300"
          }`}
        />
        <ButtonItem
          onClick={sendMessage}
          disabled={props.disabled || !inputMessage.value.trim()}
        >
          <Send />
        </ButtonItem>
      </div>
    )
  },
})
