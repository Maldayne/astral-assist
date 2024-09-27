import { execSync } from "child_process"

function clearTerminal() {
  console.log("\n".repeat(process.stdout.rows))
}

async function start() {
  try {
    console.log("Running repopack...")
    execSync("repopack", { stdio: "inherit" })

    clearTerminal()

    console.log("Starting Tauri development environment...")
    execSync("npm run tauri dev", { stdio: "inherit" })
  } catch (error) {
    console.error("An error occurred during startup:", error.message)
    process.exit(1)
  }
}

start()
