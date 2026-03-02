import { Client, Guild, GuildMember } from "discord.js"

// - QUARANTINE CONTROLLER OPTION INTERFACES - \\
export interface quarantine_member_options {
  client   : Client
  guild    : Guild
  executor : GuildMember
  target   : GuildMember
  days     : number
  reason   : string
}

export interface release_quarantine_options {
  client  : Client
  guild   : Guild
  user_id : string
}
