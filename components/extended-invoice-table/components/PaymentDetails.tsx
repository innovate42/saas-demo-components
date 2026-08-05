import React from "react"
import { Separator, Text, Button, PaymentIcon } from "@limio/component-library"
import {
  summarisePaymentMethod,
  getPaymentMethodLabel
} from "@limio/shop/src/shop/payment_method/helpers"
import type { PaymentMethod } from "@limio/types"
import { useTranslation } from "@limio/sdk"
import { useComponentStaticProps } from "../componentStaticProps"

type PaymentDetailsProps = {
  total: number
  currency: string
  defaultPaymentMethod: PaymentMethod
}

function PaymentDetails({
  defaultPaymentMethod
}: PaymentDetailsProps): React.JSX.Element {
  const { changePayURL } = useComponentStaticProps()
  const { t } = useTranslation()

  const { paymentDescription } = summarisePaymentMethod(defaultPaymentMethod)
  const label = getPaymentMethodLabel(defaultPaymentMethod)

  return (
    <div className="tw-mt-4">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center tw-gap-2">
          <PaymentIcon type={label} />
          <Text className="tw-text-primary">{paymentDescription}</Text>
        </div>
        <Button
          variant="text"
          onClick={() => (window.location = changePayURL)}
          size="sm"
        >
          {t("Change")}
        </Button>
      </div>
      <Separator spacing="small" />
    </div>
  )
}

export default PaymentDetails
