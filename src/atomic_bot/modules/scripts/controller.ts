// - 脚本模块控制器，处理 /push-script 的全部业务逻辑 - \
// - scripts module controller, handles all business logic for /push-script - \
import { component } from "@shared/utils"
import * as luarmor  from "@atomic/infrastructure/api/luarmor"

// - - \\

/**
 * @description Fetches text content from a URL and counts its lines
 * @param {string} url - URL to fetch
 * @returns {Promise<{ content: string; line_count: number }>}
 */
async function fetch_file_content(url: string): Promise<{ content: string; line_count: number }> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch attachment: ${response.status}`)
  const content   = await response.text()
  const line_count = content.split("\n").length
  return { content, line_count }
}

/**
 * @description Builds the select menu component block shared by both message builders
 * @param {string} attachment_url  - Discord attachment URL
 * @param {string} filename        - Original filename for display
 * @param {string} placeholder     - Select menu placeholder text
 * @param {string} script_id       - Currently selected script_id (or "none")
 * @param {Array}  select_options  - Options array for the select menu
 * @returns {object[]} Array of components for the select container
 */
function build_select_container(
  attachment_url : string,
  filename       : string,
  line_count     : number,
  placeholder    : string,
  script_id      : string,
  select_options : { label: string; value: string; description: string }[]
): any[] {
  const encoded_ref = Buffer.from(`${attachment_url}|${filename}`).toString("base64")

  return [
    component.container({
      components: [
        component.text("## Push Script"),
      ],
    }),
    component.container({
      components: [
        component.text([
          `- File: \`${filename}\``,
          `- Lines: ${line_count}`,
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
              custom_id  : `script_update_select:${encoded_ref}`,
              placeholder,
              min_values : 1,
              max_values : 1,
              options    : select_options,
            } as any,
          ],
        },
        component.divider(2),
        component.section({
          content  : "Update now: ",
          accessory: component.secondary_button("Update", `script_update_btn:${encoded_ref}:${script_id}`),
        }),
      ],
    }),
  ]
}

/**
 * @description Builds the initial /push-script message
 * @param {string} attachment_url - Discord attachment URL
 * @param {string} filename       - Original filename for display
 * @returns {Promise<object>} Component V2 message object
 */
export async function build_update_script_message(attachment_url: string, filename: string): Promise<object> {
  const { line_count }  = await fetch_file_content(attachment_url)
  const scripts_result  = await luarmor.get_project_scripts()

  const select_options = scripts_result.success && scripts_result.data?.length
    ? scripts_result.data.map((s) => ({
        label      : s.script_name,
        value      : s.script_id,
        description: `v${s.script_version}`,
      }))
    : [{ label: "No scripts found", value: "none", description: "Check your Luarmor project" }]

  return component.build_message({
    components: build_select_container(
      attachment_url,
      filename,
      line_count,
      "Select script",
      "none",
      select_options
    ) as any,
  })
}

/**
 * @description Builds the message after a script is chosen from the dropdown
 * @param {string} encoded_ref - Base64 encoded "url|filename"
 * @param {string} script_id   - Selected Luarmor script ID
 * @returns {Promise<object>} Component V2 message object
 */
export async function build_select_update_message(encoded_ref: string, script_id: string): Promise<object> {
  const decoded        = Buffer.from(encoded_ref, "base64").toString("utf-8")
  const pipe_idx       = decoded.lastIndexOf("|")
  const attachment_url = decoded.slice(0, pipe_idx)
  const filename       = decoded.slice(pipe_idx + 1)

  const { line_count } = await fetch_file_content(attachment_url)
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
    components: build_select_container(
      attachment_url,
      filename,
      line_count,
      script_name,
      script_id,
      select_options
    ) as any,
  })
}

export interface perform_update_result {
  success     : boolean
  error       : string | undefined
  script_name : string
  old_version : string
  new_version : string
}

/**
 * @description Fetches attachment content and PUTs it to Luarmor, then returns version diff
 * @param {string} encoded_ref - Base64 encoded "url|filename"
 * @param {string} script_id   - Luarmor script ID to update
 * @returns {Promise<perform_update_result>} Result with version info
 */
export async function perform_script_update(encoded_ref: string, script_id: string): Promise<perform_update_result> {
  const decoded        = Buffer.from(encoded_ref, "base64").toString("utf-8")
  const pipe_idx       = decoded.lastIndexOf("|")
  const attachment_url = decoded.slice(0, pipe_idx)

  const scripts_before = await luarmor.get_project_scripts()
  const before         = scripts_before.data?.find((s) => s.script_id === script_id)
  const script_name    = before?.script_name    ?? script_id
  const old_version    = before?.script_version ?? "????"

  const { content } = await fetch_file_content(attachment_url)
  const result      = await luarmor.update_script(script_id, content)

  if (!result.success) {
    return { success: false, error: result.error, script_name, old_version, new_version: old_version }
  }

  const scripts_after = await luarmor.get_project_scripts()
  const after         = scripts_after.data?.find((s) => s.script_id === script_id)
  const new_version   = after?.script_version ?? old_version

  return { success: true, error: undefined, script_name, old_version, new_version }
}
