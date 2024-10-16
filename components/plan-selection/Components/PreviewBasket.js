// @flow
import * as React from "react"
import { useBasket, useCampaign, useLimioContext } from "@limio/sdk"
import { stripHTMLtags, stripPathToProductName, useDeepCompareMemoize, getStrippedProductName, normaliseString, standardiseString, formatCurrency } from "../helpers"
import { addToBasketAction, removeFromBasketAction } from "@limio/shop-redux/src/shop/redux"
import { useDispatch, useStore } from "@limio/shop-redux"
import { LoadingSpinner } from "@limio/design-system"
import { usePreview } from "@limio/ui-preview-context"
import * as R from "ramda"

type Props = {
  selectedProduct: string,
  selectedOffer: string,
  selectedAddOnProducts: Array<string>,
  selectedBillingPlan: string,
  quantity: number,
  basketDescText: string
}

function PreviewBasket({
  selectedProduct,
  selectedOffer,
  selectedAddOnProducts,
  selectedBillingPlan,
  quantity: offerQuantity,
  basketDescText
}: Props): React.Node {
  // sdk functionality
  const { offers = [], addOns } = useCampaign()

  const { addToBasket } = useBasket()
  const dispatch = useDispatch()
  const { zuoraPreview, previewSchedule, preview } = usePreview()
  const store = useStore()
  const { isInPageBuilder } = useLimioContext()

  const [planPrice, setPlanPrice] = React.useState({})
  const [AddOnsPrice, setAddOnsPrice] = React.useState([])

  // offer and add on selection
  const filterAddOns = addOn => {
    const addOnProducts = addOn.data.products.map(product => product.path)
    const selectedProductMatch = selectedAddOnProducts.map(obj => addOnProducts.includes(obj.product)).includes(true)
    const billingPlanMatches = addOn.data.attributes.billing_option.includes(standardiseString(selectedBillingPlan))

    const vol = R.pathOr(false, ["data", "attributes", "volume_plan"], addOn)
    // if the add on is a volume add on this if branches handle the correct selection of annual over monthly.
    if (vol && selectedProductMatch) {
      if (billingPlanMatches) return true // month to month, year to year
      if (standardiseString(selectedBillingPlan) !== "monthly") {
        if (!addOn.data.attributes.billing_option.includes("monthly")) return true // annual to biennial etc
      }
    }

    return selectedProductMatch && billingPlanMatches
  }

  // useMemo to retain the memory location of the selectedOfferObj and selectedAddOnsList preventing infinite render loop in useEffect
  const selectedOfferObj = React.useMemo(() => offers.find(offer => offer.id === selectedOffer), [offers, selectedOffer])

  // Deep comparison memoization
  const memoizedFilterResults = useDeepCompareMemoize(addOns.filter(filterAddOns))
  // match the selected add ons to have a quantity value next to the add on name i.e { addOn: addOn, quantity: quantitiy from selectedAddOnProducts }
  const selectedAddOnsList = React.useMemo(() => memoizedFilterResults, [memoizedFilterResults])

  const selectedAddOnsListWithQuantity = React.useMemo(() => {
    const addOnsList = []
    selectedAddOnsList.forEach(addOn => {
      const option = selectedAddOnProducts.find(obj => obj.product === addOn.data.products[0].path)
      addOnsList.push({ addOn: addOn, quantity: option.quantity })
    })
    return addOnsList
  }, [selectedAddOnsList, selectedAddOnProducts])

  // ui functionality
  const handleClick = () => {
    addToBasket(selectedOfferObj, { addOns: selectedAddOnsListWithQuantity, quantity: offerQuantity })
  }

  const applyOffer = () => {
  }

  React.useEffect(() => {
    if (isInPageBuilder) return

    // create a basket with the selected offer and add ons
    // previewing needs an order so this leverages the basket functionality to create an order
    dispatch(addToBasketAction({ offer: selectedOfferObj, addOns: selectedAddOnsListWithQuantity, pushToCheckout: false, quantity: offerQuantity }))
    const { order } = store.getState()

    // standard billing details for previewing - this is not in a checkout context so this is a dummy value
    const previewBillingDetails = { state: "NY", postalCode: "10001", country: "US" }
    const previewOrderData = { ...order, billingDetails: previewBillingDetails, order_type: "new", mode: "production" }

    preview(previewOrderData, true)
    setPlanPrice({})
    setAddOnsPrice([])
    let combined = []

    // this is to remove the items from the basket after the preview has been completed
    if (selectedAddOnsList) {
      const addOnIdsAndPath = selectedAddOnsList.map(addOn => ({ id: addOn.id, path: addOn.path }))
      combined = [...combined, ...addOnIdsAndPath]
    }

    if (selectedOfferObj) {
      const offerIdsAndPath = { id: selectedOfferObj.id, path: selectedOfferObj.path }
      combined = [...combined, offerIdsAndPath]
    }

    if (combined.length  > 0) {
      combined.forEach(item => dispatch(removeFromBasketAction(item.id, item.path)))
    }

  }, [selectedOfferObj, selectedAddOnsList, selectedAddOnsListWithQuantity, offerQuantity])

  React.useEffect(() => {
    if (zuoraPreview) {
      const productName = getStrippedProductName(selectedOfferObj)
      console.log(JSON.stringify(previewSchedule))
      console.log(previewSchedule)
      if (previewSchedule[0]?.lineItems?.length) {
        if (previewSchedule[0]?.lineItems?.length === 1) {
            setPlanPrice(previewSchedule[0]?.lineItems[0])
            setAddOnsPrice([])
        }

        setPlanPrice(previewSchedule[0]?.lineItems?.find(item => normaliseString(item.productName).startsWith(normaliseString(productName))))
        setAddOnsPrice(previewSchedule[0]?.lineItems?.filter(item => normaliseString(item.productName) !== normaliseString(productName)))
      } else {
        // this means there is an issue so just default clear it
        setPlanPrice({})
        setAddOnsPrice([])
      }
    }
  }, [zuoraPreview])

  const currency = selectedOfferObj?.data?.attributes.price__limio[0].currencyCode ?? "USD"

  // use the first payment for any preview - is this correct?
  const previewAmount = previewSchedule[0]?.amountWithoutTax
  const isLoading = R.isEmpty(planPrice) || (selectedAddOnsList.length > 0 && R.isEmpty(AddOnsPrice))

  const totalText = !isLoading ? formatCurrency(previewAmount, currency) : <LoadingSpinner />

  const getAddOnsPriceMatched = addOn => {
    const productName = getStrippedProductName(addOn)
    const matchedAddOn = AddOnsPrice.find(addOnPreview => normaliseString(addOnPreview.productName) === normaliseString(productName))
      if (!matchedAddOn) return <LoadingSpinner />
    return formatCurrency(matchedAddOn.amountWithoutTax, currency)
  }

  return (
    <div className="inset left-border">
      <div>
        <div>
          <h3>Your Plan</h3>
          <div className="flex space-between center">
            <h5 className="bold">{stripPathToProductName(selectedProduct)}</h5>
            <p className="bold mr-4">{!R.isEmpty(planPrice) && !R.isNil(planPrice) ? formatCurrency(planPrice.amountWithoutTax, currency) : <LoadingSpinner />}</p>
          </div>
          <p>{stripHTMLtags(selectedOfferObj.data.attributes.display_price__limio)}</p>
        </div>
        <div>
          {selectedAddOnsList.length > 0 ? (
            selectedAddOnsList.map((addOn, i) => (
              <>
                <div className="flex space-between mr-4" key={i}>
                  <p className="bold" key={i}>
                    {addOn.name}
                  </p>
                  <p>{!R.isEmpty(AddOnsPrice) ? getAddOnsPriceMatched(addOn) : <LoadingSpinner />}</p>
                </div>
              </>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="row-border" />

        <div className="flex space-between mr-4">
          <label className="bold">Offer Code: </label>
          {/* offer code input box for type text */}
          <div>
            <input type="text" onChange={e => setOfferCode(e.target.value)} className={"offer-input"} />
            <button disabled className={"offer-btn"}>
              Apply
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="row-border" />
        <div>
          <div className="flex space-between mr-4 center mt-4">
            <h1 className="bold">To pay today </h1>
            <p className="total-in-basket">{totalText}</p>
          </div>
          <div className="flex">
            <button className="add-btn add-remove-btns ml-auto mr-4 w-6 pt-1 pb-1" onClick={handleClick}>
              Continue
            </button>
          </div>
        </div>

        <section className="description">
          <p>This pricing is designed for SMBs and growing organisations.</p>
          {basketDescText && <div dangerouslySetInnerHTML={{ __html: basketDescText }}></div>}
        </section>
      </div>
    </div>
  )
}

export default PreviewBasket
