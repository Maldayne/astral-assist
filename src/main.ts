import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.tsx"
import router from "./router/index.ts"
import "./style.css"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

if (process.env.NODE_ENV === "development") {
  console.log(
    "Running Development Environment. Use Ctrl-Shift-Z for Vue Devtools Inspector"
  )
}

app.mount("#app")
