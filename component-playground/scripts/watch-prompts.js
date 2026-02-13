/**
 * Prompt file watcher for Claude Code integration.
 *
 * Run this as a background task in Claude Code. When a prompt is submitted
 * from the Storybook addon panel, this script detects the change and outputs
 * the prompt data, then exits so Claude Code gets notified.
 *
 * Usage (from Claude Code):
 *   Run as background task: node component-playground/scripts/watch-prompts.js
 */

const fs = require("fs")
const path = require("path")

const PROMPT_FILE = path.resolve(__dirname, "..", ".prompt.json")

// Ensure prompt file exists
if (!fs.existsSync(PROMPT_FILE)) {
    fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt: "", component: "", storyId: "", timestamp: "" }, null, 2))
}

const initialContent = fs.readFileSync(PROMPT_FILE, "utf8")
const initialTimestamp = JSON.parse(initialContent).timestamp || ""

console.log("Watching for prompts from Storybook...")
console.log(`Prompt file: ${PROMPT_FILE}`)

const check = () => {
    try {
        const content = fs.readFileSync(PROMPT_FILE, "utf8")
        const data = JSON.parse(content)

        if (data.timestamp && data.timestamp !== initialTimestamp && data.prompt) {
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
