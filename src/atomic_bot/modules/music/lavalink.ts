/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

// - Lavalink/Shoukaku 客户端单例，全局唯一 - \\
// - Lavalink/Shoukaku client singleton, globally unique - \\
import { Shoukaku, Connectors } from "shoukaku"
import { Client }               from "discord.js"

let __shoukaku: Shoukaku | null = null

/**
 * @description initializes the Shoukaku Lavalink client and attaches it to the Discord client.
 *              Must be called once after the Discord client is created.
 * @param {Client} client - discord.js client instance
 * @returns {Shoukaku} shoukaku instance
 */
export function init_shoukaku(client: Client): Shoukaku {
  const host     = process.env.LAVALINK_HOST     ?? "localhost"
  const port     = process.env.LAVALINK_PORT     ?? "2333"
  const password = process.env.LAVALINK_PASSWORD ?? "youshallnotpass"

  __shoukaku = new Shoukaku(
    new Connectors.DiscordJS(client as any),
    [{ name: "main", url: `${host}:${port}`, auth: password }],
    {
      reconnectTries   : 3,
      reconnectInterval: 5000,
      moveOnDisconnect : false,
      resume           : false,
      resumeTimeout    : 30,
    }
  )

  __shoukaku.on("ready",      (name)         => console.log(`[ - LAVALINK - ] Node ${name} connected`))
  __shoukaku.on("error",      (name, err)    => console.error(`[ - LAVALINK - ] Node ${name} error:`, err))
  __shoukaku.on("close",      (name)         => console.log(`[ - LAVALINK - ] Node ${name} closed`))
  __shoukaku.on("disconnect", (name)         => console.log(`[ - LAVALINK - ] Node ${name} disconnected`))

  return __shoukaku
}

/**
 * @description returns the Shoukaku singleton. Throws if not yet initialized.
 * @returns {Shoukaku} shoukaku instance
 */
export function get_shoukaku(): Shoukaku {
  if (!__shoukaku) throw new Error("[ - LAVALINK - ] Shoukaku not initialized — call init_shoukaku first")
  return __shoukaku
}
