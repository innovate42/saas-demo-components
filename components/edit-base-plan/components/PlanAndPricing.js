//@flow
import * as React from "react"
import {emptyOrNil, formatCurrency, stripPathToProductName} from "./helpers"
import {LoadingSpinner} from "@limio/design-system"
import * as R from "ramda"

type Props = {
    selectedOfferObj: Object,
    price: Object,
    processToday: Object,
    yourNewPlanCopy: string,
    yourOldPlanCopy: string,
    currentOffer: Object
}

function PlanAndPricing({selectedOfferObj, price, processToday, yourNewPlanCopy, yourOldPlanCopy, currentOffer}: Props) {

    const currentOfferId = R.pathOr(null, ["data", "offer", "id"], currentOffer)
    if (currentOfferId === selectedOfferObj.id) return <></>
    return (
        <>
            <div className="flex space-between center mb-2 pt-2 pb-2 mr-4">
                <div className={"flex col"}>
                    <h4 className="bold">{stripPathToProductName(selectedOfferObj.data.attributes.display_name__limio)}</h4>
                    <p>{yourNewPlanCopy}</p>
                </div>
                <p>{processToday.current ? !emptyOrNil(price.add) && !emptyOrNil(price.remove) ? formatCurrency(price.add.amountWithoutTax, "USD") :
                    <LoadingSpinner/> : "--"}</p>
            </div>
            {processToday.current ? !emptyOrNil(price.add) && !emptyOrNil(price.remove) ?
                <div className="flex space-between center mb-2 pt-2 pb-2 mr-4">
                    <div className={"flex col"}>
                        <h4 className="bold">{currentOffer.data.offer.data.attributes.display_name__limio}</h4>
                        <p>{yourOldPlanCopy}</p>
                    </div>
                    <p>{formatCurrency(price.remove.amountWithoutTax, "USD")}</p>
                </div>
                : null : null}
        </>
    )
}

export default PlanAndPricing
