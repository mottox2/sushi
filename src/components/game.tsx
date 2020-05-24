import { useEffect, useState, useRef, useMemo, useCallback, KeyboardEvent } from "react"
import { Timer } from "./Timer"
import styles from './App.module.css'
import cn from 'classnames'
import { useInputRef } from "../hooks/useInput"
import { Stats } from "./App"

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

type Props = {
  onEnd: () => void
  onReset: () => void
  setStats: (stats: Stats) => void
}

const time = process.env.NODE_ENV === 'development' ? 10 : 20

export const Game: React.FC<Props> = ({onEnd, onReset, setStats}) => {
  const {word, current, next} = useLetter()
  const [miss, countMiss, resetMiss] = useCounter()
  const [score, countScore, resetScore] = useCounter(-1)
  const inputRef = useInputRef()

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 27) onReset()
    if (e.metaKey || e.keyCode < 65 || e.keyCode > 90) return
    if (e.key === word.letter[current]) next()
    else countMiss()
    e.preventDefault()
  }

  useEffect(() => {
    setStats({ miss, score, speed: Math.pow(1.1, score) * Math.pow(0.95, miss) })
  }, [miss, score])

  useEffect(() => word?.letter && countScore(), [word?.letter])

  return <div onClick={() => {
    if (inputRef.current) inputRef.current.focus()
  }} className={styles.container}>
    <input className={styles.input} type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef} />
    <div>
      {/* <h1 className={cn(styles.title, 'serif')}>寿司廻し</h1> */}
      <div className={styles.typing}>
        <p className={cn(styles.kanji, 'serif')}>{word?.display}</p>
        <p>{word?.letter && word.letter.split("").map((l, i) => {
          return <span style={{
            color: i >= current ? 'black' : 'lightgray',
            textDecoration: i == current ? 'underline' : 'none'
          }} key={i}>{l}</span>
        })}</p>
      </div>
      <Timer seconds={time} onEnd={onEnd} />
    </div>
  </div>
}

