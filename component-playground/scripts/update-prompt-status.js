/**
 * Utility to update the prompt status file from Claude Code.
 *
 * Usage:
 *   node scripts/update-prompt-status.js <state> <message>
 *
 * States: listening, received, working, permission_needed, completed, error
 *
 * Examples:
 *   node scripts/update-prompt-status.js working "Reading component files..."
 *   node scripts/update-prompt-status.js completed "Changes applied to win-back component"
 *   node scripts/update-prompt-status.js permission_needed "Need permission to modify index.css"
 *   node scripts/update-prompt-status.js error "Could not find the component"
 */

const fs = require("fs")
const path = require("path")

const STATUS_FILE = path.resolve(__dirname, "..", ".prompt-status.json")
const PROMPT_FILE = path.resolve(__dirname, "..", ".prompt.json")

const state = process.argv[2]
const message = process.argv.slice(3).join(" ")

if (!state) {
    console.error("Usage: node update-prompt-status.js <state> <message>")
    process.exit(1)
}

let promptTimestamp = ""
try {
    const prompt = JSON.parse(fs.readFileSync(PROMPT_FILE, "utf8"))
    promptTimestamp = prompt.timestamp || ""
} catch {}

const status = {
    state,
    message: message || "",
    promptTimestamp,
    timestamp: new Date().toISOString()
}

fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2))
console.log(`Status updated: ${state} — ${message}`)
