import { appWindow } from "@tauri-apps/api/window"
import { Maximize2, Minimize2, X } from "lucide-vue-next"
import { defineComponent, onMounted, onUnmounted, ref } from "vue"

export default defineComponent({
  name: "CustomTitlebar",
  setup() {
    const titlebarRef = ref<HTMLDivElement | null>(null)

    const minimize = () => appWindow.minimize()
    const maximize = () => appWindow.toggleMaximize()
    const close = () => appWindow.close()

    const startDragging = (event: MouseEvent) => {
      // Prevent dragging when clicking on window control buttons
      if ((event.target as HTMLElement).closest(".window-controls")) {
        return
      }
      appWindow.startDragging()
    }

    onMounted(() => {
      if (titlebarRef.value) {
        titlebarRef.value.addEventListener("mousedown", startDragging)
      }
    })

    onUnmounted(() => {
      if (titlebarRef.value) {
        titlebarRef.value.removeEventListener("mousedown", startDragging)
      }
    })

    return () => (
      <div
        ref={titlebarRef}
        class="custom-titlebar flex justify-between items-center px-4 py-2 bg-background text-foreground cursor-move"
        data-tauri-drag-region
      >
        <div class="window-title text-sm font-medium select-none">
          Astral Assist
        </div>
        <div class="window-controls flex space-x-2">
          <button
            onClick={minimize}
            class="p-1 hover:bg-secondary rounded cursor-pointer"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={maximize}
            class="p-1 hover:bg-secondary rounded cursor-pointer"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={close}
            class="p-1 hover:bg-destructive hover:text-destructive-foreground rounded cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    )
  },
})
