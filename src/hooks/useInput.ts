import { useRef, useEffect } from "react"

export const useInputRef = () => {
  const ref = useRef<HTMLInputElement>()
  useEffect(() => ref.current?.focus(), [ref])
  return ref
}