import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { Timer } from "./Timer"

const keywords = [
  'shake',
  'maguro',
  'aji',
  'ayu',
  'iwashi',
  'unagi',
  'ebi',
  'katuo',
  'kujira',
  'saba',
  'suzuki',
  'tai',
  'tako',
]

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const useLetter = () => {
  const [letter, setLetter] = useState([])
  const generate = useCallback(() => setLetter(shuffle(keywords)[0].split("")), [])
  useEffect(() => generate(), [])
  return { letter, generate }
}

const useCounter: () => [number, () => void] = () => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount(i => i+1), [])
  return [ count, increment ]
}

export const App = () => {
  const {letter, generate} = useLetter()
  const [current, setCurrent] = useState(0)
  const [miss, countMiss] = useCounter()
  const [completeCount, countComplete] = useCounter()

  const inputRef = useRef<HTMLInputElement>()

  const onKeyDown = (e) => {
    if (e.key === letter[current]) {
      if (current === letter.length - 1) {
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
  }, [inputRef])


  return <div onClick={() => {
    if (inputRef.current) inputRef.current.focus()
  }} style={{width: '100%'}}>
      <input type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef}/>
      {/* <Timer/> */}
      <p>{letter.map((l, i) => {
        return <span style={{
          color: i >= current ? 'black' : 'lightgray',
          fontSize: 40
        }} key={i}>{l}</span>
      })}</p>

      done: {completeCount}<br/>
      miss: {miss}
    </div>
}

