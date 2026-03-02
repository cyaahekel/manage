// - 交互路由器，所有按钮/模态框/选择菜单都在这里分发 - \\
// - interaction router, all buttons/modals/selects get dispatched from here - \\

import { Client, Collection, Interaction, ThreadChannel, GuildMember, ButtonInteraction, AutocompleteInteraction } from "discord.js"
import { Command, MessageContextMenuCommand }                from "@shared/types/command"
import { can_use_command }                                   from "@shared/database/settings/command_permissions"
import { log_error, handle_error_log_button }                from "@shared/utils/error_logger"
import { component }                                         from "@shared/utils"
import {
  handle_ticket_button,
  handle_ticket_modal,
  handle_ticket_select_menu,
  handle_ticket_user_select,
}                                                            from "@shared/database/unified_ticket"

// - 选择菜单处理器 - \\
// - select menu handlers - \\
import * as answer_stats_select     from "@atomic/modules/stats/interactions/select_menus"
import * as payment_method_select   from "@atomic/modules/stats/interactions/select_menus"
import * as guide_select            from "@atomic/modules/guide/interactions/select_menus"
import * as version_select          from "@atomic/modules/version/interactions/select_menus/select"
import * as work_stats_select       from "@atomic/modules/work/interactions/select_menus/week_select"
import * as work_stats_year_select  from "@atomic/modules/work/interactions/select_menus/year_select"
import * as work_stats_all_staff    from "@atomic/modules/work/interactions/select_menus/all_staff_week_select"
import * as reminder_cancel_select  from "@atomic/modules/reminder/interactions/select_menus"
import * as middleman_select        from "@atomic/modules/middleman/interactions/select_menus"
import * as share_settings_select   from "@atomic/modules/share_settings/interactions/select_menus/select"
import * as share_settings_picker   from "@atomic/modules/share_settings/interactions/select_menus/picker"
import * as staff_info_lang_select  from "@atomic/modules/staff_info/interactions/select_menus/lang_select"
import * as tempvoice_region_select from "@atomic/modules/tempvoice/interactions/select_menus/region_select"
import * as tempvoice_user_select   from "@atomic/modules/tempvoice/interactions/select_menus/user_select"
import { handle_role_permission_select } from "@atomic/modules/utility/commands/get_role_permission"

// - 按钮处理器 - \\
// - button handlers - \\
import * as review_submit              from "@atomic/modules/community/interactions/buttons/review_submit"
import * as ask_staff_button           from "@atomic/modules/ask/interactions/buttons/ask_staff"
import * as ask_answer                 from "@atomic/modules/ask/interactions/buttons/answer"
import * as close_request_handlers     from "@atomic/modules/close_request/interactions/buttons/handlers"
import * as reaction_role              from "@atomic/modules/reaction_roles/interactions/buttons/reaction_role"
import * as payment_handlers           from "@atomic/modules/payment/interactions/buttons/handlers"
import * as guide_example              from "@atomic/modules/guide/interactions/buttons/example"
import * as script_redeem_key          from "@atomic/modules/scripts/interactions/buttons/redeem_key"
import * as script_get_script          from "@atomic/modules/scripts/interactions/buttons/get_script"
import * as script_get_role            from "@atomic/modules/scripts/interactions/buttons/get_role"
import * as script_reset_hwid          from "@atomic/modules/scripts/interactions/buttons/reset_hwid"
import * as script_get_stats           from "@atomic/modules/scripts/interactions/buttons/get_stats"
import * as script_view_leaderboard    from "@atomic/modules/scripts/interactions/buttons/view_leaderboard"
import * as free_get_script            from "@atomic/modules/free_scripts/interactions/buttons/get_script"
import * as free_reset_hwid            from "@atomic/modules/free_scripts/interactions/buttons/reset_hwid"
import * as free_get_stats             from "@atomic/modules/free_scripts/interactions/buttons/get_stats"
import * as free_leaderboard           from "@atomic/modules/free_scripts/interactions/buttons/leaderboard"
import * as download_all_staff_report  from "@atomic/modules/work/interactions/buttons/download_all_staff_report"
import * as tempvoice_handlers         from "@atomic/modules/tempvoice/interactions/buttons/handlers"
import * as reminder_add_new           from "@atomic/modules/reminder/interactions/buttons/add_new"
import * as reminder_list              from "@atomic/modules/reminder/interactions/buttons/list"
import * as reminder_cancel            from "@atomic/modules/reminder/interactions/buttons/cancel"
import * as loa_request                from "@atomic/modules/loa/interactions/buttons/request"
import * as loa_approve                from "@atomic/modules/loa/interactions/buttons/approve"
import * as loa_reject                 from "@atomic/modules/loa/interactions/buttons/reject"
import * as loa_end                    from "@atomic/modules/loa/interactions/buttons/end"
import * as booster_claim              from "@atomic/modules/booster/interactions/buttons/claim"
import * as quarantine_release         from "@atomic/modules/quarantine/interactions/buttons/release"
import * as av_toggle                  from "@atomic/modules/av_checker/interactions/buttons/toggle"
import * as middleman_buttons          from "@atomic/modules/middleman/interactions/buttons"
import * as share_settings_star        from "@atomic/modules/share_settings/interactions/buttons/give_star"
import * as share_settings_continue    from "@atomic/modules/share_settings/interactions/buttons/continue"
import * as share_settings_pagination  from "@atomic/modules/share_settings/interactions/buttons/pagination"
import { handle_staff_info_button }    from "@atomic/modules/staff_info/interactions/buttons/handlers"

// - 模态框处理器 - \\
// - modal handlers - \\
import { handle as handle_devlog }              from "@atomic/modules/staff/interactions/modals/devlog"
import { handle_ask_staff_modal }               from "@atomic/modules/ask/interactions/modals/ask_staff_modal"
import { handle_loa_request_modal }             from "@atomic/modules/loa/interactions/modals/loa_request"
import { handle_edit_rules_modal }              from "@atomic/modules/server/interactions/modals/edit_rules"
import { handle_reminder_add_new_modal }        from "@atomic/modules/reminder/interactions/modals/reminder_add_new"
import { handle_script_redeem_modal }           from "@atomic/modules/scripts/interactions/modals/script_redeem"
import { handle_tempvoice_modal }               from "@atomic/modules/tempvoice/interactions/modals/tempvoice"
import { handle_review_modal }                  from "@atomic/modules/community/interactions/modals/review"
import { handle_middleman_close_reason_modal }  from "@atomic/modules/middleman/interactions/modals/middleman_close_reason"
import { handle_share_settings_modal }          from "@atomic/modules/share_settings/interactions/modals/share_settings"
import { handle_edit_staff_info_modal }         from "@atomic/modules/staff_info/interactions/modals/staff_info"


// - 处理反垃圾按钮，内联逻辑不值得单独建文件 - \\
// - anti spam button handler, inline is fine since it's small - \\
async function handle_anti_spam_button(interaction: ButtonInteraction, client: Client): Promise<void> {
  try {
    const parts      = interaction.customId.split(":")
    const action     = parts[0]
    const target_id  = parts[1]
    const message_id = parts[2]

    if (!target_id) {
      await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("Target not found")] })] }), ephemeral: true })
      return
    }

    const guild = interaction.guild
    if (!guild) {
      await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("Guild not found")] })] }), ephemeral: true })
      return
    }

    if (action === "anti_spam_untimeout") {
      const member = await guild.members.fetch(target_id).catch(() => null)
      if (!member) {
        await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("User not found in guild")] })] }), ephemeral: true })
        return
      }
      await member.timeout(null, "Anti-Spam untimeout")
      await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("User un-timed out")] })] }), ephemeral: true })
      return
    }

    if (action === "anti_spam_ban") {
      const member = await guild.members.fetch(target_id).catch(() => null)
      if (member) {
        await member.ban({ reason: "Anti-Spam ban" })
      } else {
        await guild.bans.create(target_id, { reason: "Anti-Spam ban" }).catch(async () => {
          await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("Failed to ban user")] })] }), ephemeral: true })
        })
      }
      if (!interaction.replied) await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("User banned")] })] }), ephemeral: true })
      return
    }

    if (action === "anti_spam_download") {
      await interaction.reply({
        ...component.build_message({
          components: [
            component.container({ components: [
              component.text([`Target: <@${target_id}>`, `Message ID: ${message_id || "N/A"}`]),
            ]}),
          ],
        }),
        ephemeral: true,
      })
      return
    }

    await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("Unknown action")] })] }), ephemeral: true })
  } catch (err) {
    console.log("[ - ANTI SPAM BUTTON - ] error:", err)
    await log_error(client, err as Error, "Anti-Spam Button", {
      custom_id: interaction.customId,
      user     : interaction.user.tag,
      guild    : interaction.guild?.name || "DM",
      channel  : interaction.channel?.id,
    })
    if (!interaction.replied) {
      await interaction.reply({ ...component.build_message({ components: [component.container({ components: [component.text("Error handling action")] })] }), ephemeral: true }).catch(() => {})
    }
  }
}

/**
 * @description 处理所有 Discord 交互事件 / handles all discord interaction events
 * @param {Interaction} interaction - Discord interaction object
 * @param {Client & { commands: Collection<string, Command> }} client - Discord client with commands
 * @returns {Promise<void>}
 */
export async function handle_interaction(
  interaction: Interaction,
  client: Client & { commands: Collection<string, Command> }
) {
  // - 字符串选择菜单路由 - \\
  // - string select menu routing - \\
  if (interaction.isStringSelectMenu()) {
    try {
      if (interaction.customId === "role_permission_select") {
        await handle_role_permission_select(interaction, interaction.values[0])
        return
      }
      if (interaction.customId === "answer_stats_select") {
        await answer_stats_select.handle_answer_stats_select(interaction)
        return
      }
      if (interaction.customId === "payment_method_select") {
        await payment_method_select.handle_payment_method_select(interaction)
        return
      }
      if (interaction.customId === "guide_select") {
        await guide_select.handle_guide_select(interaction)
        return
      }
      if (interaction.customId.startsWith("guide_lang_")) {
        await guide_select.handle_guide_language_select(interaction)
        return
      }
      if (interaction.customId === "version_platform_select") {
        await version_select.handle_version_platform_select(interaction)
        return
      }
      if (interaction.customId === "work_stats_week_select") {
        await work_stats_select.handle_work_stats_week_select(interaction)
        return
      }
      if (interaction.customId === "all_staff_work_year_select") {
        await work_stats_year_select.handle_all_staff_work_year_select(interaction)
        return
      }
      if (interaction.customId === "all_staff_work_week_select") {
        await work_stats_all_staff.handle_all_staff_work_week_select(interaction)
        return
      }
      if (interaction.customId === "reminder_cancel_select") {
        await reminder_cancel_select.handle_reminder_cancel_select(interaction)
        return
      }
      if (interaction.customId === "middleman_transaction_range_select") {
        await middleman_select.handle_middleman_transaction_range_select(interaction)
        return
      }
      if (interaction.customId.startsWith("share_settings_select:")) {
        await share_settings_select.handle_share_settings_select(interaction)
        return
      }
      if (interaction.customId.startsWith("share_settings_pick_rod:") || interaction.customId.startsWith("share_settings_pick_skin:")) {
        await share_settings_picker.handle_share_settings_picker(interaction)
        return
      }
      if (interaction.customId === "staff_info_lang_select") {
        await staff_info_lang_select.handle_staff_info_lang_select(interaction)
        return
      }
      if (await tempvoice_region_select.handle_tempvoice_region_select(interaction)) return
      if (await handle_ticket_select_menu(interaction)) return
    } catch (err) {
      console.log("[ - SELECT MENU - ] error:", err)
      await log_error(client, err as Error, "StringSelectMenu", {
        custom_id: interaction.customId,
        user     : interaction.user.tag,
        guild    : interaction.guild?.name || "DM",
        channel  : interaction.channel?.id,
      })
    }
  }

  // - 用户选择菜单路由 - \\
  // - user select menu routing - \\
  if (interaction.isUserSelectMenu()) {
    try {
      if (await handle_ticket_user_select(interaction)) return
      if (await middleman_select.handle_middleman_partner_select(interaction)) return
      if (await middleman_select.handle_middleman_member_select(interaction)) return
      if (await tempvoice_user_select.handle_tempvoice_user_select(interaction)) return
    } catch (err) {
      console.log("[ - USER SELECT - ] error:", err)
      await log_error(client, err as Error, "UserSelectMenu", {
        custom_id: interaction.customId,
        user     : interaction.user.tag,
        guild    : interaction.guild?.name || "DM",
        channel  : interaction.channel?.id,
      })
    }
  }

  // - 按钮路由，按功能分组 - \\
  // - button routing, grouped by feature - \\
  if (interaction.isButton()) {
    try {
      if (await handle_error_log_button(interaction, client)) return
      if (interaction.customId.startsWith("anti_spam_")) {
        await handle_anti_spam_button(interaction, client)
        return
      }
      if (await handle_ticket_button(interaction)) return
      if (await middleman_buttons.handle_middleman_close(interaction)) return
      if (await middleman_buttons.handle_middleman_close_reason(interaction)) return
      if (await middleman_buttons.handle_middleman_add_member(interaction)) return
      if (await middleman_buttons.handle_middleman_complete(interaction)) return
      if (interaction.customId === "midman_service_close_info") {
        await middleman_buttons.handle_middleman_service_close_info(interaction)
        return
      }
      if (interaction.customId.startsWith("share_settings_continue:")) {
        await share_settings_continue.handle_share_settings_continue(interaction)
        return
      }
      if (interaction.customId === "review_submit") {
        await review_submit.handle_review_submit(interaction)
        return
      }
      if (interaction.customId === "ask_staff_button") {
        await ask_staff_button.handle_ask_staff_button(interaction)
        return
      }
      if (interaction.customId.startsWith("ask_answer_")) {
        await ask_answer.handle_ask_answer(interaction)
        return
      }
      if (interaction.customId === "close_request_accept") {
        await close_request_handlers.handle_close_request_accept(interaction)
        return
      }
      if (interaction.customId === "close_request_deny") {
        await close_request_handlers.handle_close_request_deny(interaction)
        return
      }
      if (interaction.customId.startsWith("reaction_role_")) {
        await reaction_role.handle_reaction_role(interaction)
        return
      }
      if (interaction.customId.startsWith("payment_approve_")) {
        await payment_handlers.handle_payment_approve(interaction)
        return
      }
      if (interaction.customId.startsWith("payment_reject_")) {
        await payment_handlers.handle_payment_reject(interaction)
        return
      }
      if (interaction.customId.startsWith("guide_btn_")) {
        await guide_example.handle_guide_button(interaction)
        return
      }
      if (interaction.customId.startsWith("download_all_staff_report:")) {
        await download_all_staff_report.handle_download_all_staff_report(interaction)
        return
      }
      if (interaction.customId === "script_redeem_key") {
        await script_redeem_key.handle_redeem_key(interaction)
        return
      }
      if (interaction.customId === "script_get_script") {
        await script_get_script.handle_get_script(interaction)
        return
      }
      if (interaction.customId === "script_get_role") {
        await script_get_role.handle_get_role(interaction)
        return
      }
      if (interaction.customId === "script_reset_hwid") {
        await script_reset_hwid.handle_reset_hwid(interaction)
        return
      }
      if (interaction.customId === "script_get_stats") {
        await script_get_stats.handle_get_stats(interaction)
        return
      }
      if (interaction.customId === "script_view_leaderboard") {
        await script_view_leaderboard.handle_view_leaderboard(interaction)
        return
      }
      if (interaction.customId === "script_mobile_copy") {
        await script_get_script.handle_mobile_copy(interaction)
        return
      }
      if (interaction.customId.startsWith("share_settings_star:")) {
        await share_settings_star.handle_give_star(interaction)
        return
      }
      if (interaction.customId.startsWith("share_settings_prev:") || interaction.customId.startsWith("share_settings_next:")) {
        await share_settings_pagination.handle_share_settings_pagination(interaction)
        return
      }
      if (interaction.customId === "free_get_script") {
        await free_get_script.handle_free_get_script(interaction)
        return
      }
      if (interaction.customId === "free_mobile_copy") {
        await free_get_script.handle_free_mobile_copy(interaction)
        return
      }
      if (interaction.customId === "free_reset_hwid") {
        await free_reset_hwid.handle_free_reset_hwid(interaction)
        return
      }
      if (interaction.customId === "free_get_stats") {
        await free_get_stats.handle_free_get_stats(interaction)
        return
      }
      if (interaction.customId === "free_leaderboard") {
        await free_leaderboard.handle_free_leaderboard(interaction)
        return
      }
      if (interaction.customId === "tempvoice_name") {
        await tempvoice_handlers.handle_tempvoice_name(interaction)
        return
      }
      if (interaction.customId === "tempvoice_limit") {
        await tempvoice_handlers.handle_tempvoice_limit(interaction)
        return
      }
      if (interaction.customId === "tempvoice_privacy") {
        await tempvoice_handlers.handle_tempvoice_privacy(interaction)
        return
      }
      if (interaction.customId === "tempvoice_waitingroom") {
        await tempvoice_handlers.handle_tempvoice_waitingroom(interaction)
        return
      }
      if (interaction.customId === "tempvoice_chat") {
        await tempvoice_handlers.handle_tempvoice_chat(interaction)
        return
      }
      if (interaction.customId === "tempvoice_trust") {
        await tempvoice_handlers.handle_tempvoice_trust(interaction)
        return
      }
      if (interaction.customId === "tempvoice_untrust") {
        await tempvoice_handlers.handle_tempvoice_untrust(interaction)
        return
      }
      if (interaction.customId === "tempvoice_invite") {
        await tempvoice_handlers.handle_tempvoice_invite(interaction)
        return
      }
      if (interaction.customId === "tempvoice_kick") {
        await tempvoice_handlers.handle_tempvoice_kick(interaction)
        return
      }
      if (interaction.customId === "tempvoice_region") {
        await tempvoice_handlers.handle_tempvoice_region(interaction)
        return
      }
      if (interaction.customId === "tempvoice_block") {
        await tempvoice_handlers.handle_tempvoice_block(interaction)
        return
      }
      if (interaction.customId === "tempvoice_unblock") {
        await tempvoice_handlers.handle_tempvoice_unblock(interaction)
        return
      }
      if (interaction.customId === "tempvoice_claim") {
        await tempvoice_handlers.handle_tempvoice_claim(interaction)
        return
      }
      if (interaction.customId === "tempvoice_transfer") {
        await tempvoice_handlers.handle_tempvoice_transfer(interaction)
        return
      }
      if (interaction.customId === "tempvoice_delete") {
        await tempvoice_handlers.handle_tempvoice_delete(interaction)
        return
      }
      if (interaction.customId === "tempvoice_leaderboard") {
        await tempvoice_handlers.handle_tempvoice_leaderboard(interaction)
        return
      }
      if (interaction.customId === "reminder_add_new") {
        await reminder_add_new.handle_reminder_add_new(interaction)
        return
      }
      if (interaction.customId === "reminder_list") {
        await reminder_list.handle_reminder_list(interaction)
        return
      }
      if (interaction.customId === "reminder_cancel_select") {
        await reminder_cancel.handle_reminder_cancel(interaction)
        return
      }
      if (interaction.customId === "loa_request") {
        await loa_request.handle_loa_request(interaction)
        return
      }
      if (interaction.customId === "loa_approve") {
        await loa_approve.handle_loa_approve(interaction)
        return
      }
      if (interaction.customId === "loa_reject") {
        await loa_reject.handle_loa_reject(interaction)
        return
      }
      if (interaction.customId === "loa_end") {
        await loa_end.handle_loa_end(interaction)
        return
      }
      if (interaction.customId.startsWith("booster_claim_")) {
        await booster_claim.handle(interaction)
        return
      }
      if (interaction.customId.startsWith("quarantine_release:")) {
        await quarantine_release.handle_quarantine_release(interaction)
        return
      }
      if (interaction.customId.startsWith("staff_info_")) {
        await handle_staff_info_button(interaction)
        return
      }
      if (interaction.customId.startsWith("av_server_") || interaction.customId.startsWith("av_global_")) {
        await av_toggle.handle_av_toggle(interaction)
        return
      }
    } catch (err) {
      console.log("[ - BUTTON - ] error:", err)
      await log_error(client, err as Error, "Button", {
        custom_id: interaction.customId,
        user     : interaction.user.tag,
        guild    : interaction.guild?.name || "DM",
        channel  : interaction.channel?.id,
      })
    }
  }

  // - 模态框路由 - \\
  // - modal routing - \\
  if (interaction.isModalSubmit()) {
    try {
      if (await handle_ticket_modal(interaction)) return
      if (await handle_devlog(interaction)) return
      if (await handle_tempvoice_modal(interaction)) return
      if (interaction.customId === "review_modal") {
        await handle_review_modal(interaction)
        return
      }
      if (interaction.customId.startsWith("edit_rules:")) {
        await handle_edit_rules_modal(interaction)
        return
      }
      if (interaction.customId === "ask_staff_modal") {
        await handle_ask_staff_modal(interaction)
        return
      }
      if (await handle_reminder_add_new_modal(interaction)) return
      if (await handle_loa_request_modal(interaction)) return
      if (await handle_script_redeem_modal(interaction)) return
      if (await handle_middleman_close_reason_modal(interaction)) return
      if (await handle_share_settings_modal(interaction)) return
      if (await handle_edit_staff_info_modal(interaction)) return
    } catch (err) {
      console.log("[ - MODAL - ] error:", err)
      await log_error(client, err as Error, "ModalSubmit", {
        custom_id: interaction.customId,
        user     : interaction.user.tag,
        guild    : interaction.guild?.name || "DM",
        channel  : interaction.channel?.id,
      })
    }
  }

  // - 自动补全路由 - \\
  // - autocomplete routing - \\
  if (interaction.isAutocomplete()) {
    const autocomplete_interaction = interaction as AutocompleteInteraction
    const command = client.commands.get(autocomplete_interaction.commandName)
    if (!command?.autocomplete) return

    try {
      await command.autocomplete(autocomplete_interaction)
    } catch (error) {
      await log_error(client, error as Error, `Autocomplete: ${autocomplete_interaction.commandName}`, {
        user   : autocomplete_interaction.user.tag,
        guild  : autocomplete_interaction.guild?.name || "DM",
        channel: autocomplete_interaction.channel?.id,
      })
    }
    return
  }

  // - 右键消息菜单命令路由 - \\
  // - right-click message context menu routing - \\
  if (interaction.isMessageContextMenuCommand()) {
    const ctx_cmds = (client as any).message_context_menu_commands as Collection<string, MessageContextMenuCommand> | undefined
    const ctx_cmd  = ctx_cmds?.get(interaction.commandName)
    if (!ctx_cmd) return
    try {
      await ctx_cmd.execute(interaction)
    } catch (error) {
      await log_error(client, error as Error, `ContextMenu: ${interaction.commandName}`, {
        user : interaction.user.tag,
        guild: interaction.guild?.name || "DM",
      })
      const err_message = component.build_message({
        components: [
          component.container({ components: [
            component.text("There was an error executing this command."),
          ] }),
        ],
      })
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ ...err_message, ephemeral: true })
      } else {
        await interaction.reply({ ...err_message, ephemeral: true })
      }
    }
    return
  }

  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  const member = interaction.member as GuildMember
  if (!can_use_command(member, interaction.commandName)) {
    await interaction.reply({
      ...component.build_message({
        components: [
          component.container({ components: [
            component.text("You don't have permission to use this command."),
          ] }),
        ],
      }),
      ephemeral: true,
    })
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.log("[ - COMMAND ERROR - ] error:", error)
    await log_error(client, error as Error, `Command: ${interaction.commandName}`, {
      user   : interaction.user.tag,
      guild  : interaction.guild?.name || "DM",
      channel: interaction.channel?.id,
    })
    const err_message = component.build_message({
      components: [
        component.container({ components: [
          component.text("There was an error executing this command."),
        ] }),
      ],
    })
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ ...err_message, ephemeral: true })
    } else {
      await interaction.reply({ ...err_message, ephemeral: true })
    }
  }
}
