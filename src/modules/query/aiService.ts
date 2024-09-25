import { invoke } from "@tauri-apps/api/tauri"

export class LowCreditError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LowCreditError"
  }
}

export class AIService {
  async queryClaude(
    message: string,
    systemPrompt: string = ""
  ): Promise<string> {
    try {
      console.log("Sending request to Claude with system prompt:", systemPrompt)
      const response: { response: string } = await invoke("query_claude", {
        request: {
          message,
          system_prompt: systemPrompt,
        },
      })
      return response.response
    } catch (error) {
      console.error("Error querying Claude:", error)
      if (typeof error === "string") {
        if (error.includes("Your credit balance is too low")) {
          throw new LowCreditError(
            "Insufficient credit balance to access the AI service. Please check your account settings."
          )
        }
        console.error("Error details:", error)
      } else if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      throw new Error("Failed to get response from AI")
    }
  }
}

export const aiService = new AIService()
