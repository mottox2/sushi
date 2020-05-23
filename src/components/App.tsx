import { useEffect, useState, useRef, useMemo, useCallback, KeyboardEvent } from "react"
import Background from "./Background";
import styles from './App.module.css'
import { Result } from "./Result";
import { Title } from "./Title";
import { Game } from './game'

const useCounter = (initialCount?: number): [number, () => void, () => void] => {
  const [count, setCount] = useState(initialCount || 0)
  const increment = useCallback(() => setCount(i => i+1), [])
  const reset = useCallback(() => setCount(0), [])
  return [ count, increment, reset]
}

type Mode = "title" | "game" | "result"

const useMode = (initialMode: Mode) => {
  const [mode, setMode] = useState<Mode>(initialMode)
  return { mode, setMode }
}

export const App = () => {
  const [mounted, setMounted] = useState(false)
  const [miss, countMiss, resetMiss] = useCounter()
  const [score, countScore, resetScore] = useCounter(0)
  const { mode, setMode } = useMode('title')
  const onTimerEnd = useCallback(() => setMode('result'), [])
  const restart = useCallback(() => setMode('title'), [])

  useEffect(() => setMounted(true), [])

  return <div onClick={() => {
    // if (inputRef.current) inputRef.current.focus()
  }} className={styles.container}>
    {mounted && <Background count={score} />}
    { mode === 'title' && <Title start={() => setMode('game')}/>}
    { mode === 'result' && <Result score={score} miss={miss} restart={restart} />}
    { mode === 'game' &&
      <Game onEnd={onTimerEnd} onReset={() => setMode('title')} />
    }
  </div>
}

