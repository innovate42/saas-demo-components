//@flow
import * as React from "react";
import "../source/style/style.css";
import { cancelIcons, helpIcons } from "./cancelIcons.js"
import { ConfirmDialog } from "./components/ConfirmDialog.js";
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"

type Props = {
  title: String,
  subtitle: String,
  reasons: Array<Object>,
  feedbackPlaceholder: String,
  redirectUrl: String,
  confirmationTitle: String,
  confirmationBody: String,
  confirmationOk: String,
  confirmationCancel: String
}

function CancelSurvey({title, subtitle, reasons, feedbackPlaceholder, redirectUrl, confirmationTitle, confirmationBody, confirmationOk, confirmationCancel }: Props): React.Node {
const icons = cancelIcons()
const ctaIcons = helpIcons()
const [selectedReason, setSelectedReason] = React.useState(null)
const [feedback, setFeedback] = React.useState({})
const [showDialog, setShowDialog] = React.useState(false)

const onReasonSelect = (reason) => {
setSelectedReason(reason)
}

const onCtaClick = (url) => {
  window.location.href = url
}

const handleFeedbackChange = (value, type) => {
  setFeedback({
    ...feedback,
    [type]: value
  })
}

const handleCancel = () => {
  let params = new URL(window.location).searchParams

  return sendOrder({
    order_type: "cancel_subscription",
    data: {
      reason: {
        id: selectedReason.id,
        feedback: feedback[selectedReason.id]
      }
    },
    subscriptionId: params.get("subId"),
    subscriptionRef: params.get("subRef"),
    external_id: params.get("subId") || params.get("subRef")
  })
}

const renderForm = () => {
  const icon = selectedReason.ctaImage ? <img src={selectedReason.ctaImage} alt={selectedReason.ctaText} /> : ctaIcons[selectedReason.id] || ctaIcons["image"]
  let params = new URL(window.location).searchParams

  if(selectedReason.showCta__limio_boolean){
    return(
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center border border-gray-100 rounded-lg shadow dark:border-gray-600  dark:bg-gray-800 p-8 cursor-pointer hover:opacity-50 mt-4 max-h-56 w-56"
            onClick={() => onCtaClick(`${selectedReason.url}?subId=${params.get("subId")}&reason=${selectedReason.id}`)}
        >
 <div className="h-20 w-20 mb-1">
        {icon}
      </div>
      <p className="dark:text-white text-center">{selectedReason.ctaText}</p>
      </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <input
      type="textarea"
      name="text"
      placeholder={feedbackPlaceholder}
      className="w-full h-10 px-4 py-2 border rounded-md"
      value={feedback[selectedReason.id] || ""}
      onChange={e => handleFeedbackChange(e.target.value, selectedReason.id)}
      />
    </div>
  )

}


  return (
    <div className="bg-white dark:bg-gray-900 flex h-full items-center justify-center">
      <div className="max-w-screen-xl md:my-16 p-8">
        {showDialog && 
        <ConfirmDialog 
        onCancel={() => setShowDialog(false)}
        onConfirm={() => handleCancel()}
        heading={confirmationTitle}
        body={confirmationBody}
        confirmText={confirmationOk}
        cancelText={confirmationCancel}
        redirectUrl={redirectUrl}
        setSelectedReason={setSelectedReason}
        />}
        <div className="border border-gray-100 rounded-lg shadow dark:border-gray-600 p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:my-4">{title}</h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 my-8" >
          {reasons &&
          reasons.map((reason, index) => {
            const { id, label, buttonImage } = reason
            const icon = buttonImage ? <img src={buttonImage} alt={label} /> : icons[id]

            return (
              <div className="flex flex-col items-center border border-gray-100 rounded-lg shadow dark:border-gray-600  dark:bg-gray-800 p-8 cursor-pointer hover:opacity-50"
              onClick={() => onReasonSelect(reason)}
              key={`${reason.id}-${index}`}
              >
                <div className="w-20 h-20">{icon}</div>
                <h4 className=" text-gray-900 dark:text-white">{label}</h4>
              </div>
            )
          })
          }

        </div>
        {
          selectedReason && (
            <div>
          <div>{renderForm()}</div>
          <div className="mt-4 flex flex-col md:flex-row justify-end">
            <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4">Go Back</button>
            <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
            onClick={() => setShowDialog(true)}
            >Cancel My Subscription</button>
          </div>
          </div>
          )
        }
        </div>
      </div>

    </div>
  );
}

export default CancelSurvey