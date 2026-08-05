export type InvoicesTableProps = {
  dateHeader: string
  dueDateHeader: string
  referenceHeader: string
  priceHeader: string
  balanceHeader: string
  downloadInvoiceHeader: string
  payInvoiceHeader: string
  downloadInvoiceTooltipText: string
  payInvoiceTooltipText: string
  showDueDate: boolean
  showPrice: boolean
  showBalance: boolean
  allowDownload: boolean
  cpdallowPay: boolean
  filtersButtonText: string
  filtersBalancePaidText: string
  filtersBalanceUnpaidText: string
  resultsPerPageText: string
  noInvoicesText: string
  errorText: string
  confirmPayHeading: string
  confirmPayText: string
  confirmSuccessHeading: string
  confirmSuccessText: string
  confirmErrorHeading: string
  confirmErrorText: string
  changePayURL: string
  totalAmountToPayLabel: string
  allowPartialPayment: boolean
  partialPaymentText: string
  noDefaultHeading: string
  noDefaultText: string
  noDefaultButtonLabel: string
  noDefaultButtonURL: string
  componentId: string
  // Multi-pay props
  selectAllText: string
  selectedCountText: string
  paySelectedText: string
  multiPayProgressText: string
  multiPaySuccessHeading: string
  multiPaySuccessText: string
  multiPayPartialHeading: string
  multiPayPartialText: string
  multiPayErrorHeading: string
  multiPayErrorText: string
  retryFailedText: string
  //minimumPaymentAmount -props
  minimumPaymentAmount: number
}

export type Invoice = {
  id: string
  invoiceDate: string
  dueDate: string
  invoiceNumber: string
  amount: number
  balance: number
  accountId?: string
  body?: string
  status?: string
  invoiceItems?: unknown[]
  invoiceTargetDate?: string
  accountName?: string
  accountNumber?: string
}

export type PaymentResult = {
  invoice: Invoice
  success: boolean
  error?: string
}
