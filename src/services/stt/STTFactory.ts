import { STTProvider } from "./STTProvider"
import { WindowsSTTProvider } from "./WindowsSTTProvider"

export type STTProviderType = "windows" | "vosk" | "whisper"

export class STTFactory {
  static createProvider(type: STTProviderType): STTProvider {
    switch (type) {
      case "windows":
        return new WindowsSTTProvider()
      case "vosk":
      case "whisper":
        throw new Error(`STT provider '${type}' is not implemented yet.`)
      default:
        throw new Error(`Unknown STT provider type: ${type}`)
    }
  }
}
