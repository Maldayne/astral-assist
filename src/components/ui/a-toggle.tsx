import { computed, defineComponent } from "vue"

export default defineComponent({
  name: "a-toggle",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const toggle = () => {
      if (!props.disabled) {
        emit("update:modelValue", !props.modelValue)
      }
    }

    const toggleClasses = computed(() => {
      return [
        "relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200",
        props.modelValue ? "bg-blue-600" : "bg-gray-200",
        props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")
    })

    const switchClasses = computed(() => {
      return [
        "inline-block h-4 w-4 rounded-full bg-white transition ease-in-out duration-200",
        props.modelValue ? "translate-x-6" : "translate-x-1",
      ].join(" ")
    })

    return () => (
      <div class="flex items-center">
        <button
          type="button"
          class={toggleClasses.value}
          onClick={toggle}
          disabled={props.disabled}
          role="switch"
          aria-checked={props.modelValue}
        >
          <span aria-hidden="true" class={switchClasses.value}></span>
        </button>
        {props.label && (
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {props.label}
          </span>
        )}
      </div>
    )
  },
})
