import * as React from "react"
import { useState } from "react"
import { ErrorBoundary } from "@limio/sdk"
import { Error } from "./helpers/Error.js"
import { Subscriptions } from "./components/Subscriptions.js"
import "./index.css"
import { Alert } from "@limio/design-system"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

type Props = {
  showGoBackButton: boolean,
  cancelLink: string,
  cancelHeading: string,
  switchLink: string,
  switchHeading: string,
  changePaymentLink: string,
  reactivateCancelledSubUrl: string,
  changePaymentHeading: string,
  goBackLink: string,
  goBackHeading: string,
  subscriptionsHeading: string,
  productName: string,
  notFoundText__limio_richtext: string,
  pendingChangeMessage: string,
  noAddOnsText: string,
  componentId: string,
}

export function OrdersTable(props) {
  const { notFoundText__limio_richtext, showGoBackButton, goBackLink, goBackHeading, subscriptionsHeading, componentId } = props

  const [toasts, setToasts] = useState({})
  return (
    <div className="orders-table flat-view" id={componentId}>
      <ErrorBoundary
        fallback={
          <Error
            text={notFoundText__limio_richtext}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user-times"
                className="svg-inline--fa fa-user-times fa-w-20"
                role="img"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M589.6 240l45.6-45.6c6.3-6.3 6.3-16.5 0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8 0L544 194.4l-45.6-45.6c-6.3-6.3-16.5-6.3-22.8 0l-22.8 22.8c-6.3 6.3-6.3 16.5 0 22.8l45.6 45.6-45.6 45.6c-6.3 6.3-6.3 16.5 0 22.8l22.8 22.8c6.3 6.3 16.5 6.3 22.8 0l45.6-45.6 45.6 45.6c6.3 6.3 16.5 6.3 22.8 0l22.8-22.8c6.3-6.3 6.3-16.5 0-22.8L589.6 240zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                />
              </svg>
            }
          />
        }
      >
        {Object.keys(toasts).map(notification => {
          const { show, message, variant = "success" } = toasts[notification]
          return (
            <Alert
              key={notification}
              color="info"
              variant={variant}
              isOpen={show}
              toggle={() => setToasts({ ...toasts, [notification]: { ...toasts[notification], show: false } })}
              text={message}
            >
              {message}
            </Alert>
          )
        })}
        {showGoBackButton && (
          <div className="orders-table-go-back" onClick={() => (window.location.href = goBackLink)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {goBackHeading}
          </div>
        )}

        <>
          <div className="orders-table-heading">{subscriptionsHeading}</div>
          <div className="orders-table-body">
            <Subscriptions updateNotification={notification => setToasts({ ...toasts, ...notification })} propsObject={props} />
          </div>
        </>
      </ErrorBoundary>
    </div>
  )
}

export default OrdersTable
