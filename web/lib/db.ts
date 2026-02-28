import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/**
 * Returns total bypassed link count.
 * @returns Total count as number
 */
export async function get_bypass_count(): Promise<number> {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT total_count FROM bypass_stats LIMIT 1')
    return Number(result.rows[0]?.total_count ?? 87000)
  } finally {
    client.release()
  }
}

/**
 * Increments total bypassed link count by 1.
 * @returns Updated total count
 */
export async function increment_bypass_count(): Promise<number> {
  const client = await pool.connect()
  try {
    const result = await client.query(`
      UPDATE bypass_stats
      SET total_count = total_count + 1, updated_at = NOW()
      RETURNING total_count
    `)
    return Number(result.rows[0]?.total_count ?? 87000)
  } finally {
    client.release()
  }
}

export async function get_transcript(transcript_id: string) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'SELECT * FROM ticket_transcripts WHERE transcript_id = $1',
      [transcript_id]
    )
    
    if (result.rows.length === 0) return null
    
    const row = result.rows[0]
    return {
      transcript_id: row.transcript_id,
      ticket_id: row.ticket_id,
      ticket_type: row.ticket_type,
      thread_id: row.thread_id,
      owner_id: row.owner_id,
      owner_tag: row.owner_tag,
      claimed_by: row.claimed_by,
      closed_by: row.closed_by,
      issue_type: row.issue_type,
      description: row.description,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      open_time: parseInt(row.open_time),
      close_time: parseInt(row.close_time),
    }
  } finally {
    client.release()
  }
}
