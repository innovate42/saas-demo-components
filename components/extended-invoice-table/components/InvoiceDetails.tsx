import React from "react"
import { Table, Badge } from "@limio/component-library"
import { useComponentStaticProps } from "../componentStaticProps"
import { formatDate } from "@limio/sdk/date"
import { formatCurrency } from "@limio/sdk/price"
import type { Invoice } from "../types"
import DownloadButton from "./DownloadButton"
import PayButton from "./PayButton"

type Props = {
  invoice: Invoice
  subscriptionCurrency: string
  setShowPayModal: (show: boolean) => void
  setSelectedInvoice: (invoice: Invoice) => void
  isSelected: boolean
  onToggleSelect: (invoice: Invoice) => void
}

function InvoiceDetails({
  invoice,
  subscriptionCurrency,
  setShowPayModal,
  setSelectedInvoice,
  isSelected,
  onToggleSelect
}: Props): React.JSX.Element {
  const { showDueDate, showPrice, allowDownload, showBalance, allowPay } =
    useComponentStaticProps()

  const unpaid = invoice.balance > 0

  return (
    <Table.Row key={invoice.id}>
      {allowPay && (
        <Table.Cell>
          {unpaid && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(invoice)}
              aria-label={`Select invoice ${invoice.invoiceNumber}`}
              className="tw-w-4 tw-h-4 tw-cursor-pointer"
            />
          )}
        </Table.Cell>
      )}
      <Table.Cell>{formatDate(invoice.invoiceDate)}</Table.Cell>
      {showDueDate && <Table.Cell>{formatDate(invoice.dueDate)}</Table.Cell>}
      <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
      {showPrice && (
        <Table.Cell>
          {formatCurrency(invoice.amount, subscriptionCurrency)}
        </Table.Cell>
      )}
      {showBalance && (
        <Table.Cell>
          <Badge variant={unpaid ? "danger" : "success"}>
            {formatCurrency(invoice.balance, subscriptionCurrency)}
          </Badge>
        </Table.Cell>
      )}
      {allowDownload && (
        <Table.Cell>
          <DownloadButton invoice={invoice} />
        </Table.Cell>
      )}
      {allowPay && (
        <Table.Cell>
          {unpaid && (
            <PayButton
              invoice={invoice}
              setShowPayModal={setShowPayModal}
              setSelectedInvoice={setSelectedInvoice}
            />
          )}
        </Table.Cell>
      )}
    </Table.Row>
  )
}

export default InvoiceDetails
