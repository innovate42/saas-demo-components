import React, { useState, useMemo } from "react"
import { useCampaign, useBasket, useUser, useSubscriptions, useLimioContext, useComponentProps, getPropsFromPackageJson, groupOffers } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { format } from "date-fns"
import xss from "xss"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const sanitiseHTML = (str) => xss(str || "")

const getContrastColor = (hex) => {
  if (!hex) return "#ffffff"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
}

const WinBackComponent = () => {
  const props = useComponentProps(defaultProps)
  const {
    headline,
    subheadline,
    ctaText,
    subscriptionHistoryHeadline,
    offersHeadline,
    offersSubheadline,
    primaryColor__limio_color,
    secondaryColor__limio_color,
    showUserGreeting,
    showSubscriptionHistory,
    groupLabels,
    showGroupSwitcher,
    welcomeBackMessage__limio_richtext,
    benefitsMessage__limio_richtext
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { attributes: user, loginStatus } = useUser()
  const { subscriptions } = useSubscriptions()
  const { isInPageBuilder } = useLimioContext()

  // Safe initialization of activeGroup
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'monthly'
  const [activeGroup, setActiveGroup] = useState(defaultGroupId)

  // Safe grouping of offers
  const safeOffers = Array.isArray(offers) ? offers : []
  const groupedOffers = groupOffers(safeOffers, safeGroupLabels)
  const currentOffers = groupedOffers.find(g => g.groupId === activeGroup)?.offers || safeOffers

  // Get user's most recent subscription
  const mostRecentSubscription = useMemo(() => {
    if (!subscriptions || !Array.isArray(subscriptions)) return null
    
    return subscriptions
      .filter(sub => sub?.status && ['cancelled', 'expired', 'paused'].includes(sub.status.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.end_date || a.created_date || 0)
        const dateB = new Date(b.end_date || b.created_date || 0)
        return dateB - dateA
      })[0] || null
  }, [subscriptions])

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

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return "—"
    }
  }

  const getUserDisplayName = () => {
    if (!user) return null
    return user.first_name || user.firstName || user.name || user.email?.split('@')[0] || null
  }

  const isLoggedIn = loginStatus === 'logged-in'
  const userDisplayName = getUserDisplayName()

  return (
    <div 
      className="wb-wrapper"
      style={{ 
        "--wb-primary": primaryColor__limio_color || "#d14424",
        "--wb-secondary": secondaryColor__limio_color || "#f47c24",
        "--wb-contrast": getContrastColor(primaryColor__limio_color || "#d14424")
      }}
    >
      {/* Hero Section */}
      <section className="wb-hero">
        <div className="wb-container">
          <div className="wb-hero-content">
            {showUserGreeting && isLoggedIn && userDisplayName && (
              <div className="wb-greeting">
                <span className="wb-greeting-text">Hey {userDisplayName}! 👋</span>
              </div>
            )}
            <h1 className="wb-hero-headline">{headline}</h1>
            <p className="wb-hero-subheadline">{subheadline}</p>
            
            {welcomeBackMessage__limio_richtext && (
              <div className="wb-welcome-message" dangerouslySetInnerHTML={{ __html: sanitiseHTML(welcomeBackMessage__limio_richtext) }} />
            )}

            {benefitsMessage__limio_richtext && (
              <div className="wb-benefits-message" dangerouslySetInnerHTML={{ __html: sanitiseHTML(benefitsMessage__limio_richtext) }} />
            )}
          </div>
        </div>
      </section>

      {/* Subscription History Section */}
      {showSubscriptionHistory && isLoggedIn && mostRecentSubscription && (
        <section className="wb-history">
          <div className="wb-container">
            <h2 className="wb-section-title">{subscriptionHistoryHeadline}</h2>
            <div className="wb-history-card">
              <div className="wb-history-header">
                <div className="wb-history-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="wb-history-info">
                  <h3 className="wb-history-name">
                    {mostRecentSubscription.name || mostRecentSubscription.id || 'Your Subscription'}
                  </h3>
                  <div className="wb-history-details">
                    <span className="wb-history-status">
                      Status: <span className="wb-status-badge">{mostRecentSubscription.status}</span>
                    </span>
                    {mostRecentSubscription.end_date && (
                      <span className="wb-history-date">
                        Ended: {formatDate(mostRecentSubscription.end_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {mostRecentSubscription.offers && mostRecentSubscription.offers.length > 0 && (
                <div className="wb-history-offers">
                  <h4 className="wb-history-offers-title">Previous Plan Features:</h4>
                  {mostRecentSubscription.offers
                    .filter(offer => offer.record_subtype !== "discount")
                    .map((offer, index) => {
                      const attributes = offer?.data?.attributes || {}
                      if (attributes.offer_features__limio) {
                        return (
                          <div key={index} className="wb-previous-features" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                        )
                      }
                      return null
                    })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Offers Section */}
      <section className="wb-offers">
        <div className="wb-container">
          <div className="wb-section-header">
            <h2 className="wb-section-title">{offersHeadline}</h2>
            <p className="wb-section-subtitle">{offersSubheadline}</p>
          </div>

          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="wb-group-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`wb-group-btn ${activeGroup === group.id ? 'wb-group-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="wb-offers-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isFeatured = attributes.best_value__limio

              return (
                <div key={offer?.id || index} className={`wb-offer-card ${isFeatured ? 'wb-offer-card-featured' : ''}`}>
                  {isFeatured && (
                    <div className="wb-offer-badge">
                      {attributes.badge_text__limio || 'Most Popular'}
                    </div>
                  )}

                  <div className="wb-offer-header">
                    <h3 className="wb-offer-title">
                      {attributes.display_name__limio || 'Plan'}
                    </h3>
                    <div className="wb-offer-price">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '$0') }} />
                    </div>
                    {attributes.detailed_display_price__limio && (
                      <div className="wb-offer-detail" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                    )}
                  </div>

                  {attributes.offer_features__limio && (
                    <div className="wb-offer-features" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                  )}

                  <button
                    type="button"
                    className={`wb-btn ${isFeatured ? 'wb-btn-primary' : 'wb-btn-secondary'} wb-offer-cta`}
                    onClick={() => handleAddToBasket(offer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Adding...' : (attributes.cta_text__limio || ctaText)}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="wb-trust">
        <div className="wb-container">
          <div className="wb-trust-content">
            <div className="wb-trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="wb-trust-text">
              <h3 className="wb-trust-title">Secure & Trusted</h3>
              <p className="wb-trust-description">Your data is safe with us. Cancel anytime, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

WinBackComponent.Skeleton = () => (
  <div className="wb-skeleton">
    <div className="wb-skeleton-line" style={{ width: "60%", height: 32, marginBottom: 16 }} />
    <div className="wb-skeleton-line" style={{ width: "100%", height: 20, marginBottom: 12 }} />
    <div className="wb-skeleton-line" style={{ width: "80%", height: 20, marginBottom: 24 }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: "#f6f9fc", borderRadius: 12, padding: 24, border: "1px solid #e3e8ee" }}>
          <div className="wb-skeleton-line" style={{ width: "70%", height: 20, marginBottom: 16 }} />
          <div className="wb-skeleton-line" style={{ width: "100%", height: 48, marginBottom: 16 }} />
          <div className="wb-skeleton-line" style={{ width: "100%", height: 120, marginBottom: 16 }} />
          <div className="wb-skeleton-line" style={{ width: "100%", height: 44 }} />
        </div>
      ))}
    </div>
  </div>
)

WinBackComponent.Error = () => (
  <div className="wb-error">
    <p>Unable to load your win-back offers. Please try refreshing the page.</p>
  </div>
)

export default WinBackComponent