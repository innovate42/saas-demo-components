// @flow
import * as React from "react"
import { useBasket, useCampaign, useLimioContext } from "@limio/sdk"
import { stripHTMLtags, stripPathToProductName } from "../helpers"
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

const standardiseString = str => str.split(" ")[0].toLowerCase().replace(/\s/g, "")
const getStrippedProductName = obj => stripPathToProductName(obj.data.products[0].path)
const normalizeString = str => str.replace(/[^a-z0-9]/gi, "").toLowerCase()

// Custom hook for deep comparison of memoized values
function useDeepCompareMemoize(value) {
  const ref = React.useRef()

  if (!R.equals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
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
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const { addToBasket } = useBasket()
  const dispatch = useDispatch()
  const { zuoraPreview, previewSchedule, loadingPreview, preview, previewError } = usePreview()
  const store = useStore()
  const { isInPageBuilder } = useLimioContext()

  // state
  const [offerCode, setOfferCode] = React.useState("")
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
    // check offer code
    // if valid, apply offer
    // else display error message
  }

  React.useEffect(() => {
    if (isInPageBuilder) return

    // This stops the attempts to run redux in dev mode.
    // *********************************************************************************************************************************************************
    // const inDev = true
    // if (inDev) return
    // *********************************************************************************************************************************************************

    // create a basket with the selected offer and add ons
    // previewing needs an order so this leverages the basket functionality to create an order
    dispatch(addToBasketAction({ offer: selectedOfferObj, addOns: selectedAddOnsListWithQuantity, pushToCheckout: false, quantity: offerQuantity }))

    // get state to prevent rerender
    const { order } = store.getState()

    // standard billing details for preview as recommended by Zuora
    const previewBillingDetails = { state: "NY", postalCode: "10001", country: "US" }
    const previewOrderData = { ...order, billingDetails: previewBillingDetails, order_type: "new", mode: "production" }

    // configure state to prevent race conditions
    preview(previewOrderData, true)
    // for every request clear the state variables
    setPlanPrice({})
    setAddOnsPrice([])
    // clear the basket after previewing
    let combined = []

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
    // if preview error then this never gets updated?
    if (zuoraPreview) {
      // get the price of the plan and add ons from the preview response
      const productName = getStrippedProductName(selectedOfferObj)
      if (previewSchedule[0]?.lineItems?.length) {
        setPlanPrice(previewSchedule[0]?.lineItems?.find(item => normalizeString(item.productName) === normalizeString(productName)))
        setAddOnsPrice(previewSchedule[0]?.lineItems?.filter(item => normalizeString(item.productName) !== normalizeString(productName)))
      } else {
        setPlanPrice({})
        setAddOnsPrice([])
      }
    }
  }, [zuoraPreview])

  const currency = selectedOfferObj?.data?.attributes.price__limio[0].currencyCode ?? "USD"
  // use the first payment for any preview
  const previewAmount = previewSchedule[0]?.amountWithoutTax
  const isLoading = R.isEmpty(planPrice) || (selectedAddOnsList.length > 0 && R.isEmpty(AddOnsPrice))
  const totalText = !isLoading ? formatCurrency(previewAmount, currency) : <LoadingSpinner />
  const getAddOnsPriceMatched = addOn => {
    // matches the add on listed in the ui to the price value
    const productName = getStrippedProductName(addOn)
    const matchedAddOn = AddOnsPrice.find(addOnPreview => normalizeString(addOnPreview.productName) === normalizeString(productName))
    // sometimes a cached value gets populated immediately but there are +n add ons so this prevents the error
    // state is updated by the second useEffect causing the rerender to display the price
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
            <p className="bold mr-4">{!R.isEmpty(planPrice) ? formatCurrency(planPrice.amountWithoutTax, currency) : <LoadingSpinner />}</p>
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
            <button disabled onClick={() => applyOffer} className={"offer-btn"}>
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
