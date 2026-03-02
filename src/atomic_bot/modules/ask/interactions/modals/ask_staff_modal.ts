import { ModalSubmitInteraction } from "discord.js"
import { ModalHandler }           from "@shared/types/interaction"
import { api }                    from "@shared/utils"
import { build_question_panel, ask_channel_id } from "@atomic/modules/ask/commands/ask"

export const modal: ModalHandler = {
  custom_id: "ask_staff_modal",
  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ flags: 64 })

    const question   = interaction.fields.getTextInputValue("ask_question").trim()
    const user       = interaction.user
    const user_avatar = user.displayAvatarURL({ extension: "png", size: 128 })

    const message  = build_question_panel(user.id, user_avatar, question, true)
    const response = await api.send_components_v2(ask_channel_id, api.get_token(), message)

    if (response.error || !response.id) {
      await interaction.editReply({ content: "Failed to post your question. Please try again." })
      return
    }

    await interaction.editReply({
      content: "Your question has been posted! Staff will answer it shortly.",
    })
  },
}
