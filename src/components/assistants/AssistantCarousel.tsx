import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useAppStore } from "@/store/appStore"
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import AssistantCard from "./AssistantCard"

export default defineComponent({
  name: "AssistantCarousel",
  setup() {
    const appStore = useAppStore()
    const assistants = computed(() => appStore.currentAssistants)
    const activeAssistantId = computed(() => appStore.activeAssistantId)

    const carouselRef = ref<HTMLElement | null>(null)
    const currentIndex = ref(0)

    const scrollToIndex = (index: number) => {
      console.log(`Attempting to scroll to index ${index}`)
      if (carouselRef.value) {
        const itemWidth = carouselRef.value.offsetWidth / 4 // Assuming 4 items visible
        const scrollPosition = index * itemWidth
        carouselRef.value.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        })
        console.log(`Scroll initiated to position: ${scrollPosition}`)
      } else {
        console.warn("Carousel element not available")
      }
    }

    const handleAssistantSelect = (id: string, index: number) => {
      console.log(`Assistant selected: id=${id}, index=${index}`)
      appStore.setActiveAssistant(id)
      currentIndex.value = index
      scrollToIndex(index)
    }

    const memoizedAssistants = computed(() =>
      assistants.value.map((assistant) => ({
        ...assistant,
        isActive: assistant.id === activeAssistantId.value,
      }))
    )

    const showScrollButtons = computed(() => assistants.value.length > 4)

    watch(activeAssistantId, (newId) => {
      console.log(`Active assistant changed to: ${newId}`)
      const index = memoizedAssistants.value.findIndex((a) => a.id === newId)
      console.log(`Found index for new active assistant: ${index}`)
      if (index !== -1) {
        scrollToIndex(index)
      }
    })

    onMounted(() => {
      console.log("Component mounted, carouselRef:", carouselRef.value)
      // Initial scroll to active assistant
      const initialIndex = memoizedAssistants.value.findIndex(
        (a) => a.id === activeAssistantId.value
      )
      if (initialIndex !== -1) {
        scrollToIndex(initialIndex)
      }
    })

    return () => (
      <div class="relative w-full">
        <Carousel class="w-full">
          <CarouselContent ref={carouselRef}>
            {memoizedAssistants.value.map((assistant, index) => (
              <CarouselItem
                key={assistant.id}
                class="basis-1/4 sm:basis-1/4 md:basis-1/4 lg:basis-1/4 pl-4"
              >
                <AssistantCard
                  assistant={assistant}
                  isActive={assistant.isActive}
                  onSelect={() => handleAssistantSelect(assistant.id, index)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {showScrollButtons.value && (
            <>
              <CarouselPrevious
                onClick={() =>
                  scrollToIndex(Math.max(0, currentIndex.value - 1))
                }
                class="absolute left-0 top-1/2 transform -translate-y-1/2"
              >
                <ChevronLeft class="w-4 h-4" />
              </CarouselPrevious>
              <CarouselNext
                onClick={() =>
                  scrollToIndex(
                    Math.min(
                      memoizedAssistants.value.length - 1,
                      currentIndex.value + 1
                    )
                  )
                }
                class="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                <ChevronRight class="w-4 h-4" />
              </CarouselNext>
            </>
          )}
        </Carousel>
      </div>
    )
  },
})
