/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Array manipulation and random selection utilities - \\

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @returns {number} random integer between min and max
 */
export function random_int(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates a random float between min and max
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @returns {number} random float between min and max
 */
export function random_float(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Returns a random element from an array
 * @param {T[]} array - the array to select from
 * @returns {T} random element from the array
 */
export function random_element<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Returns multiple random elements from an array without replacement
 * @param {T[]} array - the array to select from
 * @param {number} count - number of elements to select
 * @returns {T[]} array of random elements
 */
export function random_elements<T>(array: T[], count: number): T[] {
  const shuffled = shuffle([...array])
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {T[]} array - the array to shuffle
 * @returns {T[]} new shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// - Array Transformation Functions - \\
// - Functions for manipulating and restructuring arrays - \\

/**
 * Splits an array into chunks of specified size
 * @param {T[]} array - the array to chunk
 * @param {number} size - size of each chunk
 * @returns {T[][]} array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

/**
 * Returns unique elements from an array
 * @param {T[]} array - the array to process
 * @returns {T[]} array with unique elements
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Flattens a nested array by one level
 * @param {T[][]} array - the nested array to flatten
 * @returns {T[]} flattened array
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat()
}

/**
 * Groups array elements by a specified key
 * @param {T[]} array - the array to group
 * @param {keyof T} key - the key to group by
 * @returns {Record<string, T[]>} object with grouped elements
 */
export function group_by<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group_key = String(item[key])
    if (!result[group_key]) {
      result[group_key] = []
    }
    result[group_key].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Sorts array by a specified key
 * @param {T[]} array - the array to sort
 * @param {keyof T} key - the key to sort by
 * @param {"asc" | "desc"} order - sort order (ascending or descending)
 * @returns {T[]} sorted array
 */
export function sort_by<T>(array: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const a_val = a[key]
    const b_val = b[key]
    if (a_val < b_val) return order === "asc" ? -1 : 1
    if (a_val > b_val) return order === "asc" ? 1 : -1
    return 0
  })
}

// - Array Access Functions - \\
// - Utility functions for accessing array elements - \\

/**
 * Returns the first element of an array
 * @param {T[]} array - the array
 * @returns {T | undefined} first element or undefined
 */
export function first<T>(array: T[]): T | undefined {
  return array[0]
}

/**
 * Returns the last element of an array
 * @param {T[]} array - the array
 * @returns {T | undefined} last element or undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

// - Mathematical Array Operations - \\
// - Statistical and mathematical functions for numeric arrays - \\

/**
 * Calculates the sum of all numbers in an array
 * @param {number[]} numbers - array of numbers
 * @returns {number} sum of all numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

/**
 * Calculates the average of numbers in an array
 * @param {number[]} numbers - array of numbers
 * @returns {number} average value
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * Finds the minimum value in an array
 * @param {number[]} numbers - array of numbers
 * @returns {number} minimum value
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers)
}

/**
 * Finds the maximum value in an array
 * @param {number[]} numbers - array of numbers
 * @returns {number} maximum value
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers)
}

/**
 * Creates an array of numbers from start to end with a step
 * @param {number} start - start value
 * @param {number} end - end value (exclusive)
 * @param {number} step - step increment
 * @returns {number[]} array of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Creates an array with a value repeated count times
 * @param {T} value - value to repeat
 * @param {number} count - number of repetitions
 * @returns {T[]} array with repeated values
 */
export function repeat<T>(value: T, count: number): T[] {
  return Array(count).fill(value)
}

// - Set Operations - \\
// - Functions for set-like operations on arrays - \\

/**
 * Combines two arrays into an array of tuples
 * @param {T[]} array1 - first array
 * @param {U[]} array2 - second array
 * @returns {[T, U][]} array of tuples
 */
export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length)
  const result: [T, U][] = []
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]])
  }
  return result
}

/**
 * Returns elements common to both arrays
 * @param {T[]} array1 - first array
 * @param {T[]} array2 - second array
 * @returns {T[]} array of common elements
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter((item) => set2.has(item))
}

/**
 * Returns elements in array1 that are not in array2
 * @param {T[]} array1 - first array
 * @param {T[]} array2 - second array
 * @returns {T[]} array of different elements
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter((item) => !set2.has(item))
}

/**
 * Removes null and undefined values from an array
 * @param {(T | null | undefined)[]} array - array with potential null/undefined values
 * @returns {T[]} array with nullish values removed
 */
export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined)
}

/**
 * Counts elements that match a predicate
 * @param {T[]} array - the array to count from
 * @param {(item: T) => boolean} predicate - function to test elements
 * @returns {number} count of matching elements
 */
export function count<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.filter(predicate).length
}

/**
 * Splits array into two arrays based on a predicate
 * @param {T[]} array - the array to partition
 * @param {(item: T) => boolean} predicate - function to test elements
 * @returns {[T[], T[]]} tuple of [passing, failing] elements
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []
  for (const item of array) {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  }
  return [pass, fail]
}
