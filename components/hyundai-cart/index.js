import React from "react"
import { 
  useComponentProps, 
  getPropsFromPackageJson, 
  useCampaign, 
  useBasket,
  sanitiseHTML,
  useLimioContext
} from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

// Utility function to strip HTML tags from text
const stripHtmlTags = (html) => {
  if (!html) return ""
  // Create a temporary div element to parse HTML
  const temp = document.createElement("div")
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ""
}

// CartItem component adapted from the provided code
const CartItem = ({ item, basketDiscount }) => {
  const { removeFromBasket, updateItemQuantity, swapOffer, basketLoading } = useBasket()
  
  const quantity = item.quantity || 1
  const offer = item.offer
  if (!offer) return null

  const attributes = offer.data?.attributes || {}
  const product = offer.data?.products?.[0]
  
  if (!attributes || !product) {
    return (
      <div className="hc-error-banner">
        Something went wrong when displaying this offer. Please try refreshing, and contact us if the issue persists.
      </div>
    )
  }

  const attachment = offer.data?.attachments?.[0]
  const hasOfferThumbnail = attachment && attachment.type?.includes("image") && attachment.url

  const onRemove = async () => {
    if (basketLoading) return
    try {
      await removeFromBasket({ ...offer, id: item.id }, { sync: true })
    } catch (error) {
      console.error('Error removing from basket:', error)
    }
  }

  const onUpsell = async (upsellOffer) => {
    if (basketLoading) return
    try {
      await swapOffer(item.id, upsellOffer)
    } catch (error) {
      console.error('Error swapping offer:', error)
    }
  }

  const shouldDisplayUpsellOffers = item.upsell?.length > 0

  return (
    <div className="hc-cart-item">
      <div className="hc-cart-item-content">
        <div className="hc-cart-item-header">
          <div className="hc-cart-item-info">
            {hasOfferThumbnail && (
              <div className="hc-cart-item-image">
                <img src={attachment.url} alt="" />
              </div>
            )}
            <div className="hc-cart-item-details">
              <h3 className="hc-cart-item-title">
                {stripHtmlTags(attributes.display_name__limio) || offer.name}
              </h3>
              {(attributes.upsell_display_description__limio || attributes.display_description__limio) && (
                <div 
                  className="hc-cart-item-description" 
                  dangerouslySetInnerHTML={{ 
                    __html: sanitiseHTML(
                      attributes.upsell_display_description__limio || 
                      attributes.display_description__limio || 
                      ''
                    ) 
                  }} 
                />
              )}
            </div>
          </div>
          
          <div className="hc-cart-item-actions">
            <div className="hc-cart-item-price">
              <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '') }} />
            </div>
            <button
              type="button"
              className="hc-remove-btn"
              onClick={onRemove}
              disabled={basketLoading}
              aria-label="Remove item"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Add-ons */}
        {(item.addOns || []).map(addOnItem => (
          <div key={addOnItem.id} className="hc-addon-item">
            <span className="hc-addon-name">{stripHtmlTags(addOnItem.offer?.data?.attributes?.display_name__limio) || addOnItem.offer?.name}</span>
            <span className="hc-addon-price">
              <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(addOnItem.offer?.data?.attributes?.display_price__limio || '') }} />
            </span>
          </div>
        ))}

        {/* Upsells */}
        {shouldDisplayUpsellOffers && (
          <div className="hc-upsell-section">
            <div className="hc-separator"></div>
            <Upsell offers={item.upsell} currentOffer={offer} onUpsell={onUpsell} />
          </div>
        )}
      </div>
    </div>
  )
}

// Upsell component adapted from the provided code
const Upsell = ({ offers, currentOffer, onUpsell }) => {
  const [selectedOfferId, setSelectedOfferId] = React.useState(currentOffer.id)

  const onOfferSelect = (offerId) => {
    setSelectedOfferId(offerId)
    const offer = offers.find(offer => offer.id === offerId)
    if (offer && offerId !== currentOffer.id) {
      onUpsell(offer)
    }
  }

  return (
    <div className="hc-upsell-options">
      <h4 className="hc-upsell-title">Upgrade options:</h4>
      <div className="hc-radio-group">
        {offers.map(upsellOffer => {
          const price = upsellOffer.data.attributes.price__limio?.[0]
          const displayName = upsellOffer.data.attributes.upsell_display_name__limio || upsellOffer.data.attributes.display_name__limio
          const displayDescription = upsellOffer.data.attributes.upsell_display_description__limio || upsellOffer.data.attributes.display_description__limio
          
          return (
            <div className="hc-radio-item" key={upsellOffer.id}>
              <input
                type="radio"
                id={`upsell-${upsellOffer.id}`}
                name="upsell-selection"
                value={upsellOffer.id}
                checked={selectedOfferId === upsellOffer.id}
                onChange={(e) => onOfferSelect(e.target.value)}
                className="hc-radio-input"
              />
              <label htmlFor={`upsell-${upsellOffer.id}`} className="hc-radio-label">
                <div className="hc-radio-content">
                  <div className="hc-radio-text">
                    {displayName && (
                      <div className="hc-radio-title">
                        {stripHtmlTags(displayName)}
                      </div>
                    )}
                    {displayDescription && (
                      <div 
                        className="hc-radio-description"
                        dangerouslySetInnerHTML={{ __html: sanitiseHTML(displayDescription) }} 
                      />
                    )}
                  </div>
                  {price && (
                    <div className="hc-radio-price">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(upsellOffer.data.attributes.display_price__limio || '') }} />
                    </div>
                  )}
                </div>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const HyundaiCart = () => {
  const props = useComponentProps(defaultProps)
  const { 
    cartHeadline, 
    cartSubheadline,
    addOnsHeadline,
    addOnsSubheadline,
    proceedCta,
    emptyCartText,
    showTotal,
    primaryColor__limio_color,
    accentColor__limio_color
  } = props

  const { addOns } = useCampaign()
  const { 
    orderItems, 
    addToBasket,
    navigateToCheckout,
    basketLoading,
    formattedTotal,
    pageOptions
  } = useBasket()
  const { isInPageBuilder } = useLimioContext()

  // Get current cart items
  const currentCartItems = orderItems || []

  const handleProceedToCheckout = async () => {
    if (basketLoading || currentCartItems.length === 0) return
    
    try {
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error('Error proceeding to checkout:', error)
    }
  }

  const renderAddOnCard = (addOn) => {
    const attributes = addOn.data?.attributes || {}
    
    return (
      <div key={addOn.id} className="hc-addon-card">
        <div className="hc-addon-content">
          <h3 className="hc-addon-title">
            {stripHtmlTags(attributes.display_name__limio) || addOn.name}
          </h3>
          
          {attributes.display_description__limio && (
            <div 
              className="hc-addon-description" 
              dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_description__limio) }} 
            />
          )}
          
          <div className="hc-addon-footer">
            <div className="hc-addon-price">
              <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '') }} />
            </div>
            <button
              type="button"
              className="hc-btn hc-btn-secondary"
              onClick={() => addToBasket({ addOn })}
              disabled={basketLoading}
            >
              {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Add')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="hc-wrapper"
      style={{ 
        "--hc-primary": primaryColor__limio_color || "#004d9a",
        "--hc-accent": accentColor__limio_color || "#0080ff",
        "--hc-primary-tint": primaryColor__limio_color ? `${primaryColor__limio_color}0F` : "#004d9a0F",
        "--hc-contrast": getContrastColor(primaryColor__limio_color || "#004d9a")
      }}
    >
      <div className="hc-container">
        {/* Cart Header */}
        <div className="hc-header">
          <h1 className="hc-headline">{cartHeadline}</h1>
          <p className="hc-subheadline">{cartSubheadline}</p>
        </div>

        {/* Cart Items */}
        <section className="hc-cart-section">
          {currentCartItems.length > 0 ? (
            <>
              <div className="hc-cart-items">
                {currentCartItems.map((item, index) => (
                  <CartItem key={`cart-item-${item.offer?.id}-${index}`} item={item} />
                ))}
              </div>
              
              {/* Cart Summary - Only show if showTotal is true */}
              {showTotal && (
                <div className="hc-cart-summary">
                  <div className="hc-total">
                    <span className="hc-total-label">Total:</span>
                    <span className="hc-total-amount">{formattedTotal || '$0.00'}</span>
                  </div>
                  <button
                    type="button"
                    className="hc-btn hc-btn-primary hc-proceed-btn"
                    onClick={handleProceedToCheckout}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Processing...' : proceedCta}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="hc-empty-cart">
              <div className="hc-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="hc-empty-text">{emptyCartText}</p>
            </div>
          )}
        </section>

        {/* Add-ons Section */}
        {addOns && addOns.length > 0 && currentCartItems.length > 0 && (
          <section className="hc-addons-section">
            <div className="hc-section-header">
              <h2 className="hc-section-title">{addOnsHeadline}</h2>
              <p className="hc-section-subtitle">{addOnsSubheadline}</p>
            </div>
            <div className="hc-addons-grid">
              {addOns.map(renderAddOnCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default HyundaiCart