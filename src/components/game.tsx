import { Timer } from "./Timer"
import styles from './App.module.css'
import cn from 'classnames'
import { useGame } from "../hooks/useGame"
import { Stats } from "./App"

type Props = {
  onEnd: () => void
  onReset: () => void
  setStats: (stats: Stats) => void
}

const time = process.env.NODE_ENV === 'development' ? 10 : 20

export const Game: React.FC<Props> = ({ onEnd, onReset, setStats }) => {
  const { word, current, onKeyDown, inputRef } = useGame({ onReset, setStats })

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

