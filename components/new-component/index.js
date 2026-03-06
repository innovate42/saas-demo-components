import React from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, useLimioContext, sanitiseHTML } from "@limio/sdk"
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

const NewComponent = () => {
  const props = useComponentProps(defaultProps)
  const { 
    headline, 
    subheadline, 
    ctaText,
    alternativeCtaText,
    showAlternativeCta,
    primaryColor__limio_color
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  const safeOffers = Array.isArray(offers) ? offers : []

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

  // Extract features from offers to show what will be lost
  const lostFeatures = React.useMemo(() => {
    const allFeatures = []
    
    safeOffers.forEach(offer => {
      const attributes = offer?.data?.attributes || {}
      const features = attributes.offer_features__limio
      
      if (features) {
        // Parse HTML to extract feature list items
        const div = document.createElement('div')
        div.innerHTML = features
        const listItems = div.querySelectorAll('li')
        listItems.forEach(item => {
          const text = item.textContent?.trim()
          if (text && !allFeatures.some(f => f.text === text)) {
            allFeatures.push({ text, icon: 'feature' })
          }
        })
      }
    })

    // If no features found from offers, show default security-focused features
    if (allFeatures.length === 0) {
      return [
        { text: "Advanced web isolation and protection", icon: "shield" },
        { text: "Real-time threat detection and blocking", icon: "security" },
        { text: "Secure research environment access", icon: "research" },
        { text: "Anonymous browsing capabilities", icon: "privacy" },
        { text: "24/7 security monitoring", icon: "monitoring" },
        { text: "Compliance reporting and audit logs", icon: "compliance" }
      ]
    }

    return allFeatures.slice(0, 6) // Limit to 6 features for better layout
  }, [safeOffers])

  const getIconSvg = (iconType) => {
    switch (iconType) {
      case 'shield':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'security':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'research':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'privacy':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'monitoring':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M2 3h20v18H2zM8 21l4-4 4 4M12 17v4" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 8l4 4 6-6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'compliance':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
    }
  }

  const primaryOffer = safeOffers.find(offer => offer?.data?.attributes?.best_value__limio) || safeOffers[0]

  return (
    <div 
      className="nc-wrapper"
      style={{ 
        "--nc-primary": primaryColor__limio_color || "#0080ff",
        "--nc-primary-tint": primaryColor__limio_color ? `${primaryColor__limio_color}15` : "#0080ff15",
        "--nc-contrast": getContrastColor(primaryColor__limio_color || "#0080ff")
      }}
    >
      <section className="nc-section">
        <div className="nc-container">
          <div className="nc-header">
            <div className="nc-warning-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="nc-headline">{headline}</h2>
            <p className="nc-subheadline">{subheadline}</p>
          </div>

          <div className="nc-features-grid">
            {lostFeatures.map((feature, index) => (
              <div key={index} className="nc-feature-card">
                <div className="nc-feature-icon nc-feature-icon-lost">
                  {getIconSvg(feature.icon)}
                </div>
                <div className="nc-feature-content">
                  <h3 className="nc-feature-title">{feature.text}</h3>
                  <div className="nc-feature-status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Will be removed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="nc-cta-section">
            <div className="nc-cta-card">
              <h3 className="nc-cta-headline">Keep your protection active</h3>
              <p className="nc-cta-description">Don't lose access to these critical security features. Continue your subscription to maintain full protection.</p>
              
              <div className="nc-cta-buttons">
                {primaryOffer && (
                  <button
                    type="button"
                    className="nc-btn nc-btn-primary"
                    onClick={() => handleAddToBasket(primaryOffer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Processing...' : ctaText}
                  </button>
                )}
                
                {showAlternativeCta && (
                  <button type="button" className="nc-btn nc-btn-secondary">
                    {alternativeCtaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewComponent