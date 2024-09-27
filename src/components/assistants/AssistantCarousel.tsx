import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useAppStore } from "@/store/appStore"
import { computed, defineComponent, ref, watch } from "vue"
import AssistantCard from "./AssistantCard"

export default defineComponent({
  name: "AssistantCarousel",
  setup() {
    const appStore = useAppStore()
    const assistants = computed(() => appStore.currentAssistants)
    const activeAssistantId = computed(() => appStore.activeAssistantId)

    const api = ref<CarouselApi>()

    const scrollToIndex = (index: number) => {
      console.log(`Attempting to scroll to index ${index}`)
      api.value?.scrollTo(index)
    }

    const handleAssistantSelect = (id: string, index: number) => {
      console.log(`Assistant selected: id=${id}, index=${index}`)
      appStore.setActiveAssistant(id)
      scrollToIndex(index)
    }

    const memoizedAssistants = computed(() =>
      assistants.value.map((assistant) => ({
        ...assistant,
        isActive: assistant.id === activeAssistantId.value,
      }))
    )

    watch(activeAssistantId, (newId) => {
      console.log(`Active assistant changed to: ${newId}`)
      const index = memoizedAssistants.value.findIndex((a) => a.id === newId)
      console.log(`Found index for new active assistant: ${index}`)
      if (index !== -1) {
        scrollToIndex(index)
      }
    })

    watch(
      () => appStore.detectedAssistantName,
      (name) => {
        if (name) {
          const assistantIndex = memoizedAssistants.value.findIndex(
            (a) => a.name.toLowerCase() === name.toLowerCase()
          )
          if (assistantIndex !== -1) {
            handleAssistantSelect(
              memoizedAssistants.value[assistantIndex].id,
              assistantIndex
            )
          }
        }
      }
    )

    return () => (
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        class="w-full"
        onCreateCarousel={(carouselApi: CarouselApi) => {
          api.value = carouselApi
          const initialIndex = memoizedAssistants.value.findIndex(
            (a) => a.id === activeAssistantId.value
          )
          if (initialIndex !== -1) {
            scrollToIndex(initialIndex)
          }
        }}
      >
        <CarouselContent class="flex-auto justify-center overflow">
          {memoizedAssistants.value.map((assistant, index) => (
            <CarouselItem key={assistant.id} class="max-w-fit px-4">
              <AssistantCard
                assistant={assistant}
                isActive={assistant.isActive}
                onSelect={() => handleAssistantSelect(assistant.id, index)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious class="left-2" />
        <CarouselNext class="right-2" />
      </Carousel>
    )
  },
})
