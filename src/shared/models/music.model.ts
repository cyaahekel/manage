/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - 音乐模块的数据模型定义 - \\
// - data model definitions for the music module - \\

export interface track_data {
  encoded      : string
  title        : string
  author       : string
  duration     : number        // - duration in ms - \\
  uri          : string        // - resolved youtube URL - \\
  artwork_url  : string | null
  requester_id : string
  source_url   : string        // - original URL that the user provided - \\
}

export interface guild_queue {
  tracks           : track_data[]
  is_playing       : boolean
  is_paused        : boolean
  text_channel_id  : string
  voice_channel_id : string
  loop             : boolean
  idle_timer       : NodeJS.Timeout | null
}

export interface spotify_token_cache {
  token      : string
  expires_at : number
}

export interface lavalink_track_info {
  identifier : string
  isSeekable : boolean
  author     : string
  length     : number
  isStream   : boolean
  position   : number
  title      : string
  uri        : string | null
  artworkUrl : string | null
  sourceName : string
}

export interface lavalink_track {
  encoded    : string
  info       : lavalink_track_info
  pluginInfo : unknown
  userData   : unknown
}

export interface lavalink_playlist {
  name      : string
  tracks    : lavalink_track[]
  pluginInfo: unknown
  info      : unknown
}

export interface lavalink_response {
  loadType : "track" | "playlist" | "search" | "empty" | "error"
  data     : lavalink_track | lavalink_track[] | lavalink_playlist | null | { message: string; severity: string; cause: string }
}
