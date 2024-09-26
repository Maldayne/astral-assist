export interface STTResult {
  transcript: string
  isFinal: boolean
}

export interface STTProvider {
  start: () => Promise<void>
  stop: () => Promise<void>
  onResult: (callback: (result: STTResult) => void) => void
  onError: (callback: (error: Error) => void) => void
}
