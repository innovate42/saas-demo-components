import React, { useMemo } from "react"
import { useUserInvoices } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const formatDate = (value) => {
  if (!value) return "—"
  const d = new Date(value)
  if (isNaN(d.getTime())) return "—"
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const formatMoney = (amount, currency) => {
  const n = typeof amount === "number" ? amount : parseFloat(String(amount ?? "").replace(/[^0-9.-]/g, ""))
  if (isNaN(n)) return "—"
  const symbol = { GBP: "£", USD: "$", EUR: "€" }[currency] || "£"
  return `${symbol}${n.toFixed(2)}`
}

/** Invoice shapes vary by billing provider — read defensively. */
const normalise = (invoice) => {
  const d = invoice?.data || invoice || {}
  const amount = d.amount ?? d.total ?? d.amountDue ?? d.invoiceTotal
  const balance = parseFloat(d.balance ?? d.amountDue ?? 0)
  const rawStatus = String(d.status || invoice?.status || "").toLowerCase()
  const paid = rawStatus === "paid" || rawStatus === "posted" || (!isNaN(balance) && balance <= 0)
  return {
    id: invoice?.id || d.id || d.invoiceNumber || Math.random().toString(36).slice(2),
    number: d.invoiceNumber || d.number || d.reference || invoice?.name || "—",
    date: d.invoiceDate || d.date || d.created || invoice?.created,
    amount: formatMoney(amount, d.currency || d.currencyCode),
    paid,
    statusLabel: paid ? "Paid" : rawStatus ? rawStatus[0].toUpperCase() + rawStatus.slice(1) : "Due",
    url: d.pdfUrl || d.url || d.invoiceFileUrl || null,
    dateLabel: formatDate(d.invoiceDate || d.date || d.created || invoice?.created),
  }
}


/** Limio does not always expose a PDF for an invoice. Rather than show a dead
 *  link, render the invoice into a print window the subscriber can save. */
const openPrintable = (row, brand, accent) => {
  const w = window.open("", "_blank", "width=820,height=1000")
  if (!w) return
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))
  w.document.write(`<!doctype html><html><head><meta charset="utf-8">
<title>${esc(brand)} invoice ${esc(row.number)}</title>
<style>
 body{font:15px/1.55 "Helvetica Neue",Helvetica,Arial,sans-serif;color:#222;margin:0;padding:56px}
 .m{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #222;padding-bottom:14px}
 h1{font:700 30px/1 "Helvetica Neue",Arial,sans-serif;margin:0;letter-spacing:-.02em;text-transform:uppercase}
 .lbl{font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.13em;text-transform:uppercase;color:#666}
 table{width:100%;border-collapse:collapse;margin-top:34px}
 td,th{text-align:left;padding:13px 0;border-bottom:1px solid #ddd}
 th{font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.13em;text-transform:uppercase;color:#666}
 .r{text-align:right}
 .tot{font:700 24px/1 "Helvetica Neue",Arial,sans-serif;letter-spacing:-.02em}
 .st{color:${esc(accent)};font:500 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase}
 .f{margin-top:44px;font-size:12.5px;color:#666;border-top:1px solid #ddd;padding-top:14px}
 @media print{body{padding:24px}}
</style></head><body>
 <div class="m"><h1>${esc(brand)}</h1><div><span class="lbl">Invoice</span><br>${esc(row.number)}</div></div>
 <table>
  <tr><th>Description</th><th class="r">Date</th><th class="r">Amount</th></tr>
  <tr><td>${esc(brand)} subscription</td><td class="r">${esc(row.dateLabel)}</td><td class="r">${esc(row.amount)}</td></tr>
  <tr><td class="tot">Total</td><td></td><td class="r tot">${esc(row.amount)}</td></tr>
 </table>
 <p class="st">${esc(row.statusLabel)}</p>
 <p class="f">Fulfilment and distribution by Air Business. Subscriptions powered by Limio.</p>
 <script>window.onload=function(){window.print()}<\/script>
</body></html>`)
  w.document.close()
}

const AbInvoices = () => {
  const props = useStaticProps() || {}
  const {
    brandName = "",
    heading = "",
    subheading = "",
    emptyMessage = "",
    downloadLabel = "Download",
    payLabel = "Pay now",
    changePaymentUrl = "",
    changePaymentLabel = "",
    accentColor__limio_color: accent = "#0B5D33",
    accentSoftColor__limio_color: accentSoft = "#EAF3ED",
    inkColor__limio_color: ink = "#10221A",
    paperColor__limio_color: paper = "#F6F5F1",
    bodyFont = "'Helvetica Neue', Helvetica, Arial, sans-serif",
    monoFont = "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
    headingFont = "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
  } = props

  const { invoices } = useUserInvoices() || {}

  const rows = useMemo(() => {
    if (!Array.isArray(invoices)) return []
    return invoices
      .map(normalise)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [invoices])

  const styleVars = {
    "--abi-accent": accent,
    "--abi-accent-soft": accentSoft,
    "--abi-ink": ink,
    "--abi-paper": paper,
    "--abi-heading-font": headingFont,
    "--abi-body-font": bodyFont,
    "--abi-mono": monoFont,
  }

  return (
    <section className="abi" style={styleVars}>
      <div className="abi-inner">
        <header className="abi-head">
          <div>
            {heading ? <h1 className="abi-title">{heading}</h1> : null}
            {subheading ? <p className="abi-sub">{subheading}</p> : null}
          </div>
          {changePaymentUrl && changePaymentLabel ? (
            <a className="abi-link" href={changePaymentUrl}>
              {changePaymentLabel}
              <span aria-hidden="true"> →</span>
            </a>
          ) : null}
        </header>

        {rows.length ? (
          <div className="abi-card">
            <div className="abi-row abi-row-head" role="row">
              <span>Invoice</span>
              <span>Date</span>
              <span>Status</span>
              <span className="abi-right">Amount</span>
              <span />
            </div>
            {rows.map((row) => (
              <div className="abi-row" key={row.id} role="row">
                <span className="abi-number">{row.number}</span>
                <span className="abi-date">{formatDate(row.date)}</span>
                <span>
                  <em className={`abi-pill ${row.paid ? "is-paid" : "is-due"}`}>{row.statusLabel}</em>
                </span>
                <span className="abi-right abi-amount">{row.amount}</span>
                <span className="abi-actions">
                  {row.url ? (
                    <a className="abi-action" href={row.url} target="_blank" rel="noreferrer">
                      {downloadLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="abi-action"
                      onClick={() => openPrintable(row, brandName, accent)}
                    >
                      {downloadLabel}
                    </button>
                  )}
                  {!row.paid && changePaymentUrl ? (
                    <a className="abi-action is-primary" href={changePaymentUrl}>
                      {payLabel}
                    </a>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="abi-empty">
            <span className="abi-empty-mark" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                <path d="M14 3v5h5M9 13h6M9 17h4" />
              </svg>
            </span>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AbInvoices
