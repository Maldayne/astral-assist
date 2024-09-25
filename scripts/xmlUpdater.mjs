import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tsx = spawn(
  "npx",
  ["tsx", "watch", path.join(__dirname, "xmlUpdater.ts")],
  {
    stdio: "inherit",
    shell: true,
  }
)

tsx.on("error", (error) => {
  console.error("Failed to start tsx:", error)
  process.exit(1)
})

process.on("SIGINT", () => {
  tsx.kill("SIGINT")
  process.exit(0)
})

process.on("SIGTERM", () => {
  tsx.kill("SIGTERM")
  process.exit(0)
})
