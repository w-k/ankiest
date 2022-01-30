import { useEffect, useRef } from "react"

export const useKeyUpEffect = (callback: () => any, key: string) => {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.stopPropagation()
        callbackRef.current()
      }
    }
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [key])
}
