import { useEffect, useState, KeyboardEvent } from "react"
import { Stats } from "../components/App"
import { keywords, Word } from "../data/keywords"

type GameState = {
  word: Word
  current: number
  inputBuffer: string
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

const romajiMap: Record<string, string[]> = {
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'さ': ['sa'], 'し': ['shi', 'si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'ざ': ['za'], 'じ': ['ji', 'zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'ゐ': ['wi'], 'ゑ': ['we'], 'を': ['wo'], 'ん': ['nn', 'n'],
  'ゃ': ['ya'], 'ゅ': ['yu'], 'ょ': ['yo'],
  'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
  'しゃ': ['sha', 'sya'], 'しゅ': ['shu', 'syu'], 'しょ': ['sho', 'syo'],
  'ちゃ': ['cha', 'tya'], 'ちゅ': ['chu', 'tyu'], 'ちょ': ['cho', 'tyo'],
  'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
  'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
  'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
  'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
  'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
  'じゃ': ['ja', 'jya', 'zya'], 'じゅ': ['ju', 'jyu', 'zyu'], 'じょ': ['jo', 'jyo', 'zyo'],
  'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
  'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo']
}

const parseHiraganaSequence = (text: string): string[] => {
  const result: string[] = []
  let i = 0
  
  while (i < text.length) {
    const char = text[i]
    const nextChar = text[i + 1]
    
    // 小文字 (ゃ、ゅ、ょ、っ) をチェック
    if (nextChar && ['ゃ', 'ゅ', 'ょ', 'っ'].includes(nextChar)) {
      result.push(char + nextChar)
      i += 2
    } else {
      result.push(char)
      i += 1
    }
  }
  
  return result
}

export const processKeyInput = (state: GameState, key: string): GameState => {
  if (!/^[a-z]$/.test(key)) return state
  
  const newBuffer = state.inputBuffer + key
  const hiraganaSequence = parseHiraganaSequence(state.word.letter)
  
  if (state.current >= hiraganaSequence.length) {
    const newWord = shuffle(keywords)[0]
    return {
      ...state,
      word: newWord,
      current: 0,
      inputBuffer: key,
      score: state.score + 1
    }
  }
  
  const targetHiragana = hiraganaSequence[state.current]
  const validRomaji = romajiMap[targetHiragana] || [targetHiragana]
  
  const isValidPrefix = validRomaji.some(romaji => romaji.startsWith(newBuffer))
  const isComplete = validRomaji.includes(newBuffer)
  
  if (isComplete) {
    const nextCurrent = state.current + 1
    if (nextCurrent >= hiraganaSequence.length) {
      const newWord = shuffle(keywords)[0]
      return {
        ...state,
        word: newWord,
        current: 0,
        inputBuffer: '',
        score: state.score + 1
      }
    } else {
      return {
        ...state,
        current: nextCurrent,
        inputBuffer: ''
      }
    }
  } else if (isValidPrefix) {
    return {
      ...state,
      inputBuffer: newBuffer
    }
  } else {
    return {
      ...state,
      inputBuffer: '',
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
    inputBuffer: '',
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
    inputBuffer: gameState.inputBuffer,
    onKeyDown
  }
}
