'use client'
import { useEffect, useState, useCallback } from "react"
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

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export const App = () => {
  const mounted = useMounted()
  const { mode, setMode } = useMode('title')
  const [ stats, setStats ] = useState<Stats>(initialStats)
  const [ rotation, setRotation ] = useState(0)
  const onTimerEnd = useCallback(() => setMode('result'), [])
  const restart = useCallback(() => setMode('title'), [])

  return <div className={styles.container}>
    {mounted && <Background count={stats.score} mode={mode} setRotation={setRotation} />}
    { mode === 'title' && <Title start={() => setMode('game')}/>}
    { mode === 'result' && <Result score={stats.score} miss={stats.miss} rotation={rotation} restart={restart} />}
    { mode === 'game' &&
      <Game onEnd={onTimerEnd} onReset={() => setMode('title')} setStats={setStats} />
    }
  </div>
}

