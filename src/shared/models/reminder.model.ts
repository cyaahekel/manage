import { Client } from "discord.js"

// - REMINDER DB MODEL - \\
export interface reminder_data {
  _id?       : any
  user_id    : string
  note       : string
  remind_at  : number
  created_at : number
  guild_id?  : string
}

// - CONTROLLER OPTION INTERFACES - \\
export interface reminder_list_options {
  user_id: string
  client : Client
}

export interface add_reminder_options {
  user_id   : string
  client    : Client
  minutes   : number
  note      : string
  guild_id? : string
}

export interface cancel_reminder_options {
  user_id    : string
  client     : Client
  remind_at? : number
}
