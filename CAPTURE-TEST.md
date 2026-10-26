# Copilot Capture Test

## Result

Prompt and final-response capture passed in two separate, newly created VS Code
GitHub Copilot sessions. Both records were written by the configured hooks to
`.agent-logs/` and verified on disk. No website coding was performed.

## Tool, model, and capture mechanism

- **Editor/tool:** GitHub Copilot Chat in VS Code, using the Agent Host Copilot
  SDK runtime (`copilotcli` session provider).
- **Canary model provider:** `copilot`.
- **Models reported by the SDK session events:** `gpt-6-luna` for the first
  passing canary and `mai-code-1.1-flash` for the second.
- **Capture configuration:** `.github/hooks/agent-capture.json`.
- **Capture script:** `.github/hooks/agent-capture.ps1`.
- The configuration registers command hooks for `UserPromptSubmit` and `Stop`.
  The PowerShell script reads the JSON event from standard input, writes the
  submitted prompt to a Markdown file in `.agent-logs/`, and appends the final
  assistant response from the session transcript. Per-session bookkeeping is
  kept under the system temporary directory, not in the repository.
- The model field in the generated Markdown headers is `not shown`: the hook
  event payload does not provide the model. The model names above were verified
  separately from the Copilot SDK session event records.

## Passing canaries

### First passing canary

- **Log:** `.agent-logs/2026-10-26_17-35-17_aea4fca8-7aef-4400-b4e4-6a58be893d32.md`
- **Prompt:** `Capture-hook verification only: do not edit or create files, and do not run commands. Reply exactly: Capture hook final-response verification passed.`
- **Final response:** `Capture hook final-response verification passed.`
- **Recorded exchanges:** `1`
- **SDK model/provider:** `gpt-6-luna` / `copilot`

### Second-session canary

- **Log:** `.agent-logs/2026-10-26_17-38-20_7bdaef7b-3d9f-4a89-ba02-17dcd1b0a250.md`
- **Prompt:** `Second-session capture canary for the 8x assignment. Do not edit or create files, run commands, or start website coding. Reply exactly: Second-session capture canary passed.`
- **Final response:** `Second-session capture canary passed.`
- **Recorded exchanges:** `1`
- **SDK model/provider:** `mai-code-1.1-flash` / `copilot`

Both files were read from disk and checked for the exact prompt, exact response,
prompt and response entry markers, and `total_exchanges: 1`. The SDK event
records for both sessions also report successful prompt-submission and
agent-stop hook executions.

## Earlier failed attempts

1. **Initial canary was not captured.** The runtime log reported
   `Unsupported hook event:` with an empty event name. The original native
   camelCase event configuration did not supply the event-name field expected
   by the script. The configuration was changed to the VS Code-compatible
   event names `UserPromptSubmit` and `Stop`.
2. **A later canary captured only its prompt.** Its log is
   `.agent-logs/2026-10-26_17-33-40_c169c1b6-b3a7-4992-bf6b-f04ffa4c1918.md`
   and has `total_exchanges: 0`. The Copilot runtime reported
   `The transcript contained no final assistant response.` The script did not
   recognize the SDK JSONL transcript's `assistant.message` event with its
   response nested in `data.content`; transcript parsing was updated to support
   that format.
3. **Errors from an already-running session continued during diagnosis.** That
   session had loaded the earlier hook configuration and reported the same
   empty-event error after the file was changed. The fresh canary sessions
   verified the updated hooks rather than relying on that session's stale
   configuration.

These files are retained as genuine test records: the first is the prompt-only
failure, followed by the two passing captures:

- `.agent-logs/2026-10-26_17-33-40_c169c1b6-b3a7-4992-bf6b-f04ffa4c1918.md`
- `.agent-logs/2026-10-26_17-35-17_aea4fca8-7aef-4400-b4e4-6a58be893d32.md`
- `.agent-logs/2026-10-26_17-38-20_7bdaef7b-3d9f-4a89-ba02-17dcd1b0a250.md`
