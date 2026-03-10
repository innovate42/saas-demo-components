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
    showComparison,
    showTestimonials,
    showProducts,
    showFAQ
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
                src="https://www.maltego.com/img/maltego-logo/Maltego-Logo-Compact-White.png" 
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

      {/* Customer Testimonials */}
      {showTestimonials && (
        <section className="mt-testimonials">
        <div className="mt-container">
          <div className="mt-section-header">
            <h2 className="mt-section-title">Trusted by investigators worldwide</h2>
            <p className="mt-section-subtitle">See how organizations use Maltego to accelerate their investigations</p>
          </div>
          
          <div className="mt-testimonials-grid">
            <div className="mt-testimonial-card">
              <div className="mt-testimonial-content">
                <p>"Maltego is simply limitless in the options that it provides us. We see great potential in the default options available in Maltego, from graphing capabilities to the different entities to data integrations."</p>
              </div>
              <div className="mt-testimonial-footer">
                <div className="mt-testimonial-author">
                  <div className="mt-testimonial-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mt-testimonial-info">
                    <div className="mt-testimonial-name">Law Enforcement Professional</div>
                    <div className="mt-testimonial-role">Digital Investigations Unit</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-testimonial-card">
              <div className="mt-testimonial-content">
                <p>"Maltego is the first tool I'd install on any researchers laptop, and the first I open any time I'm starting a new investigation. From the ability to access many different data sources through one tool, to the advanced visualisations, its an absolutely essential part of modern cybercrime research."</p>
              </div>
              <div className="mt-testimonial-footer">
                <div className="mt-testimonial-author">
                  <div className="mt-testimonial-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mt-testimonial-info">
                    <div className="mt-testimonial-name">Cybercrime Researcher</div>
                    <div className="mt-testimonial-role">Security Intelligence</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-testimonial-card">
              <div className="mt-testimonial-content">
                <p>"Maltego allows us to quickly pull data from profiles, posts, and comments into one graph, where we can conduct text searches and see connections. In just a few minutes, we can narrow initial research to a handful individuals using variations of aliases connected to suspected local traffickers."</p>
              </div>
              <div className="mt-testimonial-footer">
                <div className="mt-testimonial-author">
                  <div className="mt-testimonial-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mt-testimonial-info">
                    <div className="mt-testimonial-name">Human Trafficking Unit</div>
                    <div className="mt-testimonial-role">Law Enforcement Agency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Product Showcase */}
      {showProducts && (
        <section className="mt-products">
        <div className="mt-container">
          <div className="mt-section-header">
            <h2 className="mt-section-title">Explore the Maltego Platform</h2>
            <p className="mt-section-subtitle">Powerful tools designed for modern digital investigations</p>
          </div>
          
          <div className="mt-products-grid">
            <div className="mt-product-card">
              <div className="mt-product-image">
                <div className="mt-product-screenshot">
                  <svg width="240" height="140" viewBox="0 0 240 140" fill="none">
                    <rect width="240" height="140" rx="8" fill="var(--mt-card)"/>
                    <circle cx="60" cy="50" r="8" fill="var(--mt-primary)"/>
                    <circle cx="180" cy="90" r="8" fill="#48bb78"/>
                    <circle cx="120" cy="70" r="6" fill="#cbd5e0"/>
                    <line x1="60" y1="50" x2="120" y2="70" stroke="var(--mt-border)" strokeWidth="2"/>
                    <line x1="120" y1="70" x2="180" y2="90" stroke="var(--mt-border)" strokeWidth="2"/>
                    <line x1="60" y1="50" x2="180" y2="90" stroke="var(--mt-border)" strokeWidth="1" strokeDasharray="3,3"/>
                  </svg>
                </div>
              </div>
              <div className="mt-product-content">
                <h3>Maltego Graph</h3>
                <p>Complex link analysis for large datasets. Visualize relationships and patterns in your investigation data through an intuitive graph interface.</p>
                <div className="mt-product-features">
                  <span>Desktop Application</span>
                  <span>Data Visualization</span>
                  <span>Transform Hub</span>
                </div>
              </div>
            </div>

            <div className="mt-product-card">
              <div className="mt-product-image">
                <div className="mt-product-screenshot">
                  <svg width="240" height="140" viewBox="0 0 240 140" fill="none">
                    <rect width="240" height="140" rx="8" fill="var(--mt-card)"/>
                    <rect x="20" y="30" width="200" height="8" rx="4" fill="var(--mt-border)"/>
                    <rect x="20" y="50" width="160" height="8" rx="4" fill="var(--mt-text-muted)"/>
                    <rect x="20" y="70" width="180" height="8" rx="4" fill="var(--mt-text-muted)"/>
                    <rect x="20" y="90" width="140" height="8" rx="4" fill="var(--mt-text-muted)"/>
                    <circle cx="200" cy="35" r="12" fill="var(--mt-primary)"/>
                    <path d="M195 35l3 3 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="mt-product-content">
                <h3>Maltego Search</h3>
                <p>Quick OSINT searches on suspects and threat actors with data from social media, dark web, identity databases, and breach data.</p>
                <div className="mt-product-features">
                  <span>Web-based</span>
                  <span>OSINT Data</span>
                  <span>Quick Results</span>
                </div>
              </div>
            </div>

            <div className="mt-product-card">
              <div className="mt-product-image">
                <div className="mt-product-screenshot">
                  <svg width="240" height="140" viewBox="0 0 240 140" fill="none">
                    <rect width="240" height="140" rx="8" fill="var(--mt-card)"/>
                    <rect x="20" y="20" width="200" height="100" rx="4" fill="var(--mt-bg)" stroke="var(--mt-border)"/>
                    <circle cx="40" cy="40" r="4" fill="#48bb78"/>
                    <rect x="50" y="36" width="60" height="8" rx="4" fill="var(--mt-text-muted)"/>
                    <circle cx="40" cy="60" r="4" fill="var(--mt-primary)"/>
                    <rect x="50" y="56" width="80" height="8" rx="4" fill="var(--mt-text-muted)"/>
                    <circle cx="40" cy="80" r="4" fill="#f56565"/>
                    <rect x="50" y="76" width="100" height="8" rx="4" fill="var(--mt-text-muted)"/>
                  </svg>
                </div>
              </div>
              <div className="mt-product-content">
                <h3>Maltego Monitor</h3>
                <p>Real-time social media monitoring with AI-powered sentiment analysis to detect and assess potential public safety disruptions and cyber threats.</p>
                <div className="mt-product-features">
                  <span>Real-time</span>
                  <span>Social Media</span>
                  <span>AI Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Enhanced Comparison Table Section */}
      {showComparison && (
        <section className="mt-comparison">
          <div className="mt-container">
            <div className="mt-section-header">
              <h2 className="mt-section-title">Compare our Plans</h2>
              <p className="mt-section-subtitle">Find the perfect plan for your investigative needs</p>
            </div>
            
            <div className="mt-comparison-table-wrapper">
              <table className="mt-comparison-table">
                <thead>
                  <tr>
                    <th className="mt-feature-header">Features</th>
                    <th className="mt-plan-header">
                      <div className="mt-plan-name">Basic</div>
                      <div className="mt-plan-price">Free</div>
                    </th>
                    <th className="mt-plan-header">
                      <div className="mt-plan-name">Entry</div>
                      <div className="mt-plan-price">€3,000/year</div>
                    </th>
                    <th className="mt-plan-header mt-featured">
                      <div className="mt-plan-name">Professional</div>
                      <div className="mt-plan-price">€7,500/year</div>
                    </th>
                    <th className="mt-plan-header">
                      <div className="mt-plan-name">Enterprise</div>
                      <div className="mt-plan-price">Custom</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="mt-feature-category">
                    <td colspan="5"><strong>Core Products</strong></td>
                  </tr>
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
                    <td className="mt-feature-name">Maltego Search (OSINT lookups)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Unlimited</div>
                    </td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Unlimited</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Graph (Full Version)</td>
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
                    <td className="mt-feature-name">Hunchly (Web capture)</td>
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
                  <tr className="mt-feature-category">
                    <td colspan="5"><strong>Data & Credits</strong></td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Credits</td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">200</div>
                    </td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">10,000</div>
                    </td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">20,000</div>
                    </td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Flexible</div>
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
                    <td className="mt-feature-name">Premium data connectors</td>
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
                  <tr className="mt-feature-category">
                    <td colspan="5"><strong>Advanced Features</strong></td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Monitor (Social media monitoring)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Optional</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Evidence (Data preservation)</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Optional</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Multi-user collaboration</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">—</td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Up to 5 users</div>
                    </td>
                    <td className="mt-feature-cell">
                      <div className="mt-feature-value">Unlimited</div>
                    </td>
                  </tr>
                  <tr className="mt-feature-category">
                    <td colspan="5"><strong>Support & Training</strong></td>
                  </tr>
                  <tr>
                    <td className="mt-feature-name">Maltego Academy access</td>
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
                    <td className="mt-feature-name">Standard support</td>
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
                  <tr>
                    <td className="mt-feature-name">Dedicated customer success manager</td>
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

      {/* FAQ Section */}
      {showFAQ && (
        <section className="mt-faq">
        <div className="mt-container">
          <div className="mt-section-header">
            <h2 className="mt-section-title">Frequently Asked Questions</h2>
            <p className="mt-section-subtitle">Find answers to common questions about Maltego pricing and plans</p>
          </div>
          
          <div className="mt-faq-grid">
            <div className="mt-faq-item">
              <h3 className="mt-faq-question">What is Maltego?</h3>
              <p className="mt-faq-answer">Maltego is the all-in-one investigation platform that accelerates complex cyber investigations from hours to minutes. The platform powers quick OSINT investigations for digital profiling with Maltego Search as well as complex link analysis for large datasets with Maltego Graph.</p>
            </div>

            <div className="mt-faq-item">
              <h3 className="mt-faq-question">How do Maltego Credits work?</h3>
              <p className="mt-faq-answer">Maltego Credits are used to access premium data sources and run transforms. Different transforms consume different amounts of credits based on the data source and complexity. Credits reset monthly with your subscription.</p>
            </div>

            <div className="mt-faq-item">
              <h3 className="mt-faq-question">Can I upgrade or downgrade my plan?</h3>
              <p className="mt-faq-answer">Yes, you can upgrade your plan at any time. For downgrades or custom arrangements, please contact our support team who will help you find the best solution for your needs.</p>
            </div>

            <div className="mt-faq-item">
              <h3 className="mt-faq-question">What's the difference between Professional and Enterprise?</h3>
              <p className="mt-faq-answer">Professional is designed for individuals and small teams (up to 5 users), while Enterprise offers unlimited users, flexible credit allowances, optional Maltego Monitor and Evidence add-ons, plus premium support and training.</p>
            </div>

            <div className="mt-faq-item">
              <h3 className="mt-faq-question">Do you offer government or educational discounts?</h3>
              <p className="mt-faq-answer">Yes, we offer special pricing for government agencies, law enforcement, and educational institutions. Register with an official government or educational email to be considered for special pricing and upgrades.</p>
            </div>

            <div className="mt-faq-item">
              <h3 className="mt-faq-question">What data sources are included?</h3>
              <p className="mt-faq-answer">Maltego provides access to over 100 data sources including social media, dark web data, identity databases, breach data, and commercial datasets. Higher plans include unlimited access to premium commercial data sources.</p>
            </div>
          </div>
          
          <div className="mt-faq-footer">
            <p>Have more questions? <a href="#" className="mt-link">Contact our support team</a> or visit our <a href="#" className="mt-link">documentation center</a>.</p>
          </div>
        </div>
      </section>
      )}
    </div>
  )
}

export default MaltegoTest