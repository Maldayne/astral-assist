import { cn } from "@/lib/utils"
import { defineComponent } from "vue"

export default defineComponent({
  name: "ChatMessage",
  props: {
    role: {
      type: String as () => "user" | "assistant" | "error" | "system",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    assistantName: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const formatContent = (content: string) => {
      return content.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          {index < content.split("\n").length - 1 && <br />}
        </span>
      ))
    }

    return () => (
      <div
        class={cn(
          "flex",
          props.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          class={cn(
            "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 whitespace-pre-wrap",
            props.role === "user"
              ? "bg-blue-500 text-white"
              : props.role === "assistant"
                ? "text-gray-900 dark:text-white"
                : "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
          )}
          style={
            props.role === "assistant"
              ? { backgroundColor: props.backgroundColor }
              : {}
          }
        >
          {props.role === "assistant" && (
            <div class="text-sm font-semibold mb-1">{props.assistantName}</div>
          )}
          {formatContent(props.content)}
        </div>
      </div>
    )
  },
})
