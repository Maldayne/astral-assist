import type { CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselItem as ShadcnCarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { computed, defineComponent, PropType, ref, VNode, watch } from "vue"

export interface CarouselItemProps {
  items: any[]
  renderItem: (item: any, isActive: boolean) => VNode
  className?: string
  opts?: Record<string, any>
  activeItemId?: string | number
}

export default defineComponent({
  name: "CarouselItem",
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    renderItem: {
      type: Function as PropType<(item: any, isActive: boolean) => VNode>,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    opts: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    activeItemId: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props, { emit }) {
    const carouselRef = ref<CarouselApi | null>(null)

    const handleInitApi = (api: CarouselApi) => {
      carouselRef.value = api
      emit("createCarousel", api)
    }

    watch(
      () => props.activeItemId,
      (newId) => {
        if (carouselRef.value && newId != null) {
          const index = props.items.findIndex((item) => item.id === newId)
          if (index !== -1) {
            carouselRef.value.scrollTo(index, false)
          }
        }
      }
    )

    const content = computed(() => {
      if (!props.items || props.items.length === 0) {
        return []
      }
      return props.items.map((item) => (
        <ShadcnCarouselItem
          key={item.id}
          class="px-2 flex items-center justify-center"
        >
          <div
            class={cn(
              "transition-all duration-300 ease-in-out",
              item.id === props.activeItemId ? "scale-105" : "scale-100"
            )}
          >
            {props.renderItem(item, item.id === props.activeItemId)}
          </div>
        </ShadcnCarouselItem>
      ))
    })

    return () => (
      <div class="relative w-full">
        <Carousel
          class={cn("w-full", props.className)}
          opts={{
            align: "center",
            containScroll: "true",
            loop: true,
            dragFree: false,
            skipSnaps: false,
            ...props.opts,
          }}
          onCreateCarousel={handleInitApi}
        >
          <CarouselContent
            l
            class="grid grid-flow-col auto-cols-max gap-4 justify-center"
          >
            {content.value}
          </CarouselContent>
          <CarouselPrevious class="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext class="absolute right-0 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    )
  },
})
