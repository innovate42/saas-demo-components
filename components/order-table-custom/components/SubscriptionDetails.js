//@flow
import * as React from "react"
import { useOfferInfo, useSubscriptions, useTranslation } from "@limio/sdk"
import { Table } from "@limio/design-system"
import { formatCurrency, stripPathToProductName, checkCurrentSchedule, formatDate } from "../helpers/index.js"
import { DateTime } from "@limio/date"
import * as R from "ramda"

type Props = {
  subscription: UserSubscription,
  headings: { [key: string]: string },
  links: { [key: string]: string },
  showPendingChange: boolean,
  notCancelledOrOneOff: boolean,
  schedule: LimioObject<Schedule>[],
  currentOffers: Array<ElasticOffer>,
  setIsEditingAddress: boolean => void,
  propsObject: { [key: string]: any }
}

const isExpired = addOn => {
  return addOn.data.end !== undefined && DateTime.fromISO(addOn.data.end).toFormat("yyyy-MM-dd") <= DateTime.local().toISODate()
}

export function SubscriptionDetails({ currentOffers = [], propsObject }: Props): React.Node {
  let { productName, noAddOnsText } = propsObject

  const dateFormat = "DATE_SHORT"

  const { t } = useTranslation()
  const { subscriptions } = useSubscriptions()
  const { schedule, addOns } = subscriptions[0]
  const ownedAddOns = addOns.filter(addOn => addOn.status === "active" && !isExpired(addOn))

  const currentOffer = currentOffers.find(offer => offer.status === "active") || currentOffers.length === 1 ? currentOffers[0] : null
  const offer = currentOffer?.data?.offer

  let { productNames, displayName } = useOfferInfo(offer)

  const status = subscriptions[0].status ?? "Active"
  const currency = subscriptions[0].data?.price?.currency ?? "USD"

  const nextSchedule = checkCurrentSchedule(schedule)

  const getProductName = () => {
    const productDisplayName = productName ? displayName?.replace(productName, "").trim() : displayName // Do not want to repeat product name in the label

    return productName ? (
      <div className="product-name">
        <p>{productDisplayName}</p>
      </div>
    ) : (
      <div className="product-name">
        {productNames.map(product => {
          return (
            <>
              <em key={product}>{product}</em>
              <br></br>
            </>
          )
        })}
      </div>
    )
  }

  const getPrice = () => {
    // recurring payment
    if (schedule.length === 1) {
      return formatCurrency(schedule[0].data?.amountWithoutTax, currency)
    }
    // no charges in the future
    if (R.isNil(nextSchedule?.data.amountWithoutTax)) {
      return "No pending payments"
    }

    const result = formatCurrency(nextSchedule?.data.amountWithoutTax, currency)
    return result
  }

  return (
    <div className="orders-table-table-header">
      <div className="orders-table-table-body-container">
        <div className="orders-table-table-body">
          <Table borderless>
            <thead>
              <tr className="border-bottom border-dark">
                <th>{t("Status")}</th>
                <th>{t("Plan")}</th>
                <th>{t("Billing Plan")}</th>
                <th>{"Billing Frequency"}</th>
                <th>{t("Price")}</th>
                <th>{t("Start Date")}</th>
                <th>{t("Add-Ons")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* status should be active or cancelled. implement is active */}
                <td className={`status-label ${status}`}>{status}</td>
                <td>{getProductName()}</td>
                <td>{offer.data.productBundles[0].rate_plan}</td>
                {/*TODO: implement the actual billing frequency */}
                <td>{offer.data.productBundles[0].rate_plan}</td>
                {/* this  should work for external pricing*/}
                {<td>{getPrice()}</td>}
                <td>{formatDate(subscriptions[0].data?.startDate || subscriptions[0].created, dateFormat)}</td>
                <td>
                  <ul className={"li-no"}>
                    {ownedAddOns.length
                      ? ownedAddOns.map(addOn => (
                          <li className={"ls-no"} key={addOn.id}>
                            {stripPathToProductName(addOn.data?.add_on.data.products[0]?.path)}
                          </li>
                        ))
                      : noAddOnsText}
                  </ul>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}
