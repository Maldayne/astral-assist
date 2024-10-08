import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { computed, defineComponent, PropType } from "vue"

export default defineComponent({
  name: "InputItem",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<"text" | "password" | "email" | "number">,
      default: "text",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "enter"],
  setup(props, { emit }) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    })

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        emit("enter", inputValue.value)
      }
    }

    return () => (
      <Input
        modelValue={inputValue.value}
        onUpdate:modelValue={(value: string | number) =>
          (inputValue.value = value)
        }
        placeholder={props.placeholder}
        type={props.type}
        disabled={props.disabled}
        onKeydown={handleKeydown}
        class={cn(props.class)}
      />
    )
  },
})
