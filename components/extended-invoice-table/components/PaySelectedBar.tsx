import React from "react"
import { Button, Text } from "@limio/component-library"
import { formatCurrency } from "@limio/sdk/price"
import { useComponentStaticProps } from "../componentStaticProps"
import { parseString } from "@limio/shop/src/helpers/string"
import type { Invoice } from "../types"

type PaySelectedBarProps = {
  selectedInvoices: Invoice[]
  currency: string
  onPaySelected: () => void
}

function PaySelectedBar({
  selectedInvoices,
  currency,
  onPaySelected
}: PaySelectedBarProps): React.JSX.Element | null {
  const { selectedCountText, paySelectedText } = useComponentStaticProps()

  if (selectedInvoices.length === 0) return null

  const totalAmount = selectedInvoices.reduce(
    (sum, inv) => sum + inv.balance,
    0
  )

  return (
    <div className="tw-sticky tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-border-t tw-border-gray-200 tw-shadow-lg tw-p-4 tw-mt-4 tw-rounded-lg tw-z-40">
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-4 tw-flex-wrap">
        <div className="tw-flex tw-items-center tw-gap-4">
          <Text className="tw-text-primary tw-font-semibold">
            {parseString(selectedCountText, {
              count: String(selectedInvoices.length),
              total: formatCurrency(totalAmount, currency)
            })}
          </Text>
          <Text className="tw-text-lg tw-font-bold tw-text-primary">
            {formatCurrency(totalAmount, currency)}
          </Text>
        </div>
        <Button onClick={onPaySelected}>{paySelectedText}</Button>
      </div>
    </div>
  )
}

export default PaySelectedBar
