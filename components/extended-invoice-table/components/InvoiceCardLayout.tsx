import React from "react"
import {
  Table,
  Text,
  TablePagination,
  Badge,
  Separator
} from "@limio/component-library"
import { useTranslation } from "@limio/sdk"
import { formatCurrency } from "@limio/sdk/price"
import { formatDate } from "@limio/sdk/date"
import { useComponentStaticProps } from "../componentStaticProps"
import PayButton from "./PayButton"
import DownloadButton from "./DownloadButton"
import type { Invoice } from "../types"

type InvoiceCardProps = {
  invoice: Invoice
  isLast: boolean
  subscriptionCurrency: string
  setShowPayModal: (show: boolean) => void
  setSelectedInvoice: (invoice: Invoice) => void
  isSelected: boolean
  onToggleSelect: (invoice: Invoice) => void
}

function InvoiceCard({
  invoice,
  isLast,
  subscriptionCurrency,
  setShowPayModal,
  setSelectedInvoice,
  isSelected,
  onToggleSelect
}: InvoiceCardProps): React.JSX.Element {
  const {
    dateHeader,
    dueDateHeader,
    referenceHeader,
    priceHeader,
    balanceHeader,
    showDueDate,
    showPrice,
    showBalance,
    allowDownload,
    allowPay
  } = useComponentStaticProps()

  const unpaid = invoice.balance > 0

  return (
    <div>
      <div className="tw-grid tw-w-full tw-grid-cols-[auto_1fr_auto] tw-gap-4">
        {allowPay && (
          <div className="tw-flex tw-items-start tw-pt-1">
            {unpaid && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(invoice)}
                aria-label={`Select invoice ${invoice.invoiceNumber}`}
                className="tw-w-4 tw-h-4 tw-cursor-pointer"
              />
            )}
          </div>
        )}
        <div className="tw-grid tw-gap-2 tw-grid-cols-[7rem_1fr]">
          <Text className="tw-font-semibold">{dateHeader}</Text>
          <Text>{formatDate(invoice.invoiceDate)}</Text>
          {showDueDate && (
            <>
              <Text className="tw-font-semibold">{dueDateHeader}</Text>
              <Text>{formatDate(invoice.dueDate)}</Text>
            </>
          )}
          <Text className="tw-font-semibold">{referenceHeader}</Text>
          <Text>{invoice.invoiceNumber}</Text>
          {showPrice && (
            <>
              <Text className="tw-font-semibold">{priceHeader}</Text>
              <Text>
                {formatCurrency(invoice.amount, subscriptionCurrency)}
              </Text>
            </>
          )}
          {showBalance && (
            <>
              <Text className="tw-font-semibold">{balanceHeader}</Text>
              <Badge
                className="tw-w-fit"
                variant={invoice.balance > 0 ? "danger" : "success"}
              >
                {formatCurrency(invoice.balance, subscriptionCurrency)}
              </Badge>
            </>
          )}
        </div>
        <div className="tw-flex tw-flex-col tw-justify-start tw-items-end tw-gap-2">
          {allowDownload && <DownloadButton invoice={invoice} />}
          {allowPay && invoice.balance > 0 && (
            <PayButton
              invoice={invoice}
              setShowPayModal={setShowPayModal}
              setSelectedInvoice={setSelectedInvoice}
            />
          )}
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  )
}

type InvoiceCardLayoutProps = {
  invoices: Invoice[]
  page: number
  nextPage: boolean
  setPage: (page: number) => void
  subscriptionCurrency: string
  setShowPayModal: (show: boolean) => void
  setSelectedInvoice: (invoice: Invoice) => void
  selectedInvoices: Invoice[]
  onToggleSelect: (invoice: Invoice) => void
  onToggleSelectAll: () => void
}

function InvoiceCardLayout({
  invoices,
  page,
  nextPage,
  setPage,
  subscriptionCurrency,
  setShowPayModal,
  setSelectedInvoice,
  selectedInvoices,
  onToggleSelect,
  onToggleSelectAll
}: InvoiceCardLayoutProps): React.JSX.Element {
  const { t } = useTranslation()
  const { allowPay, selectAllText } = useComponentStaticProps()

  const unpaidInvoices = invoices.filter((inv) => inv.balance > 0)
  const allUnpaidSelected =
    unpaidInvoices.length > 0 &&
    unpaidInvoices.every((inv) =>
      selectedInvoices.some((s) => s.id === inv.id)
    )
  const someSelected =
    !allUnpaidSelected &&
    unpaidInvoices.some((inv) =>
      selectedInvoices.some((s) => s.id === inv.id)
    )

  return (
    <>
      {allowPay && unpaidInvoices.length > 0 && (
        <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
          <input
            type="checkbox"
            checked={allUnpaidSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected
            }}
            onChange={onToggleSelectAll}
            aria-label={selectAllText}
            className="tw-w-4 tw-h-4 tw-cursor-pointer"
          />
          <Text className="tw-text-sm tw-text-muted">{selectAllText}</Text>
        </div>
      )}
      {invoices.map((invoice, index) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          isLast={index === invoices.length - 1}
          subscriptionCurrency={subscriptionCurrency}
          setShowPayModal={setShowPayModal}
          setSelectedInvoice={setSelectedInvoice}
          isSelected={selectedInvoices.some((s) => s.id === invoice.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
      {(page > 1 || nextPage) && (
        <Table className="tw-w-full tw-mt-4">
          <TablePagination
            currentPage={page}
            pageSize={10}
            hasNextPage={nextPage}
            onPageChange={(newPage: number) => {
              setPage(newPage)
            }}
            resultsPerPageLabel={t("Results per page")}
            colSpan={1}
            showPageSizeSelector={false}
          />
        </Table>
      )}
    </>
  )
}

export default InvoiceCardLayout
