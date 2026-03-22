/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Lorem ipsum dolor sit amet, consectetur adipiscing elit. - \\

/**
 * Returns unique elements from an array
 * @param {T[]} arr - array to process
 * @returns {T[]} array with duplicates removed
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * Flattens a nested array by one level
 * @param {T[][]} arr - nested array
 * @returns {T[]} flattened array
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat()
}

/**
 * Recursively flattens a deeply nested array
 * @param {any[]} arr - deeply nested array
 * @returns {T[]} completely flattened array
 */
export function deep_flatten<T>(arr: any[]): T[] {
  return arr.flat(Infinity) as T[]
}

/**
 * Splits an array into chunks of specified size
 * @param {T[]} arr - array to chunk
 * @param {number} size - size of each chunk
 * @returns {T[][]} array of chunks
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

// - Grouping and Counting - \\
// - Functions for organizing and aggregating data - \\

/**
 * Groups array elements by a key function
 * @param {T[]} arr - array to group
 * @param {(item: T) => K} key - function to extract grouping key
 * @returns {Record<K, T[]>} object with grouped arrays
 */
export function group_by<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {} as Record<K, T[]>)
}

/**
 * Counts occurrences of items grouped by a key function
 * @param {T[]} arr - array to count
 * @param {(item: T) => K} key - function to extract counting key
 * @returns {Record<K, number>} object with counts
 */
export function count_by<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, number> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<K, number>)
}

/**
 * Sorts an array by a key function
 * @param {T[]} arr - array to sort
 * @param {(item: T) => number | string} key - function to extract sort key
 * @param {boolean} desc - sort in descending order
 * @returns {T[]} sorted array
 */
export function sort_by<T>(arr: T[], key: (item: T) => number | string, desc: boolean = false): T[] {
  return [...arr].sort((a, b) => {
    const va = key(a)
    const vb = key(b)
    if (va < vb) return desc ? 1 : -1
    if (va > vb) return desc ? -1 : 1
    return 0
  })
}

/**
 * Finds an element by key-value pair
 * @param {T[]} arr - array to search
 * @param {K} key - property key to match
 * @param {T[K]} value - value to match
 * @returns {T | undefined} found element or undefined
 */
export function find_by<T, K extends keyof T>(arr: T[], key: K, value: T[K]): T | undefined {
  return arr.find((item) => item[key] === value)
}

/**
 * Filters elements by key-value pair
 * @param {T[]} arr - array to filter
 * @param {K} key - property key to match
 * @param {T[K]} value - value to match
 * @returns {T[]} filtered array
 */
export function filter_by<T, K extends keyof T>(arr: T[], key: K, value: T[K]): T[] {
  return arr.filter((item) => item[key] === value)
}

// - Array Modification - \\
// - Functions for adding, removing, and manipulating array elements - \\

/**
 * Removes an item from an array
 * @param {T[]} arr - source array
 * @param {T} item - item to remove
 * @returns {T[]} new array without the item
 */
export function remove<T>(arr: T[], item: T): T[] {
  return arr.filter((i) => i !== item)
}

/**
 * Removes an item at a specific index
 * @param {T[]} arr - source array
 * @param {number} index - index to remove
 * @returns {T[]} new array without the element at index
 */
export function remove_at<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

/**
 * Inserts an item at a specific index
 * @param {T[]} arr - source array
 * @param {number} index - index to insert at
 * @param {T} item - item to insert
 * @returns {T[]} new array with item inserted
 */
export function insert_at<T>(arr: T[], index: number, item: T): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index)]
}

/**
 * Replaces an item at a specific index
 * @param {T[]} arr - source array
 * @param {number} index - index to replace
 * @param {T} item - new item
 * @returns {T[]} new array with item replaced
 */
export function replace_at<T>(arr: T[], index: number, item: T): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index + 1)]
}

/**
 * Swaps two elements in an array
 * @param {T[]} arr - source array
 * @param {number} i - first index
 * @param {number} j - second index
 * @returns {T[]} new array with elements swapped
 */
export function swap<T>(arr: T[], i: number, j: number): T[] {
  const result = [...arr]
  ;[result[i], result[j]] = [result[j], result[i]]
  return result
}

/**
 * Moves an element from one index to another
 * @param {T[]} arr - source array
 * @param {number} from - source index
 * @param {number} to - destination index
 * @returns {T[]} new array with element moved
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

/**
 * Returns the first element of an array
 * @param {T[]} arr - source array
 * @returns {T | undefined} first element or undefined
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

/**
 * Returns the last element of an array
 * @param {T[]} arr - source array
 * @returns {T | undefined} last element or undefined
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

/**
 * Takes the first n elements from an array
 * @param {T[]} arr - source array
 * @param {number} n - number of elements to take
 * @returns {T[]} first n elements
 */
export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n)
}

/**
 * Takes the last n elements from an array
 * @param {T[]} arr - source array
 * @param {number} n - number of elements to take
 * @returns {T[]} last n elements
 */
export function take_last<T>(arr: T[], n: number): T[] {
  return arr.slice(-n)
}

/**
 * Drops the first n elements from an array
 * @param {T[]} arr - source array
 * @param {number} n - number of elements to drop
 * @returns {T[]} array without first n elements
 */
export function drop<T>(arr: T[], n: number): T[] {
  return arr.slice(n)
}

/**
 * Drops the last n elements from an array
 * @param {T[]} arr - source array
 * @param {number} n - number of elements to drop
 * @returns {T[]} array without last n elements
 */
export function drop_last<T>(arr: T[], n: number): T[] {
  return arr.slice(0, -n)
}

/**
 * Creates a range of numbers
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
 * Combines two arrays into an array of tuples
 * @param {T[]} a - first array
 * @param {U[]} b - second array
 * @returns {[T, U][]} array of tuples
 */
export function zip<T, U>(a: T[], b: U[]): [T, U][] {
  const len = Math.min(a.length, b.length)
  const result: [T, U][] = []
  for (let i = 0; i < len; i++) {
    result.push([a[i], b[i]])
  }
  return result
}

/**
 * Separates an array of tuples into two arrays
 * @param {[T, U][]} arr - array of tuples
 * @returns {[T[], U[]]} tuple of two arrays
 */
export function unzip<T, U>(arr: [T, U][]): [T[], U[]] {
  const a: T[] = []
  const b: U[] = []
  for (const [t, u] of arr) {
    a.push(t)
    b.push(u)
  }
  return [a, b]
}

// - Set Operations - \\
// - Mathematical set operations on arrays - \\

/**
 * Returns the intersection of two arrays
 * @param {T[]} a - first array
 * @param {T[]} b - second array
 * @returns {T[]} elements common to both arrays
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b)
  return a.filter((item) => set.has(item))
}

/**
 * Returns the difference between two arrays
 * @param {T[]} a - first array
 * @param {T[]} b - second array
 * @returns {T[]} elements in a but not in b
 */
export function difference<T>(a: T[], b: T[]): T[] {
  const set = new Set(b)
  return a.filter((item) => !set.has(item))
}

/**
 * Returns the union of two arrays
 * @param {T[]} a - first array
 * @param {T[]} b - second array
 * @returns {T[]} all unique elements from both arrays
 */
export function union<T>(a: T[], b: T[]): T[] {
  return unique([...a, ...b])
}

/**
 * Checks if two arrays are equal
 * @param {T[]} a - first array
 * @param {T[]} b - second array
 * @returns {boolean} true if arrays are equal
 */
export function is_equal<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, i) => item === b[i])
}

/**
 * Checks if one array is a subset of another
 * @param {T[]} subset - potential subset array
 * @param {T[]} superset - potential superset array
 * @returns {boolean} true if subset is contained in superset
 */
export function is_subset<T>(subset: T[], superset: T[]): boolean {
  const set = new Set(superset)
  return subset.every((item) => set.has(item))
}

/**
 * @param {number[]} arr - source array
 * @returns {number} sum of elements
 */
export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

/**
 * @param {number[]} arr - source array
 * @returns {number} average value or 0 when empty
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0
  return sum(arr) / arr.length
}

/**
 * @param {number[]} arr - source array
 * @returns {number} minimum value
 */
export function min(arr: number[]): number {
  return Math.min(...arr)
}

/**
 * @param {number[]} arr - source array
 * @returns {number} maximum value
 */
export function max(arr: number[]): number {
  return Math.max(...arr)
}

/**
 * @param {number[]} arr - source array
 * @returns {number} median value or 0 when empty
 */
export function median(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid    = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
