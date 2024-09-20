import DefaultAIIcon from "@/components/icons/DefaultAIIcon"
import CardContentItem from "@/components/ui/CardContentItem"
import CardItem from "@/components/ui/CardItem"
import { cn } from "@/lib/utils"
import { defineComponent, h, PropType, ref } from "vue"

interface AssistantCardProps {
  id: string
  name: string
  avatar: string | null
  isActive: boolean
  type: "query" | "command"
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
    const imageError = ref(false)

    const handleImageError = () => {
      imageError.value = true
    }

    return () => (
      <CardItem
        class={cn(
          "cursor-pointer transition-all duration-300 w-32",
          props.assistant.isActive ? "border-primary" : "hover:border-secondary"
        )}
        onClick={() => props.onSelect(props.assistant.id)}
      >
        <CardContentItem class="flex flex-col items-center justify-center p-4">
          {props.assistant.avatar && !imageError.value ? (
            <img
              src={props.assistant.avatar}
              alt={`${props.assistant.name}'s avatar`}
              class="w-16 h-16 rounded-full mb-2 object-cover"
              onError={handleImageError}
            />
          ) : (
            h(DefaultAIIcon, { size: 64, class: "mb-2" })
          )}
          <h3 class="text-sm font-medium text-center mb-1">
            {props.assistant.name}
          </h3>
        </CardContentItem>
      </CardItem>
    )
  },
})
