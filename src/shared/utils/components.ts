/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Discord component v2 builder utilities - \\

export enum component_type {
  action_row = 1,
  button = 2,
  string_select = 3,
  text_input = 4,
  user_select = 5,
  role_select = 6,
  mentionable_select = 7,
  channel_select = 8,
  section = 9,
  text = 10,
  thumbnail = 11,
  media_gallery = 12,
  file = 13,
  divider = 14,
  separator = 14,
  content_inventory_entry = 16,
  container = 17,
}

export enum button_style {
  primary = 1,
  secondary = 2,
  success = 3,
  danger = 4,
  link = 5,
}

export interface button_component {
  type: number
  style: number
  label: string
  custom_id?: string
  url?: string
  emoji?: { id?: string; name: string }
  disabled?: boolean
}

export interface action_row_component {
  type: number
  components: button_component[] | select_menu_component[]
}

export interface select_option {
  label: string
  value: string
  description?: string
  emoji?: { id?: string; name: string }
  default?: boolean
}

export interface select_menu_component {
  type: number
  custom_id: string
  placeholder?: string
  options?: select_option[]
  min_values?: number
  max_values?: number
}

export interface thumbnail_component {
  type: number
  media: { url: string }
}

export interface text_component {
  type: number
  content: string
}

export interface section_component {
  type: number
  components: text_component[]
  accessory?: thumbnail_component | button_component
}

export interface divider_component {
  type: number
  spacing?: number
  divider?: boolean
}

export interface container_component {
  type: number
  components: (section_component | text_component | divider_component | action_row_component)[]
  accent_color?: number | { r: number; g: number; b: number } | null
  spoiler?: boolean
}

export interface message_payload {
  flags?: number
  content?: string
  components: (container_component | text_component | file_component)[]
}

/**
 * @param {string} label - button label
 * @param {string} custom_id - custom identifier
 * @param {{ id?: string; name: string }} emoji - optional emoji
 * @param {boolean} disabled - whether button is disabled
 * @returns {button_component} primary styled button
 */
export function primary_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.primary,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - button label
 * @param {string} custom_id - custom identifier
 * @param {{ id?: string; name: string }} emoji - optional emoji
 * @param {boolean} disabled - whether button is disabled
 * @returns {button_component} secondary styled button
 */
export function secondary_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.secondary,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - button label
 * @param {string} custom_id - custom identifier
 * @param {{ id?: string; name: string }} emoji - optional emoji
 * @param {boolean} disabled - whether button is disabled
 * @returns {button_component} success styled button
 */
export function success_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.success,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - button label
 * @param {string} custom_id - custom identifier
 * @param {{ id?: string; name: string }} emoji - optional emoji
 * @param {boolean} disabled - whether button is disabled
 * @returns {button_component} danger styled button
 */
export function danger_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.danger,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - button label
 * @param {string} url - link URL
 * @param {{ id?: string; name: string }} emoji - optional emoji
 * @param {boolean} disabled - whether button is disabled
 * @returns {button_component} link styled button
 */
export function link_button(label: string, url: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.link,
    label,
    url,
    emoji,
    disabled,
  }
}

/**
 * - 创建操作行 - \\
 * - create action row - \\
 * 
 * @param {...button_component[]} components - buttons to include in action row
 * @returns {action_row_component} action row component
 */
export function action_row(...components: button_component[]): action_row_component {
  return {
    type: component_type.action_row,
    components,
  }
}

/**
 * - 创建下拉选单 - \\
 * - create select menu - \\
 * 
 * @param {string} custom_id - custom identifier
 * @param {string} placeholder - placeholder text
 * @param {select_option[]} options - select options
 * @returns {action_row_component} select menu in action row
 */
export function select_menu(custom_id: string, placeholder: string, options: select_option[]): action_row_component {
  return {
    type: component_type.action_row,
    components: [
      {
        type: component_type.string_select,
        custom_id,
        placeholder,
        options,
      },
    ],
  }
}

export interface user_select_component {
  type: number
  custom_id: string
  placeholder: string
  min_values?: number
  max_values?: number
}

/**
 * - 创建用户选择菜单 - \\
 * - create user select menu - \\
 * 
 * @param {string} custom_id - custom identifier
 * @param {string} placeholder - placeholder text
 * @returns {action_row_component} user select menu in action row
 */
export function user_select(custom_id: string, placeholder: string): action_row_component {
  return {
    type: component_type.action_row,
    components: [
      {
        type: component_type.user_select,
        custom_id,
        placeholder,
      },
    ],
  }
}

/**
 * - 创建缩略图组件 - \\
 * - create thumbnail component - \\
 * 
 * @param {string} url - image URL
 * @returns {thumbnail_component} thumbnail component
 */
export function thumbnail(url: string): thumbnail_component {
  return {
    type: component_type.thumbnail,
    media: { url },
  }
}

/**
 * - 创建文本组件 - \\
 * - create text component - \\
 * 
 * @param {string | string[]} content - text content
 * @returns {text_component} text component
 */
export function text(content: string | string[]): text_component {
  return {
    type: component_type.text,
    content: Array.isArray(content) ? content.join("\n") : content,
  }
}

/**
 * - 创建区块组件 - \\
 * - create section component - \\
 * Supports accessory as button or thumbnail
 * 
 * @param {object} options - section options
 * @param {string | string[]} options.content - section content
 * @param {string} options.thumbnail - optional thumbnail URL (fallback)
 * @param {string} options.media - optional media URL (fallback)
 * @param {thumbnail_component | button_component} options.accessory - optional accessory (button or thumbnail)
 * @returns {section_component} section component with optional accessory
 * 
 * @example
 * // Section with thumbnail
 * section({ 
 *   content: "Hello World", 
 *   thumbnail: "https://example.com/image.png" 
 * })
 * 
 * @example
 * // Section with button accessory
 * section({ 
 *   content: "Click the button", 
 *   accessory: secondary_button("Click Me", "btn_id") 
 * })
 */
export function section(options: {
  content: string | string[];
  thumbnail?: string;
  media?: string;
  accessory?: thumbnail_component | button_component;
}): section_component {
  const result: section_component = {
    type: component_type.section,
    components: [text(options.content)],
  }

  // - 处理显式配件（按鈕或媒体） - \\
  // - handle explicit accessory (button or media) - \\
  if (options.accessory) {
    if (
      (options.accessory.type === component_type.thumbnail && (options.accessory as any).media?.url) ||
      (options.accessory.type === component_type.button)
    ) {
      result.accessory = options.accessory
    }
  }
  // - 回退到媒体/缩略图 - \\
  // - fallback to media/thumbnail - \\
  else {
    const media_url = options.media || options.thumbnail

    if (media_url && typeof media_url === "string" && media_url.trim().length > 0 && media_url.startsWith("http")) {
      result.accessory = thumbnail(media_url)
    }
  }

  return result
}

/**
 * - 创建分隔线组件 - \\
 * - create divider component - \\
 * 
 * @param {number} spacing - optional spacing (1-4)
 * @returns {divider_component} divider component
 */
export function divider(spacing?: number): divider_component {
  const result: divider_component = {
    type: component_type.divider,
  }

  if (spacing !== undefined) {
    result.spacing = spacing
  }

  return result
}

/**
 * - 创建分隔符（分隔线别名） - \\
 * - create separator (alias for divider) - \\
 * 
 * @param {number} spacing - optional spacing (1-4)
 * @returns {divider_component} divider component
 */
export function separator(spacing?: number): divider_component {
  return divider(spacing)
}

/**
 * - 创建容器组件 - \\
 * - create container component - \\
 * 
 * @param {object} options - container options
 * @param {array} options.components - components to include in container
 * @param {number | object} options.accent_color - optional accent color
 * @param {boolean} options.spoiler - optional spoiler flag
 * @returns {container_component} container component
 */
export function container(options: {
  components: (section_component | text_component | divider_component | action_row_component)[]
  accent_color?: number | { r: number; g: number; b: number } | null
  spoiler?: boolean
}): container_component {
  let processed_color = options.accent_color

  if (
    options.accent_color &&
    typeof options.accent_color === "object" &&
    "r" in options.accent_color &&
    "g" in options.accent_color &&
    "b" in options.accent_color
  ) {
    processed_color = (options.accent_color.r << 16) | (options.accent_color.g << 8) | options.accent_color.b
  }

  return {
    type: component_type.container,
    components: options.components,
    accent_color: processed_color as number | null | undefined,
    spoiler: options.spoiler,
  }
}

/**
 * - 构建消息载荷 - \\
 * - build message payload - \\
 * 
 * @param {object} options - message options
 * @param {array} options.components - message components
 * @param {string} options.content - optional text content
 * @returns {message_payload} complete message payload
 */
export function build_message(options: {
  components: (container_component | text_component)[]
  content?: string
}): message_payload {
  return {
    flags: 32768,
    content: options.content,
    components: options.components,
  }
}

/**
 * - 创建表情对象 - \\
 * - create emoji object - \\
 * 
 * @param {string} name - emoji name
 * @param {string} id - optional emoji ID for custom emojis
 * @returns {object} emoji object
 */
export function emoji_object(name: string, id?: string): { id?: string; name: string } {
  return id ? { id, name } : { name }
}

export interface gallery_item {
  media: { url: string }
  description?: string
  spoiler?: boolean
}

export interface media_gallery_component {
  type: number
  items: gallery_item[]
}

/**
 * - 创建媒体画廘 - \\
 * - create media gallery - \\
 * 
 * @param {gallery_item[]} items - gallery items
 * @returns {media_gallery_component} media gallery component
 */
export function media_gallery(items: gallery_item[]): media_gallery_component {
  return {
    type: component_type.media_gallery,
    items,
  }
}

/**
 * - 创建画廘项目 - \\
 * - create gallery item - \\
 * 
 * @param {string} url - media URL
 * @param {string} description - optional description
 * @param {boolean} spoiler - optional spoiler flag
 * @returns {gallery_item} gallery item
 */
export function gallery_item(url: string, description?: string, spoiler?: boolean): gallery_item {
  return {
    media: { url },
    description,
    spoiler,
  }
}

/**
 * - 将十六进制颜色转换为数字 - \\
 * - convert hex color to number - \\
 * 
 * @param {string} hex - hex color code (e.g., "#FF0000")
 * @returns {number} color as number
 */
export function from_hex(hex: string): number {
  const cleaned = hex.replace(/^#/, "")
  return parseInt(cleaned, 16)
}

export interface file_component {
  type: number
  file: { url: string }
}

/**
 * - 创建文件组件 - \\
 * - create file component - \\
 * 
 * @param {string} url - file URL
 * @returns {file_component} file component
 */
export function file(url: string): file_component {
  return {
    type: component_type.file,
    file: { url },
  }
}
