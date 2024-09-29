import { cn } from "@/lib/utils"
import { computed, defineComponent, PropType } from "vue"

export default defineComponent({
  name: "GradientOverlay",
  props: {
    color: {
      type: String as PropType<string>,
      required: true,
    },
    direction: {
      type: String as PropType<"to top" | "to bottom" | "to left" | "to right">,
      default: "to top",
    },
    opacity: {
      type: Number as PropType<number>,
      default: 0.3,
    },
    className: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props) {
    const gradientStyle = computed(() => ({
      background: `linear-gradient(${props.direction}, ${props.color}, transparent 80%)`,
      opacity: props.opacity,
    }))

    return () => (
      <div
        class={cn("absolute inset-0", props.className)}
        style={gradientStyle.value}
      />
    )
  },
})
