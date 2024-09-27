import chokidar from "chokidar"
import fs from "fs/promises"
import { debounce } from "lodash-es"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DESIGN_DOCUMENT_PATH = path.join(__dirname, "..", "design-document.xml")
const AI_PROMPT_PATH = path.join(__dirname, "..", "repopack-ai-prompt.xml")
const INSTRUCTIONS_PATH = path.join(
  __dirname,
  "..",
  "repopack-ai-instructions.xml"
)

async function updateInstructionsFile() {
  console.log("Updating repopack-ai-instructions.xml")
  try {
    const [designDoc, aiPrompt] = await Promise.all([
      fs.readFile(DESIGN_DOCUMENT_PATH, "utf-8"),
      fs.readFile(AI_PROMPT_PATH, "utf-8"),
    ])

    const combinedContent = `${designDoc}\n${aiPrompt}`
    await fs.writeFile(INSTRUCTIONS_PATH, combinedContent, "utf-8")
  } catch (error) {
    console.error("Error updating instructions file:", error)
  }
}

const debouncedUpdate = debounce(updateInstructionsFile, 300)

const watcher = chokidar.watch([DESIGN_DOCUMENT_PATH, AI_PROMPT_PATH], {
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100,
  },
})

watcher
  .on("add", debouncedUpdate)
  .on("change", debouncedUpdate)
  .on("unlink", () =>
    console.error(
      "A source file has been removed. Please check your project structure."
    )
  )

process.on("SIGINT", () => {
  watcher.close().then(() => process.exit(0))
})

process.on("SIGTERM", () => {
  watcher.close().then(() => process.exit(0))
})
