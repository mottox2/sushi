import { describe, it, expect } from 'vitest'

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

describe('shuffle function', () => {
  it('should return an array with the same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
  })

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    input.forEach(item => {
      expect(result).toContain(item)
    })
  })

  it('should not modify the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const original = [...input]
    shuffle(input)
    expect(input).toEqual(original)
  })
})