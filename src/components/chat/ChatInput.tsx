import { useDebounceFn } from "@vueuse/core"
import { Send } from "lucide-vue-next"
import { computed, defineComponent, shallowRef } from "vue"
import ButtonItem from "../ui/ButtonItem"
import TextareaItem from "../ui/TextareaItem"

const MAX_CHARS = 4096

export default defineComponent({
  name: "ChatInput",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["sendMessage"],
  setup(props, { emit }) {
    const inputMessage = shallowRef("")

    const isEmptyOrWhitespace = computed(
      () => inputMessage.value.trim().length === 0
    )

    const charCount = computed(() => inputMessage.value.length)

    const trimMessage = (message: string) => {
      return message
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim()
    }

    const sendMessage = useDebounceFn(() => {
      if (!isEmptyOrWhitespace.value) {
        const trimmedMessage = trimMessage(inputMessage.value)
        emit("sendMessage", trimmedMessage)
      }
      inputMessage.value = ""
    }, 300)

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault()
        sendMessage()
      }
    }

    return () => (
      <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 w-full">
        <div class="flex flex-col">
          <div class="flex items-center">
            <TextareaItem
              v-model={inputMessage.value}
              placeholder="Type your message here..."
              class="flex-grow mr-4"
              disabled={props.disabled}
              onEnter={sendMessage}
              onKeydown={handleKeyDown}
              maxlength={MAX_CHARS}
              aria-label="Message input"
            />
            <ButtonItem
              onClick={sendMessage}
              size="icon"
              disabled={props.disabled || isEmptyOrWhitespace.value}
              aria-label="Send message"
            >
              <Send class="h-5 w-5" />
            </ButtonItem>
          </div>
          <div class="text-xs text-gray-500 mt-1 text-right">
            {charCount.value} / {MAX_CHARS}
          </div>
        </div>
      </div>
    )
  },
})
