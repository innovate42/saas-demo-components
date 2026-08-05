import React from "react"
import { Button, Icon } from "@limio/component-library"
import { faCreditCard } from "@fortawesome/pro-light-svg-icons"
import { useComponentStaticProps } from "../componentStaticProps"
import type { Invoice } from "../types"

type PayButtonProps = {
  invoice: Invoice
  setShowPayModal: (open: boolean) => void
  setSelectedInvoice: (invoice: Invoice) => void
}

const PayButton = ({
  invoice,
  setShowPayModal,
  setSelectedInvoice
}: PayButtonProps): React.JSX.Element => {
  const { payInvoiceTooltipText } = useComponentStaticProps()
  return (
    <Button
      size="icon"
      onClick={() => {
        setShowPayModal(true)
        setSelectedInvoice(invoice)
      }}
      variant="text"
      aria-label={`Pay invoice ${invoice.invoiceNumber}`}
    >
      <Icon icon={faCreditCard} size="lg" tooltip={payInvoiceTooltipText} />
    </Button>
  )
}

export default PayButton
