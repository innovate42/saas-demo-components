const React = require("react")
const { useCampaign, useBasket, useLimioContext, useComponentProps, getPropsFromPackageJson } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const xss = require("xss")
require("./index.css")

const packageData = require("./package.json")
const defaultProps = getPropsFromPackageJson(packageData)

const sanitizeString = (str) => xss(str || "")

const ComponentTest = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline, 
    heroSubheadline, 
    heroCta,
    heroCtaLink,
    pricingHeadline, 
    pricingSubheadline,
    featuresHeadline,
    primaryColor__limio_color: primaryColor,
    ctaLoadingText,
    trustBadges,
    features,
    enableAnimations
  } = props
  
  const { offers } = useCampaign() || {}
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket() || {}
  const { isInPageBuilder } = useLimioContext() || {}
  
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

  const scrollToPricing = (e) => {
    e.preventDefault()
    const pricingSection = document.getElementById('pricing-section')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Find popular offer (first one with best_value or middle offer)
  const getPopularIndex = () => {
    if (!offers || offers.length === 0) return 0
    const popularIdx = offers.findIndex(offer => offer?.attributes?.best_value__limio === true)
    if (popularIdx !== -1) return popularIdx
    return offers.length >= 3 ? 1 : 0
  }

  const popularIndex = getPopularIndex()

  const getContrastColor = (hex) => {
    if (!hex) return "#ffffff"
    const h = hex.replace("#", "")
    const r = parseInt(h.substr(0, 2), 16)
    const g = parseInt(h.substr(2, 2), 16) 
    const b = parseInt(h.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
  }

  return (
    <div 
      className={`ct-wrapper ${isInPageBuilder ? "ct-wrapper--static" : ""}`}
      style={{
        "--ct-primary": primaryColor,
        "--ct-primary-contrast": getContrastColor(primaryColor)
      }}
    >
      {/* Animated Background */}
      {enableAnimations && (
        <div className="ct-bg">
          <div className="ct-orb ct-orb--1" />
          <div className="ct-orb ct-orb--2" />
          <div className="ct-orb ct-orb--3" />
        </div>
      )}

      {/* Hero Section */}
      <section className="ct-hero">
        <div className="ct-container">
          <div className="ct-hero-content">
            <h1 className="ct-hero-headline">{heroHeadline}</h1>
            <p className="ct-hero-subheadline">{heroSubheadline}</p>
            <div className="ct-hero-actions">
              <a 
                href={heroCtaLink || "#pricing"}
                className="ct-hero-cta"
                onClick={heroCtaLink === "#pricing" ? scrollToPricing : undefined}
              >
                {heroCta}
                <svg className="ct-hero-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            
            {/* Trust Badges */}
            {trustBadges && trustBadges.length > 0 && (
              <div className="ct-trust-badges">
                {trustBadges.map((badge, i) => (
                  <div key={badge.id || i} className="ct-trust-badge">
                    {badge.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="ct-pricing">
        <div className="ct-container">
          <div className="ct-pricing-header">
            <h2 className="ct-pricing-headline">{pricingHeadline}</h2>
            <p className="ct-pricing-subheadline">{pricingSubheadline}</p>
          </div>

          {offers && offers.length > 0 && (
            <div className="ct-cards">
              {offers.map((offer, i) => {
                const attrs = offer?.attributes || {}
                const isPopular = i === popularIndex
                return (
                  <div 
                    key={offer.id || i} 
                    className={`ct-card ${isPopular ? "ct-card--popular" : ""}`}
                  >
                    {isPopular && (
                      <div className="ct-popular-badge">Most Popular</div>
                    )}
                    
                    <div className="ct-card-content">
                      <h3 className="ct-card-name" dangerouslySetInnerHTML={{ __html: sanitizeString(attrs.display_name__limio || offer.name) }} />
                      
                      <div className="ct-card-price" dangerouslySetInnerHTML={{ __html: sanitizeString(attrs.display_price__limio || "Contact for pricing") }} />
                      
                      {attrs.detailed_display_price__limio && (
                        <div className="ct-card-details" dangerouslySetInnerHTML={{ __html: sanitizeString(attrs.detailed_display_price__limio) }} />
                      )}
                      
                      <button
                        className={`ct-card-cta ${isPopular ? "ct-card-cta--primary" : "ct-card-cta--secondary"}`}
                        onClick={() => handleAddToBasket(offer)}
                        disabled={basketLoading}
                      >
                        {basketLoading ? ctaLoadingText : (attrs.cta_text__limio || "Subscribe now")}
                      </button>

                      {attrs.offer_features__limio && (
                        <div className="ct-card-features">
                          <div className="ct-card-features-title">What's included</div>
                          <div 
                            className="ct-card-features-list" 
                            dangerouslySetInnerHTML={{ __html: sanitizeString(attrs.offer_features__limio) }} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="ct-features">
        <div className="ct-container">
          <h2 className="ct-features-headline">{featuresHeadline}</h2>
          
          {features && features.length > 0 && (
            <div className="ct-features-grid">
              {features.map((feature, i) => (
                <div key={feature.id || i} className="ct-feature">
                  <div className="ct-feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="ct-feature-content">
                    <h3 className="ct-feature-title">{feature.title}</h3>
                    <p className="ct-feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Trust */}
      <footer className="ct-footer">
        <div className="ct-container">
          <div className="ct-footer-content">
            <span>🔒 Secure checkout</span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>24/7 support</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

module.exports = ComponentTest
module.exports.default = ComponentTest