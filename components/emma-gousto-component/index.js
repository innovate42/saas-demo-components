import React from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, useLimioContext, groupOffers } from "@limio/sdk"
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

const EmmaGoustoComponent = () => {
  const props = useComponentProps(defaultProps)
  const { 
    headline,
    subheadline, 
    toggleMonthlyLabel,
    toggleAnnualLabel,
    savingsLabel,
    perPortionLabel,
    bestValueLabel,
    primaryColor__limio_color,
    accentColor__limio_color,
    showGroupSwitcher,
    groupLabels
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  // Safe initialization of activeGroup
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'monthly'
  const [activeGroup, setActiveGroup] = React.useState(defaultGroupId)
  
  // Safe grouping of offers
  const safeOffers = Array.isArray(offers) ? offers : []
  const groupedOffers = groupOffers(safeOffers, safeGroupLabels)
  const currentOffers = groupedOffers.find(g => g.groupId === activeGroup)?.offers || safeOffers
  
  const handleAddToBasket = async (offer) => {
    if (basketLoading) return
    
    try {
      const checkoutId = getCurrentBasketId()
      if (!checkoutId) {
        await initiateCheckout({ order: { orderItems: [{ offer }] } })
      } else {
        await addOfferToBasket({ offer })
      }
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error('Error adding to basket:', error)
    }
  }

  return (
    <div 
      className="egc-wrapper"
      style={{ 
        "--egc-primary": primaryColor__limio_color || "#412dee",
        "--egc-accent": accentColor__limio_color || "#008610",
        "--egc-contrast": getContrastColor(primaryColor__limio_color || "#412dee")
      }}
    >
      <section className="egc-pricing">
        <div className="egc-container">
          <div className="egc-header">
            <h1 className="egc-headline">{headline}</h1>
            <p className="egc-subheadline">{subheadline}</p>
          </div>
          
          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="egc-toggle">
              <div className="egc-toggle-wrapper">
                {safeGroupLabels.map(group => (
                  <button
                    key={group.id}
                    type="button"
                    className={`egc-toggle-btn ${activeGroup === group.id ? 'egc-toggle-btn-active' : ''}`}
                    onClick={() => setActiveGroup(group.id)}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="egc-cards">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isBestValue = attributes.best_value__limio
              const priceArray = attributes.price__limio || []
              const mainPrice = priceArray[0] || {}
              
              return (
                <div key={offer?.id || index} className={`egc-card ${isBestValue ? 'egc-card-featured' : ''}`}>
                  {isBestValue && (
                    <div className="egc-badge">
                      {attributes.badge_text__limio || bestValueLabel}
                    </div>
                  )}
                  
                  <div className="egc-card-header">
                    <h3 className="egc-plan-name">
                      {attributes.display_name__limio || 'Plan'}
                    </h3>
                    
                    <div className="egc-pricing-section">
                      {attributes.display_price__limio ? (
                        <div className="egc-price-display" dangerouslySetInnerHTML={{ __html: attributes.display_price__limio }} />
                      ) : (
                        <div className="egc-price-display">
                          <span className="egc-currency">{mainPrice.currencyCode || '$'}</span>
                          <span className="egc-amount">{mainPrice.value || '0'}</span>
                          <span className="egc-period">/{activeGroup === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      )}
                      
                      {attributes.detailed_display_price__limio && (
                        <div className="egc-price-details" dangerouslySetInnerHTML={{ __html: attributes.detailed_display_price__limio }} />
                      )}
                    </div>
                  </div>

                  {attributes.offer_features__limio && (
                    <div className="egc-features">
                      <div dangerouslySetInnerHTML={{ __html: attributes.offer_features__limio }} />
                    </div>
                  )}

                  <button
                    type="button"
                    className={`egc-cta-btn ${isBestValue ? 'egc-cta-featured' : ''}`}
                    onClick={() => handleAddToBasket(offer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Started')}
                  </button>
                  
                  {attributes.checkout_description__limio && (
                    <div className="egc-description" dangerouslySetInnerHTML={{ __html: attributes.checkout_description__limio }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmmaGoustoComponent