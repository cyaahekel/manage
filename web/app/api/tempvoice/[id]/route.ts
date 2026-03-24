/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

import { NextRequest, NextResponse }        from "next/server"
import { get_tempvoice_transcript }         from "@/lib/db"
import { check_session, is_valid_uuid }     from "@/lib/utils/auth"

/**
 * @description GET /api/tempvoice/[id] — fetch a tempvoice transcript.
 * requires valid session + owner_id match.
 * @param req - incoming request
 * @param context - route params
 * @returns transcript JSON or error
 */
export async function GET(
  req     : NextRequest,
  context : { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id || !is_valid_uuid(id)) {
    return NextResponse.json({ error: "invalid transcript id" }, { status: 400 })
  }

  const user = await check_session(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const transcript = await get_tempvoice_transcript(id)
  if (!transcript) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  // - owner のみ閲覧可能 - \\
  // - only the channel owner can view - \\
  if (transcript.owner_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  return NextResponse.json(transcript)
}
