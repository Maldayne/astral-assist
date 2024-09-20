import { Send } from "lucide-vue-next"
import { defineComponent, ref } from "vue"
import ButtonItem from "../ui/ButtonItem"
import InputItem from "../ui/InputItem"

export default defineComponent({
  name: "ChatInput",
  emits: ["sendMessage"],
  setup(_, { emit }) {
    const inputMessage = ref("")

    const sendMessage = () => {
      if (inputMessage.value.trim()) {
        emit("sendMessage", inputMessage.value)
        inputMessage.value = ""
      }
    }

    return () => (
      <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 w-full">
        <div class="flex items-center">
          <InputItem
            v-model={inputMessage.value}
            onKeyup={(e: KeyboardEvent) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message here..."
            class="flex-grow mr-4"
          />
          <ButtonItem onClick={sendMessage} size="icon">
            <Send class="h-5 w-5" />
          </ButtonItem>
        </div>
      </div>
    )
  },
})
