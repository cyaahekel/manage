/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Environment Variable Utilities - \\
// - Type-safe environment variable access and parsing - \\

/**
 * Gets an environment variable with optional fallback
 * @param {string} key - environment variable name
 * @param {string} fallback - default value if not found
 * @returns {string} environment variable value or fallback
 */
export function get(key: string, fallback?: string): string {
  return process.env[key] ?? fallback ?? ""
}

/**
 * Gets a required environment variable or throws error
 * @param {string} key - environment variable name
 * @returns {string} environment variable value
 * @throws {Error} If environment variable is not set
 */
export function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required env: ${key}`)
  return value
}

/**
 * Parses an environment variable as integer
 * @param {string} key - environment variable name
 * @param {number} fallback - default value if not found or invalid
 * @returns {number} parsed integer value
 */
export function int(key: string, fallback: number = 0): number {
  const value = process.env[key]
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Parses an environment variable as float
 * @param {string} key - environment variable name
 * @param {number} fallback - default value if not found or invalid
 * @returns {number} parsed float value
 */
export function float(key: string, fallback: number = 0): number {
  const value = process.env[key]
  if (!value) return fallback
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Parses an environment variable as boolean
 * @param {string} key - environment variable name
 * @param {boolean} fallback - default value if not found
 * @returns {boolean} parsed boolean value
 */
export function bool(key: string, fallback: boolean = false): boolean {
  const value = process.env[key]?.toLowerCase()
  if (!value) return fallback
  return ["true", "1", "yes", "on"].includes(value)
}

/**
 * Parses an environment variable as array
 * @param {string} key - environment variable name
 * @param {string} separator - separator character for splitting
 * @returns {string[]} array of trimmed values
 */
export function array(key: string, separator: string = ","): string[] {
  const value = process.env[key]
  if (!value) return []
  return value.split(separator).map((s) => s.trim()).filter(Boolean)
}

/**
 * Parses an environment variable as JSON
 * @param {string} key - environment variable name
 * @param {T} fallback - default value if not found or invalid JSON
 * @returns {T | undefined} parsed JSON value
 */
export function json<T>(key: string, fallback?: T): T | undefined {
  const value = process.env[key]
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

// - Environment Detection - \\
// - Functions for detecting the current environment - \\

/**
 * Checks if running in production environment
 * @returns {boolean} true if NODE_ENV is production
 */
export function is_production(): boolean {
  return process.env.NODE_ENV === "production"
}

/**
 * Checks if running in development environment
 * @returns {boolean} true if NODE_ENV is development or not set
 */
export function is_development(): boolean {
  return process.env.NODE_ENV === "development" || !process.env.NODE_ENV
}

/**
 * Checks if running in test environment
 * @returns {boolean} true if NODE_ENV is test
 */
export function is_test(): boolean {
  return process.env.NODE_ENV === "test"
}

/**
 * Gets the current NODE_ENV value
 * @returns {string} current environment name
 */
export function node_env(): string {
  return process.env.NODE_ENV ?? "development"
}
