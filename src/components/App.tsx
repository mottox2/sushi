import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { Timer } from "./Timer"
import Background from "./Background";
import styles from './App.module.css'

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
  // const { letter, kanji} = word
  const generate = useCallback(() => setLetter(shuffle(keywords)[0]), [])
  useEffect(() => generate(), [])
  return { word, generate }
}

const useCounter: () => [number, () => void] = () => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount(i => i+1), [])
  return [ count, increment ]
}

export const App = () => {
  const [loaded, setLoaded] = useState(false)
  const {word, generate} = useLetter()
  const [current, setCurrent] = useState(0)
  const [miss, countMiss] = useCounter()
  const [completeCount, countComplete] = useCounter()

  const [isEnd, setEnd] = useState(false)
  const onTimerEnd = useCallback(() => setEnd(true), [])

  const inputRef = useRef<HTMLInputElement>()

  const onKeyDown = (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90 && e.key === word.letter[current]) {
      if (current === word.letter.length - 1) {
        generate()
        setCurrent(0)
        countComplete()
      } else {
        setCurrent(i => i+1)
      }
    } else {
      countMiss()
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
    setLoaded(true)
  }, [inputRef])


  return <div onClick={() => {
    if (inputRef.current) inputRef.current.focus()
  }} className={styles.container}>
    {loaded && <Background count={completeCount} />}
      { isEnd ?
        <div className='ui'>
          結果
          done: {completeCount}<br/>
          miss: {miss}
        </div> :
        <div className='ui'>
          <h1  className={styles.title}>寿司廻し</h1>
          <input type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef} style={{opacity: 0}}/>
          <div className={styles.typing}>
            <p className={styles.kanji}>{word && word.display}</p>
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

