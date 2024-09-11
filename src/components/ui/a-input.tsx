import { defineComponent } from "vue"

export default defineComponent({
  name: "a-input",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () => (
      <input
        type="text"
        value={props.modelValue}
        onInput={(e: any) =>
          emit("update:modelValue", (e.target as HTMLInputElement).value)
        }
        placeholder={props.placeholder}
        class="border rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
      />
    )
  },
})
