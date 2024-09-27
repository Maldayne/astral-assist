import ActiveAssistantDisplay from "@/components/assistants/ActiveAssistantDisplay"
import AssistantCarousel from "@/components/assistants/AssistantCarousel"
import Header from "@/components/layout/Header"
import SettingsDrawer from "@/components/layout/SettingsDrawer"
import { useAppStore } from "@/store/appStore"
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "Home",
  setup() {
    const isDrawerOpen = ref(false)
    const appStore = useAppStore()

    const toggleDrawer = () => {
      isDrawerOpen.value = !isDrawerOpen.value
    }

    return () => (
      <div class="flex h-screen">
        <SettingsDrawer isOpen={isDrawerOpen.value} onClose={toggleDrawer} />

        <div class="flex flex-col flex-grow w-full">
          <Header onToggleDrawer={toggleDrawer} />
          <main class="flex flex-grow overflow-hidden flex-col">
            <section class="w-full py-1 bg-secondary">
              <AssistantCarousel class="" />
            </section>
            <section class="flex-grow overflow-y-auto p-4">
              <ActiveAssistantDisplay />
            </section>
          </main>
        </div>
      </div>
    )
  },
})
