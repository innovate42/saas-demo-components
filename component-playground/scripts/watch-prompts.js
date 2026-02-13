/**
 * Prompt file watcher for Claude Code integration.
 *
 * Run this as a background task in Claude Code. When a prompt is submitted
 * from the Storybook addon panel, this script detects the change, writes
 * a "received" status, outputs the prompt data, then exits so Claude Code
 * gets notified.
 *
 * Usage (from Claude Code):
 *   Run as background task: node component-playground/scripts/watch-prompts.js
 */

const fs = require("fs")
const path = require("path")

const PROMPT_FILE = path.resolve(__dirname, "..", ".prompt.json")
const STATUS_FILE = path.resolve(__dirname, "..", ".prompt-status.json")

const writeStatus = (state, message, promptTimestamp) => {
    const status = {
        state,
        message,
        promptTimestamp: promptTimestamp || "",
        timestamp: new Date().toISOString()
    }
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2))
    } catch {}
}

// Ensure prompt file exists
if (!fs.existsSync(PROMPT_FILE)) {
    fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt: "", component: "", storyId: "", timestamp: "" }, null, 2))
}

const initialContent = fs.readFileSync(PROMPT_FILE, "utf8")
const initialTimestamp = JSON.parse(initialContent).timestamp || ""

// Write "listening" status so the panel knows the watcher is active
writeStatus("listening", "Claude Code is listening for prompts", "")

console.log("Watching for prompts from Storybook...")
console.log(`Prompt file: ${PROMPT_FILE}`)

const check = () => {
    try {
        const content = fs.readFileSync(PROMPT_FILE, "utf8")
        const data = JSON.parse(content)

        if (data.timestamp && data.timestamp !== initialTimestamp && data.prompt) {
            // Write "received" status so the panel gets immediate feedback
            writeStatus("received", "Claude Code received your prompt and is working on it...", data.timestamp)

            console.log("\n===PROMPT_RECEIVED===")
            console.log(JSON.stringify(data, null, 2))
            console.log("===END_PROMPT===")
            process.exit(0)
        }
    } catch {
        // File may be mid-write, ignore
    }
}

const interval = setInterval(check, 500)

// Clean exit on signals
process.on("SIGINT", () => {
    clearInterval(interval)
    process.exit(0)
})
process.on("SIGTERM", () => {
    clearInterval(interval)
    process.exit(0)
})
