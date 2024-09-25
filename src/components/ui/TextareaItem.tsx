import { Textarea } from "@/components/ui/textarea"
import { computed, defineComponent } from "vue"

export default defineComponent({
  name: "TextareaItem",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "enter", "shiftEnter"],
  setup(props, { emit }) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    })

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (event.shiftKey) {
          emit("shiftEnter")
        } else {
          event.preventDefault()
          emit("enter", inputValue.value)
        }
      }
    }

    return () => (
      <Textarea
        modelValue={inputValue.value}
        onUpdate:modelValue={(value: string) => (inputValue.value = value)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onKeydown={handleKeydown}
        class="resize-none"
        rows={3}
      />
    )
  },
})
