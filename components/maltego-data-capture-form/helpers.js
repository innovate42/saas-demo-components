/**
 * Simplified sendOrder and getRecaptchaToken for data capture forms.
 * These replicate the behaviour of @limio/shop/src/shop/helpers/postRequests
 * without requiring the @limio/shop dependency (which is not available in
 * custom component builds).
 */

export async function getRecaptchaToken(action) {
  if (typeof window !== "undefined" && window.grecaptcha) {
    try {
      const siteKey = window.grecaptcha?.enterprise
        ? undefined
        : document.querySelector('script[src*="recaptcha"]')?.src?.match(/render=([^&]+)/)?.[1]

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
