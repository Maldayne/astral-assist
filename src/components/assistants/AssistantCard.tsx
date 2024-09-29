import DefaultAIIcon from "@/components/icons/DefaultAIIcon"
import CardContentItem from "@/components/ui/CardContentItem"
import CardItem from "@/components/ui/CardItem"
import GradientOverlay from "@/components/ui/GradientOverlay"
import { cn } from "@/lib/utils"
import { defineComponent, h, PropType, ref } from "vue"

interface AssistantCardProps {
  id: string
  name: string
  avatar: string | null
  isActive: boolean
  type: "query" | "command"
  color: string
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
          "transition-colors duration-200 overflow-hidden",
          props.assistant.isActive
            ? "border-primary mx-2"
            : "hover:border-x-primary"
        )}
        onClick={() => props.onSelect(props.assistant.id)}
      >
        <div class="relative">
          <CardContentItem class="flex flex-col items-center justify-center p-4">
            {props.assistant.avatar && !imageError.value ? (
              <img
                src={props.assistant.avatar}
                alt={`${props.assistant.name}'s avatar`}
                onError={handleImageError}
                class="relative z-10"
              />
            ) : (
              h(DefaultAIIcon, {
                size: props.assistant.isActive ? 48 : 32,
                class: "mb-2 relative z-10",
              })
            )}
            <h3 class="text-sm font-medium text-center mb-1 relative z-10">
              {props.assistant.name}
            </h3>
          </CardContentItem>
          <GradientOverlay
            color={props.assistant.color}
            direction="to top"
            opacity={0.2}
            className="absolute inset-0 z-0"
          />
        </div>
      </CardItem>
    )
  },
})
