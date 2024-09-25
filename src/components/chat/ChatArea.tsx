import { useAppStore } from "@/store/appStore"
import { defineComponent } from "vue"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

export default defineComponent({
  name: "ChatArea",
  props: {
    assistantId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore()

    const sendMessage = (message: string) => {
      console.log("ChatArea - sendMessage:", message)
      appStore.sendMessage(message)
    }

    return () => (
      <div class="flex flex-col h-full">
        <ChatHistory
          messages={appStore.currentChatMessages}
          isLoading={appStore.isLoading}
        />
        <ChatInput onSendMessage={sendMessage} disabled={appStore.isLoading} />
      </div>
    )
  },
})
