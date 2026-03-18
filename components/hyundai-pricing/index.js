import React, { useState } from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, useLimioContext, groupOffers } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#ffffff"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
}

const ChevronDownIcon = () => (
  <svg className="hp-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg className="hp-check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const HyundaiPricing = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroTitle,
    heroSubtitle,
    heroImage,
    sectionTitle,
    sectionSubtitle,
    showGroupSwitcher,
    groupLabels,
    primaryColor__limio_color,
    accentColor__limio_color,
    ctaText,
    features,
    faqTitle,
    faqItems
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  // Safe initialization
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'monthly'
  const [activeGroup, setActiveGroup] = useState(defaultGroupId)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  
  // Safe grouping of offers
  const safeOffers = Array.isArray(offers) ? offers : []
  const groupedOffers = groupOffers(safeOffers, safeGroupLabels)
  const currentOffers = groupedOffers.find(g => g.groupId === activeGroup)?.offers || safeOffers
  
  const safeFeatures = Array.isArray(features) ? features : []
  const safeFaqItems = Array.isArray(faqItems) ? faqItems : []
  
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

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div 
      className="hp-wrapper"
      style={{ 
        "--hp-primary": primaryColor__limio_color || "#002c5f",
        "--hp-accent": accentColor__limio_color || "#0080ff",
        "--hp-contrast": getContrastColor(primaryColor__limio_color || "#002c5f")
      }}
    >
      {/* Hero Banner */}
      <section className="hp-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hp-hero-overlay">
          <div className="hp-hero-content">
            <h1 className="hp-hero-title">{heroTitle}</h1>
            <p className="hp-hero-subtitle">{heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Section Header */}
      <section className="hp-section hp-section-intro">
        <div className="hp-container">
          <div className="hp-intro-content">
            <h2 className="hp-intro-title">{sectionTitle}</h2>
            <p className="hp-intro-subtitle">{sectionSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {safeFeatures.length > 0 && (
        <section className="hp-section hp-features-section">
          <div className="hp-container">
            <div className="hp-features-grid">
              {safeFeatures.map((feature, index) => (
                <div key={index} className="hp-feature-card">
                  <div className="hp-feature-icon">
                    <CheckIcon />
                  </div>
                  <h3 className="hp-feature-title">{feature.title}</h3>
                  <p className="hp-feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="hp-section hp-pricing-section">
        <div className="hp-container">
          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="hp-toggle-wrapper">
              <div className="hp-toggle">
                {safeGroupLabels.map(group => (
                  <button
                    key={group.id}
                    type="button"
                    className={`hp-toggle-btn ${activeGroup === group.id ? 'hp-toggle-btn-active' : ''}`}
                    onClick={() => setActiveGroup(group.id)}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="hp-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isFeatured = attributes.best_value__limio
              
              return (
                <div key={offer?.id || index} className={`hp-card ${isFeatured ? 'hp-card-featured' : ''}`}>
                  {isFeatured && (
                    <div className="hp-badge">
                      {attributes.badge_text__limio || 'Most Popular'}
                    </div>
                  )}
                  
                  <div className="hp-card-header">
                    <h3 className="hp-card-title">
                      {attributes.display_name__limio || 'Plan'}
                    </h3>
                    
                    <div className="hp-price-section">
                      <div 
                        className="hp-price" 
                        dangerouslySetInnerHTML={{ __html: attributes.display_price__limio || '$0' }}
                      />
                      {attributes.detailed_display_price__limio && (
                        <div 
                          className="hp-price-detail" 
                          dangerouslySetInnerHTML={{ __html: attributes.detailed_display_price__limio }}
                        />
                      )}
                    </div>
                  </div>

                  {attributes.offer_features__limio && (
                    <div 
                      className="hp-features" 
                      dangerouslySetInnerHTML={{ __html: attributes.offer_features__limio }}
                    />
                  )}

                  <button
                    type="button"
                    className={`hp-btn ${isFeatured ? 'hp-btn-primary' : 'hp-btn-secondary'}`}
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

      {/* FAQ Section */}
      {safeFaqItems.length > 0 && (
        <section className="hp-section hp-faq-section">
          <div className="hp-container">
            <h2 className="hp-faq-title">{faqTitle}</h2>
            <div className="hp-faq-list">
              {safeFaqItems.map((faq, index) => (
                <div key={index} className="hp-faq-item">
                  <button 
                    className="hp-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon />
                  </button>
                  {openFaqIndex === index && (
                    <div className="hp-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HyundaiPricing