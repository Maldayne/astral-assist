import { useAppStore } from "@/store/appStore"
import { defineComponent } from "vue"
import ChatArea from "./ChatArea"

export default defineComponent({
  name: "ChatInterface",
  setup() {
    const appStore = useAppStore()

    return () => (
      <div class="chat-interface flex flex-col h-full">
        {appStore.activeAssistant ? (
          <ChatArea />
        ) : (
          <div class="flex items-center justify-center h-full">
            <p class="text-lg text-gray-500">
              Please select an assistant to start chatting.
            </p>
          </div>
        )}
      </div>
    )
  },
})
