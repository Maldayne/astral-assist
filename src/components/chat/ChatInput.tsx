import ButtonItem from "@/components/ui/ButtonItem"
import TextareaItem from "@/components/ui/TextareaItem"
import { useAppStore } from "@/store/appStore"
import { Send } from "lucide-vue-next"
import { defineComponent, onUnmounted, ref, watch } from "vue"

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
    const appStore = useAppStore()
    const inputMessage = ref("")
    let silenceTimer: ReturnType<typeof setTimeout> | null = null

    const sendMessage = () => {
      if (inputMessage.value.trim()) {
        emit("sendMessage", inputMessage.value.trim())
        inputMessage.value = ""
      }
    }

    watch(
      () => appStore.transcribedWords,
      (newWords) => {
        if (appStore.isContinuousListening && appStore.activeAssistant) {
          inputMessage.value = newWords.join(" ")

          if (silenceTimer) {
            clearTimeout(silenceTimer)
          }

          silenceTimer = setTimeout(() => {
            if (
              !appStore.killSwitchWords.some((word) =>
                inputMessage.value.toLowerCase().includes(word)
              )
            ) {
              sendMessage()
            }
          }, appStore.silenceDuration)
        }
      }
    )

    onUnmounted(() => {
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
    })

    return () => (
      <div class="flex items-center space-x-2 p-4">
        <TextareaItem
          v-model={inputMessage.value}
          placeholder="Type your message..."
          disabled={props.disabled}
          onEnter={sendMessage}
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
