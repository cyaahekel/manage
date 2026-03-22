/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

import { UserSelectMenuInteraction, ModalSubmitInteraction } from "discord.js"

// - 中间人交易范围模型 - \\
// - middleman transaction range model - \\
export interface TransactionRange {
  label : string
  range : string
  fee   : string
}

// - 中间人交易详情 - \\
// - middleman transaction details - \\
export interface TransactionDetails {
  penjual_id : string
  pembeli_id : string
  jenis      : string
  harga      : string
  fee_oleh   : string
}

// - 开苦中间人工单的选项 - \\
// - open middleman ticket options - \\
export interface OpenMiddlemanTicketOptions {
  interaction  : UserSelectMenuInteraction | ModalSubmitInteraction
  range_id     : string
  partner_id   : string
  transaction? : TransactionDetails
}

// - 开苦中间人工单的结果 - \\
// - open middleman ticket result - \\
export interface OpenMiddlemanTicketResult {
  success  : boolean
  message? : string
  error?   : string
}
