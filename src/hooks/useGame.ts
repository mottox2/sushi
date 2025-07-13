import { useEffect, useState, KeyboardEvent } from "react"
import { useInputRef } from "./useInput"
import { Stats } from "../components/App"

type Word = {
  letter: string
  display: string
}

type GameState = {
  word: Word
  current: number
  miss: number
  score: number
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

export const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const processKeyInput = (state: GameState, key: string): GameState => {
  if (!/^[a-z]$/.test(key)) return state
  
  if (key === state.word.letter[state.current]) {
    if (state.current < state.word.letter.length - 1) {
      return {
        ...state,
        current: state.current + 1
      }
    } else {
      const newWord = shuffle(keywords)[0]
      return {
        ...state,
        word: newWord,
        current: 0,
        score: state.score + 1
      }
    }
  } else {
    return {
      ...state,
      miss: state.miss + 1
    }
  }
}

export const calculateSpeed = (score: number, miss: number): number => {
  return Math.pow(1.1, score) * Math.pow(0.95, miss)
}


type Params = {
  onReset: () => void
  setStats: (stats: Stats) => void
}

export const useGame = ({ onReset, setStats }: Params) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    word: shuffle(keywords)[0],
    current: 0,
    miss: 0,
    score: -1
  }))
  const inputRef = useInputRef()

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onReset()
      return
    }
    
    const key = e.key.toLowerCase()
    if (e.metaKey) return

    const newState = processKeyInput(gameState, key)
    setGameState(newState)
    e.preventDefault()
  }

  useEffect(() => {
    const speed = calculateSpeed(gameState.score, gameState.miss)
    setStats({ miss: gameState.miss, score: gameState.score, speed })
  }, [gameState.miss, gameState.score, setStats])

  useEffect(() => {
    if (gameState.word?.letter && gameState.score === -1) {
      setGameState(prev => ({ ...prev, score: 0 }))
    }
  }, [gameState.word?.letter, gameState.score])

  return { 
    word: gameState.word, 
    current: gameState.current, 
    onKeyDown, 
    inputRef 
  }
}
