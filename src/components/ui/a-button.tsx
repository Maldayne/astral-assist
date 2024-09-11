import { defineComponent } from "vue"

export default defineComponent({
  name: "a-button",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value: string) =>
        ["primary", "secondary", "danger"].includes(value),
    },
  },
  setup(props, { slots }) {
    const getButtonClasses = () => {
      const baseClasses = "px-4 py-2 rounded-lg transition-colors"
      switch (props.variant) {
        case "primary":
          return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`
        case "secondary":
          return `${baseClasses} bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500`
        case "danger":
          return `${baseClasses} bg-red-500 text-white hover:bg-red-600`
        default:
          return baseClasses
      }
    }

    return () => (
      <button onClick={props.onClick} class={getButtonClasses()}>
        {slots.default?.()}
      </button>
    )
  },
})
