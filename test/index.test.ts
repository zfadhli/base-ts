import { describe, expect, it } from 'bun:test'
import { greet } from '../src/index.ts'

describe('greet', () => {
  it('should return a greeting for a given name', () => {
    expect(greet('World')).toBe('Hello, World!')
  })

  it('should handle empty string', () => {
    expect(greet('')).toBe('Hello, !')
  })
})
