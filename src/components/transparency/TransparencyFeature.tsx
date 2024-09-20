import { useAppStore } from "@/store/appStore"
import { computed, defineComponent, ref } from "vue"

export default defineComponent({
  name: "TransparencyFeature",
  props: {
    invertTransparency: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const appStore = useAppStore()
    const isHovered = ref(false)

    const isTransparent = computed(() => {
      const baseTransparency = props.invertTransparency
        ? !appStore.isTransparencyEnabled
        : appStore.isTransparencyEnabled
      return baseTransparency && !isHovered.value
    })

    const handleMouseEnter = () => {
      isHovered.value = true
    }

    const handleMouseLeave = () => {
      isHovered.value = false
    }

    return () => (
      <div
        class={`transparency-wrapper ${isTransparent.value ? "transparent" : ""}`}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        {slots.default?.()}
      </div>
    )
  },
})

/**
 * How to use the TransparencyFeature component:
 *
 * 1. Import the TransparencyFeature component where you want to use it.
 * 2. Wrap the element or component you want to make transparent with the TransparencyFeature component.
 * 3. The wrapped element will become transparent when the feature is enabled via the toggle in the drawer.
 *
 * Example usage:
 *
 * <TransparencyFeature>
 *   <YourComponent />
 * </TransparencyFeature>
 *
 * If you want an element to be visible when transparency is enabled and transparent when it's disabled,
 * use the invertTransparency prop:
 *
 * <TransparencyFeature invertTransparency>
 *   <AlwaysVisibleComponent />
 * </TransparencyFeature>
 */
