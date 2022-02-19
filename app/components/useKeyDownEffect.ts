import { MutableRefObject, useEffect, useRef } from "react"

const createUseKeyboardEventHook = (event: string) => {
  return (callback: () => any, key: string, elementRef: MutableRefObject<HTMLElement | null>) => {
    const callbackRef = useRef(callback)
    useEffect(() => {
      callbackRef.current = callback
    })
    useEffect(() => {
      const handleEvent = (event: KeyboardEvent) => {
        if (event.key === key) {
          console.log(`handling ${key}`)
          event.stopPropagation()
          callbackRef.current()
        }
      }
      elementRef.current?.addEventListener(event, handleEvent)
      return () => {
        elementRef.current?.removeEventListener(event, handleEvent)
      }
    }, [key])
  }
}

export const useKeyDownEffect = createUseKeyboardEventHook("keydown")
export const useKeyPressEffect = createUseKeyboardEventHook("keypress")

// export const useKeyDownEffect = (callback: () => any, key: string, elementRef: MutableRefObject<HTMLElement | null>) => {
//   const callbackRef = useRef(callback)
//   useEffect(() => {
//     callbackRef.current = callback
//   })
//   useEffect(() => {
//     const handleKeyUp = (event: KeyboardEvent) => {
//       if (event.key === key) {
//         event.stopPropagation()
//         callbackRef.current()
//       }
//     }
//     elementRef.current?.addEventListener("keydown", handleKeyUp)
//     return () => {
//       elementRef.current?.removeEventListener("keydown", handleKeyUp)
//     }
//   }, [key])
// }
