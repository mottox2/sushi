import { useEffect, useRef } from "react"

// useTimerに突っ込んだ方が良さそう。

// count, onTimerEnd
export const Timer = () => {
  const timerRef = useRef<HTMLDivElement>()
  useEffect(() => {
    let timer = 0;
    const countUp = () => {
      timer += 1;
      if (timerRef.current)
        timerRef.current.innerText = timer + 's'
    }
    let interval = window.setInterval(countUp, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <div ref={timerRef}></div>
}

