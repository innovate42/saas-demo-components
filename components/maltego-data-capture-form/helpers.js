/**
 * Local implementations of sendOrder and getRecaptchaToken.
 * Replaces @limio/shop/src/shop/helpers/postRequests which cannot be
 * resolved in the custom component build system.
 */

export async function getRecaptchaToken(action) {
  if (typeof window !== "undefined" && window.grecaptcha) {
    try {
      const siteKey = document.querySelector('script[src*="recaptcha"]')?.src?.match(/render=([^&]+)/)?.[1]
      if (siteKey) {
        return await window.grecaptcha.execute(siteKey, { action })
      }
    } catch (err) {
      console.warn("reCAPTCHA token generation failed:", err)
    }
  }
  return ""
}

export async function sendOrder(order, additionalHeaders = {}) {
  const orderWithDefaults = {
    __spec_version: "2",
    initiated_source: "shop",
    process_immediately: true,
    ...order,
    source: "shop"
  }

  const response = await fetch("/api/order", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...additionalHeaders
    },
    body: JSON.stringify(orderWithDefaults)
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(`Order request failed [${response.status}]: ${errorText}`)
  }

  return response.json()
}
