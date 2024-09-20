import { cn } from "@/lib/utils"
import { defineComponent } from "vue"

export default defineComponent({
  name: "ChatMessage",
  props: {
    role: {
      type: String as () => "user" | "assistant",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div
        class={cn(
          "flex",
          props.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          class={cn(
            "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3",
            props.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          )}
        >
          {props.content}
        </div>
      </div>
    )
  },
})
