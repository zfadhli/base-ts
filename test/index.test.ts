import { describe, expect, it } from "bun:test"
import { capitalize, greet, range, sum } from "../src/index.ts"

describe("greet", () => {
  it("should return a greeting for a given name", () => {
    expect(greet("World")).toBe("Hello, World!")
  })

  it("should handle empty string", () => {
    expect(greet("")).toBe("Hello, !")
  })
})

describe("capitalize", () => {
  it("should capitalize the first letter", () => {
    expect(capitalize("hello")).toBe("Hello")
  })

  it("should handle single character", () => {
    expect(capitalize("a")).toBe("A")
  })

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("")
  })
})

describe("range", () => {
  it("should generate an array from 0 to end", () => {
    expect(range(3)).toEqual([0, 1, 2])
  })

  it("should handle zero", () => {
    expect(range(0)).toEqual([])
  })
})

describe("sum", () => {
  it("should add two numbers", () => {
    expect(sum(3, 5)).toBe(8)
  })

  it("should handle negatives", () => {
    expect(sum(-1, 1)).toBe(0)
  })
})
