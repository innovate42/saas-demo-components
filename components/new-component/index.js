import React from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, sanitiseHTML, groupOffers } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#ffffff"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const NewComponent = () => {
  const props = useComponentProps(defaultProps)
  const {
    headline,
    subheadline,
    trialHeadline,
    trialSubheadline,
    featuresHeadline,
    plansHeadline,
    plansSubheadline,
    primaryColor__limio_color,
    showTrialBanner,
    showFeatureComparison,
    groupLabels
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()

  // Safe initialization
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

  // Premium features for comparison
  const premiumFeatures = [
    "Ad-free music listening",
    "Download to listen offline", 
    "Play songs in any order",
    "Lossless audio quality",
    "Listen with friends in real time",
    "Organise listening queue"
  ]

  const freeFeatures = [
    "Shuffle play only",
    "Limited skips",
    "Ads between songs",
    "Basic audio quality"
  ]

  return (
    <div 
      className="nc-wrapper"
      style={{
        "--nc-primary": primaryColor__limio_color || "#1ed760",
        "--nc-primary-contrast": getContrastColor(primaryColor__limio_color || "#1ed760")
      }}
    >
      {/* Hero Trial Banner */}
      {showTrialBanner && (
        <section className="nc-hero">
          <div className="nc-container">
            <div className="nc-hero-content">
              <h1 className="nc-hero-headline">{trialHeadline}</h1>
              <p className="nc-hero-subheadline">{trialSubheadline}</p>
              <div className="nc-hero-cta">
                <button className="nc-btn nc-btn-primary" type="button">
                  View all plans
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Pricing Section */}
      <section className="nc-pricing">
        <div className="nc-container">
          <div className="nc-section-header">
            <h2 className="nc-section-title">{headline}</h2>
            <p className="nc-section-subtitle">{subheadline}</p>
          </div>

          {/* Plan Group Switcher */}
          {safeGroupLabels.length > 1 && (
            <div className="nc-group-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`nc-group-btn ${activeGroup === group.id ? 'nc-group-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="nc-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isFeatured = attributes.best_value__limio
              
              return (
                <div key={offer?.id || index} className={`nc-pricing-card ${isFeatured ? 'nc-pricing-card-featured' : ''}`}>
                  {isFeatured && (
                    <div className="nc-pricing-badge">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="nc-pricing-header">
                    <h3 className="nc-pricing-title">
                      {attributes.display_name__limio || 'Premium Plan'}
                    </h3>
                    <div className="nc-pricing-price">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '$0') }} />
                    </div>
                    {attributes.detailed_display_price__limio && (
                      <div className="nc-pricing-detail" 
                           dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                    )}
                  </div>

                  {attributes.offer_features__limio && (
                    <div className="nc-pricing-features" 
                         dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                  )}

                  <button
                    type="button"
                    className="nc-btn nc-btn-primary nc-pricing-cta"
                    onClick={() => handleAddToBasket(offer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Premium')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      {showFeatureComparison && (
        <section className="nc-comparison">
          <div className="nc-container">
            <h2 className="nc-comparison-title">{featuresHeadline}</h2>
            
            <div className="nc-comparison-table">
              <div className="nc-comparison-header">
                <div className="nc-comparison-col">
                  <h3>Features</h3>
                </div>
                <div className="nc-comparison-col">
                  <h3>Free</h3>
                  <p>$0/month</p>
                </div>
                <div className="nc-comparison-col nc-comparison-premium">
                  <h3>Premium</h3>
                  <p>From $12.99/month</p>
                </div>
              </div>
              
              <div className="nc-comparison-body">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="nc-comparison-row">
                    <div className="nc-comparison-col nc-feature-name">
                      {feature}
                    </div>
                    <div className="nc-comparison-col">
                      <span className="nc-feature-cross">✗</span>
                    </div>
                    <div className="nc-comparison-col">
                      <span className="nc-feature-check">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Premium Plans */}
      <section className="nc-all-plans">
        <div className="nc-container">
          <div className="nc-section-header">
            <h2 className="nc-section-title">{plansHeadline}</h2>
            <p className="nc-section-subtitle">{plansSubheadline}</p>
          </div>
          
          <div className="nc-plans-note">
            <h3>All Premium plans include</h3>
            <ul className="nc-plans-features">
              {premiumFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewComponent