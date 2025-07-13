import { describe, it, expect } from 'vitest'
import { processKeyInput, calculateSpeed } from './useGame'
import { Word } from '../data/keywords'

describe('processKeyInput function', () => {
  const mockWord: Word = { letter: 'しゃけ', display: '鮭' }
  const initialState = {
    word: mockWord,
    current: 0,
    inputBuffer: '',
    miss: 0,
    score: 0
  }

  it('should handle shi input with sha romaji', () => {
    let result = processKeyInput(initialState, 's')
    expect(result.current).toBe(0)
    expect(result.inputBuffer).toBe('s')
    expect(result.miss).toBe(0)
    
    result = processKeyInput(result, 'h')
    expect(result.current).toBe(0)
    expect(result.inputBuffer).toBe('sh')
    expect(result.miss).toBe(0)
    
    result = processKeyInput(result, 'a')
    expect(result.current).toBe(1)
    expect(result.inputBuffer).toBe('')
    expect(result.miss).toBe(0)
  })

  it('should handle alternative romaji patterns', () => {
    let result = processKeyInput(initialState, 's')
    result = processKeyInput(result, 'y')
    result = processKeyInput(result, 'a')
    expect(result.current).toBe(1)
    expect(result.inputBuffer).toBe('')
    expect(result.miss).toBe(0)
  })

  it('should increment miss count on incorrect key', () => {
    const result = processKeyInput(initialState, 'x')
    expect(result.current).toBe(0)
    expect(result.inputBuffer).toBe('')
    expect(result.miss).toBe(1)
    expect(result.score).toBe(0)
  })

  it('should reset to new word when completing current word', () => {
    const finalCharState = {
      ...initialState,
      current: 2 // last character 'け' of 'しゃけ'
    }
    const result = processKeyInput(finalCharState, 'k')
    expect(result.inputBuffer).toBe('k')
    
    const finalResult = processKeyInput(result, 'e')
    expect(finalResult.current).toBe(0)
    expect(finalResult.inputBuffer).toBe('')
    expect(finalResult.score).toBe(1)
    expect(finalResult.word).not.toEqual(mockWord)
  })

  it('should ignore non-letter keys', () => {
    const result = processKeyInput(initialState, '1')
    expect(result).toEqual(initialState)
  })
})

describe('calculateSpeed function', () => {
  it('should calculate speed correctly', () => {
    expect(calculateSpeed(0, 0)).toBe(1)
    expect(calculateSpeed(1, 0)).toBeCloseTo(1.1)
    expect(calculateSpeed(0, 1)).toBeCloseTo(0.95)
    expect(calculateSpeed(2, 1)).toBeCloseTo(1.1 * 1.1 * 0.95)
  })
})

describe('processKeyInput with sequential inputs', () => {
  const mockWord: Word = { letter: 'あじ', display: '鯵' }

  it('should handle complete word typing sequence', () => {
    let state = {
      word: mockWord,
      current: 0,
      inputBuffer: '',
      miss: 0,
      score: 0
    }

    // Type 'a'
    state = processKeyInput(state, 'a')
    expect(state.current).toBe(1)
    expect(state.inputBuffer).toBe('')
    expect(state.miss).toBe(0)
    expect(state.score).toBe(0)

    // Type 'j' then 'i' for 'じ'
    state = processKeyInput(state, 'j')
    expect(state.current).toBe(1)
    expect(state.inputBuffer).toBe('j')
    
    state = processKeyInput(state, 'i')
    expect(state.current).toBe(0)
    expect(state.inputBuffer).toBe('')
    expect(state.miss).toBe(0)
    expect(state.score).toBe(1)
    expect(state.word).not.toEqual(mockWord)
  })

  it('should handle typing with mistakes', () => {
    let state = {
      word: mockWord,
      current: 0,
      inputBuffer: '',
      miss: 0,
      score: 0
    }

    // Type 'a' (correct)
    state = processKeyInput(state, 'a')
    expect(state.current).toBe(1)
    expect(state.miss).toBe(0)

    // Type 'x' (wrong)
    state = processKeyInput(state, 'x')
    expect(state.current).toBe(1)
    expect(state.inputBuffer).toBe('')
    expect(state.miss).toBe(1)

    // Type 'j' (correct start for じ)
    state = processKeyInput(state, 'j')
    expect(state.current).toBe(1)
    expect(state.inputBuffer).toBe('j')
    expect(state.miss).toBe(1)

    // Type 'y' (wrong, should reset buffer)
    state = processKeyInput(state, 'y')
    expect(state.current).toBe(1)
    expect(state.inputBuffer).toBe('')
    expect(state.miss).toBe(2)

    // Type 'zi' (correct, complete word)
    state = processKeyInput(state, 'z')
    state = processKeyInput(state, 'i')
    expect(state.current).toBe(0)
    expect(state.inputBuffer).toBe('')
    expect(state.miss).toBe(2)
    expect(state.score).toBe(1)
  })

  it('should handle multiple word completions', () => {
    let state = {
      word: { letter: 'たい', display: '鯛' },
      current: 0,
      inputBuffer: '',
      miss: 0,
      score: 0
    }

    // Complete first word 'たい'
    state = processKeyInput(state, 't')
    state = processKeyInput(state, 'a')
    state = processKeyInput(state, 'i')

    expect(state.score).toBe(1)
    expect(state.current).toBe(0)
    expect(state.inputBuffer).toBe('')
    const firstNewWord = state.word

    // Complete second word (whatever it is)
    const secondWordHiragana = Array.from(state.word.letter)
    for (const hiragana of secondWordHiragana) {
      if (hiragana === 'あ') state = processKeyInput(state, 'a')
      else if (hiragana === 'い') state = processKeyInput(state, 'i')
      else if (hiragana === 'う') state = processKeyInput(state, 'u')
      else if (hiragana === 'え') state = processKeyInput(state, 'e')
      else if (hiragana === 'お') state = processKeyInput(state, 'o')
      else if (hiragana === 'か') {
        state = processKeyInput(state, 'k')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'き') {
        state = processKeyInput(state, 'k')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'く') {
        state = processKeyInput(state, 'k')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'け') {
        state = processKeyInput(state, 'k')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'こ') {
        state = processKeyInput(state, 'k')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'が') {
        state = processKeyInput(state, 'g')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ぎ') {
        state = processKeyInput(state, 'g')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'ぐ') {
        state = processKeyInput(state, 'g')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'げ') {
        state = processKeyInput(state, 'g')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'ご') {
        state = processKeyInput(state, 'g')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'さ') {
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'し') {
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'す') {
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'せ') {
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'そ') {
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'ざ') {
        state = processKeyInput(state, 'z')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'じ') {
        state = processKeyInput(state, 'j')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'ず') {
        state = processKeyInput(state, 'z')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'ぜ') {
        state = processKeyInput(state, 'z')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'ぞ') {
        state = processKeyInput(state, 'z')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'た') {
        state = processKeyInput(state, 't')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ち') {
        state = processKeyInput(state, 'c')
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'つ') {
        state = processKeyInput(state, 't')
        state = processKeyInput(state, 's')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'て') {
        state = processKeyInput(state, 't')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'と') {
        state = processKeyInput(state, 't')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'な') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'に') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'ぬ') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'ね') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'の') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'は') {
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ひ') {
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'ふ') {
        state = processKeyInput(state, 'f')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'へ') {
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'ほ') {
        state = processKeyInput(state, 'h')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'ば') {
        state = processKeyInput(state, 'b')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'び') {
        state = processKeyInput(state, 'b')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'ぶ') {
        state = processKeyInput(state, 'b')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'べ') {
        state = processKeyInput(state, 'b')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'ぼ') {
        state = processKeyInput(state, 'b')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'ま') {
        state = processKeyInput(state, 'm')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'み') {
        state = processKeyInput(state, 'm')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'む') {
        state = processKeyInput(state, 'm')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'め') {
        state = processKeyInput(state, 'm')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'も') {
        state = processKeyInput(state, 'm')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'や') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ゆ') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'よ') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'ら') {
        state = processKeyInput(state, 'r')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'り') {
        state = processKeyInput(state, 'r')
        state = processKeyInput(state, 'i')
      }
      else if (hiragana === 'る') {
        state = processKeyInput(state, 'r')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'れ') {
        state = processKeyInput(state, 'r')
        state = processKeyInput(state, 'e')
      }
      else if (hiragana === 'ろ') {
        state = processKeyInput(state, 'r')
        state = processKeyInput(state, 'o')
      }
      else if (hiragana === 'わ') {
        state = processKeyInput(state, 'w')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ん') {
        state = processKeyInput(state, 'n')
        state = processKeyInput(state, 'n')
      }
      else if (hiragana === 'ゃ') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'a')
      }
      else if (hiragana === 'ゅ') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'u')
      }
      else if (hiragana === 'ょ') {
        state = processKeyInput(state, 'y')
        state = processKeyInput(state, 'o')
      }
    }

    expect(state.score).toBe(2)
    expect(state.current).toBe(0)
    expect(state.word).not.toEqual(firstNewWord)
  })

  it('should maintain miss count across word transitions', () => {
    let state = {
      word: { letter: 'えび', display: '蝦' },
      current: 0,
      inputBuffer: '',
      miss: 3,
      score: 5
    }

    // Complete word with existing miss count
    state = processKeyInput(state, 'e')
    state = processKeyInput(state, 'b')
    state = processKeyInput(state, 'i')

    expect(state.score).toBe(6)
    expect(state.miss).toBe(3) // Miss count should be preserved
    expect(state.current).toBe(0)
    expect(state.inputBuffer).toBe('')
  })
})