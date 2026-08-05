import React, { useState } from "react"
import { Button, Icon } from "@limio/component-library"
import { faArrowDownToBracket } from "@fortawesome/pro-light-svg-icons"
import { useComponentStaticProps } from "../componentStaticProps"
import type { Invoice } from "../types"
import { useLimioContext, useUser, LimioFetchers } from "@limio/sdk"
import * as Sentry from "@sentry/browser"

type DownloadButtonProps = {
  invoice: Invoice
}

const DownloadButton = ({
  invoice
}: DownloadButtonProps): React.JSX.Element => {
  const { downloadInvoiceTooltipText } = useComponentStaticProps()
  const { invoiceNumber } = invoice
  const { token } = useUser()
  const { isInPageBuilder } = useLimioContext()
  const [downloading, setDownloading] = useState(false)

  const downloadBlob = (blobURL: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = blobURL
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(blobURL)
  }

  async function generateInvoiceBlob(id: string): Promise<string | null> {
    const blob = await LimioFetchers.invoiceFetch(
      `api/plugins/zuora/invoices/file/${id}`,
      token
    )
    const objectURL = window.URL.createObjectURL(blob)
    return objectURL
  }

  const fetchInvoice = async (id: string) => {
    setDownloading(true)
    let fileName

    try {
      if (!isInPageBuilder) {
        const blobURL = await generateInvoiceBlob(id)
        if (blobURL) {
          if (invoiceNumber) {
            fileName = invoiceNumber
          } else {
            fileName = `Invoice-${id}`
          }
          downloadBlob(blobURL, fileName)
        }
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    setDownloading(false)
  }

  return (
    <Button
      size="icon"
      onClick={() => fetchInvoice(invoice.id)}
      variant="text"
      aria-label={`Download invoice ${invoice.invoiceNumber}`}
      disabled={downloading}
    >
      <Icon
        icon={faArrowDownToBracket}
        size="lg"
        tooltip={downloadInvoiceTooltipText}
      />
    </Button>
  )
}

export default DownloadButton
