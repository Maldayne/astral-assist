// src/components/chat/ChatInput.tsx

import ButtonItem from "@/components/ui/ButtonItem"
import TextareaItem from "@/components/ui/TextareaItem"
import { STTFactory } from "@/services/stt/STTFactory"
import { STTProvider, STTResult } from "@/services/stt/STTProvider"
import { useAppStore } from "@/store/appStore"
import { Mic, Send } from "lucide-vue-next"
import { defineComponent, onUnmounted, ref } from "vue"

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
    const isListening = ref(false)
    const sttProvider = ref<STTProvider | null>(null)

    const toggleListening = async () => {
      if (isListening.value) {
        await sttProvider.value?.stop()
        isListening.value = false
      } else {
        try {
          sttProvider.value = STTFactory.createProvider(appStore.sttPreference)
          sttProvider.value.onResult((result: STTResult) => {
            if (result.isFinal) {
              inputMessage.value += result.transcript + " "
            }
          })
          sttProvider.value.onError((error: Error) => {
            console.error("STT Error:", error)
            isListening.value = false
          })
          await sttProvider.value.start()
          isListening.value = true
        } catch (error) {
          console.error("Failed to start STT:", error)
        }
      }
    }

    const sendMessage = () => {
      if (inputMessage.value.trim()) {
        emit("sendMessage", inputMessage.value.trim())
        inputMessage.value = ""
      }
    }

    onUnmounted(() => {
      if (isListening.value) {
        sttProvider.value?.stop()
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
          onClick={toggleListening}
          disabled={props.disabled}
          class={isListening.value ? "bg-red-500" : ""}
        >
          <Mic />
        </ButtonItem>
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
