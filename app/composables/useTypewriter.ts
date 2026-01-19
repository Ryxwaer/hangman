/**
 * Simple typewriter effect for dynamic text
 */
export function useTypewriter(speed: number = 20) {
  const displayedText = ref('')
  const isTyping = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function type(fullText: string) {
    if (timeoutId) clearTimeout(timeoutId)
    
    displayedText.value = ''
    isTyping.value = true
    let i = 0

    function next() {
      if (i < fullText.length) {
        displayedText.value = fullText.slice(0, ++i)
        timeoutId = setTimeout(next, speed)
      } else {
        isTyping.value = false
      }
    }
    next()
  }

  function reset() {
    if (timeoutId) clearTimeout(timeoutId)
    displayedText.value = ''
    isTyping.value = false
  }

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { displayedText, isTyping, type, reset }
}
