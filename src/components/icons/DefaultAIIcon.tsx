import { defineComponent } from "vue"

export default defineComponent({
  name: "DefaultAIIcon",
  props: {
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: "currentColor",
    },
  },
  setup(props) {
    return () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={props.color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2Z" />
        <path d="M12 16v-4" />
        <path d="M8 12h8" />
        <path d="M12 8v.01" />
      </svg>
    )
  },
})
