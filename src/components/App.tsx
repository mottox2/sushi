import { useEffect, useState, useRef, useMemo, useCallback, KeyboardEvent } from "react"
import { Timer } from "./Timer"
import Background from "./Background";
import styles from './App.module.css'
import { Result } from "./Result";
import { Title } from "./Title";
import cn from 'classnames'

type Word = {
  letter: string
  display: string
}

const keywords = [
  { letter: 'shake', display: '鮭'},
  { letter: 'maguro', display: '鮪'},
  { letter: 'aji', display: '鯵'},
  { letter: 'ayu', display: '鮎'},
  { letter: 'iwashi', display: '鰯'},
  { letter: 'unagi', display: '鰻'},
  { letter: 'ebi', display: '蝦'},
  { letter: 'katuo', display: '鰹'},
  { letter: 'kujira', display: '鯨'},
  { letter: 'saba', display: '鯖'},
  { letter: 'suzuki', display: '鱸'},
  { letter: 'tai', display: '鯛'},
  { letter: 'tako', display: '蛸'},
]

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const useLetter = () => {
  const [word, setLetter] = useState<Word>()
  const [current, setCurrent] = useState(0)

  const generate = useCallback(() => setLetter(shuffle(keywords)[0]), [])

  const next = () => {
    if (current === word.letter.length - 1) {
      setCurrent(0)
      generate()
    } else {
      setCurrent(i => i+1)
    }
  }
  useEffect(() => generate(), [])

  return { word, current, next }
}

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
  const {word, current, next} = useLetter()
  const [miss, countMiss, resetMiss] = useCounter()
  const [score, countScore, resetScore] = useCounter(-1)
  const { mode, setMode } = useMode('title')
  const onTimerEnd = useCallback(() => setMode('result'), [])
  const inputRef = useRef<HTMLInputElement>()

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && mode === 'result') setMode('title')
    if (e.keyCode === 13 && mode === 'title') setMode('game')
    if (e.keyCode === 27 && mode === 'game') setMode('title') // ESC
    if (e.metaKey || e.keyCode < 65 || e.keyCode > 90) return
    if (e.key === word.letter[current]) next()
    else countMiss()
    e.preventDefault()
  }
  const restart = useCallback(() => setMode('title'), [])

  useEffect(() => word?.letter && countScore(), [word?.letter])
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
    setMounted(true)
  }, [inputRef])

  // reset
  useEffect(() => {
    if (mode !== 'title') return
    resetMiss()
    resetScore()
  }, [mode])

  return <div onClick={() => {
    if (inputRef.current) inputRef.current.focus()
  }} className={styles.container}>
    <input type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef} style={{opacity: 0}}/>
    {mounted && <Background count={score} />}
    { mode === 'title' && <Title start={() => setMode('game')}/>}
    { mode === 'result' && <Result score={score} miss={miss} restart={restart} />}
    { mode === 'game' &&
      <div className='ui'>
        <h1 className={cn(styles.title, 'serif')}>寿司廻し</h1>
        <div className={styles.typing}>
          <p className={cn(styles.kanji, 'serif')}>{word?.display}</p>
          <p>{word?.letter && word.letter.split("").map((l, i) => {
            return <span style={{
              color: i >= current ? 'black' : 'lightgray',
            }} key={i}>{l}</span>
          })}</p>
        </div>
        <Timer seconds={10} onEnd={onTimerEnd} />
      </div>
    }
  </div>
}

