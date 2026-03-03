// - 脚本模块控制器，处理 /update-script 的全部业务逻辑 - \
// - scripts module controller, handles all business logic for /update-script - \
import { readFileSync } from "fs"
import { component }    from "@shared/utils"
import * as luarmor     from "@atomic/infrastructure/api/luarmor"

// - - \\

/**
 * @description Reads the line count of a local script file
 * @param {string} file_path - Absolute or relative path to the local file
 * @returns {number} Number of lines in the file, or 0 if unreadable
 */
export function get_local_file_line_count(file_path: string): number {
  try {
    const content = readFileSync(file_path, "utf-8")
    return content.split("\n").length
  } catch {
    return 0
  }
}

/**
 * @description Builds the initial /update-script message with file info and Luarmor script select menu
 * @param {string} file_path - Local file path provided by the user
 * @returns {Promise<object>} Component V2 message object
 */
export async function build_update_script_message(file_path: string): Promise<object> {
  const line_count     = get_local_file_line_count(file_path)
  const scripts_result = await luarmor.get_project_scripts()

  const select_options = scripts_result.success && scripts_result.data?.length
    ? scripts_result.data.map((s) => ({
        label      : s.script_name,
        value      : s.script_id,
        description: `v${s.script_version}`,
      }))
    : [{ label: "No scripts found", value: "none", description: "Check your Luarmor project" }]

  return component.build_message({
    components: [
      component.container({
        components: [
          component.text("## Update Script"),
        ],
      }),
      component.container({
        components: [
          component.text([
            `- File: \`${file_path}\``,
            `- Line in File: ${line_count}`,
            "",
          ]),
        ],
      }),
      component.container({
        components: [
          component.text("### Select Script to Update\n"),
          {
            type: 1,
            components: [
              {
                type       : 3,
                custom_id  : `script_update_select:${file_path}`,
                placeholder: "Select script",
                min_values : 1,
                max_values : 1,
                options    : select_options,
              } as any,
            ],
          },
          component.divider(2),
          component.section({
            content  : "Update now: ",
            accessory: component.secondary_button("Update", `script_update_btn:${file_path}:none`),
          }),
        ],
      }),
    ],
  })
}

/**
 * @description Builds the message after a script is selected from the dropdown
 * @param {string} file_path - Local file path
 * @param {string} script_id - Selected Luarmor script ID
 * @returns {Promise<object>} Component V2 message object
 */
export async function build_select_update_message(file_path: string, script_id: string): Promise<object> {
  const line_count     = get_local_file_line_count(file_path)
  const scripts_result = await luarmor.get_project_scripts()

  const selected    = scripts_result.data?.find((s) => s.script_id === script_id)
  const script_name = selected?.script_name ?? script_id

  const select_options = scripts_result.success && scripts_result.data?.length
    ? scripts_result.data.map((s) => ({
        label      : s.script_name,
        value      : s.script_id,
        description: `v${s.script_version}`,
      }))
    : [{ label: script_name, value: script_id, description: "Selected" }]

  return component.build_message({
    components: [
      component.container({
        components: [
          component.text("## Update Script"),
        ],
      }),
      component.container({
        components: [
          component.text([
            `- File: \`${file_path}\``,
            `- Line in File: ${line_count}`,
            "",
          ]),
        ],
      }),
      component.container({
        components: [
          component.text("### Select Script to Update\n"),
          {
            type: 1,
            components: [
              {
                type       : 3,
                custom_id  : `script_update_select:${file_path}`,
                placeholder: script_name,
                min_values : 1,
                max_values : 1,
                options    : select_options,
              } as any,
            ],
          },
          component.divider(2),
          component.section({
            content  : "Update now: ",
            accessory: component.secondary_button("Update", `script_update_btn:${file_path}:${script_id}`),
          }),
        ],
      }),
    ],
  })
}

export interface perform_update_result {
  success      : boolean
  error        : string | undefined
  script_name  : string
  old_version  : string
  new_version  : string
}

/**
 * @description Reads the local file and PUTs it to Luarmor, then fetches the new script version
 * @param {string} file_path - Local file path to read and upload
 * @param {string} script_id - Luarmor script ID to update
 * @returns {Promise<perform_update_result>} Result with version info
 */
export async function perform_script_update(file_path: string, script_id: string): Promise<perform_update_result> {
  const scripts_before = await luarmor.get_project_scripts()
  const before         = scripts_before.data?.find((s) => s.script_id === script_id)
  const script_name    = before?.script_name  ?? script_id
  const old_version    = before?.script_version ?? "????"

  const script_content = readFileSync(file_path, "utf-8")
  const result         = await luarmor.update_script(script_id, script_content)

  if (!result.success) {
    return { success: false, error: result.error, script_name, old_version, new_version: old_version }
  }

  const scripts_after = await luarmor.get_project_scripts()
  const after         = scripts_after.data?.find((s) => s.script_id === script_id)
  const new_version   = after?.script_version ?? old_version

  return { success: true, error: undefined, script_name, old_version, new_version }
}
