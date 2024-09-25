import { defineComponent, PropType } from "vue"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"

export interface Message {
  role: "user" | "assistant" | "error" | "system"
  content: string
}

export default defineComponent({
  name: "ChatInterface",
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    onSendMessage: {
      type: Function as PropType<(message: string) => void>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="chat-interface flex flex-col h-full">
        <div class="flex-grow overflow-y-auto py-4">
          {props.messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
        <ChatInput
          onSendMessage={props.onSendMessage}
          disabled={props.isLoading}
        />
      </div>
    )
  },
})
