import React from "react"
import { Icon, Text, Button } from "@limio/component-library"
import { faExclamation } from "@fortawesome/pro-light-svg-icons"
import { sanitiseHTML, useTranslation } from "@limio/sdk"

function ErrorState(): React.JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="tw-flex tw-flex-col tw-max-w-sm tw-mx-auto tw-p-4">
      <div className="tw-flex tw-my-2">
        <Icon
          icon={faExclamation}
          className="tw-bg-red-600 tw-text-white tw-w-4 tw-h-4 tw-rounded-lg"
        />
        <Text className="tw-text-red-600 tw-mx-[5px] tw-font-bold">
          {t("Something went wrong")}
        </Text>
      </div>
      <Text className="tw-text-red-600 tw-pb-4">
        {t(
          "We couldn't load your invoices right now. Please try again or check your internet connection."
        )}
      </Text>
      <Button
        className="tw-mx-auto tw-w-fit tw-my-4"
        onClick={() => window.location.reload()}
      >
        {t("Try Again")}
      </Button>
      <Text className="tw-text-primary tw-mx-auto">
        {sanitiseHTML(t("Need help? Contact support."))}
      </Text>
    </div>
  )
}

export default ErrorState
