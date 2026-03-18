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

const GenesisLanding = () => {
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

  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'yearly'
  const [activeGroup, setActiveGroup] = React.useState(defaultGroupId)

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
    const pricingSection = document.querySelector('.gn-pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      title: "Remote Control",
      description: "Control your climate, locks, windows, lights and horn remotely from anywhere using the My Genesis App",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Convenience"
    },
    {
      title: "Real-Time Navigation",
      description: "Server-based voice recognition, real-time traffic data with automatic rerouting, and POI search for restaurants, fuel stations and more",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Navigation"
    },
    {
      title: "Safety & Security",
      description: "Emergency SOS call with automatic airbag deployment detection, anti-theft alarm notifications, and driver attention alerts",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Safety"
    },
    {
      title: "Digital Key",
      description: "Use your smartphone as your car key \u2014 leave the keys at home with secure Genesis Digital Key technology",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Innovation"
    },
    {
      title: "Vehicle Management",
      description: "Monthly vehicle health reports, remote diagnostics, driving insights, and over-the-air software updates every six months",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Management"
    },
    {
      title: "Valet Parking Mode",
      description: "Protect your personal data by locking audio, video, navigation and telematics systems when handing your keys to a valet",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Privacy"
    }
  ]

  const benefits = [
    { text: "Complimentary connected services on new Genesis vehicles", icon: "calendar" },
    { text: "My Genesis App for Apple and Android", icon: "phone" },
    { text: "Over-the-air updates every six months", icon: "refresh" },
    { text: "24/7 Genesis Personal Assistance", icon: "star" }
  ]

  const packageTiers = [
    {
      name: "ESSENTIAL",
      description: "Core connectivity",
      price: "Complimentary",
      afterPrice: "Afterwards: \u00a30.99/month or \u00a310/year",
      color: "#AA8453",
      features: ["Real-Time Navigation", "Digital Key", "Vehicle Health Reports", "OTA Software Updates", "Driver Attention Alert"]
    },
    {
      name: "PREMIUM",
      description: "Enhanced experience",
      price: "3 years complimentary",
      afterPrice: "Afterwards: \u00a32.99/month or \u00a329/year",
      color: "#1a1a1a",
      features: ["All Essential features", "Remote Climate & Locks", "Anti-Theft Notifications", "Live Traffic & Rerouting", "Valet Parking Mode"]
    },
    {
      name: "EXCLUSIVE",
      description: "Complete luxury",
      price: "6 months complimentary",
      afterPrice: "Afterwards: \u00a39.99/month or \u00a399/year",
      color: "#4a2c2a",
      features: ["All Premium features", "Genesis Personal Assistance", "Remote Profiling", "Advanced Voice Control", "Premium Concierge Services"]
    }
  ]

  return (
    <div
      className="gn-wrapper"
      style={{
        "--gn-primary": primaryColor__limio_color || "#AA8453",
        "--gn-accent": accentColor__limio_color || "#8B6914",
        "--gn-primary-tint": primaryColor__limio_color ? `color-mix(in srgb, ${primaryColor__limio_color} 8%, white)` : "#f7f2ec",
        "--gn-contrast": getContrastColor(primaryColor__limio_color || "#AA8453")
      }}
    >
      {/* Hero Section */}
      <section className="gn-hero">
        <div className="gn-container">
          <div className="gn-hero-content">
            <div className="gn-hero-text">
              <h1 className="gn-hero-headline">{heroHeadline}</h1>
              <p className="gn-hero-subheadline">{heroSubheadline}</p>

              <div className="gn-hero-benefits">
                {benefits.map((benefit, index) => (
                  <div key={index} className="gn-benefit-item">
                    <div className="gn-benefit-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>

              <button
                className="gn-btn gn-btn-primary gn-hero-cta"
                type="button"
                onClick={scrollToPricing}
              >
                {heroCta}
              </button>
            </div>

            {showVehicleImages && heroImage && (
              <div className="gn-hero-image">
                <img
                  src={heroImage}
                  alt="Genesis Connected Services Dashboard"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Package Overview */}
      <section className="gn-package-overview">
        <div className="gn-container">
          <div className="gn-overview-grid">
            {packageTiers.map((tier, index) => (
              <div key={tier.name} className="gn-overview-card">
                <div className="gn-overview-badge" style={{ backgroundColor: tier.color }}>
                  {tier.name}
                </div>
                <h3 className="gn-overview-title">{tier.description}</h3>
                <div className="gn-overview-price">{tier.price}</div>
                <div className="gn-overview-after">{tier.afterPrice}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gn-features">
        <div className="gn-container">
          <div className="gn-section-header">
            <h2 className="gn-section-title">{featuresHeadline}</h2>
            <p className="gn-section-subtitle">{featuresSubheadline}</p>
          </div>
          <div className="gn-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="gn-feature-card">
                {showVehicleImages && (
                  <div className="gn-feature-image">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                    />
                    <div className="gn-feature-category">{feature.category}</div>
                  </div>
                )}
                <div className="gn-feature-content">
                  <h3 className="gn-feature-title">{feature.title}</h3>
                  <p className="gn-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="gn-pricing">
        <div className="gn-container">
          <div className="gn-section-header">
            <h2 className="gn-section-title">{pricingHeadline}</h2>
            <p className="gn-section-subtitle">{pricingSubheadline}</p>
          </div>

          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="gn-group-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`gn-group-btn ${activeGroup === group.id ? 'gn-group-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="gn-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isPopular = attributes.best_value__limio
              const planType = attributes.display_name__limio?.includes('PREMIUM') ? 'PREMIUM' :
                              attributes.display_name__limio?.includes('EXCLUSIVE') ? 'EXCLUSIVE' : 'ESSENTIAL'
              const tierInfo = packageTiers.find(t => t.name === planType) || packageTiers[0]

              return (
                <div key={offer?.id || index} className={`gn-pricing-card ${isPopular ? 'gn-pricing-card-popular' : ''}`}>
                  <div className="gn-pricing-tier-badge" style={{ backgroundColor: tierInfo.color }}>
                    Genesis {planType}
                  </div>

                  <div className="gn-pricing-header">
                    <h3 className="gn-pricing-title">
                      {attributes.display_name__limio?.replace(' USD', '') || `Genesis ${planType}`}
                    </h3>
                    <div className="gn-pricing-price">
                      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) || tierInfo.price }} />
                    </div>
                    {attributes.detailed_display_price__limio ? (
                      <div className="gn-pricing-detail" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
                    ) : (
                      <div className="gn-pricing-detail">{tierInfo.afterPrice}</div>
                    )}
                  </div>

                  {attributes.upsell_display_description__limio && (
                    <div className="gn-pricing-description" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.upsell_display_description__limio) }} />
                  )}

                  <div className="gn-pricing-features">
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
                    className={`gn-btn ${isPopular ? 'gn-btn-primary' : 'gn-btn-secondary'} gn-pricing-cta`}
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
      <section className="gn-store">
        <div className="gn-container">
          <div className="gn-store-content">
            <div className="gn-store-text">
              <h2 className="gn-store-title">{storeHeadline}</h2>
              <p className="gn-store-subtitle">{storeSubheadline}</p>
              <div className="gn-store-features">
                <div className="gn-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="18" x2="12" y2="18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Remote locks, climate and charging from your phone</span>
                </div>
                <div className="gn-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Real-time vehicle status and driving insights</span>
                </div>
                <div className="gn-store-feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1l8.5 5v6c0 5.55-3.84 10.74-8.5 12-4.66-1.26-8.5-6.45-8.5-12V6L12 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Service scheduling and Genesis Personal Assistance</span>
                </div>
              </div>
            </div>
            {showVehicleImages && (
              <div className="gn-store-image">
                <img
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="My Genesis App Interface"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="gn-trust">
        <div className="gn-container">
          <div className="gn-trust-content">
            <div className="gn-trust-stats">
              <div className="gn-trust-stat">
                <div className="gn-trust-stat-number">24/7</div>
                <div className="gn-trust-stat-label">Genesis Personal Assistance</div>
              </div>
              <div className="gn-trust-stat">
                <div className="gn-trust-stat-number">SOS</div>
                <div className="gn-trust-stat-label">Emergency Call with Airbag Detection</div>
              </div>
              <div className="gn-trust-stat">
                <div className="gn-trust-stat-number">OTA</div>
                <div className="gn-trust-stat-label">Over-the-Air Updates Every 6 Months</div>
              </div>
            </div>

            <div className="gn-trust-badges">
              <div className="gn-trust-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1l8.5 5v6c0 5.55-3.84 10.74-8.5 12-4.66-1.26-8.5-6.45-8.5-12V6L12 1z" fill="currentColor"/>
                </svg>
                <div>
                  <div className="gn-trust-badge-title">Advanced Security & Privacy</div>
                  <div className="gn-trust-badge-text">End-to-end encryption with Valet Parking Mode data protection</div>
                </div>
              </div>
              <div className="gn-trust-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
                <div>
                  <div className="gn-trust-badge-title">Luxury Ownership Experience</div>
                  <div className="gn-trust-badge-text">Concierge-style personal assistance and proactive vehicle care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GenesisLanding
