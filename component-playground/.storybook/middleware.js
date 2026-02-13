const fs = require("fs")
const path = require("path")

const PROMPT_FILE = path.resolve(__dirname, "..", ".prompt.json")

module.exports = function expressMiddleware(app) {
    // Parse JSON bodies for our endpoint
    app.use("/api/prompt", (req, res, next) => {
        if (req.method === "POST") {
            let body = ""
            req.on("data", chunk => { body += chunk })
            req.on("end", () => {
                try {
                    req.body = JSON.parse(body)
                } catch {
                    req.body = {}
                }
                next()
            })
        } else {
            next()
        }
    })

    app.post("/api/prompt", (req, res) => {
        const { prompt, component, storyId } = req.body || {}
        if (!prompt) {
            return res.status(400).json({ error: "prompt is required" })
        }

        const data = {
            prompt,
            component: component || "unknown",
            storyId: storyId || "",
            timestamp: new Date().toISOString()
        }

        try {
            fs.writeFileSync(PROMPT_FILE, JSON.stringify(data, null, 2))
            res.json({ success: true, message: "Prompt saved — Claude Code will pick it up." })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/prompt", (req, res) => {
        try {
            if (fs.existsSync(PROMPT_FILE)) {
                const content = JSON.parse(fs.readFileSync(PROMPT_FILE, "utf8"))
                res.json(content)
            } else {
                res.json({ prompt: "", component: "", storyId: "", timestamp: "" })
            }
        } catch {
            res.json({ prompt: "", component: "", storyId: "", timestamp: "" })
        }
    })
}
