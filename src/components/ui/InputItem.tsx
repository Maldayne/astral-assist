import { cn } from "@/lib/utils"
import { defineComponent, HTMLAttributes } from "vue"
import { Input } from "./input"

export default defineComponent({
  name: "InputItem",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, attrs }) {
    return () => (
      <Input
        value={props.modelValue}
        onInput={(e: Event) =>
          emit("update:modelValue", (e.target as HTMLInputElement).value)
        }
        placeholder={props.placeholder}
        class={cn(attrs.class as string)}
        {...(attrs as HTMLAttributes)}
      />
    )
  },
})
