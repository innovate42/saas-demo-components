import React, { useState, useMemo } from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, sanitiseHTML } from "@limio/sdk"
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

const SugarCRMPricing = () => {
  const props = useComponentProps(defaultProps)
  const {
    headerHeadline,
    headerSubheadline,
    showCurrencySelector,
    defaultCurrency,
    testimonialHeadline,
    testimonialSubheadline,
    showTestimonials,
    testimonials,
    faqHeadline,
    faqSubheadline,
    primaryColor__limio_color,
    secondaryColor__limio_color,
    showLogos,
    customerLogos
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency)
  const [openFaq, setOpenFaq] = useState(null)

  const currencies = [
    { code: "USD", symbol: "$", label: "USD $" },
    { code: "GBP", symbol: "£", label: "GBP £" },
    { code: "EUR", symbol: "€", label: "EUR €" }
  ]

  // Get all available currencies from offers
  const availableCurrencies = useMemo(() => {
    const safeOffers = Array.isArray(offers) ? offers : []
    const currenciesFromOffers = new Set()
    
    safeOffers.forEach(offer => {
      const priceArray = offer?.data?.attributes?.price__limio
      if (Array.isArray(priceArray)) {
        priceArray.forEach(price => {
          if (price?.currencyCode) {
            currenciesFromOffers.add(price.currencyCode)
          }
        })
      }
    })
    
    // Always show all currencies in selector, but mark which ones have offers
    return currencies.map(currency => ({
      ...currency,
      hasOffers: currenciesFromOffers.has(currency.code)
    }))
  }, [offers])

  // Filter offers by selected currency
  const filteredOffers = useMemo(() => {
    const safeOffers = Array.isArray(offers) ? offers : []
    
    return safeOffers.filter(offer => {
      const priceArray = offer?.data?.attributes?.price__limio
      if (!Array.isArray(priceArray)) return false
      
      // Check if offer has a price in the selected currency
      return priceArray.some(price => price?.currencyCode === selectedCurrency)
    })
  }, [offers, selectedCurrency])

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

  const faqItems = [
    {
      question: "What's the difference between the pricing tiers?",
      answer: "Each tier builds upon the previous with additional features. Standard includes core CRM functionality, Advanced adds AI capabilities and enhanced support, while Enterprise provides advanced analytics and premium support."
    },
    {
      question: "Is there a minimum user requirement?",
      answer: "Yes, all plans require a minimum of 15 users to get started. This ensures optimal collaboration and value from the platform."
    },
    {
      question: "Can I change plans later?", 
      answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 30-day free trial with full access to features so you can evaluate the platform before committing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and can accommodate invoice billing for enterprise customers."
    }
  ]

  return (
    <div 
      className="scp-wrapper"
      style={{
        "--scp-primary": primaryColor__limio_color || "#009cde",
        "--scp-secondary": secondaryColor__limio_color || "#16a7ff", 
        "--scp-primary-contrast": getContrastColor(primaryColor__limio_color || "#009cde")
      }}
    >
      {/* Header Section */}
      <section className="scp-header">
        <div className="scp-container">
          <div className="scp-header-content">
            <h1 className="scp-header-headline">{headerHeadline}</h1>
            <p className="scp-header-subheadline">{headerSubheadline}</p>
            
            {showCurrencySelector && (
              <div className="scp-currency-selector">
                {currencies.map(currency => {
                  const currencyWithOffers = availableCurrencies.find(c => c.code === currency.code)
                  const hasOffers = currencyWithOffers?.hasOffers || false
                  
                  return (
                    <button
                      key={currency.code}
                      type="button"
                      className={`scp-currency-btn ${selectedCurrency === currency.code ? 'scp-currency-btn-active' : ''} ${!hasOffers ? 'scp-currency-btn-disabled' : ''}`}
                      onClick={() => setSelectedCurrency(currency.code)}
                      disabled={!hasOffers}
                      title={!hasOffers ? `No offers available in ${currency.code}` : undefined}
                    >
                      {currency.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="scp-pricing">
        <div className="scp-container">
          {filteredOffers.length > 0 ? (
            <div className="scp-pricing-grid">
              {filteredOffers.map((offer, index) => {
                const attributes = offer?.data?.attributes || {}
                const isFeatured = attributes.best_value__limio
                
                return (
                  <div key={offer?.id || index} className={`scp-pricing-card ${isFeatured ? 'scp-pricing-card-featured' : ''}`}>
                    {isFeatured && (
                      <div className="scp-pricing-badge">
                        {attributes.badge_text__limio || 'Most Popular'}
                      </div>
                    )}
                    
                    <div className="scp-pricing-header">
                      <h3 className="scp-pricing-title">
                        {attributes.display_name__limio || 'Plan'}
                      </h3>
                      
                      <div className="scp-pricing-price">
                        <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio || '$0') }} />
                      </div>
                      
                      {attributes.detailed_display_price__limio && (
                        <div className="scp-pricing-detail" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                      )}
                    </div>

                    {attributes.offer_features__limio && (
                      <div className="scp-pricing-features">
                        <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                      </div>
                    )}

                    <div className="scp-pricing-footer">
                      <button
                        type="button"
                        className={`scp-btn ${isFeatured ? 'scp-btn-primary' : 'scp-btn-secondary'} scp-pricing-cta`}
                        onClick={() => handleAddToBasket(offer)}
                        disabled={basketLoading}
                      >
                        {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Started')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="scp-no-offers">
              <p>No offers available for {selectedCurrency}</p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Logos */}
      {showLogos && Array.isArray(customerLogos) && customerLogos.length > 0 && (
        <section className="scp-logos">
          <div className="scp-container">
            <div className="scp-logos-grid">
              {customerLogos.map((logo, index) => (
                <div key={index} className="scp-logo-item">
                  <img src={logo.logoUrl} alt={logo.name} className="scp-logo-image" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {showTestimonials && Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="scp-testimonials">
          <div className="scp-container">
            <div className="scp-section-header">
              <h2 className="scp-section-title">{testimonialHeadline}</h2>
              <p className="scp-section-subtitle">{testimonialSubheadline}</p>
            </div>
            
            <div className="scp-testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="scp-testimonial-card">
                  <div className="scp-testimonial-quote">"{testimonial.quote}"</div>
                  
                  <div className="scp-testimonial-author">
                    {testimonial.logo && (
                      <img src={testimonial.logo} alt={testimonial.company} className="scp-testimonial-logo" />
                    )}
                    <div className="scp-testimonial-info">
                      {testimonial.name && (
                        <div className="scp-testimonial-name">{testimonial.name}</div>
                      )}
                      {testimonial.role && (
                        <div className="scp-testimonial-role">{testimonial.role}</div>
                      )}
                      {testimonial.company && (
                        <div className="scp-testimonial-company">{testimonial.company}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="scp-faq">
        <div className="scp-container">
          <div className="scp-section-header">
            <h2 className="scp-section-title">{faqHeadline}</h2>
            <p className="scp-section-subtitle">{faqSubheadline}</p>
          </div>
          
          <div className="scp-faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="scp-faq-item">
                <button
                  type="button"
                  className="scp-faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <svg 
                    className={`scp-faq-icon ${openFaq === index ? 'scp-faq-icon-open' : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {openFaq === index && (
                  <div className="scp-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SugarCRMPricing