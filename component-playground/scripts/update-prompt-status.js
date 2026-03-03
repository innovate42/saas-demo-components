const fs = require("fs")
const path = require("path")

const STATUS_FILE = path.resolve(__dirname, "..", ".prompt-status.json")
const state = process.argv[2] || "listening"
const message = process.argv[3] || ""

const data = { state, message, timestamp: new Date().toISOString() }
fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2))
console.log(`Status updated: ${state} — ${message || "(no message)"}`)
