import * as React from "react"
import { useComponentProps, getPropsFromPackageJson, useLimioContext } from "@limio/sdk"
import { FormContext } from "@limio/form-context"
import packageData from "./package.json"

// "Continue" button closing a checkout accordion step (custom subcomponent).
// Unlike the stripe-demo original it validates its own step first: if a field
// in this step is invalid it is focused and reported instead of moving on. It
// also reopens the right step when the final submit fails validation, or when
// the payment step returns an async error (declined card).

type Props = {
  stepNumber: number | string
  label: string
}

const ACTIVE = "data-active-step"
const FORM = "form[name='checkout-form']"
const EVENT = "ot-active-step-changed"
const PAYMENT_TYPE = "input[name='paymentType']"
const PAYMENT_FORM = "#checkoutPaymentForm"

function inStep(form: HTMLElement, n: number, selector: string): HTMLElement | null {
  for (const section of Array.from(form.querySelectorAll(`.ot-section-${n}`))) {
    if ((section as HTMLElement).matches(selector)) return section as HTMLElement
    const found = section.querySelector<HTMLElement>(selector)
    if (found) return found
  }
  return null
}

function steps(form: HTMLFormElement): number[] {
  return Array.from(form.querySelectorAll(".ot-step-header[data-step]"))
    .map((el) => Number((el as HTMLElement).dataset.step))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b)
}

function OtStepContinue(reactProps: Partial<Props>): React.JSX.Element {
  const defaults = getPropsFromPackageJson(packageData) as Props
  const hookProps = useComponentProps<Props>(defaults)
  const props: Props = { ...defaults, ...hookProps, ...(reactProps || {}) }
  const ctx = useLimioContext() as { isInPageBuilder?: boolean } | undefined
  const inBuilder = Boolean(ctx?.isInPageBuilder)
  const step = Number(props.stepNumber) || 1
  const ref = React.useRef<HTMLDivElement | null>(null)
  const formContext = React.useContext(FormContext) as
    | { form?: HTMLFormElement & EventTarget; submitError?: unknown }
    | undefined
  const submitError = formContext?.submitError

  const findForm = React.useCallback(
    (): HTMLFormElement | null => (ref.current ? (ref.current.closest(FORM) as HTMLFormElement | null) : null),
    []
  )

  const open = React.useCallback((form: HTMLFormElement, n: number, scrollTo?: string) => {
    form.setAttribute(ACTIVE, String(n))
    document.dispatchEvent(new CustomEvent(EVENT, { detail: { step: n } }))
    // The step is display:none until the attribute flips; wait two frames
    // for layout before focusing or scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const invalid = inStep(form, n, ":invalid") as HTMLInputElement | null
        if (invalid) {
          invalid.scrollIntoView({ behavior: "smooth", block: "center" })
          invalid.focus()
          return
        }
        const target = scrollTo ? inStep(form, n, scrollTo) : null
        const header = form.querySelector(`.ot-step-header[data-step='${n}']`) as HTMLElement | null
        ;(target || header)?.scrollIntoView({ behavior: "smooth", block: target ? "center" : "start" })
      })
    )
  }, [])

  const advance = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const form = findForm()
      if (!form) return
      const invalid = inStep(form, step, ":invalid") as HTMLInputElement | null
      if (invalid) {
        invalid.scrollIntoView({ behavior: "smooth", block: "center" })
        invalid.focus()
        if (typeof invalid.reportValidity === "function") invalid.reportValidity()
        return
      }
      const next = steps(form).find((n) => n > step)
      if (next) open(form, next)
    },
    [findForm, open, step]
  )

  // Final submit validates the whole form: open the earliest step with an error.
  React.useEffect(() => {
    if (inBuilder || !formContext?.form) return
    const target = formContext.form
    const onValidate = (): void => {
      const form = findForm()
      if (!form) return
      const first = steps(form).find((n) => Boolean(inStep(form, n, ":invalid")))
      if (first === step) open(form, step)
    }
    target.addEventListener("validate", onValidate)
    return () => target.removeEventListener("validate", onValidate)
  }, [inBuilder, formContext, step, findForm, open])

  // A declined payment comes back after validation: reopen the payment step.
  React.useEffect(() => {
    if (inBuilder || !submitError) return
    const form = findForm()
    if (form && inStep(form, step, PAYMENT_TYPE)) open(form, step, PAYMENT_FORM)
  }, [submitError, inBuilder, step, findForm, open])

  return (
    <div ref={ref} className={`ot-step-continue ot-step-continue--${step}`} data-step={step}>
      <button type="button" className="ot-step-continue__btn" onClick={advance} disabled={inBuilder}>
        {props.label}
      </button>
    </div>
  )
}

export default OtStepContinue
