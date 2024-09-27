import { useAppStore } from "@/store/appStore"
import { computed, defineComponent } from "vue"

export default defineComponent({
  name: "TranscriptDisplay",
  setup() {
    const appStore = useAppStore()

    const displayWords = computed(() => appStore.transcribedWords.join(" "))

    return () => (
      <div
        class={`bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm ${
          appStore.isContinuousListening ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        {displayWords.value || "Listening..."}
      </div>
    )
  },
})
