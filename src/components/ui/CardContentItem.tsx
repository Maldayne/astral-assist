import { cn } from "@/lib/utils"
import { defineComponent, PropType } from "vue"

export default defineComponent({
  name: "CardContentItem",
  props: {
    class: {
      type: String as PropType<string>,
      default: "",
    },
    color: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props, { slots }) {
    return () => (
      <div
        class={cn("p-6", props.class)}
        style={{
          backgroundColor: props.color,
          borderRadius: "inherit",
        }}
      >
        {slots.default?.()}
      </div>
    )
  },
})
