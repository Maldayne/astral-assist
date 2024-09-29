import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { defineComponent } from "vue"

export default defineComponent({
  name: "DarkModeToggle",
  setup() {
    const appStore = useAppStore()

    const toggleDarkMode = () => {
      appStore.toggleDarkMode()
    }

    return () => (
      <div class="flex items-center space-x-2">
        <Label
          for="dark-mode"
          class="mr-4 text-sm text-gray-600 dark:text-gray-300"
        >
          Dark Mode
        </Label>
        <Switch
          id="dark-mode"
          checked={appStore.isDarkMode}
          onUpdate:checked={toggleDarkMode}
          class={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
            appStore.isDarkMode ? "bg-blue-600" : "bg-gray-200"
          )}
        >
          <span
            class={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              appStore.isDarkMode ? "translate-x-6" : "translate-x-1"
            )}
          />
        </Switch>
      </div>
    )
  },
})
