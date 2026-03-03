const React = require("react")
const { useCampaign, useBasket, useLimioContext, groupOffers } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const { useStaticProps } = require("./componentStaticProps")
require("./index.css")

function MyComponent() {
  const props = useStaticProps()
  const {
    headline,
    description__limio_richtext: description,
    primaryColor__limio_color: primaryColor,
    accentColor__limio_color: accentColor,
    groupLabels,
    showBilling,
    featuresTitle,
    detailsTitle,
    theme
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext() || {}

  const grouped = React.useMemo(() => groupOffers(offers, groupLabels), [offers, groupLabels])
  const [activeGroup, setActiveGroup] = React.useState(grouped[0]?.groupId)
  const [selectedOffer, setSelectedOffer] = React.useState(null)
  const [isChanging, setIsChanging] = React.useState(false)

  const visibleOffers = grouped.find(g => g.groupId === activeGroup)?.offers || []

  // Set initial selected offer when visible offers change
  React.useEffect(() => {
    if (visibleOffers.length > 0 && !selectedOffer) {
      setSelectedOffer(visibleOffers[0])
    } else if (visibleOffers.length > 0 && selectedOffer) {
      // Check if current selected offer is in visible offers, if not select first
      const isCurrentOfferVisible = visibleOffers.some(offer => offer.id === selectedOffer.id)
      if (!isCurrentOfferVisible) {
        setIsChanging(true)
        setTimeout(() => {
          setSelectedOffer(visibleOffers[0])
          setIsChanging(false)
        }, 150)
      }
    }
  }, [visibleOffers, selectedOffer])

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

  const handleOfferSelect = (offer) => {
    if (offer.id === selectedOffer?.id) return
    setIsChanging(true)
    setTimeout(() => {
      setSelectedOffer(offer)
      setIsChanging(false)
    }, 150)
  }

  const selectedAttrs = selectedOffer?.data?.attributes || {}

  return (
    <div
      className={`mc-wrapper mc-wrapper--${theme}`}
      style={{
        "--mc-primary": primaryColor,
        "--mc-accent": accentColor,
        "--mc-contrast": getContrastColor(primaryColor)
      }}
    >
      <div className="mc-container">
        <div className="mc-header">
          <h1 className="mc-headline">{headline}</h1>
          {description && (
            <div className="mc-description" dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>

        {grouped.length > 1 && showBilling && (
          <div className="mc-toggle">
            {grouped.map(g => (
              <button
                key={g.groupId}
                className={`mc-toggle-btn ${activeGroup === g.groupId ? "mc-toggle-btn--active" : ""}`}
                onClick={() => setActiveGroup(g.groupId)}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        <div className="mc-layout">
          {/* Left sidebar with offer cards */}
          <div className="mc-sidebar">
            <div className="mc-offer-list">
              {visibleOffers.map((offer, index) => {
                const attrs = offer?.data?.attributes || {}
                const isSelected = selectedOffer?.id === offer.id
                const isBestValue = attrs.best_value__limio

                return (
                  <div
                    key={offer.id}
                    className={`mc-offer-card ${isSelected ? "mc-offer-card--selected" : ""} ${isBestValue ? "mc-offer-card--featured" : ""}`}
                    onClick={() => handleOfferSelect(offer)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {isBestValue && attrs.badge_text__limio && (
                      <div className="mc-offer-badge">{attrs.badge_text__limio}</div>
                    )}
                    <div className="mc-offer-name">
                      {attrs.display_name__limio || offer.name}
                    </div>
                    <div className="mc-offer-price" dangerouslySetInnerHTML={{ __html: attrs.display_price__limio || "" }} />
                    {attrs.detailed_display_price__limio && (
                      <div className="mc-offer-detail" dangerouslySetInnerHTML={{ __html: attrs.detailed_display_price__limio }} />
                    )}
                    {isSelected && (
                      <div className="mc-offer-checkmark">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main content area with selected offer details */}
          <div className="mc-main">
            {selectedOffer ? (
              <div className={`mc-hero ${isChanging ? "mc-hero--changing" : ""}`}>
                <div className="mc-hero-header">
                  <div className="mc-hero-title-section">
                    <h2 className="mc-hero-title">
                      {selectedAttrs.display_name__limio || selectedOffer.name}
                    </h2>
                    <div className="mc-hero-price" dangerouslySetInnerHTML={{ __html: selectedAttrs.display_price__limio || "" }} />
                    {selectedAttrs.detailed_display_price__limio && (
                      <div className="mc-hero-price-detail" dangerouslySetInnerHTML={{ __html: selectedAttrs.detailed_display_price__limio }} />
                    )}
                  </div>

                  <button
                    className="mc-hero-cta"
                    onClick={() => handleAddToBasket(selectedOffer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? (
                      <>
                        <span className="mc-spinner"></span>
                        Loading...
                      </>
                    ) : (selectedAttrs.cta_text__limio || "Subscribe")}
                  </button>
                </div>

                {selectedAttrs.display_description__limio && (
                  <div className="mc-hero-description" dangerouslySetInnerHTML={{ __html: selectedAttrs.display_description__limio }} />
                )}

                <div className="mc-hero-content">
                  {selectedAttrs.offer_features__limio && (
                    <div className="mc-hero-section">
                      <h3 className="mc-section-title">{featuresTitle}</h3>
                      <div className="mc-features" dangerouslySetInnerHTML={{ __html: selectedAttrs.offer_features__limio }} />
                    </div>
                  )}

                  <div className="mc-hero-section">
                    <h3 className="mc-section-title">{detailsTitle}</h3>
                    <div className="mc-details">
                      {selectedAttrs.term__limio && (
                        <div className="mc-detail-row">
                          <span className="mc-detail-label">Term Length:</span>
                          <span className="mc-detail-value">
                            {selectedAttrs.term__limio.length} {selectedAttrs.term__limio.type}
                          </span>
                        </div>
                      )}
                      
                      {selectedAttrs.autoRenew__limio !== undefined && (
                        <div className="mc-detail-row">
                          <span className="mc-detail-label">Auto Renewal:</span>
                          <span className="mc-detail-value">
                            {selectedAttrs.autoRenew__limio ? "Yes" : "No"}
                          </span>
                        </div>
                      )}

                      {selectedAttrs.payment_types__limio && (
                        <div className="mc-detail-row">
                          <span className="mc-detail-label">Payment Methods:</span>
                          <span className="mc-detail-value">
                            {selectedAttrs.payment_types__limio.map(type => 
                              type.replace('zuora_', '').replace('_', ' ')
                            ).join(', ')}
                          </span>
                        </div>
                      )}

                      {selectedAttrs.default_quantity_options__limio && (
                        <div className="mc-detail-row">
                          <span className="mc-detail-label">Quantity Range:</span>
                          <span className="mc-detail-value">
                            {selectedAttrs.default_quantity_options__limio.minimum_quantity} - {selectedAttrs.default_quantity_options__limio.maximum_quantity} users
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mc-placeholder">
                <div className="mc-placeholder-content">
                  <div className="mc-placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>Select a plan to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const getContrastColor = (hexColor) => {
  if (!hexColor) return "#000000"
  const hex = hexColor.replace("#", "")
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

module.exports = MyComponent
module.exports.default = MyComponent