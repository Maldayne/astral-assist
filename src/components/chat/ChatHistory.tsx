import { defineComponent, PropType } from "vue"
import ChatMessage from "./ChatMessage"

interface ChatMessage {
  role: "user" | "assistant" | "error" | "system"
  content: string
}

export default defineComponent({
  name: "ChatHistory",
  props: {
    messages: {
      type: Array as PropType<ChatMessage[]>,
      required: true,
    },
    assistantBackgroundColor: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex-1 overflow-y-auto py-4 w-full">
        <div class="space-y-4">
          {props.messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              backgroundColor={
                message.role === "assistant"
                  ? props.assistantBackgroundColor
                  : ""
              }
            />
          ))}
        </div>
      </div>
    )
  },
})
