import { Assistant } from "@/types/assistant"
import { defineComponent, PropType } from "vue"

export default defineComponent({
  name: "AssistantHeader",
  props: {
    assistant: {
      type: Object as PropType<Assistant>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="mb-4">
        <h2 class="text-2xl font-bold">
          {props.assistant.name}
          <span class="text-sm ml-2 px-2 py-1 bg-accent rounded-full">
            {props.assistant.type === "query" ? "Query" : "Command"}
          </span>
        </h2>
      </div>
    )
  },
})
