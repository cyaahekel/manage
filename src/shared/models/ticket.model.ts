// - TICKET DB MODELS - \\
export interface purchase_ticket_data {
  thread_id       : string
  owner_id        : string
  ticket_id       : string
  open_time       : number
  claimed_by?     : string
  staff           : string[]
  log_message_id? : string
}

export interface priority_ticket_data {
  thread_id       : string
  owner_id        : string
  ticket_id       : string
  open_time       : number
  claimed_by?     : string
  staff           : string[]
  log_message_id? : string
  issue_type      : string
  description     : string
}
