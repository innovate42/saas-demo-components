import * as React from "react"
import { useComponentProps, getPropsFromPackageJson, useLimioContext, useUser, useBasket } from "@limio/sdk"
import packageData from "./package.json"

// Accordion step header for the stock checkout form (custom subcomponent).
// Adapted from the stripe-demo sports-step-header: it writes data-active-step on
// the checkout form and pageStyle CSS shows only the active step's fields
// (each field carries `ot-section-N` in its className props). When a step is
// collapsed the header shows a one-line summary of what was entered, built from
// `{{customerDetails.email}}`-style templates, plus an Edit link.
// With prefillFromLogin on, it also fills empty name, email and company fields
// from the signed-in user's login claims (Trading Grid Online registration).

type Props = {
  stepNumber: number | string
  title: string
  subtitle: string
  editLabel: string
  totalSteps: number | string
  summary: string
  prefillFromLogin: boolean
}

const ACTIVE = "data-active-step"
const FORM = "form[name='checkout-form']"
const EVENT = "ot-active-step-changed"
const GROUPS = ["customerDetails", "billingDetails", "deliveryDetails"]

// Login claim names to try for each customerDetails field, in order.
const LOGIN_CLAIMS: Record<string, string[]> = {
  firstName: ["first_name", "given_name", "firstName"],
  lastName: ["last_name", "family_name", "lastName"],
  email: ["email"],
  companyName: ["company_name", "companyName", "company"]
}

function claim(attributes: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = attributes[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return ""
}

// Sets an input the way typing would, so the form's own state picks it up.
function setInput(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
  if (setter) setter.call(el, value)
  else el.value = value
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
}

function paymentLabel(form: HTMLFormElement): string {
  const checked = form.querySelector<HTMLInputElement>('input[name="paymentType"]:checked')
  if (!checked) return ""
  const label = checked.closest("label")
  return (
    label?.querySelector(".tw-flex-1")?.textContent?.trim() ||
    label?.textContent?.trim() ||
    checked.value.replace(/^zuora_/, "").replace(/_/g, " ")
  )
}

function formState(form: HTMLFormElement): Record<string, string> {
  const state: Record<string, string> = {}
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[name]").forEach((el) => {
    const name = el.getAttribute("name") || ""
    if (!GROUPS.includes(name.split(".")[0])) return
    const input = el as HTMLInputElement
    if ((input.type === "radio" || input.type === "checkbox") && !input.checked) return
    let value = (el.value || "").trim()
    if (el.tagName === "SELECT") {
      const opt = (el as HTMLSelectElement).selectedOptions?.[0]
      if (opt && opt.value) value = opt.text.trim()
    }
    state[name] = value
  })
  state.paymentType = paymentLabel(form)
  return state
}

// "{{a}} · {{b}}" → values; separators left dangling by empty values are tidied.
function fill(template: string, state: Record<string, string>): string {
  return template
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => state[key] || "")
    .replace(/(\s*[·,]\s*)+$/g, "")
    .replace(/^(\s*[·,]\s*)+/g, "")
    .replace(/(\s*·\s*){2,}/g, " · ")
    .replace(/(\s*,\s*){2,}/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function OtStepHeader(reactProps: Partial<Props>): React.JSX.Element {
  const defaults = getPropsFromPackageJson(packageData) as Props
  const hookProps = useComponentProps<Props>(defaults)
  const props: Props = { ...defaults, ...hookProps, ...(reactProps || {}) }
  const ctx = useLimioContext() as { isInPageBuilder?: boolean } | undefined
  const inBuilder = Boolean(ctx?.isInPageBuilder)

  const user = useUser() as { attributes?: Record<string, unknown> } | undefined
  const basket = useBasket() as { updateBasketDetails?: (payload: unknown) => Promise<unknown> } | undefined
  const attributes = user?.attributes

  const step = Number(props.stepNumber) || 1
  const total = Number(props.totalSteps) || 3
  const [active, setActiveState] = React.useState<number>(step === 1 ? 1 : 0)
  const [summary, setSummary] = React.useState("")
  const ref = React.useRef<HTMLDivElement | null>(null)

  const findForm = React.useCallback(
    (): HTMLFormElement | null => (ref.current ? (ref.current.closest(FORM) as HTMLFormElement | null) : null),
    []
  )

  React.useEffect(() => {
    if (inBuilder) return
    const form = findForm()
    if (!form) return
    const current = form.getAttribute(ACTIVE)
    if (!current && step === 1) {
      form.setAttribute(ACTIVE, "1")
      form.setAttribute("data-total-steps", String(total))
      setActiveState(1)
    } else if (current) {
      setActiveState(Number(current))
    }
  }, [findForm, step, total, inBuilder])

  React.useEffect(() => {
    if (inBuilder) return
    const onChange = (ev: Event): void => {
      const n = (ev as CustomEvent<{ step: number }>).detail?.step
      if (n) setActiveState(n)
    }
    document.addEventListener(EVENT, onChange)
    return () => document.removeEventListener(EVENT, onChange)
  }, [inBuilder])

  React.useEffect(() => {
    if (inBuilder || !props.prefillFromLogin || !attributes) return
    let done = false
    const prefill = (): void => {
      const form = findForm()
      if (done || !form) return
      const values: Record<string, string> = {}
      Object.entries(LOGIN_CLAIMS).forEach(([field, keys]) => {
        const value = claim(attributes, keys)
        const el = form.querySelector<HTMLInputElement>(`input[name="customerDetails.${field}"]`)
        if (value && el && !el.value) {
          setInput(el, value)
          values[field] = value
        }
      })
      if (!Object.keys(values).length) return
      done = true
      basket?.updateBasketDetails?.({ data: { order: { customerDetails: values } } })?.catch(() => undefined)
    }
    // The fields can mount after this header, so try again shortly after.
    const timers = [0, 400, 1500].map((ms) => setTimeout(prefill, ms))
    return () => timers.forEach(clearTimeout)
  }, [attributes, basket, findForm, inBuilder, props.prefillFromLogin])

  const isActive = active === step
  const isDone = active > step

  React.useEffect(() => {
    if (inBuilder || isActive) {
      setSummary("")
      return
    }
    const t = setTimeout(() => {
      const form = findForm()
      if (form) setSummary(fill(props.summary || "", formState(form)))
    }, 60)
    return () => clearTimeout(t)
  }, [isActive, inBuilder, findForm, props.summary])

  const open = React.useCallback(
    (e?: React.SyntheticEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      const form = findForm()
      if (form) form.setAttribute(ACTIVE, String(step))
      setActiveState(step)
      document.dispatchEvent(new CustomEvent(EVENT, { detail: { step } }))
    },
    [findForm, step]
  )

  const cls = [
    "ot-step-header",
    `ot-step-header--${step}`,
    isActive ? "ot-step-header--active" : "ot-step-header--collapsed",
    isDone ? "ot-step-header--done" : ""
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      ref={ref}
      className={cls}
      data-step={step}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") open(e)
      }}
    >
      <span className="ot-step-header__badge" aria-hidden="true">
        {isDone ? "✓" : step}
      </span>
      <div className="ot-step-header__text">
        <h3 className="ot-step-header__title">{props.title}</h3>
        {isActive && props.subtitle ? <p className="ot-step-header__subtitle">{props.subtitle}</p> : null}
        {!isActive && summary ? <p className="ot-step-header__summary">{summary}</p> : null}
      </div>
      {isDone && props.editLabel ? (
        <button type="button" className="ot-step-header__edit" onClick={open} aria-label={`${props.editLabel} ${props.title}`}>
          {props.editLabel}
        </button>
      ) : null}
    </div>
  )
}

export default OtStepHeader
