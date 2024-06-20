//@flow
import * as React from "react";
import "../source/style/style.css";
import { useSubscriptions} from "@limio/sdk"
import { SubscriptionInfo } from "./components/SubscriptionInfo.js";

type Props = {
  goBackHeading: string,
  goBackLink: string,
  cancelLink: string,
  switchLink: string,
  changePaymentLink: string
}

function PaymentsTable({
  goBackHeading,
   goBackLink,
    cancelLink,
     switchLink,
      changePaymentLink,
      cardHeading,
      cardSubheading,
      paypalHeading,
      paypalSubheading,
      directDebitHeading,
      directDebitSubheading,
      achBankTransferHeading,
      achBankTransferSubheading,
      googlePayHeading,
      googlePaySubheading,
      firstNameLabel,
    lastNameLabel,
    address1Label,
    address2Label,
    cityLabel,
    stateLabel,
    postalCodeLabel,
    countryLabel,
    invalidFirstNameMessage,
    invalidLastNameMessage,
    invalidAddressMessage,
    invalidCityMessage,
    invalidStateMessage,
    invalidPostalCodeMessage,
    invalidCountryMessage,
    showCheckbox
}:  Props): React.Node {
  const {subscriptions} = useSubscriptions()

  
    return (
      <div className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto py-20 px-8">
        <div className="flex justify-end ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#9cafa3" className="h-6 w-6" onClick={() => (window.location.href = goBackLink)}>
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
        </svg>
      </div>
      <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Payment details</p>
      {
        subscriptions ?
        
        subscriptions.map((subscription, i) => (
    <div className="mb-8"key={`${subscription.id}-${i}`}>
          <SubscriptionInfo key={subscription.id} subscription={subscription} cancelLink={cancelLink} switchLink={switchLink} changePaymentLink={changePaymentLink}
          paymentHeadings={{
            zuora_bank_transfer_ach: {
              heading: achBankTransferHeading,
              subheading: achBankTransferSubheading
            },
            zuora_card: {
              heading: cardHeading,
              subheading: cardSubheading
            },
            nexi: {
              heading: cardHeading,
              subheading: cardSubheading
            },
            zuora_upc_datatrans: {
              heading: cardHeading,
              subheading: cardSubheading
            },
            credit_card: {
              heading: cardHeading,
              subheading: cardSubheading
            },
            zuora_paypal: {
              heading: paypalHeading,
              subheading: paypalSubheading
            },
            zuora_dd: {
              heading: directDebitHeading,
              subheading: directDebitSubheading
            },
            google_pay: {
              heading: googlePayHeading,
              subheading: googlePaySubheading
            }
          }}
          addressLabels={{
            firstNameLabel,
            lastNameLabel,
            address1Label,
            address2Label,
            cityLabel,
            stateLabel,
            postalCodeLabel,
            countryLabel
          }}
          invalidMessages={{
            invalidFirstNameMessage,
            invalidLastNameMessage,
            invalidAddressMessage,
            invalidCityMessage,
            invalidStateMessage,
            invalidPostalCodeMessage,
            invalidCountryMessage
          }}
          showCheckbox={showCheckbox}
          />
          </div>
        ))
        :
        <p>Loading</p>
      }
      <div>
      </div>
        </div>
      </div>
    )
}

export default PaymentsTable