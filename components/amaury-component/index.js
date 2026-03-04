const React = require("react")
const { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, useLimioContext, groupOffers } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const packageData = require("./package.json")
const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const LimioLanding = () => {
  const props = useComponentProps(defaultProps)
  const { 
    heroHeadline, 
    heroSubheadline, 
    heroCta,
    pricingHeadline,
    pricingSubheadline,
    trustHeadline,
    socialProofText,
    primaryColor__limio_color,
    secondaryColor__limio_color,
    showGroupSwitcher,
    groupLabels,
    featureHeadline,
    featureSubheadline,
    statsHeadline,
    statsSubheadline
  } = props

  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext()
  
  // Safe initialization of activeGroup
  const safeGroupLabels = Array.isArray(groupLabels) ? groupLabels : []
  const defaultGroupId = safeGroupLabels.length > 0 ? safeGroupLabels[0].id : 'monthly'
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

  const features = [
    {
      title: "Self-Service",
      description: "Pricing pages, checkout, account management - all no-code. Customers buy, upgrade, and manage themselves.",
      icon: "self-service"
    },
    {
      title: "Sales-Assisted", 
      description: "Guided quoting inside Salesforce. Quotes become live checkout links - T&Cs, payment, and provisioning handled in one step.",
      icon: "sales-assisted"
    },
    {
      title: "Indirect & Partner Sales",
      description: "Partners sell through branded portals with your pricing rules, approval workflows, and margins baked in.",
      icon: "partner"
    },
    {
      title: "Agent-Led",
      description: "Deploy AI selling agents that surface the right offer, answer buyer questions, and complete checkout.",
      icon: "agent"
    }
  ]

  const stats = [
    { value: "+13.9%", label: "Checkout conversion lift" },
    { value: "+7.3%", label: "Revenue per cart with upsells" },
    { value: "5-10x", label: "Faster pricing launches" }
  ]

  const testimonials = [
    {
      quote: "Limio transformed how we handle pricing changes. What used to take weeks now happens in hours.",
      name: "Sarah Chen",
      role: "VP Revenue Operations",
      company: "TechCorp"
    },
    {
      quote: "The no-code approach means our commercial team can iterate without engineering bottlenecks.",
      name: "Mike Johnson", 
      role: "Chief Revenue Officer",
      company: "SaaS Startup"
    },
    {
      quote: "Partner onboarding went from months to days. The ROI was immediate.",
      name: "Lisa Rodriguez",
      role: "Partner Operations Lead", 
      company: "Enterprise SaaS"
    }
  ]

  return (
    <div 
      className="ll-wrapper"
      style={{ 
        "--ll-primary": primaryColor__limio_color || "#d14424",
        "--ll-secondary": secondaryColor__limio_color || "#f47c24",
        "--ll-contrast": getContrastColor(primaryColor__limio_color || "#d14424")
      }}
    >
      {/* Hero Section */}
      <section className="ll-hero">
        <div className="ll-container">
          <div className="ll-hero-content">
            <h1 className="ll-hero-headline">{heroHeadline}</h1>
            <p className="ll-hero-subheadline">{heroSubheadline}</p>
            <button className="ll-btn ll-btn-primary ll-hero-cta" type="button">
              {heroCta}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ll-features">
        <div className="ll-container">
          <div className="ll-section-header">
            <h2 className="ll-section-title">{featureHeadline}</h2>
            <p className="ll-section-subtitle">{featureSubheadline}</p>
          </div>
          <div className="ll-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="ll-feature-card">
                <div className="ll-feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="ll-feature-title">{feature.title}</h3>
                <p className="ll-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="ll-pricing">
        <div className="ll-container">
          <div className="ll-section-header">
            <h2 className="ll-section-title">{pricingHeadline}</h2>
            <p className="ll-section-subtitle">{pricingSubheadline}</p>
          </div>
          
          {showGroupSwitcher && safeGroupLabels.length > 1 && (
            <div className="ll-group-switcher">
              {safeGroupLabels.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`ll-group-btn ${activeGroup === group.id ? 'll-group-btn-active' : ''}`}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="ll-pricing-grid">
            {currentOffers.map((offer, index) => {
              const attributes = offer?.data?.attributes || {}
              const isFeatured = attributes.best_value__limio
              
              return (
                <div key={offer?.id || index} className={`ll-pricing-card ${isFeatured ? 'll-pricing-card-featured' : ''}`}>
                  {isFeatured && (
                    <div className="ll-pricing-badge">
                      {attributes.badge_text__limio || 'Most Popular'}
                    </div>
                  )}
                  
                  <div className="ll-pricing-header">
                    <h3 className="ll-pricing-title">
                      {attributes.display_name__limio || 'Plan'}
                    </h3>
                    <div className="ll-pricing-price">
                      <div dangerouslySetInnerHTML={{ __html: attributes.display_price__limio || '$0' }} />
                    </div>
                    {attributes.detailed_display_price__limio && (
                      <div className="ll-pricing-detail" dangerouslySetInnerHTML={{ __html: attributes.detailed_display_price__limio }} />
                    )}
                  </div>

                  {attributes.offer_features__limio && (
                    <div className="ll-pricing-features" dangerouslySetInnerHTML={{ __html: attributes.offer_features__limio }} />
                  )}

                  <button
                    type="button"
                    className={`ll-btn ${isFeatured ? 'll-btn-primary' : 'll-btn-secondary'} ll-pricing-cta`}
                    onClick={() => handleAddToBasket(offer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? 'Adding...' : (attributes.cta_text__limio || 'Get Started')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="ll-stats">
        <div className="ll-container">
          <div className="ll-section-header">
            <h2 className="ll-section-title">{statsHeadline}</h2>
            <p className="ll-section-subtitle">{statsSubheadline}</p>
          </div>
          <div className="ll-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="ll-stat-card">
                <div className="ll-stat-value">{stat.value}</div>
                <div className="ll-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="ll-testimonials">
        <div className="ll-container">
          <div className="ll-section-header">
            <h2 className="ll-section-title">{trustHeadline}</h2>
            <p className="ll-section-subtitle">{socialProofText}</p>
          </div>
          <div className="ll-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="ll-testimonial-card">
                <div className="ll-testimonial-quote">"{testimonial.quote}"</div>
                <div className="ll-testimonial-author">
                  <div className="ll-testimonial-avatar">
                    <div className="ll-testimonial-initials">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="ll-testimonial-info">
                    <div className="ll-testimonial-name">{testimonial.name}</div>
                    <div className="ll-testimonial-role">{testimonial.role}</div>
                    <div className="ll-testimonial-company">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

module.exports = LimioLanding
module.exports.default = LimioLanding