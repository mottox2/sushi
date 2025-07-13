import { useEffect, useState, KeyboardEvent } from "react"
import { Stats } from "../components/App"
import { keywords, Word } from "../data/keywords"

type GameState = {
  word: Word
  current: number
  miss: number
  score: number
}

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
    onKeyDown
  }
}
