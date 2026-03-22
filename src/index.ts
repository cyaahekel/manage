/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

/**
 * - 多机器人启动器 - \\
 * - multi-bot launcher - \\
 * Main entry point that starts all bots
 */

// - 生产环境禁用 console.log - \\
// - disable console.log in production - \\
const is_production = process.env.NODE_ENV === "production"
if (is_production) {
  console.log = () => {}
}

import "./startup/atomic_bot"
import "./startup/jkt48_bot"
import "./startup/bypass_bot"

console.info("[ - LAUNCHER - ] All bots started")
