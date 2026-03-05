import React from "react"
import { 
  useComponentProps, 
  getPropsFromPackageJson, 
  useCampaign, 
  useBasket,
  sanitiseHTML,
  useLimioContext,
  formatCurrency
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

const HyundaiCart = () => {
  const props = useComponentProps(defaultProps)
  const { 
    cartHeadline, 
    cartSubheadline,
    upsellHeadline,
    upsellSubheadline,
    addOnsHeadline,
    addOnsSubheadline,
    proceedCta,
    emptyCartText,
    showUpsells,
    showTotal,
    showAllOffers,
    upsellMode,
    primaryColor__limio_color,
    accentColor__limio_color
  } = props

  const { offers, addOns } = useCampaign()
  const { 
    orderItems, 
    addOfferToBasket, 
    removeFromBasket, 
    addToBasket,
    initiateCheckout, 
    navigateToCheckout,
    basketLoading,
    formattedTotal,
    pageOptions
  } = useBasket()
  const { isInPageBuilder } = useLimioContext()

  // Get current cart items
  const currentCartItems = orderItems || []
  const currentOfferIds = currentCartItems.map(item => item.offer?.id).filter(Boolean)

  // Enhanced upsell offers logic that matches core component behavior
  const getUpsellOffers = () => {
    console.log('Getting upsell offers...')
    
    // If showAllOffers is enabled, show all campaign offers not in cart
    if (showAllOffers) {
      const availableOffers = offers?.filter(offer => !currentOfferIds.includes(offer.id)) || []
      console.log('Show all offers mode:', availableOffers.length, 'available offers')
      return availableOffers
    }
    
    const upsellOffers = []
    
    // Method 1: Check for upsell_offers__limio on cart items (correct structure from your example)
    currentCartItems.forEach(cartItem => {
      const offer = cartItem.offer
      const attributes = offer?.data?.attributes || {}
      
      console.log(`Checking cart item: ${offer?.id}`, {
        hasUpsellOffers: !!attributes['upsell_offers__limio'],
        upsellStructure: attributes['upsell_offers__limio']
      })
      
      // Handle the correct upsell structure: upsell_offers__limio.items[]
      const upsellData = attributes['upsell_offers__limio']
      if (upsellData && upsellData.items && Array.isArray(upsellData.items)) {
        console.log(`Found ${upsellData.items.length} upsell items for offer ${offer.id}`)
        
        upsellData.items.forEach(upsellRef => {
          // Find the offer by ID
          const upsellOffer = offers?.find(o => o.id === upsellRef.id)
          if (upsellOffer && !currentOfferIds.includes(upsellOffer.id)) {
            console.log(`Adding upsell offer: ${upsellOffer.id}`)
            upsellOffers.push(upsellOffer)
          } else {
            console.log(`Upsell offer not found or already in cart: ${upsellRef.id}`)
          }
        })
      }
      
      // Also check for other possible field names as fallbacks
      const upgradeFields = [
        'upgrade_offers__limio',
        'related_offers__limio'
      ]
      
      upgradeFields.forEach(fieldName => {
        const upgradeData = attributes[fieldName]
        if (upgradeData) {
          console.log(`Found ${fieldName}:`, upgradeData)
          // Handle both array and object with items array
          const upgradeArray = Array.isArray(upgradeData) ? upgradeData : upgradeData.items || []
          
          upgradeArray.forEach(upgradeRef => {
            const upgradeOffer = offers?.find(o => o.id === upgradeRef.id || o.id === upgradeRef)
            if (upgradeOffer && !currentOfferIds.includes(upgradeOffer.id)) {
              upsellOffers.push(upgradeOffer)
            }
          })
        }
      })
    })
    
    // Method 2: Look for offers in campaign that have upsell display fields
    const campaignUpsells = offers?.filter(offer => {
      if (currentOfferIds.includes(offer.id)) return false
      
      const attributes = offer?.data?.attributes || {}
      const hasUpsellFields = !!(
        attributes.upsell_display_name__limio || 
        attributes.upsell_display_description__limio ||
        attributes.is_upsell__limio === true ||
        attributes.offer_type__limio === 'upsell'
      )
      
      if (hasUpsellFields) {
        console.log(`Found campaign upsell offer: ${offer.id}`)
      }
      
      return hasUpsellFields
    }) || []
    
    upsellOffers.push(...campaignUpsells)
    
    // Method 3: Check for offers with higher prices (basic price comparison)
    if (upsellOffers.length === 0 && currentCartItems.length > 0) {
      console.log('No specific upsells found, checking for higher-priced offers')
      
      const currentPrices = currentCartItems.map(item => {
        const priceArray = item.offer?.data?.attributes?.price__limio || []
        return priceArray.length > 0 ? priceArray[0].value || 0 : 0
      })
      const maxCurrentPrice = Math.max(...currentPrices, 0)
      
      console.log('Current max price:', maxCurrentPrice)
      
      const higherPriceOffers = offers?.filter(offer => {
        if (currentOfferIds.includes(offer.id)) return false
        const priceArray = offer?.data?.attributes?.price__limio || []
        const offerPrice = priceArray.length > 0 ? priceArray[0].value || 0 : 0
        return offerPrice > maxCurrentPrice
      }) || []
      
      console.log(`Found ${higherPriceOffers.length} higher-priced offers`)
      upsellOffers.push(...higherPriceOffers)
    }
    
    // Remove duplicates
    const uniqueUpsells = upsellOffers.filter((offer, index, self) => 
      index === self.findIndex(o => o.id === offer.id)
    )
    
    console.log(`Final upsell offers: ${uniqueUpsells.length}`, uniqueUpsells.map(o => ({ id: o.id, name: stripHtmlTags(o.data?.attributes?.display_name__limio) })))
    
    return uniqueUpsells
  }

  // Enhanced cross-sell add-ons logic
  const getCrossSellAddOns = () => {
    const crossSellAddOns = []
    
    // Method 1: Check for cross_sell_addons__limio on cart items
    currentCartItems.forEach(cartItem => {
      const offer = cartItem.offer
      const attributes = offer?.data?.attributes || {}
      
      // Handle the correct structure: cross_sell_addons__limio.items[]
      const crossSellData = attributes['cross_sell_addons__limio']
      if (crossSellData && crossSellData.items && Array.isArray(crossSellData.items)) {
        crossSellData.items.forEach(addOnRef => {
          const addOn = addOns?.find(a => a.id === addOnRef.id)
          if (addOn) {
            crossSellAddOns.push(addOn)
          }
        })
      }
    })
    
    // Method 2: Show all addOns if none found
    if (crossSellAddOns.length === 0) {
      return addOns || []
    }
    
    // Remove duplicates
    return crossSellAddOns.filter((addOn, index, self) => 
      index === self.findIndex(a => a.id === addOn.id)
    )
  }

  const upsellOffers = getUpsellOffers()
  const crossSellAddOns = getCrossSellAddOns()

  // State for radio selection in list mode
  const [selectedUpsellId, setSelectedUpsellId] = React.useState(null)

  React.useEffect(() => {
    // Set initial selection to first upsell offer
    if (upsellOffers.length > 0 && !selectedUpsellId) {
      setSelectedUpsellId(upsellOffers[0].id)
    }
  }, [upsellOffers, selectedUpsellId])

  const handleAddToBasket = async (offer) => {
    if (basketLoading) return
    
    try {
      const checkoutId = getCurrentBasketId()
      if (!checkoutId) {
        await initiateCheckout({ order: { orderItems: [{ offer }] } })
      } else {
        await addOfferToBasket({ offer })
      }
      
      // Clear selection after adding
      if (upsellMode === 'list') {
        setSelectedUpsellId(null)
      }
    } catch (error) {
      console.error('Error adding to basket:', error)
    }
  }

  const handleSwapOffer = async (newOffer) => {
    if (basketLoading || currentCartItems.length === 0) return
    
    try {
      // For now, just add the new offer (you could implement swap logic here)
      await handleAddToBasket(newOffer)
    } catch (error) {
      console.error('Error swapping offer:', error)
    }
  }

  const handleRemoveFromBasket = async (item) => {
    if (basketLoading) return
    
    try {
      await removeFromBasket(item)
    } catch (error) {
      console.error('Error removing from basket:', error)
    }
  }

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

  const renderCartItem = (item, index) => {
    const offer = item.offer
    if (!offer) return null

    const attributes = offer.data?.attributes || {}
    
    return (
      <div key={`cart-item-${offer.id}-${index}`} className="hc-cart-item">
        <div className="hc-cart-item-content">
          <div className="hc-cart-item-header">
            <h3 className="hc-cart-item-title">
              {stripHtmlTags(attributes.display_name__limio) || offer.name}
            </h3>
            <button
              type="button"
              className="hc-remove-btn"
              onClick={() => handleRemoveFromBasket(item)}
              disabled={basketLoading}
              aria-label="Remove item"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
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
          
          <div className="hc-cart-item-price">
            <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '') }} />
          </div>
        </div>
      </div>
    )
  }

  const renderUpsellCard = (offer) => {
    const attributes = offer.data?.attributes || {}
    
    return (
      <div key={offer.id} className="hc-upsell-card">
        <div className="hc-upsell-content">
          <h3 className="hc-upsell-title">
            {stripHtmlTags(attributes.upsell_display_name__limio || attributes.display_name__limio) || offer.name}
          </h3>
          
          {(attributes.upsell_display_description__limio || attributes.display_description__limio) && (
            <div 
              className="hc-upsell-description" 
              dangerouslySetInnerHTML={{ 
                __html: sanitiseHTML(
                  attributes.upsell_display_description__limio || 
                  attributes.display_description__limio || 
                  ''
                ) 
              }} 
            />
          )}
          
          {attributes.offer_features__limio && (
            <div 
              className="hc-upsell-features" 
              dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} 
            />
          )}
          
          <div className="hc-upsell-footer">
            <div className="hc-upsell-price">
              <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '') }} />
            </div>
            <button
              type="button"
              className="hc-btn hc-btn-primary"
              onClick={() => handleAddToBasket(offer)}
              disabled={basketLoading}
            >
              {basketLoading ? 'Adding...' : (attributes.upgrade_cta__limio || attributes.cta_text__limio || 'Upgrade')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderUpsellList = () => {
    if (upsellOffers.length === 0) return null

    return (
      <div className="hc-upsell-list">
        <div className="hc-radio-group">
          {upsellOffers.map(offer => {
            const attributes = offer.data?.attributes || {}
            const price = attributes.price__limio?.[0]
            
            return (
              <div key={offer.id} className="hc-radio-item">
                <input
                  type="radio"
                  id={`upsell-${offer.id}`}
                  name="upsell-selection"
                  value={offer.id}
                  checked={selectedUpsellId === offer.id}
                  onChange={(e) => setSelectedUpsellId(e.target.value)}
                  className="hc-radio-input"
                />
                <label htmlFor={`upsell-${offer.id}`} className="hc-radio-label">
                  <div className="hc-radio-content">
                    <div className="hc-radio-text">
                      {(attributes.upsell_display_name__limio || attributes.display_name__limio) && (
                        <div className="hc-radio-title">
                          {stripHtmlTags(attributes.upsell_display_name__limio || attributes.display_name__limio)}
                        </div>
                      )}
                      {(attributes.upsell_display_description__limio || attributes.display_description__limio) && (
                        <div 
                          className="hc-radio-description"
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
                    {price && (
                      <div className="hc-radio-price">
                        {formatCurrency(price.value, price.currencyCode)}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )
          })}
        </div>
        
        {selectedUpsellId && (
          <div className="hc-upsell-actions">
            <button
              type="button"
              className="hc-btn hc-btn-primary"
              onClick={() => {
                const selectedOffer = upsellOffers.find(o => o.id === selectedUpsellId)
                if (selectedOffer) {
                  if (currentCartItems.length > 0) {
                    handleSwapOffer(selectedOffer)
                  } else {
                    handleAddToBasket(selectedOffer)
                  }
                }
              }}
              disabled={basketLoading}
            >
              {basketLoading ? 'Processing...' : (currentCartItems.length > 0 ? 'Switch to Selected' : 'Add Selected')}
            </button>
          </div>
        )}
      </div>
    )
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
                {currentCartItems.map(renderCartItem)}
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

        {/* Upsell Section */}
        {showUpsells && upsellOffers.length > 0 && (
          <section className="hc-upsell-section">
            <div className="hc-section-header">
              <h2 className="hc-section-title">{upsellHeadline}</h2>
              <p className="hc-section-subtitle">{upsellSubheadline}</p>
            </div>
            
            {upsellMode === 'list' ? (
              renderUpsellList()
            ) : (
              <div className="hc-upsell-grid">
                {upsellOffers.map(renderUpsellCard)}
              </div>
            )}
          </section>
        )}

        {/* Add-ons Section */}
        {showUpsells && crossSellAddOns.length > 0 && currentCartItems.length > 0 && (
          <section className="hc-addons-section">
            <div className="hc-section-header">
              <h2 className="hc-section-title">{addOnsHeadline}</h2>
              <p className="hc-section-subtitle">{addOnsSubheadline}</p>
            </div>
            <div className="hc-addons-grid">
              {crossSellAddOns.map(renderAddOnCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default HyundaiCart