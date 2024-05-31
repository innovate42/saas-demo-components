//@flow
import * as React from "react"
import {emptyOrNil, formatCurrency, stripPathToProductName} from "./helpers"
import {LoadingSpinner} from "@limio/design-system"

type Props = {
    selectedOfferObj: Object,
    price: Object,
    processToday: Object,
    yourNewPlanCopy: string,
    yourOldPlanCopy: string
}

function PlanAndPricing({selectedOfferObj, price, processToday, yourNewPlanCopy, yourOldPlanCopy}: Props) {
    if (!selectedOfferObj) return <></>
    return (
        <>
            <div className="flex space-between center mb-2 pt-2 pb-2 mr-4">
                <div className={"flex col"}>
                    <h4 className="bold">{stripPathToProductName(selectedOfferObj.data.products[0].path)}</h4>
                    <p>{yourNewPlanCopy}</p>
                </div>
                <p>{processToday.current ? !emptyOrNil(price.add) && !emptyOrNil(price.remove) ? formatCurrency(price.add.amountWithoutTax, "USD") :
                    <LoadingSpinner/> : "--"}</p>
            </div>
            {processToday.current ? !emptyOrNil(price.add) && !emptyOrNil(price.remove) ?
                <div className="flex space-between center mb-2 pt-2 pb-2 mr-4">
                    <div className={"flex col"}>
                        <h4 className="bold">{stripPathToProductName(price.remove.productName)}</h4>
                        <p>{yourOldPlanCopy}</p>
                    </div>
                    <p>{formatCurrency(price.remove.amountWithoutTax, "USD")}</p>
                </div>
                : null : null}
        </>
    )
}

export default PlanAndPricing
