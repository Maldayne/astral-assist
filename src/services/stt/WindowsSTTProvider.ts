import { useAppStore } from "@/store/appStore"
import { STTProvider, STTResult } from "./STTProvider"

export class WindowsSTTProvider implements STTProvider {
  private recognition: SpeechRecognition | null = null
  private resultCallback: ((result: STTResult) => void) | null = null
  private errorCallback: ((error: Error) => void) | null = null
  private appStore = useAppStore()

  constructor() {
    if (!("webkitSpeechRecognition" in window)) {
      throw new Error("Web Speech API is not supported in this browser.")
    }
  }

  start = async (): Promise<void> => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const words: string[] = []
      for (let i = 0; i < event.results.length; i++) {
        words.push(...event.results[i][0].transcript.trim().split(" "))
      }
      this.appStore.updateTranscribedWords(words)

      if (this.resultCallback) {
        const lastResult = event.results[event.results.length - 1]
        const result: STTResult = {
          transcript: words.join(" "),
          isFinal: lastResult.isFinal,
        }
        this.resultCallback(result)
      }
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.errorCallback) {
        this.errorCallback(new Error(event.error))
      }
    }

    this.recognition.start()
  }

  stop = async (): Promise<void> => {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  onResult = (callback: (result: STTResult) => void): void => {
    this.resultCallback = callback
  }

  onError = (callback: (error: Error) => void): void => {
    this.errorCallback = callback
  }
}
