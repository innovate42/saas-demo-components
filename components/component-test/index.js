const React = require("react")
const { useCampaign, useBasket, useLimioContext, useComponentProps, getPropsFromPackageJson } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const xss = require("xss")
require("./index.css")

const packageData = require("./package.json")
const defaultProps = getPropsFromPackageJson(packageData)

const ComponentTest = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline, 
    heroSubheadline, 
    featuresHeadline,
    primaryColor__limio_color: primaryColor,
    ctaLoadingText,
    features,
    showAnimations
  } = props
  
  const { offers } = useCampaign() || {}
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket() || {}
  const { isInPageBuilder } = useLimioContext() || {}
  
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
      console.error("Error adding to basket:", error)
    }
  }

  const getContrastColor = (hex) => {
    if (!hex) return "#ffffff"
    const h = hex.replace("#", "")
    const r = parseInt(h.substr(0, 2), 16)
    const g = parseInt(h.substr(2, 2), 16) 
    const b = parseInt(h.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
  }

  // Safe HTML sanitization function
  const sanitizeHTML = (html) => {
    if (!html) return ""
    if (typeof html !== 'string') return String(html)
    return xss(html, {
      whiteList: {
        p: [],
        div: ["class"],
        span: ["class"],
        strong: [],
        b: [],
        em: [],
        i: [],
        ul: [],
        ol: [],
        li: [],
        br: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        small: []
      }
    })
  }

  // Helper function to get offer data with fallbacks
  const getOfferData = (offer) => {
    const attrs = offer?.data?.attributes || {}
    return {
      title: attrs.display_name__limio || "Plan",
      price: attrs.display_price__limio || "Contact for pricing",
      detailsPrice: attrs.detailed_display_price__limio,
      features: attrs.offer_features__limio,
      ctaText: attrs.cta_text__limio || "Get Started",
      badge: attrs.badge_text__limio,
      isBestValue: attrs.best_value__limio || false
    }
  }

  return (
    <div 
      className={`ct-wrapper ${isInPageBuilder ? "ct-wrapper--static" : ""}`}
      style={{
        "--ct-primary": primaryColor,
        "--ct-primary-contrast": getContrastColor(primaryColor)
      }}
    >
      {/* Hero Section */}
      <section className="ct-hero">
        <div className="ct-container">
          <div className="ct-hero-content">
            <h1 className="ct-hero-headline">{heroHeadline}</h1>
            <p className="ct-hero-subheadline">{heroSubheadline}</p>
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="ct-pricing">
        <div className="ct-container">
          {offers && offers.length > 0 ? (
            <div className={`ct-pricing-grid ct-pricing-grid--${offers.length > 3 ? 'many' : offers.length}`}>
              {offers.map((offer, index) => {
                const offerData = getOfferData(offer)
                const isRecommended = offerData.isBestValue || index === 0
                
                return (
                  <div key={offer.id || index} className={`ct-plan ${isRecommended ? 'ct-plan--recommended' : ''}`}>
                    {(offerData.badge || isRecommended) && (
                      <div className="ct-plan-badge">
                        {offerData.badge || "Recommended"}
                      </div>
                    )}
                    
                    <div className="ct-plan-header">
                      <h2 className="ct-plan-title">{offerData.title}</h2>
                      
                      <div className="ct-plan-price-section">
                        <div 
                          className="ct-plan-price" 
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(offerData.price) }} 
                        />
                        
                        {offerData.detailsPrice && (
                          <div 
                            className="ct-plan-details" 
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(offerData.detailsPrice) }} 
                          />
                        )}
                      </div>
                      
                      <button
                        className={`ct-plan-cta ${isRecommended ? 'ct-plan-cta--primary' : 'ct-plan-cta--secondary'}`}
                        onClick={() => handleAddToBasket(offer)}
                        disabled={basketLoading}
                      >
                        {basketLoading ? ctaLoadingText : offerData.ctaText}
                      </button>
                    </div>

                    {offerData.features && (
                      <div className="ct-plan-content">
                        <div 
                          className="ct-plan-features" 
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(offerData.features) }} 
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="ct-no-offers">
              <p>No offers available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="ct-features">
        <div className="ct-container">
          <div className="ct-features-intro">
            <h2 className="ct-features-headline">{featuresHeadline}</h2>
          </div>
          
          {features && features.length > 0 && (
            <div className="ct-features-grid">
              {features.map((feature, i) => (
                <div key={feature.id || i} className="ct-feature-card">
                  <div className="ct-feature-header">
                    <div className="ct-feature-icon">
                      {i === 0 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {i === 1 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                      {i === 3 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {i > 3 && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <h3 className="ct-feature-title">{feature.title}</h3>
                  </div>
                  <p className="ct-feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="ct-stats">
        <div className="ct-container">
          <div className="ct-stats-grid">
            <div className="ct-stat-item">
              <div className="ct-stat-number">16</div>
              <div className="ct-stat-label">Healthcare Brands</div>
            </div>
            <div className="ct-stat-item">
              <div className="ct-stat-number">700+</div>
              <div className="ct-stat-label">Healthcare Professionals</div>
            </div>
            <div className="ct-stat-item">
              <div className="ct-stat-number">10+</div>
              <div className="ct-stat-label">Years of Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ct-cta-section">
        <div className="ct-container">
          <div className="ct-cta-content">
            <h2 className="ct-cta-title">Ready to revolutionize your healthcare practice?</h2>
            <p className="ct-cta-description">Join the hundreds of healthcare professionals who trust PracticeTek to grow their business.</p>
            <button className="ct-cta-button">
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

module.exports = ComponentTest
module.exports.default = ComponentTest