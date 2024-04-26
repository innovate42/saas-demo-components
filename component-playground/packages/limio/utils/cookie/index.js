// @flow
/* eslint-env browser */
const _cookie = require("cookie")

// Used for front-end
export const getCookie = (name: string): string => {
    let cookie = ""
    // Annoyingly without this if, Gatbsy was throwing error "ReferenceError: document is not defined" even using document?.cookie
    if (typeof document !== "undefined") {
        const cookiesString = document.cookie || ""
        cookie = getCookieValue(cookiesString, name) || "" // Front-end needs an string to work
    }
    return cookie
}

export const getCookieValue = (cookiesString: string, name: string): string => {
    if (!cookiesString) {
        return undefined
    }
    const cookies = _cookie.parse(cookiesString)

    if (cookies[name]) {
        return cookies[name]
    }
}

export function clearLmoUidCookie(): string {
    return _cookie.serialize("lmo_uid", "", {
        expires: new Date("1970-01-01T00:00:01.000Z"),
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none"
    })
}
