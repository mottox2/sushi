import { useEffect, useState, useRef, useMemo, useCallback, KeyboardEvent } from "react"
import Background from "./Background";
import styles from './App.module.css'
import { Result } from "./Result";
import { Title } from "./Title";
import { Game } from './game'

type Mode = "title" | "game" | "result"

const useMode = (initialMode: Mode) => {
  const [mode, setMode] = useState<Mode>(initialMode)
  return { mode, setMode }
}

export type Stats = {
  miss: number,
  score: number,
  speed: number
}

const initialStats = { miss: 0, score: 0, speed: 1 }

export const App = () => {
  const [mounted, setMounted] = useState(false)
  const { mode, setMode } = useMode('title')
  const [ stats, setStats ] = useState<Stats>(initialStats)
  const onTimerEnd = useCallback(() => setMode('result'), [])
  const restart = useCallback(() => setMode('title'), [])

  useEffect(() => setMounted(true), [])

  return <div className={styles.container}>
    {mounted && <Background count={stats.score} />}
    { mode === 'title' && <Title start={() => setMode('game')}/>}
    { mode === 'result' && <Result score={stats.score} miss={stats.miss} restart={restart} />}
    { mode === 'game' &&
      <Game onEnd={onTimerEnd} onReset={() => setMode('title')} setStats={setStats} />
    }
  </div>
}

