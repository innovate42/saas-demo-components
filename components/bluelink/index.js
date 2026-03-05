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
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const BluelinkLanding = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline,
    heroSubheadline,
    heroImage,
    heroCta,
    pricingHeadline,
    pricingSubheadline,
    featuresHeadline,
    featuresSubheadline,
    storeHeadline,
    storeSubheadline,
    primaryColor__limio_color,
    accentColor__limio_color,
    showGroupSwitcher,
    groupLabels,
    showVehicleImages
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  // Safe initialization of activeGroup
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'yearly'
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

  const scrollToPricing = () => {
    const pricingSection = document.querySelector('.bl-pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      title: "Connected Routing",
      description: "Hyundai's cloud-based navigation with real-time traffic updates and smart route optimization for your journey",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Essential"
    },
    {
      title: "Remote Services", 
      description: "Control your Hyundai remotely through the Bluelink app - lock/unlock, climate control, and charging management",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Convenience"
    },
    {
      title: "LIVE Services",
      description: "Real-time traffic visualization, fuel prices, speed cameras, parking availability, weather and sports updates",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Live Data"
    },
    {
      title: "Digital Key",
      description: "Use your smartphone as your car key with secure Hyundai Digital Key technology",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Innovation"
    },
    {
      title: "Voice Recognition",
      description: "Advanced online voice recognition for hands-free control, navigation, and infotainment interaction",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Interaction"
    },
    {
      title: "Music Streaming",
      description: "Access to premium music streaming services directly through your Hyundai's infotainment system",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Entertainment"
    }
  ]

  const benefits = [
    { text: "10 years free Bluelink LITE on new vehicles", icon: "calendar" },
    { text: "3 years free Bluelink PLUS on qualifying models", icon: "plus" },
    { text: "6 months free Bluelink PRO trial", icon: "star" },
    { text: "Easy upgrade/downgrade options anytime", icon: "arrows" }
  ]

  const packageTiers = [
    {
      name: "LITE",
      description: "Essential services",
      price: "10-years free",
      afterPrice: "Afterwards: £0.99/month or £10/year",
      color: "#10b981",
      features: ["Connected Routing", "EV Routing & POI", "Digital Key", "Voice Recognition", "Vehicle OTA updates"]
    },
    {
      name: "PLUS", 
      description: "More convenience",
      price: "3 years free",
      afterPrice: "Afterwards: £2.99/month or £29/year",
      color: "#0066cc",
      features: ["All LITE features", "LIVE Traffic & Services", "Remote Services", "Weather & Sports", "Remote Climate Control"]
    },
    {
      name: "PRO",
      description: "Most connectivity", 
      price: "6 months free",
      afterPrice: "Afterwards: £9.99/month or £99/year",
      color: "#7c3aed",
      features: ["All PLUS features", "Music Streaming", "Premium Voice Services", "Advanced Remote Features", "Infotainment OTA updates"]
    }
  ]

  return (
    <div 
      className="bl-wrapper"
      style={{ 
        "--bl-primary": primaryColor__limio_color || "#0066cc",
        "--bl-accent": accentColor__limio_color || "#004499",
        "--bl-primary-tint": primaryColor__limio_color ? `color-mix(in srgb, ${primaryColor__limio_color} 6%, white)` : "#e6f3ff",
        "--bl-contrast": getContrastColor(primaryColor__limio_color || "#0066cc")
      }}
    >
      {/* Hero Section */}
      <section className="bl-hero">
        <div className="bl-container">
          <div className="bl-hero-content">
            <div className="bl-hero-text">
              <h1 className="bl-hero-headline">{heroHeadline}</h1>
              <p className="bl-hero-subheadline">{heroSubheadline}</p>
              
              <div className="bl-hero-benefits">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bl-benefit-item">
                    <div className="bl-benefit-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              <button 
                className="bl-btn bl-btn-primary bl-hero-cta" 
                type="button"
                onClick={scrollToPricing}
              >
                {heroCta}
              </button>
            </div>
            
            {showVehicleImages && heroImage && (
              <div className="bl-hero-image">
                <img 
                  src={heroImage} 
                  alt="Hyundai Bluelink Dashboard Interface"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Package Overview */}
      <section className="bl-package-overview">
        <div className="bl-container">
          <div className="bl-overview-grid">
            {packageTiers.map((tier, index) => (
              <div key={tier.name} className="bl-overview-card">
                <div className="bl-overview-badge" style={{ backgroundColor: tier.color }}>
                  {tier.name}
                </div>
                <h3 className="bl-overview-title">{tier.description}</h3>
                <div className="bl-overview-price">{tier.price}</div>
                <div className="bl-overview-after">{tier.afterPrice}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bl-features">
        <div className="bl-container">
          <div className="bl-section-header">
            <h2 className="bl-section-title">{featuresHeadline}</h2>
            <p className="bl-section-subtitle">{featuresSubheadline}</p>
          </div>
          <div className="bl-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="bl-feature-card">
                {showVehicleImages && (
                  <div className="bl-feature-image">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      loading="lazy"
                    />
                    <div className="bl-feature-category">{feature.category}</div>
                  </div>
                )}
                <div className="bl-feature-content">
                  <h3 className="bl-feature-title">{feature.title}</h3>
                  <p className="bl-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bl-pricing">
        <div className="bl-container">
          <div className="bl-section-header">
            <h2 className="bl-section-title">{pricingHeadline}</h2>
            <p className="bl-section-subtitle">{pricingSubheadline}</p>
          </div>
          
          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="bl-group-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`bl-group-btn ${activeGroup === group.id ? 'bl-group-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="bl-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isPopular = attributes.best_value__limio
              const planType = attributes.display_name__limio?.includes('PLUS') ? 'PLUS' : 
                              attributes.display_name__limio?.includes('PRO') ? 'PRO' : 'LITE'
              const tierInfo = packageTiers.find(t => t.name === planType) || packageTiers[0]
              
              return (
                <div key={offer?.id || index} className={`bl-pricing-card ${isPopular ? 'bl-pricing-card-popular' : ''}`}>
                  <div className="bl-pricing-tier-badge" style={{ backgroundColor: tierInfo.color }}>
                    Bluelink {planType}
                  </div>
                  
                  <div className="bl-pricing-header">
                    <h3 className="bl-pricing-title">
                      {attributes.display_name__limio?.replace(' USD', '') || `Bluelink ${planType}`}
                    </h3>
                    <div className="bl-pricing-price">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) || tierInfo.price }} />
                    </div>
                    {attributes.detailed_display_price__limio ? (
                      <div className="bl-pricing-detail" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                    ) : (
                      <div className="bl-pricing-detail">{tierInfo.afterPrice}</div>
                    )}
                  </div>

                  {attributes.upsell_display_description__limio && (
                    <div className="bl-pricing-description" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.upsell_display_description__limio) }} />
                  )}

                  <div className="bl-pricing-features">
                    {attributes.offer_features__limio ? (
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
                    ) : (
                      <ul>
                        {tierInfo.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`bl-btn ${isPopular ? 'bl-btn-primary' : 'bl-btn-secondary'} bl-pricing-cta`}
                    onClick={() => handleAddToBasket(offer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Subscribe Now')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="bl-store">
        <div className="bl-container">
          <div className="bl-store-content">
            <div className="bl-store-text">
              <h2 className="bl-store-title">{storeHeadline}</h2>
              <p className="bl-store-subtitle">{storeSubheadline}</p>
              <div className="bl-store-features">
                <div className="bl-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Easy package selection and customization</span>
                </div>
                <div className="bl-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Instant activation and immediate access</span>
                </div>
                <div className="bl-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Seamless integration with your Hyundai</span>
                </div>
              </div>
            </div>
            {showVehicleImages && (
              <div className="bl-store-image">
                <img 
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Hyundai Digital Store Interface"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bl-trust">
        <div className="bl-container">
          <div className="bl-trust-content">
            <div className="bl-trust-stats">
              <div className="bl-trust-stat">
                <div className="bl-trust-stat-number">10+</div>
                <div className="bl-trust-stat-label">Years of Connected Car Innovation</div>
              </div>
              <div className="bl-trust-stat">
                <div className="bl-trust-stat-number">5M+</div>
                <div className="bl-trust-stat-label">Connected Hyundai Vehicles Worldwide</div>
              </div>
              <div className="bl-trust-stat">
                <div className="bl-trust-stat-number">24/7</div>
                <div className="bl-trust-stat-label">Customer Support & Assistance</div>
              </div>
            </div>
            
            <div className="bl-trust-badges">
              <div className="bl-trust-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1l8.5 5v6c0 5.55-3.84 10.74-8.5 12-4.66-1.26-8.5-6.45-8.5-12V6L12 1z" fill="currentColor"/>
                </svg>
                <div>
                  <div className="bl-trust-badge-title">Industry-Leading Security</div>
                  <div className="bl-trust-badge-text">Advanced encryption & privacy protection</div>
                </div>
              </div>
              <div className="bl-trust-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
                <div>
                  <div className="bl-trust-badge-title">Award-Winning Technology</div>
                  <div className="bl-trust-badge-text">Recognized for innovation & reliability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BluelinkLanding