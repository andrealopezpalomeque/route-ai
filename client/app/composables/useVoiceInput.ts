interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((event: { results: { isFinal: boolean; 0: { transcript: string } }[] }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export function useVoiceInput() {
  const { locale } = useI18n()

  const isListening = ref(false)
  const isSupported = ref(false)
  const transcript = ref('')
  const error = ref('')

  let recognition: SpeechRecognitionLike | null = null

  const langMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-AR',
  }

  if (import.meta.client) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition
    isSupported.value = !!SpeechRecognitionCtor

    if (SpeechRecognitionCtor) {
      recognition = new SpeechRecognitionCtor() as SpeechRecognitionLike
      recognition.interimResults = true
      recognition.continuous = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        let interim = ''
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]!
          if (result.isFinal) {
            transcript.value = result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }
        if (interim) {
          transcript.value = interim
        }
      }

      recognition.onerror = (event) => {
        isListening.value = false
        if (event.error === 'no-speech' || event.error === 'network') {
          error.value = 'voiceError'
        } else if (event.error === 'not-allowed') {
          error.value = 'voiceNotSupported'
        }
      }

      recognition.onend = () => {
        isListening.value = false
      }
    }
  }

  function startListening() {
    if (!recognition) return
    error.value = ''
    transcript.value = ''
    recognition.lang = langMap[locale.value] || 'en-US'
    recognition.start()
    isListening.value = true
  }

  function stopListening() {
    if (!recognition) return
    recognition.stop()
    isListening.value = false
  }

  onUnmounted(() => {
    if (recognition && isListening.value) {
      recognition.stop()
    }
  })

  return {
    isListening: readonly(isListening),
    isSupported: readonly(isSupported),
    transcript: readonly(transcript),
    error: readonly(error),
    startListening,
    stopListening,
  }
}
