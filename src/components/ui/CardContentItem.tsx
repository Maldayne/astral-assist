import { cn } from "@/lib/utils"
import { defineComponent, PropType } from "vue"

export default defineComponent({
  name: "CardContentItem",
  props: {
    class: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props, { slots }) {
    return () => <div class={cn("p-6", props.class)}>{slots.default?.()}</div>
  },
})
