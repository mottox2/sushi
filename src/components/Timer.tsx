import { useEffect, useRef } from "react"

// useTimerに突っ込んだ方が良さそう。

// count, onTimerEnd
export const Timer = ({ seconds, onEnd }) => {
  const timerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let timer = 0;
    const countUp = () => {
      timer += 1;
      if (timerRef.current)
        timerRef.current.innerText = String(seconds - timer)
      if (seconds - timer < 0) {
        onEnd()
      }
    }
    countUp()
    let interval = window.setInterval(countUp, 1000)
    return () => window.clearInterval(interval)
  }, [seconds, onEnd])

  return <div className='timer' ref={timerRef}></div>
}

