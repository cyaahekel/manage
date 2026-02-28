export interface prodete_entry {
  rank              : number
  user_id           : string
  username          : string
  msg_count         : number
  claim_count       : number
  answer_count      : number
  total             : number
  percentage        : string
  channel_breakdown : Record<string, number>
  ticket_breakdown  : Record<string, number>
  answer_breakdown  : Record<string, number>
}

export interface prodete_report {
  slug         : string
  from_date    : string
  to_date      : string
  entries      : prodete_entry[]
  generated_by : string
  generated_at : number
}

// - HUMAN-READABLE CHANNEL LABELS (KEEP IN SYNC WITH CONTROLLER) - \\
export const channel_labels: Record<string, string> = {
  "1351969499116736602" : "staff-general",
  "1398761098852958239" : "mod-chat",
  "1319275642277199902" : "staff-discussion",
  "1446809167942910043" : "daily-report",
  "1291781831775092847" : "admin-chat",
  "1398318499658600529" : "escalation",
}
