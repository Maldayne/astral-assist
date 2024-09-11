import { defineComponent, onMounted } from "vue"
import { RouterView } from "vue-router"

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      // Apply dark mode class to html element
      document.documentElement.classList.add("dark")
    })

    return () => (
      <div class="app dark:bg-gray-900 dark:text-white min-h-screen">
        <RouterView />
      </div>
    )
  },
})
