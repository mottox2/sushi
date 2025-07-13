import { useEffect, useCallback, useState, KeyboardEvent } from "react"
import { useInputRef } from "./useInput"
import { Stats } from "../components/App"

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
  { letter: 'sanma', display: '秋刀魚'},
  { letter: 'ika', display: '烏賊'},
  { letter: 'fugu', display: '河豚'},
  { letter: 'anago', display: '穴子'},
  { letter: 'sawara', display: '鰆'},
  { letter: 'buri', display: '鰤'},
  { letter: 'karei', display: '鰈'},
  { letter: 'hotate', display: '帆立'},
  { letter: 'kani', display: '蟹'},
]

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const useLetter = () => {
  // 初期値を必ずセットする
  const [word, setWord] = useState<Word>(() => shuffle(keywords)[0])
  const [current, setCurrent] = useState(0)

  // 新しい単語に切り替え、インデックスもリセット
  const reset = useCallback(() => {
    const newWord = shuffle(keywords)[0]
    setWord(newWord)
    setCurrent(0)
  }, [])

  // 次の文字へ進む。最後まで到達したら新しい単語に切り替え
  const next = useCallback(() => {
    if (current < word.letter.length - 1) {
      setCurrent(i => i + 1)
    } else {
      reset()
    }
  }, [current, word.letter.length, reset])

  return { word, current, next, reset }
}

const useCounter = (initialCount?: number): [number, () => void, () => void] => {
  const [count, setCount] = useState(initialCount || 0)
  const increment = useCallback(() => setCount(i => i + 1), [])
  const reset = useCallback(() => setCount(0), [])
  return [count, increment, reset]
}

type Params = {
  onReset: () => void
  setStats: (stats: Stats) => void
}

export const useGame = ({ onReset, setStats }: Params) => {
  const { word, current, next } = useLetter()
  const [miss, countMiss] = useCounter()
  const [score, countScore] = useCounter(-1)
  const inputRef = useInputRef()

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onReset()
    const key = e.key.toLowerCase()
    if (e.metaKey || !/^[a-z]$/.test(key)) return
    if (key === word.letter[current]) next()
    else countMiss()
    e.preventDefault()
  }

  useEffect(() => {
    setStats({ miss, score, speed: Math.pow(1.1, score) * Math.pow(0.95, miss) })
  }, [miss, score])

  useEffect(() => {
    if (word?.letter) countScore()
  }, [word?.letter])

  return { word, current, onKeyDown, inputRef }
}
