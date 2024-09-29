import CustomTitlebar from "@/components/layout/CustomTitlebar"
import { useAppStore } from "@/store/appStore"
import { defineComponent, onErrorCaptured, watch } from "vue"
import { RouterView } from "vue-router"

export default defineComponent({
  name: "App",
  setup() {
    const appStore = useAppStore()

    onErrorCaptured((err, instance, info) => {
      console.error("Captured in App:", err, instance, info)
      return false
    })

    watch(
      () => appStore.isDarkMode,
      (isDark) => {
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
      { immediate: true }
    )

    return () => (
      <div
        class={`app ${appStore.isDarkMode ? "dark" : ""} bg-background text-foreground min-h-screen min-w-screen flex flex-col`}
      >
        <CustomTitlebar />
        <main class="flex-grow">
          <RouterView />
        </main>
      </div>
    )
  },
})
