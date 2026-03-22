/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Discord markdown and formatting utilities - \\

/**
 * @param {string} text - text to format
 * @returns {string} inline code formatted text
 */
export function code(text: string): string {
  return `\`${text}\``
}

/**
 * @param {string} text - code content
 * @param {string} language - optional syntax highlighting language
 * @returns {string} code block formatted text
 */
export function code_block(text: string, language?: string): string {
  return `\`\`\`${language || ""}\n${text}\n\`\`\``
}

/**
 * @param {string} text - text to format
 * @returns {string} bold formatted text
 */
export function bold(text: string): string {
  return `**${text}**`
}

/**
 * @param {string} text - text to format
 * @returns {string} italic formatted text
 */
export function italic(text: string): string {
  return `*${text}*`
}

/**
 * @param {string} text - text to format
 * @returns {string} underlined text
 */
export function underline(text: string): string {
  return `__${text}__`
}

/**
 * @param {string} text - text to format
 * @returns {string} strikethrough formatted text
 */
export function strikethrough(text: string): string {
  return `~~${text}~~`
}

/**
 * @param {string} text - text to hide
 * @returns {string} spoiler formatted text
 */
export function spoiler(text: string): string {
  return `||${text}||`
}

/**
 * @param {string} text - text to quote
 * @returns {string} single line quote
 */
export function quote(text: string): string {
  return `> ${text}`
}

/**
 * @param {string} text - text to quote
 * @returns {string} block quote
 */
export function block_quote(text: string): string {
  return `>>> ${text}`
}

/**
 * @param {string} text - heading text
 * @param {1 | 2 | 3} level - heading level
 * @returns {string} formatted heading
 */
export function heading(text: string, level: 1 | 2 | 3 = 1): string {
  return `${"#".repeat(level)} ${text}`
}

/**
 * @param {string} text - text for subtext
 * @returns {string} subtext formatted text
 */
export function subtext(text: string): string {
  return `-# ${text}`
}

/**
 * @param {string} text - link text
 * @param {string} url - link URL
 * @returns {string} markdown link
 */
export function link(text: string, url: string): string {
  return `[${text}](${url})`
}

/**
 * @param {string} text - link text
 * @param {string} url - link URL
 * @returns {string} masked markdown link
 */
export function masked_link(text: string, url: string): string {
  return `[${text}](<${url}>)`
}

/**
 * @param {string} user_id - discord user ID
 * @returns {string} user mention
 */
export function user_mention(user_id: string): string {
  return `<@${user_id}>`
}

/**
 * @param {string} role_id - discord role ID
 * @returns {string} role mention
 */
export function role_mention(role_id: string): string {
  return `<@&${role_id}>`
}

/**
 * @param {string} channel_id - discord channel ID
 * @returns {string} channel mention
 */
export function channel_mention(channel_id: string): string {
  return `<#${channel_id}>`
}

/**
 * @param {string} name - command name
 * @param {string} id - command ID
 * @returns {string} slash command mention
 */
export function slash_command(name: string, id: string): string {
  return `</${name}:${id}>`
}

/**
 * @param {string} guild_id - discord guild ID
 * @param {string} channel_id - discord channel ID
 * @returns {string} channel URL
 */
export function channel_url(guild_id: string, channel_id: string): string {
  return `https://discord.com/channels/${guild_id}/${channel_id}`
}

/**
 * @param {string} guild_id - discord guild ID
 * @param {string} channel_id - discord channel ID
 * @param {string} message_id - discord message ID
 * @returns {string} message URL
 */
export function message_url(guild_id: string, channel_id: string, message_id: string): string {
  return `https://discord.com/channels/${guild_id}/${channel_id}/${message_id}`
}

/**
 * @param {string} name - emoji name
 * @param {string} id - emoji ID
 * @param {boolean} animated - whether emoji is animated
 * @returns {string} discord emoji format
 */
export function emoji(name: string, id: string, animated?: boolean): string {
  return animated ? `<a:${name}:${id}>` : `<:${name}:${id}>`
}

/**
 * @param {string} name - emoji name
 * @param {string} id - optional emoji ID
 * @returns {{ name: string; id?: string }} emoji object
 */
export function emoji_object(name: string, id?: string): { name: string; id?: string } {
  return { name, id }
}

/**
 * @param {...string} lines - lines to join
 * @returns {string} joined lines with newlines
 */
export function join_lines(...lines: string[]): string {
  return lines.join("\n")
}

/**
 * @param {string[]} items - list items
 * @returns {string} bullet point list
 */
export function bullet_list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n")
}

/**
 * @param {string[]} items - list items
 * @returns {string} numbered list
 */
export function numbered_list(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n")
}

/**
 * @param {string} text - text to truncate
 * @param {number} max_length - maximum length
 * @param {string} suffix - suffix to add when truncated
 * @returns {string} truncated text
 */
export function truncate(text: string, max_length: number, suffix: string = "..."): string {
  if (text.length <= max_length) return text
  return text.slice(0, max_length - suffix.length) + suffix
}

/**
 * @param {string} text - text to capitalize
 * @returns {string} capitalized text
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * @param {string} text - text to convert
 * @returns {string} title case text
 */
export function title_case(text: string): string {
  return text.split(" ").map(capitalize).join(" ")
}

/**
 * @param {number} count - count of items
 * @param {string} singular - singular form
 * @param {string} plural_form - optional plural form
 * @returns {string} singular or plural form based on count
 */
export function plural(count: number, singular: string, plural_form?: string): string {
  return count === 1 ? singular : (plural_form || singular + "s")
}

/**
 * @param {number} n - number to format
 * @returns {string} ordinal number string
 */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * @param {number} n - number to format
 * @returns {string} formatted number with commas
 */
export function format_number(n: number): string {
  return n.toLocaleString()
}

/**
 * @param {number} bytes - bytes to format
 * @param {number} decimals - decimal places
 * @returns {string} formatted byte size
 */
export function format_bytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
}

/**
 * @param {number} ms - milliseconds to format
 * @returns {string} human readable duration
 */
export function format_duration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * @param {number} current - current progress value
 * @param {number} max - maximum value
 * @param {number} length - progress bar character length
 * @returns {string} progress bar string
 */
export function progress_bar(current: number, max: number, length: number = 10): string {
  const filled = Math.round((current / max) * length)
  const empty = length - filled
  return "█".repeat(filled) + "░".repeat(empty)
}

/**
 * @param {string[]} headers - table headers
 * @param {string[][]} rows - table rows
 * @returns {string} formatted table
 */
export function table(headers: string[], rows: string[][]): string {
  const col_widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i]?.length || 0)))
  const header_row = headers.map((h, i) => h.padEnd(col_widths[i])).join(" | ")
  const separator = col_widths.map((w) => "-".repeat(w)).join("-+-")
  const data_rows = rows.map((r) => r.map((c, i) => (c || "").padEnd(col_widths[i])).join(" | "))
  return [header_row, separator, ...data_rows].join("\n")
}

export const default_avatar = "https://cdn.discordapp.com/embed/avatars/0.png"
export const logo_url = "https://github.com/bimoraa/Euphoria/blob/main/aaaaa.png?raw=true"
