import DefaultAIIcon from "@/components/icons/DefaultAIIcon"
import CardContentItem from "@/components/ui/CardContentItem"
import CardItem from "@/components/ui/CardItem"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { defineComponent, h, PropType, ref } from "vue"

interface AssistantCardProps {
  id: string
  name: string
  avatar: string | null
  isActive: boolean
  type: "query" | "command"
  backgroundColor: string
}

export default defineComponent({
  name: "AssistantCard",
  props: {
    assistant: {
      type: Object as PropType<AssistantCardProps>,
      required: true,
    },
    onSelect: {
      type: Function as PropType<(id: string) => void>,
      required: true,
    },
  },
  setup(props) {
    const appStore = useAppStore()
    const imageError = ref(false)

    const handleImageError = () => {
      imageError.value = true
    }

    return () => (
      <CardItem
        class={cn(
          "transition-colors duration-200",
          props.assistant.isActive
            ? "border-primary mx-2"
            : "hover:border-x-primary"
        )}
        onClick={() => props.onSelect(props.assistant.id)}
      >
        <CardContentItem
          class="flex flex-col items-center justify-center p-4"
          backgroundColor={props.assistant.backgroundColor}
        >
          {props.assistant.avatar && !imageError.value ? (
            <img
              src={props.assistant.avatar}
              alt={`${props.assistant.name}'s avatar`}
              onError={handleImageError}
            />
          ) : (
            h(DefaultAIIcon, {
              size: props.assistant.isActive ? 48 : 32,
              class: "mb-2",
            })
          )}
          <h3 class="text-sm font-medium text-center mb-1">
            {props.assistant.name}
          </h3>
        </CardContentItem>
      </CardItem>
    )
  },
})
