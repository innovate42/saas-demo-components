import React from "react"
import { Table, TablePagination } from "@limio/component-library"
import { useTranslation } from "@limio/sdk"
import { useComponentStaticProps } from "../componentStaticProps"
import InvoiceDetails from "./InvoiceDetails"
import type { Invoice } from "../types"

type InvoiceTableLayoutProps = {
  invoices: Invoice[]
  hasInvoices: boolean
  page: number
  pageSize: number
  nextPage: boolean
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  subscriptionCurrency: string
  setShowPayModal: (show: boolean) => void
  setSelectedInvoice: (invoice: Invoice) => void
  selectedInvoices: Invoice[]
  onToggleSelect: (invoice: Invoice) => void
  onToggleSelectAll: () => void
}

function InvoiceTableLayout({
  invoices,
  hasInvoices,
  page,
  pageSize,
  nextPage,
  setPage,
  setPageSize,
  subscriptionCurrency,
  setShowPayModal,
  setSelectedInvoice,
  selectedInvoices,
  onToggleSelect,
  onToggleSelectAll
}: InvoiceTableLayoutProps): React.JSX.Element {
  const { t } = useTranslation()
  const {
    dateHeader,
    dueDateHeader,
    referenceHeader,
    priceHeader,
    balanceHeader,
    downloadInvoiceHeader,
    payInvoiceHeader,
    showDueDate,
    showPrice,
    showBalance,
    allowDownload,
    allowPay,
    selectAllText
  } = useComponentStaticProps()

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

  const colSpan =
    4 +
    [showDueDate, showPrice, showBalance, allowDownload, allowPay].filter(
      Boolean
    ).length +
    (allowPay ? 1 : 0) // extra column for checkboxes

  return (
    <Table>
      <Table.Header>
        <Table.HeaderRow>
          {allowPay && (
            <Table.Head>
              <div className="tw-flex tw-items-center tw-gap-2">
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
              </div>
            </Table.Head>
          )}
          <Table.Head>{dateHeader}</Table.Head>
          {showDueDate && <Table.Head>{dueDateHeader}</Table.Head>}
          <Table.Head>{referenceHeader}</Table.Head>
          {showPrice && <Table.Head>{priceHeader}</Table.Head>}
          {showBalance && <Table.Head>{balanceHeader}</Table.Head>}
          {allowDownload && <Table.Head>{downloadInvoiceHeader}</Table.Head>}
          {allowPay && <Table.Head>{payInvoiceHeader}</Table.Head>}
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {hasInvoices &&
          invoices.map((invoice) => (
            <InvoiceDetails
              key={invoice.id}
              invoice={invoice}
              subscriptionCurrency={subscriptionCurrency}
              setSelectedInvoice={setSelectedInvoice}
              setShowPayModal={setShowPayModal}
              isSelected={selectedInvoices.some((s) => s.id === invoice.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
      </Table.Body>
      {(page > 1 || nextPage) && (
        <TablePagination
          currentPage={page}
          pageSize={pageSize}
          hasNextPage={nextPage}
          onPageChange={(newPage: number) => {
            setPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setPageSize(newPageSize)
            setPage(1)
          }}
          resultsPerPageLabel={t("Results per page")}
          colSpan={colSpan}
        />
      )}
    </Table>
  )
}

export default InvoiceTableLayout
