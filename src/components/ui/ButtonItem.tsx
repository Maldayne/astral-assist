import { cn } from "@/lib/utils"
import { defineComponent, HTMLAttributes, PropType } from "vue"
import { Button } from "./button"
export default defineComponent({
  name: "ButtonItem",
  props: {
    variant: {
      type: String as PropType<
        "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
      >,
      default: "default",
    },
    size: {
      type: String as PropType<"default" | "sm" | "lg" | "icon">,
      default: "default",
    },
  },
  setup(props, { slots, attrs }) {
    return () => (
      <Button
        class={cn(attrs.class as string)}
        variant={props.variant}
        size={props.size}
        {...(attrs as HTMLAttributes)}
      >
        {slots.default?.()}
      </Button>
    )
  },
})
