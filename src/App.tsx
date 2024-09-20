import CustomTitlebar from "@/components/layout/CustomTitlebar"
import { defineComponent, onErrorCaptured } from "vue"
import { RouterView } from "vue-router"

export default defineComponent({
  name: "App",
  setup() {
    onErrorCaptured((err, instance, info) => {
      // Log the error or send it to an error tracking service
      console.error("Captured in App:", err, instance, info)
      // Return false to prevent the error from propagating further
      return false
    })

    return () => (
      <div class="app dark bg-background text-foreground min-h-screen min-w-screen flex flex-col">
        <CustomTitlebar />
        <main class="flex-grow">
          <RouterView />
        </main>
      </div>
    )
  },
})
