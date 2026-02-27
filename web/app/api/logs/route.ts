
import { NextResponse } from "next/server"
import { db } from "@shared/utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bot_name, level, message } = body

    if (!bot_name || !level || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // - ENSURE DB CONNECTION - \\
    if (!db.is_connected()) {
      await db.connect()
    }

    await db.get_pool().query(
      `INSERT INTO bot_logs (bot_name, level, message) VALUES ($1, $2, $3)`,
      [bot_name, level, message]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ - API LOGS - ] Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // - ENSURE DB CONNECTION - \\
    if (!db.is_connected()) {
      await db.connect()
    }

    // - GET LATEST 100 LOGS - \\
    const result = await db.get_pool().query(
      `SELECT * FROM bot_logs ORDER BY created_at DESC LIMIT 100`
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[ - API LOGS - ] Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
