import { UserSelectMenuInteraction, ModalSubmitInteraction } from "discord.js"

// - MIDDLEMAN TRANSACTION RANGE MODEL - \\
export interface TransactionRange {
  label : string
  range : string
  fee   : string
}

// - MIDDLEMAN TRANSACTION DETAILS - \\
export interface TransactionDetails {
  penjual_id : string
  pembeli_id : string
  jenis      : string
  harga      : string
  fee_oleh   : string
}

// - OPEN MIDDLEMAN TICKET OPTIONS - \\
export interface OpenMiddlemanTicketOptions {
  interaction  : UserSelectMenuInteraction | ModalSubmitInteraction
  range_id     : string
  partner_id   : string
  transaction? : TransactionDetails
}

// - OPEN MIDDLEMAN TICKET RESULT - \\
export interface OpenMiddlemanTicketResult {
  success  : boolean
  message? : string
  error?   : string
}
