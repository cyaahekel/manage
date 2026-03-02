import { Message, Client }    from "discord.js"
import { SubCommand }         from "../types/sub_command"
import { component }          from "../utils"
import { log_error }          from "../utils/error_logger"

const av_command: SubCommand = {
  name       : "av",
  description: "Display avatar of a user",

  /**
   * @description Show global and server avatar of the mentioned user (or self)
   * @param message - The Discord message
   * @param args    - Parsed arguments (unused, relies on mentions)
   * @param client  - Discord client instance
   * @returns Promise<void>
   */
  async execute(message: Message, args: string[], client: Client) {
    try {
      const mentioned  = message.mentions.users.first()
      const target_user = mentioned || message.author

      const global_avatar = target_user.displayAvatarURL({
        size     : 4096,
        extension: "png",
      })

      let server_avatar: string | null = null

      if (message.guild) {
        try {
          const member  = await message.guild.members.fetch(target_user.id)
          const raw_url = member.avatarURL({ size: 4096, extension: "png" })

          if (raw_url && raw_url !== global_avatar) {
            server_avatar = raw_url
          }
        } catch {}
      }

      const gallery_items = server_avatar
        ? [
            component.gallery_item(server_avatar, "Server avatar"),
            component.gallery_item(global_avatar, "Global avatar"),
          ]
        : [component.gallery_item(global_avatar, "Global avatar")]

      const link_buttons = server_avatar
        ? component.action_row(
            component.link_button("Server Avatar", server_avatar),
            component.link_button("Global Avatar", global_avatar),
          )
        : component.action_row(
            component.link_button("Open Avatar", global_avatar),
          )

      const payload = component.build_message({
        components: [
          component.container({
            components: [
              component.media_gallery(gallery_items),
              component.divider(),
              link_buttons,
            ],
          }),
        ],
      })

      await message.reply(payload).catch(() => {})
    } catch (error) {
      await log_error(client, error as Error, "Sub Command: ?av", {
        user   : message.author.tag,
        guild  : message.guild?.name || "DM",
        channel: message.channel.id,
      }).catch(() => {})
    }
  },
}

export default av_command
