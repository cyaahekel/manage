<div align="center">

<table border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td valign="middle">
      <img src="https://github.com/bimoraa/atomic_bot/blob/main/assets/images/logo.png?raw=true" alt="Atomic Bot Logo" height="160" />
    </td>
    <td valign="middle" width="24"></td>
    <td valign="middle">
      <img src="https://github.com/bimoraa/atomic_bot/blob/main/assets/images/banner.png?raw=true" alt="Atomic Bot Banner" height="160" />
    </td>
  </tr>
</table>

<p>A multi-bot Discord platform for server management, automation,<br/>JKT48 live notifications, and link bypassing.</p>

[![Last Commit](https://img.shields.io/github/last-commit/bimoraa/atomic_bot?style=flat-square&color=5865F2)](https://github.com/bimoraa/atomic_bot/commits/main)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.19.0-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE.txt)

</div>

---

## Overview

| Bot | Description |
|---|---|
| **Atomic Bot** | Main server management — moderation, tickets, payments, music, reminders, and more |
| **JKT48 Bot** | Live stream notifications for JKT48 IDN & Showroom streams |
| **Bypass Bot** | Automatic link bypassing with DM and channel support |

---

## Architecture

```mermaid
flowchart TD
    Entry["src/index.ts\nMulti-bot launcher"]

    Entry --> A["atomic_bot.ts"]
    Entry --> J["jkt48_bot.ts"]
    Entry --> B["bypass_bot.ts"]

    subgraph ATOMIC["Atomic Bot"]
        A --> AC["core/handlers\ncommand · button · modal · select"]
        AC --> AM["modules/\nmoderation · tickets · payments\nmusic · reminder · tempvoice · ..."]
    end

    subgraph JKT48["JKT48 Bot"]
        J --> JC["core/controllers\nIDN · Showroom · scheduler"]
        JC --> JM["modules/\nnotify · history_live · ..."]
    end

    subgraph BYPASS["Bypass Bot"]
        B --> BC["core/events · limits · select_menus"]
        BC --> BM["modules/\nbypass · bypass_channel_set · ..."]
    end

    ATOMIC & JKT48 & BYPASS --> SHARED

    subgraph SHARED["src/shared/"]
        DB["database/\nmanagers · services · unified_ticket"]
        UTILS["utils/\ncomponent · api · modal · logger"]
        CONST["constants + enums + models"]
        DB --- UTILS --- CONST
    end

    SHARED --> PG[("PostgreSQL")]
    SHARED --> DAPI["Discord REST API"]

    subgraph WEB["web/ — Next.js Dashboard"]
        WEBAPP["app/ routes"]
        WEBAPI["app/api/ — REST endpoints"]
        WEBAPP --- WEBAPI
    end

    WEB --> PG
```

---

## Interaction Routing

```mermaid
flowchart LR
    Discord["Discord Gateway\nWebSocket event"] --> Handler["interactionCreate\nlistener"]

    Handler --> CMD{"Interaction\ntype?"}

    CMD -- "ChatInputCommand" --> SlashCmd["modules/<feature>/commands/*.ts\nexecute()"]
    CMD -- "ButtonInteraction" --> Btn["core/handlers/buttons/\nor modules/.../interactions/buttons/"]
    CMD -- "ModalSubmit" --> Mdl["core/handlers/modals/\nor modules/.../interactions/modals/"]
    CMD -- "SelectMenu" --> Sel["modules/.../interactions/select_menus/"]
    CMD -- "Autocomplete" --> Auto["command.autocomplete()"]

    SlashCmd & Btn & Mdl & Sel --> CV2["component.build_message()\nComponent V2 reply\nflags: 32768"]
    CV2 --> Discord
```

---

## TempVoice Flow

```mermaid
flowchart TD
    Join["User joins\n➕・create-voice"] --> VSU["VoiceStateUpdate\nevent"]
    VSU --> Match{"channelId ==\ngeneratorId?"}
    Match -- "no" --> Other["handle thread\nadd / remove"]
    Match -- "yes" --> Existing{"User already\nhas channel?"}

    Existing -- "yes" --> Move1["member.voice.setChannel\nexisting channel"]
    Existing -- "no" --> Create["guild.channels.create\nnew VoiceChannel\n+ permission overwrites"]

    Create --> RegMap["Register in-memory maps\n__temp_channels / __channel_owners\n__trusted_users / __blocked_users"]
    RegMap --> MoveNow["member.voice.setChannel\nnew channel\n← user is here IMMEDIATELY"]

    MoveNow --> BG["Background IIFE\nnon-blocking"]

    subgraph BG_TASKS["Background tasks (fire-and-forget)"]
        T1["voice_tracker.track_channel_created\nDB insert"]
        T2["restore_channel_settings\napply saved name · limit · privacy\nper-user permission overwrites"]
        T3["create_thread\nprivate thread + interface panel"]
        T1 --> T2 --> T3
    end

    BG --> BG_TASKS

    Leave["User leaves\ntemp channel"] --> Timer["setTimeout 2 s\nrace-condition guard"]
    Timer --> Empty{"member\ncount == 0?"}
    Empty -- "no" --> Keep["Keep channel alive"]
    Empty -- "yes" --> Del["delete_temp_channel\narchive thread\ncleanup maps & DB"]
```

---

## Prerequisites

- Node.js >= 20.19.0
- npm >= 10.0.0
- PostgreSQL database
- Discord Bot Token(s)

## Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Build
npm run build
```

## Running

```bash
# All bots at once
npm start

# Or individually
npm run start:atomic
npm run start:jkt48
npm run start:bypass
```

## Development

```bash
# All bots (watch mode)
npm run dev:all

# Individual
npm run dev:atomic
npm run dev:jkt48
npm run dev:bypass
```

## Project Structure

```
src/
├── index.ts                  # Multi-bot launcher
│
├── startup/                  # Per-bot entry points
│   ├── atomic_bot.ts
│   ├── jkt48_bot.ts
│   └── bypass_bot.ts
│
├── atomic_bot/               # Main server management bot
│   ├── core/
│   │   ├── client/
│   │   ├── handlers/
│   │   └── middleware/
│   ├── guide/                # Guide markdown files
│   ├── infrastructure/
│   │   ├── api/
│   │   ├── cache/
│   │   └── webhooks/
│   └── modules/
│       ├── moderation/       # Ban, kick, warn, mute
│       ├── music/            # DisTube playback
│       ├── tickets/          # Support ticket system
│       ├── payments/         # Payment handling
│       ├── reminder/         # Persistent reminders
│       ├── reputation/       # Rep system
│       ├── staff/            # Staff tools
│       ├── utility/          # General utilities
│       ├── whitelister/      # Whitelist management
│       └── ...
│
├── jkt48_bot/                # JKT48 live notification bot
│   ├── core/
│   │   ├── buttons/
│   │   ├── controllers/
│   │   └── schedulers/
│   ├── infrastructure/api/
│   └── modules/
│       ├── notify.ts
│       ├── notify_channel_set.ts
│       ├── history_live.ts
│       └── ...
│
├── bypass_bot/               # Link bypass bot
│   ├── core/
│   │   ├── buttons/
│   │   ├── events/           # Auto-bypass (DM + channel)
│   │   ├── limits/           # Rate limiting
│   │   └── select_menus/
│   └── modules/
│       ├── bypass.ts
│       ├── bypass_channel_set.ts
│       └── ...
│
├── shared/                   # Shared across all bots
│   ├── config/
│   ├── constants/
│   ├── database/
│   ├── services/
│   ├── types/
│   └── utils/
│
└── web/                      # Dashboard (Next.js)
    ├── app/
    └── components/
```

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Language |
| Discord.js v14 | Discord API |
| Node.js | Runtime |
| PostgreSQL (`pg`) | Primary database |
| Express | Web server |
| Next.js | Web dashboard |
| DisTube | Music playback |
| concurrently | Multi-bot runner |

---

## License

MIT License — see [LICENSE.txt](LICENSE.txt)

---

<div align="center">

Made with Love by **Atomic Team (AZure48)**<br/>
Developed by Lendowsky, Kim7, kimsoyoun_

</div>
