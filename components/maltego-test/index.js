import React from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, useLimioContext, groupOffers, sanitiseHTML } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
}

const MaltegoTest = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline,
    heroSubheadline,
    pricingHeadline,
    pricingSubheadline,
    showGroupSwitcher,
    groupLabels,
    primaryColor__limio_color,
    accentColor__limio_color,
    showLogos,
    showComparison
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  // Safe initialization of activeGroup
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'usd'
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

  // Render price with correct currency symbol
  const renderPrice = (offer, group) => {
    const attributes = offer?.data?.attributes || {}
    const currencySymbol = group === 'usd' ? '$' : '€'
    
    if (attributes.display_price__limio) {
      return <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) }} />
    }
    
    return (
      <div className="mt-price-display">
        <span className="mt-price-currency">{currencySymbol}</span>
        <span className="mt-price-amount">0</span>
        <span className="mt-price-period">/ year</span>
      </div>
    )
  }

  return (
    <div 
      className="mt-wrapper"
      style={{ 
        "--mt-primary": primaryColor__limio_color || "#ffd43b",
        "--mt-accent": accentColor__limio_color || "#ffed4a",
        "--mt-primary-contrast": getContrastColor(primaryColor__limio_color || "#ffd43b")
      }}
    >
      {/* Hero Section */}
      <section className="mt-hero">
        <div className="mt-container">
          {showLogos && (
            <div className="mt-logo-section">
              <img 
                src="https://www.maltego.com/img/maltego-logo/Maltego-Logo-Compact-Greyblue.png" 
                alt="Maltego" 
                className="mt-logo"
              />
            </div>
          )}
          <div className="mt-hero-content">
            <h1 className="mt-hero-headline">{heroHeadline}</h1>
            <p className="mt-hero-subheadline">{heroSubheadline}</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mt-pricing">
        <div className="mt-container">
          <div className="mt-section-header">
            <h2 className="mt-section-title">{pricingHeadline}</h2>
            <p className="mt-section-subtitle">{pricingSubheadline}</p>
          </div>
          
          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="mt-currency-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`mt-currency-btn ${activeGroup === group.id ? 'mt-currency-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isBestValue = attributes.best_value__limio
              const planName = attributes.display_name__limio || 'Plan'
              
              return (
                <div key={offer?.id || index} className={`mt-pricing-card ${isBestValue ? 'mt-pricing-card-featured' : ''}`}>
                  {isBestValue && (
                    <div className="mt-pricing-badge">
                      Best Value
                    </div>
                  )}
                  
                  <div className="mt-pricing-header">
                    <h3 className="mt-pricing-title">
                      {planName}
                    </h3>
                    {attributes.detailed_display_price__limio && (
                      <p className="mt-pricing-subtitle" 
                         dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                    )}
                    
                    <div className="mt-pricing-price">
                      {renderPrice(offer, activeGroup)}
                    </div>
                    
                    {planName.toLowerCase().includes('basic') && (
                      <div className="mt-free-badge">Use for free</div>
                    )}
                  </div>

                  {attributes.offer_features__limio && (
                    <div className="mt-pricing-features">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                    </div>
                  )}

                  <div className="mt-pricing-footer">
                    <button
                      type="button"
                      className={`mt-btn ${isBestValue ? 'mt-btn-primary' : 'mt-btn-secondary'} mt-pricing-cta`}
                      onClick={() => handleAddToBasket(offer)}
                      disabled={basketLoading}
                    >
                      {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Started')}
                    </button>
                    
                    <div className="mt-features-link">
                      <a href="#" className="mt-link">See all features</a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Available in Every Plan Section */}
      <section className="mt-info">
        <div className="mt-container">
          <div className="mt-info-header">
            <h2 className="mt-section-title">Now available in every plan</h2>
          </div>
          
          <div className="mt-info-grid">
            <div className="mt-info-card">
              <div className="mt-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Maltego Graph</h3>
              <p>All users get access to our flagship product for link analysis, now with more data than ever before!</p>
            </div>
            
            <div className="mt-info-card">
              <div className="mt-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Maltego Academy</h3>
              <p>Learn how to maximize your use of Maltego at your own pace, and join live sessions with our expert team.</p>
            </div>
            
            <div className="mt-info-card">
              <div className="mt-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Maltego Support</h3>
              <p>Get support from our team any day of the week to ensure Maltego meets your investigative needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      {showComparison && (
        <section className="mt-comparison">
          <div className="mt-container">
            <div className="mt-section-header">
              <h2 className="mt-section-title">Compare our Plans</h2>
            </div>
            
            <div className="mt-comparison-table-wrapper">
              <table className="mt-comparison-table">
                <thead>
                  <tr>
                    <th className="mt-feature-header">Features</th>
                    <th className="mt-plan-header">Basic</th>
                    <th className="mt-plan-header">Entry</th>
                    <th className="mt-plan-header mt-featured">Professional</th>
                    <th className="mt-plan-header">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mt-feature-name">Maltego Graph (Community Edition)</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Hunchly for web capture</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Search (unlimited)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Commercial data access</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Monitor (optional)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Evidence (optional)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Premium support & training</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <svg className="mt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default MaltegoTest