import ChatArea from "@/components/chat/ChatArea"
import { useAppStore } from "@/store/appStore"
import { computed, defineComponent, ref } from "vue"

export default defineComponent({
  name: "ActiveAssistantDisplay",
  setup() {
    const appStore = useAppStore()
    const activeAssistant = computed(() => appStore.activeAssistant)
    const inputMessage = ref("")

    const handleSendMessage = (message: string) => {
      if (activeAssistant.value) {
        if (activeAssistant.value.type === "query") {
          // Handle query to LLM
          console.log(`Sending query to LLM: ${message}`)
          // Implement LLM query logic here
        } else if (activeAssistant.value.type === "command") {
          // Handle command intent recognition
          console.log(`Recognizing command intent: ${message}`)
          // Implement command intent recognition logic here
        }
        inputMessage.value = ""
      }
    }

    return () => (
      <div class="w-full h-full p-4">
        {activeAssistant.value ? (
          <div class="h-full flex flex-col">
            <h2 class="text-2xl font-bold mb-4">
              {activeAssistant.value.name}
              <span class="text-sm ml-2 px-2 py-1 bg-accent rounded-full">
                {activeAssistant.value.type === "query" ? "Query" : "Command"}
              </span>
            </h2>
            <ChatArea
              assistantId={activeAssistant.value.id}
              class="flex-grow overflow-y-auto mb-4"
            />
            <div class="flex">
              <input
                v-model={inputMessage.value}
                placeholder={
                  activeAssistant.value.type === "query"
                    ? "Ask a question..."
                    : "Enter a command..."
                }
                class="flex-grow p-2 border rounded-l"
                onKeyup={(event: KeyboardEvent) => {
                  if (event.key === "Enter") {
                    handleSendMessage(inputMessage.value)
                  }
                }}
              />
              <button
                onClick={() => handleSendMessage(inputMessage.value)}
                class="p-2 bg-primary text-primary-foreground rounded-r"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div class="flex items-center justify-center h-full">
            <p class="text-lg text-gray-500">Select an assistant to begin</p>
          </div>
        )}
      </div>
    )
  },
})
