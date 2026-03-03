const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const PROMPT_FILE = path.resolve(__dirname, "..", ".prompt.json")
const STATUS_FILE = path.resolve(__dirname, "..", ".prompt-status.json")
const PROJECT_ROOT = path.resolve(__dirname, "..", "..")
const CONFIG_FILE = path.join(PROJECT_ROOT, ".limio.json")

// --- Limio config + token management ---

function readLimioConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) return null
        const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"))
        if (!raw.tenant || !raw.clientId || !raw.clientSecret) return null
        return raw
    } catch {
        return null
    }
}

function getLimioBaseUrl(config) {
    const region = (config.region || "eu").toLowerCase()
    if (region === "us") return `https://${config.tenant}.prod-us.limio.com`
    if (region === "dev") return `https://${config.tenant}.dev.limio.com`
    return `https://${config.tenant}.prod.limio.com`
}

let tokenCache = { token: null, expiresAt: 0 }

async function getAccessToken(config) {
    const now = Date.now()
    if (tokenCache.token && tokenCache.expiresAt > now + 60000) {
        return tokenCache.token
    }
    const baseUrl = getLimioBaseUrl(config)
    const params = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.clientId,
        client_secret: config.clientSecret,
    })
    const res = await fetch(`${baseUrl}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    })
    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Auth failed (${res.status}): ${text}`)
    }
    const data = await res.json()
    tokenCache = {
        token: data.access_token,
        expiresAt: now + (data.expires_in || 3600) * 1000,
    }
    return tokenCache.token
}

// --- Helpers ---

function readBody(req) {
    return new Promise((resolve) => {
        let body = ""
        req.on("data", chunk => { body += chunk })
        req.on("end", () => {
            try { resolve(JSON.parse(body)) } catch { resolve({}) }
        })
    })
}

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(data))
}

module.exports = function expressMiddleware(app) {
    // Auto-reset stale prompt status from interrupted sessions
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const status = JSON.parse(fs.readFileSync(STATUS_FILE, "utf8"))
            if (["queued", "received", "working"].includes(status.state)) {
                fs.writeFileSync(STATUS_FILE, JSON.stringify(
                    { state: "listening", message: "", timestamp: new Date().toISOString() }, null, 2
                ))
            }
        }
    } catch {}

    app.use("/api/prompt", async (req, res, next) => {
        if (req.method === "POST") {
            const body = await readBody(req)
            const { prompt, component, storyId, mode } = body
            if (!prompt) return sendJson(res, 400, { error: "prompt is required" })
            const data = { prompt, component: component || "unknown", storyId: storyId || "", mode: mode || "edit", timestamp: new Date().toISOString() }
            try {
                fs.writeFileSync(PROMPT_FILE, JSON.stringify(data, null, 2))
                const statusData = { state: "queued", message: "Prompt sent — waiting for Claude Code...", timestamp: new Date().toISOString() }
                fs.writeFileSync(STATUS_FILE, JSON.stringify(statusData, null, 2))
                sendJson(res, 200, { success: true })
            } catch (err) {
                console.error("Error writing prompt:", err)
                sendJson(res, 500, { error: err.message })
            }
        } else if (req.method === "GET") {
            try {
                if (fs.existsSync(PROMPT_FILE)) {
                    sendJson(res, 200, JSON.parse(fs.readFileSync(PROMPT_FILE, "utf8")))
                } else {
                    sendJson(res, 200, { prompt: "", component: "", storyId: "", timestamp: "" })
                }
            } catch { sendJson(res, 200, { prompt: "", component: "", storyId: "", timestamp: "" }) }
        } else {
            next()
        }
    })

    app.use("/api/prompt-status", async (req, res, next) => {
        if (req.method === "POST") {
            const body = await readBody(req)
            const { state, message } = body
            if (!state) return sendJson(res, 400, { error: "state is required" })
            try {
                const data = { state, message: message || "", timestamp: new Date().toISOString() }
                fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2))
                sendJson(res, 200, { success: true })
            } catch (err) {
                sendJson(res, 500, { error: err.message })
            }
        } else if (req.method === "GET") {
            try {
                if (fs.existsSync(STATUS_FILE)) {
                    sendJson(res, 200, JSON.parse(fs.readFileSync(STATUS_FILE, "utf8")))
                } else {
                    sendJson(res, 200, { state: "listening", message: "" })
                }
            } catch { sendJson(res, 200, { state: "listening", message: "" }) }
        } else {
            next()
        }
    })

    app.use("/api/deploy", async (req, res, next) => {
        if (req.method === "POST") {
            const body = await readBody(req)
            const { component } = body
            if (!component) return sendJson(res, 400, { error: "component is required" })
            try {
                const componentDir = path.join("components", component)
                const componentPath = path.join(PROJECT_ROOT, componentDir)
                if (!fs.existsSync(componentPath)) return sendJson(res, 400, { error: `Component folder not found: ${componentDir}` })
                execSync(`git add ${componentDir}/`, { cwd: PROJECT_ROOT })
                const storiesDir = path.join(PROJECT_ROOT, "component-playground", "src", "stories")
                if (fs.existsSync(storiesDir)) {
                    const storyFiles = fs.readdirSync(storiesDir).filter(f => f.endsWith(".stories.js") || f.endsWith(".stories.jsx"))
                    for (const file of storyFiles) {
                        const content = fs.readFileSync(path.join(storiesDir, file), "utf8")
                        if (content.includes(component)) {
                            execSync(`git add component-playground/src/stories/${file}`, { cwd: PROJECT_ROOT })
                        }
                    }
                }
                execSync(`git commit -m "Deploy component: ${component}"`, { cwd: PROJECT_ROOT })
                const commitHash = execSync("git rev-parse HEAD", { cwd: PROJECT_ROOT }).toString().trim()
                execSync("git push", { cwd: PROJECT_ROOT })
                sendJson(res, 200, { success: true, message: `Deployed ${component} successfully`, commitHash })
            } catch (err) {
                console.error("Deploy error:", err.message)
                sendJson(res, 500, { error: err.message })
            }
        } else if (req.method === "GET") {
            try {
                const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: PROJECT_ROOT }).toString().trim()
                const status = execSync("git status --porcelain", { cwd: PROJECT_ROOT }).toString().trim()
                sendJson(res, 200, { branch, clean: status.length === 0, status })
            } catch (err) {
                sendJson(res, 500, { error: err.message })
            }
        } else {
            next()
        }
    })

    // --- Limio connection status ---
    app.use("/api/limio/status", async (req, res, next) => {
        if (req.method !== "GET") return next()
        const config = readLimioConfig()
        if (!config) return sendJson(res, 200, { configured: false })
        try {
            await getAccessToken(config)
            sendJson(res, 200, { configured: true, tenant: config.tenant, region: config.region || "eu", baseUrl: getLimioBaseUrl(config) })
        } catch (err) {
            sendJson(res, 200, { configured: false, error: `Credentials invalid: ${err.message}` })
        }
    })

    // --- Save Limio credentials ---
    app.use("/api/limio/setup", async (req, res, next) => {
        if (req.method !== "POST") return next()
        const body = await readBody(req)
        const { tenant, region, clientId, clientSecret } = body
        if (!tenant || !clientId || !clientSecret) {
            return sendJson(res, 400, { error: "tenant, clientId, and clientSecret are required" })
        }
        const config = { tenant, region: region || "eu", clientId, clientSecret }
        try {
            tokenCache = { token: null, expiresAt: 0 }
            await getAccessToken(config)
        } catch (err) {
            return sendJson(res, 400, { error: `Authentication failed: ${err.message}` })
        }
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
            sendJson(res, 200, { success: true, tenant, region: config.region, baseUrl: getLimioBaseUrl(config) })
        } catch (err) {
            sendJson(res, 500, { error: `Failed to save config: ${err.message}` })
        }
    })

    // --- Build status proxy ---
    app.use("/api/build-status", async (req, res, next) => {
        if (req.method !== "GET") return next()
        const url = new URL(req.url, "http://localhost")
        const commitHash = url.searchParams.get("commitHash")
        if (!commitHash) return sendJson(res, 400, { error: "commitHash is required" })
        const config = readLimioConfig()
        if (!config) return sendJson(res, 400, { error: "Limio not configured" })
        try {
            const token = await getAccessToken(config)
            const baseUrl = getLimioBaseUrl(config)
            const apiRes = await fetch(`${baseUrl}/api/component/builds?commitHash=${encodeURIComponent(commitHash)}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!apiRes.ok) {
                const text = await apiRes.text().catch(() => "")
                return sendJson(res, apiRes.status, { found: false, error: `Limio API error (${apiRes.status}): ${text}` })
            }
            const data = await apiRes.json()
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return sendJson(res, 200, { found: false })
            }
            const build = Array.isArray(data) ? data[0] : data
            sendJson(res, 200, {
                found: true,
                buildStatus: build.status || build.buildStatus || "UNKNOWN",
                buildComplete: ["SUCCEEDED", "FAILED", "ERROR"].includes((build.status || build.buildStatus || "").toUpperCase()),
                logErrors: build.logErrors || build.errors || null,
                startTime: build.startTime || build.createdAt || null,
                endTime: build.endTime || build.completedAt || null,
            })
        } catch (err) {
            sendJson(res, 500, { error: err.message })
        }
    })
}
