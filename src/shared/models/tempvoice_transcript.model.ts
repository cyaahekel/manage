/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - 临时语音频道聊天记录数据模型 - \\
// - tempvoice chat transcript data model - \\

export interface tempvoice_transcript_message {
  id             : string
  author_id      : string
  author_tag     : string
  author_avatar  : string
  content        : string
  attachments    : tempvoice_attachment[]
  timestamp      : number
  is_bot         : boolean
}

export interface tempvoice_attachment {
  url          : string
  filename     : string
  size         : number
  content_type : string | null
}

export interface tempvoice_transcript_data {
  transcript_id  : string
  channel_id     : string
  channel_name   : string
  owner_id       : string
  owner_tag      : string
  guild_id       : string
  messages       : tempvoice_transcript_message[]
  created_at     : number
  deleted_at     : number
  duration_seconds : number
  total_visitors : number
}
