import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react"
import { Table, RadioDropdown, Skeleton, Text, Icon, useBreakpoint } from "@limio/component-library"
import { useSubscriptions, useUserInvoices, useUserAccountInformation, ErrorBoundary } from "@limio/sdk"
import { faFilter, faFilterCircleXmark, faCircleCheck, faTriangleExclamation, faTimes } from "@fortawesome/pro-light-svg-icons"
import { useComponentStaticProps } from "./componentStaticProps"
import PayModal from "./components/PayModal"
import PaySelectedBar from "./components/PaySelectedBar"
import ErrorState from "./components/ErrorState"
import InvoiceCardLayout from "./components/InvoiceCardLayout"
import InvoiceTableLayout from "./components/InvoiceTableLayout"
import { getSubscriptionCurrency } from "@limio/subscription-helpers/src/shop/helpers/checks"
import type { Invoice } from "./types"

const INVOICE_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid"
}

// Fetch all pages upfront so client-side dedup is accurate — the API can return the same
// invoice across pages, and we can't know the true count until all pages are loaded.
// using 40 items per page to avoid getting rejected by Zuora's API and also follows SDK recommendations
const FETCH_PAGE_SIZE = 40

const InvoicesTable = (): React.JSX.Element => {
  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <InvoicesTableContent />
    </ErrorBoundary>
  )
}

function InvoicesTableContent(): React.JSX.Element {
  const { balanceHeader, noInvoicesText, filtersBalancePaidText, filtersBalanceUnpaidText, filtersButtonText, allowPay } = useComponentStaticProps()
  const { subscriptions: allSubscriptions = [] } = useSubscriptions()
  const { accountInformation } = useUserAccountInformation()
  const zuoraAccountId = accountInformation?.basicInfo?.id
  const subscriptions = zuoraAccountId
    ? allSubscriptions.filter(sub => sub.data?.tracking?.zuoraAccountId === zuoraAccountId)
    : allSubscriptions
  const [fetchPage, setFetchPage] = useState(1)
  const [accumulatedInvoices, setAccumulatedInvoices] = useState<Invoice[]>([])
  const [displayPage, setDisplayPage] = useState(1)
  const [displayPageSize, setDisplayPageSize] = useState(10)
  const { invoices = [], nextPage: hasNextFetchPage, revalidate } = useUserInvoices(FETCH_PAGE_SIZE, fetchPage)
  const { isMobile } = useBreakpoint()

  const [showPayModal, setShowPayModal] = useState(false)
  const [filter, setFilter] = useState<string[]>(["paid", "unpaid"])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([])
  const [isMultiPayMode, setIsMultiPayMode] = useState(false)
  const [paymentNotification, setPaymentNotification] = useState<{ message: string; isPartial: boolean } | null>(null)

  useEffect(() => {
    if (!paymentNotification) return
    const timer = setTimeout(() => setPaymentNotification(null), 5000)
    return () => clearTimeout(timer)
  }, [paymentNotification])

  useEffect(() => {
    if (invoices.length === 0) return
    setAccumulatedInvoices(prev => [...prev, ...invoices])
    if (hasNextFetchPage) {
      setFetchPage(p => p + 1)
    }
  }, [invoices, hasNextFetchPage])

  useEffect(() => {
    setDisplayPage(1)
    setSelectedInvoices([])
  }, [filter])

  const filteredInvoices = useMemo(() => {
    if (accumulatedInvoices.length === 0) return []

    const seen = new Set<string>()
    return accumulatedInvoices
      .filter((invoice) => {
        if (seen.has(invoice.id)) return false
        seen.add(invoice.id)
        const status = invoice.balance > 0 ? INVOICE_STATUS.UNPAID : INVOICE_STATUS.PAID
        return filter.length === 0 || filter.includes(status)
      })
      .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
  }, [accumulatedInvoices, filter])

  const unpaidInvoices = useMemo(() => filteredInvoices.filter((inv) => inv.balance > 0), [filteredInvoices])

  // if you have 60 filtered invoices and page size is 10, on page 1 you see 1 to 10, relating to indexes 0 to 9,
  // and on page 2 you see 11 to 20, relating to indexes 10 to 19
  const paginatedInvoices = useMemo(() => {
    const start = (displayPage - 1) * displayPageSize
    return filteredInvoices.slice(start, start + displayPageSize)
  }, [filteredInvoices, displayPage, displayPageSize])

  const displayNextPage = displayPage * displayPageSize < filteredInvoices.length
  const hasInvoices = accumulatedInvoices.length > 0
  const subscriptionCurrency = getSubscriptionCurrency(subscriptions[0])

  const handleToggleSelect = useCallback((invoice: Invoice) => {
    setSelectedInvoices((prev) => {
      const exists = prev.some((inv) => inv.id === invoice.id)
      if (exists) {
        return prev.filter((inv) => inv.id !== invoice.id)
      }
      return [...prev, invoice]
    })
  }, [])

  const handleToggleSelectAll = useCallback(() => {
    setSelectedInvoices((prev) => {
      const allSelected = unpaidInvoices.length > 0 && unpaidInvoices.every((inv) => prev.some((s) => s.id === inv.id))

      if (allSelected) {
        // Deselect all unpaid on current page
        const unpaidIds = new Set(unpaidInvoices.map((inv) => inv.id))
        return prev.filter((inv) => !unpaidIds.has(inv.id))
      }

      // Select all unpaid on current page (merge with existing selections)
      const existingIds = new Set(prev.map((inv) => inv.id))
      const newSelections = unpaidInvoices.filter((inv) => !existingIds.has(inv.id))
      return [...prev, ...newSelections]
    })
  }, [unpaidInvoices])

  const handlePaySelected = useCallback(() => {
    if (selectedInvoices.length === 1) {
      setSelectedInvoice(selectedInvoices[0])
      setIsMultiPayMode(false)
    } else {
      setSelectedInvoice(null)
      setIsMultiPayMode(true)
    }
    setShowPayModal(true)
  }, [selectedInvoices])

  const handleRevalidate = useCallback(() => {
    setAccumulatedInvoices([])
    setFetchPage(1)
    setDisplayPage(1)
    revalidate?.()
  }, [revalidate])

  const handlePaymentComplete = useCallback(({ message, isPartial }: { message: string; isPartial: boolean }) => {
    setSelectedInvoices([])
    setIsMultiPayMode(false)
    handleRevalidate()
    setPaymentNotification({ message, isPartial })
  }, [handleRevalidate])

  return (
    <div className="tw-max-w-4xl tw-mx-auto p-4">
      {paymentNotification && (
        <div
          className={`tw-flex tw-items-center tw-justify-between tw-p-4 tw-mb-4 tw-rounded-lg tw-border ${
            paymentNotification.isPartial
              ? "tw-bg-yellow-50 tw-border-yellow-200 tw-text-yellow-800"
              : "tw-bg-green-50 tw-border-green-200 tw-text-green-800"
          }`}
        >
          <div className="tw-flex tw-items-center tw-gap-2">
            <Icon icon={paymentNotification.isPartial ? faTriangleExclamation : faCircleCheck} size="sm" />
            <Text size="small" className={paymentNotification.isPartial ? "tw-text-yellow-800" : "tw-text-green-800"}>
              {paymentNotification.message}
            </Text>
          </div>
          <Icon icon={faTimes} size="sm" onClick={() => setPaymentNotification(null)} className="tw-cursor-pointer" />
        </div>
      )}
      {hasInvoices && (
        <div className="tw-mb-2 min-w-fit">
          <RadioDropdown
            title={balanceHeader}
            icon={filter.length === 1 ? faFilterCircleXmark : faFilter}
            buttonText={filtersButtonText}
            options={[
              { label: filtersBalancePaidText, value: "paid" },
              { label: filtersBalanceUnpaidText, value: "unpaid" }
            ]}
            selectedValues={filter}
            onChange={(value, checked) => {
              setFilter((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
            }}
          />
        </div>
      )}
      {isMobile ? (
        <InvoiceCardLayout
          invoices={paginatedInvoices}
          page={displayPage}
          nextPage={displayNextPage}
          setPage={setDisplayPage}
          subscriptionCurrency={subscriptionCurrency}
          setShowPayModal={setShowPayModal}
          setSelectedInvoice={setSelectedInvoice}
          selectedInvoices={selectedInvoices}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      ) : (
        <InvoiceTableLayout
          invoices={paginatedInvoices}
          hasInvoices={hasInvoices}
          page={displayPage}
          pageSize={displayPageSize}
          nextPage={displayNextPage}
          setPage={setDisplayPage}
          setPageSize={setDisplayPageSize}
          subscriptionCurrency={subscriptionCurrency}
          setShowPayModal={setShowPayModal}
          setSelectedInvoice={setSelectedInvoice}
          selectedInvoices={selectedInvoices}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}
      {!hasInvoices && (
        <Text size="medium" className="tw-flex tw-w-full tw-p-8 tw-justify-center tw-text-text-secondary">
          {noInvoicesText}
        </Text>
      )}

      {/* Floating pay bar for multi-select */}
      {allowPay && selectedInvoices.length > 0 && (
        <PaySelectedBar selectedInvoices={selectedInvoices} currency={subscriptionCurrency} onPaySelected={handlePaySelected} />
      )}

      <Suspense fallback={<PayModal.Skeleton />}>
        {showPayModal && (selectedInvoice || isMultiPayMode) && (
          <PayModal
            setShowPayModal={setShowPayModal}
            selectedInvoice={selectedInvoice}
            selectedInvoices={isMultiPayMode ? selectedInvoices : []}
            currency={subscriptionCurrency}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </Suspense>
    </div>
  )
}

function InvoicesTableSkeleton(): React.JSX.Element {
  const { isMobile } = useBreakpoint()

  return isMobile ? (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="tw-m-6">
          <Skeleton className="tw-w-full tw-h-36" />
        </div>
      ))}
    </div>
  ) : (
    <div className="tw-max-w-4xl tw-mx-auto p-4">
      <Table>
        <Table.Header>
          <Table.HeaderRow>
            {Array.from({ length: 6 }).map((_, i) => (
              <Table.Head key={i}>
                <Skeleton className="tw-w-24 tw-h-6" />
              </Table.Head>
            ))}
          </Table.HeaderRow>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 3 }).map((_, index) => (
            <Table.Row key={index}>
              {Array.from({ length: 6 }).map((_, cellIndex) => (
                <Table.Cell key={cellIndex}>
                  <Skeleton className="tw-w-24 tw-h-4" />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

InvoicesTable.Skeleton = InvoicesTableSkeleton

export default InvoicesTable
