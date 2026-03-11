// @flow
import React from "react"
import { useComponentProps, getPropsFromPackageJson, useBasket, sanitiseHTML, formatCurrency } from "@limio/sdk"
import { useCheckout } from "@limio/internal-checkout-sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const LimioCartPage = () => {
  const props = useComponentProps(defaultProps)
  const {
    pageHeading,
    pageSubheading, 
    checkoutButtonText,
    checkoutUrl,
    upsellHeading,
    upsellSubheading,
    crossSellHeading,
    crossSellSubheading,
    emptyCartText,
    continueShopping,
    continueShoppingUrl,
    primaryColor__limio_color,
    secondaryColor__limio_color
  } = props

  const { useCheckoutSelector } = useCheckout({ redirectOnFailure: false })
  const { orderItems = [] } = useCheckoutSelector((state) => state.order)
  const orderTotals = useCheckoutSelector((state) => state.display?.orderTotal) || {}
  const { basketLoading, removeFromBasket, updateItemQuantity, addOfferToBasket, swapOffer } = useBasket()

  // Extract upsells and cross-sells from order items
  const upsellOffers = React.useMemo(() => {
    return orderItems.reduce((unique, item) => {
      (item.upsell || []).forEach((offer) => {
        if (!orderItems.some(i => i.offer?.id === offer.id) && !unique.some(u => u.id === offer.id)) {
          unique.push(offer)
        }
      })
      return unique
    }, [])
  }, [orderItems])

  const crossSellOffers = React.useMemo(() => {
    return orderItems.reduce((unique, item) => {
      (item.crossSell || []).forEach((offer) => {
        if (!orderItems.some(i => i.offer?.id === offer.id) && !unique.some(u => u.id === offer.id)) {
          unique.push(offer)
        }
      })
      return unique
    }, [])
  }, [orderItems])

  const handleRemoveItem = async (itemId) => {
    if (basketLoading) return
    try {
      await removeFromBasket({ id: itemId })
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (basketLoading) return
    try {
      await updateItemQuantity(itemId, quantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleUpsell = async (itemId, upsellOffer) => {
    if (basketLoading) return
    try {
      await swapOffer(itemId, upsellOffer)
    } catch (error) {
      console.error('Error upgrading item:', error)
    }
  }

  const handleAddCrossSell = async (offer) => {
    if (basketLoading) return
    try {
      const isAddOn = offer.record_type === "add_on"
      const quantity = offer.data?.attributes?.default_quantity_options__limio?.minimum_quantity ?? 1
      let parentId
      if (isAddOn) {
        const parentItem = orderItems
          .filter((item) => item.crossSell)
          .find((item) => item.crossSell.some((sub) => sub.id === offer.id))
        parentId = parentItem?.id
      }
      await addOfferToBasket({ offer, quantity: Number(quantity), parentId })
    } catch (error) {
      console.error('Error adding cross-sell:', error)
    }
  }

  const handleCheckout = () => {
    window.location.href = checkoutUrl
  }

  const hasItems = orderItems && orderItems.length > 0

  return (
    <div 
      className="lcp-wrapper"
      style={{ 
        "--lcp-primary": primaryColor__limio_color || "#d14424",
        "--lcp-secondary": secondaryColor__limio_color || "#f47c24",
        "--lcp-contrast": getContrastColor(primaryColor__limio_color || "#d14424")
      }}
    >
      <div className="lcp-container">
        {/* Page Header */}
        <div className="lcp-header">
          <h1 className="lcp-heading">{pageHeading}</h1>
          <p className="lcp-subheading">{pageSubheading}</p>
        </div>

        {!hasItems ? (
          /* Empty Cart State */
          <div className="lcp-empty-state">
            <div className="lcp-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2m6-8a2 2 0 012 2v6a2 2 0 01-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="lcp-empty-heading">{emptyCartText}</h2>
            <a href={continueShoppingUrl} className="lcp-btn lcp-btn-primary">
              {continueShopping}
            </a>
          </div>
        ) : (
          <div className="lcp-content">
            {/* Cart Items */}
            <div className="lcp-cart-section">
              <div className="lcp-cart-items">
                {orderItems.map((item, index) => {
                  const offer = item.offer
                  const attributes = offer?.data?.attributes || {}
                  const canUpdateQuantity = attributes.allow_multibuy__limio
                  const image = offer?.data?.attachments?.find(a => a.type?.includes("image"))
                  const itemUpsells = item.upsell || []

                  return (
                    <div key={item.id || index} className="lcp-cart-item-container">
                      <div className="lcp-cart-item">
                        {image && (
                          <div className="lcp-item-image">
                            <img src={image.url} alt={attributes.display_name__limio || 'Product'} />
                          </div>
                        )}
                        
                        <div className="lcp-item-details">
                          <h3 className="lcp-item-title">
                            {attributes.display_name__limio || 'Product'}
                          </h3>
                          
                          {offer?.data?.products?.[0]?.attributes?.display_name__limio && (
                            <p className="lcp-item-product">
                              {offer.data.products[0].attributes.display_name__limio}
                            </p>
                          )}

                          <div className="lcp-item-price">
                            {item.price ? (
                              <span>{formatCurrency(item.price.value, item.price.currencyCode)}</span>
                            ) : attributes.display_price__limio ? (
                              <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) }} />
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </div>

                        <div className="lcp-item-actions">
                          {canUpdateQuantity && (
                            <div className="lcp-quantity-controls">
                              <button 
                                type="button"
                                className="lcp-qty-btn"
                                onClick={() => handleUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                disabled={basketLoading || (item.quantity || 1) <= 1}
                              >
                                −
                              </button>
                              <span className="lcp-quantity">{item.quantity || 1}</span>
                              <button 
                                type="button"
                                className="lcp-qty-btn"
                                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                disabled={basketLoading}
                              >
                                +
                              </button>
                            </div>
                          )}
                          
                          <button 
                            type="button"
                            className="lcp-remove-btn"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={basketLoading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item-specific upsells */}
                      {itemUpsells.length > 0 && (
                        <div className="lcp-item-upsells">
                          <div className="lcp-upsells-header">
                            <h4 className="lcp-upsells-title">Available Upgrades</h4>
                            <p className="lcp-upsells-subtitle">Get more value with these premium options</p>
                          </div>
                          <div className="lcp-upsells-options">
                            {itemUpsells.map((upsellOffer, upsellIndex) => {
                              const upsellAttributes = upsellOffer?.data?.attributes || {}
                              
                              return (
                                <div key={upsellOffer.id || upsellIndex} className="lcp-upsell-option">
                                  <div className="lcp-upsell-info">
                                    <h5 className="lcp-upsell-name">
                                      {upsellAttributes.upsell_display_name__limio ? (
                                        <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(upsellAttributes.upsell_display_name__limio) }} />
                                      ) : (
                                        upsellAttributes.display_name__limio || 'Upgrade Option'
                                      )}
                                    </h5>
                                    
                                    {upsellAttributes.upsell_display_description__limio && (
                                      <p className="lcp-upsell-description">
                                        <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(upsellAttributes.upsell_display_description__limio) }} />
                                      </p>
                                    )}
                                    
                                    <div className="lcp-upsell-price">
                                      {upsellAttributes.display_price__limio ? (
                                        <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(upsellAttributes.display_price__limio) }} />
                                      ) : upsellAttributes.price__limio?.[0] ? (
                                        <span>{formatCurrency(upsellAttributes.price__limio[0].value, upsellAttributes.price__limio[0].currencyCode)}</span>
                                      ) : (
                                        <span>—</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <button 
                                    type="button"
                                    className="lcp-btn lcp-btn-secondary lcp-upsell-btn"
                                    onClick={() => handleUpsell(item.id, upsellOffer)}
                                    disabled={basketLoading}
                                  >
                                    {basketLoading ? 'Upgrading...' : (upsellAttributes.upgrade_cta__limio || 'Upgrade')}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="lcp-order-summary">
                <h3 className="lcp-summary-title">Order Summary</h3>
                
                <div className="lcp-summary-details">
                  {orderTotals.orderSubtotal && (
                    <div className="lcp-summary-line">
                      <span>Subtotal</span>
                      <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(orderTotals.orderSubtotal) }} />
                    </div>
                  )}
                  
                  {orderTotals.taxSummary && orderTotals.taxSummary.length > 0 && (
                    orderTotals.taxSummary.map((tax, index) => (
                      <div key={index} className="lcp-summary-line">
                        <span>{tax.taxCode || 'Tax'}</span>
                        <span>{formatCurrency(tax.taxAmount, orderTotals.currency)}</span>
                      </div>
                    ))
                  )}
                  
                  {orderTotals.orderTotal && (
                    <div className="lcp-summary-total">
                      <span>Total</span>
                      <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(orderTotals.orderTotal) }} />
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  className="lcp-btn lcp-btn-primary lcp-checkout-btn"
                  onClick={handleCheckout}
                  disabled={basketLoading}
                >
                  {basketLoading ? 'Processing...' : checkoutButtonText}
                </button>
                
                <a href={continueShoppingUrl} className="lcp-continue-shopping">
                  {continueShopping}
                </a>
              </div>
            </div>

            {/* Cross-sells Section */}
            {crossSellOffers.length > 0 && (
              <div className="lcp-cross-sells-section">
                <div className="lcp-section-header">
                  <h2 className="lcp-section-title">{crossSellHeading}</h2>
                  <p className="lcp-section-subtitle">{crossSellSubheading}</p>
                </div>
                
                <div className="lcp-offers-grid">
                  {crossSellOffers.map((offer, index) => {
                    const attributes = offer?.data?.attributes || {}
                    
                    return (
                      <div key={offer.id || index} className="lcp-offer-card lcp-cross-sell-card">
                        <div className="lcp-offer-header">
                          <h3 className="lcp-offer-title">
                            {attributes.cross_sell_display_name__limio ? (
                              <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.cross_sell_display_name__limio) }} />
                            ) : (
                              attributes.display_name__limio || 'Add-on'
                            )}
                          </h3>
                          
                          {attributes.cross_sell_display_description__limio && (
                            <div className="lcp-offer-description">
                              <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.cross_sell_display_description__limio) }} />
                            </div>
                          )}
                          
                          <div className="lcp-offer-price">
                            {attributes.price__limio?.[0] ? (
                              <span>{formatCurrency(attributes.price__limio[0].value, attributes.price__limio[0].currencyCode)}</span>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          type="button"
                          className="lcp-btn lcp-btn-secondary"
                          onClick={() => handleAddCrossSell(offer)}
                          disabled={basketLoading}
                        >
                          {basketLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LimioCartPage