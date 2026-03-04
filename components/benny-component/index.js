const { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket } = require("@limio/sdk")
const { sanitiseHTML, formatDisplayPrice } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const React = require("react")
const packageData = require("./package.json")

const defaultProps = getPropsFromPackageJson(packageData)

const BennyComponent = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline, 
    heroSubtitle, 
    ctaText, 
    secondaryCta,
    featuresHeadline,
    feature1Title,
    feature1Description,
    feature2Title,
    feature2Description,
    feature3Title,
    feature3Description,
    pricingHeadline,
    pricingSubtitle,
    primaryColor__limio_color,
    showWireframeBackground
  } = props
  
  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()

  const handleAddToBasket = async (offer) => {
    if (basketLoading) return
    const checkoutId = getCurrentBasketId()
    if (!checkoutId) {
      await initiateCheckout({ order: { orderItems: [{ offer }] } })
    } else {
      await addOfferToBasket({ offer })
    }
    if (pageOptions?.pushToCheckout) {
      await navigateToCheckout()
    }
  }

  const getContrastColor = (hex) => {
    if (!hex) return "#000000"
    const h = hex.replace("#", "")
    const r = parseInt(h.substr(0, 2), 16)
    const g = parseInt(h.substr(2, 2), 16) 
    const b = parseInt(h.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
  }

  return (
    <div 
      className="bc-wrapper" 
      style={{ 
        "--bc-primary": primaryColor__limio_color,
        "--bc-primary-tint": `color-mix(in srgb, ${primaryColor__limio_color} 6%, white)`,
        "--bc-contrast": getContrastColor(primaryColor__limio_color)
      }}
    >
      {/* Hero Section */}
      <section className="bc-hero">
        {showWireframeBackground && <div className="bc-wireframe-bg"></div>}
        <div className="bc-container">
          <div className="bc-hero-content">
            <h1 className="bc-hero-title">{heroHeadline}</h1>
            <p className="bc-hero-subtitle">{heroSubtitle}</p>
            <div className="bc-hero-actions">
              <button className="bc-btn bc-btn-primary">{ctaText}</button>
              <button className="bc-btn bc-btn-secondary">{secondaryCta}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bc-features">
        <div className="bc-container">
          <div className="bc-section-header">
            <h2 className="bc-section-title">{featuresHeadline}</h2>
          </div>
          <div className="bc-features-grid">
            <div className="bc-feature-card">
              <div className="bc-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386L9.663 17z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="bc-feature-title">{feature1Title}</h3>
              <p className="bc-feature-description">{feature1Description}</p>
            </div>
            <div className="bc-feature-card">
              <div className="bc-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="bc-feature-title">{feature2Title}</h3>
              <p className="bc-feature-description">{feature2Description}</p>
            </div>
            <div className="bc-feature-card">
              <div className="bc-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="bc-feature-title">{feature3Title}</h3>
              <p className="bc-feature-description">{feature3Description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bc-pricing">
        <div className="bc-container">
          <div className="bc-section-header">
            <h2 className="bc-section-title">{pricingHeadline}</h2>
            <p className="bc-section-subtitle">{pricingSubtitle}</p>
          </div>
          <div className="bc-pricing-grid">
            {offers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isPopular = attributes.best_value__limio
              
              return (
                <div 
                  key={offer.id} 
                  className={`bc-pricing-card ${isPopular ? 'bc-pricing-card--popular' : ''}`}
                >
                  {isPopular && (
                    <div className="bc-popular-badge">Most Popular</div>
                  )}
                  <div className="bc-pricing-header">
                    <h3 className="bc-pricing-title">
                      {attributes.display_name__limio || 'Plan'}
                    </h3>
                    <div 
                      className="bc-pricing-price"
                      dangerouslySetInnerHTML={{
                        __html: sanitiseHTML(attributes.display_price__limio || '$0')
                      }}
                    />
                    <div 
                      className="bc-pricing-details"
                      dangerouslySetInnerHTML={{
                        __html: sanitiseHTML(attributes.detailed_display_price__limio || '')
                      }}
                    />
                  </div>
                  <div className="bc-pricing-content">
                    <div 
                      className="bc-pricing-features"
                      dangerouslySetInnerHTML={{
                        __html: sanitiseHTML(attributes.offer_features__limio || '')
                      }}
                    />
                  </div>
                  <div className="bc-pricing-footer">
                    <button 
                      className={`bc-btn ${isPopular ? 'bc-btn-primary' : 'bc-btn-secondary'} bc-btn-full`}
                      onClick={() => handleAddToBasket(offer)}
                      disabled={basketLoading}
                    >
                      {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Started')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

module.exports = BennyComponent
module.exports.default = BennyComponent