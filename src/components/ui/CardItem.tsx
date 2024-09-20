import { cn } from "@/lib/utils"
import { defineComponent, PropType } from "vue"

export default defineComponent({
  name: "CardItem",
  props: {
    class: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props, { slots }) {
    return () => (
      <div
        class={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          props.class
        )}
      >
        {slots.default?.()}
      </div>
    )
  },
})
