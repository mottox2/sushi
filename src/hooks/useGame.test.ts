import { describe, it, expect } from 'vitest'
import { processKeyInput, calculateSpeed } from './useGame'

describe('processKeyInput function', () => {
  const mockWord = { letter: 'shake', display: '鮭' }
  const initialState = {
    word: mockWord,
    current: 0,
    miss: 0,
    score: 0
  }

  it('should advance current position on correct key', () => {
    const result = processKeyInput(initialState, 's')
    expect(result.current).toBe(1)
    expect(result.miss).toBe(0)
    expect(result.score).toBe(0)
  })

  it('should increment miss count on incorrect key', () => {
    const result = processKeyInput(initialState, 'x')
    expect(result.current).toBe(0)
    expect(result.miss).toBe(1)
    expect(result.score).toBe(0)
  })

  it('should reset to new word when completing current word', () => {
    const finalCharState = {
      ...initialState,
      current: 4 // last character 'e' of 'shake'
    }
    const result = processKeyInput(finalCharState, 'e')
    expect(result.current).toBe(0)
    expect(result.score).toBe(1)
    expect(result.word).not.toEqual(mockWord)
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
  const mockWord = { letter: 'aji', display: '鯵' }

  it('should handle complete word typing sequence', () => {
    let state = {
      word: mockWord,
      current: 0,
      miss: 0,
      score: 0
    }

    // Type 'a'
    state = processKeyInput(state, 'a')
    expect(state.current).toBe(1)
    expect(state.miss).toBe(0)
    expect(state.score).toBe(0)

    // Type 'j'
    state = processKeyInput(state, 'j')
    expect(state.current).toBe(2)
    expect(state.miss).toBe(0)
    expect(state.score).toBe(0)

    // Type 'i' (complete word)
    state = processKeyInput(state, 'i')
    expect(state.current).toBe(0)
    expect(state.miss).toBe(0)
    expect(state.score).toBe(1)
    expect(state.word).not.toEqual(mockWord)
  })

  it('should handle typing with mistakes', () => {
    let state = {
      word: mockWord,
      current: 0,
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
    expect(state.miss).toBe(1)

    // Type 'j' (correct)
    state = processKeyInput(state, 'j')
    expect(state.current).toBe(2)
    expect(state.miss).toBe(1)

    // Type 'y' (wrong)
    state = processKeyInput(state, 'y')
    expect(state.current).toBe(2)
    expect(state.miss).toBe(2)

    // Type 'i' (correct, complete word)
    state = processKeyInput(state, 'i')
    expect(state.current).toBe(0)
    expect(state.miss).toBe(2)
    expect(state.score).toBe(1)
  })

  it('should handle multiple word completions', () => {
    let state = {
      word: { letter: 'tai', display: '鯛' },
      current: 0,
      miss: 0,
      score: 0
    }

    // Complete first word 'tai'
    state = processKeyInput(state, 't')
    state = processKeyInput(state, 'a')
    state = processKeyInput(state, 'i')

    expect(state.score).toBe(1)
    expect(state.current).toBe(0)
    const firstNewWord = state.word

    // Complete second word (whatever it is)
    const secondWordLetters = state.word.letter.split('')
    for (const letter of secondWordLetters) {
      state = processKeyInput(state, letter)
    }

    expect(state.score).toBe(2)
    expect(state.current).toBe(0)
    expect(state.word).not.toEqual(firstNewWord)
  })

  it('should maintain miss count across word transitions', () => {
    let state = {
      word: { letter: 'ebi', display: '蝦' },
      current: 0,
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
  })
})