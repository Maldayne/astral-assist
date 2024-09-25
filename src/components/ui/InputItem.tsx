import { computed, defineComponent } from "vue"

export default defineComponent({
  name: "InputItem",
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
      <textarea
        v-model={inputValue.value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onKeydown={handleKeydown}
        class="w-full px-3 py-2 text-sm border rounded resize-none bg-background text-foreground"
        rows={3}
      />
    )
  },
})
