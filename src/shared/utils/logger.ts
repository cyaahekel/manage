const is_production = process.env.NODE_ENV === "production"

export class Logger {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private format_message(level: string, message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level}] [${this.prefix}] ${message}`
  }

  private send_to_web(level: string, message: string, ...args: unknown[]) {
    const bot_name = process.env.BOT_NAME
    const website_url = process.env.WEBSITE_URL

    if (!bot_name || !website_url) return

    // - FORMAT ARGS - \\
    let final_message = message
    if (args.length > 0) {
      try {
        const args_str = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ')
        final_message += ' ' + args_str
      } catch {
        final_message += ' [Complex Object]'
      }
    }

    // - REMOVE COLOR CODES - \\
    final_message = final_message.replace(/\u001b\[\d+m/g, "")

    // - SEND TO WEB (FIRE AND FORGET) - \\
    fetch(`${website_url}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bot_name,
        level,
        message: `[${this.prefix}] ${final_message}`
      }),
    }).catch(() => {})
  }

  info(message: string, ...args: unknown[]): void {
    if (!is_production) {
      console.log(this.format_message("INFO", message), ...args)
    }
    this.send_to_web("INFO", message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.format_message("WARN", message), ...args)
    this.send_to_web("WARN", message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.format_message("ERROR", message), ...args)
    this.send_to_web("ERROR", message, ...args)
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.DEBUG === "true" && !is_production) {
      console.debug(this.format_message("DEBUG", message), ...args)
    }
    // Debug logs usually not sent to web unless specifically requested, skipping for now to reduce noise
  }

  success(message: string, ...args: unknown[]): void {
    if (!is_production) {
      console.log(this.format_message("SUCCESS", message), ...args)
    }
    this.send_to_web("SUCCESS", message, ...args)
  }
}

export function create_logger(prefix: string): Logger {
  return new Logger(prefix)
}

export function log_info(prefix: string, message: string, ...args: unknown[]): void {
  const logger = create_logger(prefix)
  logger.info(message, ...args)
}

export function log_warn(prefix: string, message: string, ...args: unknown[]): void {
  const logger = create_logger(prefix)
  logger.warn(message, ...args)
}

export function log_error(prefix: string, message: string, ...args: unknown[]): void {
  const logger = create_logger(prefix)
  logger.error(message, ...args)
}

export function log_debug(prefix: string, message: string, ...args: unknown[]): void {
  const logger = create_logger(prefix)
  logger.debug(message, ...args)
}

export function override_console(): void {
  const original_log = console.log
  const original_warn = console.warn
  const original_error = console.error
  const original_debug = console.debug

  const send_to_web = (level: string, message: string, ...args: unknown[]) => {
    const bot_name = process.env.BOT_NAME
    const website_url = process.env.WEBSITE_URL

    if (!bot_name || !website_url) return

    let final_message = message
    if (args.length > 0) {
      try {
        const args_str = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ')
        final_message += ' ' + args_str
      } catch {
        final_message += ' [Complex Object]'
      }
    }

    // - REMOVE COLOR CODES - \\
    final_message = final_message.replace(/\u001b\[\d+m/g, "")

    fetch(`${website_url}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bot_name,
        level,
        message: final_message
      }),
    }).catch(() => {})
  }

  console.log = (message?: any, ...optionalParams: any[]) => {
    original_log(message, ...optionalParams)
    send_to_web("INFO", String(message), ...optionalParams)
  }

  console.warn = (message?: any, ...optionalParams: any[]) => {
    original_warn(message, ...optionalParams)
    send_to_web("WARN", String(message), ...optionalParams)
  }

  console.error = (message?: any, ...optionalParams: any[]) => {
    original_error(message, ...optionalParams)
    send_to_web("ERROR", String(message), ...optionalParams)
  }

  console.debug = (message?: any, ...optionalParams: any[]) => {
    if (process.env.DEBUG === "true") {
        original_debug(message, ...optionalParams)
        send_to_web("DEBUG", String(message), ...optionalParams)
    }
  }
}


export function measure_time<T>(fn: () => T, label?: string): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  const duration = (end - start).toFixed(2)
  if (!is_production) {
    console.log(`[PERF] ${label || "Execution"}: ${duration}ms`)
  }
  return result
}

export async function measure_time_async<T>(fn: () => Promise<T>, label?: string): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = (end - start).toFixed(2)
  if (!is_production) {
    console.log(`[PERF] ${label || "Execution"}: ${duration}ms`)
  }
  return result
}

export function inspect(obj: unknown, depth: number = 2): string {
  return JSON.stringify(obj, null, 2).split("\n").slice(0, depth * 10).join("\n")
}

// - SIMPLE LOG WRAPPER (PRODUCTION SAFE) - \\
export const log = {
  /**
   * @param {...any[]} args - Arguments to log
   * @returns {void}
   */
  log: (...args: any[]): void => {
    if (!is_production) {
      console.log(...args)
    }
  },

  /**
   * @param {...any[]} args - Arguments to warn
   * @returns {void}
   */
  warn: (...args: any[]): void => {
    console.warn(...args)
  },

  /**
   * @param {...any[]} args - Arguments to error
   * @returns {void}
   */
  error: (...args: any[]): void => {
    console.error(...args)
  },

  /**
   * @param {...any[]} args - Arguments to info
   * @returns {void}
   */
  info: (...args: any[]): void => {
    if (!is_production) {
      console.info(...args)
    }
  },

  /**
   * @param {...any[]} args - Arguments to debug
   * @returns {void}
   */
  debug: (...args: any[]): void => {
    if (!is_production) {
      console.debug(...args)
    }
  },
}
