import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

type StaticProps = {
  notFoundText__limio_richtext: string
  componentId: string
  subscriptionIdLabel: string
  showCancelButton: boolean
  cancelButtonText: string
  cancelButtonLink: string
  minimumDaysNotice: number
  requestCancellationLink: string
  insufficientNoticeModalTitle: string
  insufficientNoticeModalBody: string
  insufficientNoticeConfirmText: string
  insufficientNoticeCancelText: string
  cancellationErrorMessage: string
  showCancellationModal: boolean
  showUpdateButton: boolean
  updateButtonText: string
  updateButtonLink: string
  pageTitle: string
  pageSubtitle: string
  billingPlanColumnLabel: string
  unitPriceColumnLabel: string
  existingQuantityColumnLabel: string
  billThroughDateColumnLabel: string
  showEditAddOnsButton: boolean
  editAddOnsButtonText: string
  editAddOnsLink: string
  showAddNewSubscriptionButton: boolean
  addNewSubscriptionButtonText: string
  addNewSubscriptionLink: string
  offerRowColor: string
  offerChipColor: string
  addOnRowColor: string
  addOnChipColor: string
  primaryTextColor: string
  renewalDateLabel: string
}

export function useComponentStaticProps(): StaticProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps<StaticProps>(defaultComponentProps)
  return componentProps
}
