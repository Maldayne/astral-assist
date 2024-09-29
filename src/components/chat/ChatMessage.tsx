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
            "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 relative",
            props.role === "user"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-gray-100 dark:bg-gray-800",
            props.role === "error" &&
              "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
          )}
        >
          {props.role === "assistant" && (
            <div
              class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: props.backgroundColor }}
            ></div>
          )}
          <div class="pl-2">
            {" "}
            {/* Add left padding to account for the color bar */}
            {props.role === "assistant" && (
              <div class="text-sm font-semibold mb-1">
                {props.assistantName}
              </div>
            )}
            {formatContent(props.content)}
          </div>
        </div>
      </div>
    )
  },
})
