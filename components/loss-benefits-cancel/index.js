import React from "react"
import { useComponentProps, getPropsFromPackageJson, useUser, useSubscriptions, getCurrentOffer } from "@limio/sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const LossBenefitsCancel = () => {
  const props = useComponentProps(defaultProps)
  const { 
    headline, 
    subheadline,
    showUserPlan,
    primaryColor__limio_color,
    warningColor__limio_color,
    emptyText,
    loadingText,
    fallbackFeatures,
    useFallbackFeatures
  } = props

  const { attributes, loaded: userLoaded } = useUser()
  const { subscriptions } = useSubscriptions({ ownerId: attributes?.sub })
  
  // Loading state
  const isLoading = !userLoaded || (attributes?.sub && subscriptions === undefined)
  
  // Get active subscription and its current offer
  const activeSubscription = subscriptions?.find(sub => sub.status === 'active') || subscriptions?.[0]
  const currentOffer = activeSubscription ? getCurrentOffer(activeSubscription) : null
  const offerAttributes = currentOffer?.data?.offer?.data?.attributes || {}

  // Extract features from the current plan
  const featuresHtml = offerAttributes.offer_features__limio
  const planName = offerAttributes.display_name__limio
  const planPrice = offerAttributes.display_price__limio

  // Parse features from HTML list
  const parseFeatures = (htmlString) => {
    if (!htmlString) return []
    
    const liMatch = htmlString.match(/<li[^>]*>(.*?)<\/li>/gi)
    if (!liMatch) return []
    
    return liMatch.map(li => li.replace(/<\/?li[^>]*>/gi, '').trim()).filter(Boolean)
  }

  const subscriptionFeatures = parseFeatures(featuresHtml)
  
  // Determine which features to show
  let features = subscriptionFeatures
  let showFallback = false
  
  if (subscriptionFeatures.length === 0 && useFallbackFeatures) {
    features = fallbackFeatures?.map(item => item.label).filter(Boolean) || []
    showFallback = true
  }

  return (
    <div 
      className="lbc-wrapper"
      style={{ 
        "--lbc-primary": primaryColor__limio_color || "#007CB0",
        "--lbc-warning": warningColor__limio_color || "#ef4444",
        "--lbc-primary-contrast": getContrastColor(primaryColor__limio_color || "#007CB0"),
        "--lbc-warning-contrast": getContrastColor(warningColor__limio_color || "#ef4444")
      }}
    >
      <div className="lbc-container">
        {/* Header */}
        <div className="lbc-header">
          <div className="lbc-warning-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L1 21h22L12 2z" fill="currentColor"/>
              <path d="M12 8v5" stroke="var(--lbc-warning-contrast)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="var(--lbc-warning-contrast)"/>
            </svg>
          </div>
          <h2 className="lbc-headline">{headline}</h2>
          <p className="lbc-subheadline">{subheadline}</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="lbc-loading-state">
            <div className="lbc-loading-spinner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    values="0 12 12;360 12 12" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            <p className="lbc-loading-text">{loadingText}</p>
          </div>
        ) : (
          <>
            {/* Current Plan Info */}
            {showUserPlan && planName && !showFallback && (
              <div className="lbc-current-plan">
                <div className="lbc-plan-header">
                  <h3 className="lbc-plan-name">{planName}</h3>
                  {planPrice && (
                    <div className="lbc-plan-price" dangerouslySetInnerHTML={{ __html: planPrice }} />
                  )}
                </div>
              </div>
            )}

            {/* Fallback plan info when using fallback features */}
            {showUserPlan && showFallback && (
              <div className="lbc-current-plan lbc-fallback-plan">
                <div className="lbc-plan-header">
                  <h3 className="lbc-plan-name">Your Current Subscription</h3>
                  <div className="lbc-fallback-badge">General Benefits</div>
                </div>
              </div>
            )}

            {/* Features Loss List */}
            {features.length > 0 ? (
              <>
                <div className="lbc-features-list">
                  {features.map((feature, index) => (
                    <div key={index} className="lbc-feature-item">
                      <div className="lbc-loss-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="lbc-feature-content">
                        <span className="lbc-feature-text">{feature}</span>
                        <span className="lbc-loss-label">Will be removed</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show notice if using fallback features */}
                {showFallback && (
                  <div className="lbc-fallback-notice">
                    <div className="lbc-notice-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                      </svg>
                    </div>
                    <p className="lbc-notice-text">
                      These are common subscription benefits. Your specific plan may include additional features.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="lbc-empty-state">
                <div className="lbc-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
                    <path d="M8 12h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="lbc-empty-text">{emptyText}</p>
              </div>
            )}

            {/* Impact Summary */}
            {features.length > 0 && (
              <div className="lbc-impact-summary">
                <div className="lbc-impact-content">
                  <h4 className="lbc-impact-title">
                    {features.length} feature{features.length !== 1 ? 's' : ''} will be disabled
                  </h4>
                  <p className="lbc-impact-description">
                    These services will no longer be available after your subscription ends. 
                    You can reactivate your plan at any time to restore full access.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LossBenefitsCancel