const React = require("react")
const { useCampaign, useBasket, useLimioContext, groupOffers } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const { useStaticProps } = require("./componentStaticProps")
require("./index.css")

function LimioComponentViaNewApp() {
  const props = useStaticProps()
  const { 
    headline,
    subheadline,
    heroCtaText,
    heroCtaUrl,
    learnMoreText,
    learnMoreUrl,
    offersHeadline,
    offersSubheadline,
    primaryColor__limio_color: primaryColor,
    accentColor__limio_color: accentColor,
    groupLabels,
    showBillingToggle,
    maxCards,
    ctaText,
    featuredBadgeText,
    loadingText,
    companyLogosHeadline,
    companyLogos
  } = props
  
  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext() || {}

  const grouped = React.useMemo(() => groupOffers(offers, groupLabels), [offers, groupLabels])
  const [activeGroup, setActiveGroup] = React.useState(grouped[0]?.groupId)
  
  const visibleOffers = React.useMemo(() => {
    const groupOffers = grouped.find(g => g.groupId === activeGroup)?.offers || []
    return groupOffers.slice(0, parseInt(maxCards) || 3)
  }, [grouped, activeGroup, maxCards])

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

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#ffffff"
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  return (
    <div 
      className="lc-wrapper" 
      style={{ 
        "--lc-primary": primaryColor,
        "--lc-accent": accentColor,
        "--lc-primary-contrast": getContrastColor(primaryColor),
        "--lc-accent-contrast": getContrastColor(accentColor)
      }}
    >
      {/* Hero Section */}
      <div className="lc-hero">
        <div className="lc-hero-pattern">
          <div className="lc-pattern-circle lc-pattern-1"></div>
          <div className="lc-pattern-circle lc-pattern-2"></div>
          <div className="lc-pattern-circle lc-pattern-3"></div>
        </div>
        
        <div className="lc-hero-content">
          <h1 className="lc-hero-headline">{headline}</h1>
          <p className="lc-hero-subheadline">{subheadline}</p>
          
          <div className="lc-hero-actions">
            <a href={heroCtaUrl} className="lc-hero-cta lc-hero-cta--primary">
              <span>{heroCtaText}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href={learnMoreUrl} className="lc-hero-cta lc-hero-cta--secondary">
              {learnMoreText}
            </a>
          </div>
        </div>
      </div>

      {/* Company Logos Section */}
      {companyLogos && companyLogos.length > 0 && (
        <div className="lc-logos-section">
          <h3 className="lc-logos-headline">{companyLogosHeadline}</h3>
          <div className="lc-logos-grid">
            {companyLogos.map((company, index) => (
              <div key={index} className="lc-logo-item">
                {company.url ? (
                  <a href={company.url} className="lc-logo-link" target="_blank" rel="noopener noreferrer">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="lc-logo-image" />
                    ) : (
                      <div className="lc-logo-placeholder">
                        <span>{company.name}</span>
                      </div>
                    )}
                  </a>
                ) : (
                  company.logo ? (
                    <img src={company.logo} alt={company.name} className="lc-logo-image" />
                  ) : (
                    <div className="lc-logo-placeholder">
                      <span>{company.name}</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers Section */}
      {offers && offers.length > 0 && (
        <div className="lc-offers-section">
          <div className="lc-offers-header">
            <h2 className="lc-offers-headline">{offersHeadline}</h2>
            <p className="lc-offers-subheadline">{offersSubheadline}</p>
          </div>

          {/* Billing Toggle */}
          {showBillingToggle && grouped.length > 1 && (
            <div className="lc-toggle-wrapper">
              <div className="lc-toggle">
                {grouped.map(group => (
                  <button
                    key={group.groupId}
                    className={`lc-toggle-btn ${activeGroup === group.groupId ? "lc-toggle-btn--active" : ""}`}
                    onClick={() => setActiveGroup(group.groupId)}
                  >
                    <span className="lc-toggle-label">{group.label}</span>
                    {group.groupId === "annual" && (
                      <span className="lc-toggle-savings">Save 20%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Cards Grid */}
          <div className="lc-offers-grid">
            {visibleOffers.map((offer, index) => {
              const attrs = offer?.data?.attributes || {}
              const isFeatured = attrs.best_value__limio || index === 1
              const displayName = attrs.display_name__limio || offer.name || "Plan"
              const badgeText = attrs.badge_text__limio || (isFeatured ? featuredBadgeText : "")

              return (
                <div 
                  key={offer.id} 
                  className={`lc-offer-card ${isFeatured ? "lc-offer-card--featured" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="lc-offer-header">
                    {badgeText && (
                      <div className="lc-offer-badge">
                        {badgeText}
                      </div>
                    )}
                    <div className="lc-offer-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h3 className="lc-offer-title" dangerouslySetInnerHTML={{ __html: displayName }} />

                  {/* Price Display */}
                  <div className="lc-offer-pricing">
                    <div className="lc-offer-price" dangerouslySetInnerHTML={{ __html: attrs.display_price__limio || "" }} />
                    {attrs.detailed_display_price__limio && (
                      <div className="lc-offer-detail" dangerouslySetInnerHTML={{ __html: attrs.detailed_display_price__limio }} />
                    )}
                  </div>

                  {/* Features List */}
                  {attrs.offer_features__limio && (
                    <div className="lc-offer-features">
                      <div className="lc-offer-features-content" dangerouslySetInnerHTML={{ __html: attrs.offer_features__limio }} />
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="lc-offer-footer">
                    <button
                      className={`lc-offer-cta ${isFeatured ? "lc-offer-cta--featured" : ""}`}
                      onClick={() => handleAddToBasket(offer)}
                      disabled={basketLoading}
                    >
                      <span className="lc-offer-cta-text">
                        {basketLoading ? loadingText : (attrs.cta_text__limio || ctaText)}
                      </span>
                      {!basketLoading && (
                        <span className="lc-offer-cta-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

module.exports = LimioComponentViaNewApp
module.exports.default = LimioComponentViaNewApp